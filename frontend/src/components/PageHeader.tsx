type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  action?: string
}

/**
 * Cabecalho reutilizavel das paginas internas.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-fade-in-up">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-rose/80">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-brand-ink">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-graphite">
          {description}
        </p>
      </div>

      {action ? (
        <span className="sf-chip">
          {action}
        </span>
      ) : null}
    </div>
  )
}
