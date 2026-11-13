# Progresso

## 2026-11-13 — Entrevista e organização inicial

- Autorizada a criação da feature list conforme `harness/guides/workflow.md`.
- Branch de trabalho: `main`; usar uma única branch, conforme solicitado.
- Criados os três arquivos de estado; nenhuma implementação da aplicação iniciada.
- Não há templates em `harness/_examples/state/`; formato inicial definido com objetivos, verificações, tarefas, responsáveis, estados e evidências.
- Execução incremental: uma tarefa em andamento por vez, explicando cada etapa ao autor iniciante. Não executar todas as features de uma vez.

## Requisitos confirmados

- Trabalho acadêmico para aprender desenvolvimento de ponta a ponta; autor começando do zero.
- HTML5, CSS3 e JavaScript ou TypeScript obrigatórios; React, banco de dados, backend e consumo de APIs REST opcionais na rubrica acadêmica.
- Atendente registra o pedido no recebimento.
- Itens incluem pizzas, refrigerantes, sucos e outros produtos.
- Pizza permite tamanho, combinação de sabores e adicionais; cobrar pelo sabor mais caro.
- Considerados identificação do cliente, entrega ou retirada, observações e forma de pagamento, após confirmação genérica do autor. Campos exatos ainda serão detalhados.
- Sem acompanhamento de status nesta fase, conforme interpretação apresentada ao autor.
- Pedidos persistem após fechar o sistema e ficam disponíveis em mais de um dispositivo.

## Premissas e decisões em aberto

- Prazo informado: dia 18; interpretado como 18/11/2026 e comunicado ao autor, sem confirmação explícita do mês.
- Tecnologias opcionais ainda não escolhidas. A necessidade de armazenamento compartilhado precisa orientar a decisão; armazenamento apenas no navegador não atende ao compartilhamento.
- Definir no momento da demanda: tamanhos, limite de sabores, adicionais, campos obrigatórios, formas de pagamento, taxa de entrega, controle de acesso e distinção entre pedido registrado e venda paga.
- Proposta de cardápio inicial pré-cadastrado para limitar o escopo, ainda não acordada.
- Não presumir processamento de pagamentos, emissão fiscal, gestão de estoque ou relatórios nesta fase.
- `harness/user_preferences.md` ausente: recomendar sua criação a partir de um template quando disponível, sem criá-lo silenciosamente. As orientações desta sessão estão registradas aqui para continuidade.

## Verificações

- Baseline inicial: `git status --short --branch` indicou `main...origin/main`, sem alterações pendentes.
- Revisados `AGENTS.md` e `harness/guides/workflow.md`.
- Verificador rápido e completo do harness: indisponíveis; não verificados por ferramenta específica.
- Aplicação, build e testes da aplicação: inexistentes; não verificados.
- JSON validado com ConvertFrom-Json: 7 features e 22 tarefas; IDs únicos, responsáveis, estados iniciais, objetivos, verificações, evidências e presença dos três arquivos conferidos.

- Whitespace: git diff --check e git diff --no-index --check nos três arquivos sem erros; somente avisos de conversão de LF para CRLF.

## Bloqueios e riscos

- Cinco dias entre a entrevista e o prazo interpretado; personalização de pizzas e persistência compartilhada aumentam o escopo para um iniciante.
- Reservar tempo para prática e demonstração; evitar funcionalidades adicionais antes do fluxo principal.
- Nenhuma feature foi implementada ou aprovada. Próxima demanda proposta: F01.

## 2026-11-13 — Idioma do desenvolvimento

- Premissa explícita do autor: Usar português do Brasil em todo código autoral: nomes de arquivos e pastas da aplicação, variáveis, funções, classes, propriedades, campos do banco, rotas, identificadores HTML, classes CSS, comentários, mensagens, testes e documentação. Manter a grafia original de palavras reservadas, APIs, bibliotecas, comandos e contratos obrigatórios das ferramentas, sem exigir inglês no esquema autoral do harness. Usar identificadores sem acentos, como calcularTotal e precoUnitario, preservando acentuação nos textos exibidos ao usuário.
- Convenção registrada na feature list e no handoff; nenhuma feature de aplicação iniciada.
- Verificação: JSON convertido e convenção conferida nos três arquivos; estados das sete features preservados como nao_iniciada.

## 2026-11-13 — Adequação retroativa de idioma (F08)

- Solicitação do autor: ajustar o que já existe à premissa de português do Brasil.
- Corrigida a ressalva anterior: o esquema do harness é autoral, não um contrato externo obrigatório.
- Traduzidos campos, estados e responsáveis da lista de funcionalidades; guia e AGENTS.md alinhados. Caminhos de infraestrutura preservados.
- As sete demandas e 22 tarefas originais permanecem pendentes; F08 registra esta manutenção separadamente.
- F08 aprovada e movida para concluidas após validar o JSON, a preservação campo a campo das sete demandas e 22 tarefas originais, os 24 identificadores únicos e a documentação do esquema. git diff --check sem erros; revisão de espaços nos cinco arquivos sem falhas. Apenas avisos de LF/CRLF do Git. Não há aplicação ou testes da aplicação para executar.
