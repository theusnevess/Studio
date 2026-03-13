import type {
  Agendamento,
  AgendamentoRequest,
  StatusAgendamento,
} from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de agendamentos.
 */
export const agendamentoService = {
  list: (filters?: {
    status?: StatusAgendamento
    clienteId?: number
    dataInicio?: string
    dataFim?: string
  }) => {
    const params = new URLSearchParams()

    if (filters?.status) {
      params.set('status', filters.status)
    }

    if (filters?.clienteId) {
      params.set('clienteId', String(filters.clienteId))
    }

    if (filters?.dataInicio && filters?.dataFim) {
      params.set('dataInicio', filters.dataInicio)
      params.set('dataFim', filters.dataFim)
    }

    const query = params.toString()
    return httpClient.get<Agendamento[]>(
      `/agendamentos${query ? `?${query}` : ''}`,
    )
  },
  create: (payload: AgendamentoRequest) =>
    httpClient.post<Agendamento>('/agendamentos', payload),
  update: (id: number, payload: AgendamentoRequest) =>
    httpClient.put<Agendamento>(`/agendamentos/${id}`, payload),
  updateStatus: (id: number, status: StatusAgendamento) =>
    httpClient.patch<Agendamento>(`/agendamentos/${id}/status`, { status }),
}
