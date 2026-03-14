import type { ReactNode } from 'react'

/**
 * Tipo simples que representa um item de navegacao da interface.
 */
export type AppRouteLink = {
  label: string
  to: string
  shortLabel: string
  description: string
  icon?: ReactNode
}
