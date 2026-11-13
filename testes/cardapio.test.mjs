import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { tamanhos, sabores, bebidas, adicionais, formatarPreco } from '../aplicacao/cardapio.ts';

testar('o cardápio preserva tamanhos, limites e preços fictícios acordados', () => {
  verificar.deepEqual(tamanhos.map(item => [item.identificador, item.diametro, item.fatias, item.limiteSabores]), [['pequena',25,4,1],['media',30,6,2],['grande',35,8,3]]);
  verificar.deepEqual(sabores.map(item => [item.precos.pequena, item.precos.media, item.precos.grande]), [[2800,3800,4800],[3000,4200,5200],[3400,4600,5800],[3600,4800,6200]]);
  verificar.deepEqual(bebidas.map(item => item.preco), [1200,600,900,900]);
  verificar.deepEqual(adicionais.map(item => item.preco), [600,700,500]);
  const produtos = [...sabores, ...bebidas, ...adicionais];
  verificar.equal(new Set(produtos.map(item => item.identificador)).size, produtos.length);
  for (const sabor of sabores) for (const tamanho of tamanhos) verificar.ok(Number.isSafeInteger(sabor.precos[tamanho.identificador]) && sabor.precos[tamanho.identificador] > 0);
});

testar('preços são exibidos em reais com centavos', () => {
  verificar.equal(formatarPreco(2850).replace(/\s/g, ' '), 'R$ 28,50');
  verificar.equal(formatarPreco(600).replace(/\s/g, ' '), 'R$ 6,00');
});
