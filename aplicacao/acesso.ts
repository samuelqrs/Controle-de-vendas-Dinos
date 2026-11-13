import { criarBanco } from './banco.ts';
import type { Banco } from './banco.ts';

let bancoConfigurado: Banco | null = null;
let avisoConfiguracao = 'Gravação indisponível: o Supabase ainda não foi configurado neste ambiente.';
try { bancoConfigurado = criarBanco(import.meta.env, sessionStorage); }
catch { avisoConfiguracao = 'Configuração do Supabase inválida. Confira o arquivo de configuração conforme o README.'; }
export const banco = bancoConfigurado;

const secao = document.createElement('section');
secao.id = 'secao-acesso';
secao.className = 'secao-cardapio';
secao.setAttribute('aria-labelledby', 'titulo-acesso');
secao.innerHTML = `<h2 id="titulo-acesso">Acesso do atendente</h2>
  <p>Entre com uma conta autorizada para gravar ou conferir pedidos no banco compartilhado.</p>
  <form id="entrar-atendente"><div class="campos-pedido">
    <label>E-mail do atendente<input type="email" name="email" required autocomplete="username"></label>
    <label>Senha<input type="password" name="senha" required autocomplete="current-password"></label>
  </div><button type="submit">Entrar</button></form>
  <div class="acoes"><button type="button" id="verificar-acesso">Verificar acesso</button><button type="button" id="sair-atendente" hidden>Sair e limpar tela</button></div>
  <p id="mensagem-acesso" role="status"></p>
  <form id="consultar-gravacao"><label>Código do pedido<input name="codigo" required spellcheck="false" autocapitalize="off"></label>
    <button type="submit">Conferir gravação por código</button>
  </form><p id="resultado-consulta" role="status"></p>`;
document.querySelector('#secao-pedido')!.before(secao);
const formulario = secao.querySelector<HTMLFormElement>('#entrar-atendente')!;
const mensagem = secao.querySelector<HTMLElement>('#mensagem-acesso')!;
const botaoSair = secao.querySelector<HTMLButtonElement>('#sair-atendente')!;
const consulta = secao.querySelector<HTMLFormElement>('#consultar-gravacao')!;
const resultado = secao.querySelector<HTMLElement>('#resultado-consulta')!;

async function verificarAcesso(): Promise<void> {
  if (!banco) { mensagem.textContent = avisoConfiguracao; return; }
  mensagem.textContent = 'Verificando acesso…';
  try {
    const conta = await banco.obterAcesso();
    mensagem.textContent = conta ? `Acesso autorizado: ${conta}.` : 'Entre para gravar e consultar pedidos.';
    botaoSair.hidden = !conta;
  } catch (erro) {
    mensagem.textContent = erro instanceof Error ? erro.message : 'Não foi possível verificar o acesso.';
    botaoSair.hidden = false;
  }
}

if (!banco) {
  secao.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button').forEach(controle => { controle.disabled = true; });
  mensagem.textContent = avisoConfiguracao;
} else void verificarAcesso();

formulario.addEventListener('submit', async evento => {
  evento.preventDefault();
  if (!banco) return;
  const dados = new FormData(formulario);
  const senha = formulario.elements.namedItem('senha') as HTMLInputElement;
  formulario.inert = true;
  mensagem.textContent = 'Entrando…';
  try {
    await banco.entrar(String(dados.get('email')), String(dados.get('senha')));
    await verificarAcesso();
  } catch (erro) { mensagem.textContent = erro instanceof Error ? erro.message : 'Não foi possível entrar.'; }
  finally { senha.value = ''; formulario.inert = false; }
});
secao.querySelector('#verificar-acesso')!.addEventListener('click', () => { void verificarAcesso(); });
botaoSair.addEventListener('click', async () => {
  if (!banco) return;
  secao.inert = true;
  try {
    await banco.sair();
    formulario.reset();
    consulta.reset();
    resultado.textContent = '';
    document.dispatchEvent(new Event('encerrar-acesso'));
    botaoSair.hidden = true;
    mensagem.textContent = 'Sessão encerrada neste navegador. A tela foi limpa.';
  } catch { mensagem.textContent = 'Não foi possível encerrar a sessão. Tente novamente.'; }
  finally { secao.inert = false; }
});
consulta.addEventListener('submit', async evento => {
  evento.preventDefault();
  if (!banco) return;
  consulta.inert = true;
  resultado.textContent = 'Consultando gravação…';
  try {
    const pedido = await banco.consultar(String(new FormData(consulta).get('codigo')).trim());
    resultado.textContent = `Registro encontrado: ${pedido.identificador}. Data: ${new Date(pedido.criado_em).toLocaleString('pt-BR')}. Total preservado: ${(pedido.total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`;
  } catch (erro) { resultado.textContent = erro instanceof Error ? erro.message : 'Falha de consulta.'; }
  finally { consulta.inert = false; }
});
