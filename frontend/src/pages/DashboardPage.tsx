import { useEffect, useState } from 'react'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
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
 *
 * Nesta etapa, a tela ja apresenta uma versao mais realista da operacao do
 * studio, com cards de resumo e secoes preparadas para integracao futura.
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
        setTasks(tasksResponse.filter((task) => task.status !== 'CONCLUIDO').slice(0, 3))
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <AppCard key={card.title} className="overflow-hidden">
            <p className="text-sm font-medium text-brand-graphite/[0.72]">
              {card.title}
            </p>
            <p className="mt-4 font-serif text-5xl font-semibold text-brand-ink">
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-brand-graphite/[0.78]">
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

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AppCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-brand-ink">
                Proximos atendimentos
              </h2>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.74]">
                Bloco inicial da agenda operacional, pronto para receber dados reais do backend.
              </p>
            </div>
            <span className="rounded-full bg-brand-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-berry">
              Hoje
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-[24px] border border-brand-border bg-white/80 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-brand-ink">
                      {appointment.titulo}
                    </p>
                    <p className="mt-1 text-sm text-brand-graphite/[0.76]">
                      {appointment.clienteNome || 'Cliente nao identificado'}
                    </p>
                    <p className="mt-3 text-sm text-brand-graphite/[0.72]">
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
          <h2 className="font-serif text-2xl font-semibold text-brand-ink">
            Atalhos do dia
          </h2>
          <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.74]">
            Acoes rapidas para manter o fluxo da rotina organizado.
          </p>

          <div className="mt-6 grid gap-3">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                className="rounded-[22px] border border-brand-border bg-brand-cream px-4 py-4 text-left text-sm font-medium text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
              >
                {action}
              </button>
            ))}
          </div>
        </AppCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AppCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-brand-ink">
                Tarefas pendentes
              </h2>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.74]">
                Visao resumida do que sera refletido no Kanban e nas listas operacionais.
              </p>
            </div>
            <span className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-graphite">
              3 destaques
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[24px] border border-brand-border bg-white/80 p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-brand-ink">
                      {task.titulo}
                    </p>
                    <p className="mt-2 text-sm text-brand-graphite/[0.76]">
                      Projeto: {task.projetoNome || `Projeto #${task.projetoId}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={task.prioridade} />
                    <StatusBadge value={task.status} />
                  </div>
                </div>
              </div>
            ))}
            {!loading && tasks.length === 0 ? (
              <EmptyState
                title="Sem tarefas em aberto"
                description="As tarefas operacionais em aberto aparecerao aqui para orientar a rotina do studio."
                actionLabel="Fluxo em dia"
              />
            ) : null}
          </div>
        </AppCard>

        <AppCard className="bg-[linear-gradient(180deg,rgba(255,241,244,0.96),rgba(255,249,247,0.96))]">
          <h2 className="font-serif text-2xl font-semibold text-brand-ink">
            Lembretes internos
          </h2>
          <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.74]">
            Notificacoes nao visualizadas para acompanhar o que pede atencao no sistema.
          </p>

          <div className="mt-6 space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-[22px] border border-brand-border bg-white/82 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-brand-ink">
                    {notification.titulo}
                  </p>
                  <StatusBadge value={notification.tipo} />
                </div>
                <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                  {notification.mensagem}
                </p>
              </div>
            ))}
            {!loading && notifications.length === 0 ? (
              <EmptyState
                title="Sem lembretes pendentes"
                description="As notificacoes internas nao visualizadas serao exibidas aqui quando existirem."
                actionLabel="Caixa limpa"
              />
            ) : null}
          </div>
        </AppCard>
      </div>
    </section>
  )
}
