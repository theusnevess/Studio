import type { Projeto } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de projetos.
 */
export const projetoService = {
  list: () => httpClient.get<Projeto[]>('/projetos'),
}
