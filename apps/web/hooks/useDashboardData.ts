// ===========================================
// OpoMetrics - Hook para datos del Dashboard
// ===========================================

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

interface DashboardStats {
  opoMetrics: number
  opoMetricsChange: number
  racha: number
  mejorRacha: number
  testsHoy: number
  testsTotal: number
  aciertosHoy: number
  minutosHoy: number
  temasCompletados: number
  totalTemas: number
  proximoRepaso: number
}

interface RecentTest {
  id: string
  fecha: string
  tema: string
  aciertos: number
  total: number
}

interface DashboardData {
  stats: DashboardStats
  recentTests: RecentTest[]
  weeklyProgress: { dia: string; score: number; tests: number }[]
}

// Datos mock para modo demo
const MOCK_DATA: DashboardData = {
  stats: {
    opoMetrics: 67,
    opoMetricsChange: 5,
    racha: 12,
    mejorRacha: 23,
    testsHoy: 3,
    testsTotal: 156,
    aciertosHoy: 85,
    minutosHoy: 45,
    temasCompletados: 8,
    totalTemas: 25,
    proximoRepaso: 15,
  },
  recentTests: [
    { id: '1', fecha: new Date().toISOString(), tema: 'Constitución Española', aciertos: 8, total: 10 },
    { id: '2', fecha: new Date(Date.now() - 86400000).toISOString(), tema: 'Procedimiento Administrativo', aciertos: 7, total: 10 },
    { id: '3', fecha: new Date(Date.now() - 172800000).toISOString(), tema: 'Organización del Estado', aciertos: 9, total: 10 },
  ],
  weeklyProgress: [
    { dia: 'Lun', score: 62, tests: 3 },
    { dia: 'Mar', score: 65, tests: 4 },
    { dia: 'Mié', score: 64, tests: 2 },
    { dia: 'Jue', score: 68, tests: 5 },
    { dia: 'Vie', score: 67, tests: 3 },
    { dia: 'Sáb', score: 70, tests: 6 },
    { dia: 'Dom', score: 72, tests: 4 },
  ],
}

export function useDashboardData() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async (): Promise<DashboardData> => {
      // Verificar si estamos en modo demo
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return MOCK_DATA
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return MOCK_DATA
      }

      try {
        // Obtener estadísticas del usuario
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any
        const [
          { data: profile },
          { data: racha },
          { data: tests },
          { data: metricasHoy },
        ] = await Promise.all([
          sb
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          sb
            .from('rachas')
            .select('dias_consecutivos, mejor_racha')
            .eq('user_id', user.id)
            .single(),
          sb
            .from('tests')
            .select('id, created_at, puntuacion, oposicion_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10),
          sb
            .from('metricas_diarias')
            .select('*')
            .eq('user_id', user.id)
            .eq('fecha', new Date().toISOString().split('T')[0])
            .single(),
        ]) as any

        // Calcular estadísticas
        const testsHoy = tests?.filter((t: any) =>
          new Date(t.created_at).toDateString() === new Date().toDateString()
        ).length || 0

        const stats: DashboardStats = {
          opoMetrics: metricasHoy?.opometrics || MOCK_DATA.stats.opoMetrics,
          opoMetricsChange: 5, // TODO: Calcular diferencia real
          racha: racha?.dias_consecutivos || 0,
          mejorRacha: racha?.mejor_racha || 0,
          testsHoy,
          testsTotal: tests?.length || 0,
          aciertosHoy: metricasHoy?.aciertos_porcentaje || 0,
          minutosHoy: metricasHoy?.minutos_estudio || 0,
          temasCompletados: MOCK_DATA.stats.temasCompletados,
          totalTemas: MOCK_DATA.stats.totalTemas,
          proximoRepaso: MOCK_DATA.stats.proximoRepaso,
        }

        // Tests recientes formateados
        const recentTests: RecentTest[] = (tests || []).slice(0, 5).map((t: any) => ({
          id: t.id,
          fecha: t.created_at,
          tema: 'Test de Oposición',
          aciertos: Math.round((t.puntuacion || 0) / 10),
          total: 10,
        }))

        return {
          stats,
          recentTests: recentTests.length > 0 ? recentTests : MOCK_DATA.recentTests,
          weeklyProgress: MOCK_DATA.weeklyProgress, // TODO: Calcular desde métricas
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        return MOCK_DATA
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true,
  })
}
