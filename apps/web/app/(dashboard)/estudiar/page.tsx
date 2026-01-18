// ===========================================
// OpoMetrics - Página de Estudiar
// Vista principal de temas y acciones de estudio
// ===========================================

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScoreGauge } from '@/components/opometrics/ScoreGauge'
import { EstudiarTabs } from '@/components/estudiar/EstudiarTabs'
import { SeleccionarOposicion } from '@/components/estudiar/SeleccionarOposicion'

export const metadata = {
  title: 'Estudiar - OpoMetrics',
}

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

// Datos mock para modo demo
const MOCK_BLOQUES = [
  {
    id: 'mock-1',
    nombre: 'Constitución Española',
    icono: '📜',
    orden: 1,
    temas: [
      { id: 'mock-t1', nombre: 'Título Preliminar', preguntas_count: 50, completado: 85, dominio: 78 },
      { id: 'mock-t2', nombre: 'Derechos Fundamentales', preguntas_count: 80, completado: 60, dominio: 65 },
      { id: 'mock-t3', nombre: 'La Corona', preguntas_count: 30, completado: 100, dominio: 92 },
    ],
  },
  {
    id: 'mock-2',
    nombre: 'Procedimiento Administrativo',
    icono: '📋',
    orden: 2,
    temas: [
      { id: 'mock-t4', nombre: 'Ley 39/2015 - Disposiciones Generales', preguntas_count: 60, completado: 30, dominio: 50 },
      { id: 'mock-t5', nombre: 'Interesados en el Procedimiento', preguntas_count: 45, completado: 0, dominio: 0 },
    ],
  },
]

interface Tema {
  id: string
  nombre: string
  preguntas_count: number
  completado: number
  dominio: number
}

interface Bloque {
  id: string
  nombre: string
  icono: string
  orden: number
  temas: Tema[]
}

interface OposicionDisponible {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  categoria: string
}

export default async function EstudiarPage() {
  let bloques: Bloque[] = MOCK_BLOQUES
  let oposicionSlug = 'auxiliar-administrativo'
  let oposicionNombre = 'Auxiliar Administrativo del Estado'
  let oposicionesDisponibles: OposicionDisponible[] = []
  let mostrarSelector = false
  let userId = ''

  // Solo consultar Supabase si no estamos en modo demo
  if (!DEMO_MODE) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const { redirect } = await import('next/navigation')
      redirect('/login')
      return
    }

    userId = user.id

    // Obtener oposición activa del usuario
    const { data: userOpo } = await supabase
      .from('user_oposiciones')
      .select(`
        oposicion_id,
        oposicion:oposiciones(id, nombre, slug)
      `)
      .eq('user_id', user.id)
      .eq('activa', true)
      .single() as { data: { oposicion_id: string; oposicion: { id: string; nombre: string; slug: string } | null } | null }

    if (!userOpo?.oposicion) {
      // Mostrar selector de oposiciones
      mostrarSelector = true

      // Obtener oposiciones disponibles
      const { data: oposiciones } = await supabase
        .from('oposiciones')
        .select('id, nombre, slug, descripcion, categoria')
        .eq('activa', true)
        .order('nombre') as { data: OposicionDisponible[] | null }

      oposicionesDisponibles = oposiciones || []
    } else {
      const oposicion = userOpo.oposicion
      oposicionSlug = oposicion.slug
      oposicionNombre = oposicion.nombre

      // Tipo para la respuesta de bloques
      interface BloqueDB {
        id: string
        nombre: string
        orden: number
        temas: { id: string; nombre: string; orden: number }[] | null
      }

      // Obtener bloques con temas para esta oposición
      const { data: bloquesData } = await supabase
        .from('bloques')
        .select(`
          id,
          nombre,
          orden,
          temas (
            id,
            nombre,
            orden
          )
        `)
        .eq('oposicion_id', oposicion.id)
        .order('orden', { ascending: true }) as { data: BloqueDB[] | null }

      if (bloquesData && bloquesData.length > 0) {
        // Obtener conteo de preguntas por tema
        const temaIds = bloquesData.flatMap(b => (b.temas || []).map(t => t.id))

        const { data: preguntasCounts } = await supabase
          .from('preguntas')
          .select('tema_id')
          .in('tema_id', temaIds) as { data: { tema_id: string }[] | null }

        // Contar preguntas por tema
        const countByTema: Record<string, number> = {}
        preguntasCounts?.forEach(p => {
          countByTema[p.tema_id] = (countByTema[p.tema_id] || 0) + 1
        })

        // Transformar datos - asignar icono basado en el nombre del bloque
        const getIconoForBloque = (nombre: string): string => {
          const n = nombre.toLowerCase()
          if (n.includes('constitución')) return '📜'
          if (n.includes('procedimiento') || n.includes('administrativo')) return '📋'
          if (n.includes('organización') || n.includes('estado')) return '🏛️'
          if (n.includes('hacienda') || n.includes('tribut')) return '💰'
          if (n.includes('derecho')) return '⚖️'
          if (n.includes('laboral') || n.includes('trabajo')) return '👷'
          if (n.includes('informática') || n.includes('tecnología')) return '💻'
          if (n.includes('europeo') || n.includes('unión')) return '🇪🇺'
          if (n.includes('sanidad') || n.includes('salud')) return '🏥'
          if (n.includes('educación') || n.includes('enseñanza')) return '📚'
          return '📋'
        }

        bloques = bloquesData.map(b => ({
          id: b.id,
          nombre: b.nombre,
          icono: getIconoForBloque(b.nombre),
          orden: b.orden,
          temas: (b.temas || [])
            .sort((a, b) => a.orden - b.orden)
            .map(t => ({
              id: t.id,
              nombre: t.nombre,
              preguntas_count: countByTema[t.id] || 0,
              completado: 0, // TODO: calcular del progreso del usuario
              dominio: 0, // TODO: calcular del historial de tests
            }))
        }))
      }
    }
  }

  // Calcular estadísticas globales
  const totalTemas = bloques.reduce((acc, b) => acc + b.temas.length, 0)
  const temasCompletados = bloques.reduce(
    (acc, b) => acc + b.temas.filter(t => t.completado >= 80).length,
    0
  )
  const promedioGeneral = Math.round(
    bloques.flatMap(b => b.temas)
      .filter(t => t.dominio > 0)
      .reduce((acc, t, _, arr) => acc + t.dominio / arr.length, 0)
  ) || 0

  // Si hay que mostrar el selector
  if (mostrarSelector) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Selecciona tu oposición</h1>
            <p className="text-muted-foreground text-lg">
              Elige la oposición que estás preparando para comenzar a estudiar
            </p>
          </div>
          <SeleccionarOposicion oposiciones={oposicionesDisponibles} userId={userId} />
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
          <h1 className="text-2xl font-bold">Estudiar</h1>
          <p className="text-muted-foreground">
            {oposicionNombre}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{temasCompletados}/{totalTemas}</div>
            <div className="text-xs text-muted-foreground">Temas dominados</div>
          </div>
          <ScoreGauge score={promedioGeneral} size="sm" />
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href={`/estudiar/${oposicionSlug}/tests?modo=rapido`}>
          <Card className="card-hover cursor-pointer h-full">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-medium">Test rápido</div>
              <div className="text-xs text-muted-foreground">10 preguntas aleatorias</div>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/estudiar/${oposicionSlug}/flashcards`}>
          <Card className="card-hover cursor-pointer h-full">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">🔄</div>
              <div className="font-medium">Repaso espaciado</div>
              <div className="text-xs text-muted-foreground">Flashcards pendientes</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/progreso">
          <Card className="card-hover cursor-pointer h-full">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-medium">Puntos débiles</div>
              <div className="text-xs text-muted-foreground">Ver temas con menos dominio</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/simulacros">
          <Card className="card-hover cursor-pointer h-full">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="font-medium">Simulacro</div>
              <div className="text-xs text-muted-foreground">Examen completo</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Tabs de bloques - Client Component */}
      <EstudiarTabs bloques={bloques} oposicionSlug={oposicionSlug} />
    </div>
  )
}
