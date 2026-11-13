import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { prepararRegistro, criarGravador } from '../aplicacao/registro.ts';
import { lerConfiguracao } from '../aplicacao/configuracao.ts';

const codigo = '10000000-0000-4000-8000-000000000001';
const dados = { nome: ' Cliente fictício ', telefone: '(11) 99999-9999', modalidade: 'retirada', pagamento: 'pix', logradouro: 'Endereço anterior', numero: '1', bairro: 'Centro', cidade: 'Exemplo', complemento: '', observacoes: '' };
const itens = [{ tipo: 'bebida', bebida: 'suco-uva', quantidade: 2 }];
const confirmado = { identificador: codigo, criado_em: '2026-11-13T15:00:00Z', atendente: 'exemplo', dados, itens: [{ produto: itens[0], descricao: 'Suco de uva', precoBase: 900, precoAdicionais: 0, precoUnitario: 900, subtotal: 1800 }], subtotal: 1800, taxa: 0, total: 1800 };

testar('configuração ausente mantém a gravação desligada e rejeita chaves privilegiadas', () => {
  verificar.equal(lerConfiguracao({}), null);
  verificar.deepEqual(lerConfiguracao({ VITE_SUPABASE_URL: 'https://exemplo.supabase.co', VITE_SUPABASE_CHAVE_PUBLICA: 'sb_publishable_exemplo' }), { endereco: 'https://exemplo.supabase.co', chavePublica: 'sb_publishable_exemplo' });
  for (const chave of ['', 'sb_secret_exemplo', 'service_role', 'sb_publishable_substitua']) verificar.throws(() => lerConfiguracao({ VITE_SUPABASE_URL: 'https://exemplo.supabase.co', VITE_SUPABASE_CHAVE_PUBLICA: chave }));
  for (const url of ['http://exemplo.supabase.co', 'https://usuario:senha@exemplo.supabase.co', 'https://exemplo.supabase.co/caminho']) verificar.throws(() => lerConfiguracao({ VITE_SUPABASE_URL: url, VITE_SUPABASE_CHAVE_PUBLICA: 'sb_publishable_exemplo' }));
});

testar('registro normaliza dados, remove endereço da retirada e copia os itens', () => {
  const registro = prepararRegistro(codigo, dados, itens);
  verificar.equal(registro.dados.nome, 'Cliente fictício');
  verificar.equal(registro.dados.logradouro, '');
  verificar.equal(registro.totalPrevisto, 1800);
  registro.itens[0].quantidade = 8;
  verificar.equal(itens[0].quantidade, 2);
  verificar.equal(dados.logradouro, 'Endereço anterior');
  verificar.throws(() => prepararRegistro(codigo, { ...dados, nome: '' }, itens));
  verificar.throws(() => prepararRegistro(codigo, dados, []));
  verificar.throws(() => prepararRegistro(codigo, dados, Array(101).fill(itens[0])));
});

testar('falha preserva o código para repetir e não vira confirmação de sucesso', async () => {
  const recebidas = [];
  const gravador = criarGravador(async solicitacao => {
    recebidas.push(solicitacao);
    if (recebidas.length === 1) throw new Error('Conexão perdida');
    return confirmado;
  }, () => codigo);
  await verificar.rejects(gravador.salvar(dados, itens), /Conexão perdida/);
  verificar.equal(gravador.obterCodigo(), codigo);
  verificar.equal((await gravador.salvar(dados, itens)).identificador, codigo);
  verificar.deepEqual(recebidas[0], recebidas[1]);
  await verificar.rejects(gravador.salvar(dados, itens), /já gravado/);
});

testar('resposta vazia ou de outro código não confirma a gravação', async () => {
  for (const resposta of [null, {}, { ...confirmado, identificador: 'outro' }, { ...confirmado, total: 1.5 }]) {
    const gravador = criarGravador(async () => resposta, () => codigo);
    await verificar.rejects(gravador.salvar(dados, itens));
    verificar.equal(gravador.obterCodigo(), codigo);
  }
});

testar('envios simultâneos são impedidos e novo pedido exige terminar o anterior', async () => {
  let resolver;
  const gravador = criarGravador(() => new Promise(concluir => { resolver = concluir; }), () => codigo);
  const envio = gravador.salvar(dados, itens);
  await verificar.rejects(gravador.salvar(dados, itens), /andamento/);
  verificar.throws(() => gravador.reiniciar(), /Aguarde/);
  resolver(confirmado);
  await envio;
  gravador.reiniciar();
});
