// ===========================================
// OpoScore - Keyboard Shortcuts Hook
// Atajos de teclado globales
// ===========================================

'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcutsOptions {
  enabled?: boolean
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const { enabled = true } = options
  const router = useRouter()
  const waitingForSecondKey = useRef(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return

    // Ignorar si esta en un input/textarea/contenteditable
    const target = e.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return
    }

    // CMD/CTRL + K: Abrir búsqueda (placeholder para futuro)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      // TODO: Implementar command palette
      console.log('Abrir búsqueda (próximamente)')
      return
    }

    // Navegación con G + letra
    if (e.key.toLowerCase() === 'g' && !waitingForSecondKey.current) {
      waitingForSecondKey.current = true

      const handleSecondKey = (e2: KeyboardEvent) => {
        e2.preventDefault()
        waitingForSecondKey.current = false

        switch (e2.key.toLowerCase()) {
          case 'h':
          case 'd':
            router.push('/dashboard')
            break
          case 'e':
            router.push('/estudiar')
            break
          case 's':
            router.push('/simulacros')
            break
          case 'p':
            router.push('/progreso')
            break
          case 't':
            router.push('/tutor')
            break
          case 'c':
            router.push('/perfil')
            break
        }

        document.removeEventListener('keydown', handleSecondKey)
      }

      document.addEventListener('keydown', handleSecondKey, { once: true })

      // Timeout para cancelar si no se presiona segunda tecla
      setTimeout(() => {
        if (waitingForSecondKey.current) {
          waitingForSecondKey.current = false
          document.removeEventListener('keydown', handleSecondKey)
        }
      }, 1000)

      return
    }

    // Atajos directos con ?
    if (e.key === '?') {
      e.preventDefault()
      // Mostrar modal de ayuda de atajos
      console.log('Atajos disponibles:')
      console.log('g + h/d = Dashboard')
      console.log('g + e = Estudiar')
      console.log('g + s = Simulacros')
      console.log('g + p = Progreso')
      console.log('g + t = Tutor IA')
      console.log('g + c = Perfil (Cuenta)')
      console.log('Ctrl/Cmd + K = Buscar (próximamente)')
      return
    }
  }, [enabled, router])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    shortcuts: [
      { keys: ['g', 'h'], description: 'Ir al Dashboard' },
      { keys: ['g', 'e'], description: 'Ir a Estudiar' },
      { keys: ['g', 's'], description: 'Ir a Simulacros' },
      { keys: ['g', 'p'], description: 'Ir a Progreso' },
      { keys: ['g', 't'], description: 'Ir a Tutor IA' },
      { keys: ['g', 'c'], description: 'Ir a Perfil' },
      { keys: ['Ctrl', 'K'], description: 'Buscar (próximamente)' },
      { keys: ['?'], description: 'Ver atajos' },
    ],
  }
}
