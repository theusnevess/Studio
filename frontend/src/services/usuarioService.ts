import type { Usuario } from '../types/domain'
import { httpClient } from './httpClient'

/**
 * Servicos iniciais do modulo de usuarios.
 */
export const usuarioService = {
  list: () => httpClient.get<Usuario[]>('/usuarios'),
}
