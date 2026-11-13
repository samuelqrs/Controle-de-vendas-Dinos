const botaoEtapas = document.querySelector<HTMLButtonElement>('#botao-etapas');
const secaoEtapas = document.querySelector<HTMLElement>('#etapas');

if (botaoEtapas && secaoEtapas) {
  botaoEtapas.addEventListener('click', () => {
    const etapasVisiveis: boolean = !secaoEtapas.hidden;

    secaoEtapas.hidden = etapasVisiveis;
    botaoEtapas.setAttribute('aria-expanded', String(!etapasVisiveis));
    botaoEtapas.textContent = etapasVisiveis
      ? 'Conhecer as próximas etapas ↓'
      : 'Ocultar as próximas etapas ↑';
  });
}
