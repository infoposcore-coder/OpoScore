// ===========================================
// OpoMetrics - Comparación de Vacantes (ELITE)
// Muestra comparativa con plazas y competidores
// ===========================================

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import type { VacancyComparison as VacancyComparisonType } from '@/lib/ml/types'

interface VacancyComparisonProps {
  comparison: VacancyComparisonType
  locked?: boolean
}

export function VacancyComparison({ comparison, locked = false }: VacancyComparisonProps) {
  if (locked) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
          <span className="text-5xl mb-3">🎯</span>
          <p className="font-bold text-lg">Comparativa de Vacantes</p>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Tu posición vs plazas disponibles y otros opositores
          </p>
          <Link href="/precios?upgrade=elite">
            <Button>Desbloquear con Elite</Button>
          </Link>
        </div>
        <CardHeader>
          <CardTitle>Análisis de Vacantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/50 rounded" />
        </CardContent>
      </Card>
    )
  }

  const { convocatoria, competidores, distribucionScores, proyeccion } = comparison

  return (
    <div className="space-y-6">
      {/* Resumen de Convocatoria */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {convocatoria.nombre}
                <Badge variant="secondary" className="text-xs">Elite</Badge>
              </CardTitle>
              <CardDescription>
                {convocatoria.plazasOfertadas.toLocaleString()} plazas ofertadas
                {convocatoria.fechaExamen && ` • Examen: ${formatDate(convocatoria.fechaExamen)}`}
              </CardDescription>
            </div>
            {comparison.dentroDelCorte ? (
              <Badge className="bg-green-500 text-white">Dentro del corte</Badge>
            ) : (
              <Badge variant="destructive">Fuera del corte</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Posición */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold">#{comparison.posicionEstimada}</div>
              <div className="text-sm text-muted-foreground">Tu posición estimada</div>
              <div className="text-xs text-muted-foreground mt-1">
                de {competidores.total.toLocaleString()} en la plataforma
              </div>
            </div>

            {/* Ratio */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold">{convocatoria.ratioPlazasOpositores}%</div>
              <div className="text-sm text-muted-foreground">Ratio plaza/opositor</div>
              <div className="text-xs text-muted-foreground mt-1">
                1 plaza por cada {Math.round(100 / convocatoria.ratioPlazasOpositores)} personas
              </div>
            </div>

            {/* Margen */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={`text-3xl font-bold ${comparison.margenHastaCorte >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {comparison.margenHastaCorte >= 0 ? '+' : ''}{comparison.margenHastaCorte}
              </div>
              <div className="text-sm text-muted-foreground">Margen hasta el corte</div>
              <div className="text-xs text-muted-foreground mt-1">
                {comparison.margenHastaCorte >= 0 ? 'puestos de ventaja' : 'puestos que te faltan'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparación con Competidores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-lg">👥</span>
            Comparación con otros opositores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra visual */}
            <div className="relative h-8 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-red-400/50"
                style={{ width: `${(competidores.mejorQueUsuario / competidores.total) * 100}%` }}
              />
              <div
                className="absolute top-0 h-full bg-yellow-400/50"
                style={{
                  left: `${(competidores.mejorQueUsuario / competidores.total) * 100}%`,
                  width: `${(competidores.mismoNivel / competidores.total) * 100}%`
                }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-green-400/50"
                style={{ width: `${(competidores.peorQueUsuario / competidores.total) * 100}%` }}
              />
              {/* Marcador de posición */}
              <div
                className="absolute top-0 h-full w-1 bg-primary"
                style={{ left: `${(competidores.mejorQueUsuario / competidores.total) * 100}%` }}
              />
            </div>

            {/* Leyenda */}
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span>{competidores.mejorQueUsuario} mejor que tú</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span>{competidores.mismoNivel} similar nivel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>{competidores.peorQueUsuario} por debajo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribución de Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-lg">📊</span>
            Distribución de puntuaciones
          </CardTitle>
          <CardDescription>
            Tu posición en la curva de distribución
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Gráfico simplificado de distribución */}
            <div className="relative">
              {/* Curva de distribución (simplificada con barras) */}
              <div className="flex items-end justify-between h-24 gap-1">
                <div className="flex-1 bg-muted rounded-t" style={{ height: '20%' }} title="P10" />
                <div className="flex-1 bg-muted rounded-t" style={{ height: '40%' }} title="P25" />
                <div className="flex-1 bg-primary/30 rounded-t" style={{ height: '80%' }} title="P50" />
                <div className="flex-1 bg-muted rounded-t" style={{ height: '60%' }} title="P75" />
                <div className="flex-1 bg-muted rounded-t" style={{ height: '30%' }} title="P90" />
              </div>

              {/* Marcador de posición del usuario */}
              <div
                className="absolute bottom-0 w-0.5 bg-primary"
                style={{
                  height: '100%',
                  left: `${getPositionPercentage(distribucionScores)}%`,
                }}
              >
                <div className="absolute -top-6 -translate-x-1/2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  Tú: {distribucionScores.scoreUsuario}
                </div>
              </div>

              {/* Línea de corte */}
              <div
                className="absolute bottom-0 w-0.5 bg-red-500"
                style={{
                  height: '100%',
                  left: `${getScorePercentage(distribucionScores.scoreCorteEstimado, distribucionScores)}%`,
                }}
              >
                <div className="absolute -top-6 -translate-x-1/2 text-xs bg-red-500 text-white px-2 py-0.5 rounded whitespace-nowrap">
                  Corte: {distribucionScores.scoreCorteEstimado}
                </div>
              </div>
            </div>

            {/* Percentiles */}
            <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>P10: {distribucionScores.percentil10}</span>
              <span>P25: {distribucionScores.percentil25}</span>
              <span>P50: {distribucionScores.percentil50}</span>
              <span>P75: {distribucionScores.percentil75}</span>
              <span>P90: {distribucionScores.percentil90}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proyección */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-lg">🔮</span>
            Tu proyección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Probabilidad de plaza */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Probabilidad de conseguir plaza</span>
                <span className="text-2xl font-bold">{proyeccion.probabilidadPlaza}%</span>
              </div>
              <Progress value={proyeccion.probabilidadPlaza} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {proyeccion.probabilidadPlaza >= 70
                  ? 'Tienes muy buenas opciones de conseguir plaza'
                  : proyeccion.probabilidadPlaza >= 40
                  ? 'Sigues en la lucha, mantén el ritmo'
                  : 'Necesitas mejorar para aumentar tus opciones'}
              </p>
            </div>

            {/* Acciones necesarias */}
            <div className="space-y-3">
              {proyeccion.puestosQueFaltan > 0 && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <span className="text-2xl">📈</span>
                  <div>
                    <p className="font-medium text-orange-700 dark:text-orange-300">
                      Subir {proyeccion.puestosQueFaltan} puestos
                    </p>
                    <p className="text-xs text-orange-600/80 dark:text-orange-400/80">
                      para estar en zona segura
                    </p>
                  </div>
                </div>
              )}

              {proyeccion.mejoraNecesaria > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-300">
                      Mejorar {proyeccion.mejoraNecesaria}%
                    </p>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                      para alcanzar nota de corte estimada
                    </p>
                  </div>
                </div>
              )}

              {proyeccion.tiempoEstimado > 0 && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <p className="font-medium text-purple-700 dark:text-purple-300">
                      ~{proyeccion.tiempoEstimado} días
                    </p>
                    <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
                      para alcanzar el nivel necesario
                    </p>
                  </div>
                </div>
              )}

              {proyeccion.puestosQueFaltan === 0 && proyeccion.mejoraNecesaria === 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300">
                      ¡Estás en zona de aprobado!
                    </p>
                    <p className="text-xs text-green-600/80 dark:text-green-400/80">
                      Mantén tu nivel y sigue practicando
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helpers
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function getPositionPercentage(dist: VacancyComparisonType['distribucionScores']): number {
  const { percentil10, percentil90, scoreUsuario } = dist
  const range = percentil90 - percentil10
  if (range === 0) return 50
  return Math.max(5, Math.min(95, ((scoreUsuario - percentil10) / range) * 100))
}

function getScorePercentage(score: number, dist: VacancyComparisonType['distribucionScores']): number {
  const { percentil10, percentil90 } = dist
  const range = percentil90 - percentil10
  if (range === 0) return 50
  return Math.max(5, Math.min(95, ((score - percentil10) / range) * 100))
}
