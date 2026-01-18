// ===========================================
// OpoMetrics - Pagina de Flashcards
// ===========================================

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { usePendingFlashcards, useReviewFlashcard, useFlashcardStats } from '@/hooks/useFlashcards'
import { useUserStore } from '@/stores/userStore'

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

// Flashcards mock para modo demo
const mockFlashcards = [
  {
    id: 'f1',
    frente: 'Que articulo de la Constitucion Espanola establece que Espana se constituye en un Estado social y democratico de Derecho?',
    reverso: 'Articulo 1.1 de la Constitucion Espanola de 1978',
    caja: 1,
    proxima_revision: new Date().toISOString(),
    tema: { nombre: 'La Constitucion Espanola' },
  },
  {
    id: 'f2',
    frente: 'Cuales son los valores superiores del ordenamiento juridico espanol segun la Constitucion?',
    reverso: 'Libertad, justicia, igualdad y pluralismo politico (Art. 1.1 CE)',
    caja: 1,
    proxima_revision: new Date().toISOString(),
    tema: { nombre: 'La Constitucion Espanola' },
  },
  {
    id: 'f3',
    frente: 'Quien es el titular de la soberania nacional segun la Constitucion?',
    reverso: 'El pueblo espanol, del que emanan los poderes del Estado (Art. 1.2 CE)',
    caja: 2,
    proxima_revision: new Date().toISOString(),
    tema: { nombre: 'La Constitucion Espanola' },
  },
  {
    id: 'f4',
    frente: 'Cual es la forma politica del Estado espanol?',
    reverso: 'Monarquia parlamentaria (Art. 1.3 CE)',
    caja: 1,
    proxima_revision: new Date().toISOString(),
    tema: { nombre: 'La Constitucion Espanola' },
  },
  {
    id: 'f5',
    frente: 'Que establece el articulo 2 de la Constitucion sobre la unidad de Espana?',
    reverso: 'La indisoluble unidad de la Nacion espanola, reconociendo el derecho a la autonomia de las nacionalidades y regiones',
    caja: 3,
    proxima_revision: new Date().toISOString(),
    tema: { nombre: 'La Constitucion Espanola' },
  },
  {
    id: 'f6',
    frente: 'Cuantos titulos tiene la Constitucion Espanola?',
    reverso: '10 titulos mas un titulo preliminar (11 en total)',
    caja: 2,
    proxima_revision: new Date().toISOString(),
    tema: { nombre: 'La Constitucion Espanola' },
  },
  {
    id: 'f7',
    frente: 'Cuando entro en vigor la Constitucion Espanola de 1978?',
    reverso: 'El 29 de diciembre de 1978, fecha de su publicacion en el BOE',
    caja: 1,
    proxima_revision: new Date().toISOString(),
    tema: { nombre: 'La Constitucion Espanola' },
  },
  {
    id: 'f8',
    frente: 'Que organo se encarga de la defensa de los derechos fundamentales?',
    reverso: 'El Defensor del Pueblo, designado por las Cortes Generales (Art. 54 CE)',
    caja: 2,
    proxima_revision: new Date().toISOString(),
    tema: { nombre: 'Derechos y deberes fundamentales' },
  },
]

interface FlashcardData {
  id: string
  frente: string
  reverso: string
  caja: number
  proxima_revision: string
  tema?: { nombre: string }
}

export default function FlashcardsPage() {
  const params = useParams()
  const slug = params.oposicion as string
  const { profile } = useUserStore()
  const userId = profile?.id || ''

  // Solo usar hooks de Supabase si no estamos en modo demo
  const { data: pendingCardsData, isLoading: isLoadingReal } = usePendingFlashcards(DEMO_MODE ? '' : userId)
  const { data: stats } = useFlashcardStats(DEMO_MODE ? '' : userId)
  const reviewMutation = useReviewFlashcard()

  // Estado para modo demo
  const [demoCards, setDemoCards] = useState<FlashcardData[]>([...mockFlashcards])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 })

  // Determinar que tarjetas usar
  const isLoading = DEMO_MODE ? false : isLoadingReal
  const pendingCards = DEMO_MODE ? demoCards : (pendingCardsData as FlashcardData[] | undefined)
  const currentCard = pendingCards?.[currentIndex]

  const handleReview = async (acertada: boolean) => {
    if (!currentCard) return

    if (DEMO_MODE) {
      // En modo demo, simular movimiento de caja
      setDemoCards((prev) => {
        const updated = [...prev]
        const cardIndex = updated.findIndex((c) => c.id === currentCard.id)
        if (cardIndex >= 0) {
          if (acertada) {
            updated[cardIndex].caja = Math.min(5, updated[cardIndex].caja + 1)
          } else {
            updated[cardIndex].caja = 1
          }
        }
        return updated
      })
    } else {
      try {
        await reviewMutation.mutateAsync({
          flashcardId: currentCard.id,
          acertada,
        })
      } catch (error) {
        console.error('Error reviewing flashcard:', error)
      }
    }

    setSessionStats((prev) => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (acertada ? 1 : 0),
    }))

    setShowAnswer(false)
    setCurrentIndex((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Cargando flashcards...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sin flashcards pendientes
  if (!pendingCards || pendingCards.length === 0 || currentIndex >= pendingCards.length) {
    const mockStats = {
      porCaja: { 1: 3, 2: 2, 3: 1, 4: 1, 5: 1 } as Record<1|2|3|4|5, number>,
    }
    const displayStats = DEMO_MODE ? mockStats : stats

    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Link
          href={`/estudiar/${slug}`}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← Volver
        </Link>

        {/* Demo Mode Banner */}
        {DEMO_MODE && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 mb-6">
            <span className="text-2xl">🎮</span>
            <div>
              <p className="font-medium text-yellow-800">Modo Demo</p>
              <p className="text-sm text-yellow-700">Sistema Leitner de ejemplo.</p>
            </div>
          </div>
        )}

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">
              {sessionStats.reviewed > 0 ? 'Sesion completada' : 'Sin flashcards pendientes'}
            </CardTitle>
            <CardDescription>
              {sessionStats.reviewed > 0
                ? `Has revisado ${sessionStats.reviewed} tarjetas (${sessionStats.correct} correctas)`
                : 'No tienes flashcards para revisar hoy'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayStats && (
              <div className="grid grid-cols-5 gap-2 text-center text-sm">
                {[1, 2, 3, 4, 5].map((caja) => (
                  <div key={caja} className="p-2 bg-muted rounded">
                    <p className="font-bold">{displayStats.porCaja[caja as 1|2|3|4|5] || 0}</p>
                    <p className="text-xs text-muted-foreground">Caja {caja}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {DEMO_MODE && sessionStats.reviewed > 0 && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setDemoCards([...mockFlashcards])
                  setCurrentIndex(0)
                  setSessionStats({ reviewed: 0, correct: 0 })
                }}
              >
                Reiniciar demo
              </Button>
            )}
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/estudiar/${slug}`}>Volver</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const progress = ((currentIndex) / pendingCards.length) * 100

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Link
        href={`/estudiar/${slug}`}
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        ← Volver
      </Link>

      {/* Demo Mode Banner */}
      {DEMO_MODE && currentIndex === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-medium text-yellow-800">Modo Demo - Sistema Leitner</p>
            <p className="text-sm text-yellow-700">Las tarjetas avanzan de caja al acertar, vuelven a caja 1 al fallar.</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Tarjeta {currentIndex + 1} de {pendingCards.length}</span>
          <span>Caja {currentCard?.caja || 1}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card
        className="min-h-[300px] cursor-pointer"
        onClick={() => !showAnswer && setShowAnswer(true)}
      >
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] p-8">
          {!showAnswer ? (
            <>
              <p className="text-lg text-center font-medium">
                {currentCard?.frente}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Toca para ver la respuesta
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">Respuesta:</p>
              <p className="text-lg text-center">
                {currentCard?.reverso}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {showAnswer && (
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => handleReview(false)}
            disabled={reviewMutation.isPending}
          >
            No lo sabia
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => handleReview(true)}
            disabled={reviewMutation.isPending}
          >
            Lo sabia
          </Button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Sesion: {sessionStats.reviewed} revisadas • {sessionStats.correct} correctas
        </p>
      </div>
    </div>
  )
}
