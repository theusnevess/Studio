import { PagePlaceholder } from './PagePlaceholder'

/**
 * Pagina base de login.
 *
 * Ainda nao existe fluxo real de autenticacao. Esta tela funciona apenas como
 * placeholder visual para reservar a rota e orientar a evolucao futura.
 */
export function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-soft backdrop-blur">
        <PagePlaceholder
          title="Login"
          description="Tela reservada para a autenticacao inicial do StudioFlow. Nesta etapa, a pagina existe apenas como base visual e de navegacao."
        />
      </div>
    </div>
  )
}
