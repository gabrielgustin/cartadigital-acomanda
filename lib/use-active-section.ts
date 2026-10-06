'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

// Distancia entre el borde inferior de la barra pegajosa y el título de la
// sección. El click en una categoría scrollea exactamente a este offset, así
// que la línea de detección tiene que usar el mismo valor: si difieren, el
// siguiente tick de scroll revierte la píldora a la categoría anterior justo
// después del click.
const SECTION_OFFSET = 12

// Detecta qué sección está activa por posición (no con IntersectionObserver,
// que puede alternar entre dos entradas superpuestas y hacer parpadear la
// píldora) y resuelve el click en una categoría con scroll suave.
export function useActiveSection(ids: string[], stickyRef: RefObject<HTMLDivElement | null>) {
  const [activeSection, setActiveSection] = useState(ids[0] ?? '')
  const idsKey = ids.join('|')

  // Mientras corre el scroll suave de un click, el detector se pausa para que
  // la píldora salte directo a la categoría elegida en vez de pasar por todas
  // las intermedias. Se libera al frenar el scroll o con input manual.
  const clickLock = useRef(false)
  const clickLockTimer = useRef<number | undefined>(undefined)

  const releaseClickLock = () => {
    window.clearTimeout(clickLockTimer.current)
    if (!clickLock.current) return
    clickLock.current = false
    window.dispatchEvent(new Event('scroll'))
  }

  const armClickLock = () => {
    clickLock.current = true
    window.clearTimeout(clickLockTimer.current)
    clickLockTimer.current = window.setTimeout(releaseClickLock, 160)
  }

  useEffect(() => {
    // Se resuelven en cada tick: al filtrar, las secciones sin resultados
    // desaparecen del DOM y no deben participar en la detección.
    const getSectionEls = () => idsKey.split('|').map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    let ticking = false

    const getLine = () => (stickyRef.current?.getBoundingClientRect().height ?? 0) + SECTION_OFFSET

    const update = () => {
      ticking = false
      const sectionEls = getSectionEls()
      if (!sectionEls.length) return

      // Cerca del final de la página el navegador clampa el scroll antes de
      // que el título de una última sección corta cruce la línea; sin esto
      // seguiría activa la penúltima aunque la última se vea completa.
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        const lastId = sectionEls[sectionEls.length - 1].id
        setActiveSection((prev) => (prev === lastId ? prev : lastId))
        return
      }

      const line = getLine()
      let current = sectionEls[0].id
      for (const el of sectionEls) {
        if (el.getBoundingClientRect().top <= line) current = el.id
        else break
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (clickLock.current) {
        armClickLock()
        return
      }
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    const onManualInput = () => releaseClickLock()

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('wheel', onManualInput, { passive: true })
    window.addEventListener('touchstart', onManualInput, { passive: true })
    window.addEventListener('keydown', onManualInput)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', onManualInput)
      window.removeEventListener('touchstart', onManualInput)
      window.removeEventListener('keydown', onManualInput)
      window.clearTimeout(clickLockTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  const selectSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault()
    const target = document.getElementById(sectionId)
    if (!target) return

    // Pinta la píldora en la categoría elegida de inmediato en vez de esperar
    // a que el detector la alcance al terminar el scroll suave.
    setActiveSection(sectionId)
    armClickLock()

    const stickyHeight = stickyRef.current?.getBoundingClientRect().height ?? 0
    const targetTop = target.getBoundingClientRect().top + window.scrollY - stickyHeight - SECTION_OFFSET
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
  }

  return { activeSection, selectSection }
}
