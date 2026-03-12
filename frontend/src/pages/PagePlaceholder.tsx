type PagePlaceholderProps = {
  title: string
  description: string
}

/**
 * Componente reutilizavel para telas ainda nao implementadas.
 *
 * Ele evita repeticao nas paginas iniciais e deixa claro que a rota ja existe,
 * mas a funcionalidade sera detalhada em etapas futuras.
 */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="rounded-[24px] border border-dashed border-stone-300 bg-stone-50/80 p-8">
      <span className="inline-flex rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-moss">
        Estrutura inicial
      </span>
      <h2 className="mt-4 text-3xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
        {description}
      </p>
    </section>
  )
}
