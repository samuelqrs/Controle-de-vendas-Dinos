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

## 2026-11-13 — Início do F01

- Autor solicitou executar F01. F01-T01 em andamento; demais tarefas preservadas.
- Premissa: manter aprendizagem incremental e considerar o prazo interpretado como 18/11/2026.
- Recomendação apresentada: HTML5, CSS3 e JavaScript sem framework; Supabase para persistência compartilhada na F05 e Netlify para futura publicação. TypeScript acrescenta configuração e conceitos nesta etapa.
- Consultada a documentação oficial de Supabase (Auth e RLS) e Netlify (publicação de arquivos estáticos). Serviços propostos, sem contas ou recursos criados.
- Decisão tecnológica aguardando resposta do autor. Nenhuma página criada nesta etapa de definição.
- Baseline: main...origin/main sem alterações. Verificadores do harness continuam indisponíveis. Preferências locais ausentes; recomenda-se criá-las quando houver template.
- Bloqueios e riscos: F01-T04 exige execução e explicação pelo autor; não pode ser aprovada somente por verificação do agente.

## 2026-11-13 — Lembrete ao concluir tarefas

- Premissa solicitada pelo autor: ao fim de cada tarefa, lembrar de solicitar o commit. Registrada no guia e nas convenções da lista. O lembrete não autoriza commits automáticos.

## 2026-11-13 — Implementação da base do F01

- Escolha do autor: TypeScript, aceitando configuração adicional. Mantidos HTML5 e CSS3; Vite cuida do servidor e da transformação para JavaScript, com tsc separado para checagem de tipos. Supabase e Netlify previstos para etapas futuras, sem recursos externos criados.
- T01, T02 e T03 aprovadas; T04 em andamento, aguardando execução e explicação pelo autor. F01 não aprovada. F02 a F07 preservadas.
- Criados index.html, aplicacao/principal.ts, aplicacao/estilos.css, package.json, package-lock.json, tsconfig.json, .gitignore, README.md e testes/pagina.test.mjs. Página responsiva com botão acessível de mostrar/ocultar etapas. Sem cardápio ou pedidos implementados.
- README.md explica cada arquivo, HTML/CSS/TypeScript e o fluxo de compilação. AGENTS.md e estado atual do guia alinhados.
- npm install --cache .npm-cache: primeira tentativa falhou com ENOTFOUND no ambiente restrito; nova tentativa com acesso autorizado concluída, 16 pacotes adicionados, auditoria sem vulnerabilidades. Instalados TypeScript 6.0.3 e Vite 8.3.8; Node.js v26.13.0 e npm 11.20.0 disponíveis. Cache e dependências ignorados pelo Git.
- npm test: checagem de tipos e compilação aprovadas; 1 teste de recursos publicados passou, 0 falhas. O teste verifica idioma do HTML e existência dos arquivos JS e CSS referenciados na compilação.
- npm run dev -- --strictPort: servidor iniciado em 127.0.0.1:5173. Execução restrita não acessível ao navegador; reinício com permissão resolveu. Navegador confirmou conteúdo, expansão por clique e recolhimento com Enter, layout desktop e móvel em viewport 390x844, sem rolagem horizontal (larguras do documento e conteúdo iguais: 375 px, descontada a barra vertical) e sem erros no console observado. Capturas em harness/main/evidencias/f01-desktop.jpg e f01-movel.jpg.
- npm run preview -- --strictPort: prévia da compilação iniciou em 127.0.0.1:4173. Interação nessa prévia não verificada; recursos do pacote cobertos pelo teste automatizado. Requisições HTTP pelo node_repl permaneceram indisponíveis no ambiente restrito; a página foi efetivamente observada pelo navegador.
- Preferências locais continuam ausentes; recomenda-se sua criação quando houver template. Não foi criada silenciosamente. Nenhum ZIP alterado e nenhum commit criado.

### Bloqueios e riscos do F01

- Falta o autor executar o roteiro manual de cinco passos e explicar os papéis dos arquivos (F01-T04). Não atribuir ao autor os testes feitos pelo agente. Zero cenários relatados pelo autor até aqui.
- Não iniciar F02 antes de encerrar essa pendência. Persistência, autenticação e publicação permanecem futuras; nenhuma conexão com banco ou site público existe no F01.
- Lembrete solicitado: ao fim de cada tarefa, lembrar o autor de solicitar o commit; não criar commits automaticamente.

- Revisão final do estado: JSON válido; F02 a F07 e F08 preservadas em comparação com HEAD; 24 tarefas e identificadores únicos, responsáveis e estados válidos, apenas F01-T04 em andamento. Arquivos autorais novos sem espaços finais. Servidores de desenvolvimento e preview encerrados após as verificações.
- git diff --check sem erros; somente avisos de conversão LF/CRLF. Revisados os diffs de AGENTS.md e do guia.

## 2026-11-13 — Registro das tarefas concluídas

- Autor solicitou o commit de F01-T01, F01-T02 e F01-T03. Agrupamento: base TypeScript, primeira página, documentação, evidências e estado pertinente do harness em um commit. Incluído o lembrete de commit solicitado durante essas tarefas.
- Mantidas F01 e F01-T04 em andamento; nenhuma prática relatada pelo autor. Evidências de npm test e navegador da implementação preservadas; sem alterações executáveis posteriores que exijam repetir testes.

## 2026-11-13 — Mobile first e continuidade autorizada

- Premissa explícita: Adotar mobile first: projetar e implementar primeiro para telas pequenas; definir o CSS base para dispositivos móveis e ampliar o layout com media queries min-width. Verificar navegação por toque e teclado, legibilidade e ausência de rolagem horizontal antes de conferir telas maiores.
- Autor relatou prática concluída e dispensou as perguntas de confirmação. F01-T04 aprovada com essa dispensa; cenários e compreensão conceitual não verificados em detalhe. F01 encerrada com base nas verificações técnicas anteriores e na dispensa explícita do autor.
- F02 autorizada: usar premissas fictícias e ajustáveis, sem exigir decisões do autor. T01 aprovada por delegação; T02 em andamento.
- Lembrete: solicitar o commit de F01-T04 concluída e das premissas registradas. Não criar commit sem nova solicitação.

## 2026-11-13 — F02 concluída com mobile first

- Cardápio pré-cadastrado e fictício em aplicacao/cardapio.ts: quatro sabores com preços por tamanho, quatro bebidas (refrigerantes e sucos) e três adicionais. Regras e todos os preços documentados no README.md; valores em centavos e formatação em reais. Nenhuma regra de pedido implementada antes de F03/F04.
- CSS refeito com base móvel em uma coluna e ampliações min-width 640/1024 px. Controles com altura mínima de 44 px e foco visível. Premissa registrada em AGENTS.md e nas convenções do harness.
- F02-T02 e T03 aprovadas; F02 movida para concluidas. npm test passou: checagem de tipos, build e três testes (dados, formatação, recursos publicados), sem falhas. Não houve nova dependência.
- Navegador: comparados 12 preços de pizzas nos três tamanhos e limites de sabores, quatro bebidas e três adicionais; apresentação móvel e desktop sem rolagem horizontal; console observado sem erros. Evidências em harness/main/evidencias/f02-movel.jpg e f02-desktop.jpg.
- Servidor preexistente em 5173 reutilizado; nova tentativa com strictPort falhou por porta ocupada. Não encerrar o servidor preexistente do autor.
- Bloqueios e riscos: dados e regras são premissas delegadas e ajustáveis, não preços reais. Prática do F01 relatada sem quantidade de cenários e sem explicação conceitual; confirmação detalhada dispensada expressamente. Controle de acesso e armazenamento compartilhado permanecem futuros.
- Lembrete ao concluir T02 e T03: solicitar o commit das tarefas e das premissas, quando desejar. Nenhum commit criado nesta etapa. Próxima funcionalidade: F03, sem iniciar nesta sessão.
- Verificação final: JSON válido, 24 tarefas únicas e nenhuma em andamento; arquivos autorais sem espaços finais. git diff --check sem erros, apenas avisos de LF/CRLF.

## 2026-11-13 — Commit do cardápio e das premissas

- Autor solicitou comitar as tarefas concluídas. Agrupamento: F02, mobile first e encerramento de F01-T04, com código, documentação, testes, capturas e estado do harness em um commit.
- Preservadas as verificações da implementação: npm test com três testes aprovados, checagem de tipos, build e conferência no navegador. Sem alterações executáveis posteriores; não foi necessário repetir esses testes para o commit. F03 permanece não iniciada.

## 2026-11-13 — F03 concluída: montagem do pedido

- Autor solicitou iniciar F03; mantida a delegação anterior para premissas ajustáveis. Nome e telefone com DDD obrigatórios; entrega exige logradouro, número, bairro e cidade; complemento e observações opcionais. Dinheiro, Pix e cartão apenas informativos. Quantidade inteira de 1 a 99; sabores conforme o tamanho; adicionais por pizza.
- F03-T01 aprovada por delegação; T02 implementou formulário, rascunho em memória, inclusão, edição, cancelamento e remoção. T03 aprovada após verificações. F03 movida para concluidas. F04 a F07 preservadas e não iniciadas.
- Novos arquivos: aplicacao/pedido.ts (tipos e validações), aplicacao/montagem.ts (formulário e eventos), testes/pedido.test.mjs. Estrutura, regras, explicação de eventos/estado e roteiro manual documentados no README e AGENTS. Sem nova dependência.
- npm test passou: tipos, compilação e sete testes, zero falhas. Cobertos campos obrigatórios, telefone, entrega/retirada, pedido vazio, limites por tamanho, sabores/adicionais/bebidas inválidos, duplicatas e quantidades zero, negativas, fracionárias e fora do intervalo.
- Navegador móvel antes do desktop: pedido de retirada e de entrega com pizza média de dois sabores, bacon e bebida; conferência; edição da quantidade, cancelamento preservando o original e remoção; bloqueios para pedido vazio, endereço ausente, pizza sem sabor/excesso e quantidade zero; Enter e Tab conferidos. Sem rolagem horizontal em 390x844 (375 px de conteúdo) e 1280x900 (1265 px). Console observado sem erros. Capturas em harness/main/evidencias/f03-movel.jpg e f03-desktop.jpg.
- Baseline automatizado demorou a concluir e finalizou durante as alterações; não representa execução isolada do código original. A execução final dos sete testes verificou a implementação. Branch inicialmente limpa em main, último commit db3dcc0. Verificadores rápido/completo próprios do harness indisponíveis; revisão de JSON e diff usada para o estado, separada dos testes da aplicação.
- Lembretes de commit apresentados ao encerrar T01, T02 e T03. Nenhum commit criado. Servidor preexistente em 5173 reutilizado e preservado. Preferências locais ausentes; recomenda-se criar harness/user_preferences.md quando houver template, sem criação silenciosa.

### Bloqueios e riscos atuais

- Rascunho existe apenas em memória e é perdido ao recarregar; aviso exibido na tela. Cálculo do total é F04; gravação compartilhada e acesso são F05. Nenhum pagamento é processado.
- Dados e regras são fictícios e ajustáveis. Testes feitos pelo agente; prática do autor não verificada. Não foi feita uma auditoria completa de acessibilidade nem teste em aparelho físico.


## 2026-11-13 — F04: cálculo e revisão dos valores

- Autor solicitou continuidade após a F03; iniciada somente F04. Branch main, com alterações anteriores da F03 preservadas; nenhum commit criado. Último commit db3dcc0.
- T01 aprovada por delegação: taxa fictícia fixa de R$ 5,00 por pedido de entrega, retirada sem taxa; rascunho vazio mostra zero. Venda registrada apenas após gravação bem-sucedida na futura F05; forma de pagamento informada não confirma recebimento.
- T02 implementada: aplicacao/valores.ts com funções puras que usam centavos inteiros; pizza pelo sabor mais caro, adicionais por unidade, quantidades, bebidas, subtotal, taxa e total. Valores por item e resumo automático na interface. Revisão de cliente, modalidade, endereço, pagamento, observações e total apenas após validação; invalidada por qualquer alteração e impedida durante edição aberta. README explica funções, centavos e roteiro manual; AGENTS atualizado. Sem novas dependências.
- Baseline: tipos e sete testes existentes aprovados. npm test do baseline também concluiu com sete testes, zero falhas, build anterior à implementação da F04. Verificadores próprios do harness continuam indisponíveis. Preferências locais ausentes; recomenda-se criá-las quando houver template, sem criação silenciosa.
- Seis testes novos em testes/valores.test.mjs passaram isoladamente: preços nos tamanhos, combinação pelo maior preço, adicionais e múltiplas quantidades, bebida, taxa única, pedido vazio, edição/remoção sem mutação, inteiros na quantidade máxima e rejeição de dados inválidos. Resultados esperados literais calculados independentemente.
- Navegador primeiro móvel 390x844 (375 px de conteúdo), depois desktop 1280x900 (1265 px): sem rolagem horizontal. Exemplo verificado: duas pizzas médias muçarela/frango com bacon R$ 106 + três colas R$ 36 = R$ 142 na retirada, R$ 147 na entrega. Edição para uma pizza gerou R$ 94 com entrega; remover bebidas gerou R$ 58; cancelar edição preservou R$ 147. Conferência com edição aberta impedida; nome/modalidade alterados ocultaram revisão; Enter acionou conferência. Console sem erros observados. Capturas f04-movel.jpg e f04-desktop.jpg. Servidor preexistente 5173 preservado.
- Revisão preliminar: git diff --check sem erros, apenas avisos LF/CRLF. 24 tarefas únicas, demais funcionalidades preservadas. Suíte completa final npm test aprovada: tipos, build e 13 testes, zero falhas. T03 e F04 aprovadas; F04 movida para concluidas, sem tarefas em andamento. Lembrete de commit apresentado também ao encerrar T03.

### Bloqueios e riscos da F04

- Taxa e preços fictícios, ajustáveis. O rascunho é perdido ao recarregar; nenhuma persistência ou cobrança existe. Supabase e Netlify permanecem previstos, sem provisionamento. Prática do autor não verificada; testes são do agente. Não realizada auditoria completa de acessibilidade nem teste em celular físico.
- Lembretes de commit apresentados ao encerrar T01 e T02. Não criar commits sem solicitação explícita. F05 a F07 não iniciadas.


## 2026-11-13 — Registro das F03 e F04 em commit

- Autor solicitou criar um commit com as alterações realizadas. Agrupamento: montagem, cálculo e revisão do pedido (F03/F04), com código, testes, documentação, capturas e estado pertinente do harness.
- Preservadas as verificações finais: npm test com tipos, build e 13 testes aprovados; navegador móvel e desktop; JSON válido e diff sem erros de espaços. Nenhuma alteração executável posterior exige repetir os testes. F05 a F07 permanecem não iniciadas.


## 2026-11-13 — F05: integração de gravação preparada

- Autor solicitou continuidade; iniciada F05. Baseline npm test passou com tipos, build e 13 testes, zero falhas. Branch main inicialmente limpa; último commit 9151f73. Verificadores próprios do harness indisponíveis. Preferências locais ausentes, sem criação silenciosa; recomenda-se criar quando houver template.
- Autor informou que ainda não possui projeto Supabase. Integração Supabase encontrada e sugerida; instalação/conexão não confirmada. Nenhum recurso externo provisionado, nenhum dado de cliente enviado à nuvem e nenhuma publicação realizada.
- T01 aprovada: Supabase Auth com contas criadas pelo administrador, sem cadastro público na aplicação; lista de atendentes autorizados e ativos, RLS e leitura compartilhada só entre autorizados. Visitantes e contas não autorizadas não acessam pedidos. Sessão em sessionStorage; saída local limpa a tela. Configuração e roteiro em banco/README.md; .env.example contém apenas exemplos públicos.
- T02 aprovada quanto à implementação: preparador/controlador em registro.ts, adaptação ao SDK em banco.ts, login e consulta por código em acesso.ts, integração à montagem. Código da tentativa é mantido após falha; confirmação só após resposta válida. Durante envio, rascunho bloqueado; após sucesso, Novo pedido inicia outro. Falha preserva os dados e orienta consultar o código antes de novo pedido.
- banco/001_criar_pedidos.sql cria catálogo interno, autorização e pedidos com data/atendente/dados/itens/descrições/preços/totais preservados. Função verifica acesso, dados, limites e total previsto; recalcula no servidor; grava atomicamente e retorna o original em repetição do mesmo código/conteúdo. Não permite edição/exclusão ou inserção direta pelos clientes.
- Dependências: @supabase/supabase-js 2.119.0 (execução) e @electric-sql/pglite 0.5.16 (desenvolvimento/testes). SDK inicialmente falhou com ENOTFOUND; instalação autorizada resolveu. npm audit da instalação não apontou vulnerabilidades. Lockfile atualizado. Nenhuma credencial incluída.
- Testes novos: configuração/validação, cópia dos dados, falhas sem falso sucesso, confirmação inválida e concorrência; migração executada em PostgreSQL via PGlite com auth.uid/users simulados. Cobertos catálogo, servidor, autorização/RLS, leitura por segundo atendente, bloqueio anônimo e sem permissão, autoautorização impedida, atomicidade, preço adulterado, repetição, imutabilidade e revogação. Primeira execução falhou na reabertura do PGlite; restaurar papel administrativo antes de fechar resolveu e a reabertura com registro/políticas passou. Retirada sem taxa acrescentada à suíte final.
- Tipos passaram. Navegador sem configuração: controles de acesso/gravação desativados com aviso explícito; montagem, revisão e total R$ 12 continuam funcionando. Móvel 390x844 (375 px de conteúdo), desktop 1280x900 (1265 px) sem rolagem horizontal; Enter conferido; console sem erros observados. Capturas f05-movel.jpg e f05-desktop.jpg. Servidor preexistente 5173 preservado.
- git diff --check sem erros; arquivos novos sem espaços finais. Suíte completa final npm test passou: tipos, build e 28 testes, zero falhas, incluindo nove subcenários PostgreSQL e o teste agrupador. F05 permanece em andamento por pendências externas. Lembretes de commit apresentados ao concluir T01 e T02; nenhum commit criado.

### Bloqueios e riscos atuais da F05

- F05 permanece em andamento, T03 em andamento e T04 não iniciada. Projeto Supabase, migração aplicada e contas reais de demonstração ainda inexistentes nesta sessão. Testes locais não comprovam Auth hospedado, comunicação real ou dois dispositivos. F06/F07 não iniciadas.
- Próximo requisito externo: criar/conectar projeto do autor, aplicar SQL, autorizar contas e configurar URL/chave pública no .env.local ou ambiente de build. Não pedir senhas/chaves privilegiadas no chat. Depois verificar gravação, reabertura, acesso e falha reais; orientar autor nos cinco cenários de banco/README.md e colher quantidade/resultados exatos. Zero cenários relatados pelo autor na F05.
- Rascunho ainda se perde ao recarregar. Em falha de rede, a gravação pode ter ocorrido sem resposta: consultar o código antes de iniciar outro pedido. Catálogo interno do banco e aplicação precisam ser atualizados juntos; o servidor rejeita total previsto divergente. Dados/preços fictícios. Não há confirmação de recebimento do pagamento.


## 2026-11-13 — Registro da implementação local da F05

- Autor solicitou criar um commit com as alterações realizadas. Agrupamento: autenticação e gravação via Supabase, migração PostgreSQL, configuração de exemplo, testes, documentação, capturas e estado pertinente do harness.
- Preservadas as verificações finais: npm test com tipos, build e 28 testes aprovados, navegador móvel/desktop e diff sem erros de espaços. Nenhuma alteração executável posterior exige repetir testes.
- F05 permanece em andamento: T03 aguarda projeto/configuração e validação hospedada; T04 aguarda teste do autor em dois dispositivos. F06/F07 não iniciadas. O commit não aprova essas verificações pendentes.
