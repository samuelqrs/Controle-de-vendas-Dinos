import { tamanhos, sabores, bebidas, adicionais } from './cardapio.ts';
import type { IdentificadorTamanho } from './cardapio.ts';

export type ItemPedido =
  | { tipo: 'pizza'; quantidade: number; tamanho: IdentificadorTamanho; sabores: string[]; adicionais: string[] }
  | { tipo: 'bebida'; quantidade: number; bebida: string };

export type DadosPedido = {
  nome: string;
  telefone: string;
  modalidade: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento: string;
  pagamento: string;
  observacoes: string;
};

export function validarItem(item: ItemPedido): string[] {
  const erros: string[] = [];
  if (!Number.isSafeInteger(item.quantidade) || item.quantidade < 1 || item.quantidade > 99) erros.push('Informe uma quantidade inteira de 1 a 99.');
  if (item.tipo === 'bebida') {
    if (!bebidas.some(bebida => bebida.identificador === item.bebida)) erros.push('Escolha uma bebida do cardápio.');
  } else {
    const tamanho = tamanhos.find(tamanho => tamanho.identificador === item.tamanho);
    if (!tamanho) erros.push('Escolha um tamanho válido.');
    if (!tamanho || item.sabores.length < 1 || item.sabores.length > tamanho.limiteSabores) erros.push('Escolha de 1 até o limite de sabores do tamanho.');
    if (new Set(item.sabores).size !== item.sabores.length || item.sabores.some(id => !sabores.some(sabor => sabor.identificador === id))) erros.push('Escolha sabores válidos, sem repetição.');
    if (new Set(item.adicionais).size !== item.adicionais.length || item.adicionais.some(id => !adicionais.some(adicional => adicional.identificador === id))) erros.push('Escolha adicionais válidos, sem repetição.');
  }
  return erros;
}

export function validarPedido(dados: DadosPedido, itens: ItemPedido[]): string[] {
  const erros: string[] = [];
  if (!dados.nome.trim()) erros.push('Informe o nome do cliente.');
  if (!/^\d{10,11}$/.test(dados.telefone.replace(/\D/g, ''))) erros.push('Informe telefone com DDD e 10 ou 11 dígitos.');
  if (!['entrega', 'retirada'].includes(dados.modalidade)) erros.push('Escolha entrega ou retirada.');
  if (dados.modalidade === 'entrega' && [dados.logradouro, dados.numero, dados.bairro, dados.cidade].some(campo => !campo.trim())) erros.push('Preencha logradouro, número, bairro e cidade para entrega.');
  if (!['dinheiro', 'pix', 'cartao'].includes(dados.pagamento)) erros.push('Escolha uma forma de pagamento.');
  if (!itens.length) erros.push('Inclua pelo menos um item no pedido.');
  return [...erros, ...itens.flatMap(validarItem)];
}
