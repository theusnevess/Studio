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
        description="Modulo conectado ao backend para organizar rotina semanal, agenda do mes e outras frentes que sustentam a apresentacao academica do sistema."
        action={`${projetos.length} projeto(s) visiveis`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <AppCard className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                Frentes do studio
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Crie, acompanhe e ajuste o status dos projetos que organizam a operacao.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as 'TODOS' | StatusProjeto)
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

              <button
                type="button"
                onClick={startCreate}
                className="rounded-[20px] bg-gradient-to-r from-brand-rose to-brand-berry px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-soft transition hover:opacity-95"
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
              description="Ainda nao ha projetos para o filtro selecionado. Crie a primeira frente operacional do studio."
              actionLabel="Criar projeto"
            />
          ) : null}

          {!loading && !error && projetos.length > 0 ? (
            <div className="space-y-4">
              {projetos.map((projeto) => (
                <article
                  key={projeto.id}
                  className="rounded-[26px] border border-brand-border bg-white/85 p-5"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-brand-ink">
                            {projeto.nome}
                          </h4>
                          <StatusBadge value={projeto.status} />
                        </div>
                        <div className="mt-3 space-y-2 text-sm leading-6 text-brand-graphite/[0.8]">
                          <p>
                            <strong>Descricao:</strong>{' '}
                            {projeto.descricao || 'Sem descricao cadastrada.'}
                          </p>
                          {projeto.updatedAt ? (
                            <p>
                              <strong>Atualizado em:</strong>{' '}
                              {formatDate(projeto.updatedAt)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEdit(projeto)}
                        className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
                      >
                        Editar
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 rounded-[22px] bg-brand-cream p-4 sm:flex-row sm:items-center">
                      <select
                        value={statusDrafts[projeto.id] ?? projeto.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [projeto.id]: event.target.value as StatusProjeto,
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
                        onClick={() => void handleStatusUpdate(projeto.id)}
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
                {editingProjeto ? 'Editar projeto' : 'Novo projeto'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Configure nome, descricao e status da frente operacional.
              </p>
            </div>
            {editingProjeto ? (
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
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                placeholder="Explique o foco operacional deste projeto."
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
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
              className="w-full rounded-[22px] bg-gradient-to-r from-brand-rose to-brand-berry px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
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
