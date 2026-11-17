# DINNOS — Pedidos da pizzaria

Projeto acadêmico construído por etapas com HTML5, CSS3 e TypeScript, sem framework de interface. Cardápio, montagem, cálculo e revisão de rascunhos de pedidos disponíveis; gravação via Supabase configurada e verificada; listagem e detalhes publicados no Netlify.

O trabalho acadêmico segue o roteiro de ADS fornecido pelo autor: consultar
[exigências e pendências](trabalho/roteiro-academico.md) e a
[relatório](trabalho/trabalho-final.md). A empresa é identificada como
Dinos/Dino’s Pizzaria; DINNOS permanece o nome técnico da aplicação.

O relatório gerado está em `output/pdf/trabalho-dinnos.pdf`. A F07 foi concluída
com as limitações do levantamento documentadas; isso não representa aprovação
acadêmica pela instituição. A [demonstração comentada](trabalho/demonstracao-comentada.md)
foi preparada pelo agente por delegação do autor. O
[roteiro de demonstração](trabalho/roteiro-demonstracao.md) orienta a prática final.
Para gerar novamente o relatório após editar a fonte Markdown, use
`python trabalho/gerar-relatorio.py`, em Windows com a fonte Times New Roman e
o pacote Python `reportlab`. A geração não executa testes da aplicação nem
comprova aprovação acadêmica. Conferir visualmente todas as páginas após gerar.

O PDF registra a versão da F07. A evolução posterior, com cardápio oficial e três
telas, está no [complemento da F09](trabalho/atualizacao-f09.md).

## Preparar e executar

Instale Node.js 22.12 ou superior, com npm. Na raiz deste repositório, execute:

```powershell
npm install
npm run dev
```

Abra a URL Local informada pelo Vite, normalmente http://127.0.0.1:5173. Mantenha o terminal aberto e use Ctrl+C para encerrar. Não abra index.html por duplo clique: o navegador precisa receber o JavaScript transformado pelo servidor. Se o PowerShell bloquear npm.ps1, use npm.cmd nos mesmos comandos, sem alterar a política do computador.

O Vite transforma TypeScript em JavaScript e atualiza a página ao salvar. Essa transformação não substitui a checagem de tipos. Execute-a com:

```powershell
npm run verificar
```

Após clonar uma versão que já contém package-lock.json, use npm ci para instalar exatamente as versões registradas.

## Entender os arquivos

- index.html: estrutura e conteúdo da página, com cabeçalho, conteúdo principal e rodapé. O atributo lang informa o idioma.
- aplicacao/estilos.css: cores, tipografia, espaçamento e adaptação a telas pequenas.
- aplicacao/principal.ts: apresentação do cardápio e troca de tamanho; importa a montagem do pedido.
- package.json: dependências e comandos do projeto; suas chaves e os nomes dev, build, preview e test seguem convenções das ferramentas.
- package-lock.json: versões exatas das dependências, para repetir a instalação.
- tsconfig.json: regras de checagem do TypeScript, incluindo o modo estrito.
- testes/pagina.test.mjs: teste do pacote de publicação, executado pelo próprio Node.js.
- dist/: HTML, CSS e JavaScript gerados para publicação. Não editar nem versionar.
- harness/: planejamento, evidências e continuidade por branch.

HTML define o que existe; CSS define a apresentação; JavaScript define as interações. Escrevemos essas interações em TypeScript, que acrescenta tipos ao JavaScript. Por exemplo, HTMLButtonElement identifica um botão; boolean representa verdadeiro ou falso. As anotações de tipo não vão para o navegador.

Em principal.ts, querySelector encontra os elementos pelo identificador e addEventListener reage à mudança do tamanho. Em montagem.ts, os eventos atualizam os itens e os resumos; hidden controla a visibilidade do endereço e da revisão.

## Compilar e verificar

```powershell
npm test
npm run preview
```

npm test executa a checagem de tipos, gera dist/ e verifica se o HTML publicado usa português e referencia arquivos JavaScript e CSS existentes. Esse teste não substitui a verificação de aparência e interação no navegador. O preview serve a compilação, normalmente em http://127.0.0.1:4173; encerre com Ctrl+C. Para apenas compilar, use npm run build.

## Roteiro histórico do F01

1. Execute npm run dev e abra a URL Local. Confira o título DINNOS e a apresentação, sem erros visíveis.
2. Clique em “Conhecer as próximas etapas”: a lista deve aparecer e o texto do botão deve mudar para “Ocultar as próximas etapas”. Clique novamente: a lista deve desaparecer.
3. Use Tab até o botão e pressione Enter ou Espaço. Confira o contorno de foco e a mesma alternância.
4. Reduza a janela para aproximadamente 390 pixels de largura. Confira se o conteúdo fica em uma coluna, legível e sem rolagem horizontal.
5. Explique com suas palavras qual arquivo muda o conteúdo, qual muda a aparência e qual controla o botão; explique por que o navegador recebe JavaScript.

Esse roteiro documenta a primeira etapa e não descreve a navegação atual. Para a versão publicada, use o roteiro de telas e cardápio oficial abaixo.

## Persistência e publicação

A base é HTML + CSS + TypeScript, com Vite para desenvolvimento e compilação. A F05 usa Supabase para PostgreSQL compartilhado, autenticação e regras de acesso. A conexão foi configurada e a gravação hospedada verificada; o autor relatou os cinco cenários de verificação compartilhada com resultado esperado.

Demonstração publicada em [DINNOS](https://eloquent-pie-d5c729.netlify.app). A publicação usa npm run build e o conteúdo de dist/. O acesso aos pedidos exige uma conta de atendente autorizada no Supabase; nunca colocar chaves privilegiadas no código da página. Para uma nova instalação, configurar as variáveis públicas conforme banco/README.md.

Referências oficiais: [Vite](https://vite.dev/guide/), [TypeScript](https://www.typescriptlang.org/tsconfig/), [Supabase Auth](https://supabase.com/docs/guides/auth), [Netlify](https://docs.netlify.com/manage/projects/add-new-project/).

## Telas e cardápio oficial

A navegação separa três telas, sem recarregar o documento:

- Tela inicial: apresentação, cardápio e acesso do atendente.
- Lançamento de pedidos: dados, montagem, revisão e gravação.
- Relatórios: lista de pedidos e detalhes preservados, além da consulta por código.

O login concluído abre o lançamento. O botão Sair fica no cabeçalho em todas as
telas e limpa os dados. Trocar de tela preserva o rascunho; recarregar pode perdê-lo.
Os links antigos para montagem e consulta continuam encaminhando à tela correta.
Relatórios exibem registros de pedidos, sem comprovar recebimento de pagamentos.

Sabores e preços seguem o cardápio oficial fornecido pelo autor em 17/11/2026:

| Produto | Média | Grande |
| --- | ---: | ---: |
| Margherita | R$ 39,90 | R$ 49,90 |
| Calabresa | R$ 42,90 | R$ 52,90 |
| Portuguesa | R$ 44,90 | R$ 54,90 |
| Frango com Catupiry | R$ 45,90 | R$ 55,90 |
| Carne Seca | R$ 49,90 | R$ 59,90 |
| Romeu e Julieta | Indisponível | R$ 39,90 |
| Combo Franbacon + Coca-Cola 2 litros | Indisponível | R$ 59,90 |

Média e grande aceitam até dois sabores, pelo preço do mais caro. O combo é fechado,
inclui pizza grande e uma Coca-Cola de 2 litros. Adicionais, bebidas avulsas e entrega
ficam indisponíveis enquanto valores/escolhas não forem confirmados. Não há oferta
pequena nem diâmetro/fatias presumidos. A taxa interna zero corresponde à retirada,
não a entrega gratuita. Pedidos antigos conservam preços e descrições originais.

O tipo de preço por tamanho é parcial: um produto só pode ser montado no tamanho
em que possui preço. O combo não pode ser misturado com sabores avulsos. A aplicação
e a função do banco validam essas regras; os preços são inteiros em centavos.

### Roteiro manual atual

1. Em 390 px, confira as três opções da navegação e o login apenas na tela inicial.
2. Confira os cinco sabores na média; escolha grande e confira doce e combo.
3. No lançamento, adicione média Margherita/Frango com Catupiry (R$ 45,90).
4. Vá a Relatórios e volte: dados e itens do rascunho devem continuar iguais.
5. Adicione o combo grande de R$ 59,90; confira total R$ 105,80, retirada e taxa zero.
6. Confira que doce e combo não podem ser montados na média e que três sabores ou
   mistura de combo são rejeitados; bebidas avulsas, adicionais e entrega não são oferecidos.
7. Entre na tela inicial, revise e grave com dados fictícios. Guarde código/data/total.
8. Em Relatórios, atualize e abra o mesmo código; confira itens e valores. Após sair,
   os resultados devem desaparecer e a consulta deve exigir autorização.
9. Repita navegação por Tab/Enter, conferindo foco, legibilidade e ausência de
   rolagem horizontal, antes de ampliar para desktop.

Execute npm test: checagem de tipos, build e 37 testes, incluindo regras oficiais,
migração PostgreSQL, histórico, acesso, gravação, consultas e rotas antigas/atuais.
Os roteiros históricos de F01 a F07 ficam registrados no harness e no trabalho
acadêmico, com seus preços e capturas da época.

## Gravação compartilhada — F05

A integração foi implementada com o SDK oficial @supabase/supabase-js. Sem
configuração, a tela informa indisponibilidade e não simula gravação. Configure
o projeto, as contas e a autorização conforme [banco/README.md](banco/README.md).
Copie .env.example para .env.local, preencha apenas URL e chave pública e reinicie
o servidor. Não envie senhas ou chaves privilegiadas ao chat nem ao repositório.

O fluxo passa por acesso.ts (login), registro.ts (validação e código da tentativa),
banco.ts (requisição autenticada) e registrar_pedido (função PostgreSQL). O banco
recalcula valores e guarda descrições, preços, itens, cliente, data e atendente.
A interface só mostra sucesso depois de receber confirmação do banco. Falhas
preservam o rascunho e o código para consulta/repetição sem duplicação.

Após conferir dados e valores, use “Gravar pedido no banco”. A gravação confirmada
fica bloqueada para edição; “Novo pedido” inicia outro rascunho. A conferência por
código permite verificar persistência após reabrir ou em outro dispositivo.
A listagem e os detalhes completos da F06 estão publicados, com
páginas de 20 pedidos, dos mais recentes aos mais antigos. Entre como atendente,
abra a tela “Relatórios”, clique em “Atualizar pedidos” e depois em
“Ver detalhes”. A tela usa os valores preservados no registro e limpa os resultados
ao sair. A consulta autenticada e o layout móvel/desktop foram conferidos;
o site publicado foi atualizado. Execute `npm test` para os testes, incluindo `testes/consulta.test.mjs`
(detalhes históricos, lista vazia, falha e invalidação de consultas após sair).

Execute npm test para tipos, build e testes. testes/registro.test.mjs verifica
configuração, isolamento dos dados, falhas, respostas inválidas e reenvio.
testes/banco.test.mjs executa a migração real com PostgreSQL via PGlite, testa RLS,
autorização, preço no servidor, repetição, atomicidade e persistência após reabrir.
O contrato de autenticação do Supabase é simulado nesses testes locais; conexão
real e Auth hospedado foram verificados no projeto configurado em 17/11/2026; o teste do autor em dois dispositivos permanece pendente.

O roteiro de cinco cenários para o autor está em banco/README.md. Não considerar
testes locais como relato do autor ou verificação da nuvem.

## Publicação de demonstração e verificação compartilhada

Endereço: https://eloquent-pie-d5c729.netlify.app

A publicação manual no Netlify foi autorizada pelo autor em 17/11/2026 e usa apenas
index.html e assets/ produzidos por npm run build. Nenhum arquivo .env, senha ou
chave privilegiada foi enviado. O pacote temporário fica em .npm-cache, ignorado.
Ao atualizar a aplicação, compilar novamente com a configuração pública correta
e publicar o novo conteúdo de dist/; não versionar dist/ ou seu pacote.

Acesso à aplicação: conta de demonstração atendente@dinnos.example, com a senha
criada e guardada pelo autor. A senha não está no repositório. O site é público;
consulta e gravação de pedidos dependem de autenticação e autorização no banco.

O pedido fictício 6b4ea74d-9f04-4b52-888a-e01aec6cb7f6 foi gravado pelo agente com
total de R$ 147,00 e preservado após recarregar a aplicação. Ele pode ser usado
como referência na conferência por código. O roteiro completo do autor em dois
dispositivos está em banco/README.md; os resultados ainda não foram relatados.
