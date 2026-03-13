/**
 * Extrai uma mensagem legivel de erros de requisicao ou erros inesperados.
 */
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Nao foi possivel concluir a operacao.'
}
