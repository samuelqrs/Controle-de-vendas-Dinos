# DINNOS — Pedidos da pizzaria

Projeto acadêmico construído por etapas com HTML5, CSS3 e TypeScript, sem framework de interface. O F01 prepara a primeira página; registro e consulta de pedidos ainda não estão disponíveis.

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
- aplicacao/principal.ts: comportamento do botão que mostra e oculta as próximas etapas. Os tipos ajudam a detectar erros antes de executar.
- package.json: dependências e comandos do projeto; suas chaves e os nomes dev, build, preview e test seguem convenções das ferramentas.
- package-lock.json: versões exatas das dependências, para repetir a instalação.
- tsconfig.json: regras de checagem do TypeScript, incluindo o modo estrito.
- testes/pagina.test.mjs: teste do pacote de publicação, executado pelo próprio Node.js.
- dist/: HTML, CSS e JavaScript gerados para publicação. Não editar nem versionar.
- harness/: planejamento, evidências e continuidade por branch.

HTML define o que existe; CSS define a apresentação; JavaScript define as interações. Escrevemos essas interações em TypeScript, que acrescenta tipos ao JavaScript. Por exemplo, HTMLButtonElement identifica um botão; boolean representa verdadeiro ou falso. As anotações de tipo não vão para o navegador.

Em principal.ts, querySelector encontra os elementos pelo identificador; addEventListener reage ao clique; hidden controla a visibilidade; aria-expanded comunica o estado do botão às tecnologias assistivas. O teste de existência dos elementos evita acessar um elemento ausente.

## Compilar e verificar

```powershell
npm test
npm run preview
```

npm test executa a checagem de tipos, gera dist/ e verifica se o HTML publicado usa português e referencia arquivos JavaScript e CSS existentes. Esse teste não substitui a verificação de aparência e interação no navegador. O preview serve a compilação, normalmente em http://127.0.0.1:4173; encerre com Ctrl+C. Para apenas compilar, use npm run build.

## Roteiro manual do F01

1. Execute npm run dev e abra a URL Local. Confira o título DINNOS e a apresentação, sem erros visíveis.
2. Clique em “Conhecer as próximas etapas”: a lista deve aparecer e o texto do botão deve mudar para “Ocultar as próximas etapas”. Clique novamente: a lista deve desaparecer.
3. Use Tab até o botão e pressione Enter ou Espaço. Confira o contorno de foco e a mesma alternância.
4. Reduza a janela para aproximadamente 390 pixels de largura. Confira se o conteúdo fica em uma coluna, legível e sem rolagem horizontal.
5. Explique com suas palavras qual arquivo muda o conteúdo, qual muda a aparência e qual controla o botão; explique por que o navegador recebe JavaScript.

Relate quantos dos cinco passos executou e qualquer diferença observada. A execução e a explicação pelo autor são a tarefa F01-T04 e ainda precisam ser confirmadas.

## Persistência e publicação futuras

A base escolhida é HTML + CSS + TypeScript, com Vite para desenvolvimento e compilação. Supabase fica previsto para banco PostgreSQL compartilhado, autenticação e regras de acesso na F05: salvar apenas no navegador não permitiria consultar os mesmos pedidos em outro dispositivo. Nenhuma conexão com banco foi criada no F01.

A publicação planejada é no Netlify: comando de build npm run build e diretório de publicação dist. Não há site publicado ou conta provisionada nesta etapa. Conferir os limites e condições dos serviços antes do uso. O controle de acesso será definido antes de gravar dados de clientes; nunca colocar chaves privilegiadas no código da página.

Referências oficiais: [Vite](https://vite.dev/guide/), [TypeScript](https://www.typescriptlang.org/tsconfig/), [Supabase Auth](https://supabase.com/docs/guides/auth), [Netlify](https://docs.netlify.com/manage/projects/add-new-project/).
