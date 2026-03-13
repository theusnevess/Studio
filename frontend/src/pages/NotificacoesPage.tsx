import { useEffect, useState } from 'react'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FeedbackBanner } from '../components/FeedbackBanner'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { usePageTitle } from '../hooks/usePageTitle'
import { notificacaoService } from '../services/notificacaoService'
import { usuarioService } from '../services/usuarioService'
import type { Notificacao, Usuario } from '../types/domain'
import { getErrorMessage } from '../utils/errors'
import { formatDateTime } from '../utils/formatters'

type VisualizacaoFilter = 'TODAS' | 'NAO_VISUALIZADA' | 'VISUALIZADA'
type UsuarioFilter = 'TODOS' | `${number}`

/**
 * Tela funcional de notificacoes usando dados reais do backend.
 */
export function NotificacoesPage() {
  usePageTitle('Notificacoes')

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [selectedNotification, setSelectedNotification] =
    useState<Notificacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [markingId, setMarkingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)
  const [visualizacaoFilter, setVisualizacaoFilter] =
    useState<VisualizacaoFilter>('TODAS')
  const [usuarioFilter, setUsuarioFilter] = useState<UsuarioFilter>('TODOS')

  useEffect(() => {
    void loadUsuarios()
  }, [])

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await notificacaoService.list({
          usuarioId: usuarioFilter === 'TODOS' ? undefined : Number(usuarioFilter),
          visualizada:
            visualizacaoFilter === 'TODAS'
              ? undefined
              : visualizacaoFilter === 'VISUALIZADA',
        })

        setNotificacoes(response)
        setSelectedNotification((current) => {
          if (!response.length) {
            return null
          }

          if (current) {
            return response.find((item) => item.id === current.id) ?? response[0]
          }

          return response[0]
        })
      } catch (loadError) {
        setError(getErrorMessage(loadError))
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [visualizacaoFilter, usuarioFilter])

  async function loadUsuarios() {
    try {
      const response = await usuarioService.list()
      setUsuarios(response.filter((usuario) => usuario.ativo))
    } catch (loadError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(loadError),
      })
    }
  }

  async function loadNotificacoes() {
    try {
      setLoading(true)
      setError(null)

      const response = await notificacaoService.list({
        usuarioId: usuarioFilter === 'TODOS' ? undefined : Number(usuarioFilter),
        visualizada:
          visualizacaoFilter === 'TODAS'
            ? undefined
            : visualizacaoFilter === 'VISUALIZADA',
      })

      setNotificacoes(response)
      setSelectedNotification((current) => {
        if (!response.length) {
          return null
        }

        if (current) {
          return response.find((item) => item.id === current.id) ?? response[0]
        }

        return response[0]
      })
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsViewed(notification: Notificacao) {
    if (notification.visualizada) {
      return
    }

    try {
      setMarkingId(notification.id)
      setFeedback(null)
      await notificacaoService.markAsViewed(notification.id)
      setFeedback({
        tone: 'success',
        message: 'Notificacao marcada como visualizada.',
      })
      await loadNotificacoes()
    } catch (markError) {
      setFeedback({
        tone: 'error',
        message: getErrorMessage(markError),
      })
    } finally {
      setMarkingId(null)
    }
  }

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Avisos internos"
        title="Notificacoes"
        description="Modulo real de notificacoes internas para acompanhar lembretes de atendimento, avisos operacionais e informacoes importantes do studio."
        action={`${notificacoes.length} notificacao(oes) visiveis`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <AppCard className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-brand-ink">
                Caixa de notificacoes
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
                Filtre por visualizacao ou por usuario responsavel para consultar os avisos do sistema.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={visualizacaoFilter}
                onChange={(event) =>
                  setVisualizacaoFilter(
                    event.target.value as VisualizacaoFilter,
                  )
                }
                className="rounded-[18px] border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              >
                <option value="TODAS">Todas</option>
                <option value="NAO_VISUALIZADA">Nao visualizadas</option>
                <option value="VISUALIZADA">Visualizadas</option>
              </select>

              <select
                value={usuarioFilter}
                onChange={(event) =>
                  setUsuarioFilter(event.target.value as UsuarioFilter)
                }
                className="rounded-[18px] border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-graphite outline-none transition focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10"
              >
                <option value="TODOS">Todos os usuarios</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={String(usuario.id)}>
                    {usuario.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? <LoadingState label="Carregando notificacoes..." /> : null}

          {!loading && error ? (
            <ErrorState
              title="Falha ao carregar notificacoes"
              description={error}
              actionLabel="Tentar novamente"
              onRetry={() => void loadNotificacoes()}
            />
          ) : null}

          {!loading && !error && notificacoes.length === 0 ? (
            <EmptyState
              title="Nenhuma notificacao encontrada"
              description="Ainda nao ha notificacoes para os filtros selecionados. Quando novos lembretes forem gerados, eles aparecerao aqui."
              actionLabel="Caixa vazia"
            />
          ) : null}

          {!loading && !error && notificacoes.length > 0 ? (
            <div className="space-y-4">
              {notificacoes.map((notificacao) => (
                <article
                  key={notificacao.id}
                  className={[
                    'rounded-[26px] border p-5 transition',
                    selectedNotification?.id === notificacao.id
                      ? 'border-brand-rose/40 bg-brand-mist/70'
                      : 'border-brand-border bg-white/88',
                  ].join(' ')}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedNotification(notificacao)}
                      className="flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-semibold text-brand-ink">
                          {notificacao.titulo}
                        </h4>
                        <StatusBadge value={notificacao.tipo} />
                        <StatusBadge
                          value={
                            notificacao.visualizada
                              ? 'VISUALIZADA'
                              : 'NAO_VISUALIZADA'
                          }
                        />
                      </div>

                      <p className="mt-3 text-sm leading-6 text-brand-graphite/[0.8]">
                        {notificacao.mensagem}
                      </p>

                      <div className="mt-3 space-y-1 text-xs leading-5 text-brand-graphite/[0.72]">
                        <p>
                          Envio: {formatDateTime(notificacao.dataHoraEnvio)}
                        </p>
                        <p>
                          Usuario:{' '}
                          {notificacao.usuarioNome ||
                            `Usuario #${notificacao.usuarioId}`}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      disabled={notificacao.visualizada || markingId === notificacao.id}
                      onClick={() => void handleMarkAsViewed(notificacao)}
                      className="rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-graphite transition hover:border-brand-rose/40 hover:bg-brand-mist disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {markingId === notificacao.id
                        ? 'Salvando...'
                        : notificacao.visualizada
                          ? 'Visualizada'
                          : 'Marcar como visualizada'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </AppCard>

        <AppCard className="h-fit space-y-5 xl:sticky xl:top-8">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-brand-ink">
              Detalhes da notificacao
            </h3>
            <p className="mt-2 text-sm leading-6 text-brand-graphite/[0.78]">
              Painel lateral para leitura completa e contexto do alerta selecionado.
            </p>
          </div>

          {selectedNotification ? (
            <>
              <div className="rounded-[24px] border border-brand-border bg-white/88 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xl font-semibold text-brand-ink">
                    {selectedNotification.titulo}
                  </h4>
                  <StatusBadge value={selectedNotification.tipo} />
                  <StatusBadge
                    value={
                      selectedNotification.visualizada
                        ? 'VISUALIZADA'
                        : 'NAO_VISUALIZADA'
                    }
                  />
                </div>

                <div className="mt-4 space-y-3 text-sm leading-6 text-brand-graphite/[0.82]">
                  <p>{selectedNotification.mensagem}</p>
                  <p>
                    <strong>Usuario:</strong>{' '}
                    {selectedNotification.usuarioNome ||
                      `Usuario #${selectedNotification.usuarioId}`}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {selectedNotification.tipo}
                  </p>
                  <p>
                    <strong>Enviada em:</strong>{' '}
                    {formatDateTime(selectedNotification.dataHoraEnvio)}
                  </p>
                  <p>
                    <strong>Agendamento:</strong>{' '}
                    {selectedNotification.agendamentoTitulo || 'Nao vinculado'}
                  </p>
                </div>
              </div>

              {!selectedNotification.visualizada ? (
                <button
                  type="button"
                  disabled={markingId === selectedNotification.id}
                  onClick={() => void handleMarkAsViewed(selectedNotification)}
                  className="w-full rounded-[22px] bg-gradient-to-r from-brand-rose to-brand-berry px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {markingId === selectedNotification.id
                    ? 'Salvando...'
                    : 'Marcar como visualizada'}
                </button>
              ) : (
                <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-center text-sm font-medium text-emerald-700">
                  Esta notificacao ja foi visualizada.
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Selecione uma notificacao"
              description="Clique em uma notificacao da lista para visualizar os detalhes completos no painel lateral."
              actionLabel="Detalhes"
            />
          )}
        </AppCard>
      </div>
    </section>
  )
}
