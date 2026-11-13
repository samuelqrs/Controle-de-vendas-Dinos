# Fluxo de trabalho

Procedimento para iniciar, executar e encerrar sessões com estado
persistido em arquivos, independentemente da ferramenta utilizada.

## Estado atual do projeto

O repositório contém a primeira página da aplicação em HTML5, CSS3 e TypeScript,
com desenvolvimento e compilação via Vite e teste dos recursos publicados.
Também contém documentação, estado do harness e skills em `skills/` e
`.skill-build/`. Ainda não há CI. Consultar os comandos no README.md.

Não considerar uma validação do harness como teste da futura aplicação.

## Início de sessão

1. Confirmar a raiz do repositório e verificar alterações pendentes.
2. Identificar a branch atual. Em detached HEAD, solicitar a escolha
   de uma branch antes de criar estado.
3. Usar `harness/<branch>/state/`, preservando o nome literal da branch:
   `feature/vendas` corresponde a `harness/feature/vendas/state/`.
4. Se o estado não existir, copiar os templates de
   `harness/_examples/state/`, sem sobrescrever arquivos existentes.
5. Ler `harness/user_preferences.md`, se existir. Caso contrário,
   recomendar sua criação a partir do template; não criá-lo em silêncio.
6. Ler `feature_list.json`, `progress.md` e `session-handoff.md`.
7. Revisar os últimos commits.
8. Executar o verificador rápido do harness quando estiver disponível.

Se o baseline falhar, registrar a falha e resolvê-la antes de iniciar
uma funcionalidade. Preservar alterações preexistentes do usuário.

## Planejamento e execução

Responder ao usuário apenas em português do Brasil (pt-BR).
Usar português do Brasil no código e na documentação autorais, inclusive nos campos e valores do esquema interno do harness. Usar identificadores sem acentos e manter acentuação normal nos textos exibidos. Preservar a grafia exigida por palavras reservadas, APIs, bibliotecas, comandos e contratos externos. Manter os caminhos existentes de infraestrutura e das skills para preservar suas referências.

Declarar premissas antes de tarefas não triviais. Discutir decisões
em aberto com uma pergunta por vez.

Antes de executar um plano, registrar a funcionalidade em `feature_list.json`,
com objetivo, verificação e lista completa de tarefas.

Usar os estados `nao_iniciada`, `em_andamento`, `bloqueada` e `aprovada`.
Manter no máximo uma tarefa em andamento por vez.

Cada tarefa deve informar responsável (`agente` ou `autor`), estado
e evidência. O plano descreve os passos; não duplica seus estados.

Criar `plans/`, `specs/` e `handoffs/` somente quando necessários.
Planos e especificações permanecem na branch de origem.
Registrar referências explícitas quando o trabalho continuar em outra.

## Estrutura da lista de funcionalidades

O arquivo `feature_list.json` usa `versaoEsquema`, `ramificacao`,
`convencoes`, `funcionalidades` e `concluidas` na raiz.
Cada funcionalidade informa `identificador`, `titulo`, `estado`,
`objetivo`, `verificacao` e `tarefas`. Cada tarefa informa
`identificador`, `descricao`, `responsavel`, `estado` e `evidencia`.
Usar os estados e responsáveis em português definidos acima.
Não há integração externa que exija chaves em inglês neste esquema.
Os nomes existentes dos arquivos de infraestrutura permanecem iguais.

## Verificação e conclusão

Executar a verificação rápida sempre e a completa antes de revisão.
Executar também as verificações específicas dos arquivos alterados.

Registrar comandos, resultados e limitações na evidência.
Uma verificação não executada deve constar como “não verificada”.

Testes manuais relatados pelo usuário devem ser identificados como
“relatados pelo autor”, com quantidade exata e riscos aceitos.
Apresentar os passos manuais antes de solicitar sua execução.

Tarefas aprovadas não aprovam automaticamente a funcionalidade.
Marcar a funcionalidade como `aprovada` somente após verificar seu objetivo;
então movê-la de `funcionalidades` para `concluidas`.

Registrar verificações pendentes e riscos em `progress.md`.
Não iniciar o próximo plano enquanto houver pendências do atual.

## Fim de sessão

Atualizar os três arquivos de estado:

- `feature_list.json`: trabalho pendente e concluído, com evidências.
- `progress.md`: realizado, decisões e seção “Bloqueios e riscos”.
- `session-handoff.md`: objetivo, verificações e próximo passo.

Não depender do histórico da conversa para explicar como continuar.
Registrar o que não foi verificado e qualquer falha de baseline.

Criar commits somente quando solicitado. Antes, propor o agrupamento
por assunto e incluir o estado pertinente do harness.

## Preferências e arquivos protegidos

Preferências pessoais ficam em `harness/user_preferences.md`,
ignorado pelo Git, e prevalecem sobre preferências padrão do time.
Elas não autorizam divulgação de segredos ou ações destrutivas.

Não editar arquivos ZIP manualmente. Confirmar o procedimento de
empacotamento antes de atualizá-los; ele ainda não está documentado.

## Branches e merges

Trocar de branch não equivale a migrar o estado de trabalho.
Consultar sempre o diretório correspondente à branch ativa.

Durante merges, revisar os diretórios de estado incorporados.
Não apagar históricos de outras branches automaticamente.

## Lembrete de commit ao concluir tarefas

Ao fim de cada tarefa, lembrar o autor de solicitar o commit. O lembrete não autoriza criar commits; aguardar solicitação explícita.
