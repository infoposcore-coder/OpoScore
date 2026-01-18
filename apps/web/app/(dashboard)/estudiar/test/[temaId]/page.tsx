// ===========================================
// OpoMetrics - Pagina de Test por Tema
// Flujo completo de test con preguntas
// ===========================================

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuestionFeedback, TestSummary, TestProgress } from '@/components/tests/QuestionFeedback'
import confetti from 'canvas-confetti'

// Mock de preguntas
const MOCK_PREGUNTAS = [
  {
    id: 1,
    pregunta: '¿Cuál es el artículo de la Constitución Española que reconoce el derecho a la vida?',
    opciones: [
      { id: 'a', texto: 'Artículo 10' },
      { id: 'b', texto: 'Artículo 14' },
      { id: 'c', texto: 'Artículo 15' },
      { id: 'd', texto: 'Artículo 18' },
    ],
    correcta: 'c',
    explicacion: 'El artículo 15 de la Constitución Española establece: "Todos tienen derecho a la vida y a la integridad física y moral, sin que, en ningún caso, puedan ser sometidos a tortura ni a penas o tratos inhumanos o degradantes."',
    tema: 'Derechos Fundamentales',
  },
  {
    id: 2,
    pregunta: '¿Quién nombra al Presidente del Gobierno según la Constitución?',
    opciones: [
      { id: 'a', texto: 'El Congreso de los Diputados' },
      { id: 'b', texto: 'El Rey' },
      { id: 'c', texto: 'El Senado' },
      { id: 'd', texto: 'El Tribunal Constitucional' },
    ],
    correcta: 'b',
    explicacion: 'Según el artículo 99 de la Constitución, el Rey propone un candidato a la Presidencia del Gobierno y, una vez obtenida la confianza del Congreso, el Rey le nombra Presidente.',
    tema: 'La Corona',
  },
  {
    id: 3,
    pregunta: '¿Cuántos miembros tiene el Tribunal Constitucional?',
    opciones: [
      { id: 'a', texto: '9 miembros' },
      { id: 'b', texto: '10 miembros' },
      { id: 'c', texto: '12 miembros' },
      { id: 'd', texto: '15 miembros' },
    ],
    correcta: 'c',
    explicacion: 'El Tribunal Constitucional está compuesto por 12 miembros nombrados por el Rey: 4 a propuesta del Congreso, 4 a propuesta del Senado, 2 a propuesta del Gobierno y 2 a propuesta del CGPJ.',
    tema: 'Tribunal Constitucional',
  },
  {
    id: 4,
    pregunta: '¿Cuál es la duración del mandato de los Diputados?',
    opciones: [
      { id: 'a', texto: '3 años' },
      { id: 'b', texto: '4 años' },
      { id: 'c', texto: '5 años' },
      { id: 'd', texto: '6 años' },
    ],
    correcta: 'b',
    explicacion: 'El artículo 68.4 de la Constitución establece que el Congreso es elegido por cuatro años y que el mandato de los Diputados termina cuatro años después de su elección o el día de la disolución de la Cámara.',
    tema: 'Las Cortes Generales',
  },
  {
    id: 5,
    pregunta: '¿Qué mayoría se requiere para aprobar una Ley Orgánica?',
    opciones: [
      { id: 'a', texto: 'Mayoría simple del Congreso' },
      { id: 'b', texto: 'Mayoría absoluta del Congreso' },
      { id: 'c', texto: 'Mayoría de dos tercios del Congreso' },
      { id: 'd', texto: 'Mayoría absoluta del Senado' },
    ],
    correcta: 'b',
    explicacion: 'El artículo 81.2 de la Constitución establece que la aprobación, modificación o derogación de las leyes orgánicas exigirá mayoría absoluta del Congreso, en una votación final sobre el conjunto del proyecto.',
    tema: 'Las Cortes Generales',
  },
]

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const temaId = params.temaId as string

  const [preguntas] = useState(MOCK_PREGUNTAS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [respuestas, setRespuestas] = useState<{ preguntaId: number; respuesta: string; correcta: boolean; tiempo: number }[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const [testCompleted, setTestCompleted] = useState(false)
  const [streak, setStreak] = useState(0)

  const currentQuestion = preguntas[currentIndex]

  const handleSelectAnswer = (answerId: string) => {
    if (showFeedback) return
    setSelectedAnswer(answerId)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || showFeedback) return

    const isCorrect = selectedAnswer === currentQuestion.correcta
    const tiempo = Math.round((Date.now() - startTime) / 1000)

    setRespuestas([
      ...respuestas,
      {
        preguntaId: currentQuestion.id,
        respuesta: selectedAnswer,
        correcta: isCorrect,
        tiempo,
      },
    ])

    if (isCorrect) {
      setStreak(streak + 1)
      if (streak > 0 && (streak + 1) % 3 === 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        })
      }
    } else {
      setStreak(0)
    }

    setShowFeedback(true)
  }

  const handleContinue = () => {
    if (currentIndex < preguntas.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setStartTime(Date.now())
    } else {
      setTestCompleted(true)
    }
  }

  const handleFinishTest = () => {
    router.push('/estudiar')
  }

  const handleRepeatTest = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setRespuestas([])
    setTestCompleted(false)
    setStreak(0)
    setStartTime(Date.now())
  }

  // Calcular resultados
  const correctas = respuestas.filter(r => r.correcta).length
  const porcentaje = preguntas.length > 0 ? Math.round((correctas / preguntas.length) * 100) : 0
  const tiempoTotal = respuestas.reduce((acc, r) => acc + r.tiempo, 0)

  if (testCompleted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <TestSummary
          correctas={correctas}
          total={preguntas.length}
          porcentaje={porcentaje}
          tiempoTotal={tiempoTotal}
          opoMetricsAnterior={67}
          opoMetricsNuevo={porcentaje >= 70 ? 69 : 66}
          onContinue={handleFinishTest}
          onRepetir={handleRepeatTest}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header con progreso */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Salir
        </Button>
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
              🔥 Racha: {streak}
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {preguntas.length}
          </span>
        </div>
      </div>

      <TestProgress
        current={currentIndex + 1}
        total={preguntas.length}
        correctas={respuestas.filter(r => r.correcta).length}
      />

      {/* Pregunta */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardContent className="pt-6">
              <Badge variant="outline" className="mb-4">
                {currentQuestion.tema}
              </Badge>
              <h2 className="text-xl font-medium mb-6">
                {currentQuestion.pregunta}
              </h2>

              {/* Opciones */}
              <div className="space-y-3">
                {currentQuestion.opciones.map((opcion) => {
                  const isSelected = selectedAnswer === opcion.id
                  const isCorrect = opcion.id === currentQuestion.correcta
                  const showResult = showFeedback

                  let className = 'w-full p-4 rounded-xl border-2 text-left transition-all '

                  if (showResult) {
                    if (isCorrect) {
                      className += 'border-green-500 bg-green-500/10'
                    } else if (isSelected && !isCorrect) {
                      className += 'border-red-500 bg-red-500/10'
                    } else {
                      className += 'border-border opacity-50'
                    }
                  } else {
                    className += isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }

                  return (
                    <button
                      key={opcion.id}
                      onClick={() => handleSelectAnswer(opcion.id)}
                      disabled={showFeedback}
                      className={className}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {opcion.id.toUpperCase()}
                        </span>
                        <span>{opcion.texto}</span>
                        {showResult && isCorrect && (
                          <span className="ml-auto text-green-500">✓</span>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <span className="ml-auto text-red-500">✗</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Botón de confirmar */}
              {!showFeedback && (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="w-full mt-6"
                  size="lg"
                >
                  Confirmar respuesta
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      {showFeedback && (
        <QuestionFeedback
          isCorrect={selectedAnswer === currentQuestion.correcta}
          correctAnswer={currentQuestion.opciones.find(o => o.id === currentQuestion.correcta)?.texto || ''}
          explanation={currentQuestion.explicacion}
          tema={currentQuestion.tema}
          onContinue={handleContinue}
          streak={streak}
        />
      )}
    </div>
  )
}
