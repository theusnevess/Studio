type FeedbackBannerProps = {
  tone: 'success' | 'error' | 'info'
  message: string
}

const toneClasses: Record<FeedbackBannerProps['tone'], string> = {
  success: 'border-emerald-500/20 bg-emerald-500/8 text-emerald-400',
  error: 'border-rose-500/20 bg-rose-500/8 text-rose-400',
  info: 'border-brand-border bg-brand-mist text-brand-graphite',
}

/**
 * Banner simples para feedback de sucesso, erro ou informacao.
 */
export function FeedbackBanner({ tone, message }: FeedbackBannerProps) {
  return (
    <div
      className={[
        'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium',
        toneClasses[tone],
      ].join(' ')}
    >
      {tone === 'success' ? (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : tone === 'error' ? (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ) : (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      )}
      {message}
    </div>
  )
}
