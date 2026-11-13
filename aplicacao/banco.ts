import { createClient } from '@supabase/supabase-js';
import { lerConfiguracao } from './configuracao.ts';
import { validarConfirmacao } from './registro.ts';
import type { SolicitacaoRegistro, RegistroSalvo } from './registro.ts';

export function criarBanco(variaveis: Record<string, unknown>, armazenamento: Storage) {
  const configuracao = lerConfiguracao(variaveis);
  if (!configuracao) return null;
  const cliente = createClient(configuracao.endereco, configuracao.chavePublica, {
    global: { fetch: (entrada, opcoes) => fetch(entrada, { ...opcoes, signal: opcoes?.signal ?? AbortSignal.timeout(15000) }) },
    auth: { storage: armazenamento, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return {
    async entrar(email: string, senha: string): Promise<void> {
      const { error } = await cliente.auth.signInWithPassword({ email, password: senha });
      if (error) throw new Error('Não foi possível entrar. Confira e-mail, senha e conexão.');
    },
    async sair(): Promise<void> {
      await cliente.auth.signOut({ scope: 'local' });
    },
    async obterAcesso(): Promise<string | null> {
      const { data: { session } } = await cliente.auth.getSession();
      if (!session) return null;
      const { data: { user }, error } = await cliente.auth.getUser();
      if (error || !user) throw new Error('Sessão não confirmada. Entre novamente.');
      const { data, error: falha } = await cliente.from('atendentes_autorizados').select('identificador').eq('identificador', user.id).eq('ativo', true).abortSignal(AbortSignal.timeout(15000)).maybeSingle();
      if (falha) throw new Error('Não foi possível verificar o acesso. Confira a configuração do banco e a conexão.');
      if (!data) throw new Error('Esta conta não está autorizada a acessar os pedidos.');
      return user.email ?? 'Atendente autorizado';
    },
    async gravar(solicitacao: SolicitacaoRegistro): Promise<RegistroSalvo> {
      if (!await this.obterAcesso()) throw new Error('Entre com uma conta de atendente autorizada.');
      const { data, error } = await cliente.rpc('registrar_pedido', {
        p_identificador: solicitacao.identificador, p_dados: solicitacao.dados, p_itens: solicitacao.itens, p_total_previsto: solicitacao.totalPrevisto,
      }).abortSignal(AbortSignal.timeout(15000));
      if (error) throw new Error('Gravação não confirmada. Confira a conexão e consulte o código antes de iniciar outro pedido.');
      return validarConfirmacao(data, solicitacao.identificador);
    },
    async consultar(identificador: string): Promise<RegistroSalvo> {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identificador)) throw new Error('Informe um código de pedido válido.');
      if (!await this.obterAcesso()) throw new Error('Entre com uma conta de atendente autorizada.');
      const { data, error } = await cliente.from('pedidos').select('*').eq('identificador', identificador).abortSignal(AbortSignal.timeout(15000)).maybeSingle();
      if (error) throw new Error('Não foi possível consultar a gravação. Tente novamente.');
      if (!data) throw new Error('Pedido não encontrado ou acesso não autorizado.');
      return validarConfirmacao(data, identificador);
    },
  };
}

export type Banco = NonNullable<ReturnType<typeof criarBanco>>;
