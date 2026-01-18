// ===========================================
// OpoMetrics - Análisis por Bloques
// Disponible para usuarios Pro+
// ===========================================

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BloqueStats {
  bloqueId: string
  bloqueNombre: string
  totalPreguntas: number
  correctas: number
  porcentaje: number
  mediaPlataforma: number
  diferencia: number
  estado: 'dominado' | 'avanzado' | 'progreso' | 'debil' | 'critico'
}

interface BloquesAnalysisProps {
  bloques: BloqueStats[]
  oposicionSlug?: string
  locked?: boolean
}

export function BloquesAnalysis({ bloques, oposicionSlug, locked = false }: BloquesAnalysisProps) {
  const getEstadoConfig = (estado: BloqueStats['estado']) => {
    switch (estado) {
      case 'dominado':
        return { color: 'bg-green-500', text: 'text-green-700', badge: 'Dominado', emoji: '🏆' }
      case 'avanzado':
        return { color: 'bg-lime-500', text: 'text-lime-700', badge: 'Avanzado', emoji: '✨' }
      case 'progreso':
        return { color: 'bg-yellow-500', text: 'text-yellow-700', badge: 'En progreso', emoji: '📈' }
      case 'debil':
        return { color: 'bg-orange-500', text: 'text-orange-700', badge: 'Débil', emoji: '⚠️' }
      case 'critico':
        return { color: 'bg-red-500', text: 'text-red-700', badge: 'Crítico', emoji: '🔴' }
    }
  }

  if (locked) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
          <span className="text-5xl mb-3">📊</span>
          <p className="font-bold text-lg">Análisis por Bloques</p>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Compara tu rendimiento en cada tema con la media
          </p>
          <Link href="/precios?upgrade=pro">
            <Button>Desbloquear con Pro</Button>
          </Link>
        </div>
        <CardHeader>
          <CardTitle>Análisis por Bloques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/50 rounded" />
        </CardContent>
      </Card>
    )
  }

  // Ordenar por prioridad (peores primero)
  const bloquesSorted = [...bloques].sort((a, b) => a.porcentaje - b.porcentaje)

  // Identificar puntos débiles
  const puntosDebiles = bloquesSorted.filter(b => b.estado === 'debil' || b.estado === 'critico')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis por Bloques</CardTitle>
        <CardDescription>
          Tu rendimiento comparado con la media de la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alerta de puntos débiles */}
        {puntosDebiles.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h4 className="font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2 mb-2">
              <span>⚠️</span> Puntos débiles detectados
            </h4>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Tienes {puntosDebiles.length} bloque{puntosDebiles.length > 1 ? 's' : ''} que necesita{puntosDebiles.length > 1 ? 'n' : ''} atención:
              {' '}<strong>{puntosDebiles.map(b => b.bloqueNombre).join(', ')}</strong>
            </p>
          </div>
        )}

        {/* Lista de bloques */}
        <div className="space-y-4">
          {bloques.map((bloque) => {
            const config = getEstadoConfig(bloque.estado)

            return (
              <div
                key={bloque.bloqueId}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.emoji}</span>
                    <div>
                      <h4 className="font-medium">{bloque.bloqueNombre}</h4>
                      <p className="text-sm text-muted-foreground">
                        {bloque.totalPreguntas} preguntas respondidas
                      </p>
                    </div>
                  </div>
                  <Badge className={`${config.color} text-white`}>
                    {config.badge}
                  </Badge>
                </div>

                {/* Barra de progreso comparativa */}
                <div className="space-y-2">
                  {/* Tu porcentaje */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-20 text-right">Tú</span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${config.color} transition-all`}
                        style={{ width: `${bloque.porcentaje}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold w-12 ${config.text}`}>
                      {bloque.porcentaje}%
                    </span>
                  </div>

                  {/* Media plataforma */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-20 text-right text-muted-foreground">Media</span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-muted-foreground/30 transition-all"
                        style={{ width: `${bloque.mediaPlataforma}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {bloque.mediaPlataforma}%
                    </span>
                  </div>
                </div>

                {/* Diferencia */}
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    bloque.diferencia > 0 ? 'text-green-600' : bloque.diferencia < 0 ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {bloque.diferencia > 0 ? '+' : ''}{bloque.diferencia}% vs media
                  </span>

                  {oposicionSlug && (bloque.estado === 'debil' || bloque.estado === 'critico') && (
                    <Link href={`/estudiar/${oposicionSlug}?bloque=${bloque.bloqueId}`}>
                      <Button size="sm" variant="outline">
                        Practicar
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {bloques.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aún no hay datos suficientes para analizar.</p>
            <p className="text-sm">Completa más tests para ver el análisis.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
