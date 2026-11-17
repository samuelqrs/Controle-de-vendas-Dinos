# Roteiro de demonstração do DINNOS

Autor: Samuel Quintão Rodrigues Santiago.
Disciplina: Estágio Supervisionado.

A demonstração técnica foi delegada ao agente pelo autor. Consulte também
`demonstracao-comentada.md`, com a execução verificada, as capturas e uma fala
sugerida para apresentar o caminho dos dados. Os passos abaixo permanecem úteis
para ensaio; sua realização pelo aluno não é afirmada neste material.

## Preparação

Abra https://eloquent-pie-d5c729.netlify.app/ e entre com a conta de atendente.
Use somente dados fictícios. Guarde a senha fora do relatório e do repositório.
O registro de referência da verificação final é
`293ed4ca-913b-413a-86e9-41d0138e31e9`, total R$ 40,00, em 17/11/2026.
Esse registro foi criado pelo agente e não substitui sua demonstração.

## Demonstração sugerida de cinco a sete minutos

1. Apresente a empresa: pizzaria familiar, com marido e esposa, que registra pedidos
   em papel. Explique que o protótipo oferece registro estruturado e consulta.
2. Mostre cardápio e tamanhos. Esclareça que produtos e preços são fictícios.
3. Inicie um pedido com cliente fictício, telefone `(11) 99999-9999`, retirada e Pix.
4. Adicione uma pizza pequena de muçarela e um refrigerante de cola de 2 litros.
   Confira R$ 28,00 + R$ 12,00 = R$ 40,00, sem taxa de entrega.
5. Revise os dados e grave uma única vez. Mostre a confirmação com código, data e total.
6. Recarregue a página, atualize a lista e abra os detalhes do mesmo código.
   Confira os itens e o total preservados.
7. Mostre que é possível consultar o código em outro dispositivo autorizado,
   conforme a validação compartilhada já executada na F05.
8. Saia e tente atualizar a lista: a consulta deve exigir uma conta autorizada.

## Explicação do caminho dos dados

Use estas ideias como apoio e depois explique com suas palavras:

- HTML organiza os campos; CSS apresenta a interface; TypeScript reage às ações,
  valida os dados e calcula o rascunho. Vite gera o JavaScript da publicação.
- O rascunho fica na memória do navegador. Só clicar em revisar não grava no banco.
- Após a revisão, o SDK envia a solicitação ao Supabase com o código da tentativa.
- O servidor verifica a conta autorizada e as regras, calcula os valores e grava
  tudo em uma transação no PostgreSQL. O navegador aguarda essa confirmação.
- A consulta lê o pedido salvo, incluindo descrições e preços históricos;
  não reconstrói o pedido a partir dos preços atuais.
- Em falha de rede, não se deve afirmar sucesso: consultar o código antes de
  iniciar outro pedido. O mesmo código e conteúdo não criam uma duplicação.

## Limitações a explicar

O pagamento informado não comprova recebimento. Não há controle de estoque,
caixa, produção ou entrega. O rascunho se perde ao recarregar. O sistema precisa
de internet para gravar e consultar. O protótipo não comprova adoção comercial
nem redução medida de custos ou erros na empresa.

## Ensaio opcional do autor

Após realizar os passos, relate quantos dos oito executou, o resultado e o código
do pedido fictício. Explique, em poucas frases e com suas palavras, o que acontece
entre o clique em gravar, a confirmação do banco e a consulta. Não envie senha.
Esse relato pode complementar o material, sem substituir a identificação da
demonstração técnica como realizada pelo agente a pedido do autor.
