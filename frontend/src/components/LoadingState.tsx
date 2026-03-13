type LoadingStateProps = {
  label?: string
}

/**
 * Estado de carregamento simples para futuras listagens e formularios.
 */
export function LoadingState({
  label = 'Carregando informacoes do StudioFlow...',
}: LoadingStateProps) {
  return (
    <div className="flex items-center gap-4 rounded-[24px] border border-brand-border bg-white/80 p-5">
      <span className="h-4 w-4 animate-pulse rounded-full bg-brand-rose" />
      <p className="text-sm font-medium text-brand-graphite">{label}</p>
    </div>
  )
}
