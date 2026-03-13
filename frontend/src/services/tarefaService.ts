import type { StatusTarefa, Tarefa, TarefaRequest } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de tarefas.
 */
export const tarefaService = {
  list: (filters?: { status?: StatusTarefa; projetoId?: number }) => {
    const params = new URLSearchParams()

    if (filters?.status) {
      params.set('status', filters.status)
    }

    if (filters?.projetoId) {
      params.set('projetoId', String(filters.projetoId))
    }

    const query = params.toString()
    return httpClient.get<Tarefa[]>(`/tarefas${query ? `?${query}` : ''}`)
  },
  create: (payload: TarefaRequest) =>
    httpClient.post<Tarefa>('/tarefas', payload),
  update: (id: number, payload: TarefaRequest) =>
    httpClient.put<Tarefa>(`/tarefas/${id}`, payload),
  updateStatus: (id: number, status: StatusTarefa) =>
    httpClient.patch<Tarefa>(`/tarefas/${id}/status`, { status }),
}
