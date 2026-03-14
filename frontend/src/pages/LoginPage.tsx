import { AppBrand } from '../components/AppBrand'

/**
 * Pagina base de login.
 */
export function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1280px] items-center justify-center p-6">
      <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[1.05fr_0.95fr] animate-fade-in-up">
        {/* Left panel */}
        <section className="relative hidden overflow-hidden rounded-2xl border border-brand-border bg-brand-panel/80 p-10 shadow-panel backdrop-blur lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-rose/5 via-transparent to-brand-amber/5" />

          <div className="relative z-10">
            <AppBrand subtitle="Organizacao, leveza e controle para o dia a dia do studio." />
            <h1 className="mt-10 max-w-xl text-4xl font-semibold leading-tight text-brand-ink">
              Um painel moderno, preciso e pronto para a rotina real do studio.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-brand-graphite">
              Clientes, agenda, tarefas e lembretes em uma interface elegante, pensada para uso cotidiano.
            </p>
          </div>

          <div className="relative z-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-border bg-brand-mist/60 p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-rose/80">
                Fluxo central
              </p>
              <p className="mt-2 text-sm font-medium text-brand-ink/80">
                Atendimentos, tarefas e notificacoes em uma unica base.
              </p>
            </div>

            <div className="rounded-xl border border-brand-border bg-brand-mist/60 p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-amber/80">
                Proposta
              </p>
              <p className="mt-2 text-sm font-medium text-brand-ink/80">
                Aparencia profissional com leitura simples para apresentacao.
              </p>
            </div>
          </div>
        </section>

        {/* Right panel — form */}
        <section className="rounded-2xl border border-brand-border bg-brand-panel/90 p-8 shadow-panel backdrop-blur-xl lg:p-10">
          <div className="lg:hidden">
            <AppBrand subtitle="Gestao delicada para uma rotina organizada." />
          </div>

          <div className="mt-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-amber/80">
              Acesso
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-brand-ink">
              Entre no StudioFlow
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-brand-graphite">
              O login real ainda nao foi ativado. Esta tela existe para sustentar a demonstracao com uma entrada visual consistente.
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-graphite">
                E-mail
              </span>
              <input
                type="email"
                placeholder="seuemail@studio.com"
                className="sf-input"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-brand-graphite">
                Senha
              </span>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="sf-input"
              />
            </label>

            <button type="button" className="sf-button-primary w-full py-3.5">
              Acesso em breve
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-brand-border bg-brand-mist/40 p-4">
            <p className="text-sm leading-6 text-brand-graphite">
              Enquanto o login real nao entra, use a navegacao principal pela rota inicial do projeto para validar a base visual do sistema.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
