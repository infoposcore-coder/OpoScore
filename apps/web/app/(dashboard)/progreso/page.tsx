// ===========================================
// OpoMetrics - Página de Progreso con Métricas ML
// Visualización completa del progreso y predicciones
// ===========================================

'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScoreGauge } from '@/components/opometrics/ScoreGauge'
import { StreakFire } from '@/components/gamification/StreakFire'
import { AchievementGrid, ACHIEVEMENTS } from '@/components/gamification/AchievementBadge'
import { BasicStats } from '@/components/stats/BasicStats'
import { ProgressChart } from '@/components/stats/ProgressChart'
import { RankingCard } from '@/components/stats/RankingCard'
import { PredictionGauge } from '@/components/stats/PredictionGauge'
import { BloquesAnalysis } from '@/components/stats/BloquesAnalysis'
import { useStats } from '@/hooks/useStats'

export default function ProgresoPage() {
  const { stats, loading, error, plan } = useStats()

  // Determinar qué features están bloqueadas según el plan
  const isBasicOrHigher = plan !== 'free'
  const isProOrHigher = plan === 'pro' || plan === 'elite'
  const isElite = plan === 'elite'

  // Datos para el componente de stats básicas
  const basicStatsData = stats?.basic || {
    totalPreguntas: 0,
    totalCorrectas: 0,
    porcentajeGlobal: 0,
    testsCompletados: 0,
    rachaActual: 0,
    mejorRacha: 0,
    minutosEstudio: 0,
  }

  // Datos de ranking (con fallback)
  const rankingData = stats?.ranking || {
    posicionGlobal: 0,
    totalUsuarios: 0,
    percentil: 0,
    posicionOposicion: 0,
    totalOposicion: 0,
    percentilOposicion: 0,
  }

  // Datos de predicción (con fallback)
  const predictionData = stats?.prediction || {
    probabilidadAprobado: 0,
    confianzaModelo: 0,
    diasHastaListo: 0,
    fechaEstimadaListo: '',
    factoresPositivos: [],
    factoresNegativos: [],
    recomendaciones: [],
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-muted-foreground">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tu Progreso</h1>
          <p className="text-muted-foreground">
            Métricas detalladas y predicciones basadas en IA
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StreakFire
            days={basicStatsData.rachaActual}
            bestStreak={basicStatsData.mejorRacha}
            size="sm"
          />
          <ScoreGauge score={basicStatsData.porcentajeGlobal} size="md" />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Plan indicator */}
      <div className="flex items-center gap-2">
        <Badge variant={plan === 'elite' ? 'default' : plan === 'pro' ? 'secondary' : 'outline'}>
          Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </Badge>
        {plan === 'free' && (
          <span className="text-sm text-muted-foreground">
            Actualiza para ver más métricas
          </span>
        )}
      </div>

      {/* Estadísticas básicas - Todos */}
      <BasicStats stats={basicStatsData} />

      {/* Grid de métricas avanzadas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de evolución - Básico+ */}
        <ProgressChart
          data={stats?.daily || []}
          locked={!isBasicOrHigher}
        />

        {/* Ranking - Básico+ */}
        <RankingCard
          ranking={rankingData}
          locked={!isBasicOrHigher}
        />
      </div>

      {/* Predicción ML - Pro+ */}
      <PredictionGauge
        prediction={predictionData}
        locked={!isProOrHigher}
      />

      {/* Análisis por bloques - Pro+ */}
      <BloquesAnalysis
        bloques={stats?.bloques || []}
        locked={!isProOrHigher}
      />

      {/* Tabs adicionales */}
      <Tabs defaultValue="logros" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="logros">🏆 Logros</TabsTrigger>
          <TabsTrigger value="historial">📈 Historial</TabsTrigger>
          {isElite && <TabsTrigger value="elite">👑 Elite</TabsTrigger>}
        </TabsList>

        <TabsContent value="logros" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tus logros</CardTitle>
              <CardDescription>
                Completa retos para desbloquear badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AchievementGrid achievements={ACHIEVEMENTS} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de rendimiento</CardTitle>
              <CardDescription>
                Evolución de tu porcentaje de aciertos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.daily && stats.daily.length > 0 ? (
                <div className="space-y-4">
                  {stats.daily.slice(-10).reverse().map((day) => (
                    <div key={day.fecha} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-24">
                        {new Date(day.fecha).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            day.porcentaje >= 80 ? 'bg-green-500' :
                            day.porcentaje >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${day.porcentaje}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {day.porcentaje.toFixed(0)}%
                      </span>
                      <span className="text-xs text-muted-foreground w-20">
                        {day.preguntas} preg.
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay historial disponible todavía
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isElite && (
          <TabsContent value="elite" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>👑</span> Funciones Elite
                </CardTitle>
                <CardDescription>
                  Herramientas exclusivas para tu preparación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan de estudio personalizado */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <span>📚</span> Plan de Estudio Semanal
                  </h4>
                  {stats?.prediction && stats.prediction.recomendaciones.length > 0 ? (
                    <ul className="space-y-2">
                      {stats.prediction.recomendaciones.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">▸</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Completa más tests para generar recomendaciones personalizadas.
                    </p>
                  )}
                </div>

                {/* Comparativa detallada */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <span>📊</span> Tu perfil vs Aprobados
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="bg-muted/50 rounded p-3">
                      <p className="text-xs text-muted-foreground">Minutos/día promedio</p>
                      <p className="text-lg font-bold">
                        {stats?.features?.minutosEstudioDiarioPromedio?.toFixed(0) || 0} min
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aprobados: 45-60 min
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <p className="text-xs text-muted-foreground">Días activo/mes</p>
                      <p className="text-lg font-bold">
                        {stats?.features?.diasActivo || 0} días
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aprobados: 25+ días
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <p className="text-xs text-muted-foreground">Consistencia</p>
                      <p className="text-lg font-bold">
                        {basicStatsData.rachaActual} días racha
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aprobados: 15+ días
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <p className="text-xs text-muted-foreground">Tendencia</p>
                      <p className={`text-lg font-bold ${
                        (stats?.features?.tendenciaMejora || 0) > 0 ? 'text-green-500' : 'text-orange-500'
                      }`}>
                        {(stats?.features?.tendenciaMejora || 0) > 0 ? '+' : ''}
                        {stats?.features?.tendenciaMejora?.toFixed(1) || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        vs semana anterior
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Mensaje motivacional */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {basicStatsData.porcentajeGlobal >= 80 ? '🎯' :
               basicStatsData.porcentajeGlobal >= 60 ? '💪' : '📚'}
            </div>
            <div>
              <p className="font-medium">
                {basicStatsData.porcentajeGlobal >= 80
                  ? '¡Excelente trabajo! Estás en el camino correcto.'
                  : basicStatsData.porcentajeGlobal >= 60
                  ? 'Buen progreso. ¡Sigue practicando!'
                  : 'Cada pregunta te acerca más a tu meta. ¡No te rindas!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {basicStatsData.testsCompletados > 0
                  ? `Has completado ${basicStatsData.testsCompletados} tests. La constancia es la clave.`
                  : 'Empieza haciendo un test hoy para ver tu progreso.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
