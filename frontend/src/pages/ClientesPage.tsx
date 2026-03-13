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

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <AppCard className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                Lista de clientes
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Consulte o cadastro ativo do studio e mantenha a base organizada.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as ClienteFilter)
                }
                className="rounded-[18px] border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              >
                <option value="ativos">Somente ativos</option>
                <option value="todos">Todos</option>
                <option value="inativos">Somente inativos</option>
              </select>

              <button
                type="button"
                onClick={startCreate}
                className="rounded-[20px] bg-gradient-to-r from-brand-rose to-brand-berry px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-soft transition hover:opacity-95"
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
              description="Ainda nao ha clientes para o filtro selecionado. Crie o primeiro cadastro para iniciar a base do studio."
              actionLabel="Cadastre a primeira"
            />
          ) : null}

          {!loading && !error && clientes.length > 0 ? (
            <div className="space-y-4">
              {clientes.map((cliente) => (
                <article
                  key={cliente.id}
                  className="rounded-[26px] border border-brand-border bg-white/85 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold text-brand-ink">
                          {cliente.nome}
                        </h4>
                        <StatusBadge value={cliente.ativo ? 'ATIVO' : 'INATIVO'} />
                      </div>

                      <div className="mt-3 space-y-2 text-sm leading-6 text-brand-graphite/[0.8]">
                        <p>
                          <strong>Telefone:</strong>{' '}
                          {cliente.telefone || 'Nao informado'}
                        </p>
                        <p>
                          <strong>Observacoes:</strong>{' '}
                          {cliente.observacoes || 'Sem observacoes cadastradas.'}
                        </p>
                        {cliente.updatedAt ? (
                          <p>
                            <strong>Atualizada em:</strong>{' '}
                            {formatDate(cliente.updatedAt)}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(cliente)}
                        className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={!cliente.ativo}
                        onClick={() => void handleInativar(cliente)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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

        <AppCard className="h-fit space-y-6 xl:sticky xl:top-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                {editingCliente ? 'Editar cliente' : 'Nova cliente'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Preencha os dados essenciais para manter a base do studio consistente.
              </p>
            </div>
            {editingCliente ? (
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
                placeholder="Nome da cliente"
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
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
                placeholder="Anote preferencias, observacoes ou detalhes relevantes."
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
