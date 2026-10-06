'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { strings, type Strings } from '@/lib/i18n'
import type { Lang } from '@/lib/menu-data'

const STORAGE_KEY = 'la-comanda-lang'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Strings
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // El servidor siempre renderiza en español; el idioma guardado o el del
  // dispositivo se aplica después de hidratar para no desfasar el HTML.
  const [lang, setLangState] = useState<Lang>('es')

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {}
    if (stored === 'es' || stored === 'en') setLangState(stored)
    else if (navigator.language?.toLowerCase().startsWith('en')) setLangState('en')
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const value = useMemo(() => ({ lang, setLang, t: strings[lang] }), [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage debe usarse dentro de LanguageProvider')
  return context
}
