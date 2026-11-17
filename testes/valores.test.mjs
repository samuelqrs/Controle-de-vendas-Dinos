import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { calcularItem, calcularPedido } from '../aplicacao/valores.ts';
import { formatarPreco } from '../aplicacao/cardapio.ts';

const pizza = { tipo: 'pizza', tamanho: 'media', sabores: ['margherita', 'frango'], adicionais: [], quantidade: 2 };

testar('pizza de um sabor usa preço oficial de cada tamanho', () => {
  for (const [tamanho, esperado] of [['media',3990],['grande',4990]]) verificar.deepEqual(calcularItem({...pizza,tamanho,sabores:['margherita'],quantidade:1}),{precoBase:esperado,precoAdicionais:0,precoUnitario:esperado,subtotal:esperado});
});

testar('dois sabores cobram o mais caro, independentemente da ordem', () => {
  verificar.deepEqual(calcularItem(pizza),{precoBase:4590,precoAdicionais:0,precoUnitario:4590,subtotal:9180});
  verificar.deepEqual(calcularItem({...pizza,sabores:['frango','margherita']}),calcularItem(pizza));
});

testar('combo inclui pizza grande e Coca-Cola pelo preço completo', () => {
  verificar.equal(calcularItem({...pizza,tamanho:'grande',sabores:['combo-franbacon'],quantidade:1}).subtotal,5990);
  verificar.equal(calcularItem({...pizza,tamanho:'grande',sabores:['romeu-julieta'],quantidade:1}).subtotal,3990);
});

testar('retirada soma linhas e quantidades sem taxa inventada', () => {
  const combo = {...pizza,tamanho:'grande',sabores:['combo-franbacon'],quantidade:1};
  verificar.deepEqual(calcularPedido([pizza,combo],'retirada'),{subtotal:15170,taxa:0,total:15170});
  verificar.deepEqual(calcularPedido([],'retirada'),{subtotal:0,taxa:0,total:0});
  verificar.throws(()=>calcularPedido([pizza],'entrega'),/Entrega indisponível/);
});

testar('edição e remoção recalculam sem alterar os itens recebidos', () => {
  const itens=[structuredClone(pizza)]; const copia=structuredClone(itens);
  verificar.equal(calcularPedido(itens,'retirada').total,9180);
  verificar.deepEqual(itens,copia);
  verificar.equal(calcularPedido([{...pizza,quantidade:1}],'retirada').total,4590);
  verificar.equal(calcularPedido([],'retirada').total,0);
});

testar('centavos e limite de quantidade conservam precisão', () => {
  const valores=calcularPedido([{...pizza,quantidade:99}],'retirada');
  verificar.deepEqual(valores,{subtotal:454410,taxa:0,total:454410});
  verificar.equal(formatarPreco(valores.total).replace(/\s/g,' '),'R$ 4.544,10');
});

testar('tamanhos, misturas, adicionais e bebidas indisponíveis não geram totais', () => {
  for(const alteracao of [{quantidade:0},{quantidade:1.5},{sabores:[]},{sabores:['inexistente']},{tamanho:'pequena'},{sabores:['romeu-julieta']},{tamanho:'grande',sabores:['combo-franbacon','frango']},{adicionais:['bacon']}]) verificar.throws(()=>calcularItem({...pizza,...alteracao}));
  verificar.throws(()=>calcularItem({tipo:'bebida',bebida:'refrigerante-cola',quantidade:1}));
  verificar.throws(()=>calcularPedido([pizza],'desconhecida'));
});
