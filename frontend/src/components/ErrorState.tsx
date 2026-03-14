type ErrorStateProps = {
  title: string
  description: string
  actionLabel?: string
  onRetry?: () => void
}

/**
 * Estado visual de erro para falhas de carregamento ou submissao.
 */
export function ErrorState({
  title,
  description,
  actionLabel,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
        <svg className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-rose-300">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-rose-400/80">
        {description}
      </p>
      {actionLabel && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-rose-500/20 px-5 py-2.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/30"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
