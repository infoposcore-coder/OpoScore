// ===========================================
// OpoScore - Pagina de Tests
// ===========================================

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

// Preguntas mock para modo demo
const mockPreguntas = [
  {
    id: 'p1',
    enunciado: 'Segun la Constitucion Espanola, el castellano es la lengua oficial del Estado. Todos los espanoles tienen el deber de conocerla y el derecho a:',
    respuestas: [
      { id: 'r1a', texto: 'Aprenderla', orden: 1, es_correcta: false },
      { id: 'r1b', texto: 'Usarla', orden: 2, es_correcta: true },
      { id: 'r1c', texto: 'Ensenarla', orden: 3, es_correcta: false },
      { id: 'r1d', texto: 'Imponerla', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p2',
    enunciado: 'La Constitucion Espanola de 1978 se aprobo en referendum el dia:',
    respuestas: [
      { id: 'r2a', texto: '6 de diciembre de 1978', orden: 1, es_correcta: true },
      { id: 'r2b', texto: '27 de diciembre de 1978', orden: 2, es_correcta: false },
      { id: 'r2c', texto: '31 de octubre de 1978', orden: 3, es_correcta: false },
      { id: 'r2d', texto: '29 de diciembre de 1978', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p3',
    enunciado: 'El Titulo I de la Constitucion Espanola se denomina:',
    respuestas: [
      { id: 'r3a', texto: 'De la Corona', orden: 1, es_correcta: false },
      { id: 'r3b', texto: 'De las Cortes Generales', orden: 2, es_correcta: false },
      { id: 'r3c', texto: 'De los derechos y deberes fundamentales', orden: 3, es_correcta: true },
      { id: 'r3d', texto: 'Del Gobierno y de la Administracion', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p4',
    enunciado: 'Segun el articulo 1.3 de la Constitucion, la forma politica del Estado espanol es:',
    respuestas: [
      { id: 'r4a', texto: 'Republica parlamentaria', orden: 1, es_correcta: false },
      { id: 'r4b', texto: 'Monarquia absoluta', orden: 2, es_correcta: false },
      { id: 'r4c', texto: 'Monarquia parlamentaria', orden: 3, es_correcta: true },
      { id: 'r4d', texto: 'Republica federal', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p5',
    enunciado: 'La sede del Tribunal Constitucional se encuentra en:',
    respuestas: [
      { id: 'r5a', texto: 'Barcelona', orden: 1, es_correcta: false },
      { id: 'r5b', texto: 'Madrid', orden: 2, es_correcta: true },
      { id: 'r5c', texto: 'Sevilla', orden: 3, es_correcta: false },
      { id: 'r5d', texto: 'Valencia', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p6',
    enunciado: 'Que articulo de la Constitucion regula el derecho de peticion?',
    respuestas: [
      { id: 'r6a', texto: 'Articulo 27', orden: 1, es_correcta: false },
      { id: 'r6b', texto: 'Articulo 28', orden: 2, es_correcta: false },
      { id: 'r6c', texto: 'Articulo 29', orden: 3, es_correcta: true },
      { id: 'r6d', texto: 'Articulo 30', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p7',
    enunciado: 'El Defensor del Pueblo es designado por:',
    respuestas: [
      { id: 'r7a', texto: 'El Rey', orden: 1, es_correcta: false },
      { id: 'r7b', texto: 'El Gobierno', orden: 2, es_correcta: false },
      { id: 'r7c', texto: 'Las Cortes Generales', orden: 3, es_correcta: true },
      { id: 'r7d', texto: 'El Tribunal Constitucional', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p8',
    enunciado: 'La Administracion Publica sirve con objetividad los intereses generales y actua de acuerdo con los principios de:',
    respuestas: [
      { id: 'r8a', texto: 'Eficacia, jerarquia, descentralizacion y coordinacion', orden: 1, es_correcta: true },
      { id: 'r8b', texto: 'Rapidez, economia y simplicidad', orden: 2, es_correcta: false },
      { id: 'r8c', texto: 'Legalidad y buena fe', orden: 3, es_correcta: false },
      { id: 'r8d', texto: 'Publicidad y transparencia', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p9',
    enunciado: 'Cuantos titulos tiene la Constitucion Espanola de 1978?',
    respuestas: [
      { id: 'r9a', texto: '8 titulos', orden: 1, es_correcta: false },
      { id: 'r9b', texto: '10 titulos mas un titulo preliminar', orden: 2, es_correcta: true },
      { id: 'r9c', texto: '12 titulos', orden: 3, es_correcta: false },
      { id: 'r9d', texto: '9 titulos mas un titulo preliminar', orden: 4, es_correcta: false },
    ],
  },
  {
    id: 'p10',
    enunciado: 'El plazo maximo de detencion preventiva es de:',
    respuestas: [
      { id: 'r10a', texto: '24 horas', orden: 1, es_correcta: false },
      { id: 'r10b', texto: '48 horas', orden: 2, es_correcta: false },
      { id: 'r10c', texto: '72 horas', orden: 3, es_correcta: true },
      { id: 'r10d', texto: '96 horas', orden: 4, es_correcta: false },
    ],
  },
]

interface Respuesta {
  id: string
  texto: string
  orden: number
  es_correcta: boolean
}

interface Pregunta {
  id: string
  enunciado: string
  respuestas: Respuesta[]
}

interface TestState {
  preguntas: Pregunta[]
  currentIndex: number
  respuestas: { preguntaId: string; respuestaId: string; tiempo: number }[]
  startTime: number
  finished: boolean
}

export default function TestsPage() {
  const params = useParams()
  const slug = params.oposicion as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testState, setTestState] = useState<TestState | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const startTest = async () => {
    setLoading(true)
    setError(null)

    try {
      let preguntas: Pregunta[] = []

      if (DEMO_MODE) {
        // Usar preguntas mock en modo demo
        preguntas = [...mockPreguntas].sort(() => Math.random() - 0.5)
      } else {
        const supabase = createClient()

        // Obtener la oposicion
        const { data: oposicion } = await supabase
          .from('oposiciones')
          .select('id')
          .eq('slug', slug)
          .single()

        if (!oposicion) {
          setError('Oposicion no encontrada')
          return
        }

        // Obtener preguntas aleatorias
        const { data: preguntasData, error: preguntasError } = await supabase
          .from('preguntas')
          .select(`
            id,
            enunciado,
            respuestas (id, texto, orden, es_correcta)
          `)
          .limit(10)

        if (preguntasError || !preguntasData || preguntasData.length === 0) {
          setError('No hay preguntas disponibles para esta oposicion')
          return
        }

        // Mezclar preguntas
        preguntas = [...preguntasData].sort(() => Math.random() - 0.5) as Pregunta[]
      }

      setTestState({
        preguntas,
        currentIndex: 0,
        respuestas: [],
        startTime: Date.now(),
        finished: false,
      })
      setQuestionStartTime(Date.now())
    } catch {
      setError('Error al cargar el test')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = () => {
    if (!testState || !selectedAnswer) return

    const tiempo = Date.now() - questionStartTime

    const nuevasRespuestas = [
      ...testState.respuestas,
      {
        preguntaId: testState.preguntas[testState.currentIndex].id,
        respuestaId: selectedAnswer,
        tiempo,
      },
    ]

    if (testState.currentIndex === testState.preguntas.length - 1) {
      // Ultimo pregunta
      setTestState({
        ...testState,
        respuestas: nuevasRespuestas,
        finished: true,
      })
      setShowResults(true)
    } else {
      // Siguiente pregunta
      setTestState({
        ...testState,
        respuestas: nuevasRespuestas,
        currentIndex: testState.currentIndex + 1,
      })
      setSelectedAnswer(null)
      setQuestionStartTime(Date.now())
    }
  }

  const calcularResultados = () => {
    if (!testState) return { aciertos: 0, total: 0, porcentaje: 0, tiempoTotal: 0 }

    let aciertos = 0
    testState.respuestas.forEach((resp) => {
      const pregunta = testState.preguntas.find((p) => p.id === resp.preguntaId)
      const respuestaCorrecta = pregunta?.respuestas.find((r) => r.es_correcta)
      if (respuestaCorrecta?.id === resp.respuestaId) {
        aciertos++
      }
    })

    const tiempoTotal = testState.respuestas.reduce((acc, r) => acc + r.tiempo, 0)

    return {
      aciertos,
      total: testState.preguntas.length,
      porcentaje: Math.round((aciertos / testState.preguntas.length) * 100),
      tiempoTotal,
    }
  }

  // Vista de resultados
  if (showResults && testState) {
    const resultados = calcularResultados()

    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Resultados del Test</CardTitle>
            <CardDescription>
              Has completado el test de practica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary">
                {resultados.aciertos}/{resultados.total}
              </p>
              <p className="text-muted-foreground mt-2">
                {resultados.porcentaje}% de aciertos
              </p>
            </div>

            <Progress value={resultados.porcentaje} className="h-3" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-green-600">{resultados.aciertos}</p>
                <p className="text-sm text-muted-foreground">Correctas</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {resultados.total - resultados.aciertos}
                </p>
                <p className="text-sm text-muted-foreground">Incorrectas</p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Tiempo total: {Math.round(resultados.tiempoTotal / 1000)} segundos
              <br />
              Media por pregunta: {Math.round(resultados.tiempoTotal / resultados.total / 1000)}s
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setTestState(null)
                setShowResults(false)
              }}
            >
              Nuevo test
            </Button>
            <Button className="flex-1" asChild>
              <Link href={`/estudiar/${slug}`}>Volver</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Vista de pregunta
  if (testState && !testState.finished) {
    const pregunta = testState.preguntas[testState.currentIndex]
    const progreso = ((testState.currentIndex + 1) / testState.preguntas.length) * 100

    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Pregunta {testState.currentIndex + 1} de {testState.preguntas.length}</span>
            <span>{Math.round(progreso)}%</span>
          </div>
          <Progress value={progreso} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium leading-relaxed">
              {pregunta.enunciado}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer || ''}
              onValueChange={setSelectedAnswer}
            >
              {pregunta.respuestas
                .sort((a, b) => a.orden - b.orden)
                .map((respuesta) => (
                  <div
                    key={respuesta.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => setSelectedAnswer(respuesta.id)}
                  >
                    <RadioGroupItem value={respuesta.id} id={respuesta.id} />
                    <Label
                      htmlFor={respuesta.id}
                      className="flex-1 cursor-pointer text-sm"
                    >
                      {respuesta.texto}
                    </Label>
                  </div>
                ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setTestState(null)
                setSelectedAnswer(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={submitAnswer} disabled={!selectedAnswer}>
              {testState.currentIndex === testState.preguntas.length - 1
                ? 'Finalizar'
                : 'Siguiente'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Vista inicial
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Link
        href={`/estudiar/${slug}`}
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        ← Volver
      </Link>

      {/* Demo Mode Banner */}
      {DEMO_MODE && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-medium text-yellow-800">Modo Demo</p>
            <p className="text-sm text-yellow-700">Preguntas de ejemplo sobre la Constitucion.</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Test de Practica</CardTitle>
          <CardDescription>
            Responde 10 preguntas aleatorias para evaluar tus conocimientos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground space-y-2">
            <p>• 10 preguntas de opcion multiple</p>
            <p>• Sin limite de tiempo por pregunta</p>
            <p>• Veras los resultados al finalizar</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startTest} disabled={loading} className="w-full">
            {loading ? 'Cargando...' : 'Comenzar Test'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
