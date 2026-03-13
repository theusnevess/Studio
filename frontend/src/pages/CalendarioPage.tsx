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
        description="Visao mensal funcional dos agendamentos reais do StudioFlow, com leitura clara por dia e detalhes rapidos de cada atendimento."
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
            description="Cadastre atendimentos no modulo de agendamentos para visualizar a agenda do studio em formato de calendario."
            actionLabel="Agenda aguardando dados"
          />
        </AppCard>
      ) : null}

      {!loading && !error && agendamentos.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <AppCard className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                  {referenceDate.toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                  Selecione um atendimento no calendario para ver os detalhes do dia.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReferenceDate((current) => addMonths(current, -1))}
                  className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
                >
                  Mes anterior
                </button>
                <button
                  type="button"
                  onClick={() => setReferenceDate((current) => addMonths(current, 1))}
                  className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist"
                >
                  Proximo mes
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {weekdayLabels.map((label) => (
                <div
                  key={label}
                  className="rounded-[18px] bg-brand-mist px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-berry"
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
                      'min-h-[148px] rounded-[22px] border p-3 transition',
                      day.inCurrentMonth
                        ? 'border-brand-border bg-white/90'
                        : 'border-brand-border/60 bg-brand-cream/60 text-brand-graphite/50',
                      isToday(day.date) ? 'ring-2 ring-brand-rose/25' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {day.date.getDate()}
                      </span>
                      {dayEvents.length > 0 ? (
                        <span className="rounded-full bg-brand-mist px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-berry">
                          {dayEvents.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 space-y-2">
                      {dayEvents.slice(0, 3).map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedAgendamento(event)}
                          className="block w-full rounded-[16px] border border-brand-border bg-brand-cream px-3 py-2 text-left transition hover:border-brand-rose/40 hover:bg-brand-mist"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-berry">
                            {formatTime(event.dataHoraInicio)}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm font-medium text-brand-ink">
                            {event.titulo}
                          </p>
                        </button>
                      ))}

                      {dayEvents.length > 3 ? (
                        <div className="px-1 text-xs font-medium text-brand-graphite/[0.72]">
                          + {dayEvents.length - 3} agendamento(s)
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
              <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                Detalhes do atendimento
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Painel lateral simples para consultar os eventos selecionados.
              </p>
            </div>

            {selectedAgendamento ? (
              <>
                <div className="rounded-[24px] border border-brand-border bg-white/88 p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-xl font-semibold text-brand-ink">
                      {selectedAgendamento.titulo}
                    </h4>
                    <StatusBadge value={selectedAgendamento.status} />
                  </div>

                  <div className="mt-4 space-y-2 text-sm leading-6 text-brand-graphite/[0.82]">
                    <p>
                      <strong>Cliente:</strong>{' '}
                      {selectedAgendamento.clienteNome ||
                        `Cliente #${selectedAgendamento.clienteId}`}
                    </p>
                    <p>
                      <strong>Servico:</strong> {selectedAgendamento.servico}
                    </p>
                    <p>
                      <strong>Horario:</strong>{' '}
                      {formatDateTime(selectedAgendamento.dataHoraInicio)} ate{' '}
                      {formatTime(selectedAgendamento.dataHoraFim)}
                    </p>
                    <p>
                      <strong>Responsavel:</strong>{' '}
                      {selectedAgendamento.responsavelNome || 'Nao atribuido'}
                    </p>
                    <p>
                      <strong>Projeto:</strong>{' '}
                      {selectedAgendamento.projetoNome || 'Nao vinculado'}
                    </p>
                    <p>
                      <strong>Observacoes:</strong>{' '}
                      {selectedAgendamento.observacoes ||
                        'Sem observacoes cadastradas.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-brand-border bg-brand-cream/85 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-berry">
                    Eventos do mesmo dia
                  </p>
                  <div className="mt-4 space-y-3">
                    {selectedDayEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedAgendamento(event)}
                        className="flex w-full items-start justify-between rounded-[18px] border border-brand-border bg-white px-4 py-3 text-left transition hover:border-brand-rose/40 hover:bg-brand-mist"
                      >
                        <span>
                          <span className="block text-sm font-semibold text-brand-ink">
                            {event.titulo}
                          </span>
                          <span className="mt-1 block text-xs text-brand-graphite/[0.76]">
                            {event.clienteNome || 'Cliente'} •{' '}
                            {formatTime(event.dataHoraInicio)}
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
                description="Clique em um agendamento no calendario para visualizar os detalhes do atendimento."
                actionLabel="Detalhes do dia"
              />
            )}
          </AppCard>
        </div>
      ) : null}
    </section>
  )
}
