import { tamanhos, sabores, bebidas, adicionais, formatarPreco } from './cardapio.ts';
import type { IdentificadorTamanho } from './cardapio.ts';
import './montagem.ts';
import './pedidos-salvos.ts';
import './telas.ts';

const selecaoTamanho = document.querySelector<HTMLSelectElement>('#tamanho');
const listaPizzas = document.querySelector<HTMLUListElement>('#pizzas');
const resumoTamanho = document.querySelector<HTMLElement>('#resumo-tamanho');

function apresentarPizzas(identificador: IdentificadorTamanho): void {
  const tamanho = tamanhos.find(item => item.identificador === identificador);
  if (!tamanho || !listaPizzas || !resumoTamanho) return;
  resumoTamanho.textContent = `Até ${tamanho.limiteSabores} sabores. Romeu e Julieta e combo somente grandes. O combo inclui a Coca-Cola e é vendido fechado.`;
  listaPizzas.replaceChildren(...sabores.filter(sabor => sabor.precos[identificador] !== undefined).map(sabor => criarProduto(sabor.nome, sabor.ingredientes, sabor.precos[identificador]!)));
}

function criarProduto(nome: string, descricao: string, preco: number): HTMLLIElement {
  const produto = document.createElement('li');
  produto.className = 'produto';
  const titulo = document.createElement('h3');
  titulo.textContent = nome;
  const detalhe = document.createElement('p');
  detalhe.textContent = descricao;
  const valor = document.createElement('strong');
  valor.textContent = formatarPreco(preco);
  produto.append(titulo, detalhe, valor);
  return produto;
}

if (selecaoTamanho) {
  selecaoTamanho.replaceChildren(...tamanhos.map(tamanho => {
    const opcao = document.createElement('option');
    opcao.value = tamanho.identificador;
    opcao.textContent = tamanho.nome;
    return opcao;
  }));
  selecaoTamanho.addEventListener('change', () => {
    const tamanho = tamanhos.find(item => item.identificador === selecaoTamanho.value);
    if (tamanho) apresentarPizzas(tamanho.identificador);
  });
  apresentarPizzas('media');
}

document.querySelector('#bebidas')?.replaceChildren(...bebidas.map(bebida => criarProduto(bebida.nome, bebida.volume, bebida.preco)));
document.querySelector('#adicionais')?.replaceChildren(...adicionais.map(adicional => criarProduto(adicional.nome, 'Valor por pizza, em qualquer tamanho.', adicional.preco)));
