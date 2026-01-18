// ===========================================
// OpoMetrics - Medidor de Predicción ML
// Disponible para usuarios Pro+
// ===========================================

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PredictionData {
  probabilidadAprobado: number
  confianzaModelo: number
  diasHastaListo: number
  fechaEstimadaListo: string
  factoresPositivos: string[]
  factoresNegativos: string[]
  recomendaciones: string[]
}

interface PredictionGaugeProps {
  prediction: PredictionData
  locked?: boolean
}

export function PredictionGauge({ prediction, locked = false }: PredictionGaugeProps) {
  const getColorClass = (prob: number) => {
    if (prob >= 80) return 'text-green-500'
    if (prob >= 60) return 'text-lime-500'
    if (prob >= 40) return 'text-yellow-500'
    return 'text-orange-500'
  }

  const getGradient = (prob: number) => {
    if (prob >= 80) return 'from-green-500 to-emerald-400'
    if (prob >= 60) return 'from-lime-500 to-green-400'
    if (prob >= 40) return 'from-yellow-500 to-lime-400'
    return 'from-orange-500 to-yellow-400'
  }

  const getEmoji = (prob: number) => {
    if (prob >= 80) return '🎯'
    if (prob >= 60) return '📈'
    if (prob >= 40) return '💪'
    return '📚'
  }

  if (locked) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
          <span className="text-5xl mb-3">🔮</span>
          <p className="font-bold text-lg">Predicción de Aprobado</p>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Descubre tu probabilidad de aprobar basada en IA
          </p>
          <Link href="/precios?upgrade=pro">
            <Button>Desbloquear con Pro</Button>
          </Link>
        </div>
        <CardHeader>
          <CardTitle>Predicción ML</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/50 rounded" />
        </CardContent>
      </Card>
    )
  }

  // Calcular ángulo para el gauge (semi-círculo)
  const angle = (prediction.probabilidadAprobado / 100) * 180

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Predicción de Aprobado
              <span className="text-xl">{getEmoji(prediction.probabilidadAprobado)}</span>
            </CardTitle>
            <CardDescription>
              Basado en tu rendimiento y comparación con aprobados
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Confianza: {prediction.confianzaModelo}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gauge circular */}
        <div className="relative flex justify-center">
          <div className="relative w-48 h-24 overflow-hidden">
            {/* Fondo del gauge */}
            <div className="absolute inset-0 border-[16px] border-muted rounded-t-full border-b-0" />

            {/* Indicador de progreso */}
            <div
              className={`absolute inset-0 border-[16px] border-transparent rounded-t-full border-b-0 bg-gradient-to-r ${getGradient(prediction.probabilidadAprobado)}`}
              style={{
                clipPath: `polygon(0 100%, 0 0, 100% 0, 100% 100%)`,
                transform: `rotate(${angle - 180}deg)`,
                transformOrigin: 'bottom center',
                borderTopColor: 'currentColor',
                borderLeftColor: 'currentColor',
              }}
            />

            {/* Valor central */}
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <div className="text-center">
                <span className={`text-4xl font-bold ${getColorClass(prediction.probabilidadAprobado)}`}>
                  {prediction.probabilidadAprobado}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Escala */}
        <div className="flex justify-between text-xs text-muted-foreground px-4">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        {/* Estimación temporal */}
        {prediction.diasHastaListo > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Estimación para alcanzar 85%:</p>
            <p className="text-2xl font-bold mt-1">{prediction.diasHastaListo} días</p>
            <p className="text-xs text-muted-foreground">
              Fecha estimada: {new Date(prediction.fechaEstimadaListo).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        )}

        {prediction.diasHastaListo === 0 && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ¡Estás listo para el examen! 🎉
            </p>
          </div>
        )}

        {/* Factores */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Factores positivos */}
          {prediction.factoresPositivos.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-600 flex items-center gap-1">
                <span>✅</span> A tu favor
              </h4>
              <ul className="space-y-1">
                {prediction.factoresPositivos.map((factor, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Factores negativos */}
          {prediction.factoresNegativos.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-orange-600 flex items-center gap-1">
                <span>⚠️</span> A mejorar
              </h4>
              <ul className="space-y-1">
                {prediction.factoresNegativos.map((factor, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recomendaciones */}
        {prediction.recomendaciones.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <span>💡</span> Recomendaciones
            </h4>
            <ul className="space-y-2">
              {prediction.recomendaciones.map((rec, i) => (
                <li key={i} className="text-sm bg-primary/5 border border-primary/10 rounded-lg p-3">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
          * Predicción basada en modelo ML. Resultados orientativos.
        </p>
      </CardContent>
    </Card>
  )
}
