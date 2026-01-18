// ===========================================
// OpoMetrics - Predicción Avanzada (ELITE)
// Muestra predicciones con Random Forest/XGBoost
// ===========================================

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import type { AdvancedPrediction as AdvancedPredictionType } from '@/lib/ml/types'

interface AdvancedPredictionProps {
  prediction: AdvancedPredictionType
  locked?: boolean
}

export function AdvancedPrediction({ prediction, locked = false }: AdvancedPredictionProps) {
  if (locked) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
          <span className="text-5xl mb-3">🧠</span>
          <p className="font-bold text-lg">Predicción con IA Avanzada</p>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Random Forest, XGBoost y Ensemble de modelos
          </p>
          <Link href="/precios?upgrade=elite">
            <Button>Desbloquear con Elite</Button>
          </Link>
        </div>
        <CardHeader>
          <CardTitle>Predicción ML Avanzada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted/50 rounded" />
        </CardContent>
      </Card>
    )
  }

  const { randomForest, gradientBoosting, ensemble, escenarios } = prediction

  return (
    <div className="space-y-6">
      {/* Ensemble Principal */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Predicción Ensemble
                <Badge variant="secondary" className="text-xs">Elite</Badge>
              </CardTitle>
              <CardDescription>
                Combinación de múltiples modelos de ML
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                {ensemble.probabilidadFinal}%
              </div>
              <div className="text-sm text-muted-foreground">
                Confianza: {ensemble.confianzaFinal}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de probabilidad */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Probabilidad de aprobar</span>
                <span className="font-medium">{ensemble.probabilidadFinal}%</span>
              </div>
              <Progress value={ensemble.probabilidadFinal} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Intervalo: {prediction.intervaloConfianza.inferior}% - {prediction.intervaloConfianza.superior}%</span>
                <span>{ensemble.metodosAcuerdo}% modelos coinciden</span>
              </div>
            </div>

            {/* Indicadores */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{prediction.diasHastaListo}</div>
                <div className="text-xs text-muted-foreground">días hasta listo</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{prediction.velocidadMejora}%</div>
                <div className="text-xs text-muted-foreground">mejora por día</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modelos Individuales */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Random Forest */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">🌲</span>
              Random Forest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{randomForest.probabilidad}%</span>
                <Badge variant="outline" className="text-xs">
                  {randomForest.arbolesAcuerdo}% árboles
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground mb-1">Importancia de features:</div>
                {Object.entries(randomForest.importanciaFeatures)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([feature, importance]) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-24 text-xs truncate">{formatFeatureName(feature)}</div>
                      <Progress value={importance} className="h-1.5 flex-1" />
                      <div className="text-xs w-8">{importance}%</div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gradient Boosting */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">🚀</span>
              XGBoost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{gradientBoosting.probabilidad}%</span>
                <Badge variant="outline" className="text-xs">
                  Confianza: {gradientBoosting.confianza}%
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground mb-1">Gain por feature:</div>
                {Object.entries(gradientBoosting.gainFeatures)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([feature, gain]) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-24 text-xs truncate">{formatFeatureName(feature)}</div>
                      <Progress value={gain} className="h-1.5 flex-1" />
                      <div className="text-xs w-8">{gain}%</div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Escenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-lg">🎭</span>
            Análisis de Escenarios
          </CardTitle>
          <CardDescription>
            Proyecciones basadas en diferentes ritmos de estudio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Optimista */}
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>🌟</span>
                <span className="font-medium text-green-700 dark:text-green-300">Optimista</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {escenarios.optimista.probabilidad}%
              </div>
              <div className="text-xs text-green-600/80 dark:text-green-400/80">
                en {escenarios.optimista.diasHastaListo} días
              </div>
              <ul className="mt-2 text-xs text-green-700/70 dark:text-green-300/70 space-y-0.5">
                {escenarios.optimista.condiciones.slice(0, 2).map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>

            {/* Realista */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>📊</span>
                <span className="font-medium text-blue-700 dark:text-blue-300">Realista</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {escenarios.realista.probabilidad}%
              </div>
              <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
                en {escenarios.realista.diasHastaListo} días
              </div>
              <ul className="mt-2 text-xs text-blue-700/70 dark:text-blue-300/70 space-y-0.5">
                {escenarios.realista.condiciones.slice(0, 2).map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>

            {/* Pesimista */}
            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>⚠️</span>
                <span className="font-medium text-orange-700 dark:text-orange-300">Pesimista</span>
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {escenarios.pesimista.probabilidad}%
              </div>
              <div className="text-xs text-orange-600/80 dark:text-orange-400/80">
                en {escenarios.pesimista.diasHastaListo} días
              </div>
              <ul className="mt-2 text-xs text-orange-700/70 dark:text-orange-300/70 space-y-0.5">
                {escenarios.pesimista.condiciones.slice(0, 2).map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temas Problemáticos */}
      {prediction.temasProblematicos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Temas a Priorizar
            </CardTitle>
            <CardDescription>
              Ordenados por impacto en tu probabilidad de aprobar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prediction.temasProblematicos.slice(0, 5).map((tema, i) => (
                <div key={tema.temaId} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPriorityColor(tema.prioridad)}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{tema.temaNombre}</div>
                    <div className="text-xs text-muted-foreground">
                      {tema.porcentajeActual}% actual • {tema.horasEstimadasRecuperacion}h para recuperar
                    </div>
                  </div>
                  <Badge variant={getPriorityVariant(tema.prioridad)}>
                    {tema.prioridad}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helpers
function formatFeatureName(feature: string): string {
  const names: Record<string, string> = {
    porcentajeGlobal: '% Global',
    porcentajeReciente: '% Reciente',
    consistencia: 'Consistencia',
    diasActivos: 'Días activos',
    volumen: 'Volumen',
    cobertura: 'Cobertura',
    simulacros: 'Simulacros',
    tendencia: 'Tendencia',
  }
  return names[feature] || feature
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critica': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    case 'alta': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    case 'media': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
    default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  }
}

function getPriorityVariant(priority: string): 'destructive' | 'outline' | 'secondary' {
  switch (priority) {
    case 'critica': return 'destructive'
    case 'alta': return 'destructive'
    default: return 'outline'
  }
}
