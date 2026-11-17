-- Atualização do cardápio oficial confirmado pelo autor em 17/11/2026.
-- Executar após 001. Não altera pedidos existentes nem amplia permissões.
begin;
update interno.cardapio set dados = '{"tamanhos":[{"identificador":"media","nome":"Média","limiteSabores":2},{"identificador":"grande","nome":"Grande","limiteSabores":2}],"sabores":[{"identificador":"margherita","nome":"Margherita","ingredientes":"Molho de tomate, muçarela, rodelas de tomate fresco e manjericão fresco.","precos":{"media":3990,"grande":4990}},{"identificador":"calabresa","nome":"Calabresa","ingredientes":"Calabresa fatiada, cebola roxa, muçarela e orégano.","precos":{"media":4290,"grande":5290}},{"identificador":"portuguesa","nome":"Portuguesa","ingredientes":"Muçarela, presunto, ovos, cebola, ervilha e azeitonas pretas.","precos":{"media":4490,"grande":5490}},{"identificador":"frango","nome":"Frango com Catupiry","ingredientes":"Frango desfiado temperado, catupiry cremoso e orégano.","precos":{"media":4590,"grande":5590}},{"identificador":"carne-seca","nome":"Carne Seca","ingredientes":"Carne seca e queijo coalho.","precos":{"media":4990,"grande":5990}},{"identificador":"romeu-julieta","nome":"Romeu e Julieta","ingredientes":"Muçarela, goiabada cremosa e raspas de queijo parmesão. Somente grande.","precos":{"grande":3990}},{"identificador":"combo-franbacon","nome":"Combo Franbacon + Coca-Cola 2 litros","ingredientes":"Pizza grande de frango desfiado, bacon, muçarela, azeitona e manjericão, acompanhada de uma Coca-Cola de 2 litros. Combo fechado.","precos":{"grande":5990},"exclusivo":true}],"bebidas":[],"adicionais":[],"taxaEntrega":0}'::jsonb where identificador = 1;
create or replace function public.registrar_pedido(p_identificador uuid, p_dados jsonb, p_itens jsonb, p_total_previsto integer)
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
  if p_dados->>'modalidade' <> 'retirada' then raise exception 'Entrega indisponível; escolha retirada'; end if;
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
        if v_sabor is null or v_sabor->'precos'->>(v_item->>'tamanho') is null then raise exception 'Sabor ou tamanho indisponível'; end if;
        if coalesce((v_sabor->>'exclusivo')::boolean, false) and jsonb_array_length(v_item->'sabores') <> 1 then raise exception 'O combo é fechado'; end if;
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
