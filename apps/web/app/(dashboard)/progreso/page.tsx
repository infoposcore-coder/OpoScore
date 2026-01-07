// ===========================================
// OpoScore - Página de Progreso Mejorada
// Visualización completa del progreso
// ===========================================

'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScoreGauge } from '@/components/oposcore/ScoreGauge'
import { StreakFire } from '@/components/gamification/StreakFire'
import { WeeklyProgressChart } from '@/components/charts/WeeklyProgressChart'
import { TopicRadarChart } from '@/components/charts/TopicRadarChart'
import { ActivityHeatmap, generateActivityData } from '@/components/charts/ActivityHeatmap'
import { AchievementGrid, ACHIEVEMENTS } from '@/components/gamification/AchievementBadge'
import dayjs from 'dayjs'

// Mock data
const weeklyData = [
  { dia: 'Lun', score: 62, tests: 3, minutos: 45 },
  { dia: 'Mar', score: 65, tests: 4, minutos: 60 },
  { dia: 'Mie', score: 64, tests: 2, minutos: 30 },
  { dia: 'Jue', score: 68, tests: 5, minutos: 75 },
  { dia: 'Vie', score: 67, tests: 3, minutos: 50 },
  { dia: 'Sab', score: 70, tests: 6, minutos: 90 },
  { dia: 'Dom', score: 72, tests: 4, minutos: 55 },
]

const topicData = [
  { tema: 'Constitución', dominio: 85, fullMark: 100 },
  { tema: 'Procedimiento', dominio: 62, fullMark: 100 },
  { tema: 'Organización', dominio: 78, fullMark: 100 },
  { tema: 'Personal', dominio: 45, fullMark: 100 },
  { tema: 'Contratos', dominio: 70, fullMark: 100 },
  { tema: 'Ofimática', dominio: 90, fullMark: 100 },
]

const HISTORIAL_OPOSCORE = [
  { fecha: '2024-11-15', score: 0 },
  { fecha: '2024-11-22', score: 15 },
  { fecha: '2024-11-29', score: 28 },
  { fecha: '2024-12-06', score: 35 },
  { fecha: '2024-12-13', score: 42 },
  { fecha: '2024-12-20', score: 48 },
  { fecha: '2024-12-27', score: 55 },
  { fecha: '2025-01-03', score: 62 },
  { fecha: '2025-01-10', score: 67 },
]

export default function ProgresoPage() {
  const opoScoreActual = 67
  const opoScoreMeta = 85
  const diasHastaExamen = 45
  const rachaActual = 12
  const mejorRacha = 23

  // Generar datos de actividad
  const activityData = useMemo(() => generateActivityData(84), [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tu progreso</h1>
          <p className="text-muted-foreground">
            Visualiza tu evolución y mantén el ritmo
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StreakFire days={rachaActual} bestStreak={mejorRacha} size="sm" />
          <ScoreGauge score={opoScoreActual} size="md" />
        </div>
      </div>

      {/* Resumen principal */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Objetivo: OpoScore 85</CardTitle>
            <CardDescription>
              Te faltan {opoScoreMeta - opoScoreActual} puntos para estar listo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso hacia la meta</span>
                  <span className="font-medium">{Math.round((opoScoreActual / opoScoreMeta) * 100)}%</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(opoScoreActual / opoScoreMeta) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>OpoScore actual: {opoScoreActual}</span>
                  <span>Meta: {opoScoreMeta}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">{diasHastaExamen}</div>
            <div className="text-muted-foreground mb-4">días hasta el examen</div>
            <Badge variant="outline" className="text-xs">
              Convocatoria: Feb 2025
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de metricas */}
      <Tabs defaultValue="semanal" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="semanal">📊 Semanal</TabsTrigger>
          <TabsTrigger value="temas">🎯 Por temas</TabsTrigger>
          <TabsTrigger value="actividad">📅 Actividad</TabsTrigger>
          <TabsTrigger value="logros">🏆 Logros</TabsTrigger>
        </TabsList>

        <TabsContent value="semanal" className="mt-4">
          <WeeklyProgressChart data={weeklyData} />
        </TabsContent>

        <TabsContent value="temas" className="mt-4">
          <TopicRadarChart data={topicData} />
        </TabsContent>

        <TabsContent value="actividad" className="mt-4">
          <ActivityHeatmap data={activityData} />
        </TabsContent>

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
      </Tabs>

      {/* Historial de OpoScore */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolución de tu OpoScore</CardTitle>
          <CardDescription>
            Tu progreso desde que empezaste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {HISTORIAL_OPOSCORE.map((punto, i) => (
              <motion.div
                key={punto.fecha}
                className="flex-1 flex flex-col items-center"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-sm min-h-[4px]"
                  style={{ height: `${Math.max((punto.score / 100) * 100, 4)}px` }}
                />
                <span className="text-xs text-muted-foreground mt-1">
                  {dayjs(punto.fecha).format('D/M')}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats rapidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Tests completados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-500">78%</div>
            <div className="text-sm text-muted-foreground">Tasa de aciertos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-500">87h</div>
            <div className="text-sm text-muted-foreground">Tiempo de estudio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-purple-500">8</div>
            <div className="text-sm text-muted-foreground">Temas dominados</div>
          </CardContent>
        </Card>
      </div>

      {/* Consejo motivacional */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <p className="font-medium">
                A tu ritmo actual, alcanzarás OpoScore 85 en aproximadamente 3 semanas
              </p>
              <p className="text-sm text-muted-foreground">
                ¡Sigue así! La constancia es la clave del éxito.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
