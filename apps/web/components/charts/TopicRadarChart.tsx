// ===========================================
// OpoMetrics - Topic Radar Chart
// Grafico radar de dominio por temas
// ===========================================

'use client'

import { motion } from 'framer-motion'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TopicData {
  tema: string
  dominio: number
  fullMark: number
}

interface TopicRadarChartProps {
  data: TopicData[]
  className?: string
}

export function TopicRadarChart({ data, className }: TopicRadarChartProps) {
  // Encontrar tema mas debil y mas fuerte
  const temaDebil = data.reduce((min, d) => d.dominio < min.dominio ? d : min, data[0])
  const temaFuerte = data.reduce((max, d) => d.dominio > max.dominio ? d : max, data[0])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dominio por tema</CardTitle>
          <p className="text-sm text-muted-foreground">
            Identifica tus puntos fuertes y debiles
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis
                dataKey="tema"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Dominio"
                dataKey="dominio"
                stroke="oklch(0.55 0.2 250)"
                fill="oklch(0.55 0.2 250)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const tooltipData = payload[0].payload as TopicData
                  return (
                    <div className="bg-card border rounded-lg shadow-lg p-2 text-sm">
                      <p className="font-medium">{tooltipData.tema}</p>
                      <p className="text-muted-foreground">
                        Dominio: <span className="text-foreground">{tooltipData.dominio}%</span>
                      </p>
                    </div>
                  )
                }}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-600 font-medium text-xs mb-1">Necesita repaso</p>
              <p className="font-medium">{temaDebil?.tema}</p>
              <p className="text-muted-foreground text-xs">{temaDebil?.dominio}% dominio</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-green-600 font-medium text-xs mb-1">Tu punto fuerte</p>
              <p className="font-medium">{temaFuerte?.tema}</p>
              <p className="text-muted-foreground text-xs">{temaFuerte?.dominio}% dominio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
