import type { RegistroSalvo } from './registro.ts';
import { formatarPreco } from './cardapio.ts';

export function descreverPedido(pedido: RegistroSalvo): [string, string][] {
  const dados = pedido.dados;
  const pagamento = { dinheiro: 'Dinheiro', pix: 'Pix', cartao: 'Cartão' };
  return [
    ['Código', pedido.identificador],
    ['Data', new Date(pedido.criado_em).toLocaleString('pt-BR')],
    ['Cliente', dados.nome], ['Telefone', dados.telefone],
    ['Modalidade', dados.modalidade === 'entrega' ? 'Entrega' : 'Retirada'],
    ['Endereço', dados.modalidade === 'entrega'
      ? [dados.logradouro, dados.numero, dados.bairro, dados.cidade, dados.complemento].filter(Boolean).join(', ')
      : 'Retirada no balcão'],
    ['Pagamento informado', pagamento[dados.pagamento as keyof typeof pagamento] ?? dados.pagamento],
    ['Observações', dados.observacoes || 'Sem observações.'],
    ...pedido.itens.map((item): [string, string] => [
      `${item.produto.quantidade} × ${item.descricao}`,
      `${formatarPreco(item.precoUnitario)} por unidade · ${formatarPreco(item.subtotal)}`,
    ]),
    ['Subtotal', formatarPreco(pedido.subtotal)], ['Taxa de entrega', formatarPreco(pedido.taxa)],
    ['Total', formatarPreco(pedido.total)],
  ];
}

// Invalida respostas pendentes ao sair ou iniciar uma consulta mais recente.
export function criarConsultaPedidos(listar: (pagina: number) => Promise<RegistroSalvo[]>) {
  let versao = 0;
  return {
    limpar(): void { versao++; },
    async carregar(pagina: number): Promise<RegistroSalvo[] | null> {
      const atual = ++versao;
      try {
        const pedidos = await listar(pagina);
        return atual === versao ? pedidos : null;
      } catch (erro) {
        if (atual !== versao) return null;
        throw erro;
      }
    },
  };
}
