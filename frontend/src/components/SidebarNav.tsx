import { NavLink } from 'react-router-dom'
import type { AppRouteLink } from '../types/navigation'

type SidebarNavProps = {
  links: AppRouteLink[]
}

/**
 * Renderiza a navegacao lateral principal da aplicacao.
 *
 * O componente recebe uma lista simples de rotas e aplica destaque visual
 * automaticamente na rota ativa por meio do NavLink.
 */
export function SidebarNav({ links }: SidebarNavProps) {
  return (
    <nav className="space-y-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          // A aparencia muda conforme a rota ativa para orientar a pessoa
          // usuaria dentro do painel administrativo.
          className={({ isActive }) =>
            [
              'block rounded-2xl px-4 py-3 text-sm font-medium transition',
              isActive
                ? 'bg-ink text-white shadow-soft'
                : 'text-stone-700 hover:bg-white/70',
            ].join(' ')
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
