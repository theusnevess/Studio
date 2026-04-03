import { useEffect, useState } from 'react'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FeedbackBanner } from '../components/FeedbackBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { usePageTitle } from '../hooks/usePageTitle'
import { projetoService } from '../services/projetoService'
import { tarefaService } from '../services/tarefaService'
import type { Projeto, StatusTarefa, Tarefa } from '../types/domain'
import { getErrorMessage } from '../utils/errors'
import { formatDate } from '../utils/formatters'

type SelectValue = 'TODOS' | `${number}`

type KanbanColumn = {
  status: StatusTarefa
  label: string
  accent: string
  bgGlow: string
}

const columns: KanbanColumn[] = [
  {
    status: 'A_FAZER',
    label: 'A fazer',
    accent: 'text-brand-amber',
    bgGlow: 'from-brand-amber/[0.05]',
  },
  {
    status: 'EM_ANDAMENTO',
    label: 'Em andamento',
    accent: 'text-sky-400',
    bgGlow: 'from-sky-400/[0.05]',
  },
  {
    status: 'CONCLUIDO',
    label: 'Concluído',
    accent: 'text-emerald-400',
    bgGlow: 'from-emerald-400/[0.05]',
  },
]

/**
 * Quadro Kanban para visualizacao e movimentacao de tarefas por status.
 */
export function KanbanPage() {
  usePageTitle('Kanban')

  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [projetoFilter, setProjetoFilter] = useState<SelectValue>('TODOS')
  const [movingId, setMovingId] = useState<number | null>(null)
  const [draggedTarefa, setDraggedTarefa] = useState<Tarefa | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<StatusTarefa | null>(null)

  useEffect(() => {
    void loadProjetos()
  }, [])

  useEffect(() => {
    void loadTarefas()
  }, [projetoFilter])

  async function loadProjetos() {
    try {
      const response = await projetoService.list()
      setProjetos(response)
    } catch (loadError) {
      setFeedback({ tone: 'error', message: getErrorMessage(loadError) })
    }
  }

  async function loadTarefas() {
    try {
      setLoading(true)
      setError(null)

      const response = await tarefaService.list({
        projetoId: projetoFilter === 'TODOS' ? undefined : Number(projetoFilter),
      })

      setTarefas(response)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  async function moveTarefa(tarefaId: number, newStatus: StatusTarefa) {
    try {
      setMovingId(tarefaId)
      setFeedback(null)
      await tarefaService.updateStatus(tarefaId, newStatus)
      setFeedback({
        tone: 'success',
        message: 'Tarefa movida com sucesso.',
      })
      await loadTarefas()
    } catch (moveError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(moveError),
      })
    } finally {
      setMovingId(null)
    }
  }

  function getNextStatus(current: StatusTarefa): StatusTarefa | null {
    if (current === 'A_FAZER') return 'EM_ANDAMENTO'
    if (current === 'EM_ANDAMENTO') return 'CONCLUIDO'
    return null
  }

  function getPrevStatus(current: StatusTarefa): StatusTarefa | null {
    if (current === 'CONCLUIDO') return 'EM_ANDAMENTO'
    if (current === 'EM_ANDAMENTO') return 'A_FAZER'
    return null
  }

  function tarefasByStatus(status: StatusTarefa) {
    return tarefas.filter((tarefa) => tarefa.status === status)
  }

  /* Drag handlers */
  function handleDragStart(tarefa: Tarefa) {
    setDraggedTarefa(tarefa)
  }

  function handleDragEnd() {
    setDraggedTarefa(null)
    setDragOverColumn(null)
  }

  function handleDragOver(event: React.DragEvent, status: StatusTarefa) {
    event.preventDefault()
    setDragOverColumn(status)
  }

  function handleDragLeave() {
    setDragOverColumn(null)
  }

  function handleDrop(event: React.DragEvent, targetStatus: StatusTarefa) {
    event.preventDefault()
    setDragOverColumn(null)

    if (draggedTarefa && draggedTarefa.status !== targetStatus) {
      void moveTarefa(draggedTarefa.id, targetStatus)
    }

    setDraggedTarefa(null)
  }

  const totalTarefas = tarefas.length
  const completedCount = tarefasByStatus('CONCLUIDO').length
  const progressPercent = totalTarefas > 0 ? Math.round((completedCount / totalTarefas) * 100) : 0

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Visão Kanban"
        title="Quadro de Tarefas"
        description="Arraste tarefas entre colunas ou use os botões para mover. Visualize o fluxo completo de trabalho do studio."
        action={`${totalTarefas} tarefa(s) no quadro`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      {/* Filters + progress */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={projetoFilter}
            onChange={(event) =>
              setProjetoFilter(event.target.value as SelectValue)
            }
            className="sf-select w-auto"
          >
            <option value="TODOS">Todos os projetos</option>
            {projetos.map((projeto) => (
              <option key={projeto.id} value={String(projeto.id)}>
                {projeto.nome}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            {columns.map((col) => (
              <span key={col.status} className="flex items-center gap-1.5 text-xs text-brand-graphite">
                <span className={`h-2 w-2 rounded-full ${
                  col.status === 'A_FAZER' ? 'bg-brand-amber' :
                  col.status === 'EM_ANDAMENTO' ? 'bg-sky-400' : 'bg-emerald-400'
                }`} />
                {tarefasByStatus(col.status).length}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-brand-graphite">
            Progresso
          </span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-brand-mist">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-rose to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-brand-ink">
            {progressPercent}%
          </span>
        </div>
      </div>

      {loading ? <LoadingState label="Carregando quadro Kanban..." /> : null}

      {!loading && error ? (
        <ErrorState
          title="Falha ao carregar o quadro"
          description={error}
          actionLabel="Tentar novamente"
          onRetry={() => void loadTarefas()}
        />
      ) : null}

      {!loading && !error && tarefas.length === 0 ? (
        <AppCard>
          <EmptyState
            title="Nenhuma tarefa encontrada"
            description="Crie tarefas na página de Tarefas para visualizá-las aqui no quadro Kanban."
            actionLabel="Quadro vazio"
          />
        </AppCard>
      ) : null}

      {/* Kanban Columns */}
      {!loading && !error && tarefas.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3 animate-fade-in-up">
          {columns.map((column) => {
            const columnTarefas = tarefasByStatus(column.status)
            const isDragTarget = dragOverColumn === column.status && draggedTarefa?.status !== column.status

            return (
              <div
                key={column.status}
                onDragOver={(e) => handleDragOver(e, column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
                className={[
                  'flex flex-col rounded-2xl border transition-all duration-200',
                  isDragTarget
                    ? 'border-brand-rose/40 bg-brand-rose/[0.04] scale-[1.01]'
                    : 'border-brand-border bg-white/[0.015]',
                ].join(' ')}
              >
                {/* Column header */}
                <div className={`relative overflow-hidden rounded-t-2xl border-b border-brand-border px-5 py-4 bg-gradient-to-br ${column.bgGlow} to-transparent`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        column.status === 'A_FAZER' ? 'bg-brand-amber' :
                        column.status === 'EM_ANDAMENTO' ? 'bg-sky-400' : 'bg-emerald-400'
                      }`} />
                      <h3 className={`text-sm font-semibold ${column.accent}`}>
                        {column.label}
                      </h3>
                    </div>
                    <span className="rounded-lg bg-brand-mist px-2.5 py-1 text-xs font-semibold text-brand-graphite">
                      {columnTarefas.length}
                    </span>
                  </div>
                </div>

                {/* Column body */}
                <div className="flex flex-1 flex-col gap-3 p-3 min-h-[200px]">
                  {columnTarefas.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-brand-border/50 p-6">
                      <p className="text-center text-xs text-brand-graphite/50">
                        {isDragTarget
                          ? 'Solte aqui para mover'
                          : 'Sem tarefas nesta coluna'}
                      </p>
                    </div>
                  ) : null}

                  {columnTarefas.map((tarefa) => {
                    const nextStatus = getNextStatus(tarefa.status)
                    const prevStatus = getPrevStatus(tarefa.status)
                    const isMoving = movingId === tarefa.id
                    const isDragging = draggedTarefa?.id === tarefa.id

                    return (
                      <article
                        key={tarefa.id}
                        draggable
                        onDragStart={() => handleDragStart(tarefa)}
                        onDragEnd={handleDragEnd}
                        className={[
                          'group cursor-grab rounded-xl border border-brand-border bg-brand-mist/50 p-4 transition-all duration-200',
                          'hover:border-brand-rose/20 hover:bg-brand-mist/70 hover:shadow-soft',
                          isDragging ? 'opacity-40 scale-95' : '',
                          isMoving ? 'animate-pulse pointer-events-none' : '',
                        ].join(' ')}
                      >
                        {/* Card header */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-brand-ink leading-snug">
                            {tarefa.titulo}
                          </h4>
                          <StatusBadge value={tarefa.prioridade} />
                        </div>

                        {/* Card body */}
                        <div className="mt-2.5 space-y-1">
                          {tarefa.descricao ? (
                            <p className="line-clamp-2 text-xs leading-5 text-brand-graphite/70">
                              {tarefa.descricao}
                            </p>
                          ) : null}
                          <p className="text-[11px] text-brand-graphite/50">
                            {tarefa.projetoNome || `Projeto #${tarefa.projetoId}`}
                          </p>
                        </div>

                        {/* Card footer — metadata */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {tarefa.responsavelNome ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-surface-raise px-2 py-1 text-[10px] font-medium text-brand-graphite">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              {tarefa.responsavelNome}
                            </span>
                          ) : null}
                          {tarefa.dataVencimento ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-surface-raise px-2 py-1 text-[10px] font-medium text-brand-graphite">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {formatDate(tarefa.dataVencimento)}
                            </span>
                          ) : null}
                        </div>

                        {/* Move buttons */}
                        <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          {prevStatus ? (
                            <button
                              type="button"
                              disabled={isMoving}
                              onClick={() => void moveTarefa(tarefa.id, prevStatus)}
                              className="flex-1 rounded-lg border border-brand-border bg-brand-surface-raise/60 px-3 py-1.5 text-[10px] font-medium text-brand-graphite transition hover:border-brand-rose/20 hover:text-brand-ink disabled:opacity-40"
                            >
                              ← {columns.find((c) => c.status === prevStatus)?.label}
                            </button>
                          ) : null}
                          {nextStatus ? (
                            <button
                              type="button"
                              disabled={isMoving}
                              onClick={() => void moveTarefa(tarefa.id, nextStatus)}
                              className="flex-1 rounded-lg border border-brand-border bg-brand-surface-raise/60 px-3 py-1.5 text-[10px] font-medium text-brand-graphite transition hover:border-brand-rose/20 hover:text-brand-ink disabled:opacity-40"
                            >
                              {columns.find((c) => c.status === nextStatus)?.label} →
                            </button>
                          ) : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
