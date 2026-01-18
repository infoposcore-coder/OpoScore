// ===========================================
// OpoMetrics - Pagina de Tema Individual
// ===========================================

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

// Datos mock para modo demo
const mockTemasData: Record<string, Tema> = {
  't1': {
    id: 't1',
    nombre: 'La Constitucion Espanola de 1978',
    descripcion: 'Estructura, principios fundamentales y caracteristicas de la Constitucion Espanola.',
    subtemas: [
      {
        id: 's1',
        titulo: 'Caracteristicas de la Constitucion',
        contenido: `<p>La Constitucion Espanola de 1978 presenta las siguientes caracteristicas:</p>
        <ul>
          <li><strong>Escrita y codificada:</strong> Contenida en un unico documento.</li>
          <li><strong>Extensa:</strong> Con 169 articulos, es una de las mas largas de Europa.</li>
          <li><strong>Rigida:</strong> Requiere procedimientos especiales para su reforma.</li>
          <li><strong>Consensuada:</strong> Fruto del acuerdo entre las principales fuerzas politicas.</li>
          <li><strong>Derivada:</strong> Inspirada en constituciones europeas como la italiana y alemana.</li>
        </ul>`,
        orden: 1,
      },
      {
        id: 's2',
        titulo: 'Estructura de la Constitucion',
        contenido: `<p>La Constitucion se estructura de la siguiente manera:</p>
        <ul>
          <li><strong>Preambulo:</strong> Declara los objetivos de la Constitucion.</li>
          <li><strong>Titulo Preliminar:</strong> Articulos 1 a 9. Principios basicos del Estado.</li>
          <li><strong>Titulo I:</strong> Derechos y deberes fundamentales (Arts. 10-55).</li>
          <li><strong>Titulo II:</strong> La Corona (Arts. 56-65).</li>
          <li><strong>Titulo III:</strong> Las Cortes Generales (Arts. 66-96).</li>
          <li><strong>Titulo IV:</strong> El Gobierno y la Administracion (Arts. 97-107).</li>
          <li><strong>Titulo V:</strong> Relaciones entre el Gobierno y las Cortes (Arts. 108-116).</li>
          <li><strong>Titulo VI:</strong> El Poder Judicial (Arts. 117-127).</li>
          <li><strong>Titulo VII:</strong> Economia y Hacienda (Arts. 128-136).</li>
          <li><strong>Titulo VIII:</strong> Organizacion territorial del Estado (Arts. 137-158).</li>
          <li><strong>Titulo IX:</strong> El Tribunal Constitucional (Arts. 159-165).</li>
          <li><strong>Titulo X:</strong> La reforma constitucional (Arts. 166-169).</li>
        </ul>`,
        orden: 2,
      },
      {
        id: 's3',
        titulo: 'Principios del Estado',
        contenido: `<p>El articulo 1.1 establece que Espana se constituye en un <strong>Estado social y democratico de Derecho</strong>, cuyos valores superiores son:</p>
        <ul>
          <li>La libertad</li>
          <li>La justicia</li>
          <li>La igualdad</li>
          <li>El pluralismo politico</li>
        </ul>
        <p>La <strong>soberania nacional</strong> reside en el pueblo espanol (Art. 1.2).</p>
        <p>La <strong>forma politica</strong> del Estado es la Monarquia parlamentaria (Art. 1.3).</p>`,
        orden: 3,
      },
    ],
    bloque: {
      nombre: 'Organizacion del Estado',
      oposicion: {
        slug: 'auxiliar-administrativo',
        nombre: 'Auxiliar Administrativo del Estado',
      },
    },
  },
  't2': {
    id: 't2',
    nombre: 'Derechos y deberes fundamentales',
    descripcion: 'Derechos fundamentales, libertades publicas y deberes de los ciudadanos.',
    subtemas: [
      {
        id: 's4',
        titulo: 'Clasificacion de los derechos',
        contenido: `<p>Los derechos se clasifican segun su proteccion:</p>
        <ul>
          <li><strong>Derechos fundamentales y libertades publicas</strong> (Arts. 15-29): Maxima proteccion, recurso de amparo.</li>
          <li><strong>Derechos de los ciudadanos</strong> (Arts. 30-38): Proteccion ordinaria.</li>
          <li><strong>Principios rectores</strong> (Arts. 39-52): Informan la legislacion.</li>
        </ul>`,
        orden: 1,
      },
    ],
    bloque: {
      nombre: 'Organizacion del Estado',
      oposicion: {
        slug: 'auxiliar-administrativo',
        nombre: 'Auxiliar Administrativo del Estado',
      },
    },
  },
}

// Crear entradas genericas para otros temas
for (let i = 3; i <= 16; i++) {
  mockTemasData[`t${i}`] = {
    id: `t${i}`,
    nombre: `Tema ${i}`,
    descripcion: 'Contenido del tema en desarrollo.',
    subtemas: [],
    bloque: {
      nombre: 'Bloque tematico',
      oposicion: {
        slug: 'auxiliar-administrativo',
        nombre: 'Auxiliar Administrativo del Estado',
      },
    },
  }
}

interface Subtema {
  id: string
  titulo: string
  contenido: string
  orden: number
}

interface Tema {
  id: string
  nombre: string
  descripcion: string | null
  subtemas: Subtema[]
  bloque: {
    nombre: string
    oposicion: {
      slug: string
      nombre: string
    }
  }
}

interface Props {
  params: Promise<{ oposicion: string; temaId: string }>
}

export default async function TemaPage({ params }: Props) {
  const { oposicion: slug, temaId } = await params
  let tema: Tema | null = null

  if (DEMO_MODE) {
    // Usar datos mock
    tema = mockTemasData[temaId] || null
  } else {
    const supabase = await createClient()

    const { data } = await supabase
      .from('temas')
      .select(`
        id,
        nombre,
        descripcion,
        subtemas (id, titulo, contenido, orden),
        bloque:bloques (
          nombre,
          oposicion:oposiciones (slug, nombre)
        )
      `)
      .eq('id', temaId)
      .single() as { data: Tema | null }

    tema = data
  }

  if (!tema) notFound()

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Demo Mode Banner */}
      {DEMO_MODE && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-medium text-yellow-800">Modo Demo</p>
            <p className="text-sm text-yellow-700">Contenido de ejemplo del tema.</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/estudiar" className="hover:text-foreground">
          Estudiar
        </Link>
        <span>/</span>
        <Link href={`/estudiar/${slug}`} className="hover:text-foreground">
          {tema.bloque?.oposicion?.nombre || 'Oposicion'}
        </Link>
        <span>/</span>
        <span className="text-foreground">{tema.nombre}</span>
      </div>

      {/* Header del tema */}
      <div className="mb-8">
        <Badge variant="outline" className="mb-2">
          {tema.bloque?.nombre}
        </Badge>
        <h1 className="text-3xl font-bold">{tema.nombre}</h1>
        {tema.descripcion && (
          <p className="text-muted-foreground mt-2">{tema.descripcion}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-3 mb-8">
        <Button asChild>
          <Link href={`/estudiar/${slug}/tests?tema=${temaId}`}>
            Hacer test de este tema
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/estudiar/${slug}/flashcards?tema=${temaId}`}>
            Flashcards del tema
          </Link>
        </Button>
      </div>

      {/* Contenido */}
      {tema.subtemas && tema.subtemas.length > 0 ? (
        <div className="space-y-6">
          {tema.subtemas
            .sort((a, b) => a.orden - b.orden)
            .map((subtema, index) => (
              <Card key={subtema.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    {subtema.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: subtema.contenido }}
                  />
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              El contenido de este tema aun no esta disponible.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Puedes practicar con tests y flashcards mientras tanto.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navegacion inferior */}
      <div className="mt-8 pt-8 border-t">
        <Button variant="outline" asChild>
          <Link href={`/estudiar/${slug}`}>
            ← Volver al temario
          </Link>
        </Button>
      </div>
    </div>
  )
}
