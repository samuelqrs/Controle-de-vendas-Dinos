export const tamanhos = [
  { identificador: 'media', nome: 'Média', limiteSabores: 2 },
  { identificador: 'grande', nome: 'Grande', limiteSabores: 2 },
] as const;

// Pequena permanece no tipo para leitura do histórico, sem nova oferta.
export type IdentificadorTamanho = typeof tamanhos[number]['identificador'] | 'pequena';

type Sabor = {
  identificador: string;
  nome: string;
  ingredientes: string;
  precos: Partial<Record<IdentificadorTamanho, number>>;
  exclusivo?: boolean;
};

export const sabores: Sabor[] = [
  { identificador: 'margherita', nome: 'Margherita', ingredientes: 'Molho de tomate, muçarela, rodelas de tomate fresco e manjericão fresco.', precos: { media: 3990, grande: 4990 } },
  { identificador: 'calabresa', nome: 'Calabresa', ingredientes: 'Calabresa fatiada, cebola roxa, muçarela e orégano.', precos: { media: 4290, grande: 5290 } },
  { identificador: 'portuguesa', nome: 'Portuguesa', ingredientes: 'Muçarela, presunto, ovos, cebola, ervilha e azeitonas pretas.', precos: { media: 4490, grande: 5490 } },
  { identificador: 'frango', nome: 'Frango com Catupiry', ingredientes: 'Frango desfiado temperado, catupiry cremoso e orégano.', precos: { media: 4590, grande: 5590 } },
  { identificador: 'carne-seca', nome: 'Carne Seca', ingredientes: 'Carne seca e queijo coalho.', precos: { media: 4990, grande: 5990 } },
  { identificador: 'romeu-julieta', nome: 'Romeu e Julieta', ingredientes: 'Muçarela, goiabada cremosa e raspas de queijo parmesão. Somente grande.', precos: { grande: 3990 } },
  { identificador: 'combo-franbacon', nome: 'Combo Franbacon + Coca-Cola 2 litros', ingredientes: 'Pizza grande de frango desfiado, bacon, muçarela, azeitona e manjericão, acompanhada de uma Coca-Cola de 2 litros. Combo fechado.', precos: { grande: 5990 }, exclusivo: true },
];

export const bebidas: { identificador: string; nome: string; volume: string; preco: number }[] = [];

export const adicionais: { identificador: string; nome: string; preco: number }[] = [];
export const entregaDisponivel = false;

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
