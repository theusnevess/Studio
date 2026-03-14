import { useEffect, useState, type FormEvent } from 'react'
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
import { usuarioService } from '../services/usuarioService'
import type {
  PrioridadeTarefa,
  Projeto,
  StatusTarefa,
  Tarefa,
  TarefaRequest,
  Usuario,
} from '../types/domain'
import { getErrorMessage } from '../utils/errors'
import {
  formatDate,
  formatDateTime,
  toApiDateTime,
  toDateTimeLocalValue,
} from '../utils/formatters'

type TarefaFilterStatus = 'TODOS' | StatusTarefa
type SelectValue = 'TODOS' | `${number}`

type TarefaFormState = {
  titulo: string
  descricao: string
  status: StatusTarefa
  prioridade: PrioridadeTarefa
  dataVencimento: string
  projetoId: string
  responsavelId: string
}

const statusOptions: { value: StatusTarefa; label: string }[] = [
  { value: 'A_FAZER', label: 'A fazer' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONCLUIDO', label: 'Concluido' },
]

const prioridadeOptions: { value: PrioridadeTarefa; label: string }[] = [
  { value: 'ALTA', label: 'Alta' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'BAIXA', label: 'Baixa' },
]

const initialForm: TarefaFormState = {
  titulo: '',
  descricao: '',
  status: 'A_FAZER',
  prioridade: 'MEDIA',
  dataVencimento: '',
  projetoId: '',
  responsavelId: '',
}

function parseOptionalId(value: string) {
  return value ? Number(value) : undefined
}

/**
 * Tela integrada de tarefas para acompanhamento operacional do studio.
 */
export function TarefasPage() {
  usePageTitle('Tarefas')

  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [statusFilter, setStatusFilter] = useState<TarefaFilterStatus>('TODOS')
  const [projetoFilter, setProjetoFilter] = useState<SelectValue>('TODOS')
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null)
  const [formData, setFormData] = useState<TarefaFormState>(initialForm)
  const [statusDrafts, setStatusDrafts] = useState<Record<number, StatusTarefa>>(
    {},
  )

  useEffect(() => {
    void loadDependencies()
  }, [])

  useEffect(() => {
    void loadTarefas(statusFilter, projetoFilter)
  }, [statusFilter, projetoFilter])

  async function loadDependencies() {
    try {
      const [projetosResponse, usuariosResponse] = await Promise.all([
        projetoService.list(),
        usuarioService.list(),
      ])

      setProjetos(projetosResponse)
      setUsuarios(usuariosResponse.filter((usuario) => usuario.ativo))
    } catch (dependencyError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(dependencyError),
      })
    }
  }

  async function loadTarefas(
    nextStatus: TarefaFilterStatus,
    nextProjeto: SelectValue,
  ) {
    try {
      setLoading(true)
      setError(null)

      const response = await tarefaService.list({
        status: nextStatus === 'TODOS' ? undefined : nextStatus,
        projetoId: nextProjeto === 'TODOS' ? undefined : Number(nextProjeto),
      })

      setTarefas(response)
      setStatusDrafts(
        Object.fromEntries(response.map((tarefa) => [tarefa.id, tarefa.status])),
      )
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingTarefa(null)
    setFormData(initialForm)
  }

  function startCreate() {
    setFeedback(null)
    resetForm()
  }

  function startEdit(tarefa: Tarefa) {
    setFeedback(null)
    setEditingTarefa(tarefa)
    setFormData({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao ?? '',
      status: tarefa.status,
      prioridade: tarefa.prioridade,
      dataVencimento: toDateTimeLocalValue(tarefa.dataVencimento),
      projetoId: String(tarefa.projetoId),
      responsavelId: tarefa.responsavelId ? String(tarefa.responsavelId) : '',
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.projetoId) {
      setFeedback({
        tone: 'error',
        message: 'Selecione um projeto para a tarefa.',
      })
      return
    }

    try {
      setSubmitting(true)
      setFeedback(null)

      const payload: TarefaRequest = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim() || undefined,
        status: formData.status,
        prioridade: formData.prioridade,
        dataVencimento: toApiDateTime(formData.dataVencimento),
        projetoId: Number(formData.projetoId),
        responsavelId: parseOptionalId(formData.responsavelId),
      }

      if (editingTarefa) {
        await tarefaService.update(editingTarefa.id, payload)
        setFeedback({
          tone: 'success',
          message: 'Tarefa atualizada com sucesso.',
        })
      } else {
        await tarefaService.create(payload)
        setFeedback({
          tone: 'success',
          message: 'Tarefa criada com sucesso.',
        })
      }

      resetForm()
      await loadTarefas(statusFilter, projetoFilter)
    } catch (submitError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(submitError),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusUpdate(tarefaId: number) {
    try {
      const nextStatus = statusDrafts[tarefaId]

      if (!nextStatus) {
        return
      }

      await tarefaService.updateStatus(tarefaId, nextStatus)
      setFeedback({
        tone: 'success',
        message: 'Status da tarefa atualizado com sucesso.',
      })
      await loadTarefas(statusFilter, projetoFilter)
    } catch (statusError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(statusError),
      })
    }
  }

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Fluxo operacional"
        title="Tarefas"
        description="Controle real das tarefas do studio com filtros por status e projeto, formulario completo e atualizacao rapida de status."
        action={`${tarefas.length} tarefa(s) visiveis`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.95fr]">
        <AppCard className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-brand-ink">
                Lista de tarefas
              </h3>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Filtre por status ou projeto.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as TarefaFilterStatus)
                }
                className="sf-select"
              >
                <option value="TODOS">Todos os status</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <select
                value={projetoFilter}
                onChange={(event) =>
                  setProjetoFilter(event.target.value as SelectValue)
                }
                className="sf-select"
              >
                <option value="TODOS">Todos os projetos</option>
                {projetos.map((projeto) => (
                  <option key={projeto.id} value={String(projeto.id)}>
                    {projeto.nome}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={startCreate}
                className="sf-button-primary whitespace-nowrap"
              >
                Nova tarefa
              </button>
            </div>
          </div>

          {loading ? <LoadingState label="Carregando tarefas..." /> : null}

          {!loading && error ? (
            <ErrorState
              title="Falha ao carregar tarefas"
              description={error}
              actionLabel="Tentar novamente"
              onRetry={() => void loadTarefas(statusFilter, projetoFilter)}
            />
          ) : null}

          {!loading && !error && tarefas.length === 0 ? (
            <EmptyState
              title="Nenhuma tarefa encontrada"
              description="Ainda nao ha tarefas para os filtros selecionados."
              actionLabel="Criar tarefa"
            />
          ) : null}

          {!loading && !error && tarefas.length > 0 ? (
            <div className="space-y-3">
              {tarefas.map((tarefa) => (
                <article
                  key={tarefa.id}
                  className="rounded-xl border border-brand-border bg-brand-mist/40 p-4"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-medium text-brand-ink">
                            {tarefa.titulo}
                          </h4>
                          <StatusBadge value={tarefa.status} />
                          <StatusBadge value={tarefa.prioridade} />
                        </div>
                        <div className="mt-2 space-y-1 text-sm leading-6 text-brand-graphite">
                          <p>
                            <strong className="text-brand-ink/60">Projeto:</strong>{' '}
                            {tarefa.projetoNome || `Projeto #${tarefa.projetoId}`}
                          </p>
                          <p>
                            <strong className="text-brand-ink/60">Responsavel:</strong>{' '}
                            {tarefa.responsavelNome || 'Nao atribuido'}
                          </p>
                          <p>
                            <strong className="text-brand-ink/60">Descricao:</strong>{' '}
                            {tarefa.descricao || 'Sem descricao.'}
                          </p>
                          <p>
                            <strong className="text-brand-ink/60">Vencimento:</strong>{' '}
                            {tarefa.dataVencimento
                              ? formatDateTime(tarefa.dataVencimento)
                              : 'Sem prazo'}
                          </p>
                          {tarefa.updatedAt ? (
                            <p>
                              <strong className="text-brand-ink/60">Atualizada em:</strong>{' '}
                              {formatDate(tarefa.updatedAt)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEdit(tarefa)}
                        className="sf-button-secondary"
                      >
                        Editar
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl bg-brand-surface-raise/60 p-3 sm:flex-row sm:items-center">
                      <select
                        value={statusDrafts[tarefa.id] ?? tarefa.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [tarefa.id]: event.target.value as StatusTarefa,
                          }))
                        }
                        className="sf-select flex-1"
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => void handleStatusUpdate(tarefa.id)}
                        className="sf-button-secondary"
                      >
                        Atualizar status
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </AppCard>

        <AppCard className="h-fit space-y-5 xl:sticky xl:top-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-brand-ink">
                {editingTarefa ? 'Editar tarefa' : 'Nova tarefa'}
              </h3>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Defina projeto, prioridade e prazo.
              </p>
            </div>
            {editingTarefa ? (
              <button
                type="button"
                onClick={resetForm}
                className="sf-button-secondary"
              >
                Cancelar
              </button>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Titulo
              </span>
              <input
                required
                value={formData.titulo}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    titulo: event.target.value,
                  }))
                }
                placeholder="Ex.: Organizar materiais da semana"
                className="sf-input"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Descricao
              </span>
              <textarea
                rows={4}
                value={formData.descricao}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    descricao: event.target.value,
                  }))
                }
                placeholder="Descreva o que precisa ser feito."
                className="sf-textarea"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                  Status
                </span>
                <select
                  value={formData.status}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      status: event.target.value as StatusTarefa,
                    }))
                  }
                  className="sf-select"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                  Prioridade
                </span>
                <select
                  value={formData.prioridade}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      prioridade: event.target.value as PrioridadeTarefa,
                    }))
                  }
                  className="sf-select"
                >
                  {prioridadeOptions.map((prioridade) => (
                    <option key={prioridade.value} value={prioridade.value}>
                      {prioridade.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Projeto
              </span>
              <select
                required
                value={formData.projetoId}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    projetoId: event.target.value,
                  }))
                }
                className="sf-select"
              >
                <option value="">Selecione um projeto</option>
                {projetos.map((projeto) => (
                  <option key={projeto.id} value={String(projeto.id)}>
                    {projeto.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Responsavel
              </span>
              <select
                value={formData.responsavelId}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    responsavelId: event.target.value,
                  }))
                }
                className="sf-select"
              >
                <option value="">Sem responsavel</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={String(usuario.id)}>
                    {usuario.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Data de vencimento
              </span>
              <input
                type="datetime-local"
                value={formData.dataVencimento}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    dataVencimento: event.target.value,
                  }))
                }
                className="sf-input"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="sf-button-primary w-full"
            >
              {submitting
                ? 'Salvando...'
                : editingTarefa
                  ? 'Salvar alteracoes'
                  : 'Criar tarefa'}
            </button>
          </form>
        </AppCard>
      </div>
    </section>
  )
}
