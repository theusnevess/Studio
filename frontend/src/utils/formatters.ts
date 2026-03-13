/**
 * Formatador simples de data e hora em pt-BR para listas e cards do painel.
 */
export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

/**
 * Formatador simples apenas de data.
 */
export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(new Date(value))
}

/**
 * Formatador simples apenas de hora.
 */
export function formatTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

/**
 * Converte um valor ISO para o formato aceito por inputs datetime-local.
 */
export function toDateTimeLocalValue(value?: string) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const pad = (part: number) => String(part).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * Converte um valor do input datetime-local para ISO local sem segundos.
 */
export function toApiDateTime(value?: string) {
  return value || undefined
}
