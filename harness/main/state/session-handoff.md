# Continuidade da sessão

## Objetivo e estado

Construir o sistema acadêmico DINNOS por etapas, com aprendizagem do autor iniciante. Prazo interpretado como 18/11/2026, ainda sem confirmação explícita do mês. Branch única main.

F01, F02, F03, F04 e F08 aprovadas. Nenhuma tarefa em andamento. F05 a F07 não iniciadas. Ler o guia e os três arquivos de estado antes de continuar. Autor delegou premissas razoáveis e ajustáveis, sem exigir respostas a perguntas.

Aplicação em HTML5, CSS3 e TypeScript estrito com Vite, sem framework. Cardápio fictício em aplicacao/cardapio.ts; montagem e edição em aplicacao/montagem.ts; tipos/validação em aplicacao/pedido.ts; cálculo em aplicacao/valores.ts. Rascunho em memória, perdido ao recarregar, com aviso na tela. Sem persistência ou cobrança.

## Regras atuais

Nome e telefone com DDD (10/11 dígitos) obrigatórios. Entrega exige logradouro, número, bairro e cidade; retirada dispensa endereço. Complemento e observações opcionais. Dinheiro, Pix ou cartão informativos. Quantidades inteiras 1 a 99; sabores conforme tamanho. Pizza pelo sabor mais caro no tamanho, mais adicionais por unidade; bebidas por quantidade. Valores em centavos inteiros. Taxa fictícia fixa R$ 5 por pedido de entrega, retirada sem taxa. Rascunho vazio mostra zeros.

Venda registrada somente após gravação bem-sucedida na futura F05; pagamento informado não confirma recebimento. Conferência mostra dados e total; qualquer alteração oculta a revisão. Conferir durante edição aberta exige salvar ou cancelar. Valores exibidos durante edição representam os itens já adicionados.

## Verificações

Baseline com sete testes e tipos/build passou. F04: npm test passou com tipos, build e 13 testes, zero falhas. Seis novos testes de valores usam resultados literais independentes; cobrem tamanhos, sabor mais caro, adicionais, quantidades, bebida, taxa única, edição/remoção, inteiros e rejeição de dados inválidos.

Navegador primeiro móvel 390x844, depois desktop 1280x900, sem rolagem horizontal; console observado sem erros. Exemplo: duas pizzas médias muçarela/frango com bacon R$ 106 + três colas R$ 36 = R$ 142 retirada/R$ 147 entrega. Edição para uma pizza gerou R$ 94; remover bebidas R$ 58; cancelar preservou R$ 147. Revisão invalidada ao mudar nome/modalidade e bloqueada com edição aberta; Enter conferido. Capturas f04-movel.jpg e f04-desktop.jpg em harness/main/evidencias/. Servidor preexistente 5173 reutilizado e preservado.

Verificadores próprios do harness indisponíveis. JSON com 8 funcionalidades e 24 tarefas únicas; demais funcionalidades preservadas. git diff --check sem erros, apenas avisos LF/CRLF. Prática do autor não verificada; não atribuir testes do agente ao autor. Sem auditoria completa de acessibilidade ou teste em celular físico.

## Próximo passo

F05: gravação compartilhada. Supabase foi previsto para PostgreSQL, autenticação e políticas de acesso; Netlify para publicação futura. Nenhum serviço provisionado. Consultar capacidades e documentação atual antes da integração. Definir acesso autorizado e configurações sem segredos, preservar itens/preços/data/identificação na gravação e tratar falhas sem falso sucesso. Não iniciar F06 antes de resolver as pendências da F05. T04 da F05 exige teste orientado do autor em dois dispositivos; apresentar roteiro antes de solicitar.

Manter pt-BR, mobile first, uma tarefa em andamento por vez e atualização dos três arquivos de estado. Preferências locais ausentes, sem criação silenciosa; recomenda-se criá-las quando houver template.

Autor solicitou registrar F03/F04 em um commit com código, testes, documentação, capturas e estado do harness. Consultar git log para identificar o registro. Último commit anterior db3dcc0. Lembrar o autor de solicitar o commit ao concluir tarefas; não criar sem pedido explícito.
