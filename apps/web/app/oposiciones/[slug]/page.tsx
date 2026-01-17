/**
 * Página de detalle de oposición
 * Optimizada para SEO con metadata dinámica
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getOposicionBySlug, getOposiciones } from '@/lib/cache'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generar rutas estáticas
export async function generateStaticParams() {
  const oposiciones = await getOposiciones()
  return oposiciones.map((oposicion) => ({
    slug: oposicion.slug,
  }))
}

// Metadata dinámica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const oposicion = await getOposicionBySlug(slug)

  if (!oposicion) {
    return {
      title: 'Oposición no encontrada',
    }
  }

  return {
    title: `Preparar ${oposicion.nombre} | Academia Online`,
    description: `Prepara tu oposición de ${oposicion.nombre} con OpoScore. Tests ilimitados, tutor IA 24/7, flashcards y sistema de predicción de aprobado. ${oposicion.descripcion}`,
    keywords: [
      oposicion.nombre.toLowerCase(),
      'oposiciones',
      `test ${oposicion.nombre.toLowerCase()}`,
      'preparar oposiciones',
      'academia online',
    ],
    openGraph: {
      title: `${oposicion.nombre} | OpoScore`,
      description: oposicion.descripcion || `Prepara ${oposicion.nombre} con IA`,
      type: 'website',
      url: `https://oposcore.es/oposiciones/${slug}`,
      images: [
        {
          url: `/og/oposiciones/${slug}.png`,
          width: 1200,
          height: 630,
          alt: oposicion.nombre,
        },
      ],
    },
    alternates: {
      canonical: `https://oposcore.es/oposiciones/${slug}`,
    },
  }
}

// Datos de demo
const oposicionDemo = {
  id: '1',
  slug: 'auxiliar-administrativo-age',
  nombre: 'Auxiliar Administrativo del Estado',
  descripcion: 'Prepara las oposiciones de Auxiliar Administrativo de la Administración General del Estado. Accede al Grupo C2 de funcionarios.',
  nivel: 'C2',
  convocatoria: '2024',
  plazas: 893,
  requisitos: [
    'Nacionalidad española o de un país de la UE',
    'Tener cumplidos 16 años',
    'Título de Graduado en ESO o equivalente',
    'No haber sido separado del servicio de la Administración',
  ],
  temario: [
    'Constitución Española de 1978',
    'Organización del Estado',
    'Gobierno Abierto',
    'Ley del Procedimiento Administrativo',
    'Atención al ciudadano',
    'Igualdad y violencia de género',
    'Ofimática: Word, Excel, Access',
  ],
  bloques: [
    {
      id: '1',
      nombre: 'Derecho Constitucional',
      orden: 1,
      temas: [
        { id: '1', nombre: 'La Constitución Española de 1978', orden: 1 },
        { id: '2', nombre: 'Derechos y deberes fundamentales', orden: 2 },
        { id: '3', nombre: 'La Corona', orden: 3 },
        { id: '4', nombre: 'Las Cortes Generales', orden: 4 },
      ],
    },
    {
      id: '2',
      nombre: 'Organización Administrativa',
      orden: 2,
      temas: [
        { id: '5', nombre: 'El Gobierno y la Administración', orden: 1 },
        { id: '6', nombre: 'Organización territorial del Estado', orden: 2 },
        { id: '7', nombre: 'El acto administrativo', orden: 3 },
      ],
    },
    {
      id: '3',
      nombre: 'Gestión de Personal',
      orden: 3,
      temas: [
        { id: '8', nombre: 'El personal al servicio de las AAPP', orden: 1 },
        { id: '9', nombre: 'Derechos y deberes de los funcionarios', orden: 2 },
      ],
    },
  ],
  stats: {
    totalTemas: 26,
    totalPreguntas: 2500,
    aprobados: 847,
    tasaAprobados: 85,
  },
}

export default async function OposicionPage({ params }: PageProps) {
  const { slug } = await params
  let oposicion = await getOposicionBySlug(slug)

  // Usar datos de demo si no hay datos reales
  if (!oposicion) {
    if (slug === 'auxiliar-administrativo-age') {
      oposicion = oposicionDemo as unknown as typeof oposicion
    } else {
      notFound()
    }
  }

  const data = oposicion as typeof oposicionDemo

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            OpoScore
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/oposiciones" className="text-sm text-muted-foreground hover:text-foreground">
              Oposiciones
            </Link>
            <Link href="/register">
              <Button size="sm">Empezar gratis</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">Inicio</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/oposiciones" className="hover:text-foreground">Oposiciones</Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">{data.nombre}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {data.nivel && <Badge>{data.nivel}</Badge>}
              {data.convocatoria && (
                <Badge variant="outline">Convocatoria {data.convocatoria}</Badge>
              )}
              {data.plazas && (
                <Badge variant="secondary">{data.plazas} plazas</Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {data.nombre}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {data.descripcion}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Empezar a preparar
                </Button>
              </Link>
              <Link href="#temario">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Ver temario
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {data.stats && (
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {data.stats.totalTemas}
                </div>
                <div className="text-sm text-muted-foreground">Temas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {data.stats.totalPreguntas.toLocaleString('es-ES')}
                </div>
                <div className="text-sm text-muted-foreground">Preguntas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {data.stats.tasaAprobados}%
                </div>
                <div className="text-sm text-muted-foreground">Tasa de aprobados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {data.stats.aprobados}
                </div>
                <div className="text-sm text-muted-foreground">Aprobados con OpoScore</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Temario */}
            <section id="temario">
              <h2 className="text-2xl font-bold mb-6">Temario completo</h2>
              <div className="space-y-4">
                {data.bloques?.map((bloque) => (
                  <Card key={bloque.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-bold">
                          {bloque.orden}
                        </span>
                        {bloque.nombre}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {bloque.temas?.map((tema) => (
                          <li
                            key={tema.id}
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            Tema {tema.orden}: {tema.nombre}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Requisitos */}
            {data.requisitos && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Requisitos</h2>
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {data.requisitos.map((requisito, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {requisito}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Empieza a preparar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Tests ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Tutor IA 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Predicción de aprobado
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Temario actualizado
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-1">Desde</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">19€</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <Button className="w-full" size="lg">
                    Empezar gratis
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground">
                  Sin tarjeta de crédito
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} OpoScore. Hecho con pasión en España.
        </div>
      </footer>
    </div>
  )
}
