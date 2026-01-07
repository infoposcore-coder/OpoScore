// ===========================================
// OpoScore - Pagina de Estudiar
// Vista principal de temas y acciones de estudio
// ===========================================

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScoreGauge } from '@/components/oposcore/ScoreGauge'

// Datos mock de temas
const BLOQUES = [
  {
    id: 'constitucion',
    nombre: 'Constitución Española',
    icono: '📜',
    temas: [
      { id: 1, nombre: 'Título Preliminar', preguntas: 50, completado: 85, dominio: 78 },
      { id: 2, nombre: 'Derechos Fundamentales', preguntas: 80, completado: 60, dominio: 65 },
      { id: 3, nombre: 'La Corona', preguntas: 30, completado: 100, dominio: 92 },
      { id: 4, nombre: 'Las Cortes Generales', preguntas: 60, completado: 40, dominio: 55 },
      { id: 5, nombre: 'Gobierno y Administración', preguntas: 70, completado: 20, dominio: 45 },
    ],
  },
  {
    id: 'procedimiento',
    nombre: 'Procedimiento Administrativo',
    icono: '📋',
    temas: [
      { id: 6, nombre: 'Ley 39/2015 - Disposiciones Generales', preguntas: 60, completado: 30, dominio: 50 },
      { id: 7, nombre: 'Interesados en el Procedimiento', preguntas: 45, completado: 0, dominio: 0 },
      { id: 8, nombre: 'Actos Administrativos', preguntas: 55, completado: 0, dominio: 0 },
      { id: 9, nombre: 'Recursos Administrativos', preguntas: 50, completado: 0, dominio: 0 },
    ],
  },
  {
    id: 'organizacion',
    nombre: 'Organización del Estado',
    icono: '🏛️',
    temas: [
      { id: 10, nombre: 'Ley 40/2015 - Régimen Jurídico', preguntas: 70, completado: 0, dominio: 0 },
      { id: 11, nombre: 'Organización Administrativa', preguntas: 50, completado: 0, dominio: 0 },
      { id: 12, nombre: 'Comunidades Autónomas', preguntas: 40, completado: 0, dominio: 0 },
    ],
  },
]

function getDominioColor(dominio: number) {
  if (dominio >= 85) return 'text-green-500 bg-green-500/10'
  if (dominio >= 70) return 'text-lime-500 bg-lime-500/10'
  if (dominio >= 50) return 'text-yellow-500 bg-yellow-500/10'
  if (dominio > 0) return 'text-orange-500 bg-orange-500/10'
  return 'text-muted-foreground bg-muted'
}

function getDominioLabel(dominio: number) {
  if (dominio >= 85) return 'Dominado'
  if (dominio >= 70) return 'Avanzado'
  if (dominio >= 50) return 'En progreso'
  if (dominio > 0) return 'Iniciado'
  return 'Sin empezar'
}

export default function EstudiarPage() {
  const [bloqueActivo, setBloqueActivo] = useState(BLOQUES[0].id)

  // Calcular estadísticas globales
  const totalTemas = BLOQUES.reduce((acc, b) => acc + b.temas.length, 0)
  const temasCompletados = BLOQUES.reduce(
    (acc, b) => acc + b.temas.filter(t => t.completado >= 80).length,
    0
  )
  const promedioGeneral = Math.round(
    BLOQUES.flatMap(b => b.temas)
      .filter(t => t.dominio > 0)
      .reduce((acc, t, _, arr) => acc + t.dominio / arr.length, 0)
  ) || 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Estudiar</h1>
          <p className="text-muted-foreground">
            Selecciona un tema para hacer tests o repasar
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

      {/* Acciones rapidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/estudiar/test-rapido">
          <Card className="card-hover cursor-pointer h-full">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-medium">Test rápido</div>
              <div className="text-xs text-muted-foreground">10 preguntas aleatorias</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/estudiar/repaso">
          <Card className="card-hover cursor-pointer h-full">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">🔄</div>
              <div className="font-medium">Repaso espaciado</div>
              <div className="text-xs text-muted-foreground">Temas que necesitas repasar</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/estudiar/puntos-debiles">
          <Card className="card-hover cursor-pointer h-full">
            <CardContent className="pt-4 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-medium">Puntos débiles</div>
              <div className="text-xs text-muted-foreground">Temas con menos dominio</div>
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

      {/* Tabs de bloques */}
      <Tabs value={bloqueActivo} onValueChange={setBloqueActivo}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {BLOQUES.map((bloque) => (
            <TabsTrigger key={bloque.id} value={bloque.id} className="gap-2">
              <span>{bloque.icono}</span>
              <span className="hidden sm:inline">{bloque.nombre}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {BLOQUES.map((bloque) => (
          <TabsContent key={bloque.id} value={bloque.id} className="mt-4">
            <div className="grid gap-3">
              {bloque.temas.map((tema, i) => (
                <motion.div
                  key={tema.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Numero de tema */}
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground">
                          {tema.id}
                        </div>

                        {/* Info del tema */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{tema.nombre}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{tema.preguntas} preguntas</span>
                            <span>•</span>
                            <span>{tema.completado}% completado</span>
                          </div>
                          <Progress value={tema.completado} className="h-1.5 mt-2" />
                        </div>

                        {/* Dominio */}
                        <div className="text-center">
                          <Badge className={getDominioColor(tema.dominio)}>
                            {tema.dominio > 0 ? `${tema.dominio}%` : '-'}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getDominioLabel(tema.dominio)}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-2">
                          <Link href={`/estudiar/test/${tema.id}`}>
                            <Button size="sm">
                              {tema.completado > 0 ? 'Continuar' : 'Empezar'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
