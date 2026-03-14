import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppBrand } from '../components/AppBrand'
import { SidebarNav } from '../components/SidebarNav'
import type { AppRouteLink } from '../types/navigation'

const iconClass = 'h-4 w-4'

const links: AppRouteLink[] = [
  {
    label: 'Painel',
    to: '/',
    shortLabel: 'IN',
    description: 'Resumo operacional',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: 'Clientes',
    to: '/clientes',
    shortLabel: 'CL',
    description: 'Cadastros e relacionamento',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: 'Projetos',
    to: '/projetos',
    shortLabel: 'PR',
    description: 'Frentes operacionais',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    label: 'Tarefas',
    to: '/tarefas',
    shortLabel: 'TF',
    description: 'Acompanhamento diario',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Agendamentos',
    to: '/agendamentos',
    shortLabel: 'AG',
    description: 'Atendimentos e horarios',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Calendario',
    to: '/calendario',
    shortLabel: 'CA',
    description: 'Visao de agenda',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: 'Notificacoes',
    to: '/notificacoes',
    shortLabel: 'NT',
    description: 'Lembretes e avisos',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
]

/**
 * Layout principal das paginas internas do StudioFlow.
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
    <div className="min-h-screen font-sans text-brand-ink">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-5 p-4 lg:p-5">
        {/* Mobile menu button */}
        <button
          type="button"
          className="fixed right-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-panel/95 text-brand-ink backdrop-blur lg:hidden"
          onClick={() => setSidebarOpen((value) => !value)}
        >
          {sidebarOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

        {/* Overlay */}
        <div
          className={[
            'fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition lg:hidden',
            sidebarOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0',
          ].join(' ')}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={[
            'fixed left-4 top-4 z-30 h-[calc(100vh-2rem)] w-[min(84vw,320px)] rounded-2xl border border-brand-border bg-brand-panel/95 p-5 shadow-panel backdrop-blur-xl transition-transform lg:static lg:h-auto lg:w-[280px] lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0',
          ].join(' ')}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-brand-border pb-5">
              <AppBrand subtitle="Gestao elegante para o dia a dia do studio" />
            </div>

            <div className="mt-5 flex-1 overflow-y-auto pr-1">
              <SidebarNav links={links} onNavigate={() => setSidebarOpen(false)} />
            </div>

            {/* Sidebar footer card */}
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-brand-border bg-brand-mist/60 px-4 py-4">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-rose/5 to-brand-amber/5" />
              <div className="relative z-10">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-graphite">
                  StudioFlow
                </p>
                <p className="mt-2 text-sm font-medium text-brand-ink/80">
                  Agenda, tarefas e atendimento em uma unica base.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col rounded-2xl border border-brand-border bg-white/[0.02] shadow-panel backdrop-blur">
          <header className="rounded-t-2xl border-b border-brand-border bg-white/[0.02] px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-amber/80">
                  StudioFlow
                </p>
                <h1 className="mt-1.5 text-2xl font-semibold text-brand-ink">
                  {currentPage?.label ?? 'StudioFlow'}
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-brand-graphite">
                  {currentPage?.description ??
                    'Interface para organizar atendimentos, tarefas e rotina do studio.'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="sf-chip text-brand-rose">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-rose animate-glow-pulse" />
                  MVP
                </span>
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
