import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'

type PagePlaceholderProps = {
  title: string
  description: string
  eyebrow?: string
  hint?: string
}

/**
 * Componente reutilizavel para telas ainda nao implementadas.
 */
export function PagePlaceholder({
  title,
  description,
  eyebrow = 'Modulo em construcao',
  hint = 'A fundacao visual e estrutural ja esta pronta para receber integracao real com a API.',
}: PagePlaceholderProps) {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <AppCard>
        <EmptyState
          title={`${title} pronto para evoluir`}
          description={hint}
          actionLabel="Integracao em breve"
        />
      </AppCard>
    </section>
  )
}
