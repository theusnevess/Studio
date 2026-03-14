import { useEffect, useState } from 'react'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { NailArtAnimation } from '../components/NailArtAnimation'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { agendamentoService } from '../services/agendamentoService'
import { notificacaoService } from '../services/notificacaoService'
import { tarefaService } from '../services/tarefaService'
import type { Agendamento, Notificacao, Tarefa } from '../types/domain'
import { getErrorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/formatters'

const quickActions = [
  'Cadastrar nova cliente',
  'Abrir painel de tarefas',
  'Revisar agenda do dia',
  'Consultar notificacoes internas',
]

/**
 * Pagina inicial do painel.
 */
export function DashboardPage() {
  const [appointments, setAppointments] = useState<Agendamento[]>([])
  const [tasks, setTasks] = useState<Tarefa[]>([])
  const [notifications, setNotifications] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError(null)

        const [appointmentsResponse, tasksResponse, notificationsResponse] =
          await Promise.all([
            agendamentoService.list(),
            tarefaService.list(),
            notificacaoService.list({ visualizada: false }),
          ])

        setAppointments(appointmentsResponse.slice(0, 3))
        setTasks(
          tasksResponse
            .filter((task) => task.status !== 'CONCLUIDO')
            .slice(0, 3),
        )
        setNotifications(notificationsResponse.slice(0, 4))
      } catch (loadError) {
        setError(getErrorMessage(loadError))
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const summaryCards = [
    {
      title: 'Atendimentos carregados',
      value: String(appointments.length).padStart(2, '0'),
      detail: 'Baseado nos proximos itens carregados do backend',
    },
    {
      title: 'Tarefas abertas',
      value: String(tasks.length).padStart(2, '0'),
      detail: 'Pendencias operacionais exibidas no painel',
    },
    {
      title: 'Lembretes pendentes',
      value: String(notifications.length).padStart(2, '0'),
      detail: 'Notificacoes nao visualizadas do sistema',
    },
    {
      title: 'Base pronta',
      value: 'API',
      detail: 'Frontend consumindo dados reais dos modulos centrais',
    },
  ]

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Visao geral"
        title="Painel do studio"
        description="Resumo inicial da operacao com foco em organizacao, acompanhamento diario e tomada rapida de acao."
      />

      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-white/[0.02] px-6 py-8 lg:px-8">
        <NailArtAnimation />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-rose/80">
              Rotina organizada
            </p>
            <h3 className="mt-3 max-w-3xl text-3xl font-semibold text-brand-ink lg:text-4xl">
              Uma base bonita, clara e realmente utilizavel no dia a dia do studio.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-brand-graphite">
              O StudioFlow concentra clientes, tarefas, atendimentos e lembretes em um painel unico, com leitura simples e cara de produto real.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                className="rounded-xl border border-brand-border bg-white/[0.03] px-4 py-3 text-left text-sm font-medium text-brand-ink/80 transition hover:border-brand-rose/20 hover:bg-white/[0.06]"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-fade-in-up [animation-delay:100ms]">
        {summaryCards.map((card) => (
          <AppCard key={card.title} className="relative overflow-hidden">
            <div className="pointer-events-none absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-brand-rose/[0.04] blur-2xl" />
            <p className="relative z-10 text-sm font-medium text-brand-graphite">
              {card.title}
            </p>
            <p className="relative z-10 mt-3 text-4xl font-semibold text-brand-ink">
              {card.value}
            </p>
            <p className="relative z-10 mt-2 text-sm leading-6 text-brand-graphite/70">
              {card.detail}
            </p>
          </AppCard>
        ))}
      </div>

      {loading ? <LoadingState label="Carregando resumo real do studio..." /> : null}

      {!loading && error ? (
        <ErrorState
          title="Falha ao carregar o painel"
          description={error}
          actionLabel="Atualizar painel"
          onRetry={() => window.location.reload()}
        />
      ) : null}

      {/* Appointments + Shortcuts */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr] animate-fade-in-up [animation-delay:200ms]">
        <AppCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-brand-ink">
                Proximos atendimentos
              </h2>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Bloco inicial da agenda operacional.
              </p>
            </div>
            <span className="sf-chip text-brand-amber">
              Hoje
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border border-brand-border bg-brand-mist/40 px-4 py-3 transition-colors hover:bg-brand-mist/60"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-medium text-brand-ink">
                      {appointment.titulo}
                    </p>
                    <p className="mt-0.5 text-sm text-brand-graphite">
                      {appointment.clienteNome || 'Cliente nao identificado'}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-brand-graphite/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-rose animate-glow-pulse" />
                      {formatDateTime(appointment.dataHoraInicio)}
                    </p>
                  </div>
                  <StatusBadge value={appointment.status} />
                </div>
              </div>
            ))}

            {!loading && appointments.length === 0 ? (
              <EmptyState
                title="Sem atendimentos no painel"
                description="Quando houver agendamentos no backend, os proximos horarios aparecerao aqui."
                actionLabel="Agenda vazia"
              />
            ) : null}
          </div>
        </AppCard>

        <AppCard>
          <h2 className="text-xl font-semibold text-brand-ink">
            Atalhos do dia
          </h2>
          <p className="mt-1 text-sm leading-6 text-brand-graphite">
            Acoes rapidas para manter o fluxo organizado.
          </p>

          <div className="mt-5 grid gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                className="rounded-xl border border-brand-border bg-brand-mist/40 px-4 py-3 text-left text-sm font-medium text-brand-ink/80 transition hover:border-brand-rose/20 hover:bg-brand-mist/60"
              >
                {action}
              </button>
            ))}
          </div>
        </AppCard>
      </div>

      {/* Tasks + Notifications */}
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] animate-fade-in-up [animation-delay:300ms]">
        <AppCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-brand-ink">
                Tarefas pendentes
              </h2>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Visao resumida das tarefas operacionais.
              </p>
            </div>
            <span className="sf-chip">
              3 destaques
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-brand-border bg-brand-mist/40 px-4 py-3 transition-colors hover:bg-brand-mist/60"
              >
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-base font-medium text-brand-ink">
                      {task.titulo}
                    </p>
                    <p className="mt-1 text-sm text-brand-graphite">
                      Projeto: {task.projetoNome || `Projeto #${task.projetoId}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <StatusBadge value={task.prioridade} />
                    <StatusBadge value={task.status} />
                  </div>
                </div>
              </div>
            ))}

            {!loading && tasks.length === 0 ? (
              <EmptyState
                title="Sem tarefas em aberto"
                description="As tarefas operacionais em aberto aparecerao aqui."
                actionLabel="Fluxo em dia"
              />
            ) : null}
          </div>
        </AppCard>

        <AppCard className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-rose/[0.03] to-brand-amber/[0.03]" />
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-brand-ink">
              Lembretes internos
            </h2>
            <p className="mt-1 text-sm leading-6 text-brand-graphite">
              Notificacoes nao visualizadas do sistema.
            </p>

            <div className="mt-5 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-brand-border bg-white/[0.03] p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-brand-ink">
                      {notification.titulo}
                    </p>
                    <StatusBadge value={notification.tipo} />
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-brand-graphite/80">
                    {notification.mensagem}
                  </p>
                </div>
              ))}

              {!loading && notifications.length === 0 ? (
                <EmptyState
                  title="Sem lembretes pendentes"
                  description="As notificacoes internas nao visualizadas serao exibidas aqui."
                  actionLabel="Caixa limpa"
                />
              ) : null}
            </div>
          </div>
        </AppCard>
      </div>
    </section>
  )
}
