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
 * Tela integrada de tarefas, preparada para alimentar o futuro Kanban.
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
        description="Controle real das tarefas do studio com filtros por status e projeto, formulario completo e atualizacao rapida de status para sustentar o futuro Kanban."
        action={`${tarefas.length} tarefa(s) visiveis`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <AppCard className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                Lista de tarefas
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Filtre por status ou projeto e acompanhe o andamento da rotina.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as TarefaFilterStatus)
                }
                className="rounded-[18px] border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
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
                className="rounded-[18px] border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
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
                className="rounded-[20px] bg-gradient-to-r from-brand-rose to-brand-berry px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-soft transition hover:opacity-95"
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
              description="Ainda nao ha tarefas para os filtros selecionados. Crie a primeira tarefa operacional do studio."
              actionLabel="Criar tarefa"
            />
          ) : null}

          {!loading && !error && tarefas.length > 0 ? (
            <div className="space-y-4">
              {tarefas.map((tarefa) => (
                <article
                  key={tarefa.id}
                  className="rounded-[26px] border border-brand-border bg-white/85 p-5"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-brand-ink">
                            {tarefa.titulo}
                          </h4>
                          <StatusBadge value={tarefa.status} />
                          <StatusBadge value={tarefa.prioridade} />
                        </div>
                        <div className="mt-3 space-y-2 text-sm leading-6 text-brand-graphite/[0.8]">
                          <p>
                            <strong>Projeto:</strong>{' '}
                            {tarefa.projetoNome || `Projeto #${tarefa.projetoId}`}
                          </p>
                          <p>
                            <strong>Responsavel:</strong>{' '}
                            {tarefa.responsavelNome || 'Nao atribuido'}
                          </p>
                          <p>
                            <strong>Descricao:</strong>{' '}
                            {tarefa.descricao || 'Sem descricao cadastrada.'}
                          </p>
                          <p>
                            <strong>Vencimento:</strong>{' '}
                            {tarefa.dataVencimento
                              ? formatDateTime(tarefa.dataVencimento)
                              : 'Sem prazo definido'}
                          </p>
                          {tarefa.updatedAt ? (
                            <p>
                              <strong>Atualizada em:</strong>{' '}
                              {formatDate(tarefa.updatedAt)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEdit(tarefa)}
                        className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
                      >
                        Editar
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 rounded-[22px] bg-brand-cream p-4 sm:flex-row sm:items-center">
                      <select
                        value={statusDrafts[tarefa.id] ?? tarefa.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [tarefa.id]: event.target.value as StatusTarefa,
                          }))
                        }
                        className="flex-1 rounded-[18px] border border-brand-border bg-white px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
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
                        className="rounded-[18px] border border-brand-border bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
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

        <AppCard className="h-fit space-y-6 xl:sticky xl:top-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                {editingTarefa ? 'Editar tarefa' : 'Nova tarefa'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Defina projeto, prioridade, responsavel e prazo da tarefa.
              </p>
            </div>
            {editingTarefa ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:bg-brand-mist"
              >
                Cancelar
              </button>
            ) : null}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                  className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                  className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
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
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
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
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
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
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[22px] bg-gradient-to-r from-brand-rose to-brand-berry px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
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
