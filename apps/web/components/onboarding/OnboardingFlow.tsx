// ===========================================
// OpoMetrics - Onboarding Flow
// Flujo de bienvenida para nuevos usuarios
// ===========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ScoreGauge } from '@/components/opometrics/ScoreGauge'

interface OnboardingData {
  oposicion: string
  experiencia: string
  horasDiarias: string
  objetivo: string
}

const OPOSICIONES = [
  { id: 'auxiliar-age', nombre: 'Auxiliar Administrativo AGE', icono: '🏛️' },
  { id: 'tramitacion', nombre: 'Tramitación Procesal', icono: '⚖️' },
  { id: 'correos', nombre: 'Correos', icono: '📮' },
  { id: 'hacienda', nombre: 'Hacienda', icono: '💰' },
  { id: 'policia', nombre: 'Policía Nacional', icono: '👮' },
  { id: 'otra', nombre: 'Otra oposición', icono: '📚' },
]

const EXPERIENCIAS = [
  { id: 'nuevo', label: 'Empiezo de cero', descripcion: 'Nunca he preparado oposiciones' },
  { id: 'algo', label: 'Algo de experiencia', descripcion: 'He estudiado antes pero no me presenté' },
  { id: 'presentado', label: 'Ya me he presentado', descripcion: 'Tengo experiencia en convocatorias' },
]

const HORAS = [
  { id: '1-2', label: '1-2 horas/día', icono: '🌱' },
  { id: '2-4', label: '2-4 horas/día', icono: '📈' },
  { id: '4-6', label: '4-6 horas/día', icono: '🔥' },
  { id: '6+', label: '+6 horas/día', icono: '🚀' },
]

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onSkip?: () => void
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    oposicion: '',
    experiencia: '',
    horasDiarias: '',
    objetivo: '',
  })

  const totalSteps = 4
  const progress = ((step + 1) / totalSteps) * 100

  const canContinue = () => {
    switch (step) {
      case 0: return !!data.oposicion
      case 1: return !!data.experiencia
      case 2: return !!data.horasDiarias
      case 3: return true
      default: return false
    }
  }

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      onComplete(data)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl border-2">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                Paso {step + 1} de {totalSteps}
              </span>
              {onSkip && (
                <Button variant="ghost" size="sm" onClick={onSkip}>
                  Saltar
                </Button>
              )}
            </div>
            <Progress value={progress} className="h-2 mb-6" />

            <AnimatePresence mode="wait">
              {/* Step 0: Selección de oposición */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-2">¿Qué oposición preparas?</h2>
                  <p className="text-muted-foreground mb-6">
                    Personalizaremos tu experiencia según tu objetivo
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {OPOSICIONES.map((op) => (
                      <button
                        key={op.id}
                        onClick={() => setData({ ...data, oposicion: op.id })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          data.oposicion === op.id
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{op.icono}</span>
                        <span className="font-medium text-sm">{op.nombre}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Experiencia */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-2">¿Cuál es tu experiencia?</h2>
                  <p className="text-muted-foreground mb-6">
                    Adaptaremos el nivel de dificultad inicial
                  </p>
                  <RadioGroup
                    value={data.experiencia}
                    onValueChange={(v: string) => setData({ ...data, experiencia: v })}
                    className="space-y-3"
                  >
                    {EXPERIENCIAS.map((exp) => (
                      <Label
                        key={exp.id}
                        htmlFor={exp.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          data.experiencia === exp.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={exp.id} id={exp.id} className="mt-1" />
                        <div>
                          <div className="font-medium">{exp.label}</div>
                          <div className="text-sm text-muted-foreground">{exp.descripcion}</div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </motion.div>
              )}

              {/* Step 2: Horas diarias */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-2">¿Cuánto tiempo puedes dedicar?</h2>
                  <p className="text-muted-foreground mb-6">
                    Crearemos un plan de estudio realista
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {HORAS.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => setData({ ...data, horasDiarias: h.id })}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          data.horasDiarias === h.id
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-3xl mb-2 block">{h.icono}</span>
                        <span className="font-medium">{h.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Bienvenida final */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <ScoreGauge score={0} size="lg" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">¡Todo listo!</h2>
                  <p className="text-muted-foreground mb-4">
                    Tu OpoMetrics empieza en 0. Cada test, cada minuto de estudio,
                    te acercará a tu meta de 85+.
                  </p>
                  <div className="bg-primary/10 rounded-xl p-4 text-sm">
                    <p className="font-medium text-primary mb-1">Tu objetivo:</p>
                    <p>Alcanzar OpoMetrics 85 para estar listo para aprobar</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botones de navegación */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Atrás
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canContinue()}
                className="flex-1"
              >
                {step === totalSteps - 1 ? '¡Empezar!' : 'Continuar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
