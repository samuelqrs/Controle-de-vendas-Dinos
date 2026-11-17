# Continuidade da sessão

## Objetivo e estado

Construir o sistema acadêmico DINNOS por etapas, com aprendizagem do autor iniciante. Prazo interpretado como 18/11/2026, ainda sem confirmação explícita do mês. Branch única main.

F01, F02, F03, F04 e F08 aprovadas. F05 em andamento: T01/T02 configuradas e T03 aprovada com verificação hospedada; somente F05-T04 do autor em andamento. F06/F07 não iniciadas. Não avançar para F06 enquanto houver pendências da F05. Ler guia e três arquivos de estado antes de continuar.

Autor delegou decisões razoáveis e ajustáveis. Criou as contas Supabase e Netlify diretamente nos sites e confirmou a autorização da conta de atendente e a publicação pública. Não solicitar senhas no chat. Integrações Supabase/Netlify não estão conectadas nesta sessão; trabalho remoto realizado pelo navegador, sem copiar tokens de sessão.

## Aplicação e banco configurados

HTML5, CSS3 e TypeScript estrito com Vite, sem framework. Cardápio, montagem, validação e cálculo em aplicacao/. Pizzas pelo sabor mais caro no tamanho, adicionais por unidade e bebidas por quantidade; valores em centavos. Entrega fictícia R$ 5 por pedido, retirada sem taxa. Quantidades 1 a 99; até 100 linhas. Rascunho em memória, perdido ao recarregar. Pagamento informado não confirma recebimento.

Supabase DINNOS: lnqkycxtoaovoktnsgrj, organização DINNOS Free fdhrwwkuleiypwlqjdms, São Paulo. Migração banco/001_criar_pedidos.sql aplicada no SQL Editor. RLS ativa nas três tabelas, inclusive catálogo interno; cadastro público e login anônimo desativados, confirmação de e-mail mantida. Função de gravação valida acesso/dados, calcula no servidor, compara total previsto e preserva descrições/preços/data. Clientes não podem inserir diretamente, editar ou excluir pedidos.

.env.local criado neste ambiente com URL e chave pública; ignorado pelo Git. Não imprimir valores nem incluir arquivo no commit. SDK @supabase/supabase-js 2.119.0 em execução; @electric-sql/pglite 0.5.16 apenas nos testes. Senhas e chaves privilegiadas não estão no código. Sessão usa sessionStorage e precisa de novo login por origem/navegador.

Conta fictícia: atendente@dinnos.example, UUID 2e97c156-c7ff-4ed4-8563-dd34d2f829b6. Acesso aos pedidos concedido após confirmação explícita do autor, ativo = true verificado. Senha criada e guardada pelo autor; não ler ou solicitar. Após sucesso, o rascunho fica bloqueado e Novo pedido inicia outro. Em falha ambígua, consultar o código antes de novo pedido; repetir mesmo código/conteúdo não duplica.

## Publicação concluída em 17/11/2026

Endereço público: https://eloquent-pie-d5c729.netlify.app
Projeto Netlify: eloquent-pie-d5c729; implantação 6afc5cb5c5ae5b603ae178a5.

Autor aprovou explicitamente o envio e a visibilidade pública. Enviado pacote com apenas index.html e assets/ compilados; nenhuma senha, .env ou chave privilegiada. Sem plano pago, domínio personalizado, GitHub vinculado ou execução de agente de geração. Netlify inicialmente deixou o site restrito à equipe; Make public foi executado dentro da autorização recebida, e o endereço final foi aberto e verificado.

Pacote temporário .npm-cache/dinnos-publicacao.zip, SHA256 646EA99C3F1BB362EB274FE34C016FB8C0BDDBBE4D81BFDD5818F2287DC50FD3. Não versionar pacote/dist. Para atualizar, recompilar com configuração pública e enviar novo conteúdo de dist/. Sem integração Git automática.

## Verificações

npm test passou com tipos, build e 28 testes, zero falhas. PostgreSQL real via PGlite com somente auth.uid/users simulados: catálogo, RLS das três tabelas, gravação/retirada, idempotência, leitura compartilhada, negação, atomicidade, revogação e reabertura. O baseline falhou inicialmente ao recriar postmaster.pid dentro do OneDrive, inclusive fora do sandbox. Corrigido testes/banco.test.mjs para usar diretório temporário exclusivo do sistema, com verificação do caminho antes da remoção. Teste isolado (10) e suíte completa (28) passaram. Reset role sozinho não bastava.

Banco remoto: leitura e gravação anônimas bloqueadas por PostgreSQL 42501. Autor entrou na aplicação local; acesso autorizado observado pelo agente. Aplicação gravou pedido inteiramente fictício 6b4ea74d-9f04-4b52-888a-e01aec6cb7f6: duas pizzas médias muçarela/frango com bacon + três colas, entrega; subtotal 14200, taxa 500 e total 14700 centavos. Após recarregar, consulta preservou data/total. Depois de sair, nova tentativa sem login falhou sem falso sucesso e preservou o rascunho. Console observado sem erros.

Publicação: produção recompilada após configuração pública, build aprovado. Site final carregou HTML/CSS/JS e controles de acesso habilitados. Viewports 390x844 (375 px de conteúdo) e 1280x900 (1265 px), sem rolagem horizontal; console observado sem erros. Login/consulta na origem Netlify ainda não verificados; sessão local não é transferida.

Evidências em harness/main/evidencias/: f05-criacao-projeto.jpg, f05-rls-supabase.jpg, f05-conta-atendente.jpg, f05-autorizacao-preparada.jpg, f05-pedido-gravado.jpg, f05-persistencia-hospedada.jpg, f05-netlify-publicacao-preparada.jpg, f05-netlify-publicado.jpg, f05-publicado-movel.jpg e f05-publicado-desktop.jpg.

Servidor local de verificação encerrado pelo agente (sessão 53196). Para prática local, iniciar npm run dev; cache do Vite pode exigir execução autorizada. Para o teste compartilhado, usar a URL pública.

## Próximo passo obrigatório

Orientar autor a abrir a URL publicada no computador e celular e entrar com atendente@dinnos.example usando sua senha. Executar os cinco cenários de banco/README.md: gravar pedido, fechar/reabrir navegador e consultar, consultar no segundo dispositivo, verificar acesso negado e falha de rede sem falso sucesso. Pode usar o código fictício de referência acima para primeira conferência.

Obter quantidade exata e resultados dos cenários relatados pelo autor. Até aqui: zero cenários completos relatados. Não atribuir testes do agente ou viewport móvel a dois dispositivos físicos; recarregar a página não equivale a fechar/reabrir todo o navegador. F05 não aprovada até verificar o objetivo. Não iniciar F06 antes.

No painel SQL Monaco, substituir documento com Ctrl+A e colagem, não fill. Conferir inventário atual de abas; aba pública marcada como entrega. Não repetir autorização de acesso/publicação já recebida, salvo mudança de escopo que realmente exija nova confirmação.

## Registro no Git

Autor solicitou commit desta configuração/publicação, correção do teste, reforço de RLS, documentação, evidências e harness. Consultar git log para identificar o registro. F05-T04 permanece em andamento após o commit. Commits anteriores: 2da0bbe (integração local F05) e 9151f73 (F03/F04). Criar novos commits somente quando solicitado.

Verificadores próprios do harness indisponíveis; JSON e diff revisados separadamente dos testes da aplicação. Preferências locais ausentes, sem criação silenciosa; recomenda-se criar quando houver template. Manter português do Brasil, mobile first e no máximo uma tarefa em andamento.
