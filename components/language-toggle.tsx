'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage()

  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      aria-label={t.languageLabel}
      className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:right-6 sm:top-6"
    >
      <Languages className="h-3.5 w-3.5" aria-hidden />
      {t.switchTo}
    </button>
  )
}
