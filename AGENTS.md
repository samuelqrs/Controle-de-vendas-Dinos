# Orientações do repositório

## Estrutura e organização do projeto

O repositório está na etapa inicial. Contém recursos de skills e o planejamento no harness; ainda não há código, testes ou recursos da aplicação de vendas.

- `skills/professor-mode/SKILL.md`: instruções da skill de ensino.
- `skills/professor-mode/agents/openai.yaml`: metadados de apresentação da skill.
- `skills/professor-mode.zip`: pacote da skill.
- `.skill-build/problem-interviewer/`: arquivos de preparação da skill de investigação.
- `harness/guides/workflow.md`: procedimento de trabalho e formato do estado.
- `harness/main/state/feature_list.json`: funcionalidades pendentes e concluídas da branch `main`.
- `harness/main/state/progress.md`: progresso, decisões, verificações e riscos.
- `harness/main/state/session-handoff.md`: contexto e próximo passo para continuidade.

Manter as instruções e os metadados de cada skill juntos. Ao adicionar a aplicação, documentar sua estrutura e os comandos de preparação aqui. Não presumir um framework nem criar pastas vazias para seguir um modelo.

## Compilação, testes e desenvolvimento

Ainda não há manifesto de dependências, comando de compilação, servidor de desenvolvimento, formatador ou executor de testes. Comandos como `npm install` e `npm test` não são procedimentos estabelecidos.

Verificações úteis a partir da raiz:

- `git status --short --branch`: consultar a branch e as alterações pendentes.
- `git diff --check`: detectar erros de espaços em alterações rastreadas.
- `git diff -- AGENTS.md skills/ .skill-build/ harness/`: revisar orientações, skills e estado antes de preparar um commit.

Ler `harness/guides/workflow.md` e o estado da branch antes de executar uma demanda. Uma verificação do harness não equivale a um teste da aplicação.

## Idioma, estilo e nomes

Usar português do Brasil em todo código autoral: nomes de arquivos e pastas da aplicação, variáveis, funções, classes, propriedades, campos do banco, rotas, identificadores HTML, classes CSS, comentários, mensagens, testes e documentação.

Usar identificadores sem acentos, como `calcularTotal` e `precoUnitario`, e acentuação normal nos textos exibidos. Manter a grafia exigida pelas palavras reservadas, APIs, bibliotecas, comandos e contratos externos. O esquema interno do harness também usa português, conforme seu guia. Preservar os caminhos existentes de infraestrutura e das skills para manter suas referências.

Usar títulos descritivos em Markdown e instruções curtas e acionáveis. Usar dois espaços na indentação YAML e preservar os campos obrigatórios dos metadados no cabeçalho de `SKILL.md`. Nomear novas pastas de skills com palavras minúsculas separadas por hífens e preservar os nomes obrigatórios `SKILL.md` e `agents/openai.yaml`.

## Verificação

Ainda não há testes automatizados ou meta de cobertura. Nas alterações de skills, revisar manualmente o cabeçalho, os metadados, os caminhos e os exemplos. Ao atualizar um ZIP, verificar se seu conteúdo corresponde à pasta da skill. Não alterar pacotes sem confirmar o procedimento de empacotamento.

Nas alterações da lista de funcionalidades, validar o JSON, os identificadores, os responsáveis, os estados e a preservação das demandas existentes. Ao adicionar código executável, incluir testes adequados e documentar os nomes e o comando exato de execução.

## Commits e solicitações de revisão

Usar mensagens curtas e no imperativo, por exemplo `docs: esclarecer ativação do modo professor`. Separar assuntos sem relação em commits distintos. Criar commits somente quando solicitado.

Descrever a alteração, sua finalidade e as verificações realizadas. Vincular questões relacionadas quando houver. Incluir capturas de tela nas futuras alterações da interface e explicar atualizações de arquivos compactados e novas dependências.

## Segurança e configuração

Nunca incluir credenciais, tokens, arquivos locais de ambiente ou dados reais de vendas de clientes no controle de versão. Usar exemplos fictícios e documentar as configurações necessárias sem expor valores secretos.
