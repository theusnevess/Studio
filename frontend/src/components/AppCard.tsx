import type { PropsWithChildren } from 'react'

type AppCardProps = PropsWithChildren<{
  className?: string
}>

/**
 * Card base da interface.
 *
 * Mantem consistencia visual entre dashboard, placeholders e futuras listagens.
 */
export function AppCard({ children, className = '' }: AppCardProps) {
  return (
    <section
      className={[
        'rounded-[30px] border border-brand-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,249,247,0.96))] p-6 shadow-soft',
        className,
      ].join(' ')}
    >
      {children}
    </section>
  )
}
