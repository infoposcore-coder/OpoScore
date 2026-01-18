// ===========================================
// OpoMetrics - Question Feedback Component
// Feedback detallado para preguntas de test
// ===========================================

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Feedback simplificado para usar en el flujo de test
interface QuestionFeedbackProps {
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  tema?: string
  onContinue: () => void
  streak?: number
}

export function QuestionFeedback({
  isCorrect,
  correctAnswer,
  explanation,
  tema,
  onContinue,
  streak = 0,
}: QuestionFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`border-2 ${
        isCorrect ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
      }`}>
        <CardContent className="pt-6 space-y-4">
          {/* Header con resultado */}
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
            )}
            <div>
              <span className={`font-bold text-lg ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </span>
              {streak > 1 && isCorrect && (
                <Badge variant="secondary" className="ml-2 bg-orange-500/10 text-orange-500">
                  Racha: {streak}
                </Badge>
              )}
            </div>
          </div>

          {/* Respuesta correcta si fallo */}
          {!isCorrect && (
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-300">
                <span className="font-medium">Respuesta correcta:</span> {correctAnswer}
              </p>
            </div>
          )}

          {/* Explicación */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">Explicación</h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">{explanation}</p>
                {tema && (
                  <Badge variant="outline" className="mt-2">{tema}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Botón continuar */}
          <Button onClick={onContinue} className="w-full" size="lg">
            Siguiente pregunta
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Componente para resumen final del test
interface TestSummaryProps {
  correctas: number
  total: number
  porcentaje: number
  tiempoTotal: number
  opoMetricsAnterior?: number
  opoMetricsNuevo?: number
  onContinue: () => void
  onRepetir?: () => void
}

export function TestSummary({
  correctas,
  total,
  porcentaje,
  tiempoTotal,
  opoMetricsAnterior,
  opoMetricsNuevo,
  onContinue,
  onRepetir,
}: TestSummaryProps) {
  const incorrectas = total - correctas
  const tiempoMinutos = Math.floor(tiempoTotal / 60)
  const tiempoSegundos = tiempoTotal % 60

  const getResultColor = () => {
    if (porcentaje >= 80) return 'text-green-600'
    if (porcentaje >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEmoji = () => {
    if (porcentaje >= 90) return '🏆'
    if (porcentaje >= 80) return '🎉'
    if (porcentaje >= 70) return '👍'
    if (porcentaje >= 60) return '💪'
    return '📚'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Emoji y título */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {getEmoji()}
            </motion.div>
            <h2 className="text-2xl font-bold">¡Test completado!</h2>
          </div>

          {/* Puntuación principal */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${getResultColor()}`}>
              {porcentaje}%
            </div>
            <p className="text-muted-foreground">
              {correctas} de {total} correctas
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">{correctas} correctas</span>
              <span className="text-red-600">{incorrectas} incorrectas</span>
            </div>
            <div className="h-4 rounded-full bg-red-200 dark:bg-red-900/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${porcentaje}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-full bg-green-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted text-center">
              <div className="text-2xl font-bold">{tiempoMinutos}:{tiempoSegundos.toString().padStart(2, '0')}</div>
              <div className="text-xs text-muted-foreground">Tiempo total</div>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <div className="text-2xl font-bold">{total > 0 ? Math.round(tiempoTotal / total) : 0}s</div>
              <div className="text-xs text-muted-foreground">Promedio/pregunta</div>
            </div>
          </div>

          {/* OpoMetrics Update */}
          {opoMetricsAnterior !== undefined && opoMetricsNuevo !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tu OpoMetrics</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{opoMetricsAnterior}</span>
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className={`font-bold ${opoMetricsNuevo > opoMetricsAnterior ? 'text-green-600' : opoMetricsNuevo < opoMetricsAnterior ? 'text-red-600' : ''}`}>
                    {opoMetricsNuevo}
                    {opoMetricsNuevo > opoMetricsAnterior && (
                      <span className="text-xs ml-1">+{opoMetricsNuevo - opoMetricsAnterior}</span>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Acciones */}
          <div className="flex gap-3">
            {onRepetir && (
              <Button variant="outline" className="flex-1" onClick={onRepetir}>
                Repetir test
              </Button>
            )}
            <Button className="flex-1" onClick={onContinue}>
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Indicador de progreso del test
interface TestProgressProps {
  current: number
  total: number
  correctas: number
}

export function TestProgress({ current, total, correctas }: TestProgressProps) {
  const porcentaje = (current / total) * 100
  const incorrectas = current - 1 - correctas

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>Pregunta {current} de {total}</span>
        <div className="flex items-center gap-3">
          <span className="text-green-600">{correctas} ✓</span>
          <span className="text-red-600">{incorrectas > 0 ? incorrectas : 0} ✗</span>
        </div>
      </div>
      <Progress value={porcentaje} className="h-2" />
    </div>
  )
}
