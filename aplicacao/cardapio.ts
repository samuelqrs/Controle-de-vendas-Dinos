export const tamanhos = [
  { identificador: 'pequena', nome: 'Pequena', diametro: 25, fatias: 4, limiteSabores: 1 },
  { identificador: 'media', nome: 'Média', diametro: 30, fatias: 6, limiteSabores: 2 },
  { identificador: 'grande', nome: 'Grande', diametro: 35, fatias: 8, limiteSabores: 3 },
] as const;

export type IdentificadorTamanho = typeof tamanhos[number]['identificador'];

type Sabor = {
  identificador: string;
  nome: string;
  ingredientes: string;
  precos: Record<IdentificadorTamanho, number>;
};

export const sabores: Sabor[] = [
  { identificador: 'mucarela', nome: 'Muçarela', ingredientes: 'Molho de tomate, muçarela, tomate e orégano.', precos: { pequena: 2800, media: 3800, grande: 4800 } },
  { identificador: 'calabresa', nome: 'Calabresa', ingredientes: 'Molho de tomate, muçarela, calabresa e cebola.', precos: { pequena: 3000, media: 4200, grande: 5200 } },
  { identificador: 'frango', nome: 'Frango com requeijão', ingredientes: 'Molho de tomate, muçarela, frango desfiado e requeijão.', precos: { pequena: 3400, media: 4600, grande: 5800 } },
  { identificador: 'quatro-queijos', nome: 'Quatro queijos', ingredientes: 'Molho de tomate, muçarela, provolone, parmesão e requeijão.', precos: { pequena: 3600, media: 4800, grande: 6200 } },
];

export const bebidas = [
  { identificador: 'refrigerante-cola', nome: 'Refrigerante de cola', volume: '2 litros', preco: 1200 },
  { identificador: 'refrigerante-guarana', nome: 'Refrigerante de guaraná', volume: '350 ml', preco: 600 },
  { identificador: 'suco-laranja', nome: 'Suco de laranja', volume: '500 ml', preco: 900 },
  { identificador: 'suco-uva', nome: 'Suco de uva', volume: '500 ml', preco: 900 },
];

export const adicionais = [
  { identificador: 'mucarela-extra', nome: 'Muçarela extra', preco: 600 },
  { identificador: 'bacon', nome: 'Bacon', preco: 700 },
  { identificador: 'requeijao', nome: 'Requeijão', preco: 500 },
];

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
