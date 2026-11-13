import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { calcularItem, calcularPedido } from '../aplicacao/valores.ts';
import { formatarPreco } from '../aplicacao/cardapio.ts';

const pizza = { tipo: 'pizza', tamanho: 'media', sabores: ['mucarela', 'frango'], adicionais: ['bacon'], quantidade: 2 };
const bebida = { tipo: 'bebida', bebida: 'refrigerante-cola', quantidade: 3 };

testar('pizza de um sabor usa o preço do tamanho escolhido', () => {
  for (const [tamanho, esperado] of [['pequena', 2800], ['media', 3800], ['grande', 4800]]) {
    verificar.deepEqual(calcularItem({ ...pizza, tamanho, sabores: ['mucarela'], adicionais: [], quantidade: 1 }), { precoBase: esperado, precoAdicionais: 0, precoUnitario: esperado, subtotal: esperado });
  }
});

testar('combinação cobra o sabor mais caro e adicionais por unidade, sem dividir ou somar sabores', () => {
  // Média de frango R$ 46 + bacon R$ 7 = R$ 53; duas unidades = R$ 106.
  verificar.deepEqual(calcularItem(pizza), { precoBase: 4600, precoAdicionais: 700, precoUnitario: 5300, subtotal: 10600 });
  verificar.deepEqual(calcularItem({ ...pizza, sabores: ['frango', 'mucarela'] }), calcularItem(pizza));
  // Grande: sabor mais caro R$ 62 + R$ 6 + R$ 7 + R$ 5 = R$ 80; três = R$ 240.
  verificar.deepEqual(calcularItem({ ...pizza, tamanho: 'grande', sabores: ['calabresa', 'quatro-queijos', 'frango'], adicionais: ['mucarela-extra', 'bacon', 'requeijao'], quantidade: 3 }), { precoBase: 6200, precoAdicionais: 1800, precoUnitario: 8000, subtotal: 24000 });
});

testar('pedido soma pizzas e bebidas e cobra entrega uma única vez', () => {
  verificar.deepEqual(calcularItem(bebida), { precoBase: 1200, precoAdicionais: 0, precoUnitario: 1200, subtotal: 3600 });
  // R$ 106 de pizzas + R$ 36 de bebidas = R$ 142; com entrega = R$ 147.
  verificar.deepEqual(calcularPedido([pizza, bebida], 'retirada'), { subtotal: 14200, taxa: 0, total: 14200 });
  verificar.deepEqual(calcularPedido([pizza, bebida], 'entrega'), { subtotal: 14200, taxa: 500, total: 14700 });
  verificar.deepEqual(calcularPedido([], 'entrega'), { subtotal: 0, taxa: 0, total: 0 });
  verificar.deepEqual(calcularPedido([], 'retirada'), { subtotal: 0, taxa: 0, total: 0 });
});

testar('editar e remover itens recalcula sem alterar os dados recebidos', () => {
  const itens = structuredClone([pizza, bebida]);
  const copia = structuredClone(itens);
  verificar.equal(calcularPedido(itens, 'entrega').total, 14700);
  verificar.deepEqual(itens, copia);
  verificar.equal(calcularPedido([{ ...pizza, quantidade: 1 }, bebida], 'entrega').total, 9400);
  verificar.equal(calcularPedido([bebida], 'retirada').total, 3600);
});

testar('totais permanecem inteiros em centavos inclusive na quantidade máxima', () => {
  // 99 pizzas de R$ 53 e 99 bebidas de R$ 12, mais R$ 5 de entrega = R$ 6.440.
  const valores = calcularPedido([{ ...pizza, quantidade: 99 }, { ...bebida, quantidade: 99 }], 'entrega');
  verificar.deepEqual(valores, { subtotal: 643500, taxa: 500, total: 644000 });
  for (const valor of Object.values(valores)) verificar.ok(Number.isSafeInteger(valor));
  verificar.equal(formatarPreco(valores.total).replace(/\s/g, ' '), 'R$ 6.440,00');
});

testar('dados inválidos não geram preços ou totais silenciosamente', () => {
  for (const alteracao of [{ quantidade: 0 }, { quantidade: 1.5 }, { sabores: [] }, { sabores: ['inexistente'] }, { adicionais: ['bacon', 'bacon'] }, { tamanho: 'gigante' }]) verificar.throws(() => calcularItem({ ...pizza, ...alteracao }));
  verificar.throws(() => calcularPedido([pizza], 'desconhecida'));
  verificar.throws(() => calcularPedido([{ ...bebida, bebida: 'inexistente' }], 'retirada'));
});
