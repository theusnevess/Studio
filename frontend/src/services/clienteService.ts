import type { Cliente } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de clientes.
 */
export const clienteService = {
  list: () => httpClient.get<Cliente[]>('/clientes'),
}
