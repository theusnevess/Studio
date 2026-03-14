import { NavLink } from 'react-router-dom'
import type { AppRouteLink } from '../types/navigation'

type SidebarNavProps = {
  links: AppRouteLink[]
  onNavigate?: () => void
}

/**
 * Renderiza a navegacao lateral principal da aplicacao.
 */
export function SidebarNav({ links, onNavigate }: SidebarNavProps) {
  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
              isActive
                ? 'bg-white/[0.06] text-brand-ink'
                : 'text-brand-graphite hover:bg-white/[0.03] hover:text-brand-ink',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={[
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                  isActive
                    ? 'bg-gradient-to-br from-brand-rose to-brand-amber text-white shadow-soft'
                    : 'bg-brand-surface-raise text-brand-graphite group-hover:text-brand-ink',
                ].join(' ')}
              >
                {link.icon ?? (
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {link.shortLabel}
                  </span>
                )}
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-medium">
                  {link.label}
                </span>
                <span
                  className={[
                    'mt-0.5 block text-xs leading-4',
                    isActive ? 'text-brand-graphite' : 'text-brand-graphite/60',
                  ].join(' ')}
                >
                  {link.description}
                </span>
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
