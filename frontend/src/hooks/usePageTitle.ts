import { useEffect } from 'react'

/**
 * Hook utilitario para atualizar o titulo da aba do navegador.
 *
 * Embora ainda nao esteja sendo usado nas paginas, ele ja deixa preparada uma
 * pequena base de reutilizacao para as proximas etapas.
 *
 * @param title titulo especifico da tela atual
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | StudioFlow`
  }, [title])
}
