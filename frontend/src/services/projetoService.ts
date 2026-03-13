import type {
  Projeto,
  ProjetoRequest,
  StatusProjeto,
} from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de projetos.
 */
export const projetoService = {
  list: (filters?: { status?: StatusProjeto }) => {
    const params = new URLSearchParams()

    if (filters?.status) {
      params.set('status', filters.status)
    }

    const query = params.toString()
    return httpClient.get<Projeto[]>(`/projetos${query ? `?${query}` : ''}`)
  },
  create: (payload: ProjetoRequest) =>
    httpClient.post<Projeto>('/projetos', payload),
  update: (id: number, payload: ProjetoRequest) =>
    httpClient.put<Projeto>(`/projetos/${id}`, payload),
  updateStatus: (id: number, status: StatusProjeto) =>
    httpClient.patch<Projeto>(`/projetos/${id}/status`, { status }),
}
