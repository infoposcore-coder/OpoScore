// ===========================================
// OpoScore - Análisis de Tendencias (BÁSICO)
// Muestra tendencias y medias móviles
// ===========================================

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { TrendResult, DailyDataPoint } from '@/lib/ml/types'

interface TrendAnalysisProps {
  trends: TrendResult
  dailyData: DailyDataPoint[]
  locked?: boolean
}

export function TrendAnalysis({ trends, dailyData, locked = false }: TrendAnalysisProps) {
  if (locked) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
          <span className="text-5xl mb-3">📈</span>
          <p className="font-bold text-lg">Análisis de Tendencias</p>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Media móvil, proyecciones y análisis de progreso
          </p>
          <Link href="/precios?upgrade=basico">
            <Button>Desbloquear con Básico</Button>
          </Link>
        </div>
        <CardHeader>
          <CardTitle>Tendencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted/50 rounded" />
        </CardContent>
      </Card>
    )
  }

  const trendDirection = trends.tendenciaLineal > 0.3
    ? 'subiendo'
    : trends.tendenciaLineal < -0.3
    ? 'bajando'
    : 'estable'

  const trendEmoji = trendDirection === 'subiendo' ? '📈' : trendDirection === 'bajando' ? '📉' : '➡️'
  const trendColor = trendDirection === 'subiendo'
    ? 'text-green-500'
    : trendDirection === 'bajando'
    ? 'text-red-500'
    : 'text-yellow-500'

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Análisis de Tendencias
                <Badge variant="secondary" className="text-xs">Básico</Badge>
              </CardTitle>
              <CardDescription>
                Evolución de tu rendimiento en el tiempo
              </CardDescription>
            </div>
            <div className={`text-3xl ${trendColor}`}>
              {trendEmoji}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Gráfico de tendencia simplificado */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Evolución últimos 30 días</div>
              <div className="h-32 flex items-end gap-0.5">
                {dailyData.slice(-30).map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                    style={{ height: `${Math.max(5, d.porcentaje)}%` }}
                    title={`${d.fecha}: ${d.porcentaje}%`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Hace 30 días</span>
                <span>Hoy</span>
              </div>
            </div>

            {/* Media Móvil */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Media 7 días</span>
                  <span className="text-xl font-bold">
                    {trends.mediaMovil7Dias.length > 0
                      ? `${trends.mediaMovil7Dias[trends.mediaMovil7Dias.length - 1]}%`
                      : '-'}
                  </span>
                </div>
                <div className="h-12 flex items-end gap-0.5">
                  {trends.mediaMovil7Dias.slice(-14).map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-400 rounded-t"
                      style={{ height: `${Math.max(5, v)}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Media 30 días</span>
                  <span className="text-xl font-bold">
                    {trends.mediaMovil30Dias.length > 0
                      ? `${trends.mediaMovil30Dias[trends.mediaMovil30Dias.length - 1]}%`
                      : '-'}
                  </span>
                </div>
                <div className="h-12 flex items-end gap-0.5">
                  {trends.mediaMovil30Dias.slice(-14).map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-purple-400 rounded-t"
                      style={{ height: `${Math.max(5, v)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tendencia y Proyecciones */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-3 border rounded-lg">
                <div className={`text-2xl font-bold ${trendColor}`}>
                  {trends.tendenciaLineal > 0 ? '+' : ''}{(trends.tendenciaLineal * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">tendencia diaria</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {trends.proyeccion7Dias}%
                </div>
                <div className="text-xs text-muted-foreground">proyección 7 días</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-purple-500">
                  {trends.proyeccion30Dias}%
                </div>
                <div className="text-xs text-muted-foreground">proyección 30 días</div>
              </div>
            </div>

            {/* Interpretación */}
            <div className={`p-4 rounded-lg ${
              trendDirection === 'subiendo'
                ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                : trendDirection === 'bajando'
                ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                : 'bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{trendEmoji}</span>
                <div>
                  <p className={`font-medium ${
                    trendDirection === 'subiendo'
                      ? 'text-green-700 dark:text-green-300'
                      : trendDirection === 'bajando'
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {trendDirection === 'subiendo'
                      ? '¡Tu rendimiento está mejorando!'
                      : trendDirection === 'bajando'
                      ? 'Tu rendimiento ha bajado últimamente'
                      : 'Tu rendimiento se mantiene estable'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    trendDirection === 'subiendo'
                      ? 'text-green-600/80 dark:text-green-400/80'
                      : trendDirection === 'bajando'
                      ? 'text-red-600/80 dark:text-red-400/80'
                      : 'text-yellow-600/80 dark:text-yellow-400/80'
                  }`}>
                    {trendDirection === 'subiendo'
                      ? 'Sigue así, cada día estás más cerca de aprobar.'
                      : trendDirection === 'bajando'
                      ? 'Intenta descansar y retomar con una rutina más regular.'
                      : 'Buen trabajo manteniendo el nivel. ¿Puedes subir un poco más?'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas detalladas por período */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Desglose por período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getPeriodsBreakdown(dailyData).map((period, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{period.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {period.preguntas} preguntas • {period.diasActivos} días activos
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{period.porcentaje}%</div>
                  <div className={`text-xs ${
                    period.cambio > 0
                      ? 'text-green-500'
                      : period.cambio < 0
                      ? 'text-red-500'
                      : 'text-muted-foreground'
                  }`}>
                    {period.cambio > 0 ? '+' : ''}{period.cambio}% vs anterior
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper para desglose por períodos
function getPeriodsBreakdown(dailyData: DailyDataPoint[]) {
  const periods = [
    { label: 'Última semana', days: 7 },
    { label: 'Últimas 2 semanas', days: 14 },
    { label: 'Último mes', days: 30 },
  ]

  let previousPorcentaje = 0

  return periods.map(period => {
    const data = dailyData.slice(-period.days)
    const preguntas = data.reduce((sum, d) => sum + d.preguntas, 0)
    const correctas = data.reduce((sum, d) => sum + d.correctas, 0)
    const porcentaje = preguntas > 0 ? Math.round((correctas / preguntas) * 100) : 0
    const diasActivos = data.filter(d => d.preguntas > 0).length
    const cambio = period.days === 7 ? 0 : porcentaje - previousPorcentaje

    previousPorcentaje = porcentaje

    return {
      label: period.label,
      preguntas,
      porcentaje,
      diasActivos,
      cambio,
    }
  })
}
