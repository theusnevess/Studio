import { useEffect, useState } from 'react'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FeedbackBanner } from '../components/FeedbackBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { usePageTitle } from '../hooks/usePageTitle'
import { tarefaService } from '../services/tarefaService'
import type { StatusTarefa, Tarefa } from '../types/domain'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatDateTime } from '../utils/formatters'

const columns: {
  key: StatusTarefa
  title: string
  description: string
}[] = [
  {
    key: 'A_FAZER',
    title: 'A fazer',
    description: 'Demandas que ainda nao iniciaram.',
  },
  {
    key: 'EM_ANDAMENTO',
    title: 'Em andamento',
    description: 'Atividades atualmente em execucao.',
  },
  {
    key: 'CONCLUIDO',
    title: 'Concluido',
    description: 'Entregas finalizadas no fluxo do studio.',
  },
]

const nextStatusMap: Record<StatusTarefa, StatusTarefa | null> = {
  A_FAZER: 'EM_ANDAMENTO',
  EM_ANDAMENTO: 'CONCLUIDO',
  CONCLUIDO: null,
}

const previousStatusMap: Record<StatusTarefa, StatusTarefa | null> = {
  A_FAZER: null,
  EM_ANDAMENTO: 'A_FAZER',
  CONCLUIDO: 'EM_ANDAMENTO',
}

/**
 * Kanban funcional sem drag-and-drop, priorizando estabilidade e clareza.
 */
export function KanbanPage() {
  usePageTitle('Kanban')

  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null)

  useEffect(() => {
    void loadTarefas()
  }, [])

  async function loadTarefas() {
    try {
      setLoading(true)
      setError(null)
      const response = await tarefaService.list()
      setTarefas(response)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  async function moveTask(task: Tarefa, nextStatus: StatusTarefa) {
    try {
      setUpdatingTaskId(task.id)
      setFeedback(null)
      await tarefaService.updateStatus(task.id, nextStatus)
      setFeedback({
        tone: 'success',
        message: `Tarefa "${task.titulo}" movida para ${nextStatus.toLowerCase().replaceAll('_', ' ')}.`,
      })
      await loadTarefas()
    } catch (updateError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(updateError),
      })
    } finally {
      setUpdatingTaskId(null)
    }
  }

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Fluxo visual"
        title="Kanban"
        description="Quadro funcional alimentado por tarefas reais do backend, organizado pelas colunas centrais do MVP para acompanhamento operacional do studio."
        action={`${tarefas.length} tarefa(s) no quadro`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      {loading ? <LoadingState label="Carregando quadro Kanban..." /> : null}

      {!loading && error ? (
        <ErrorState
          title="Falha ao carregar o Kanban"
          description={error}
          actionLabel="Tentar novamente"
          onRetry={() => void loadTarefas()}
        />
      ) : null}

      {!loading && !error && tarefas.length === 0 ? (
        <AppCard>
          <EmptyState
            title="Nenhuma tarefa para exibir"
            description="Crie tarefas no modulo operacional para começar a visualizar o fluxo do studio no Kanban."
            actionLabel="Fluxo aguardando dados"
          />
        </AppCard>
      ) : null}

      {!loading && !error && tarefas.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-3">
          {columns.map((column) => {
            const columnTasks = tarefas.filter((task) => task.status === column.key)

            return (
              <AppCard key={column.key} className="flex h-full flex-col">
                <div className="border-b border-brand-border pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                        {column.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                        {column.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-berry">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex-1 space-y-4">
                  {columnTasks.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-brand-border bg-brand-cream/80 p-5 text-sm leading-6 text-brand-graphite/[0.76]">
                      Nenhuma tarefa nesta coluna no momento.
                    </div>
                  ) : null}

                  {columnTasks.map((task) => {
                    const previousStatus = previousStatusMap[task.status]
                    const nextStatus = nextStatusMap[task.status]

                    return (
                      <article
                        key={task.id}
                        className="rounded-[24px] border border-brand-border bg-white/88 p-5"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-semibold text-brand-ink">
                            {task.titulo}
                          </h4>
                          <StatusBadge value={task.prioridade} />
                        </div>

                        <div className="mt-3 space-y-2 text-sm leading-6 text-brand-graphite/[0.8]">
                          <p>
                            <strong>Projeto:</strong>{' '}
                            {task.projetoNome || `Projeto #${task.projetoId}`}
                          </p>
                          <p>
                            <strong>Responsavel:</strong>{' '}
                            {task.responsavelNome || 'Nao atribuido'}
                          </p>
                          <p>
                            <strong>Vencimento:</strong>{' '}
                            {task.dataVencimento
                              ? formatDateTime(task.dataVencimento)
                              : 'Sem prazo definido'}
                          </p>
                          {task.updatedAt ? (
                            <p>
                              <strong>Atualizada em:</strong>{' '}
                              {formatDate(task.updatedAt)}
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          {previousStatus ? (
                            <button
                              type="button"
                              disabled={updatingTaskId === task.id}
                              onClick={() => void moveTask(task, previousStatus)}
                              className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Voltar
                            </button>
                          ) : null}

                          {nextStatus ? (
                            <button
                              type="button"
                              disabled={updatingTaskId === task.id}
                              onClick={() => void moveTask(task, nextStatus)}
                              className="rounded-full bg-gradient-to-r from-brand-rose to-brand-berry px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Avancar
                            </button>
                          ) : (
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                              Entrega finalizada
                            </span>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </AppCard>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
