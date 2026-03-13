import type { Notificacao } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de notificacoes.
 */
export const notificacaoService = {
  list: (filters?: { usuarioId?: number; visualizada?: boolean }) => {
    const params = new URLSearchParams()

    if (filters?.usuarioId) {
      params.set('usuarioId', String(filters.usuarioId))
    }

    if (typeof filters?.visualizada === 'boolean') {
      params.set('visualizada', String(filters.visualizada))
    }

    const query = params.toString()
    return httpClient.get<Notificacao[]>(
      `/notificacoes${query ? `?${query}` : ''}`,
    )
  },
  markAsViewed: (id: number) =>
    httpClient.patch<Notificacao>(`/notificacoes/${id}/visualizar`),
}
