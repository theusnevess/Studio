type FeedbackBannerProps = {
  tone: 'success' | 'error' | 'info'
  message: string
}

const toneClasses: Record<FeedbackBannerProps['tone'], string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-brand-border bg-brand-mist text-brand-graphite',
}

/**
 * Banner simples para feedback de sucesso, erro ou informacao.
 */
export function FeedbackBanner({ tone, message }: FeedbackBannerProps) {
  return (
    <div
      className={[
        'rounded-[22px] border px-4 py-3 text-sm font-medium',
        toneClasses[tone],
      ].join(' ')}
    >
      {message}
    </div>
  )
}
