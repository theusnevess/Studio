import type { Tarefa } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de tarefas.
 */
export const tarefaService = {
  list: () => httpClient.get<Tarefa[]>('/tarefas'),
}
