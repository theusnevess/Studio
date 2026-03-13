import type { Agendamento } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de agendamentos.
 */
export const agendamentoService = {
  list: () => httpClient.get<Agendamento[]>('/agendamentos'),
}
