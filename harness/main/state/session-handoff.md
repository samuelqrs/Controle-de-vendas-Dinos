# Continuidade da sessão

## Objetivo

Criar um sistema acadêmico de registro de vendas de pizzaria, com aprendizagem gradual e demandas separadas na feature list. Entrega interpretada como 18/11/2026.

## Estado atual

- Branch única: `main`.
- Ler `harness/guides/workflow.md`, `feature_list.json` e `progress.md` antes de continuar.
- Entrevista realizada com a skill problem-interviewer; organização inicial e adequação retroativa de idioma autorizadas. Aguardar orientação para iniciar a aplicação.
- Feature list criada com F01 a F07, todas `nao_iniciada`, sem tarefas em andamento.
- Nenhuma aplicação, dependência, banco ou infraestrutura criada; nenhum commit solicitado.
- Não existem templates do estado nem verificadores do harness no repositório.
- Preferências locais ausentes; recomendar a criação de `harness/user_preferences.md`, sem criá-lo silenciosamente.

## Verificações e limitações

- Baseline limpo na branch `main`; orientação do repositório e guia do harness revisados.
- JSON válido: 7 features e 22 tarefas com IDs únicos, responsáveis e estados conferidos; três arquivos presentes. Whitespace conferido com git diff --check e git diff --no-index --check, sem erros; apenas avisos de LF/CRLF.
- Nenhum teste da aplicação executado, pois ainda não há aplicação.
- Validações do harness não equivalem a testes da aplicação.

## Próximo passo

Apresentar ao autor a divisão de demandas e aguardar orientação para iniciar F01. Na próxima demanda, explicar e definir a base tecnológica considerando o autor iniciante, o prazo e o acesso em vários dispositivos. Se necessário, fazer uma pergunta por vez. Registrar a tarefa como `em_andamento` apenas quando sua execução começar e manter no máximo uma nessa condição.

Não implementar todas as demandas em uma única interação. Não criar commits sem solicitação. Atualizar os três arquivos de estado ao encerrar cada sessão e registrar evidências antes de concluir qualquer feature.

## Premissa obrigatória de idioma

Usar português do Brasil em todo código autoral: nomes de arquivos e pastas da aplicação, variáveis, funções, classes, propriedades, campos do banco, rotas, identificadores HTML, classes CSS, comentários, mensagens, testes e documentação. Manter a grafia original de palavras reservadas, APIs, bibliotecas, comandos e contratos obrigatórios das ferramentas, sem exigir inglês no esquema autoral do harness. Usar identificadores sem acentos, como calcularTotal e precoUnitario, preservando acentuação nos textos exibidos ao usuário.

## Adequação de idioma (F08)

- Campos e estados do harness agora usam português; consultar o esquema no guia.
- Funcionalidades F01 a F07 continuam pendentes. A manutenção F08 foi aprovada e movida para concluidas; JSON, preservação dos dados, esquema documentado e espaços conferidos, sem falhas. Nenhuma tarefa em andamento.
- Não reutilizar scripts antigos que dependam das chaves anteriores em inglês.
