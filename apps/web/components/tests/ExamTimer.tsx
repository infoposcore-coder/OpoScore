// ===========================================
// OpoMetrics - Exam Timer Component
// Temporizador para simulacros y examenes
// ===========================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface ExamTimerProps {
  totalMinutes: number
  onTimeUp: () => void
  isPaused?: boolean
  className?: string
}

export function ExamTimer({ totalMinutes, onTimeUp, isPaused = false, className = '' }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60)
  const [isWarning, setIsWarning] = useState(false)
  const [isDanger, setIsDanger] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, onTimeUp])

  useEffect(() => {
    const fiveMinutes = 5 * 60
    const oneMinute = 60

    setIsWarning(secondsLeft <= fiveMinutes && secondsLeft > oneMinute)
    setIsDanger(secondsLeft <= oneMinute)
  }, [secondsLeft])

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }, [])

  const percentage = (secondsLeft / (totalMinutes * 60)) * 100

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Indicador visual */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-muted"
            strokeWidth="2"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={`${
              isDanger
                ? 'stroke-red-500'
                : isWarning
                ? 'stroke-amber-500'
                : 'stroke-primary'
            }`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${percentage} 100`}
            initial={false}
            animate={{ strokeDasharray: `${percentage} 100` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">⏱️</span>
        </div>
      </div>

      {/* Tiempo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isDanger ? 'danger' : isWarning ? 'warning' : 'normal'}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`font-mono text-xl font-bold ${
            isDanger
              ? 'text-red-500 animate-pulse'
              : isWarning
              ? 'text-amber-500'
              : 'text-foreground'
          }`}
        >
          {formatTime(secondsLeft)}
        </motion.div>
      </AnimatePresence>

      {/* Badge de advertencia */}
      {(isWarning || isDanger) && (
        <Badge
          variant="outline"
          className={
            isDanger
              ? 'bg-red-500/10 text-red-500 border-red-500/30'
              : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
          }
        >
          {isDanger ? '¡Último minuto!' : '5 min restantes'}
        </Badge>
      )}
    </div>
  )
}

// Componente compacto para usar en el header
interface CompactTimerProps {
  totalMinutes: number
  onTimeUp: () => void
  isPaused?: boolean
}

export function CompactTimer({ totalMinutes, onTimeUp, isPaused = false }: CompactTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, onTimeUp])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const isLowTime = secondsLeft < 300 // menos de 5 minutos
  const isCritical = secondsLeft < 60 // menos de 1 minuto

  return (
    <Badge
      variant={isCritical ? 'destructive' : isLowTime ? 'secondary' : 'outline'}
      className={`text-lg px-3 py-1 font-mono ${isCritical ? 'animate-pulse' : ''}`}
    >
      ⏱️ {formatTime(secondsLeft)}
    </Badge>
  )
}
