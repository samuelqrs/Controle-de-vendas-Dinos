import { banco } from './acesso.ts';
import { criarConsultaPedidos, descreverPedido } from './consulta.ts';
import { formatarPreco } from './cardapio.ts';

const secao = document.createElement('section');
secao.id = 'secao-pedidos-salvos';
secao.className = 'secao-cardapio';
secao.setAttribute('aria-labelledby', 'titulo-pedidos-salvos');
secao.innerHTML = `<h2 id="titulo-pedidos-salvos">Relatórios de pedidos</h2>
  <p>Consulte os pedidos mais recentes e abra seus detalhes. O pagamento exibido é o informado no pedido.</p>
  <div class="acoes"><button id="atualizar-pedidos" type="button">Atualizar pedidos</button>
    <button id="pedidos-anteriores" type="button" disabled>Página anterior</button>
    <button id="pedidos-proximos" type="button" disabled>Próxima página</button></div>
  <p id="mensagem-listagem" role="status">Entre com uma conta autorizada e atualize a lista.</p>
  <ul id="lista-pedidos-salvos" class="produtos"></ul>
  <article id="detalhes-pedido-salvo" class="resumo-valores" hidden tabindex="-1" aria-labelledby="titulo-detalhes-pedido">
    <h3 id="titulo-detalhes-pedido">Detalhes do pedido</h3><dl></dl>
  </article>`;
document.querySelector('#tela-relatorios')!.prepend(secao);
const mensagem = secao.querySelector<HTMLElement>('#mensagem-listagem')!;
const lista = secao.querySelector<HTMLElement>('#lista-pedidos-salvos')!;
const detalhes = secao.querySelector<HTMLElement>('#detalhes-pedido-salvo')!;
const atualizar = secao.querySelector<HTMLButtonElement>('#atualizar-pedidos')!;
const anterior = secao.querySelector<HTMLButtonElement>('#pedidos-anteriores')!;
const proxima = secao.querySelector<HTMLButtonElement>('#pedidos-proximos')!;
const controle = criarConsultaPedidos(pagina => banco!.listar(pagina));
let paginaAtual = 0;
let versao = 0;

async function carregar(pagina: number): Promise<void> {
  if (!banco) return;
  const atual = ++versao;
  atualizar.disabled = anterior.disabled = proxima.disabled = true;
  lista.replaceChildren();
  detalhes.hidden = true;
  detalhes.querySelector('dl')!.replaceChildren();
  mensagem.textContent = 'Consultando pedidos…';
  secao.setAttribute('aria-busy', 'true');
  try {
    const pedidos = await controle.carregar(pagina);
    if (!pedidos) return;
    paginaAtual = pagina;
    mensagem.textContent = pedidos.length ? `Página ${pagina + 1}: ${pedidos.length} pedidos, dos mais recentes aos mais antigos.`
      : pagina === 0 ? 'Nenhum pedido registrado.' : 'Não há mais pedidos nesta página.';
    for (const pedido of pedidos) {
      const item = document.createElement('li');
      item.className = 'produto';
      const titulo = document.createElement('h3');
      titulo.textContent = pedido.dados.nome;
      const resumo = document.createElement('p');
      resumo.textContent = `${new Date(pedido.criado_em).toLocaleString('pt-BR')} · ${formatarPreco(pedido.total)} · ${pedido.identificador}`;
      const abrir = document.createElement('button');
      abrir.type = 'button';
      abrir.textContent = 'Ver detalhes';
      abrir.setAttribute('aria-label', `Ver detalhes do pedido ${pedido.identificador}`);
      abrir.addEventListener('click', () => {
        const campos = descreverPedido(pedido).flatMap(([nome, valor]) => {
          const termo = document.createElement('dt');
          const descricao = document.createElement('dd');
          termo.textContent = nome;
          descricao.textContent = valor;
          return [termo, descricao];
        });
        detalhes.querySelector('dl')!.replaceChildren(...campos);
        detalhes.hidden = false;
        detalhes.focus();
      });
      item.append(titulo, resumo, abrir);
      lista.append(item);
    }
    proxima.disabled = pedidos.length < 20;
  } catch (erro) {
    mensagem.textContent = erro instanceof Error ? erro.message : 'Não foi possível consultar os pedidos.';
  } finally {
    if (atual === versao) {
      atualizar.disabled = false;
      anterior.disabled = paginaAtual === 0;
      secao.removeAttribute('aria-busy');
    }
  }
}
atualizar.addEventListener('click', () => { void carregar(0); });
anterior.addEventListener('click', () => { void carregar(Math.max(0, paginaAtual - 1)); });
proxima.addEventListener('click', () => { void carregar(paginaAtual + 1); });
document.addEventListener('encerrar-acesso', () => {
  versao++;
  controle.limpar();
  paginaAtual = 0;
  lista.replaceChildren();
  detalhes.querySelector('dl')!.replaceChildren();
  detalhes.hidden = true;
  atualizar.disabled = !banco;
  anterior.disabled = proxima.disabled = true;
  secao.removeAttribute('aria-busy');
  mensagem.textContent = 'Sessão encerrada. Entre novamente para consultar pedidos.';
});
if (!banco) {
  atualizar.disabled = true;
  mensagem.textContent = 'Consulta indisponível: configure a conexão com o Supabase.';
}
