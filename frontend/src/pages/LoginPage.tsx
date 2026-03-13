import { AppBrand } from '../components/AppBrand'

/**
 * Pagina base de login.
 *
 * Ainda nao existe fluxo real de autenticacao. Esta tela funciona apenas como
 * placeholder visual para reservar a rota e orientar a evolucao futura.
 */
export function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1300px] items-center justify-center p-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[36px] bg-[linear-gradient(160deg,rgba(32,21,28,0.96),rgba(67,49,61,0.94))] p-10 text-brand-cream shadow-panel lg:flex lg:flex-col lg:justify-between">
          <div>
            <AppBrand
              light
              subtitle="Organizacao, leveza e controle para o dia a dia do studio."
            />
            <h1 className="mt-10 max-w-xl font-serif text-5xl font-semibold leading-tight">
              Uma base elegante para agenda, tarefas e atendimento.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/[0.74]">
              O StudioFlow entra agora na fase real de interface. Esta tela antecipa o ambiente visual do sistema enquanto a autenticacao real nao foi ativada.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/[0.56]">
              Base preparada
            </p>
            <p className="mt-3 text-lg font-semibold">
              Integracao com backend, layout responsivo e identidade visual ja definidos.
            </p>
          </div>
        </section>

        <section className="rounded-[36px] border border-white/80 bg-white/[0.88] p-8 shadow-panel backdrop-blur lg:p-10">
          <div className="lg:hidden">
            <AppBrand subtitle="Gestao delicada para uma rotina organizada." />
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.32em] text-brand-berry/70">
              Acesso
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-brand-ink">
              Entrar no StudioFlow
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-brand-graphite/[0.78]">
              A autenticacao real ainda nao foi implementada. Este formulario existe para consolidar branding, hierarquia visual e futura experiencia de acesso.
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
                E-mail
              </span>
              <input
                type="email"
                placeholder="seuemail@studioflow.com"
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
                Senha
              </span>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <button
              type="button"
              className="w-full rounded-[22px] bg-gradient-to-r from-brand-rose to-brand-berry px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-soft transition hover:opacity-95"
            >
              Acesso em breve
            </button>
          </form>

          <div className="mt-8 rounded-[24px] border border-brand-border bg-brand-mist p-5">
            <p className="text-sm leading-6 text-brand-graphite/80">
              Enquanto o login real nao entra, use a navegacao principal pela rota inicial do projeto para validar a base visual e estrutural do sistema.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
