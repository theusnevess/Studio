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
    <div className="rounded-[26px] border border-rose-200 bg-rose-50 p-8 text-center">
      <h3 className="font-serif text-3xl font-semibold text-rose-700">{title}</h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-rose-600">
        {description}
      </p>
      {actionLabel && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
