// ===========================================
// OpoScore - Página de Simulacros
// Requiere plan Premium o superior
// ===========================================

'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { PlanGate } from '@/components/billing/PlanGate'

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

// Función para generar preguntas mock variadas
function generarPreguntasMock(): Pregunta[] {
  const temas = [
    // Constitución Española
    { e: 'La Constitución Española fue aprobada por las Cortes el:', c: '31 de octubre de 1978', i: ['6 de diciembre de 1978', '27 de diciembre de 1978', '29 de diciembre de 1978'] },
    { e: '¿Qué artículo establece la mayoría de edad a los 18 años?', c: 'Artículo 12', i: ['Artículo 10', 'Artículo 14', 'Artículo 16'] },
    { e: 'La bandera de España está formada por:', c: 'Tres franjas horizontales, roja, amarilla y roja', i: ['Dos franjas horizontales, roja y amarilla', 'Tres franjas verticales', 'Cuatro franjas horizontales'] },
    { e: 'El Título II de la Constitución trata sobre:', c: 'La Corona', i: ['Los derechos fundamentales', 'Las Cortes Generales', 'El Gobierno'] },
    { e: '¿Cuántos artículos tiene la Constitución Española?', c: '169 artículos', i: ['155 artículos', '175 artículos', '160 artículos'] },
    { e: 'El derecho a la educación se recoge en el artículo:', c: 'Artículo 27', i: ['Artículo 25', 'Artículo 29', 'Artículo 31'] },
    { e: '¿Quién propone el nombramiento del Presidente del Gobierno?', c: 'El Rey', i: ['El Congreso', 'El Senado', 'El Tribunal Constitucional'] },
    { e: 'La capital del Estado es:', c: 'La villa de Madrid', i: ['No se especifica en la Constitución', 'La ciudad de Madrid', 'El municipio de Madrid'] },
    { e: 'El recurso de amparo se presenta ante:', c: 'El Tribunal Constitucional', i: ['El Tribunal Supremo', 'El Defensor del Pueblo', 'Las Cortes Generales'] },
    { e: 'El mandato del Defensor del Pueblo es de:', c: '5 años', i: ['4 años', '6 años', 'Indefinido'] },
    // Procedimiento administrativo
    { e: 'El plazo máximo para resolver un procedimiento administrativo es:', c: '3 meses si no se establece otro', i: ['6 meses', '1 mes', '2 meses'] },
    { e: 'El silencio administrativo será positivo:', c: 'Como regla general en los procedimientos iniciados a solicitud del interesado', i: ['Siempre', 'Nunca', 'Solo en procedimientos sancionadores'] },
    { e: 'La notificación defectuosa:', c: 'Surtirá efecto a partir de la fecha en que el interesado realice actuaciones que supongan conocimiento', i: ['Es nula de pleno derecho', 'No produce ningún efecto', 'Debe repetirse siempre'] },
    { e: 'El recurso de alzada se interpone ante:', c: 'El superior jerárquico del órgano que dictó el acto', i: ['El mismo órgano que dictó el acto', 'El Consejo de Estado', 'Los tribunales ordinarios'] },
    { e: 'El plazo para interponer recurso de alzada es de:', c: 'Un mes si el acto es expreso', i: ['15 días', 'Dos meses', 'Tres meses'] },
    { e: 'Los actos administrativos que ponen fin a la vía administrativa son:', c: 'Recurso potestativo de reposición o contencioso-administrativo', i: ['Solo recurso de alzada', 'Solo contencioso-administrativo', 'Recurso extraordinario de revisión'] },
    { e: 'La Ley 39/2015 regula:', c: 'El procedimiento administrativo común', i: ['El régimen jurídico del sector público', 'Los contratos públicos', 'El empleo público'] },
    { e: 'La Ley 40/2015 regula:', c: 'El régimen jurídico del sector público', i: ['El procedimiento administrativo común', 'Los contratos públicos', 'La transparencia'] },
    { e: 'Un acto administrativo es nulo de pleno derecho cuando:', c: 'Lesiona derechos y libertades susceptibles de amparo constitucional', i: ['Tiene un defecto de forma', 'Se dicta fuera de plazo', 'No está motivado'] },
    { e: 'La caducidad del procedimiento:', c: 'No produce por sí sola la prescripción de las acciones', i: ['Produce siempre la prescripción', 'Es igual que la prescripción', 'Solo afecta a procedimientos sancionadores'] },
    // Organización administrativa
    { e: 'Los Ministerios se crean, modifican y suprimen por:', c: 'Real Decreto del Presidente del Gobierno', i: ['Ley orgánica', 'Ley ordinaria', 'Orden ministerial'] },
    { e: 'Las Secretarías de Estado son órganos:', c: 'Directivos', i: ['Superiores', 'De apoyo', 'Consultivos'] },
    { e: 'El Consejo de Ministros es presidido por:', c: 'El Presidente del Gobierno', i: ['El Rey', 'El ministro de mayor antigüedad', 'El Vicepresidente'] },
    { e: 'La Administración General del Estado se organiza en:', c: 'Ministerios', i: ['Consejerías', 'Departamentos', 'Delegaciones'] },
    { e: 'Los Subsecretarios son nombrados por:', c: 'Real Decreto del Consejo de Ministros', i: ['El ministro correspondiente', 'El Presidente del Gobierno', 'El Rey'] },
    { e: 'Las Direcciones Generales son órganos:', c: 'Directivos', i: ['Superiores', 'De coordinación', 'Consultivos'] },
    { e: 'El Delegado del Gobierno en las Comunidades Autónomas representa:', c: 'Al Gobierno de la Nación', i: ['A la Comunidad Autónoma', 'Al Rey', 'A las Cortes Generales'] },
    { e: 'Los Subdelegados del Gobierno dependen de:', c: 'El Delegado del Gobierno', i: ['El Ministro del Interior', 'El Presidente del Gobierno', 'El Secretario de Estado'] },
    { e: 'La Comisión General de Secretarios de Estado y Subsecretarios:', c: 'Prepara las sesiones del Consejo de Ministros', i: ['Sustituye al Consejo de Ministros', 'Es un órgano consultivo', 'Tiene funciones legislativas'] },
    { e: 'Los órganos colegiados de la AGE se regulan en:', c: 'La Ley 40/2015', i: ['La Ley 39/2015', 'La Constitución', 'El Estatuto Básico del Empleado Público'] },
    // Empleados públicos
    { e: 'El EBEP es:', c: 'El Estatuto Básico del Empleado Público', i: ['El Estatuto de los Trabajadores', 'El Estatuto de Autonomía', 'El Estatuto de los Funcionarios'] },
    { e: 'Los funcionarios interinos:', c: 'Desempeñan funciones propias de funcionarios de carrera con carácter temporal', i: ['Son indefinidos', 'No pueden ocupar puestos de funcionarios', 'Tienen los mismos derechos que los de carrera'] },
    { e: 'La provisión de puestos de trabajo se realiza por:', c: 'Concurso o libre designación', i: ['Solo por concurso', 'Solo por libre designación', 'Oposición'] },
    { e: 'El personal laboral se selecciona mediante:', c: 'Convocatoria pública basada en principios de igualdad, mérito y capacidad', i: ['Designación directa', 'Concurso-oposición siempre', 'Selección libre'] },
    { e: 'Las vacaciones de los funcionarios tienen una duración de:', c: '22 días hábiles como mínimo', i: ['30 días naturales', '15 días hábiles', '1 mes'] },
    { e: 'La excedencia voluntaria por interés particular requiere:', c: 'Haber prestado servicios efectivos durante 5 años', i: ['2 años de servicios', '3 años de servicios', '10 años de servicios'] },
    { e: 'El régimen disciplinario de los funcionarios establece faltas:', c: 'Muy graves, graves y leves', i: ['Graves y leves', 'Muy graves y graves', 'Solo graves'] },
    { e: 'La sanción por falta muy grave puede ser:', c: 'Separación del servicio', i: ['Amonestación', 'Suspensión de 3 días', 'Traslado forzoso temporal'] },
    { e: 'La carrera profesional de los funcionarios incluye:', c: 'La carrera horizontal y vertical', i: ['Solo la vertical', 'Solo la horizontal', 'La carrera oblicua'] },
    { e: 'Los permisos por nacimiento de hijo para el otro progenitor son de:', c: '16 semanas', i: ['8 semanas', '12 semanas', '4 semanas'] },
    // Informática básica
    { e: 'Un gigabyte equivale a:', c: '1024 megabytes', i: ['1000 megabytes', '1024 kilobytes', '100 megabytes'] },
    { e: 'El sistema operativo Windows es desarrollado por:', c: 'Microsoft', i: ['Apple', 'Google', 'IBM'] },
    { e: 'En Excel, para sumar un rango se usa la función:', c: 'SUMA', i: ['CONTAR', 'PROMEDIO', 'MAX'] },
    { e: 'El formato PDF fue creado por:', c: 'Adobe', i: ['Microsoft', 'Google', 'Apple'] },
    { e: 'RAM significa:', c: 'Random Access Memory', i: ['Read Access Memory', 'Rapid Access Memory', 'Real Access Memory'] },
    { e: 'El protocolo HTTPS utiliza el puerto:', c: '443', i: ['80', '21', '25'] },
    { e: 'Un navegador web es:', c: 'Un programa para acceder a páginas web', i: ['Un sistema operativo', 'Un procesador de textos', 'Una base de datos'] },
    { e: 'El teclado QWERTY se llama así por:', c: 'Las primeras letras de la fila superior', i: ['Su inventor', 'La empresa que lo creó', 'El país de origen'] },
    { e: 'USB significa:', c: 'Universal Serial Bus', i: ['Unique System Bus', 'Universal System Board', 'United Serial Bus'] },
    { e: 'La extensión .docx corresponde a:', c: 'Microsoft Word', i: ['Microsoft Excel', 'Adobe Acrobat', 'LibreOffice Calc'] },
  ]

  return temas.map((tema, index) => {
    const respuestas = [
      { id: `r${index}a`, texto: tema.c, orden: 1, es_correcta: true },
      ...tema.i.map((inc, i) => ({ id: `r${index}${String.fromCharCode(98 + i)}`, texto: inc, orden: i + 2, es_correcta: false })),
    ].sort(() => Math.random() - 0.5).map((r, i) => ({ ...r, orden: i + 1 }))

    return {
      id: `p${index + 1}`,
      enunciado: tema.e,
      respuestas,
    }
  })
}

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

interface SimulacroState {
  preguntas: Pregunta[]
  respuestas: Map<string, string>
  tiempoInicio: number
  tiempoRestante: number
  finished: boolean
}

const TIEMPO_SIMULACRO_MINUTOS = 60
const PREGUNTAS_SIMULACRO = 50

function SimulacrosContent() {
  const searchParams = useSearchParams()
  const oposicionSlug = searchParams.get('oposicion')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [simulacro, setSimulacro] = useState<SimulacroState | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)

  // Timer
  useEffect(() => {
    if (!simulacro || simulacro.finished) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - simulacro.tiempoInicio) / 1000)
      const restante = TIEMPO_SIMULACRO_MINUTOS * 60 - elapsed

      if (restante <= 0) {
        // Tiempo agotado
        setSimulacro((prev) => prev ? { ...prev, finished: true, tiempoRestante: 0 } : null)
        setShowResults(true)
        clearInterval(interval)
      } else {
        setSimulacro((prev) => prev ? { ...prev, tiempoRestante: restante } : null)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [simulacro?.tiempoInicio, simulacro?.finished])

  const startSimulacro = async () => {
    setLoading(true)
    setError(null)

    try {
      let preguntas: Pregunta[] = []

      if (DEMO_MODE) {
        // Usar preguntas mock en modo demo
        preguntas = generarPreguntasMock().sort(() => Math.random() - 0.5)
      } else {
        const supabase = createClient()

        // Obtener preguntas aleatorias
        const { data: preguntasData, error: preguntasError } = await supabase
          .from('preguntas')
          .select(`
            id,
            enunciado,
            respuestas (id, texto, orden, es_correcta)
          `)
          .limit(PREGUNTAS_SIMULACRO)

        if (preguntasError || !preguntasData || preguntasData.length === 0) {
          setError('No hay suficientes preguntas para el simulacro')
          return
        }

        // Mezclar preguntas
        preguntas = [...preguntasData].sort(() => Math.random() - 0.5) as Pregunta[]
      }

      setSimulacro({
        preguntas,
        respuestas: new Map(),
        tiempoInicio: Date.now(),
        tiempoRestante: TIEMPO_SIMULACRO_MINUTOS * 60,
        finished: false,
      })
      setCurrentIndex(0)
    } catch {
      setError('Error al cargar el simulacro')
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = useCallback((preguntaId: string, respuestaId: string) => {
    if (!simulacro || simulacro.finished) return

    const nuevasRespuestas = new Map(simulacro.respuestas)
    nuevasRespuestas.set(preguntaId, respuestaId)

    setSimulacro({
      ...simulacro,
      respuestas: nuevasRespuestas,
    })
  }, [simulacro])

  const finishSimulacro = () => {
    if (!simulacro) return

    setSimulacro({
      ...simulacro,
      finished: true,
    })
    setShowResults(true)
  }

  const calcularResultados = () => {
    if (!simulacro) return { aciertos: 0, total: 0, respondidas: 0, porcentaje: 0, tiempoUsado: 0 }

    let aciertos = 0
    simulacro.respuestas.forEach((respuestaId, preguntaId) => {
      const pregunta = simulacro.preguntas.find((p) => p.id === preguntaId)
      const respuestaCorrecta = pregunta?.respuestas.find((r) => r.es_correcta)
      if (respuestaCorrecta?.id === respuestaId) {
        aciertos++
      }
    })

    const tiempoUsado = TIEMPO_SIMULACRO_MINUTOS * 60 - (simulacro.tiempoRestante || 0)

    return {
      aciertos,
      total: simulacro.preguntas.length,
      respondidas: simulacro.respuestas.size,
      porcentaje: Math.round((aciertos / simulacro.preguntas.length) * 100),
      tiempoUsado,
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Vista de resultados
  if (showResults && simulacro) {
    const resultados = calcularResultados()

    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Resultados del Simulacro</CardTitle>
            <CardDescription>
              Examen tipo oposición completado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-6xl font-bold text-primary">
                {resultados.aciertos}/{resultados.total}
              </p>
              <p className="text-xl text-muted-foreground mt-2">
                {resultados.porcentaje}% de aciertos
              </p>
            </div>

            <Progress value={resultados.porcentaje} className="h-4" />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{resultados.aciertos}</p>
                <p className="text-sm text-muted-foreground">Correctas</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {resultados.respondidas - resultados.aciertos}
                </p>
                <p className="text-sm text-muted-foreground">Incorrectas</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">
                  {resultados.total - resultados.respondidas}
                </p>
                <p className="text-sm text-muted-foreground">Sin responder</p>
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Tiempo utilizado</p>
              <p className="text-xl font-bold">{formatTime(resultados.tiempoUsado)}</p>
            </div>

            {resultados.porcentaje >= 60 ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  ¡Aprobado! Has superado el umbral mínimo del 60%.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>
                  Necesitas al menos un 60% para aprobar. ¡Sigue practicando!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSimulacro(null)
                setShowResults(false)
                setCurrentIndex(0)
              }}
            >
              Nuevo simulacro
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/dashboard">Ir al dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Vista del simulacro en curso
  if (simulacro && !simulacro.finished) {
    const pregunta = simulacro.preguntas[currentIndex]
    const respuestaActual = simulacro.respuestas.get(pregunta.id)
    const respondidas = simulacro.respuestas.size
    const isLowTime = simulacro.tiempoRestante < 300 // menos de 5 minutos

    return (
      <div className="container py-4 max-w-3xl mx-auto">
        {/* Header fijo */}
        <div className="sticky top-0 bg-background z-10 pb-4 border-b mb-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={isLowTime ? 'destructive' : 'secondary'} className="text-lg px-3 py-1">
              {formatTime(simulacro.tiempoRestante)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {respondidas}/{simulacro.preguntas.length} respondidas
            </span>
          </div>
          <Progress
            value={(respondidas / simulacro.preguntas.length) * 100}
            className="h-2"
          />
        </div>

        {/* Navegación de preguntas */}
        <div className="flex flex-wrap gap-1 mb-4">
          {simulacro.preguntas.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 text-xs rounded ${
                i === currentIndex
                  ? 'bg-primary text-primary-foreground'
                  : simulacro.respuestas.has(p.id)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-muted'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Pregunta actual */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Pregunta {currentIndex + 1} de {simulacro.preguntas.length}</span>
            </div>
            <CardTitle className="text-lg font-medium leading-relaxed">
              {pregunta.enunciado}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={respuestaActual || ''}
              onValueChange={(value: string) => selectAnswer(pregunta.id, value)}
            >
              {pregunta.respuestas
                .sort((a, b) => a.orden - b.orden)
                .map((respuesta) => (
                  <div
                    key={respuesta.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => selectAnswer(pregunta.id, respuesta.id)}
                  >
                    <RadioGroupItem value={respuesta.id} id={respuesta.id} />
                    <Label htmlFor={respuesta.id} className="flex-1 cursor-pointer">
                      {respuesta.texto}
                    </Label>
                  </div>
                ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Anterior
            </Button>
            <div className="flex gap-2">
              {currentIndex === simulacro.preguntas.length - 1 ? (
                <Button onClick={finishSimulacro}>
                  Finalizar simulacro
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentIndex((prev) => Math.min(simulacro.preguntas.length - 1, prev + 1))}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Vista inicial
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      {/* Demo Mode Banner */}
      {DEMO_MODE && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">🎮</span>
          <div>
            <p className="font-medium text-yellow-800">Modo Demo</p>
            <p className="text-sm text-yellow-700">Simulacro con 50 preguntas de ejemplo.</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Simulacro de Examen</CardTitle>
          <CardDescription>
            Pon a prueba tus conocimientos en condiciones reales de examen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <span className="font-bold">{PREGUNTAS_SIMULACRO}</span>
              </div>
              <div>
                <p className="font-medium">Preguntas</p>
                <p className="text-sm text-muted-foreground">Tipo test con 4 opciones</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <span className="font-bold">{TIEMPO_SIMULACRO_MINUTOS}</span>
              </div>
              <div>
                <p className="font-medium">Minutos</p>
                <p className="text-sm text-muted-foreground">Tiempo máximo para completar</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <span className="font-bold">60%</span>
              </div>
              <div>
                <p className="font-medium">Nota mínima</p>
                <p className="text-sm text-muted-foreground">Para considerar aprobado</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Una vez iniciado, el temporizador no se puede pausar.
            Puedes navegar entre preguntas y cambiar respuestas.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={startSimulacro} disabled={loading} className="w-full" size="lg">
            {loading ? 'Preparando...' : 'Comenzar Simulacro'}
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/dashboard">Volver al dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function SimulacrosPage() {
  return (
    <PlanGate feature="simulacros">
      <Suspense fallback={
        <div className="container py-8 max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Cargando simulacros...</p>
            </CardContent>
          </Card>
        </div>
      }>
        <SimulacrosContent />
      </Suspense>
    </PlanGate>
  )
}
