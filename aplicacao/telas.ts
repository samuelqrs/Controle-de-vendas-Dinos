import { identificarTela } from './navegacao.ts';

function apresentarTela(moverFoco: boolean): void {
  const destino = identificarTela(location.hash);
  document.querySelectorAll<HTMLElement>('[data-tela]').forEach(tela => {
    tela.hidden = tela.dataset.tela !== destino;
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-destino]').forEach(link => {
    if (link.dataset.destino === destino) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `DINNOS | ${{ inicio: 'Início', pedidos: 'Lançamento de pedidos', relatorios: 'Relatórios' }[destino]}`;
  if (moverFoco) {
    const titulo = document.querySelector<HTMLElement>(`[data-tela="${destino}"] h1, [data-tela="${destino}"] h2`);
    if (titulo) { titulo.tabIndex = -1; titulo.focus(); }
  }
}

window.addEventListener('hashchange', () => apresentarTela(true));
apresentarTela(false);
