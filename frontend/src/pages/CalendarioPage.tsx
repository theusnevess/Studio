import { useEffect, useMemo, useState } from 'react'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { usePageTitle } from '../hooks/usePageTitle'
import { agendamentoService } from '../services/agendamentoService'
import type { Agendamento } from '../types/domain'
import { addMonths, getMonthGrid, isSameDay, isToday } from '../utils/calendar'
import { getErrorMessage } from '../utils/errors'
import { formatDateTime, formatTime } from '../utils/formatters'

const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

/**
 * Calendario mensal simples e estavel, sem dependencia externa.
 */
export function CalendarioPage() {
  usePageTitle('Calendario')

  const [referenceDate, setReferenceDate] = useState(() => new Date())
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<Agendamento | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void loadAgendamentos()
  }, [])

  async function loadAgendamentos() {
    try {
      setLoading(true)
      setError(null)
      const response = await agendamentoService.list()
      setAgendamentos(response)
      setSelectedAgendamento(response[0] ?? null)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  const monthGrid = useMemo(() => getMonthGrid(referenceDate), [referenceDate])

  const monthlyEvents = useMemo(() => {
    return agendamentos.filter((item) => {
      const date = new Date(item.dataHoraInicio)
      return (
        date.getMonth() === referenceDate.getMonth() &&
        date.getFullYear() === referenceDate.getFullYear()
      )
    })
  }, [agendamentos, referenceDate])

  const selectedDayEvents = useMemo(() => {
    if (!selectedAgendamento) {
      return []
    }

    return agendamentos.filter((item) =>
      isSameDay(item.dataHoraInicio, selectedAgendamento.dataHoraInicio),
    )
  }, [agendamentos, selectedAgendamento])

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Agenda visual"
        title="Calendario"
        description="Visao mensal dos agendamentos reais do StudioFlow, com leitura clara por dia e detalhes rapidos."
        action={`${monthlyEvents.length} evento(s) neste mes`}
      />

      {loading ? <LoadingState label="Carregando calendario..." /> : null}

      {!loading && error ? (
        <ErrorState
          title="Falha ao carregar calendario"
          description={error}
          actionLabel="Tentar novamente"
          onRetry={() => void loadAgendamentos()}
        />
      ) : null}

      {!loading && !error && agendamentos.length === 0 ? (
        <AppCard>
          <EmptyState
            title="Nenhum agendamento cadastrado"
            description="Cadastre atendimentos no modulo de agendamentos para visualizar a agenda."
            actionLabel="Agenda aguardando dados"
          />
        </AppCard>
      ) : null}

      {!loading && !error && agendamentos.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.95fr]">
          <AppCard className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold capitalize text-brand-ink">
                  {referenceDate.toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
                <p className="mt-1 text-sm leading-6 text-brand-graphite">
                  Selecione um atendimento para ver detalhes.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReferenceDate((current) => addMonths(current, -1))}
                  className="sf-button-secondary"
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setReferenceDate((current) => addMonths(current, 1))}
                  className="sf-button-secondary"
                >
                  Proximo →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekdayLabels.map((label) => (
                <div
                  key={label}
                  className="rounded-lg bg-brand-mist/60 px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-rose/70"
                >
                  {label}
                </div>
              ))}

              {monthGrid.map((day) => {
                const dayEvents = monthlyEvents.filter((event) =>
                  isSameDay(event.dataHoraInicio, day.date),
                )

                return (
                  <div
                    key={day.date.toISOString()}
                    className={[
                      'min-h-[120px] rounded-xl border p-2 transition',
                      day.inCurrentMonth
                        ? 'border-brand-border bg-brand-mist/30'
                        : 'border-transparent bg-brand-mist/10 text-brand-graphite/40',
                      isToday(day.date) ? 'ring-1 ring-brand-rose/30' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className={[
                        'text-xs font-medium',
                        isToday(day.date) ? 'text-brand-rose' : '',
                      ].join(' ')}>
                        {day.date.getDate()}
                      </span>
                      {dayEvents.length > 0 ? (
                        <span className="rounded-md bg-brand-rose/10 px-1.5 py-0.5 text-[9px] font-semibold text-brand-rose/80">
                          {dayEvents.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedAgendamento(event)}
                          className="block w-full rounded-lg border border-brand-border bg-brand-surface-raise/60 px-2 py-1.5 text-left transition hover:border-brand-rose/20 hover:bg-brand-surface-raise"
                        >
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-brand-rose/70">
                            {formatTime(event.dataHoraInicio)}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-xs font-medium text-brand-ink/80">
                            {event.titulo}
                          </p>
                        </button>
                      ))}

                      {dayEvents.length > 2 ? (
                        <div className="px-1 text-[10px] font-medium text-brand-graphite/60">
                          + {dayEvents.length - 2} mais
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </AppCard>

          <AppCard className="h-fit space-y-5 xl:sticky xl:top-8">
            <div>
              <h3 className="text-xl font-semibold text-brand-ink">
                Detalhes do atendimento
              </h3>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Painel lateral para consulta rapida.
              </p>
            </div>

            {selectedAgendamento ? (
              <>
                <div className="rounded-xl border border-brand-border bg-brand-mist/40 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-semibold text-brand-ink">
                      {selectedAgendamento.titulo}
                    </h4>
                    <StatusBadge value={selectedAgendamento.status} />
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm leading-6 text-brand-graphite">
                    <p><strong className="text-brand-ink/60">Cliente:</strong> {selectedAgendamento.clienteNome || `Cliente #${selectedAgendamento.clienteId}`}</p>
                    <p><strong className="text-brand-ink/60">Servico:</strong> {selectedAgendamento.servico}</p>
                    <p><strong className="text-brand-ink/60">Horario:</strong> {formatDateTime(selectedAgendamento.dataHoraInicio)} ate {formatTime(selectedAgendamento.dataHoraFim)}</p>
                    <p><strong className="text-brand-ink/60">Responsavel:</strong> {selectedAgendamento.responsavelNome || 'Nao atribuido'}</p>
                    <p><strong className="text-brand-ink/60">Projeto:</strong> {selectedAgendamento.projetoNome || 'Nao vinculado'}</p>
                    <p><strong className="text-brand-ink/60">Observacoes:</strong> {selectedAgendamento.observacoes || 'Sem observacoes.'}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-brand-border bg-brand-surface-raise/60 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-rose/70">
                    Eventos do mesmo dia
                  </p>
                  <div className="mt-3 space-y-2">
                    {selectedDayEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedAgendamento(event)}
                        className="flex w-full items-start justify-between rounded-xl border border-brand-border bg-brand-mist/40 px-3 py-2.5 text-left transition hover:border-brand-rose/20 hover:bg-brand-mist/60"
                      >
                        <span>
                          <span className="block text-sm font-medium text-brand-ink">
                            {event.titulo}
                          </span>
                          <span className="mt-0.5 block text-xs text-brand-graphite/70">
                            {event.clienteNome || 'Cliente'} • {formatTime(event.dataHoraInicio)}
                          </span>
                        </span>
                        <StatusBadge value={event.status} />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                title="Selecione um evento"
                description="Clique em um agendamento no calendario para ver detalhes."
                actionLabel="Detalhes do dia"
              />
            )}
          </AppCard>
        </div>
      ) : null}
    </section>
  )
}
