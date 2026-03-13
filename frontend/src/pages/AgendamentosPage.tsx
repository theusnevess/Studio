import { useEffect, useState, type FormEvent } from 'react'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FeedbackBanner } from '../components/FeedbackBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { usePageTitle } from '../hooks/usePageTitle'
import { agendamentoService } from '../services/agendamentoService'
import { clienteService } from '../services/clienteService'
import { projetoService } from '../services/projetoService'
import { usuarioService } from '../services/usuarioService'
import type {
  Agendamento,
  AgendamentoRequest,
  Cliente,
  Projeto,
  StatusAgendamento,
  Usuario,
} from '../types/domain'
import { getErrorMessage } from '../utils/errors'
import {
  formatDate,
  formatDateTime,
  toApiDateTime,
  toDateTimeLocalValue,
} from '../utils/formatters'

type AgendamentoFilterStatus = 'TODOS' | StatusAgendamento
type SelectValue = 'TODOS' | `${number}`

type AgendamentoFormState = {
  titulo: string
  servico: string
  observacoes: string
  dataHoraInicio: string
  dataHoraFim: string
  status: StatusAgendamento
  clienteId: string
  responsavelId: string
  projetoId: string
}

const statusOptions: { value: StatusAgendamento; label: string }[] = [
  { value: 'AGENDADO', label: 'Agendado' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'CONCLUIDO', label: 'Concluido' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

const initialForm: AgendamentoFormState = {
  titulo: '',
  servico: '',
  observacoes: '',
  dataHoraInicio: '',
  dataHoraFim: '',
  status: 'AGENDADO',
  clienteId: '',
  responsavelId: '',
  projetoId: '',
}

function parseOptionalId(value: string) {
  return value ? Number(value) : undefined
}

/**
 * Tela integrada de agendamentos, base para agenda e calendario.
 */
export function AgendamentosPage() {
  usePageTitle('Agendamentos')

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [statusFilter, setStatusFilter] =
    useState<AgendamentoFilterStatus>('TODOS')
  const [clienteFilter, setClienteFilter] = useState<SelectValue>('TODOS')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [editingAgendamento, setEditingAgendamento] =
    useState<Agendamento | null>(null)
  const [formData, setFormData] = useState<AgendamentoFormState>(initialForm)
  const [statusDrafts, setStatusDrafts] = useState<
    Record<number, StatusAgendamento>
  >({})

  useEffect(() => {
    void loadDependencies()
  }, [])

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await agendamentoService.list({
          status: statusFilter === 'TODOS' ? undefined : statusFilter,
          clienteId:
            clienteFilter === 'TODOS' ? undefined : Number(clienteFilter),
        })

        setAgendamentos(response)
        setStatusDrafts(
          Object.fromEntries(
            response.map((agendamento) => [agendamento.id, agendamento.status]),
          ),
        )
      } catch (loadError) {
        setError(getErrorMessage(loadError))
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [statusFilter, clienteFilter])

  async function loadDependencies() {
    try {
      const [clientesResponse, projetosResponse, usuariosResponse] =
        await Promise.all([
          clienteService.list({ ativo: true }),
          projetoService.list(),
          usuarioService.list(),
        ])

      setClientes(clientesResponse)
      setProjetos(projetosResponse)
      setUsuarios(usuariosResponse.filter((usuario) => usuario.ativo))
    } catch (dependencyError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(dependencyError),
      })
    }
  }

  async function loadAgendamentos(filters?: {
    start?: string
    end?: string
  }) {
    try {
      setLoading(true)
      setError(null)

      const response = await agendamentoService.list({
        status: statusFilter === 'TODOS' ? undefined : statusFilter,
        clienteId: clienteFilter === 'TODOS' ? undefined : Number(clienteFilter),
        dataInicio: filters?.start,
        dataFim: filters?.end,
      })

      setAgendamentos(response)
      setStatusDrafts(
        Object.fromEntries(
          response.map((agendamento) => [agendamento.id, agendamento.status]),
        ),
      )
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingAgendamento(null)
    setFormData(initialForm)
  }

  function startCreate() {
    setFeedback(null)
    resetForm()
  }

  function startEdit(agendamento: Agendamento) {
    setFeedback(null)
    setEditingAgendamento(agendamento)
    setFormData({
      titulo: agendamento.titulo,
      servico: agendamento.servico,
      observacoes: agendamento.observacoes ?? '',
      dataHoraInicio: toDateTimeLocalValue(agendamento.dataHoraInicio),
      dataHoraFim: toDateTimeLocalValue(agendamento.dataHoraFim),
      status: agendamento.status,
      clienteId: String(agendamento.clienteId),
      responsavelId: agendamento.responsavelId
        ? String(agendamento.responsavelId)
        : '',
      projetoId: agendamento.projetoId ? String(agendamento.projetoId) : '',
    })
  }

  async function handleRangeFilter() {
    if ((rangeStart && !rangeEnd) || (!rangeStart && rangeEnd)) {
      setFeedback({
        tone: 'error',
        message: 'Informe inicio e fim para aplicar o filtro por intervalo.',
      })
      return
    }

    await loadAgendamentos({
      start: toApiDateTime(rangeStart),
      end: toApiDateTime(rangeEnd),
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.clienteId) {
      setFeedback({
        tone: 'error',
        message: 'Selecione uma cliente para o agendamento.',
      })
      return
    }

    if (!formData.dataHoraInicio || !formData.dataHoraFim) {
      setFeedback({
        tone: 'error',
        message: 'Informe inicio e fim do agendamento.',
      })
      return
    }

    if (formData.dataHoraFim <= formData.dataHoraInicio) {
      setFeedback({
        tone: 'error',
        message: 'A data/hora de fim deve ser posterior ao inicio.',
      })
      return
    }

    try {
      setSubmitting(true)
      setFeedback(null)

      const payload: AgendamentoRequest = {
        titulo: formData.titulo.trim(),
        servico: formData.servico.trim(),
        observacoes: formData.observacoes.trim() || undefined,
        dataHoraInicio: toApiDateTime(formData.dataHoraInicio) ?? '',
        dataHoraFim: toApiDateTime(formData.dataHoraFim) ?? '',
        status: formData.status,
        clienteId: Number(formData.clienteId),
        responsavelId: parseOptionalId(formData.responsavelId),
        projetoId: parseOptionalId(formData.projetoId),
      }

      if (editingAgendamento) {
        await agendamentoService.update(editingAgendamento.id, payload)
        setFeedback({
          tone: 'success',
          message: 'Agendamento atualizado com sucesso.',
        })
      } else {
        await agendamentoService.create(payload)
        setFeedback({
          tone: 'success',
          message: 'Agendamento criado com sucesso.',
        })
      }

      resetForm()
      await loadAgendamentos({
        start: toApiDateTime(rangeStart),
        end: toApiDateTime(rangeEnd),
      })
    } catch (submitError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(submitError),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusUpdate(agendamentoId: number) {
    try {
      const nextStatus = statusDrafts[agendamentoId]

      if (!nextStatus) {
        return
      }

      await agendamentoService.updateStatus(agendamentoId, nextStatus)
      setFeedback({
        tone: 'success',
        message: 'Status do agendamento atualizado com sucesso.',
      })
      await loadAgendamentos({
        start: toApiDateTime(rangeStart),
        end: toApiDateTime(rangeEnd),
      })
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
        eyebrow="Agenda operacional"
        title="Agendamentos"
        description="Fluxo real de atendimentos com filtros por status, cliente e intervalo, formulario completo e atualizacao rapida de status para sustentar a agenda do studio."
        action={`${agendamentos.length} agendamento(s) visiveis`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <AppCard className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                  Lista de agendamentos
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                  Consulte atendimentos por cliente, status ou intervalo de datas.
                </p>
              </div>

              <button
                type="button"
                onClick={startCreate}
                className="rounded-[20px] bg-gradient-to-r from-brand-rose to-brand-berry px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-soft transition hover:opacity-95"
              >
                Novo agendamento
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-4">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as AgendamentoFilterStatus)
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
                value={clienteFilter}
                onChange={(event) =>
                  setClienteFilter(event.target.value as SelectValue)
                }
                className="rounded-[18px] border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              >
                <option value="TODOS">Todas as clientes</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={String(cliente.id)}>
                    {cliente.nome}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={rangeStart}
                onChange={(event) => setRangeStart(event.target.value)}
                className="rounded-[18px] border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />

              <input
                type="datetime-local"
                value={rangeEnd}
                onChange={(event) => setRangeEnd(event.target.value)}
                className="rounded-[18px] border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleRangeFilter()}
                className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
              >
                Aplicar intervalo
              </button>
              <button
                type="button"
                onClick={() => {
                  setRangeStart('')
                  setRangeEnd('')
                  void loadAgendamentos()
                }}
                className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
              >
                Limpar intervalo
              </button>
            </div>
          </div>

          {loading ? <LoadingState label="Carregando agendamentos..." /> : null}

          {!loading && error ? (
            <ErrorState
              title="Falha ao carregar agendamentos"
              description={error}
              actionLabel="Tentar novamente"
              onRetry={() =>
                void loadAgendamentos({
                  start: toApiDateTime(rangeStart),
                  end: toApiDateTime(rangeEnd),
                })
              }
            />
          ) : null}

          {!loading && !error && agendamentos.length === 0 ? (
            <EmptyState
              title="Nenhum agendamento encontrado"
              description="Ainda nao ha agendamentos para os filtros selecionados. Cadastre o primeiro atendimento para iniciar a agenda do studio."
              actionLabel="Criar agendamento"
            />
          ) : null}

          {!loading && !error && agendamentos.length > 0 ? (
            <div className="space-y-4">
              {agendamentos.map((agendamento) => (
                <article
                  key={agendamento.id}
                  className="rounded-[26px] border border-brand-border bg-white/85 p-5"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-brand-ink">
                            {agendamento.titulo}
                          </h4>
                          <StatusBadge value={agendamento.status} />
                        </div>
                        <div className="mt-3 space-y-2 text-sm leading-6 text-brand-graphite/[0.8]">
                          <p>
                            <strong>Servico:</strong> {agendamento.servico}
                          </p>
                          <p>
                            <strong>Cliente:</strong>{' '}
                            {agendamento.clienteNome ||
                              `Cliente #${agendamento.clienteId}`}
                          </p>
                          <p>
                            <strong>Responsavel:</strong>{' '}
                            {agendamento.responsavelNome || 'Nao atribuido'}
                          </p>
                          <p>
                            <strong>Projeto:</strong>{' '}
                            {agendamento.projetoNome || 'Nao vinculado'}
                          </p>
                          <p>
                            <strong>Inicio:</strong>{' '}
                            {formatDateTime(agendamento.dataHoraInicio)}
                          </p>
                          <p>
                            <strong>Fim:</strong>{' '}
                            {formatDateTime(agendamento.dataHoraFim)}
                          </p>
                          <p>
                            <strong>Observacoes:</strong>{' '}
                            {agendamento.observacoes ||
                              'Sem observacoes cadastradas.'}
                          </p>
                          {agendamento.updatedAt ? (
                            <p>
                              <strong>Atualizado em:</strong>{' '}
                              {formatDate(agendamento.updatedAt)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEdit(agendamento)}
                        className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
                      >
                        Editar
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 rounded-[22px] bg-brand-cream p-4 sm:flex-row sm:items-center">
                      <select
                        value={statusDrafts[agendamento.id] ?? agendamento.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [agendamento.id]:
                              event.target.value as StatusAgendamento,
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
                        onClick={() => void handleStatusUpdate(agendamento.id)}
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
                {editingAgendamento ? 'Editar agendamento' : 'Novo agendamento'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Configure cliente, horario, servico, responsavel e projeto quando necessario.
              </p>
            </div>
            {editingAgendamento ? (
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
                placeholder="Ex.: Manutencao da Ana"
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
                Servico
              </span>
              <input
                required
                value={formData.servico}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    servico: event.target.value,
                  }))
                }
                placeholder="Ex.: Alongamento em gel"
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
                Cliente
              </span>
              <select
                required
                value={formData.clienteId}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    clienteId: event.target.value,
                  }))
                }
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              >
                <option value="">Selecione uma cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={String(cliente.id)}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-graphite">
                  Inicio
                </span>
                <input
                  type="datetime-local"
                  required
                  value={formData.dataHoraInicio}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      dataHoraInicio: event.target.value,
                    }))
                  }
                  className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-graphite">
                  Fim
                </span>
                <input
                  type="datetime-local"
                  required
                  value={formData.dataHoraFim}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      dataHoraFim: event.target.value,
                    }))
                  }
                  className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-ink outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
                />
              </label>
            </div>

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
                      status: event.target.value as StatusAgendamento,
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
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
                Projeto
              </span>
              <select
                value={formData.projetoId}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    projetoId: event.target.value,
                  }))
                }
                className="w-full rounded-[20px] border border-brand-border bg-brand-cream px-4 py-3 text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              >
                <option value="">Sem projeto</option>
                {projetos.map((projeto) => (
                  <option key={projeto.id} value={String(projeto.id)}>
                    {projeto.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-graphite">
                Observacoes
              </span>
              <textarea
                rows={4}
                value={formData.observacoes}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    observacoes: event.target.value,
                  }))
                }
                placeholder="Detalhes importantes do atendimento."
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
                : editingAgendamento
                  ? 'Salvar alteracoes'
                  : 'Criar agendamento'}
            </button>
          </form>
        </AppCard>
      </div>
    </section>
  )
}
