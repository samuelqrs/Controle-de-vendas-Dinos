-- Execute uma vez no projeto Supabase do DINNOS. Não contém credenciais.
begin;
create schema if not exists interno;
revoke all on schema interno from public, anon, authenticated;
create table interno.cardapio (identificador integer primary key check (identificador = 1), dados jsonb not null);
insert into interno.cardapio values (1, '{"tamanhos":[{"identificador":"pequena","nome":"Pequena","diametro":25,"fatias":4,"limiteSabores":1},{"identificador":"media","nome":"Média","diametro":30,"fatias":6,"limiteSabores":2},{"identificador":"grande","nome":"Grande","diametro":35,"fatias":8,"limiteSabores":3}],"sabores":[{"identificador":"mucarela","nome":"Muçarela","ingredientes":"Molho de tomate, muçarela, tomate e orégano.","precos":{"pequena":2800,"media":3800,"grande":4800}},{"identificador":"calabresa","nome":"Calabresa","ingredientes":"Molho de tomate, muçarela, calabresa e cebola.","precos":{"pequena":3000,"media":4200,"grande":5200}},{"identificador":"frango","nome":"Frango com requeijão","ingredientes":"Molho de tomate, muçarela, frango desfiado e requeijão.","precos":{"pequena":3400,"media":4600,"grande":5800}},{"identificador":"quatro-queijos","nome":"Quatro queijos","ingredientes":"Molho de tomate, muçarela, provolone, parmesão e requeijão.","precos":{"pequena":3600,"media":4800,"grande":6200}}],"bebidas":[{"identificador":"refrigerante-cola","nome":"Refrigerante de cola","volume":"2 litros","preco":1200},{"identificador":"refrigerante-guarana","nome":"Refrigerante de guaraná","volume":"350 ml","preco":600},{"identificador":"suco-laranja","nome":"Suco de laranja","volume":"500 ml","preco":900},{"identificador":"suco-uva","nome":"Suco de uva","volume":"500 ml","preco":900}],"adicionais":[{"identificador":"mucarela-extra","nome":"Muçarela extra","preco":600},{"identificador":"bacon","nome":"Bacon","preco":700},{"identificador":"requeijao","nome":"Requeijão","preco":500}],"taxaEntrega":500}'::jsonb);

create table public.atendentes_autorizados (
  identificador uuid primary key references auth.users(id),
  ativo boolean not null default true
);
alter table public.atendentes_autorizados enable row level security;
revoke all on public.atendentes_autorizados from public, anon, authenticated;
grant select on public.atendentes_autorizados to authenticated;
create policy consultar_propria_autorizacao on public.atendentes_autorizados for select to authenticated
  using (identificador = (select auth.uid()) and ativo);

create table public.pedidos (
  identificador uuid primary key,
  criado_em timestamptz not null default now(),
  atendente uuid not null references auth.users(id),
  dados jsonb not null,
  itens jsonb not null check (jsonb_typeof(itens) = 'array' and jsonb_array_length(itens) between 1 and 100),
  subtotal integer not null check (subtotal > 0),
  taxa integer not null check (taxa >= 0),
  total integer not null check (total = subtotal + taxa)
);
alter table public.pedidos enable row level security;
revoke all on public.pedidos from public, anon, authenticated;
grant select on public.pedidos to authenticated;
create policy consultar_pedidos_autorizados on public.pedidos for select to authenticated
  using (exists (select 1 from public.atendentes_autorizados a where a.identificador = (select auth.uid()) and a.ativo));

create function public.registrar_pedido(p_identificador uuid, p_dados jsonb, p_itens jsonb, p_total_previsto integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_usuario uuid := auth.uid();
  v_existente public.pedidos;
  v_catalogo jsonb;
  v_item jsonb;
  v_produto jsonb;
  v_tamanho jsonb;
  v_sabor jsonb;
  v_adicional jsonb;
  v_id text;
  v_quantidade integer;
  v_base integer;
  v_adicionais integer;
  v_subtotal integer := 0;
  v_taxa integer;
  v_descricao text;
  v_nomes text[];
  v_nomes_adicionais text[];
  v_itens jsonb := '[]'::jsonb;
begin
  if v_usuario is null or not exists (select 1 from public.atendentes_autorizados where identificador = v_usuario and ativo) then
    raise exception 'Atendente não autorizado' using errcode = '42501';
  end if;
  if p_identificador is null or jsonb_typeof(p_dados) is distinct from 'object' or jsonb_typeof(p_itens) is distinct from 'array' then raise exception 'Pedido inválido'; end if;
  if jsonb_array_length(p_itens) not between 1 and 100
    or exists (select 1 from jsonb_each(p_dados) where jsonb_typeof(value) <> 'string' or length(value #>> '{}') > 1000)
    or coalesce(trim(p_dados->>'nome'), '') = ''
    or regexp_replace(coalesce(p_dados->>'telefone', ''), '[^0-9]', '', 'g') !~ '^[0-9]{10,11}$'
    or coalesce(p_dados->>'modalidade', '') not in ('entrega', 'retirada')
    or coalesce(p_dados->>'pagamento', '') not in ('dinheiro', 'pix', 'cartao') then raise exception 'Dados obrigatórios inválidos'; end if;
  if p_dados->>'modalidade' = 'entrega' and exists (
    select 1 from unnest(array['logradouro','numero','bairro','cidade']) campo where coalesce(trim(p_dados->>campo), '') = ''
  ) then raise exception 'Endereço obrigatório'; end if;

  -- Repetir o código retorna o original, mesmo se o cardápio mudar depois.
  select * into v_existente from public.pedidos where identificador = p_identificador;
  if found then
    if v_existente.atendente = v_usuario and v_existente.dados = p_dados
      and (select jsonb_agg(value->'produto') from jsonb_array_elements(v_existente.itens)) = p_itens then return to_jsonb(v_existente); end if;
    raise exception 'Código já usado por outro conteúdo. Consulte a gravação.';
  end if;
  select dados into strict v_catalogo from interno.cardapio where identificador = 1;
  for v_item in select value from jsonb_array_elements(p_itens) loop
    if jsonb_typeof(v_item) is distinct from 'object' or jsonb_typeof(v_item->'quantidade') is distinct from 'number'
      or coalesce(v_item->>'quantidade','') !~ '^[0-9]{1,2}$' then raise exception 'Quantidade inválida'; end if;
    v_quantidade := (v_item->>'quantidade')::integer;
    if v_quantidade not between 1 and 99 then raise exception 'Quantidade inválida'; end if;
    v_base := 0; v_adicionais := 0; v_nomes := array[]::text[]; v_nomes_adicionais := array[]::text[];
    if v_item->>'tipo' = 'pizza' then
      select value into v_tamanho from jsonb_array_elements(v_catalogo->'tamanhos') where value->>'identificador' = v_item->>'tamanho';
      if v_tamanho is null or jsonb_typeof(v_item->'sabores') is distinct from 'array' or jsonb_typeof(v_item->'adicionais') is distinct from 'array' then raise exception 'Pizza inválida'; end if;
      if jsonb_array_length(v_item->'sabores') not between 1 and (v_tamanho->>'limiteSabores')::integer
        or (select count(distinct value) from jsonb_array_elements(v_item->'sabores')) <> jsonb_array_length(v_item->'sabores')
        or (select count(distinct value) from jsonb_array_elements(v_item->'adicionais')) <> jsonb_array_length(v_item->'adicionais') then raise exception 'Sabores ou adicionais inválidos'; end if;
      for v_id in select jsonb_array_elements_text(v_item->'sabores') loop
        select value into v_sabor from jsonb_array_elements(v_catalogo->'sabores') where value->>'identificador' = v_id;
        if v_sabor is null then raise exception 'Sabor inválido'; end if;
        v_base := greatest(v_base, (v_sabor->'precos'->>(v_item->>'tamanho'))::integer);
        v_nomes := array_append(v_nomes, v_sabor->>'nome');
      end loop;
      for v_id in select jsonb_array_elements_text(v_item->'adicionais') loop
        select value into v_adicional from jsonb_array_elements(v_catalogo->'adicionais') where value->>'identificador' = v_id;
        if v_adicional is null then raise exception 'Adicional inválido'; end if;
        v_adicionais := v_adicionais + (v_adicional->>'preco')::integer;
        v_nomes_adicionais := array_append(v_nomes_adicionais, v_adicional->>'nome');
      end loop;
      v_descricao := 'Pizza ' || (v_tamanho->>'nome') || ' — ' || array_to_string(v_nomes, ', ') || '. Adicionais: ' || coalesce(nullif(array_to_string(v_nomes_adicionais, ', '), ''), 'nenhum') || '.';
    elsif v_item->>'tipo' = 'bebida' then
      select value into v_produto from jsonb_array_elements(v_catalogo->'bebidas') where value->>'identificador' = v_item->>'bebida';
      if v_produto is null then raise exception 'Bebida inválida'; end if;
      v_base := (v_produto->>'preco')::integer;
      v_descricao := (v_produto->>'nome') || ' · ' || (v_produto->>'volume');
    else raise exception 'Tipo de item inválido'; end if;
    v_subtotal := v_subtotal + (v_base + v_adicionais) * v_quantidade;
    v_itens := v_itens || jsonb_build_array(jsonb_build_object('produto', v_item, 'descricao', v_descricao, 'precoBase', v_base, 'precoAdicionais', v_adicionais, 'precoUnitario', v_base + v_adicionais, 'subtotal', (v_base + v_adicionais) * v_quantidade));
  end loop;
  v_taxa := case when p_dados->>'modalidade' = 'entrega' then (v_catalogo->>'taxaEntrega')::integer else 0 end;
  if p_total_previsto is null or p_total_previsto <> v_subtotal + v_taxa then raise exception 'Os preços mudaram. Atualize o cardápio e confira novamente.'; end if;
  insert into public.pedidos (identificador, atendente, dados, itens, subtotal, taxa, total)
    values (p_identificador, v_usuario, p_dados, v_itens, v_subtotal, v_taxa, v_subtotal + v_taxa) on conflict (identificador) do nothing;
  select * into strict v_existente from public.pedidos where identificador = p_identificador;
  if v_existente.atendente <> v_usuario or v_existente.dados <> p_dados
    or (select jsonb_agg(value->'produto') from jsonb_array_elements(v_existente.itens)) <> p_itens then raise exception 'Código já usado por outro conteúdo'; end if;
  return to_jsonb(v_existente);
end;
$$;
revoke all on function public.registrar_pedido(uuid, jsonb, jsonb, integer) from public, anon;
grant execute on function public.registrar_pedido(uuid, jsonb, jsonb, integer) to authenticated;
commit;
