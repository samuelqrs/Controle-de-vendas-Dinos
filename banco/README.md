# Preparar o banco compartilhado

## Acesso

Contas de atendentes são criadas pelo administrador no Supabase Auth. A aplicação
não oferece cadastro público. Uma conta autenticada precisa também constar em
atendentes_autorizados com ativo = true. Todos os atendentes autorizados consultam
os mesmos pedidos. Visitantes e contas sem autorização não leem nem gravam pedidos.

A tabela de pedidos permite somente leitura aos clientes autorizados; gravação é
feita pela função registrar_pedido, que verifica autorização e dados, calcula preços
no servidor a partir do catálogo interno e preserva descrições/preços/data. Não há
permissão de editar ou excluir pedidos pela aplicação. Revogar ativo impede novas
consultas e gravações, inclusive com token de sessão ainda válido.

## Criar e configurar

1. Crie um projeto Supabase na sua conta. Escolha a região e guarde a senha do banco
   no gerenciador de senhas; não envie senhas ou chaves privilegiadas ao chat.
2. Execute banco/001_criar_pedidos.sql uma vez no SQL Editor do projeto novo.
   A migração é transacional e cria tabelas, políticas, catálogo e função de gravação.
3. Em Authentication, desabilite cadastro público e crie a conta de demonstração
   com e-mail e senha. Registre o UUID dessa conta em atendentes_autorizados pelo
   painel administrativo: identificador = UUID da conta; ativo = true.
4. Copie .env.example para .env.local. Configure a URL HTTPS do projeto e a chave
   pública sb_publishable_. Elas identificam o projeto; RLS e a autorização protegem
   os dados. Nunca use sb_secret_, service_role ou senha do banco no Vite.
5. Reinicie npm run dev. Entre pela seção “Acesso do atendente”. Use dados fictícios.
6. Para outro dispositivo, publique a compilação com as mesmas duas variáveis
   públicas no ambiente de build (npm run build, diretório dist). Não desative
   políticas nem abra acesso anônimo para facilitar a demonstração.

A sessão usa sessionStorage: permanece ao recarregar a aba e exige novo login em
outro navegador/dispositivo ou após encerrar a sessão da aba. “Sair e limpar tela”
encerra a sessão local e remove da tela o rascunho e os resultados consultados.

## Fluxo e falhas

Confira o rascunho antes de gravar. Um código UUID identifica a tentativa; a mesma
tentativa mantém o código durante novas tentativas. O banco grava tudo numa única
transação e retorna confirmação com data do servidor e total. Só essa resposta
é apresentada como sucesso. Durante envio, o rascunho não pode ser alterado.

Se a conexão cair, o resultado pode ser desconhecido: guarde o código e use
“Conferir gravação por código” antes de começar outro pedido. Repetir o mesmo
código e conteúdo retorna o original, sem duplicar. Mesmo código com conteúdo
diferente é rejeitado caso já exista. Um pedido confirmado fica bloqueado para
evitarmos reenvio acidental; “Novo pedido” limpa o formulário e gera novo código.
O rascunho não é persistido localmente; recarregar pode perdê-lo.

A consulta por código confirma existência, data e total para a verificação da F05.
Listagem e detalhes completos pertencem à F06 e não foram iniciados.

## Catálogo e testes

O catálogo interno da migração contém os mesmos dados fictícios de cardapio.ts e
a taxa de valores.ts. Ao mudar produtos/preços, criar migração nova para o banco
e atualizar a aplicação juntos; não editar pedidos existentes. O servidor recusa
gravar se o total calculado diferir do total previsto pelo rascunho.

Execute npm test. O SDK oficial @supabase/supabase-js cuida de login e renovação
de sessão. @electric-sql/pglite é dependência apenas de desenvolvimento para
executar a migração em PostgreSQL isolado e testar políticas e gravação. Esses
testes não substituem conexão real com Supabase nem os dois dispositivos.

## Roteiro de dois dispositivos — F05

1. No dispositivo A, entre com atendente autorizado e grave um pedido fictício de
   entrega com pizza personalizada e bebida. Anote código, data e total confirmados.
2. Feche e reabra o navegador. Entre novamente se solicitado e consulte o código.
   Confira a mesma data e o mesmo total.
3. No dispositivo B, abra a aplicação publicada, entre com conta autorizada e
   consulte o mesmo código. Confira correspondência com A.
4. Saia e tente consultar sem login; depois entre com uma conta criada no Auth,
   mas ausente da autorização. Ambas devem ser impedidas.
5. Monte outro pedido, desconecte a rede e tente gravar. Deve mostrar falha sem
   confirmação de sucesso e preservar o rascunho. Reconecte e consulte o código;
   se ausente, repita a tentativa. O mesmo código não deve gerar dois registros.

Relate a quantidade exata dos cinco cenários executados, o resultado de cada um
e qualquer diferença. Não envie dados de clientes reais ou senhas.

## Referências oficiais

- [Chaves públicas e privilegiadas](https://supabase.com/docs/guides/getting-started/api-keys)
- [Políticas RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Login com senha](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Chamadas de funções](https://supabase.com/docs/reference/javascript/rpc)
- [PGlite](https://pglite.dev/docs/)
