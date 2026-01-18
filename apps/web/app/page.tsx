// ===========================================
// OpoMetrics - Landing Page Premium
// Con animaciones, testimonios, FAQ y CTA
// ===========================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Logo, LogoLight } from '@/components/ui/logo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Efecto de escritura
function TypeWriter({ words, className }: { words: string[]; className?: string }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Algoritmos ML disponibles
const mlAlgorithms = [
  { name: 'Regresión Lineal', desc: 'Tendencias básicas', tier: 'Básico' },
  { name: 'Random Forest', desc: 'Predicciones robustas', tier: 'Pro' },
  { name: 'XGBoost', desc: 'Alta precisión', tier: 'Elite' },
  { name: 'Ensemble', desc: 'Múltiples modelos', tier: 'Elite' },
]

// Datos de testimonios
const testimonios = [
  {
    nombre: 'María García',
    avatar: '/avatars/maria.jpg',
    oposicion: 'Auxiliar Administrativo AGE',
    texto: 'El modelo predictivo acertó mi fecha de aprobado con 2 semanas de margen. Increíble precisión.',
    score: 92,
    prediction: '89% probabilidad',
  },
  {
    nombre: 'Carlos Rodríguez',
    avatar: '/avatars/carlos.jpg',
    oposicion: 'Tramitación Procesal',
    texto: 'Las métricas de rendimiento me mostraron exactamente qué temas repasar. Optimicé mi tiempo al máximo.',
    score: 88,
    prediction: '91% probabilidad',
  },
  {
    nombre: 'Laura Martínez',
    avatar: '/avatars/laura.jpg',
    oposicion: 'Correos',
    texto: 'El análisis de tendencias me ayudó a ver mi progreso real, no solo sensaciones. Datos objetivos.',
    score: 85,
    prediction: '87% probabilidad',
  },
]

// FAQ
const faqs = [
  {
    pregunta: '¿Qué algoritmos de ML utilizáis?',
    respuesta: 'Utilizamos una combinación de Regresión Lineal para tendencias básicas, Random Forest para predicciones robustas, XGBoost para alta precisión, y modelos Ensemble que combinan múltiples algoritmos. Cada plan tiene acceso a diferentes niveles de complejidad.',
  },
  {
    pregunta: '¿Cómo funciona la predicción de aprobado?',
    respuesta: 'Nuestro modelo analiza +15 variables: rendimiento en tests, tiempo de estudio, consistencia, velocidad de mejora, comparación con otros opositores que aprobaron, y patrones históricos. La precisión media es del 87%.',
  },
  {
    pregunta: '¿Qué métricas se analizan exactamente?',
    respuesta: 'Analizamos: porcentaje de aciertos global y por tema, evolución temporal, tiempo medio por pregunta, consistencia de estudio, racha de días activos, comparativa con percentiles, y proyección de fecha de preparación óptima.',
  },
  {
    pregunta: '¿Qué oposiciones tenéis disponibles?',
    respuesta: 'Actualmente cubrimos Auxiliar Administrativo del Estado, Tramitación Procesal, Correos y Hacienda. Cada mes añadimos nuevas oposiciones con datos específicos de convocatorias.',
  },
  {
    pregunta: '¿Puedo exportar mis datos y métricas?',
    respuesta: 'Sí, los planes Pro y Elite permiten exportar tus estadísticas completas en CSV y PDF, incluyendo gráficos de evolución y predicciones personalizadas.',
  },
]

// Comparativa
const comparativa = [
  { caracteristica: 'Predicción ML de aprobado', opometrics: true, competencia: false },
  { caracteristica: 'Algoritmos Random Forest/XGBoost', opometrics: true, competencia: false },
  { caracteristica: 'Análisis de +15 variables', opometrics: true, competencia: false },
  { caracteristica: 'Comparativa con opositores aprobados', opometrics: true, competencia: false },
  { caracteristica: 'Tests ilimitados', opometrics: true, competencia: true },
  { caracteristica: 'Tutor IA 24/7', opometrics: true, competencia: false },
  { caracteristica: 'Exportación de métricas', opometrics: true, competencia: false },
  { caracteristica: 'Precio desde 9€/mes', opometrics: true, competencia: false },
]

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-lg border-b shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>
          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Navegacion principal">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </Link>
            <Link href="#testimonios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonios
            </Link>
            <Link href="#comparativa" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Comparativa
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="shadow-lg shadow-primary/25 btn-glow">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <motion.div
          className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 text-center relative">
          {/* Trust badges superiores */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              87% precisión predictiva
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-blue-500/10 text-blue-600 border-blue-500/20">
              +15 variables analizadas
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-purple-500/10 text-purple-600 border-purple-500/20">
              Machine Learning Real
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Datos que predicen{' '}
            <span className="text-gradient-primary">
              <TypeWriter words={['tu aprobado', 'tu éxito', 'tu plaza']} />
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            La primera plataforma de oposiciones con{' '}
            <span className="font-semibold text-foreground">predicción basada en Machine Learning</span>.
            Algoritmos reales (Random Forest, XGBoost, Ensemble) que analizan tu progreso y calculan tu probabilidad real de aprobar.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 h-14 shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all btn-glow group">
                Comenzar ahora - Es gratis
                <motion.svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 group">
                Ver demo interactiva
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {['Sin tarjeta de crédito', 'Cancela cuando quieras', 'Soporte 24/7'].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">Demo en video</Badge>
              <h2 className="text-3xl font-bold mb-4">Mira como funciona</h2>
              <p className="text-muted-foreground">2 minutos para entender por que somos diferentes</p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <motion.button
                  className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Reproducir video de demostracion"
                >
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white/80 text-sm">
                <span>OpoMetrics - Como funciona</span>
                <span>2:34</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OpoMetrics Feature */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Tu puntuación</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tu OpoMetrics: El número que lo cambia todo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Un indicador del 0 al 100 basado en datos reales, no en sensaciones.
              Sabrás exactamente cómo de preparado estás.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-3 max-w-4xl mx-auto stagger-children">
            {[
              { range: '0-30', label: 'Empezando', color: 'from-red-500 to-red-600', bg: 'bg-red-500/10' },
              { range: '31-50', label: 'Progresando', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-500/10' },
              { range: '51-70', label: 'Avanzando', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-500/10' },
              { range: '71-85', label: 'Casi listo', color: 'from-lime-500 to-lime-600', bg: 'bg-lime-500/10' },
              { range: '86-100', label: 'Preparado', color: 'from-green-500 to-green-600', bg: 'bg-green-500/10' },
            ].map((level, i) => (
              <motion.div
                key={level.range}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className={`text-center border-0 ${level.bg} hover:shadow-lg transition-shadow cursor-default`}>
                  <CardHeader className="pb-2 pt-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${level.color} rounded-2xl mx-auto mb-3 shadow-lg flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{level.range.split('-')[1]}</span>
                    </div>
                    <CardTitle className="text-base font-semibold">{level.range}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-medium">{level.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Herramientas</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo para aprobar en un solo lugar
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Diseñado por opositores, para opositores
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: 'Tests ilimitados',
                description: 'Miles de preguntas organizadas por tema y dificultad. Sistema adaptativo que se ajusta a tu nivel.',
                color: 'text-blue-500 bg-blue-500/10'
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: 'Repaso espaciado',
                description: 'Flashcards con algoritmo Leitner. Memoriza el doble en la mitad de tiempo.',
                color: 'text-purple-500 bg-purple-500/10'
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'Tutor IA 24/7',
                description: 'Resuelve dudas al instante. Tu tutor personal que nunca duerme.',
                color: 'text-amber-500 bg-amber-500/10'
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Sistema anti-abandono',
                description: 'Detectamos señales de abandono y te ayudamos a mantener la motivación.',
                color: 'text-rose-500 bg-rose-500/10'
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Simulacros reales',
                description: 'Exámenes cronometrados en condiciones reales. Prepárate para el día D.',
                color: 'text-cyan-500 bg-cyan-500/10'
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Analíticas avanzadas',
                description: 'Visualiza tu evolución tema a tema. Identifica puntos débiles al instante.',
                color: 'text-emerald-500 bg-emerald-500/10'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group card-premium h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20" id="testimonios">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Testimonios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Historias de éxito reales
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Opositores que confiaron en nosotros y consiguieron su plaza
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonios.map((testimonio, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="h-full card-premium">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                        {testimonio.nombre.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle className="text-base">{testimonio.nombre}</CardTitle>
                        <CardDescription className="text-sm">
                          {testimonio.oposicion}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 italic">
                      &ldquo;{testimonio.texto}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/40">
                        {testimonio.score}
                      </div>
                      <span className="text-sm text-green-600 font-medium">OpoMetrics al aprobar</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparativa */}
      <section className="py-20 bg-muted/30" id="comparativa">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Comparativa</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir OpoMetrics?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Compáranos con academias tradicionales
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-medium text-center">
                <div>Caracteristica</div>
                <div className="text-primary">OpoMetrics</div>
                <div className="text-muted-foreground">Competencia</div>
              </div>
              <div className="divide-y">
                {comparativa.map((item, i) => (
                  <motion.div
                    key={i}
                    className="grid grid-cols-3 gap-4 p-4 text-center items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="text-left text-sm">{item.caracteristica}</div>
                    <div>
                      {item.opometrics ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div>
                      {item.competencia ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '87%', label: 'Precisión predictiva', sub: 'En predicción de aprobado' },
              { value: '+15', label: 'Variables ML', sub: 'Analizadas por usuario' },
              { value: '4', label: 'Algoritmos', sub: 'Linear, RF, XGBoost, Ensemble' },
              { value: '50K+', label: 'Predicciones', sub: 'Generadas con éxito' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="font-medium text-foreground">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30" id="faq">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Resolvemos tus dudas antes de empezar
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4 bg-background">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.pregunta}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.respuesta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 gradient-primary text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <LogoLight size="xl" showText={false} className="justify-center mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Empieza hoy. Tu plaza te espera.
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              El 50% de los opositores abandona. Con OpoMetrics sabrás exactamente cuándo estás listo para aprobar.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-10 h-14 shadow-xl">
                Crear cuenta gratis
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={true} />
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OpoMetrics. Hecho con pasión en España.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacidad" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link href="/contacto" className="hover:text-foreground transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CTA Flotante Mobile */}
      <motion.div
        className="fixed bottom-20 left-4 right-4 z-40 lg:hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <Link href="/register">
          <Button className="w-full h-14 text-lg shadow-xl shadow-primary/40">
            Empezar gratis
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
