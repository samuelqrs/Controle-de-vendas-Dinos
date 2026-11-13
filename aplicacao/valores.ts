import { sabores, bebidas, adicionais } from './cardapio.ts';
import { validarItem } from './pedido.ts';
import type { ItemPedido } from './pedido.ts';

export const taxaEntrega = 500;

export type ValoresItem = {
  precoBase: number;
  precoAdicionais: number;
  precoUnitario: number;
  subtotal: number;
};

export function calcularItem(item: ItemPedido): ValoresItem {
  const erros = validarItem(item);
  if (erros.length) throw new Error(erros.join(' '));
  const precoBase = item.tipo === 'pizza'
    ? Math.max(...item.sabores.map(id => sabores.find(sabor => sabor.identificador === id)!.precos[item.tamanho]))
    : bebidas.find(bebida => bebida.identificador === item.bebida)!.preco;
  const precoAdicionais = item.tipo === 'pizza'
    ? item.adicionais.reduce((soma, id) => soma + adicionais.find(adicional => adicional.identificador === id)!.preco, 0)
    : 0;
  const precoUnitario = precoBase + precoAdicionais;
  return { precoBase, precoAdicionais, precoUnitario, subtotal: precoUnitario * item.quantidade };
}

export function calcularPedido(itens: ItemPedido[], modalidade: string): { subtotal: number; taxa: number; total: number } {
  if (modalidade !== 'entrega' && modalidade !== 'retirada') throw new Error('Escolha entrega ou retirada para calcular o pedido.');
  const subtotal = itens.reduce((soma, item) => soma + calcularItem(item).subtotal, 0);
  const taxa = modalidade === 'entrega' && itens.length > 0 ? taxaEntrega : 0;
  return { subtotal, taxa, total: subtotal + taxa };
}
