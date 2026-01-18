// ===========================================
// OpoMetrics - Dashboard Principal
// ===========================================

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ScoreGauge } from '@/components/opometrics/ScoreGauge'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'

export const metadata = {
  title: 'Dashboard - OpoMetrics',
}

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

// Datos mock para modo demo
const mockData = {
  user: {
    id: 'demo-user',
    email: 'demo@opometrics.es',
  },
  userOposicion: {
    id: 'demo-oposicion',
    oposicion_id: 'aux-admin',
    oposicion: {
      nombre: 'Auxiliar Administrativo del Estado',
      slug: 'auxiliar-administrativo',
    },
  },
  racha: {
    dias_consecutivos: 5,
    mejor_racha: 12,
  },
  flashcardsPendientes: 8,
  ultimosTests: [
    { id: '1', puntuacion: 85, created_at: new Date().toISOString(), tipo: 'practica' },
    { id: '2', puntuacion: 72, created_at: new Date(Date.now() - 86400000).toISOString(), tipo: 'practica' },
    { id: '3', puntuacion: 68, created_at: new Date(Date.now() - 172800000).toISOString(), tipo: 'simulacro' },
    { id: '4', puntuacion: 90, created_at: new Date(Date.now() - 259200000).toISOString(), tipo: 'practica' },
  ],
  opoMetrics: 67,
  progresoTemario: 35,
}

// Tipos para las respuestas de Supabase
interface SimpleUser {
  id: string
  email?: string | null
}

interface UserOposicionWithOposicion {
  id: string
  oposicion_id: string
  oposicion: {
    nombre: string
    slug: string
  } | null
}

interface RachaData {
  dias_consecutivos: number
  mejor_racha: number
}

interface TestData {
  id: string
  puntuacion: number | null
  created_at: string
  tipo: string
}

export default async function DashboardPage() {
  let user: SimpleUser = mockData.user
  let userOposicion: UserOposicionWithOposicion | null = mockData.userOposicion
  let racha: RachaData | null = mockData.racha
  let flashcardsPendientes: number | null = mockData.flashcardsPendientes
  let ultimosTests: TestData[] | null = mockData.ultimosTests
  let opoMetrics = mockData.opoMetrics
  let progresoTemario = mockData.progresoTemario

  // Solo consultar Supabase si no estamos en modo demo
  if (!DEMO_MODE) {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      // En producción, redirigir a login
      const { redirect } = await import('next/navigation')
      redirect('/login')
      return // TypeScript needs this for control flow
    }

    user = { id: authUser.id, email: authUser.email }

    // Obtener oposicion activa del usuario
    const { data: userOpoData } = await supabase
      .from('user_oposiciones')
      .select(`
        id,
        oposicion_id,
        oposicion:oposiciones(nombre, slug)
      `)
      .eq('user_id', user.id)
      .eq('activa', true)
      .single() as { data: UserOposicionWithOposicion | null }

    userOposicion = userOpoData

    // Obtener racha
    const { data: rachaData } = await supabase
      .from('rachas')
      .select('dias_consecutivos, mejor_racha')
      .eq('user_id', user.id)
      .single() as { data: RachaData | null }

    racha = rachaData

    // Obtener flashcards pendientes
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lte('proxima_revision', today)

    flashcardsPendientes = count

    // Obtener ultimos tests
    const { data: testsData } = await supabase
      .from('tests')
      .select('id, puntuacion, created_at, tipo')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5) as { data: TestData[] | null }

    ultimosTests = testsData

    // Reset valores para producción
    opoMetrics = 0
    progresoTemario = 0
  }

  // Si no tiene oposición seleccionada, mostrar selector
  if (!userOposicion) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">¡Bienvenido a OpoMetrics!</h1>
          <p className="text-muted-foreground mb-8">
            Para empezar, selecciona la oposición que estás preparando.
          </p>
          <Link href="/estudiar">
            <Button size="lg">Elegir oposición</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Demo Mode Banner */}
      {DEMO_MODE && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-medium text-yellow-800">Modo Demo Activo</p>
            <p className="text-sm text-yellow-700">
              Estás viendo datos de ejemplo. Configura Supabase para usar datos reales.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {userOposicion.oposicion?.nombre}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/estudiar/${userOposicion.oposicion?.slug}`}>
            <Button>Continuar estudiando</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* OpoMetrics Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tu OpoMetrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ScoreGauge score={opoMetrics} size="sm" />
            </div>
          </CardContent>
        </Card>

        {/* Racha */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Racha actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {racha?.dias_consecutivos || 0} días
              {(racha?.dias_consecutivos || 0) >= 3 && <span>🔥</span>}
            </div>
            <p className="text-sm text-muted-foreground">
              Mejor: {racha?.mejor_racha || 0} días
            </p>
          </CardContent>
        </Card>

        {/* Flashcards pendientes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flashcards hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {flashcardsPendientes || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              tarjetas pendientes
            </p>
          </CardContent>
        </Card>

        {/* Tests completados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tests recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {ultimosTests?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              tests completados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>¿Qué quieres hacer hoy?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={`/estudiar/${userOposicion.oposicion?.slug}/tests`} className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <span>📝</span> Hacer un test rápido (10 preguntas)
              </Button>
            </Link>
            <Link href={`/estudiar/${userOposicion.oposicion?.slug}/flashcards`} className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <span>🧠</span> Revisar flashcards pendientes
              </Button>
            </Link>
            <Link href="/simulacros" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <span>⏱️</span> Empezar un simulacro completo
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Últimos tests */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos tests</CardTitle>
            <CardDescription>Tu rendimiento reciente</CardDescription>
          </CardHeader>
          <CardContent>
            {ultimosTests && ultimosTests.length > 0 ? (
              <div className="space-y-3">
                {ultimosTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{test.tipo}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(test.created_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <span className={`font-bold ${
                      (test.puntuacion || 0) >= 70 ? 'text-green-600' :
                      (test.puntuacion || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {test.puntuacion?.toFixed(0) || 0}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aún no has completado ningún test.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Progreso del temario */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso del temario</CardTitle>
            <CardDescription>Tu avance general</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completado</span>
                <span className="text-muted-foreground">{progresoTemario}%</span>
              </div>
              <Progress value={progresoTemario} />
            </div>
            <Link href="/progreso">
              <Button variant="link" className="px-0">
                Ver desglose por temas →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Charts y Gráficos Premium */}
      <DashboardCharts
        opoMetrics={opoMetrics}
        rachaActual={racha?.dias_consecutivos || 0}
        mejorRacha={racha?.mejor_racha || 0}
        testsCompletados={ultimosTests?.length || 0}
        flashcardsPendientes={flashcardsPendientes || 0}
      />

      {/* Motivational footer */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💪</div>
            <div>
              <p className="font-medium">
                ¡Sigue así! La constancia es la clave del éxito en las oposiciones.
              </p>
              <p className="text-sm text-muted-foreground">
                Recuerda: 15-20 minutos diarios es mejor que 3 horas un día y nada el resto de la semana.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
