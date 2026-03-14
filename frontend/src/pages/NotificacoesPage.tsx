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
        description="Modulo real de notificacoes internas para acompanhar lembretes, avisos operacionais e informacoes do studio."
        action={`${notificacoes.length} notificacao(oes) visiveis`}
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
        <AppCard className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-brand-ink">
                Caixa de notificacoes
              </h3>
              <p className="mt-1 text-sm leading-6 text-brand-graphite">
                Filtre por visualizacao ou por usuario.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={visualizacaoFilter}
                onChange={(event) =>
                  setVisualizacaoFilter(
                    event.target.value as VisualizacaoFilter,
                  )
                }
                className="sf-select"
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
                className="sf-select"
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
              description="Ainda nao ha notificacoes para os filtros selecionados."
              actionLabel="Caixa vazia"
            />
          ) : null}

          {!loading && !error && notificacoes.length > 0 ? (
            <div className="space-y-3">
              {notificacoes.map((notificacao) => (
                <article
                  key={notificacao.id}
                  className={[
                    'rounded-xl border p-4 transition',
                    selectedNotification?.id === notificacao.id
                      ? 'border-brand-rose/20 bg-brand-rose/[0.04]'
                      : 'border-brand-border bg-brand-mist/40',
                  ].join(' ')}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedNotification(notificacao)}
                      className="flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-medium text-brand-ink">
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

                      <p className="mt-2 text-sm leading-6 text-brand-graphite">
                        {notificacao.mensagem}
                      </p>

                      <div className="mt-2 space-y-0.5 text-xs leading-5 text-brand-graphite/60">
                        <p>Envio: {formatDateTime(notificacao.dataHoraEnvio)}</p>
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
                      className="sf-button-secondary disabled:cursor-not-allowed disabled:opacity-40"
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
            <h3 className="text-xl font-semibold text-brand-ink">
              Detalhes da notificacao
            </h3>
            <p className="mt-1 text-sm leading-6 text-brand-graphite">
              Painel lateral para leitura completa do alerta.
            </p>
          </div>

          {selectedNotification ? (
            <>
              <div className="rounded-xl border border-brand-border bg-brand-mist/40 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-semibold text-brand-ink">
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

                <div className="mt-3 space-y-2 text-sm leading-6 text-brand-graphite">
                  <p>{selectedNotification.mensagem}</p>
                  <p><strong className="text-brand-ink/60">Usuario:</strong> {selectedNotification.usuarioNome || `Usuario #${selectedNotification.usuarioId}`}</p>
                  <p><strong className="text-brand-ink/60">Tipo:</strong> {selectedNotification.tipo}</p>
                  <p><strong className="text-brand-ink/60">Enviada em:</strong> {formatDateTime(selectedNotification.dataHoraEnvio)}</p>
                  <p><strong className="text-brand-ink/60">Agendamento:</strong> {selectedNotification.agendamentoTitulo || 'Nao vinculado'}</p>
                </div>
              </div>

              {!selectedNotification.visualizada ? (
                <button
                  type="button"
                  disabled={markingId === selectedNotification.id}
                  onClick={() => void handleMarkAsViewed(selectedNotification)}
                  className="sf-button-primary w-full"
                >
                  {markingId === selectedNotification.id
                    ? 'Salvando...'
                    : 'Marcar como visualizada'}
                </button>
              ) : (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-400">
                  Esta notificacao ja foi visualizada.
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Selecione uma notificacao"
              description="Clique em uma notificacao da lista para ver detalhes."
              actionLabel="Detalhes"
            />
          )}
        </AppCard>
      </div>
    </section>
  )
}
