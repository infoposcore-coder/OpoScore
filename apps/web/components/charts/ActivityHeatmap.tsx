// ===========================================
// OpoScore - Activity Heatmap
// Heatmap estilo GitHub de actividad de estudio
// ===========================================

'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ActivityDay {
  date: string
  count: number
  minutes: number
}

interface ActivityHeatmapProps {
  data: ActivityDay[]
  className?: string
}

const LEVELS = [
  { min: 0, max: 0, color: 'bg-muted', label: 'Sin actividad' },
  { min: 1, max: 15, color: 'bg-green-200 dark:bg-green-900', label: '1-15 min' },
  { min: 16, max: 30, color: 'bg-green-300 dark:bg-green-700', label: '16-30 min' },
  { min: 31, max: 60, color: 'bg-green-400 dark:bg-green-600', label: '31-60 min' },
  { min: 61, max: Infinity, color: 'bg-green-500 dark:bg-green-500', label: '+60 min' },
]

function getLevel(minutes: number) {
  return LEVELS.find(l => minutes >= l.min && minutes <= l.max) || LEVELS[0]
}

export function ActivityHeatmap({ data, className }: ActivityHeatmapProps) {
  const weeks = useMemo(() => {
    const today = dayjs()
    const startDate = today.subtract(11, 'week').startOf('week')
    const weeksData: { days: (ActivityDay | null)[] }[] = []

    for (let w = 0; w < 12; w++) {
      const weekDays: (ActivityDay | null)[] = []
      for (let d = 0; d < 7; d++) {
        const date = startDate.add(w, 'week').add(d, 'day')
        if (date.isAfter(today)) {
          weekDays.push(null)
        } else {
          const found = data.find(item => item.date === date.format('YYYY-MM-DD'))
          weekDays.push(found || { date: date.format('YYYY-MM-DD'), count: 0, minutes: 0 })
        }
      }
      weeksData.push({ days: weekDays })
    }

    return weeksData
  }, [data])

  const totalMinutos = useMemo(() => {
    return data.reduce((acc, d) => acc + d.minutes, 0)
  }, [data])

  const diasActivos = useMemo(() => {
    return data.filter(d => d.minutes > 0).length
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className={className}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Actividad de estudio</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ultimas 12 semanas
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-xl">{Math.round(totalMinutos / 60)}h</div>
                <div className="text-muted-foreground text-xs">Total</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">{diasActivos}</div>
                <div className="text-muted-foreground text-xs">Dias activos</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.days.map((day, di) => (
                    <Tooltip key={di}>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-3 h-3 rounded-sm ${
                            day ? getLevel(day.minutes).color : 'bg-transparent'
                          } transition-colors cursor-pointer hover:ring-2 hover:ring-primary/50`}
                        />
                      </TooltipTrigger>
                      {day && (
                        <TooltipContent>
                          <p className="font-medium">{dayjs(day.date).format('D MMM YYYY')}</p>
                          <p className="text-muted-foreground">
                            {day.minutes > 0 ? `${day.minutes} minutos` : 'Sin actividad'}
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </TooltipProvider>

          {/* Leyenda */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
            <span>Menos</span>
            {LEVELS.map((level, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${level.color}`} title={level.label} />
            ))}
            <span>Mas</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Funcion para generar datos mock de actividad
export function generateActivityData(days: number = 84): ActivityDay[] {
  const data: ActivityDay[] = []
  const today = dayjs()

  for (let i = days - 1; i >= 0; i--) {
    const date = today.subtract(i, 'day').format('YYYY-MM-DD')
    const minutes = Math.random() > 0.3 ? Math.floor(Math.random() * 120) : 0
    data.push({
      date,
      count: minutes > 0 ? Math.ceil(minutes / 30) : 0,
      minutes
    })
  }

  return data
}
