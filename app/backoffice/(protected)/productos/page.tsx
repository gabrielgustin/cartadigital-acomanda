import { PageShell } from '@/components/backoffice/page-shell'
import { ProductsManager } from '@/components/backoffice/products-manager'
import { getStore } from '@/lib/store'

export default async function ProductsPage() {
  const { sections } = await getStore()
  return (
    <PageShell title="Productos" backHref="/backoffice">
      <ProductsManager sections={sections} />
    </PageShell>
  )
}
