type StatusBadgeProps = {
  value: string
}

const badgeMap: Record<string, string> = {
  AGENDADO: 'border-brand-graphite/20 bg-brand-graphite/10 text-brand-graphite',
  CONFIRMADO: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  CONCLUIDO: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  CANCELADO: 'border-rose-500/20 bg-rose-500/10 text-rose-400',
  ATIVO: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  INATIVO: 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400',
  VISUALIZADA: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  NAO_VISUALIZADA: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
  A_FAZER: 'border-brand-graphite/20 bg-brand-graphite/10 text-brand-graphite',
  EM_ANDAMENTO: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
  ALTA: 'border-rose-500/20 bg-rose-500/10 text-rose-400',
  MEDIA: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
  BAIXA: 'border-sky-500/20 bg-sky-500/10 text-sky-400',
  PLANEJADO: 'border-brand-graphite/20 bg-brand-graphite/10 text-brand-graphite',
  ARQUIVADO: 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400',
  LEMBRETE_AGENDAMENTO: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
  AVISO_TAREFA: 'border-brand-rose/20 bg-brand-rose/10 text-brand-rose',
  INFORMACAO_GERAL: 'border-sky-500/20 bg-sky-500/10 text-sky-400',
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
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider',
        badgeMap[value] ?? 'border-brand-graphite/20 bg-brand-graphite/10 text-brand-graphite',
      ].join(' ')}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {humanizeStatus(value)}
    </span>
  )
}
