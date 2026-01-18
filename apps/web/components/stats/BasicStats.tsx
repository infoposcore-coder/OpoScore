// ===========================================
// OpoMetrics - Componente de Estadísticas Básicas
// Disponible para todos los usuarios
// ===========================================

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BasicStatsProps {
  stats: {
    totalPreguntas: number
    totalCorrectas: number
    porcentajeGlobal: number
    testsCompletados: number
    rachaActual: number
    mejorRacha: number
    minutosEstudio: number
  }
}

export function BasicStats({ stats }: BasicStatsProps) {
  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins} min`
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Porcentaje de aciertos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Porcentaje de Aciertos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {stats.porcentajeGlobal.toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground">
              {stats.totalCorrectas}/{stats.totalPreguntas}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min(stats.porcentajeGlobal, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tests completados */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tests Completados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.testsCompletados}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.totalPreguntas} preguntas totales
          </p>
        </CardContent>
      </Card>

      {/* Racha */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Racha de Estudio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{stats.rachaActual}</span>
            <span className="text-lg">
              {stats.rachaActual >= 7 ? '🔥' : stats.rachaActual >= 3 ? '✨' : '💪'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Mejor: {stats.mejorRacha} días
          </p>
        </CardContent>
      </Card>

      {/* Tiempo de estudio */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tiempo de Estudio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatMinutes(stats.minutosEstudio)}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Tiempo total acumulado
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
