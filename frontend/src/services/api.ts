/**
 * URL base da API.
 *
 * Ja deixamos esta constante pronta para a integracao futura entre frontend e
 * backend. Se existir a variavel VITE_API_BASE_URL, ela tera prioridade.
 */
export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
