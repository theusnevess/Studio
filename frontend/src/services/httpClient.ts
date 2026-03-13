import { apiBaseUrl } from './api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type RequestOptions = RequestInit & {
  path: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Nao foi possivel concluir a requisicao.'

    try {
      const errorBody = (await response.json()) as { message?: string }
      message = errorBody.message ?? message
    } catch {
      // Se a API nao retornar JSON de erro, mantemos a mensagem padrao.
    }

    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

/**
 * Cliente HTTP central da aplicacao.
 *
 * A implementacao usa fetch nativo para manter a base simples e sem
 * dependencias extras nesta etapa inicial.
 */
export async function request<T>({
  path,
  headers,
  ...options
}: RequestOptions): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...options,
  })

  return parseResponse<T>(response)
}

export const httpClient = {
  get: <T>(path: string) => request<T>({ path, method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>({
      path,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>({
      path,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>({
      path,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
}
