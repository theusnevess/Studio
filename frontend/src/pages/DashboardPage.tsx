import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { formatDateTime } from '../utils/formatters'

const summaryCards = [
  {
    title: 'Atendimentos de hoje',
    value: '08',
    detail: '3 confirmados e 1 em observacao',
  },
  {
    title: 'Tarefas pendentes',
    value: '12',
    detail: '4 com prioridade alta',
  },
  {
    title: 'Clientes ativos',
    value: '74',
    detail: 'Base pronta para relacionamento recorrente',
  },
  {
    title: 'Lembretes do dia',
    value: '05',
    detail: 'Notificacoes internas para a operacao',
  },
]

const appointments = [
  {
    id: 1,
    title: 'Manutencao de alongamento',
    client: 'Ana Beatriz',
    startsAt: '2026-03-13T09:00:00',
    status: 'CONFIRMADO',
  },
  {
    id: 2,
    title: 'Banho de gel',
    client: 'Camila Nunes',
    startsAt: '2026-03-13T13:30:00',
    status: 'AGENDADO',
  },
  {
    id: 3,
    title: 'Pe decorado',
    client: 'Lorena Souza',
    startsAt: '2026-03-13T16:00:00',
    status: 'AGENDADO',
  },
]

const tasks = [
  {
    id: 1,
    title: 'Separar materiais para o sabado',
    project: 'Rotina semanal',
    status: 'A_FAZER',
    priority: 'ALTA',
  },
  {
    id: 2,
    title: 'Atualizar agenda da proxima semana',
    project: 'Agenda do mes',
    status: 'EM_ANDAMENTO',
    priority: 'MEDIA',
  },
  {
    id: 3,
    title: 'Conferir mensagens de confirmacao',
    project: 'Atendimento diario',
    status: 'A_FAZER',
    priority: 'ALTA',
  },
]

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
                      {appointment.title}
                    </p>
                    <p className="mt-1 text-sm text-brand-graphite/[0.76]">
                      {appointment.client}
                    </p>
                    <p className="mt-3 text-sm text-brand-graphite/[0.72]">
                      {formatDateTime(appointment.startsAt)}
                    </p>
                  </div>
                  <StatusBadge value={appointment.status} />
                </div>
              </div>
            ))}
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
                      {task.title}
                    </p>
                    <p className="mt-2 text-sm text-brand-graphite/[0.76]">
                      Projeto: {task.project}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={task.priority} />
                    <StatusBadge value={task.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="bg-[linear-gradient(180deg,rgba(255,241,244,0.96),rgba(255,249,247,0.96))]">
          <EmptyState
            title="Frontend pronto para integracao real"
            description="A base visual, as rotas e a infraestrutura de consumo da API ja estao estruturadas. Os proximos passos podem conectar listagens, formularios e estados reais do backend."
            actionLabel="Base preparada"
          />
        </AppCard>
      </div>
    </section>
  )
}
