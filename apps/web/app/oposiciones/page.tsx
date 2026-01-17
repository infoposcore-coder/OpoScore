/**
 * Página pública de listado de oposiciones
 * Optimizada para SEO
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { getOposiciones } from '@/lib/cache'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Tipo para oposición en listado (compatible con DB y demo)
interface OposicionListItem {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  categoria: string
  activa: boolean
  nivel?: string
  total_temas?: number
  total_preguntas?: number
}

export const metadata: Metadata = {
  title: 'Oposiciones Disponibles | Academia Online',
  description: 'Prepara tus oposiciones con OpoScore. Auxiliar Administrativo, Tramitación Procesal, Correos y más. Tests ilimitados, tutor IA y predicción de aprobado.',
  keywords: [
    'oposiciones',
    'preparar oposiciones',
    'academia oposiciones',
    'auxiliar administrativo',
    'tramitación procesal',
    'oposiciones correos',
    'tests oposiciones',
  ],
  openGraph: {
    title: 'Oposiciones Disponibles | OpoScore',
    description: 'Encuentra tu oposición y empieza a prepararte con IA',
    type: 'website',
    url: 'https://oposcore.es/oposiciones',
  },
  alternates: {
    canonical: 'https://oposcore.es/oposiciones',
  },
}

// Iconos por categoría
const categoryIcons: Record<string, string> = {
  administracion: '🏛️',
  justicia: '⚖️',
  correos: '📮',
  hacienda: '💰',
  educacion: '📚',
  sanidad: '🏥',
  default: '📋',
}

// Datos estáticos para demo si no hay datos
const oposicionesDemo: OposicionListItem[] = [
  {
    id: '1',
    slug: 'auxiliar-administrativo-age',
    nombre: 'Auxiliar Administrativo del Estado',
    descripcion: 'Prepara las oposiciones de Auxiliar Administrativo de la Administración General del Estado. Grupo C2.',
    categoria: 'administracion',
    nivel: 'C2',
    total_temas: 26,
    total_preguntas: 2500,
    activa: true,
  },
  {
    id: '2',
    slug: 'tramitacion-procesal',
    nombre: 'Tramitación Procesal y Administrativa',
    descripcion: 'Cuerpo de Tramitación Procesal y Administrativa de la Administración de Justicia. Grupo C1.',
    categoria: 'justicia',
    nivel: 'C1',
    total_temas: 35,
    total_preguntas: 3200,
    activa: true,
  },
  {
    id: '3',
    slug: 'correos',
    nombre: 'Correos y Telégrafos',
    descripcion: 'Personal Laboral de Correos. Reparto, Atención al Cliente y Clasificación.',
    categoria: 'correos',
    nivel: 'Laboral',
    total_temas: 18,
    total_preguntas: 1800,
    activa: true,
  },
  {
    id: '4',
    slug: 'hacienda',
    nombre: 'Técnico de Hacienda',
    descripcion: 'Cuerpo Técnico de Hacienda de la Agencia Tributaria. Grupo A2.',
    categoria: 'hacienda',
    nivel: 'A2',
    total_temas: 45,
    total_preguntas: 4000,
    activa: true,
  },
]

export default async function OposicionesPage() {
  // Obtener oposiciones del cache
  const oposicionesDb = await getOposiciones()

  // Usar datos de demo si no hay oposiciones
  const oposiciones: OposicionListItem[] = (oposicionesDb && oposicionesDb.length > 0)
    ? oposicionesDb.map(op => ({
        id: op.id,
        slug: op.slug,
        nombre: op.nombre,
        descripcion: op.descripcion,
        categoria: op.categoria,
        activa: op.activa,
      }))
    : oposicionesDemo

  // Agrupar por categoría
  const oposicionesPorCategoria = oposiciones.reduce((acc, oposicion) => {
    const categoria = oposicion.categoria || 'default'
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(oposicion)
    return acc
  }, {} as Record<string, OposicionListItem[]>)

  const categorias = Object.keys(oposicionesPorCategoria)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            OpoScore
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Empezar gratis</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            {oposiciones.length} oposiciones disponibles
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Encuentra tu oposición
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige la oposición que quieres preparar y accede a tests ilimitados,
            tutor IA y nuestro sistema de predicción de aprobado.
          </p>
        </div>
      </section>

      {/* Listado de Oposiciones */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {categorias.map((categoria) => (
            <div key={categoria} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl" role="img" aria-hidden="true">
                  {categoryIcons[categoria] || categoryIcons.default}
                </span>
                <h2 className="text-2xl font-bold capitalize">
                  {categoria === 'default' ? 'Otras oposiciones' : categoria}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {oposicionesPorCategoria[categoria].map((oposicion) => (
                  <Link
                    key={oposicion.id}
                    href={`/oposiciones/${oposicion.slug}`}
                  >
                    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {oposicion.nombre}
                          </CardTitle>
                          {'nivel' in oposicion && oposicion.nivel && (
                            <Badge variant="secondary">
                              {oposicion.nivel}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {oposicion.descripcion}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {'total_temas' in oposicion && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-foreground">
                                {oposicion.total_temas}
                              </span>
                              temas
                            </div>
                          )}
                          {'total_preguntas' in oposicion && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-foreground">
                                {Number(oposicion.total_preguntas).toLocaleString('es-ES')}
                              </span>
                              preguntas
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Regístrate gratis y accede a tests de prueba.
            Sin tarjeta de crédito.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Crear cuenta gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="font-bold text-lg text-primary">
              OpoScore
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OpoScore. Hecho con pasión en España.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacidad" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-foreground transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
