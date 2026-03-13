import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppBrand } from '../components/AppBrand'
import { SidebarNav } from '../components/SidebarNav'
import type { AppRouteLink } from '../types/navigation'

// Lista base de links exibidos na navegacao lateral.
// Ela reflete as areas previstas no MVP, mesmo que ainda estejam vazias.
const links: AppRouteLink[] = [
  {
    label: 'Painel',
    to: '/',
    shortLabel: 'IN',
    description: 'Resumo operacional do studio',
  },
  {
    label: 'Clientes',
    to: '/clientes',
    shortLabel: 'CL',
    description: 'Cadastros e relacionamento',
  },
  {
    label: 'Projetos',
    to: '/projetos',
    shortLabel: 'PR',
    description: 'Frentes operacionais do studio',
  },
  {
    label: 'Tarefas',
    to: '/tarefas',
    shortLabel: 'TF',
    description: 'Acompanhamento do dia a dia',
  },
  {
    label: 'Kanban',
    to: '/kanban',
    shortLabel: 'KB',
    description: 'Fluxo visual das tarefas',
  },
  {
    label: 'Agendamentos',
    to: '/agendamentos',
    shortLabel: 'AG',
    description: 'Atendimentos e horarios',
  },
  {
    label: 'Calendario',
    to: '/calendario',
    shortLabel: 'CA',
    description: 'Visao de agenda do studio',
  },
  {
    label: 'Notificacoes',
    to: '/notificacoes',
    shortLabel: 'NT',
    description: 'Lembretes e avisos internos',
  },
]

/**
 * Layout principal das paginas internas do StudioFlow.
 *
 * Este layout centraliza os elementos compartilhados da interface:
 * navegacao lateral, cabecalho e area de conteudo dinamico.
 */
export function AppLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentPage = links.find((link) =>
    link.to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(link.to),
  )

  return (
    <div className="min-h-screen bg-transparent text-brand-ink">
      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-6 p-4 lg:p-6">
        <button
          type="button"
          className="fixed right-4 top-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-border bg-white/90 text-lg text-brand-ink shadow-soft lg:hidden"
          onClick={() => setSidebarOpen((value) => !value)}
        >
          {sidebarOpen ? 'X' : 'Menu'}
        </button>

        <div
          className={[
            'fixed inset-0 z-20 bg-brand-ink/30 backdrop-blur-sm transition lg:hidden',
            sidebarOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0',
          ].join(' ')}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={[
            'fixed left-4 top-4 z-30 h-[calc(100vh-2rem)] w-[min(86vw,360px)] rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,249,247,0.96),rgba(255,241,244,0.94))] p-5 shadow-panel backdrop-blur transition lg:static lg:h-auto lg:w-[330px] lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0',
          ].join(' ')}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-brand-border pb-6">
              <AppBrand subtitle="Gestao elegante para o dia a dia do studio" />
            </div>

            <div className="mt-6 flex-1 overflow-y-auto pr-1">
              <SidebarNav links={links} onNavigate={() => setSidebarOpen(false)} />
            </div>

            <div className="mt-6 rounded-[26px] bg-brand-ink px-5 py-5 text-brand-cream">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                StudioFlow
              </p>
              <p className="mt-3 text-lg font-semibold">
                Agenda, tarefas e atendimento em uma unica base.
              </p>
              <p className="mt-2 text-sm leading-6 text-white/[0.72]">
                Estrutura preparada para operacao real do studio e apresentacao academica consistente.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col rounded-[34px] border border-white/80 bg-white/80 shadow-panel backdrop-blur">
          <header className="border-b border-brand-border/70 px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-brand-berry/70">
                  StudioFlow
                </p>
                <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-ink">
                  {currentPage?.label ?? 'StudioFlow'}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-graphite/[0.78]">
                  {currentPage?.description ??
                    'Base inicial da interface para organizar atendimentos, tarefas e rotina do studio.'}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <span className="rounded-full border border-brand-border bg-brand-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-berry">
                  MVP em evolucao
                </span>
                <div className="hidden rounded-full bg-brand-ink px-4 py-2 text-sm font-medium text-white sm:block">
                  Studio de unhas
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
