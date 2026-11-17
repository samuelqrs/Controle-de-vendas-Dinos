import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { identificarTela } from '../aplicacao/navegacao.ts';

testar('navegação reconhece as três telas e os links antigos publicados',()=>{
  for(const [fragmento,tela] of [['#inicio','inicio'],['#pedidos','pedidos'],['#relatorios','relatorios'],['#secao-pedido','pedidos'],['#secao-pedidos-salvos','relatorios'],['','inicio'],['#desconhecida','inicio']]) verificar.equal(identificarTela(fragmento),tela);
});
