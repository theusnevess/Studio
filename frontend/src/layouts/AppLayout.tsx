import { Outlet } from 'react-router-dom'
import { SidebarNav } from '../components/SidebarNav'
import type { AppRouteLink } from '../types/navigation'

// Lista base de links exibidos na navegacao lateral.
// Ela reflete as areas previstas no MVP, mesmo que ainda estejam vazias.
const links: AppRouteLink[] = [
  { label: 'Painel', to: '/' },
  { label: 'Clientes', to: '/clientes' },
  { label: 'Agendamentos', to: '/agendamentos' },
  { label: 'Tarefas', to: '/tarefas' },
  { label: 'Calendario', to: '/calendario' },
  { label: 'Kanban', to: '/kanban' },
  { label: 'Notificacoes', to: '/notificacoes' },
]

/**
 * Layout principal das paginas internas do StudioFlow.
 *
 * Este layout centraliza os elementos compartilhados da interface:
 * navegacao lateral, cabecalho e area de conteudo dinamico.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <aside className="w-full rounded-[28px] border border-white/60 bg-sand/85 p-5 shadow-soft backdrop-blur lg:max-w-xs">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.28em] text-bronze">
              StudioFlow
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Base do projeto</h1>
            <p className="mt-2 text-sm text-stone-600">
              Estrutura inicial para operacao, agenda e tarefas do studio.
            </p>
          </div>

          <SidebarNav links={links} />
        </aside>

        <div className="flex min-h-[70vh] flex-1 flex-col rounded-[28px] border border-white/70 bg-white/80 shadow-soft backdrop-blur">
          <header className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">
                Painel interno
              </p>
              <p className="mt-1 text-lg font-semibold">Studio de unhas</p>
            </div>

            <div className="rounded-full bg-rose px-4 py-2 text-sm font-medium text-stone-700">
              MVP em preparacao
            </div>
          </header>

          {/* O Outlet injeta a pagina correspondente a rota atual. */}
          <main className="flex-1 px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
