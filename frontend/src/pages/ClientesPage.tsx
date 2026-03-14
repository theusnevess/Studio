import { useEffect, useState, type FormEvent } from 'react'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FeedbackBanner } from '../components/FeedbackBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { usePageTitle } from '../hooks/usePageTitle'
import { clienteService } from '../services/clienteService'
import type { Cliente, ClienteRequest } from '../types/domain'
import { getErrorMessage } from '../utils/errors'
import { formatDate } from '../utils/formatters'

type ClienteFilter = 'todos' | 'ativos' | 'inativos'

const initialForm: ClienteRequest = {
  nome: '',
  telefone: '',
  observacoes: '',
}

/**
 * Tela integrada de clientes com listagem real, formulario e inativacao.
 */
export function ClientesPage() {
  usePageTitle('Clientes')

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [filter, setFilter] = useState<ClienteFilter>('ativos')
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState<ClienteRequest>(initialForm)

  useEffect(() => {
    void loadClientes(filter)
  }, [filter])

  async function loadClientes(nextFilter: ClienteFilter) {
    try {
      setLoading(true)
      setError(null)

      const ativo =
        nextFilter === 'todos'
          ? undefined
          : nextFilter === 'ativos'
            ? true
            : false

      const response = await clienteService.list({ ativo })
      setClientes(response)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingCliente(null)
    setFormData(initialForm)
  }

  function startCreate() {
    setFeedback(null)
    resetForm()
  }

  function startEdit(cliente: Cliente) {
    setFeedback(null)
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone ?? '',
      observacoes: cliente.observacoes ?? '',
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setFeedback(null)

      const payload: ClienteRequest = {
        nome: formData.nome.trim(),
        telefone: formData.telefone?.trim() || undefined,
        observacoes: formData.observacoes?.trim() || undefined,
      }

      if (editingCliente) {
        await clienteService.update(editingCliente.id, payload)
        setFeedback({
          tone: 'success',
          message: 'Cliente atualizada com sucesso.',
        })
      } else {
        await clienteService.create(payload)
        setFeedback({
          tone: 'success',
          message: 'Cliente criada com sucesso.',
        })
      }

      resetForm()
      await loadClientes(filter)
    } catch (submitError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(submitError),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleInativar(cliente: Cliente) {
    try {
      setFeedback(null)
      await clienteService.inactivate(cliente.id)
      setFeedback({
        tone: 'success',
        message: `${cliente.nome} foi inativada com sucesso.`,
      })
      if (editingCliente?.id === cliente.id) {
        resetForm()
      }
      await loadClientes(filter)
    } catch (inactivateError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(inactivateError),
      })
    }
  }

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Cadastro e relacionamento"
        title="Clientes"
        description="Listagem real conectada ao backend para acompanhar a base de clientes, criar novos cadastros, editar dados e inativar quando necessario."
        action={`${clientes.length} registro(s) visiveis`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.95fr]">
        <AppCard className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-brand-ink">
                Lista de clientes
              </h3>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Consulte o cadastro ativo do studio.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as ClienteFilter)
                }
                className="sf-select"
              >
                <option value="ativos">Somente ativos</option>
                <option value="todos">Todos</option>
                <option value="inativos">Somente inativos</option>
              </select>

              <button
                type="button"
                onClick={startCreate}
                className="sf-button-primary whitespace-nowrap"
              >
                Nova cliente
              </button>
            </div>
          </div>

          {loading ? <LoadingState label="Carregando clientes..." /> : null}

          {!loading && error ? (
            <ErrorState
              title="Falha ao carregar clientes"
              description={error}
              actionLabel="Tentar novamente"
              onRetry={() => void loadClientes(filter)}
            />
          ) : null}

          {!loading && !error && clientes.length === 0 ? (
            <EmptyState
              title="Nenhuma cliente encontrada"
              description="Ainda nao ha clientes para o filtro selecionado."
              actionLabel="Cadastre a primeira"
            />
          ) : null}

          {!loading && !error && clientes.length > 0 ? (
            <div className="space-y-3">
              {clientes.map((cliente) => (
                <article
                  key={cliente.id}
                  className="rounded-xl border border-brand-border bg-brand-mist/40 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-medium text-brand-ink">
                          {cliente.nome}
                        </h4>
                        <StatusBadge value={cliente.ativo ? 'ATIVO' : 'INATIVO'} />
                      </div>

                      <div className="mt-2 space-y-1 text-sm leading-6 text-brand-graphite">
                        <p>
                          <strong className="text-brand-ink/60">Telefone:</strong>{' '}
                          {cliente.telefone || 'Nao informado'}
                        </p>
                        <p>
                          <strong className="text-brand-ink/60">Observacoes:</strong>{' '}
                          {cliente.observacoes || 'Sem observacoes.'}
                        </p>
                        {cliente.updatedAt ? (
                          <p>
                            <strong className="text-brand-ink/60">Atualizada em:</strong>{' '}
                            {formatDate(cliente.updatedAt)}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(cliente)}
                        className="sf-button-secondary"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={!cliente.ativo}
                        onClick={() => void handleInativar(cliente)}
                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Inativar
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
                {editingCliente ? 'Editar cliente' : 'Nova cliente'}
              </h3>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Preencha os dados para manter a base consistente.
              </p>
            </div>
            {editingCliente ? (
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
                placeholder="Nome da cliente"
                className="sf-input"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Telefone
              </span>
              <input
                value={formData.telefone ?? ''}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    telefone: event.target.value,
                  }))
                }
                placeholder="(11) 99999-9999"
                className="sf-input"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-brand-graphite">
                Observacoes
              </span>
              <textarea
                rows={5}
                value={formData.observacoes ?? ''}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    observacoes: event.target.value,
                  }))
                }
                placeholder="Anote preferencias ou detalhes relevantes."
                className="sf-textarea"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="sf-button-primary w-full"
            >
              {submitting
                ? 'Salvando...'
                : editingCliente
                  ? 'Salvar alteracoes'
                  : 'Criar cliente'}
            </button>
          </form>
        </AppCard>
      </div>
    </section>
  )
}
