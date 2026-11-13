export type ConfiguracaoBanco = { endereco: string; chavePublica: string };

export function lerConfiguracao(variaveis: Record<string, unknown>): ConfiguracaoBanco | null {
  const endereco = String(variaveis.VITE_SUPABASE_URL ?? '').trim();
  const chavePublica = String(variaveis.VITE_SUPABASE_CHAVE_PUBLICA ?? '').trim();
  if (!endereco && !chavePublica) return null;
  let url: URL;
  try { url = new URL(endereco); } catch { throw new Error('Endereço do Supabase inválido.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('Use a URL HTTPS do projeto Supabase, sem credenciais ou caminhos.');
  if (!chavePublica.startsWith('sb_publishable_') || chavePublica.includes('substitua')) throw new Error('Configure somente a chave pública sb_publishable_ do Supabase.');
  return { endereco: url.origin, chavePublica };
}
