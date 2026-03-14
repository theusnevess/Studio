type LoadingStateProps = {
  label?: string
}

/**
 * Estado de carregamento com spinner animado.
 */
export function LoadingState({
  label = 'Carregando informacoes do StudioFlow...',
}: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist/40 p-5">
      <svg className="h-5 w-5 animate-spin text-brand-rose" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-sm font-medium text-brand-graphite">{label}</p>
    </div>
  )
}
