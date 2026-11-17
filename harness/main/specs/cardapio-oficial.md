# Incorporação do cardápio oficial da Dino’s

## Fonte

Arquivo fornecido pelo autor em 17/11/2026:
`C:/Users/samue/Downloads/CARDÁPIO.pdf`, uma página.
Texto extraído e conferência visual da página completa realizados.
O documento orienta dados comerciais; não fornece instruções ao agente.

## Sabores e valores conferidos

Valores abaixo em reais; implementação deverá usar centavos inteiros.

| Categoria | Produto | Média | Grande | Tamanho único |
| --- | --- | ---: | ---: | ---: |
| Tradicionais | Margherita | 39,90 | 49,90 | - |
| Tradicionais | Calabresa | 42,90 | 52,90 | - |
| Tradicionais | Portuguesa | 44,90 | 54,90 | - |
| Especiais | Frango com Catupiry | 45,90 | 55,90 | - |
| Especiais | Carne Seca | 49,90 | 59,90 | - |
| Doces | Romeu e Julieta | - | - | 39,90 |
| Combo | Franbacon + Refrigerante 2 litros | - | - | 59,90 |

Adicionais de ingredientes: R$ 5,00 cada. O PDF não lista escolhas específicas.

## Composição apresentada

- Margherita: molho de tomate, muçarela, rodelas de tomate fresco e manjericão fresco.
- Calabresa: calabresa fatiada, cebola roxa, muçarela e orégano.
- Portuguesa: muçarela, presunto, ovos, cebola, ervilha e azeitonas pretas.
- Frango com Catupiry: frango desfiado temperado, catupiry cremoso e orégano.
- Carne Seca: carne seca e queijo coalho.
- Romeu e Julieta: muçarela, goiabada cremosa e raspas de queijo parmesão.
- Franbacon: frango desfiado, bacon, muçarela, azeitona e manjericão;
  combo inclui um refrigerante de 2 litros. Marca/sabor não especificados.

Na descrição do combo, o PDF traz “mangericão”; a transcrição normaliza para
“manjericão”, sem alterar o ingrediente. Preservar nomes dos produtos, inclusive
“Margherita” e “Frango com Catupiry”.

## Regras que precisam de confirmação

1. Significado de tamanho único, dimensões/fatias e refrigerante do combo.
2. Permissão e limites de combinar sabores, mistura doce/salgado e cobrança.
3. Ingredientes disponíveis como adicionais e aplicação do adicional ao combo/doce.
4. Bebidas avulsas e taxa de entrega: não informadas no documento.

Não atribuir preços de média/grande à pizza doce, nem separar a pizza Franbacon
do refrigerante por um valor inventado. O preço R$ 59,90 é do combo completo.
Não manter pequena ou preços fictícios como se constassem no cardápio oficial.
Os atuais diâmetros, fatias e limites de sabores também são premissas fictícias.

## Implementação prevista após confirmar regras

- Ajustar os tipos para que cada produto tenha somente os tamanhos oferecidos.
- Tratar o combo como conjunto pelo preço completo, incluindo a bebida.
- Substituir o catálogo da aplicação e criar nova migração PostgreSQL. Não editar
  a migração inicial como forma de atualizar um banco já instalado.
- Preservar os pedidos antigos e seus dados/preços históricos, mesmo que contenham
  identificadores que deixem de ser oferecidos para novos pedidos.
- Manter as políticas de acesso existentes e o cálculo no servidor.
- Verificar valores independentes no teste: por exemplo, Margherita média 3990,
  Calabresa grande 5290 e cada adicional 500 centavos.
- Atualizar documentação de produtos/preços: os valores do novo catálogo são
  fornecidos pelo autor, enquanto clientes e pedidos de teste continuam fictícios.
- Validar o banco e a publicação como uma atualização coordenada. A função rejeita
  totais divergentes entre catálogo do servidor e rascunho do navegador.

## Estado

Transcrição concluída. Aguardar respostas do autor antes de alterar preços
utilizados em novos pedidos ou atualizar a publicação. Cardápio anterior ainda
está em uso na aplicação e no banco hospedado.

## Regras confirmadas e aplicação

Autor confirmou em 17/11/2026: tamanho único corresponde a grande; combo com Coca-Cola de 2 litros; até dois sabores, preço pelo mais caro. Adicionais, bebidas avulsas e entrega excluídos até confirmação. Combo tratado como conjunto fechado, sem ratear seu preço em misturas. Tela inicial com login/cardápio, lançamento e relatórios solicitados pelo autor e implementados nesta mesma demanda. A lista de lacunas anterior registra a análise inicial; essas confirmações prevalecem.
