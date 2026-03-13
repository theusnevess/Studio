import { PagePlaceholder } from './PagePlaceholder'

/**
 * Pagina reservada para o quadro Kanban do StudioFlow.
 */
export function KanbanPage() {
  return (
    <PagePlaceholder
      title="Kanban"
      description="Estrutura inicial do quadro visual para acompanhar o fluxo das tarefas do studio."
      hint="O backend ja entrega status e prioridade. A interface agora esta pronta para receber a primeira coluna funcional."
    />
  )
}
