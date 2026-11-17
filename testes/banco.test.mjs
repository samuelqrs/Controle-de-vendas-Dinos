import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { readFile as lerArquivo, mkdtemp as criarTemporario, rm as remover } from 'node:fs/promises';
import { tmpdir as pastaTemporariaSistema } from 'node:os';
import { resolve as resolverCaminho, dirname as pastaPai } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { tamanhos, sabores, bebidas, adicionais } from '../aplicacao/cardapio.ts';
import { taxaEntrega } from '../aplicacao/valores.ts';

testar('PostgreSQL verifica gravação, persistência e políticas de acesso', async contexto => {
  // O banco de teste fica fora da pasta do projeto, que pode ser sincronizada.
  const pastaTemporaria = resolverCaminho(pastaTemporariaSistema());
  const pasta = await criarTemporario(resolverCaminho(pastaTemporaria, 'dinnos-teste-banco-'));
  let banco = new PGlite(pasta);
  const atendenteA = '00000000-0000-4000-8000-000000000001';
  const atendenteB = '00000000-0000-4000-8000-000000000002';
  const semPermissao = '00000000-0000-4000-8000-000000000003';
  const codigo = '10000000-0000-4000-8000-000000000001';
  const dados = { nome: 'Cliente fictício', telefone: '(11) 99999-9999', modalidade: 'entrega', pagamento: 'pix', logradouro: 'Rua Exemplo', numero: '1', bairro: 'Centro', cidade: 'Cidade Exemplo', complemento: '', observacoes: 'Sem cebola' };
  const itens = [{ tipo: 'pizza', tamanho: 'media', sabores: ['mucarela', 'frango'], adicionais: ['bacon'], quantidade: 2 }, { tipo: 'bebida', bebida: 'refrigerante-cola', quantidade: 3 }];
  const autenticar = async (usuario, papel = 'authenticated') => {
    await banco.exec(`reset role; set role ${papel};`);
    await banco.query("select set_config('request.jwt.claim.sub', $1, false)", [usuario]);
  };
  const gravar = async (id = codigo, campos = dados, produtos = itens, total = 14700) => (await banco.query('select public.registrar_pedido($1::uuid, $2::jsonb, $3::jsonb, $4::integer) as registro', [id, JSON.stringify(campos), JSON.stringify(produtos), total])).rows[0].registro;
  try {
    // Apenas o contrato auth.uid/users é simulado; migração e RLS são PostgreSQL real.
    await banco.exec(`create role anon nologin; create role authenticated nologin; create schema auth;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth to anon, authenticated;
      insert into auth.users values ('${atendenteA}'), ('${atendenteB}'), ('${semPermissao}');`);
    await banco.exec(await lerArquivo(new URL('../banco/001_criar_pedidos.sql', import.meta.url), 'utf8'));
    await banco.query('insert into public.atendentes_autorizados (identificador) values ($1), ($2)', [atendenteA, atendenteB]);
    await contexto.test('migração inicial mantém catálogo histórico e políticas', async () => {
      const catalogo = (await banco.query('select dados from interno.cardapio')).rows[0].dados;
      verificar.equal(catalogo.sabores[0].precos.pequena, 2800);
      verificar.equal(catalogo.taxaEntrega, 500);
      const protecao = (await banco.query("select c.relrowsecurity from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace where (n.nspname = 'interno' and c.relname = 'cardapio') or (n.nspname = 'public' and c.relname in ('pedidos', 'atendentes_autorizados'))")).rows;
      verificar.equal(protecao.length, 3);
      verificar.ok(protecao.every(tabela => tabela.relrowsecurity));
    });
    let original;
    await contexto.test('atendente autorizado grava com data e preços calculados no servidor', async () => {
      await autenticar(atendenteA);
      original = await gravar();
      verificar.equal(original.atendente, atendenteA);
      verificar.ok(Number.isFinite(Date.parse(original.criado_em)));
      verificar.equal(original.subtotal, 14200);
      verificar.equal(original.taxa, 500);
      verificar.equal(original.total, 14700);
      verificar.equal(original.itens[0].precoUnitario, 5300);
      verificar.equal(original.itens[0].subtotal, 10600);
      verificar.match(original.itens[0].descricao, /Frango.*Bacon/);
    });
    await contexto.test('retirada cobra apenas os itens e não registra taxa', async () => {
      await banco.exec('begin;');
      try {
        const retirada = await gravar('10000000-0000-4000-8000-000000000002', { ...dados, modalidade: 'retirada', logradouro: '', numero: '', bairro: '', cidade: '' }, [{ tipo: 'bebida', bebida: 'suco-uva', quantidade: 2 }], 1800);
        verificar.equal(retirada.total, 1800);
        verificar.equal(retirada.taxa, 0);
        verificar.equal(retirada.itens[0].precoUnitario, 900);
      } finally { await banco.exec('rollback;'); }
    });
    await contexto.test('repetir o código não duplica e conteúdo diferente é rejeitado', async () => {
      verificar.deepEqual(await gravar(), original);
      verificar.equal((await banco.query('select count(*)::integer as quantidade from public.pedidos')).rows[0].quantidade, 1);
      await verificar.rejects(gravar(codigo, { ...dados, nome: 'Outro' }), /Código já usado/);
    });
    await contexto.test('outro atendente autorizado consulta o mesmo pedido', async () => {
      await autenticar(atendenteB);
      const registro = (await banco.query('select * from public.pedidos where identificador = $1', [codigo])).rows[0];
      verificar.equal(registro.total, 14700);
      verificar.deepEqual(registro.itens, original.itens);
      await verificar.rejects(gravar(), /Código já usado/);
    });
    await contexto.test('sem login ou autorização não há acesso nem autoautorização', async () => {
      await autenticar('', 'anon');
      await verificar.rejects(banco.query('select * from public.pedidos'), /permission denied/);
      await verificar.rejects(gravar(), /permission denied/);
      await autenticar(semPermissao);
      verificar.equal((await banco.query('select * from public.pedidos')).rows.length, 0);
      await verificar.rejects(gravar(), /não autorizado/);
      await verificar.rejects(banco.query('insert into public.atendentes_autorizados values ($1, true)', [semPermissao]), /permission denied/);
    });
    await contexto.test('dados, preços adulterados e edição direta são rejeitados atomicamente', async () => {
      await autenticar(atendenteA);
      const outro = '10000000-0000-4000-8000-000000000002';
      for (const produtos of [[{ ...itens[0], quantidade: 0 }], [{ ...itens[0], quantidade: 1.5 }], [{ ...itens[0], sabores: ['frango', 'frango'] }], [itens[0], { ...itens[1], bebida: 'inexistente' }]]) await verificar.rejects(gravar(outro, dados, produtos));
      await verificar.rejects(gravar(outro, { ...dados, cidade: '' }), /Endereço/);
      await verificar.rejects(gravar(outro, dados, itens, 1), /preços mudaram/);
      await verificar.rejects(banco.query('update public.pedidos set total = 1'), /permission denied/);
      await verificar.rejects(banco.query('delete from public.pedidos'), /permission denied/);
      await verificar.rejects(banco.query('insert into public.pedidos select * from public.pedidos'), /permission denied/);
      verificar.equal((await banco.query('select count(*)::integer as quantidade from public.pedidos')).rows[0].quantidade, 1);
    });
    await contexto.test('preços registrados não mudam com o catálogo e revogação bloqueia o token', async () => {
      await banco.exec("reset role; update interno.cardapio set dados = jsonb_set(dados, '{taxaEntrega}', '999');");
      await autenticar(atendenteA);
      verificar.deepEqual(await gravar(), original);
      await banco.exec('reset role;');
      await banco.query('update public.atendentes_autorizados set ativo = false where identificador = $1', [atendenteA]);
      await autenticar(atendenteA);
      verificar.equal((await banco.query('select * from public.pedidos')).rows.length, 0);
      await verificar.rejects(gravar(), /não autorizado/);
    });
    await contexto.test('fechar e reabrir o PostgreSQL preserva pedido e políticas', async () => {
      await banco.exec('reset role;');
      await banco.close();
      banco = new PGlite(pasta);
      await autenticar(atendenteB);
      const registro = (await banco.query('select * from public.pedidos where identificador = $1', [codigo])).rows[0];
      verificar.deepEqual(registro.itens, original.itens);
      verificar.equal(registro.total, 14700);
      await autenticar('', 'anon');
      await verificar.rejects(banco.query('select * from public.pedidos'), /permission denied/);
    });
    await contexto.test('migração oficial preserva histórico e sincroniza o catálogo atual', async () => {
      await banco.exec('reset role;');
      await banco.exec(await lerArquivo(new URL('../banco/002_cardapio_oficial.sql', import.meta.url), 'utf8'));
      verificar.deepEqual((await banco.query('select dados from interno.cardapio')).rows[0].dados, { tamanhos, sabores, bebidas, adicionais, taxaEntrega });
      await banco.query('update public.atendentes_autorizados set ativo = true where identificador = $1', [atendenteA]);
      await autenticar(atendenteA);
      verificar.deepEqual(await gravar(), original);
      verificar.equal((await banco.query('select total from public.pedidos where identificador = $1',[codigo])).rows[0].total,14700);
    });
    await contexto.test('banco cobra preços oficiais e inclui a Coca-Cola no combo fechado', async () => {
      let numero = 10;
      const campos = { ...dados, modalidade: 'retirada', logradouro: '', numero: '', bairro: '', cidade: '' };
      for (const [sabor, tamanho, preco] of [
        ['margherita','media',3990], ['margherita','grande',4990],
        ['calabresa','media',4290], ['calabresa','grande',5290],
        ['portuguesa','media',4490], ['portuguesa','grande',5490],
        ['frango','media',4590], ['frango','grande',5590],
        ['carne-seca','media',4990], ['carne-seca','grande',5990],
        ['romeu-julieta','grande',3990], ['combo-franbacon','grande',5990],
      ]) {
        const produto = { tipo: 'pizza', tamanho, sabores: [sabor], adicionais: [], quantidade: 1 };
        const registro = await gravar(`20000000-0000-4000-8000-${String(numero++).padStart(12,'0')}`, campos, [produto], preco);
        verificar.equal(registro.total,preco);
        verificar.equal(registro.taxa,0);
        if (sabor === 'combo-franbacon') verificar.match(registro.itens[0].descricao,/Coca-Cola 2 litros/);
      }
      const combinada = await gravar('20000000-0000-4000-8000-000000000099',campos,[{tipo:'pizza',tamanho:'media',sabores:['margherita','carne-seca'],adicionais:[],quantidade:2}],9980);
      verificar.equal(combinada.itens[0].precoUnitario,4990);
    });
    await contexto.test('servidor rejeita oferta indisponível e preço adulterado sem inserir', async () => {
      const campos = { ...dados, modalidade: 'retirada', logradouro: '', numero: '', bairro: '', cidade: '' };
      const produto = {tipo:'pizza',tamanho:'grande',sabores:['margherita'],adicionais:[],quantidade:1};
      const antes = (await banco.query('select count(*)::integer as quantidade from public.pedidos')).rows[0].quantidade;
      const id = '30000000-0000-4000-8000-000000000001';
      for(const alteracao of [{tamanho:'pequena'},{tamanho:'media',sabores:['romeu-julieta']},{tamanho:'media',sabores:['combo-franbacon']},{sabores:['combo-franbacon','margherita']},{sabores:['margherita','calabresa','portuguesa']},{adicionais:['bacon']}]) await verificar.rejects(gravar(id,campos,[{...produto,...alteracao}],4990));
      await verificar.rejects(gravar(id,campos,[{tipo:'bebida',bebida:'refrigerante-cola',quantidade:1}],1200));
      await verificar.rejects(gravar(id,dados,[produto],4990),/Entrega indisponível/);
      await verificar.rejects(gravar(id,campos,[produto],1),/preços mudaram/);
      verificar.equal((await banco.query('select count(*)::integer as quantidade from public.pedidos')).rows[0].quantidade,antes);
      await autenticar('', 'anon');
      await verificar.rejects(gravar(id,campos,[produto],4990),/permission denied/);
    });
  } finally {
    await banco.exec('reset role;');
    await banco.close();
    if (pastaPai(resolverCaminho(pasta)) !== pastaTemporaria) throw new Error('Diretório de teste fora da pasta temporária esperada.');
    await remover(pasta, { recursive: true, force: true });
  }
});
