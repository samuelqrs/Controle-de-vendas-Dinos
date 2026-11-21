-- Aplicar após 001 e 002. Não exclui pedidos durante a instalação.
begin;
create function public.excluir_pedido(p_identificador uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.atendentes_autorizados
    where identificador = auth.uid() and ativo
  ) then
    raise exception 'Atendente não autorizado' using errcode = '42501';
  end if;
  if p_identificador is null then raise exception 'Código obrigatório'; end if;
  delete from public.pedidos where identificador = p_identificador;
  return found;
end;
$$;
revoke all on function public.excluir_pedido(uuid) from public, anon, authenticated;
grant execute on function public.excluir_pedido(uuid) to authenticated;
commit;
