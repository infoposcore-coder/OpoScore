// ===========================================
// OpoMetrics - Weekly Progress Chart
// Grafico de progreso semanal con Recharts
// ===========================================

'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DayData {
  dia: string
  score: number
  tests: number
  minutos: number
}

interface WeeklyProgressChartProps {
  data: DayData[]
  metaDiaria?: number
  className?: string
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: DayData }>; label?: string }) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium mb-2">{label}</p>
      <div className="space-y-1 text-muted-foreground">
        <p>OpoMetrics: <span className="text-foreground font-medium">{data.score}</span></p>
        <p>Tests: <span className="text-foreground font-medium">{data.tests}</span></p>
        <p>Tiempo: <span className="text-foreground font-medium">{data.minutos} min</span></p>
      </div>
    </div>
  )
}

export function WeeklyProgressChart({
  data,
  metaDiaria = 60,
  className
}: WeeklyProgressChartProps) {
  const promedio = useMemo(() => {
    if (!data.length) return 0
    return Math.round(data.reduce((acc, d) => acc + d.score, 0) / data.length)
  }, [data])

  const tendencia = useMemo(() => {
    if (data.length < 2) return 0
    const primera = data[0].score
    const ultima = data[data.length - 1].score
    return ultima - primera
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Progreso semanal</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tu evolucion de los ultimos 7 dias
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl text-primary">{promedio}</div>
              <div className="text-muted-foreground text-xs">Promedio</div>
            </div>
            <div className="text-center">
              <div className={`font-bold text-2xl ${tendencia >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tendencia >= 0 ? '+' : ''}{tendencia}
              </div>
              <div className="text-muted-foreground text-xs">Tendencia</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={85} stroke="oklch(0.65 0.2 145)" strokeDasharray="5 5" />
              <Area
                type="monotone"
                dataKey="score"
                stroke="oklch(0.55 0.2 250)"
                strokeWidth={2}
                fill="url(#scoreGradient)"
                dot={{ fill: 'oklch(0.55 0.2 250)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'oklch(0.55 0.2 250)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              OpoMetrics
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-500 border-dashed border-green-500" />
              Meta: 85
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
