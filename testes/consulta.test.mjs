import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { criarConsultaPedidos, descreverPedido } from '../aplicacao/consulta.ts';

const pedido = {
  identificador: '10000000-0000-4000-8000-000000000001', criado_em: '2026-11-17T15:00:00Z',
  dados: { nome: 'Cliente fictício', telefone: '11999999999', modalidade: 'entrega',
    logradouro: 'Rua Exemplo', numero: '10', bairro: 'Centro', cidade: 'Cidade fictícia',
    complemento: 'Casa', pagamento: 'cartao', observacoes: 'Sem gelo' },
  itens: [{ produto: { tipo: 'bebida', bebida: 'cola', quantidade: 2 }, descricao: 'Descrição histórica',
    precoBase: 750, precoAdicionais: 0, precoUnitario: 750, subtotal: 1500 }],
  subtotal: 1500, taxa: 500, total: 2000,
};

testar('detalhes exibem dados e preços históricos sem recalcular pelo cardápio atual', () => {
  const campos = Object.fromEntries(descreverPedido(pedido));
  verificar.equal(campos.Cliente, 'Cliente fictício');
  verificar.equal(campos.Endereço, 'Rua Exemplo, 10, Centro, Cidade fictícia, Casa');
  verificar.equal(campos['Pagamento informado'], 'Cartão');
  verificar.equal(campos.Observações, 'Sem gelo');
  verificar.match(campos['2 × Descrição histórica'], /7,50.*15,00/);
  verificar.match(campos.Total, /20,00/);
  const retirada = Object.fromEntries(descreverPedido({ ...pedido, dados: { ...pedido.dados, modalidade: 'retirada', observacoes: '' } }));
  verificar.equal(retirada.Endereço, 'Retirada no balcão');
  verificar.equal(retirada.Observações, 'Sem observações.');
});

testar('consulta distingue lista vazia e falha e permite tentar novamente', async () => {
  let falhar = true;
  const consulta = criarConsultaPedidos(async pagina => {
    verificar.equal(pagina, 2);
    if (falhar) throw new Error('Sem conexão');
    return [];
  });
  await verificar.rejects(consulta.carregar(2), /Sem conexão/);
  falhar = false;
  verificar.deepEqual(await consulta.carregar(2), []);
});

testar('sair invalida respostas pendentes e uma consulta nova prevalece sobre a antiga', async () => {
  let responder;
  const consulta = criarConsultaPedidos(() => new Promise(resolver => { responder = resolver; }));
  const pendente = consulta.carregar(0);
  consulta.limpar();
  responder([pedido]);
  verificar.equal(await pendente, null);
  const antiga = consulta.carregar(0);
  const responderAntiga = responder;
  const nova = consulta.carregar(1);
  responder([]);
  verificar.deepEqual(await nova, []);
  responderAntiga([pedido]);
  verificar.equal(await antiga, null);
});

testar('falha de consulta encerrada não altera uma sessão nova', async () => {
  let rejeitar;
  const consulta = criarConsultaPedidos(() => new Promise((_, falhar) => { rejeitar = falhar; }));
  const pendente = consulta.carregar(0);
  consulta.limpar();
  rejeitar(new Error('Sessão antiga'));
  verificar.equal(await pendente, null);
});
