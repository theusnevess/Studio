type AppBrandProps = {
  subtitle?: string
  light?: boolean
}

/**
 * Marca textual reutilizavel do StudioFlow.
 *
 * O componente foi pensado para poder ser substituido futuramente por um
 * asset PNG ou SVG sem exigir retrabalho na estrutura das telas.
 */
export function AppBrand({ subtitle, light = false }: AppBrandProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className={[
            'inline-flex h-12 w-12 items-center justify-center rounded-[18px] border text-sm font-bold uppercase tracking-[0.24em]',
            light
              ? 'border-white/12 bg-white/10 text-brand-cream'
              : 'border-brand-border bg-brand-mist text-brand-berry',
          ].join(' ')}
        >
          SF
        </span>
        <div>
          <p
            className={[
              'font-serif text-3xl font-semibold leading-none',
              light ? 'text-brand-cream' : 'text-brand-ink',
            ].join(' ')}
          >
            StudioFlow
          </p>
          <p
            className={[
              'mt-1 text-xs uppercase tracking-[0.34em]',
              light ? 'text-white/60' : 'text-brand-berry/70',
            ].join(' ')}
          >
            Nail Management
          </p>
        </div>
      </div>

      {subtitle ? (
        <p
          className={[
            'mt-4 max-w-xs text-sm leading-6',
            light ? 'text-white/[0.72]' : 'text-brand-graphite/[0.74]',
          ].join(' ')}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
