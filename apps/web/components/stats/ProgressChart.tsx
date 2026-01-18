// ===========================================
// OpoMetrics - Gráfico de Progreso
// Disponible para usuarios Básico+
// ===========================================

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useMemo } from 'react'

interface DailyStats {
  fecha: string
  preguntas: number
  correctas: number
  porcentaje: number
  minutos: number
}

interface ProgressChartProps {
  data: DailyStats[]
  locked?: boolean
}

export function ProgressChart({ data, locked = false }: ProgressChartProps) {
  // Calcular valores para el gráfico
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    const maxPorcentaje = Math.max(...data.map(d => d.porcentaje), 100)

    return data.map(d => ({
      ...d,
      heightPercent: (d.porcentaje / maxPorcentaje) * 100,
      label: new Date(d.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    }))
  }, [data])

  // Calcular tendencia
  const tendencia = useMemo(() => {
    if (data.length < 7) return 0
    const ultimos7 = data.slice(-7)
    const anteriores7 = data.slice(-14, -7)

    const promedioUltimos = ultimos7.reduce((sum, d) => sum + d.porcentaje, 0) / ultimos7.length
    const promedioAnteriores = anteriores7.length > 0
      ? anteriores7.reduce((sum, d) => sum + d.porcentaje, 0) / anteriores7.length
      : promedioUltimos

    return promedioUltimos - promedioAnteriores
  }, [data])

  if (locked) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <span className="text-4xl mb-2">🔒</span>
          <p className="font-medium">Gráfico de Evolución</p>
          <p className="text-sm text-muted-foreground">Disponible en plan Básico</p>
        </div>
        <CardHeader>
          <CardTitle>Evolución del Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted/50 rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Evolución del Rendimiento</CardTitle>
            <CardDescription>Últimos {data.length} días</CardDescription>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            tendencia > 0 ? 'text-green-600' : tendencia < 0 ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {tendencia > 0 ? '📈' : tendencia < 0 ? '📉' : '➡️'}
            {tendencia > 0 ? '+' : ''}{tendencia.toFixed(1)}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <p>No hay datos suficientes todavía</p>
          </div>
        ) : (
          <div className="h-48 flex items-end gap-1">
            {chartData.map((d, i) => (
              <div
                key={d.fecha}
                className="flex-1 flex flex-col items-center gap-1 group relative"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground border rounded-lg shadow-lg p-2 text-xs whitespace-nowrap z-20">
                  <p className="font-medium">{d.label}</p>
                  <p>{d.porcentaje.toFixed(1)}% aciertos</p>
                  <p>{d.preguntas} preguntas</p>
                </div>

                {/* Barra */}
                <div
                  className={`w-full rounded-t transition-all hover:opacity-80 ${
                    d.porcentaje >= 80 ? 'bg-green-500' :
                    d.porcentaje >= 60 ? 'bg-yellow-500' :
                    d.porcentaje >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ height: `${Math.max(d.heightPercent, 5)}%` }}
                />

                {/* Etiqueta (solo algunos) */}
                {(i === 0 || i === chartData.length - 1 || i % 7 === 0) && (
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                    {d.label.split(' ')[0]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Leyenda */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>≥80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>60-79%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>40-59%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>&lt;40%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
