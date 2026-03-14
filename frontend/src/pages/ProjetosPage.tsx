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
import type {
  Projeto,
  ProjetoRequest,
  StatusProjeto,
} from '../types/domain'
import { getErrorMessage } from '../utils/errors'
import { formatDate } from '../utils/formatters'

const statusOptions: { value: StatusProjeto; label: string }[] = [
  { value: 'PLANEJADO', label: 'Planejado' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONCLUIDO', label: 'Concluido' },
  { value: 'ARQUIVADO', label: 'Arquivado' },
]

const initialForm: ProjetoRequest = {
  nome: '',
  descricao: '',
  status: 'PLANEJADO',
}

/**
 * Tela integrada de projetos para as frentes operacionais do studio.
 */
export function ProjetosPage() {
  usePageTitle('Projetos')

  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [statusFilter, setStatusFilter] = useState<'TODOS' | StatusProjeto>(
    'TODOS',
  )
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null)
  const [formData, setFormData] = useState<ProjetoRequest>(initialForm)
  const [statusDrafts, setStatusDrafts] = useState<Record<number, StatusProjeto>>(
    {},
  )

  useEffect(() => {
    void loadProjetos(statusFilter)
  }, [statusFilter])

  async function loadProjetos(filter: 'TODOS' | StatusProjeto) {
    try {
      setLoading(true)
      setError(null)

      const response = await projetoService.list({
        status: filter === 'TODOS' ? undefined : filter,
      })

      setProjetos(response)
      setStatusDrafts(
        Object.fromEntries(
          response.map((projeto) => [projeto.id, projeto.status as StatusProjeto]),
        ),
      )
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingProjeto(null)
    setFormData(initialForm)
  }

  function startCreate() {
    setFeedback(null)
    resetForm()
  }

  function startEdit(projeto: Projeto) {
    setFeedback(null)
    setEditingProjeto(projeto)
    setFormData({
      nome: projeto.nome,
      descricao: projeto.descricao ?? '',
      status: projeto.status as StatusProjeto,
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setFeedback(null)

      const payload: ProjetoRequest = {
        nome: formData.nome.trim(),
        descricao: formData.descricao?.trim() || undefined,
        status: formData.status,
      }

      if (editingProjeto) {
        await projetoService.update(editingProjeto.id, payload)
        setFeedback({
          tone: 'success',
          message: 'Projeto atualizado com sucesso.',
        })
      } else {
        await projetoService.create(payload)
        setFeedback({
          tone: 'success',
          message: 'Projeto criado com sucesso.',
        })
      }

      resetForm()
      await loadProjetos(statusFilter)
    } catch (submitError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(submitError),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusUpdate(projetoId: number) {
    try {
      const nextStatus = statusDrafts[projetoId]

      if (!nextStatus) {
        return
      }

      await projetoService.updateStatus(projetoId, nextStatus)
      setFeedback({
        tone: 'success',
        message: 'Status do projeto atualizado com sucesso.',
      })
      await loadProjetos(statusFilter)
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
        eyebrow="Frentes operacionais"
        title="Projetos"
        description="Modulo conectado ao backend para organizar frentes que sustentam a operacao do studio."
        action={`${projetos.length} projeto(s) visiveis`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.95fr]">
        <AppCard className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-brand-ink">
                Frentes do studio
              </h3>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Crie, acompanhe e ajuste o status dos projetos.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as 'TODOS' | StatusProjeto)
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

              <button
                type="button"
                onClick={startCreate}
                className="sf-button-primary whitespace-nowrap"
              >
                Novo projeto
              </button>
            </div>
          </div>

          {loading ? <LoadingState label="Carregando projetos..." /> : null}

          {!loading && error ? (
            <ErrorState
              title="Falha ao carregar projetos"
              description={error}
              actionLabel="Tentar novamente"
              onRetry={() => void loadProjetos(statusFilter)}
            />
          ) : null}

          {!loading && !error && projetos.length === 0 ? (
            <EmptyState
              title="Nenhum projeto encontrado"
              description="Ainda nao ha projetos para o filtro selecionado."
              actionLabel="Criar projeto"
            />
          ) : null}

          {!loading && !error && projetos.length > 0 ? (
            <div className="space-y-3">
              {projetos.map((projeto) => (
                <article
                  key={projeto.id}
                  className="rounded-xl border border-brand-border bg-brand-mist/40 p-4"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-medium text-brand-ink">
                            {projeto.nome}
                          </h4>
                          <StatusBadge value={projeto.status} />
                        </div>
                        <div className="mt-2 space-y-1 text-sm leading-6 text-brand-graphite">
                          <p>
                            <strong className="text-brand-ink/60">Descricao:</strong>{' '}
                            {projeto.descricao || 'Sem descricao.'}
                          </p>
                          {projeto.updatedAt ? (
                            <p>
                              <strong className="text-brand-ink/60">Atualizado em:</strong>{' '}
                              {formatDate(projeto.updatedAt)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEdit(projeto)}
                        className="sf-button-secondary"
                      >
                        Editar
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl bg-brand-surface-raise/60 p-3 sm:flex-row sm:items-center">
                      <select
                        value={statusDrafts[projeto.id] ?? projeto.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [projeto.id]: event.target.value as StatusProjeto,
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
                        onClick={() => void handleStatusUpdate(projeto.id)}
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
                {editingProjeto ? 'Editar projeto' : 'Novo projeto'}
              </h3>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Configure nome, descricao e status.
              </p>
            </div>
            {editingProjeto ? (
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
                Nome
              </span>
              <input
                required
                value={formData.nome}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                placeholder="Ex.: Rotina semanal"
                className="sf-input"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Descricao
              </span>
              <textarea
                rows={5}
                value={formData.descricao ?? ''}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    descricao: event.target.value,
                  }))
                }
                placeholder="Explique o foco deste projeto."
                className="sf-textarea"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Status
              </span>
              <select
                value={formData.status}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    status: event.target.value as StatusProjeto,
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

            <button
              type="submit"
              disabled={submitting}
              className="sf-button-primary w-full"
            >
              {submitting
                ? 'Salvando...'
                : editingProjeto
                  ? 'Salvar alteracoes'
                  : 'Criar projeto'}
            </button>
          </form>
        </AppCard>
      </div>
    </section>
  )
}
