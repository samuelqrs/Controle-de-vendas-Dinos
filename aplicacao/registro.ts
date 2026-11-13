import { validarPedido } from './pedido.ts';
import { calcularPedido } from './valores.ts';
import type { DadosPedido, ItemPedido } from './pedido.ts';

export type SolicitacaoRegistro = { identificador: string; dados: DadosPedido; itens: ItemPedido[]; totalPrevisto: number };
export type RegistroSalvo = {
  identificador: string;
  criado_em: string;
  atendente: string;
  dados: DadosPedido;
  itens: { produto: ItemPedido; descricao: string; precoBase: number; precoAdicionais: number; precoUnitario: number; subtotal: number }[];
  subtotal: number;
  taxa: number;
  total: number;
};

export function prepararRegistro(identificador: string, dados: DadosPedido, itens: ItemPedido[]): SolicitacaoRegistro {
  const completos = Object.fromEntries(['nome', 'telefone', 'modalidade', 'logradouro', 'numero', 'bairro', 'cidade', 'complemento', 'pagamento', 'observacoes'].map(campo => [campo, String(dados[campo as keyof DadosPedido] ?? '').trim()])) as DadosPedido;
  if (completos.modalidade === 'retirada') {
    for (const campo of ['logradouro', 'numero', 'bairro', 'cidade', 'complemento'] as const) completos[campo] = '';
  }
  const erros = validarPedido(completos, itens);
  if (itens.length > 100) erros.push('O pedido aceita até 100 itens.');
  if (Object.values(completos).some(valor => valor.length > 1000)) erros.push('Cada campo aceita até 1000 caracteres.');
  if (erros.length) throw new Error(erros.join(' '));
  return { identificador, dados: completos, itens: structuredClone(itens), totalPrevisto: calcularPedido(itens, completos.modalidade).total };
}

export function validarConfirmacao(valor: unknown, identificador?: string): RegistroSalvo {
  if (!valor || typeof valor !== 'object') throw new Error('O banco não confirmou a gravação.');
  const registro = valor as RegistroSalvo;
  if (typeof registro.identificador !== 'string' || (identificador && registro.identificador !== identificador)
    || typeof registro.criado_em !== 'string' || !Number.isFinite(Date.parse(registro.criado_em))
    || !Number.isSafeInteger(registro.total) || registro.total < 0 || !Array.isArray(registro.itens) || !registro.itens.length) {
    throw new Error('Resposta inesperada do banco. Consulte o código antes de tentar um novo pedido.');
  }
  const valores = [registro.subtotal, registro.taxa, registro.total];
  if (!registro.dados || typeof registro.atendente !== 'string' || valores.some(valor => !Number.isSafeInteger(valor) || valor < 0)
    || registro.total !== registro.subtotal + registro.taxa
    || registro.itens.some(item => !item?.produto || typeof item.descricao !== 'string' || [item.precoBase, item.precoAdicionais, item.precoUnitario, item.subtotal].some(valor => !Number.isSafeInteger(valor) || valor < 0)
      || !Number.isSafeInteger(item.produto.quantidade) || item.produto.quantidade < 1 || item.produto.quantidade > 99
      || item.precoUnitario !== item.precoBase + item.precoAdicionais || item.subtotal !== item.precoUnitario * item.produto.quantidade)
    || registro.subtotal !== registro.itens.reduce((soma, item) => soma + item.subtotal, 0)) throw new Error('Confirmação inconsistente. Consulte o código antes de tentar um novo pedido.');
  return registro;
}

export function criarGravador(enviar: (solicitacao: SolicitacaoRegistro) => Promise<unknown>, gerarCodigo: () => string = () => crypto.randomUUID()) {
  let identificador = gerarCodigo();
  let emAndamento = false;
  let confirmado = false;
  return {
    obterCodigo: () => identificador,
    reiniciar(): void {
      if (emAndamento) throw new Error('Aguarde a gravação antes de iniciar outro pedido.');
      identificador = gerarCodigo();
      confirmado = false;
    },
    async salvar(dados: DadosPedido, itens: ItemPedido[]): Promise<RegistroSalvo> {
      if (emAndamento) throw new Error('A gravação já está em andamento.');
      if (confirmado) throw new Error('Pedido já gravado. Inicie um novo pedido.');
      const solicitacao = prepararRegistro(identificador, dados, itens);
      emAndamento = true;
      try {
        const registro = validarConfirmacao(await enviar(solicitacao), identificador);
        confirmado = true;
        return registro;
      } finally { emAndamento = false; }
    },
  };
}
