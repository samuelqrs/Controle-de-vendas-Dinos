import { tamanhos, sabores, bebidas, adicionais, formatarPreco } from './cardapio.ts';
import { calcularItem, calcularPedido, taxaEntrega } from './valores.ts';
import { validarItem, validarPedido } from './pedido.ts';
import type { ItemPedido, DadosPedido } from './pedido.ts';

const secao = document.querySelector<HTMLElement>('#secao-pedido')!;
secao.innerHTML = `
  <p class="sobretitulo">04 / SEU PEDIDO</p><h2 id="titulo-pedido">Montar pedido</h2>
  <p>Rascunho temporário: os dados serão perdidos ao recarregar a página. Use dados fictícios.</p>
  <form id="dados-pedido">
    <div class="campos-pedido">
      <label>Nome do cliente *<input name="nome" required autocomplete="name" maxlength="100"></label>
      <label>Telefone com DDD *<input name="telefone" type="tel" required autocomplete="tel" placeholder="(11) 99999-9999"></label>
      <label>Modalidade *<select name="modalidade"><option value="retirada">Retirada</option><option value="entrega">Entrega</option></select></label>
      <label>Pagamento *<select name="pagamento" required><option value="">Selecione</option><option value="dinheiro">Dinheiro</option><option value="pix">Pix</option><option value="cartao">Cartão</option></select></label>
    </div>
    <fieldset id="endereco-pedido" hidden disabled><legend>Endereço de entrega</legend><div class="campos-pedido">
      <label>Logradouro *<input name="logradouro" required autocomplete="address-line1"></label>
      <label>Número *<input name="numero" required placeholder="Número ou s/n"></label>
      <label>Bairro *<input name="bairro" required></label>
      <label>Cidade *<input name="cidade" required autocomplete="address-level2"></label>
      <label>Complemento<input name="complemento" autocomplete="address-line2"></label>
    </div></fieldset>
    <label>Observações<textarea name="observacoes" rows="3" maxlength="1000"></textarea></label>
  </form>
  <form id="editor-item">
    <h3 id="titulo-editor">Adicionar item</h3>
    <div class="campos-pedido"><label>Produto<select name="tipo"><option value="pizza">Pizza</option><option value="bebida">Bebida</option></select></label>
    <label>Quantidade *<input name="quantidade" type="number" min="1" max="99" step="1" value="1" required></label></div>
    <fieldset id="opcoes-pizza"><legend>Personalizar pizza</legend>
      <label>Tamanho<select name="tamanho">${tamanhos.map(item => `<option value="${item.identificador}">${item.nome}</option>`).join('')}</select></label>
      <p id="limite-sabores"></p><fieldset><legend>Sabores *</legend>${sabores.map(item => `<label class="opcao"><input type="checkbox" name="sabores" value="${item.identificador}">${item.nome}</label>`).join('')}</fieldset>
      <fieldset><legend>Adicionais opcionais</legend>${adicionais.map(item => `<label class="opcao"><input type="checkbox" name="adicionais" value="${item.identificador}">${item.nome}</label>`).join('')}</fieldset>
    </fieldset>
    <fieldset id="opcoes-bebida" hidden disabled><legend>Bebida</legend><label>Escolha a bebida<select name="bebida">${bebidas.map(item => `<option value="${item.identificador}">${item.nome} · ${item.volume}</option>`).join('')}</select></label></fieldset>
    <p id="erro-item" role="alert"></p><div class="acoes"><button type="submit" id="confirmar-item">Adicionar item</button><button type="button" id="cancelar-item" hidden>Cancelar edição</button></div>
  </form>
  <h3>Itens do pedido</h3><ul id="itens-pedido" class="produtos"></ul>
  <section class="resumo-valores" aria-labelledby="titulo-valores">
    <h3 id="titulo-valores">Valores do rascunho</h3>
    <p>Entrega: ${formatarPreco(taxaEntrega)} por pedido. Retirada sem taxa. Valores dos itens já adicionados; salve as alterações do item para atualizar.</p>
    <dl id="valores-pedido" aria-live="polite"></dl>
  </section>
  <button type="submit" form="dados-pedido">Conferir dados do pedido</button>
  <p id="mensagem-pedido" role="status" tabindex="-1"></p>
  <section id="revisao-pedido" class="resumo-valores" aria-labelledby="titulo-revisao" hidden>
    <h3 id="titulo-revisao">Revisão do pedido</h3><dl id="dados-revisao"></dl>
    <p>Confira os itens e valores acima. Este rascunho ainda não é uma venda registrada e nenhum pagamento foi confirmado.</p>
  </section>`;

const formulario = secao.querySelector<HTMLFormElement>('#dados-pedido')!;
const editor = secao.querySelector<HTMLFormElement>('#editor-item')!;
const lista = secao.querySelector<HTMLUListElement>('#itens-pedido')!;
const mensagem = secao.querySelector<HTMLElement>('#mensagem-pedido')!;
const erroItem = secao.querySelector<HTMLElement>('#erro-item')!;
const botaoConfirmar = secao.querySelector<HTMLButtonElement>('#confirmar-item')!;
const botaoCancelar = secao.querySelector<HTMLButtonElement>('#cancelar-item')!;
const revisao = secao.querySelector<HTMLElement>('#revisao-pedido')!;
let itens: ItemPedido[] = [];
let indiceEdicao: number | null = null;

function campo(nome: string): HTMLInputElement | HTMLSelectElement {
  return editor.elements.namedItem(nome) as HTMLInputElement | HTMLSelectElement;
}

function atualizarOpcoes(): void {
  const pizza = campo('tipo').value === 'pizza';
  for (const [id, ativo] of [['opcoes-pizza', pizza], ['opcoes-bebida', !pizza]] as const) {
    const grupo = secao.querySelector<HTMLFieldSetElement>('#' + id)!;
    grupo.hidden = !ativo;
    grupo.disabled = !ativo;
  }
  const tamanho = tamanhos.find(item => item.identificador === campo('tamanho').value)!;
  secao.querySelector('#limite-sabores')!.textContent = `Escolha de 1 a ${tamanho.limiteSabores} sabor(es). Ao reduzir o tamanho, ajuste os sabores antes de confirmar.`;
}

function limparEditor(): void {
  editor.reset();
  indiceEdicao = null;
  botaoConfirmar.textContent = 'Adicionar item';
  secao.querySelector('#titulo-editor')!.textContent = 'Adicionar item';
  botaoCancelar.hidden = true;
  erroItem.textContent = '';
  atualizarOpcoes();
}

function invalidarRevisao(): void {
  revisao.hidden = true;
  mensagem.textContent = '';
}

function preencherResumo(destino: HTMLElement, campos: [string, string][]): void {
  destino.replaceChildren(...campos.flatMap(([rotulo, valor]) => {
    const termo = document.createElement('dt');
    termo.textContent = rotulo;
    const detalhe = document.createElement('dd');
    detalhe.textContent = valor;
    return [termo, detalhe];
  }));
}

function apresentarValores(): void {
  const modalidade = String(new FormData(formulario).get('modalidade'));
  const valores = calcularPedido(itens, modalidade);
  preencherResumo(secao.querySelector<HTMLElement>('#valores-pedido')!, [
    ['Subtotal dos itens', formatarPreco(valores.subtotal)],
    ['Taxa de entrega', formatarPreco(valores.taxa)],
    ['Total do pedido', formatarPreco(valores.total)],
  ]);
}

function apresentarItens(): void {
  invalidarRevisao();
  apresentarValores();
  lista.replaceChildren();
  if (!itens.length) {
    const vazio = document.createElement('li');
    vazio.textContent = 'Nenhum item adicionado.';
    lista.append(vazio);
  }
  itens.forEach((item, indice) => {
    const linha = document.createElement('li');
    linha.className = 'produto';
    const descricao = document.createElement('p');
    descricao.textContent = item.tipo === 'pizza'
      ? `${item.quantidade} × Pizza ${tamanhos.find(tamanho => tamanho.identificador === item.tamanho)!.nome} — ${item.sabores.map(id => sabores.find(sabor => sabor.identificador === id)!.nome).join(', ')}. Adicionais: ${item.adicionais.map(id => adicionais.find(adicional => adicional.identificador === id)!.nome).join(', ') || 'nenhum'}.`
      : `${item.quantidade} × ${bebidas.find(bebida => bebida.identificador === item.bebida)!.nome} · ${bebidas.find(bebida => bebida.identificador === item.bebida)!.volume}`;
    const valores = calcularItem(item);
    const composicao = document.createElement('p');
    composicao.textContent = `Base: ${formatarPreco(valores.precoBase)} + adicionais: ${formatarPreco(valores.precoAdicionais)} = ${formatarPreco(valores.precoUnitario)} por unidade.`;
    const subtotal = document.createElement('strong');
    subtotal.textContent = `Subtotal: ${formatarPreco(valores.subtotal)}`;
    linha.append(descricao, composicao, subtotal);
    for (const acao of ['Editar', 'Remover']) {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.textContent = acao;
      botao.setAttribute('aria-label', `${acao} item ${indice + 1}`);
      botao.addEventListener('click', () => {
        invalidarRevisao();
        if (acao === 'Remover') {
          itens = itens.filter((_, posicao) => posicao !== indice);
          limparEditor();
          apresentarItens();
          mensagem.textContent = 'Item removido. Confira o pedido novamente.';
          mensagem.focus();
          return;
        }
        limparEditor();
        indiceEdicao = indice;
        campo('tipo').value = item.tipo;
        campo('quantidade').value = String(item.quantidade);
        if (item.tipo === 'pizza') {
          campo('tamanho').value = item.tamanho;
          editor.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(controle => {
            controle.checked = (controle.name === 'sabores' ? item.sabores : item.adicionais).includes(controle.value);
          });
        } else campo('bebida').value = item.bebida;
        botaoConfirmar.textContent = 'Salvar alteração';
        secao.querySelector('#titulo-editor')!.textContent = `Editar item ${indice + 1}`;
        botaoCancelar.hidden = false;
        atualizarOpcoes();
        campo('tipo').focus();
      });
      linha.append(botao);
    }
    lista.append(linha);
  });
}

editor.addEventListener('change', atualizarOpcoes);
botaoCancelar.addEventListener('click', () => { limparEditor(); campo('tipo').focus(); });
editor.addEventListener('submit', evento => {
  evento.preventDefault();
  const dados = new FormData(editor);
  const tamanho = tamanhos.find(item => item.identificador === dados.get('tamanho'))!;
  const quantidade = Number(dados.get('quantidade'));
  const item: ItemPedido = dados.get('tipo') === 'pizza'
    ? { tipo: 'pizza', quantidade, tamanho: tamanho.identificador, sabores: dados.getAll('sabores').map(String), adicionais: dados.getAll('adicionais').map(String) }
    : { tipo: 'bebida', quantidade, bebida: String(dados.get('bebida')) };
  const erros = validarItem(item);
  erroItem.textContent = erros.join(' ');
  if (erros.length) return;
  if (indiceEdicao === null) itens.push(item);
  else itens[indiceEdicao] = item;
  limparEditor();
  apresentarItens();
  mensagem.textContent = 'Item atualizado no rascunho. Confira os dados do pedido.';
  campo('tipo').focus();
});

formulario.addEventListener('change', () => {
  invalidarRevisao();
  const entrega = new FormData(formulario).get('modalidade') === 'entrega';
  const endereco = secao.querySelector<HTMLFieldSetElement>('#endereco-pedido')!;
  endereco.hidden = !entrega;
  endereco.disabled = !entrega;
  apresentarValores();
});
secao.addEventListener('input', () => { invalidarRevisao(); erroItem.textContent = ''; });
secao.addEventListener('change', invalidarRevisao);
formulario.addEventListener('invalid', invalidarRevisao, true);
formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(formulario)) as DadosPedido;
  const erros = validarPedido(dados, itens);
  if (indiceEdicao !== null) erros.push('Salve ou cancele a edição do item antes de conferir.');
  revisao.hidden = erros.length > 0;
  if (!erros.length) {
    const pagamentos: Record<string, string> = { dinheiro: 'Dinheiro', pix: 'Pix', cartao: 'Cartão' };
    const endereco = dados.modalidade === 'entrega'
      ? `${dados.logradouro}, ${dados.numero} — ${dados.bairro}, ${dados.cidade}${dados.complemento ? ' · ' + dados.complemento : ''}`
      : 'Retirada na pizzaria';
    preencherResumo(secao.querySelector<HTMLElement>('#dados-revisao')!, [
      ['Cliente', dados.nome], ['Telefone', dados.telefone],
      ['Modalidade', dados.modalidade === 'entrega' ? 'Entrega' : 'Retirada'],
      ['Endereço', endereco], ['Pagamento informado', pagamentos[dados.pagamento]],
      ['Observações', dados.observacoes.trim() || 'Nenhuma'],
      ['Total conferido', formatarPreco(calcularPedido(itens, dados.modalidade).total)],
    ]);
  }
  mensagem.textContent = erros.length ? erros.join(' ') : 'Dados conferidos. O rascunho está montado e ainda não foi gravado.';
  mensagem.focus();
});
atualizarOpcoes();
apresentarItens();
