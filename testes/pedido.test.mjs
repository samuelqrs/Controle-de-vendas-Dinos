import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { validarItem, validarPedido } from '../aplicacao/pedido.ts';

const pizza = { tipo: 'pizza', tamanho: 'media', sabores: ['mucarela', 'frango'], adicionais: ['bacon'], quantidade: 2 };
const bebida = { tipo: 'bebida', bebida: 'suco-uva', quantidade: 1 };
const dados = { nome: 'Cliente fictício', telefone: '(11) 99999-9999', modalidade: 'retirada', pagamento: 'pix', logradouro: '', numero: '', bairro: '', cidade: '', complemento: '', observacoes: 'Exemplo' };

testar('retirada e entrega aceitam pizza personalizada e bebida', () => {
  verificar.deepEqual(validarPedido(dados, [pizza, bebida]), []);
  verificar.deepEqual(validarPedido({ ...dados, modalidade: 'entrega', logradouro: 'Rua Exemplo', numero: 's/n', bairro: 'Centro', cidade: 'Cidade fictícia' }, [pizza, bebida]), []);
  for (const pagamento of ['dinheiro', 'pix', 'cartao']) verificar.deepEqual(validarPedido({ ...dados, pagamento }, [bebida]), []);
});

testar('campos obrigatórios, endereço condicional e pedido vazio são verificados', () => {
  for (const campo of ['nome', 'telefone', 'modalidade', 'pagamento']) verificar.ok(validarPedido({ ...dados, [campo]: ' ' }, [pizza]).length > 0, campo);
  for (const campo of ['logradouro', 'numero', 'bairro', 'cidade']) {
    const entrega = { ...dados, modalidade: 'entrega', logradouro: 'Rua Exemplo', numero: '1', bairro: 'Centro', cidade: 'Cidade fictícia', [campo]: ' ' };
    verificar.ok(validarPedido(entrega, [pizza]).length > 0, campo);
  }
  verificar.ok(validarPedido(dados, []).length > 0);
  verificar.ok(validarPedido({ ...dados, telefone: '123' }, [pizza]).length > 0);
});

testar('quantidades rejeitam zero, negativos, frações e valores fora do limite', () => {
  for (const quantidade of [0, -1, 1.5, NaN, Infinity, 100, Number.MAX_SAFE_INTEGER + 1]) {
    verificar.ok(validarItem({ ...pizza, quantidade }).length > 0);
    verificar.ok(validarItem({ ...bebida, quantidade }).length > 0);
  }
  for (const quantidade of [1, 99]) verificar.deepEqual(validarItem({ ...pizza, quantidade }), []);
});

testar('personalização respeita limites por tamanho e produtos do cardápio', () => {
  for (const [tamanho, limite] of [['pequena', 1], ['media', 2], ['grande', 3]]) {
    const sabores = ['mucarela', 'frango', 'calabresa', 'quatro-queijos'];
    verificar.deepEqual(validarItem({ ...pizza, tamanho, sabores: sabores.slice(0, limite) }), []);
    verificar.ok(validarItem({ ...pizza, tamanho, sabores: sabores.slice(0, limite + 1) }).length > 0);
  }
  for (const alteracao of [{ sabores: [] }, { sabores: ['inexistente'] }, { sabores: ['frango', 'frango'] }, { adicionais: ['inexistente'] }, { adicionais: ['bacon', 'bacon'] }, { tamanho: 'gigante' }]) verificar.ok(validarItem({ ...pizza, ...alteracao }).length > 0);
  verificar.ok(validarItem({ ...bebida, bebida: 'inexistente' }).length > 0);
});
