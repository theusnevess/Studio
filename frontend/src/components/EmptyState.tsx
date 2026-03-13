type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
}

/**
 * Estado vazio simples e reutilizavel para areas sem dados reais.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-[26px] border border-dashed border-brand-border bg-brand-cream/80 p-8 text-center">
      <span className="inline-flex rounded-full bg-brand-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-berry">
        StudioFlow
      </span>
      <h3 className="mt-5 font-serif text-3xl font-semibold text-brand-ink">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-brand-graphite/[0.78]">
        {description}
      </p>
      {actionLabel ? (
        <span className="mt-6 inline-flex rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-graphite">
          {actionLabel}
        </span>
      ) : null}
    </div>
  )
}
