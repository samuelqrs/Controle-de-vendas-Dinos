import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { validarItem, validarPedido } from '../aplicacao/pedido.ts';

const pizza={tipo:'pizza',tamanho:'media',sabores:['margherita','frango'],adicionais:[],quantidade:2};
const dados={nome:'Cliente fictício',telefone:'(11) 99999-9999',modalidade:'retirada',pagamento:'pix',logradouro:'',numero:'',bairro:'',cidade:'',complemento:'',observacoes:'Exemplo'};

testar('retirada aceita os pagamentos e produtos confirmados',()=>{
  for(const pagamento of ['dinheiro','pix','cartao']) verificar.deepEqual(validarPedido({...dados,pagamento},[pizza]),[]);
  verificar.deepEqual(validarItem({...pizza,tamanho:'grande',sabores:['romeu-julieta']}),[]);
  verificar.deepEqual(validarItem({...pizza,tamanho:'grande',sabores:['combo-franbacon']}),[]);
});

testar('campos obrigatórios e pedido vazio são verificados',()=>{
  for(const campo of ['nome','telefone','modalidade','pagamento']) verificar.ok(validarPedido({...dados,[campo]:' '},[pizza]).length>0,campo);
  verificar.ok(validarPedido(dados,[]).length>0);
  verificar.ok(validarPedido({...dados,telefone:'123'},[pizza]).length>0);
  verificar.match(validarPedido({...dados,modalidade:'entrega',logradouro:'Rua',numero:'1',bairro:'Centro',cidade:'Cidade'},[pizza]).join(' '),/Entrega indisponível/);
});

testar('quantidades aceitam apenas inteiros de 1 a 99',()=>{
  for(const quantidade of [0,-1,1.5,NaN,Infinity,100,Number.MAX_SAFE_INTEGER+1]) verificar.ok(validarItem({...pizza,quantidade}).length>0);
  for(const quantidade of [1,99]) verificar.deepEqual(validarItem({...pizza,quantidade}),[]);
});

testar('personalização respeita dois sabores e ofertas por tamanho',()=>{
  for(const tamanho of ['media','grande']) {
    verificar.deepEqual(validarItem({...pizza,tamanho}),[]);
    verificar.ok(validarItem({...pizza,tamanho,sabores:['margherita','frango','calabresa']}).length>0);
  }
  for(const alteracao of [{tamanho:'pequena'},{sabores:[]},{sabores:['inexistente']},{sabores:['frango','frango']},{adicionais:['bacon']},{sabores:['romeu-julieta']},{sabores:['combo-franbacon']},{tamanho:'grande',sabores:['combo-franbacon','frango']}]) verificar.ok(validarItem({...pizza,...alteracao}).length>0);
  verificar.ok(validarItem({tipo:'bebida',bebida:'refrigerante-cola',quantidade:1}).length>0);
});
