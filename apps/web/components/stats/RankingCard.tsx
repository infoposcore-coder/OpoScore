// ===========================================
// OpoMetrics - Tarjeta de Ranking
// Disponible para usuarios Básico+
// ===========================================

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RankingData {
  posicionGlobal: number
  totalUsuarios: number
  percentil: number
  posicionOposicion: number
  totalOposicion: number
  percentilOposicion: number
}

interface RankingCardProps {
  ranking: RankingData
  locked?: boolean
}

export function RankingCard({ ranking, locked = false }: RankingCardProps) {
  const getPercentilColor = (percentil: number) => {
    if (percentil >= 90) return 'bg-green-500'
    if (percentil >= 75) return 'bg-lime-500'
    if (percentil >= 50) return 'bg-yellow-500'
    if (percentil >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getPercentilLabel = (percentil: number) => {
    if (percentil >= 90) return 'Excelente'
    if (percentil >= 75) return 'Muy bueno'
    if (percentil >= 50) return 'Por encima de la media'
    if (percentil >= 25) return 'Por debajo de la media'
    return 'Necesitas mejorar'
  }

  const getMedal = (posicion: number) => {
    if (posicion === 1) return '🥇'
    if (posicion === 2) return '🥈'
    if (posicion === 3) return '🥉'
    if (posicion <= 10) return '🏆'
    return ''
  }

  if (locked) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <span className="text-4xl mb-2">🔒</span>
          <p className="font-medium">Tu Ranking</p>
          <p className="text-sm text-muted-foreground">Disponible en plan Básico</p>
        </div>
        <CardHeader>
          <CardTitle>Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted/50 rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Tu Ranking
          {getMedal(ranking.posicionGlobal)}
        </CardTitle>
        <CardDescription>
          Comparativa con otros opositores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ranking Global */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Ranking Global</span>
            <Badge variant="secondary" className={getPercentilColor(ranking.percentil)}>
              Top {100 - ranking.percentil}%
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">#{ranking.posicionGlobal}</span>
            <span className="text-muted-foreground">
              de {ranking.totalUsuarios.toLocaleString('es-ES')} opositores
            </span>
          </div>

          {/* Barra de percentil */}
          <div className="mt-3 relative">
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${getPercentilColor(ranking.percentil)} transition-all`}
                style={{ width: `${ranking.percentil}%` }}
              />
            </div>
            {/* Marcador de posición */}
            <div
              className="absolute top-0 w-1 h-4 bg-foreground rounded"
              style={{ left: `${ranking.percentil}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {getPercentilLabel(ranking.percentil)}
          </p>
        </div>

        {/* Ranking en tu oposición */}
        {ranking.posicionOposicion > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">En tu oposición</span>
              <Badge variant="outline">
                Top {100 - ranking.percentilOposicion}%
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">#{ranking.posicionOposicion}</span>
              <span className="text-sm text-muted-foreground">
                de {ranking.totalOposicion.toLocaleString('es-ES')}
              </span>
            </div>
          </div>
        )}

        {/* Mensaje motivacional */}
        <div className="pt-4 border-t text-center">
          {ranking.percentil >= 75 ? (
            <p className="text-sm text-green-600 font-medium">
              ¡Vas muy bien! Sigue así 🚀
            </p>
          ) : ranking.percentil >= 50 ? (
            <p className="text-sm text-yellow-600 font-medium">
              Buen progreso. ¡Puedes subir más! 💪
            </p>
          ) : (
            <p className="text-sm text-orange-600 font-medium">
              Cada día de estudio te acerca a tu meta 📚
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
