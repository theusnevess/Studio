type StatusBadgeProps = {
  value: string
}

const badgeMap: Record<string, string> = {
  AGENDADO: 'border-brand-border bg-white text-brand-graphite',
  CONFIRMADO: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  CONCLUIDO: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  CANCELADO: 'border-rose-200 bg-rose-50 text-rose-700',
  A_FAZER: 'border-brand-border bg-white text-brand-graphite',
  EM_ANDAMENTO: 'border-amber-200 bg-amber-50 text-amber-700',
  ALTA: 'border-rose-200 bg-rose-50 text-rose-700',
  MEDIA: 'border-amber-200 bg-amber-50 text-amber-700',
  BAIXA: 'border-sky-200 bg-sky-50 text-sky-700',
  PLANEJADO: 'border-brand-border bg-white text-brand-graphite',
}

function humanizeStatus(value: string) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
}

/**
 * Badge de status reutilizavel para cards, listas e visoes futuras.
 */
export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em]',
        badgeMap[value] ?? 'border-brand-border bg-brand-mist text-brand-berry',
      ].join(' ')}
    >
      {humanizeStatus(value)}
    </span>
  )
}
