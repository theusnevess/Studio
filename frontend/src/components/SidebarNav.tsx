import { NavLink } from 'react-router-dom'
import type { AppRouteLink } from '../types/navigation'

type SidebarNavProps = {
  links: AppRouteLink[]
  onNavigate?: () => void
}

/**
 * Renderiza a navegacao lateral principal da aplicacao.
 *
 * O componente recebe uma lista simples de rotas e aplica destaque visual
 * automaticamente na rota ativa por meio do NavLink.
 */
export function SidebarNav({ links, onNavigate }: SidebarNavProps) {
  return (
    <nav className="space-y-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          // A aparencia muda conforme a rota ativa para orientar a pessoa
          // usuaria dentro do painel administrativo.
          className={({ isActive }) =>
            [
              'group flex items-center gap-3 rounded-[22px] border px-4 py-3.5 transition',
              isActive
                ? 'border-brand-rose/30 bg-gradient-to-r from-brand-rose to-brand-berry text-white shadow-soft'
                : 'border-transparent bg-white/[0.65] text-brand-graphite hover:border-brand-border hover:bg-white',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={[
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold uppercase tracking-[0.24em]',
                  isActive
                    ? 'bg-white/18 text-white'
                    : 'bg-brand-mist text-brand-berry',
                ].join(' ')}
              >
                {link.shortLabel}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{link.label}</span>
                <span
                  className={[
                    'mt-1 block text-xs leading-5',
                    isActive ? 'text-white/80' : 'text-brand-graphite/70',
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
