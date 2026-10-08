import { connection } from 'next/server'
import { LanguageProvider } from '@/components/language-provider'
import { MenuExperience } from '@/components/menu-experience'
import { OrderProvider } from '@/components/order-provider'
import { SiteThemeProvider } from '@/components/site-theme'
import { getStore, publicSections } from '@/lib/store'

export default async function Page() {
  // La carta se edita desde el backoffice: se lee en cada visita, no en el build.
  await connection()
  const { sections, theme } = await getStore()

  return (
    <SiteThemeProvider initial={theme}>
      <LanguageProvider>
        <OrderProvider sections={publicSections(sections)}>
          <MenuExperience />
        </OrderProvider>
      </LanguageProvider>
    </SiteThemeProvider>
  )
}
