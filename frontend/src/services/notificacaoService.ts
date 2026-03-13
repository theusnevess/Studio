import type { Notificacao } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de notificacoes.
 */
export const notificacaoService = {
  list: () => httpClient.get<Notificacao[]>('/notificacoes'),
}
