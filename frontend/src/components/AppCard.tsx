import type { PropsWithChildren } from 'react'

type AppCardProps = PropsWithChildren<{
  className?: string
}>

/**
 * Card base da interface.
 */
export function AppCard({ children, className = '' }: AppCardProps) {
  return (
    <section
      className={[
        'rounded-2xl border border-brand-border bg-white/[0.03] p-6 backdrop-blur-sm transition-all',
        className,
      ].join(' ')}
    >
      {children}
    </section>
  )
}
