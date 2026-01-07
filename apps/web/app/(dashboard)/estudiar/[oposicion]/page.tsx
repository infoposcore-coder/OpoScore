// ===========================================
// OpoScore - Pagina de Oposicion
// ===========================================

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

// Datos mock para modo demo
const mockOposicionData = {
  'auxiliar-administrativo': {
    id: '1',
    nombre: 'Auxiliar Administrativo del Estado',
    slug: 'auxiliar-administrativo',
    descripcion: 'Preparacion completa para las pruebas de Auxiliar Administrativo de la Administracion General del Estado (AGE). Temario actualizado 2024.',
    bloques: [
      {
        id: 'b1',
        nombre: 'Organizacion del Estado',
        orden: 1,
        temas: [
          { id: 't1', nombre: 'La Constitucion Espanola de 1978', orden: 1 },
          { id: 't2', nombre: 'Derechos y deberes fundamentales', orden: 2 },
          { id: 't3', nombre: 'El Gobierno y la Administracion', orden: 3 },
          { id: 't4', nombre: 'La organizacion territorial del Estado', orden: 4 },
        ],
      },
      {
        id: 'b2',
        nombre: 'Organizacion de Oficinas Publicas',
        orden: 2,
        temas: [
          { id: 't5', nombre: 'Atencion al ciudadano', orden: 1 },
          { id: 't6', nombre: 'Los registros publicos', orden: 2 },
          { id: 't7', nombre: 'El archivo de documentos', orden: 3 },
        ],
      },
      {
        id: 'b3',
        nombre: 'Actividad Administrativa',
        orden: 3,
        temas: [
          { id: 't8', nombre: 'El acto administrativo', orden: 1 },
          { id: 't9', nombre: 'El procedimiento administrativo', orden: 2 },
          { id: 't10', nombre: 'Recursos administrativos', orden: 3 },
          { id: 't11', nombre: 'La contratacion del sector publico', orden: 4 },
        ],
      },
      {
        id: 'b4',
        nombre: 'Informatica Basica',
        orden: 4,
        temas: [
          { id: 't12', nombre: 'Conceptos basicos de informatica', orden: 1 },
          { id: 't13', nombre: 'Procesadores de texto: Word', orden: 2 },
          { id: 't14', nombre: 'Hojas de calculo: Excel', orden: 3 },
          { id: 't15', nombre: 'Bases de datos: Access', orden: 4 },
          { id: 't16', nombre: 'Correo electronico y navegacion', orden: 5 },
        ],
      },
    ],
  },
  'administrativo-estado': {
    id: '2',
    nombre: 'Administrativo del Estado',
    slug: 'administrativo-estado',
    descripcion: 'Oposiciones para el cuerpo de Administrativos de la Administracion General del Estado.',
    bloques: [
      {
        id: 'b1',
        nombre: 'Derecho Constitucional',
        orden: 1,
        temas: [
          { id: 't1', nombre: 'La Constitucion Espanola', orden: 1 },
          { id: 't2', nombre: 'La Corona', orden: 2 },
          { id: 't3', nombre: 'Las Cortes Generales', orden: 3 },
        ],
      },
    ],
  },
}

interface Tema {
  id: string
  nombre: string
  orden: number
}

interface Bloque {
  id: string
  nombre: string
  orden: number
  temas: Tema[]
}

interface OposicionConBloques {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  bloques: Bloque[]
}

interface Props {
  params: Promise<{ oposicion: string }>
}

export default async function OposicionPage({ params }: Props) {
  const { oposicion: slug } = await params
  let oposicion: OposicionConBloques | null = null

  if (DEMO_MODE) {
    // Usar datos mock
    const mockData = mockOposicionData[slug as keyof typeof mockOposicionData]
    if (mockData) {
      oposicion = mockData
    }
  } else {
    // Consultar Supabase
    const supabase = await createClient()
    const { data } = await supabase
      .from('oposiciones')
      .select(`
        id,
        nombre,
        slug,
        descripcion,
        bloques (
          id,
          nombre,
          orden,
          temas (id, nombre, orden)
        )
      `)
      .eq('slug', slug)
      .single()

    oposicion = data as OposicionConBloques | null
  }

  if (!oposicion) notFound()

  const totalTemas = oposicion.bloques?.reduce(
    (acc, bloque) => acc + (bloque.temas?.length || 0),
    0
  ) || 0

  return (
    <div className="container py-8">
      {/* Demo Mode Banner */}
      {DEMO_MODE && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-medium text-yellow-800">Modo Demo</p>
            <p className="text-sm text-yellow-700">Mostrando temario de ejemplo.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/estudiar"
          className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
        >
          ← Volver a oposiciones
        </Link>
        <h1 className="text-3xl font-bold">{oposicion.nombre}</h1>
        <p className="text-muted-foreground mt-2">{oposicion.descripcion}</p>
      </div>

      {/* Acciones rapidas */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href={`/estudiar/${slug}/tests`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Tests</h3>
                <p className="text-sm text-muted-foreground">Practica con preguntas tipo examen</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/estudiar/${slug}/flashcards`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Flashcards</h3>
                <p className="text-sm text-muted-foreground">Repaso espaciado con Leitner</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/simulacros?oposicion=${slug}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary h-full">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Simulacros</h3>
                <p className="text-sm text-muted-foreground">Examenes completos cronometrados</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Estadisticas rapidas */}
      <Card className="mb-8">
        <CardContent className="py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{oposicion.bloques?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Bloques</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTemas}</p>
              <p className="text-sm text-muted-foreground">Temas</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0%</p>
              <p className="text-sm text-muted-foreground">Completado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temario completo */}
      <h2 className="text-xl font-semibold mb-4">Temario completo</h2>
      <div className="space-y-4">
        {oposicion.bloques
          ?.sort((a, b) => a.orden - b.orden)
          .map((bloque) => (
            <Card key={bloque.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-primary">Bloque {bloque.orden}:</span>
                  {bloque.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {bloque.temas
                    ?.sort((a, b) => a.orden - b.orden)
                    .map((tema) => (
                      <li key={tema.id}>
                        <Link
                          href={`/estudiar/${slug}/temas/${tema.id}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {tema.orden}
                          </div>
                          <span className="text-sm">{tema.nombre}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
