// ===========================================
// OpoScore - Dashboard Charts
// Componente cliente para graficos del dashboard
// ===========================================

'use client'

import { useMemo } from 'react'
import dayjs from 'dayjs'
import { WeeklyProgressChart } from '@/components/charts/WeeklyProgressChart'
import { TopicRadarChart } from '@/components/charts/TopicRadarChart'
import { ActivityHeatmap, generateActivityData } from '@/components/charts/ActivityHeatmap'
import { AchievementGrid } from '@/components/gamification/AchievementBadge'
import { StreakFire } from '@/components/gamification/StreakFire'
import { StatsCard, StatsGrid } from '@/components/ui/stats-card'

// Datos mock para graficos
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
  { tema: 'Constitucion', dominio: 85, fullMark: 100 },
  { tema: 'Procedimiento', dominio: 62, fullMark: 100 },
  { tema: 'Organizacion', dominio: 78, fullMark: 100 },
  { tema: 'Personal', dominio: 45, fullMark: 100 },
  { tema: 'Contratos', dominio: 70, fullMark: 100 },
  { tema: 'Ofimatica', dominio: 90, fullMark: 100 },
]

interface DashboardChartsProps {
  opoScore?: number
  rachaActual?: number
  mejorRacha?: number
  testsCompletados?: number
  flashcardsPendientes?: number
}

export function DashboardCharts({
  opoScore = 67,
  rachaActual = 5,
  mejorRacha = 12,
  testsCompletados = 23,
  flashcardsPendientes = 8,
}: DashboardChartsProps) {
  // Generar datos de actividad
  const activityData = useMemo(() => generateActivityData(84), [])

  return (
    <div className="space-y-6">
      {/* Stats Cards Premium */}
      <StatsGrid columns={4}>
        <StatsCard
          title="Tests esta semana"
          value={testsCompletados}
          description="Completados"
          color="primary"
          trend={15}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatsCard
          title="Flashcards pendientes"
          value={flashcardsPendientes}
          description="Para hoy"
          color="warning"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatsCard
          title="Tiempo hoy"
          value={45}
          suffix=" min"
          description="de estudio"
          color="success"
          trend={8}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Aciertos"
          value={78}
          suffix="%"
          description="Promedio semanal"
          color="primary"
          trend={5}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </StatsGrid>

      {/* Racha animada */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl p-4 border border-orange-500/20">
        <StreakFire days={rachaActual} bestStreak={mejorRacha} size="md" />
      </div>

      {/* Graficos principales */}
      <div className="grid gap-6 md:grid-cols-2">
        <WeeklyProgressChart data={weeklyData} />
        <TopicRadarChart data={topicData} />
      </div>

      {/* Heatmap de actividad */}
      <ActivityHeatmap data={activityData} />

      {/* Logros */}
      <div className="bg-card border rounded-xl p-4">
        <AchievementGrid />
      </div>
    </div>
  )
}
