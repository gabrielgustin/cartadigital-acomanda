import { CategoriesManager } from '@/components/backoffice/categories-manager'
import { PageShell } from '@/components/backoffice/page-shell'
import { getStore } from '@/lib/store'

export default async function CategoriesPage() {
  const { sections } = await getStore()
  return (
    <PageShell title="Categorías" backHref="/backoffice">
      <CategoriesManager sections={sections} />
    </PageShell>
  )
}
