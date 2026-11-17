import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { tamanhos, sabores, bebidas, adicionais, formatarPreco } from '../aplicacao/cardapio.ts';

testar('o cardápio corresponde ao PDF oficial e às regras confirmadas', () => {
  verificar.deepEqual(tamanhos.map(item => [item.identificador, item.limiteSabores]), [['media',2],['grande',2]]);
  verificar.deepEqual(sabores.map(item => [item.nome, item.precos.media, item.precos.grande]), [
    ['Margherita',3990,4990], ['Calabresa',4290,5290], ['Portuguesa',4490,5490],
    ['Frango com Catupiry',4590,5590], ['Carne Seca',4990,5990],
    ['Romeu e Julieta',undefined,3990], ['Combo Franbacon + Coca-Cola 2 litros',undefined,5990],
  ]);
  verificar.deepEqual(bebidas, []);
  verificar.deepEqual(adicionais, []);
  const produtos = [...sabores, ...bebidas, ...adicionais];
  verificar.equal(new Set(produtos.map(item => item.identificador)).size, produtos.length);
  for (const sabor of sabores) for (const preco of Object.values(sabor.precos)) verificar.ok(Number.isSafeInteger(preco) && preco > 0);
});

testar('preços são exibidos em reais com centavos', () => {
  verificar.equal(formatarPreco(2850).replace(/\s/g, ' '), 'R$ 28,50');
  verificar.equal(formatarPreco(600).replace(/\s/g, ' '), 'R$ 6,00');
});
