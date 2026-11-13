import { test as testar } from 'node:test';
import { strict as verificar } from 'node:assert';
import { readFile as lerArquivo } from 'node:fs/promises';
import { resolve as resolverCaminho, sep as separador } from 'node:path';

testar('a publicação contém HTML em português e todos os recursos compilados', async () => {
  const pastaPublicacao = resolverCaminho('dist');
  const pagina = await lerArquivo(resolverCaminho(pastaPublicacao, 'index.html'), 'utf8');

  verificar.match(pagina, /<html lang="pt-BR">/);
  verificar.doesNotMatch(pagina, /(?:src|href)="[^"]*\.ts"/);

  const recursos = [...pagina.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)];
  verificar.ok(recursos.some(([, recurso]) => recurso.endsWith('.js')), 'JavaScript compilado presente');
  verificar.ok(recursos.some(([, recurso]) => recurso.endsWith('.css')), 'CSS publicado presente');

  for (const [, recurso] of recursos) {
    const caminhoRecurso = resolverCaminho(pastaPublicacao, recurso.slice(1));
    verificar.ok(caminhoRecurso.startsWith(pastaPublicacao + separador));
    verificar.ok((await lerArquivo(caminhoRecurso)).length > 0, `Recurso disponível: ${recurso}`);
  }
});
