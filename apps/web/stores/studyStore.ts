// ===========================================
// OpoScore - Study Store (Zustand)
// ===========================================

import { create } from 'zustand'
import type { Tema, Pregunta, Flashcard } from '@/types/database'

interface TestState {
  preguntas: (Pregunta & { respuestas: { id: string; texto: string; orden: number }[] })[]
  preguntaActual: number
  respuestas: Map<string, string> // pregunta_id -> respuesta_id
  tiempos: Map<string, number> // pregunta_id -> tiempo_ms
  inicioTest: Date | null
  completado: boolean
}

interface StudyState {
  // Sesión de estudio actual
  sesionActiva: {
    id: string | null
    oposicionId: string | null
    tipo: 'lectura' | 'test' | 'flashcards' | 'simulacro' | null
    inicio: Date | null
  }

  // Test actual
  test: TestState

  // Flashcards pendientes
  flashcardsPendientes: Flashcard[]
  flashcardActual: number

  // Tema actual (para lectura)
  temaActual: Tema | null

  // Acciones de sesión
  iniciarSesion: (oposicionId: string, tipo: StudyState['sesionActiva']['tipo']) => void
  finalizarSesion: () => void

  // Acciones de test
  iniciarTest: (preguntas: TestState['preguntas']) => void
  responderPregunta: (preguntaId: string, respuestaId: string, tiempoMs: number) => void
  siguientePregunta: () => void
  anteriorPregunta: () => void
  irAPregunta: (index: number) => void
  finalizarTest: () => void
  resetTest: () => void

  // Acciones de flashcards
  setFlashcardsPendientes: (flashcards: Flashcard[]) => void
  siguienteFlashcard: () => void
  resetFlashcards: () => void

  // Acciones de tema
  setTemaActual: (tema: Tema | null) => void

  // Reset completo
  reset: () => void
}

const initialTestState: TestState = {
  preguntas: [],
  preguntaActual: 0,
  respuestas: new Map(),
  tiempos: new Map(),
  inicioTest: null,
  completado: false,
}

const initialState = {
  sesionActiva: {
    id: null,
    oposicionId: null,
    tipo: null,
    inicio: null,
  },
  test: initialTestState,
  flashcardsPendientes: [],
  flashcardActual: 0,
  temaActual: null,
}

export const useStudyStore = create<StudyState>()((set, get) => ({
  ...initialState,

  // Sesión
  iniciarSesion: (oposicionId, tipo) => set({
    sesionActiva: {
      id: crypto.randomUUID(),
      oposicionId,
      tipo,
      inicio: new Date(),
    },
  }),

  finalizarSesion: () => set({
    sesionActiva: initialState.sesionActiva,
  }),

  // Test
  iniciarTest: (preguntas) => set({
    test: {
      preguntas,
      preguntaActual: 0,
      respuestas: new Map(),
      tiempos: new Map(),
      inicioTest: new Date(),
      completado: false,
    },
  }),

  responderPregunta: (preguntaId, respuestaId, tiempoMs) => {
    const { test } = get()
    const nuevasRespuestas = new Map(test.respuestas)
    const nuevosTiempos = new Map(test.tiempos)

    nuevasRespuestas.set(preguntaId, respuestaId)
    nuevosTiempos.set(preguntaId, tiempoMs)

    set({
      test: {
        ...test,
        respuestas: nuevasRespuestas,
        tiempos: nuevosTiempos,
      },
    })
  },

  siguientePregunta: () => {
    const { test } = get()
    if (test.preguntaActual < test.preguntas.length - 1) {
      set({
        test: {
          ...test,
          preguntaActual: test.preguntaActual + 1,
        },
      })
    }
  },

  anteriorPregunta: () => {
    const { test } = get()
    if (test.preguntaActual > 0) {
      set({
        test: {
          ...test,
          preguntaActual: test.preguntaActual - 1,
        },
      })
    }
  },

  irAPregunta: (index) => {
    const { test } = get()
    if (index >= 0 && index < test.preguntas.length) {
      set({
        test: {
          ...test,
          preguntaActual: index,
        },
      })
    }
  },

  finalizarTest: () => {
    const { test } = get()
    set({
      test: {
        ...test,
        completado: true,
      },
    })
  },

  resetTest: () => set({ test: initialTestState }),

  // Flashcards
  setFlashcardsPendientes: (flashcards) => set({
    flashcardsPendientes: flashcards,
    flashcardActual: 0,
  }),

  siguienteFlashcard: () => {
    const { flashcardsPendientes, flashcardActual } = get()
    if (flashcardActual < flashcardsPendientes.length - 1) {
      set({ flashcardActual: flashcardActual + 1 })
    }
  },

  resetFlashcards: () => set({
    flashcardsPendientes: [],
    flashcardActual: 0,
  }),

  // Tema
  setTemaActual: (tema) => set({ temaActual: tema }),

  // Reset
  reset: () => set(initialState),
}))

// Selectores útiles
export const useCurrentPregunta = () => useStudyStore((state) => {
  const { test } = state
  return test.preguntas[test.preguntaActual] || null
})

export const useTestProgress = () => useStudyStore((state) => {
  const { test } = state
  const respondidas = test.respuestas.size
  const total = test.preguntas.length
  return {
    respondidas,
    total,
    porcentaje: total > 0 ? Math.round((respondidas / total) * 100) : 0,
  }
})

export const useCurrentFlashcard = () => useStudyStore((state) => {
  const { flashcardsPendientes, flashcardActual } = state
  return flashcardsPendientes[flashcardActual] || null
})
