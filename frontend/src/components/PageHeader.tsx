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
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-berry/[0.72]">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold text-brand-ink">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-brand-graphite/[0.78]">
          {description}
        </p>
      </div>

      {action ? (
        <span className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-graphite">
          {action}
        </span>
      ) : null}
    </div>
  )
}
