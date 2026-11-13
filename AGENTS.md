# Orientações do repositório

## Estrutura e organização do projeto

O repositório contém a primeira página da aplicação acadêmica DINNOS, em HTML5, CSS3 e TypeScript com Vite, além das skills e do planejamento no harness. Cardápio e registro de pedidos ainda não foram implementados.

- `index.html`: estrutura e conteúdo da primeira página.
- `aplicacao/principal.ts`: interações da página em TypeScript.
- `aplicacao/estilos.css`: apresentação e adaptação a telas pequenas.
- `testes/pagina.test.mjs`: verificação dos recursos da compilação.
- `package.json`, `package-lock.json` e `tsconfig.json`: dependências, comandos e checagem de tipos.
- `README.md`: preparação, explicações e roteiro manual.
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

Requer Node.js 22.12 ou superior e npm. Na raiz, usar `npm ci` com o lockfile existente (ou `npm install` ao alterar dependências), `npm run dev` para desenvolvimento, `npm run verificar` para tipos, `npm run build` para gerar `dist/`, `npm run preview` para conferir a compilação e `npm test` para compilar e executar o teste de recursos com node:test. Não há formatador configurado. Não editar nem versionar `dist/` e `node_modules/`. Consultar o roteiro de interação, teclado e tela pequena no README.md.

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

O teste automatizado `testes/pagina.test.mjs` verifica os recursos de publicação com `npm test`; não há meta de cobertura. Conferir também a interação e a apresentação no navegador conforme o README.md. Nas alterações de skills, revisar manualmente o cabeçalho, os metadados, os caminhos e os exemplos. Ao atualizar um ZIP, verificar se seu conteúdo corresponde à pasta da skill. Não alterar pacotes sem confirmar o procedimento de empacotamento.

Nas alterações da lista de funcionalidades, validar o JSON, os identificadores, os responsáveis, os estados e a preservação das demandas existentes. Ao adicionar código executável, incluir testes adequados e documentar os nomes e o comando exato de execução.

## Commits e solicitações de revisão

Usar mensagens curtas e no imperativo, por exemplo `docs: esclarecer ativação do modo professor`. Separar assuntos sem relação em commits distintos. Criar commits somente quando solicitado.

Descrever a alteração, sua finalidade e as verificações realizadas. Vincular questões relacionadas quando houver. Incluir capturas de tela nas futuras alterações da interface e explicar atualizações de arquivos compactados e novas dependências.

## Segurança e configuração

Nunca incluir credenciais, tokens, arquivos locais de ambiente ou dados reais de vendas de clientes no controle de versão. Usar exemplos fictícios e documentar as configurações necessárias sem expor valores secretos.
