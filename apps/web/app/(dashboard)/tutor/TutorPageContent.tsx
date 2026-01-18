// ===========================================
// OpoMetrics - Tutor Page Content (Client Component)
// ===========================================

'use client'

import { useState, useRef } from 'react'
import { TutorChat } from '@/components/ai/TutorChat'
import { Card, CardContent } from '@/components/ui/card'
import { PlanGate } from '@/components/billing/PlanGate'

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

export function TutorPageContent() {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const chatRef = useRef<{ sendSuggestion: (text: string) => void } | null>(null)

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion)
    // El componente TutorChat recibirá la sugerencia como prop
  }

  return (
    <PlanGate feature="tutor_ia">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Tutor IA</h1>
          <p className="text-muted-foreground">
            Pregúntame cualquier duda sobre tu oposición
          </p>
        </div>

        {DEMO_MODE && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Modo Demo</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Respuestas limitadas. Configura GROQ_API_KEY para IA completa.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="max-w-3xl">
          <TutorChat
            oposicion="Auxiliar Administrativo del Estado"
            initialMessage={selectedSuggestion}
            onMessageSent={() => setSelectedSuggestion(null)}
          />
        </div>

        <div className="mt-6 max-w-3xl">
          <h2 className="font-semibold mb-3">Prueba estas preguntas</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              '¿Cuántos títulos tiene la Constitución?',
              'Explícame el procedimiento administrativo',
              '¿Qué es el silencio administrativo?',
              'Dame tips para memorizar leyes',
              '¿Qué diferencia hay entre recurso de alzada y reposición?',
              '¿Cómo organizo mi tiempo de estudio?',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left text-sm p-3 rounded-lg border bg-card text-muted-foreground hover:bg-muted hover:border-primary/50 transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-3xl">
          <h2 className="font-semibold mb-3">¿Qué puede hacer el Tutor?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-medium">Explicar temas</h3>
                <p className="text-sm text-muted-foreground">
                  Resuelve dudas sobre cualquier parte del temario
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-medium">Corregir tests</h3>
                <p className="text-sm text-muted-foreground">
                  Te explica por qué una respuesta es correcta
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl mb-2">💡</div>
                <h3 className="font-medium">Tips de estudio</h3>
                <p className="text-sm text-muted-foreground">
                  Consejos y técnicas para memorizar mejor
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PlanGate>
  )
}
