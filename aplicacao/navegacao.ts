export function identificarTela(fragmento: string): 'inicio' | 'pedidos' | 'relatorios' {
  const destino = fragmento.replace(/^#/, '');
  if (['pedidos', 'secao-pedido'].includes(destino)) return 'pedidos';
  if (['relatorios', 'secao-pedidos-salvos'].includes(destino)) return 'relatorios';
  return 'inicio';
}
