type AppBrandProps = {
  subtitle?: string
  light?: boolean
}

/**
 * Marca textual reutilizavel do StudioFlow.
 */
export function AppBrand({ subtitle, light = false }: AppBrandProps) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="relative max-w-[220px]">
          <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-brand-rose/6 blur-2xl" />
          <div className="relative flex items-center justify-center rounded-2xl border border-brand-border bg-brand-surface-raise/80 px-4 py-3 shadow-soft backdrop-blur">
            <img
              src="/logo.png"
              alt="Nathallya Soares - Nail Designer"
              className="h-auto w-full object-contain drop-shadow-sm"
            />
          </div>
        </div>

        <div className="mt-1">
          <p className="text-xl font-semibold leading-none text-brand-ink">
            StudioFlow
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-brand-rose/80">
            Nail Management
          </p>
        </div>
      </div>

      {subtitle ? (
        <p
          className={[
            'mt-4 max-w-xs text-sm leading-6',
            light ? 'text-white/60' : 'text-brand-graphite',
          ].join(' ')}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
