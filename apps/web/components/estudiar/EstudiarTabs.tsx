// ===========================================
// OpoScore - Estudiar Tabs (Client Component)
// Componente interactivo para navegar entre bloques
// ===========================================

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  icono: string | null
  orden: number
  temas: Tema[]
}

interface EstudiarTabsProps {
  bloques: Bloque[]
  oposicionSlug: string
}

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

export function EstudiarTabs({ bloques, oposicionSlug }: EstudiarTabsProps) {
  const [bloqueActivo, setBloqueActivo] = useState(bloques[0]?.id || '')

  if (bloques.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-medium mb-2">No hay contenido disponible</h3>
          <p className="text-muted-foreground">
            El temario de esta oposición aún no está disponible.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs value={bloqueActivo} onValueChange={setBloqueActivo}>
      <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 p-1">
        {bloques.map((bloque) => (
          <TabsTrigger key={bloque.id} value={bloque.id} className="gap-2 whitespace-nowrap">
            <span>{bloque.icono}</span>
            <span className="hidden sm:inline">{bloque.nombre}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {bloques.map((bloque) => (
        <TabsContent key={bloque.id} value={bloque.id} className="mt-4">
          <div className="grid gap-3">
            {bloque.temas.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No hay temas en este bloque todavía.
                  </p>
                </CardContent>
              </Card>
            ) : (
              bloque.temas.map((tema, i) => (
                <motion.div
                  key={tema.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Número de tema */}
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground shrink-0">
                          {i + 1}
                        </div>

                        {/* Info del tema */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{tema.nombre}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{tema.preguntas_count} preguntas</span>
                            {tema.completado > 0 && (
                              <>
                                <span>•</span>
                                <span>{tema.completado}% completado</span>
                              </>
                            )}
                          </div>
                          {tema.completado > 0 && (
                            <Progress value={tema.completado} className="h-1.5 mt-2" />
                          )}
                        </div>

                        {/* Dominio */}
                        <div className="text-center hidden sm:block">
                          <Badge className={getDominioColor(tema.dominio)}>
                            {tema.dominio > 0 ? `${tema.dominio}%` : '-'}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getDominioLabel(tema.dominio)}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-2 shrink-0">
                          <Link href={`/estudiar/${oposicionSlug}/test/${tema.id}`}>
                            <Button size="sm">
                              {tema.completado > 0 ? 'Continuar' : 'Empezar'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
