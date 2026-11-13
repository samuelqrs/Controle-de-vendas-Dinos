# Continuidade da sessão

## Objetivo e estado

Construir o sistema acadêmico DINNOS por etapas, com aprendizagem do autor iniciante. Prazo interpretado como 18/11/2026, ainda sem confirmação explícita do mês. Branch única main.

F01, F02, F03, F04 e F08 aprovadas. F05 em andamento: T01/T02 aprovadas quanto à definição e implementação local; somente T03 em andamento, aguardando configuração e testes reais; T04 do autor não iniciada. F06/F07 não iniciadas. Não iniciar próxima funcionalidade enquanto houver pendências da F05. Ler guia e três arquivos de estado antes de continuar.

Autor delegou premissas razoáveis e ajustáveis, sem exigir respostas de decisões rotineiras. Informou explicitamente que ainda não tem projeto Supabase e precisa criar. Integração Supabase descoberta e sugerida; instalação/conexão não confirmada. Não afirmar que foi instalada/conectada. Nenhum recurso externo provisionado ou publicado.

## Implementação e regras

HTML5, CSS3 e TypeScript estrito com Vite, sem framework. Cardápio em cardapio.ts; montagem em montagem.ts; validação em pedido.ts; cálculos em valores.ts. Valores em centavos, pizza pelo sabor mais caro no tamanho, adicionais por unidade, bebidas por quantidade. Entrega fictícia R$ 5 por pedido, retirada sem taxa. Quantidades 1 a 99; até 100 linhas por pedido. Campos e regras no README.

F05: acesso.ts implementa login e conferência de gravação por código; banco.ts adapta SDK oficial; configuracao.ts valida URL/chave pública; registro.ts prepara uma cópia dos dados e controla UUID estável, concorrência e confirmação. Sem configuração, controles ficam desativados e nenhum sucesso é simulado. Rascunho em memória, perdido ao recarregar. Falha de rede pode ter resultado desconhecido: consultar código antes de iniciar outro pedido; repetir mesmo código/conteúdo não duplica. Após confirmar, rascunho fica bloqueado e Novo pedido reinicia. Pagamento informado não confirma recebimento.

Banco em banco/001_criar_pedidos.sql: catálogo interno; Supabase Auth mais tabela de autorização; RLS para compartilhar apenas entre atendentes autorizados. Visitantes e contas sem autorização não leem/gravam. Gravação por função com validação, cálculo no servidor, comparação com total previsto e inserção atômica. Cliente não pode inserir diretamente, editar ou excluir registros. Data/atendente/dados/itens/descrições/preços preservados. Revogação de ativo impede acesso mesmo com token válido.

SDK @supabase/supabase-js 2.119.0 em execução; @electric-sql/pglite 0.5.16 apenas em desenvolvimento/testes. Lockfile atualizado. Instalação do SDK falhou com ENOTFOUND e foi repetida com autorização; instalações auditadas sem vulnerabilidades. .env.example tem exemplos; .env.local é ignorado e não foi criado. Sessão em sessionStorage; saída local limpa a tela.

## Verificações e limites

Baseline npm test passou com 13 testes, tipos e build antes da implementação. Final npm test passou com tipos, build e 28 testes, zero falhas. Novos testes de registro cobrem configuração, cópia, falhas, confirmação inválida e concorrência. Testes PostgreSQL executam migração real via PGlite e simulam somente auth.uid/users: nove subcenários de catálogo, gravação/retirada, idempotência, acesso compartilhado, negação, atomicidade, preço/imutabilidade, revogação e reabertura persistente. Falha inicial na reabertura foi corrigida restaurando papel administrativo antes de fechar; execução final passou.

Navegador primeiro móvel 390x844 (375 px), depois desktop 1280x900 (1265 px), sem rolagem horizontal; console observado sem erros. Acesso e gravação desativados sem configuração, aviso explícito; montagem/revisão com Enter e total R$ 12 mantidas. Capturas f05-movel.jpg e f05-desktop.jpg em harness/main/evidencias/. Servidor preexistente 5173 preservado.

Não verificados: Auth/Supabase hospedado, UI de login/gravação com projeto real, publicação e dois dispositivos físicos. Zero cenários relatados pelo autor na F05. Não atribuir testes locais ao autor ou à nuvem. Verificadores próprios do harness indisponíveis; JSON/diff revisados separadamente.

## Próximo passo obrigatório

Criar/configurar projeto Supabase na conta do autor. Instruções completas e roteiro de cinco cenários em banco/README.md. Se a integração for instalada/conectada, usar suas capacidades confirmadas para preparar o projeto; não repetir bloqueio de conexão se uma confirmação posterior chegar. Sem integração, orientar criação no painel. Não solicitar senhas/chaves privilegiadas no chat.

Aplicar SQL em projeto novo, criar contas de demonstração e autorizá-las; configurar URL HTTPS e chave pública sb_publishable_ no .env.local e reiniciar Vite. Desabilitar cadastro público no provedor. Verificar gravação, reabertura, acesso autorizado/negado e falha reais em T03. Preparar publicação para teste do autor em dois dispositivos; roteiro já documentado, pedir quantidade/resultados exatos na T04. Só aprovar F05 após verificar o objetivo.

Catálogo do banco e aplicação devem mudar juntos por migração nova; servidor rejeita total previsto divergente. Não editar registros históricos. Supabase/Netlify permanecem planejados; nenhum site publicado. Manter pt-BR e mobile first.

Autor solicitou registrar a implementação local da F05 em commit com código, migração, testes, documentação, capturas e harness. Consultar git log para identificar esse registro. As pendências da F05 permanecem inalteradas. F03/F04 estão no commit 9151f73. Lembretes de commit apresentados ao concluir F05-T01/T02. Preferências locais ausentes; recomenda-se criar quando houver template, sem criação silenciosa.
