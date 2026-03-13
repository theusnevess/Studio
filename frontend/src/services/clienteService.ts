import type { Cliente, ClienteRequest } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de clientes.
 */
export const clienteService = {
  list: (filters?: { ativo?: boolean }) => {
    const params = new URLSearchParams()

    if (typeof filters?.ativo === 'boolean') {
      params.set('ativo', String(filters.ativo))
    }

    const query = params.toString()
    return httpClient.get<Cliente[]>(`/clientes${query ? `?${query}` : ''}`)
  },
  create: (payload: ClienteRequest) =>
    httpClient.post<Cliente>('/clientes', payload),
  update: (id: number, payload: ClienteRequest) =>
    httpClient.put<Cliente>(`/clientes/${id}`, payload),
  inactivate: (id: number) =>
    httpClient.patch<Cliente>(`/clientes/${id}/inativar`),
}
