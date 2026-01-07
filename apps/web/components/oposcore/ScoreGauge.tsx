// ===========================================
// OpoScore - Componente ScoreGauge Premium
// Con animaciones Framer Motion y Confetti
// ===========================================

'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion, useSpring, useTransform } from 'framer-motion'
import confetti from 'canvas-confetti'

interface ScoreGaugeProps {
  score: number
  previousScore?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
  showChange?: boolean
  animate?: boolean
  onComplete?: () => void
  className?: string
}

const NIVELES = [
  { max: 30, label: 'Empezando', color: '#EF4444', gradient: 'from-red-500 to-red-600' },
  { max: 50, label: 'Progresando', color: '#F97316', gradient: 'from-orange-500 to-orange-600' },
  { max: 70, label: 'Avanzando', color: '#EAB308', gradient: 'from-yellow-500 to-amber-500' },
  { max: 85, label: 'Casi listo', color: '#84CC16', gradient: 'from-lime-500 to-green-500' },
  { max: 100, label: '¡Preparado!', color: '#22C55E', gradient: 'from-green-500 to-emerald-500' },
]

const SIZES = {
  sm: { width: 120, strokeWidth: 10, fontSize: 28, labelSize: 10 },
  md: { width: 180, strokeWidth: 14, fontSize: 42, labelSize: 14 },
  lg: { width: 240, strokeWidth: 18, fontSize: 56, labelSize: 16 },
  xl: { width: 300, strokeWidth: 22, fontSize: 72, labelSize: 20 },
}

export function ScoreGauge({
  score,
  previousScore,
  size = 'md',
  showLabel = true,
  showChange = true,
  animate = true,
  onComplete,
  className,
}: ScoreGaugeProps) {
  const { width, strokeWidth, fontSize, labelSize } = SIZES[size]
  const radius = (width - strokeWidth) / 2

  const nivel = NIVELES.find(n => score <= n.max) || NIVELES[NIVELES.length - 1]
  const change = previousScore !== undefined ? score - previousScore : 0

  // Animacion del numero
  const spring = useSpring(animate ? 0 : score, {
    stiffness: 50,
    damping: 20,
  })

  const displayScore = useTransform(spring, (val) => Math.round(val))
  const [animatedScore, setAnimatedScore] = useState(animate ? 0 : score)

  useEffect(() => {
    spring.set(score)
    const unsubscribe = displayScore.on('change', (val) => {
      setAnimatedScore(val)
    })

    // Confetti si llega a 86+
    if (animate && score >= 86 && (previousScore === undefined || previousScore < 86)) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22C55E', '#84CC16', '#10B981']
        })
        onComplete?.()
      }, 1500)
      return () => {
        clearTimeout(timer)
        unsubscribe()
      }
    }

    return unsubscribe
  }, [score, spring, displayScore, animate, previousScore, onComplete])

  const progress = (animatedScore / 100) * 180

  return (
    <motion.div
      className={cn('flex flex-col items-center', className)}
      initial={animate ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <svg
          width={width}
          height={width / 2 + strokeWidth + 10}
          className="overflow-visible"
        >
          {/* Sombra del arco */}
          <defs>
            <filter id={`shadow-${score}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={nivel.color} floodOpacity="0.3"/>
            </filter>
            <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={nivel.color} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={nivel.color}/>
            </linearGradient>
          </defs>

          {/* Fondo del gauge */}
          <path
            d={describeArc(width / 2, width / 2, radius, 180, 360)}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
            strokeLinecap="round"
          />

          {/* Progreso con gradiente */}
          <motion.path
            d={describeArc(width / 2, width / 2, radius, 180, 180 + progress)}
            fill="none"
            stroke={`url(#gradient-${score})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter={`url(#shadow-${score})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 180 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Score numerico */}
          <text
            x={width / 2}
            y={width / 2 - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold fill-foreground"
            style={{ fontSize }}
          >
            {animatedScore}
          </text>

          {/* Label "OpoScore" */}
          <text
            x={width / 2}
            y={width / 2 + fontSize / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground font-medium"
            style={{ fontSize: labelSize }}
          >
            OpoScore
          </text>
        </svg>

        {/* Indicador de cambio */}
        {showChange && change !== 0 && (
          <motion.div
            className={cn(
              'absolute -right-2 top-1/4 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
              change > 0 ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}
          </motion.div>
        )}
      </div>

      {showLabel && (
        <motion.div
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span
            className="font-bold text-lg"
            style={{ color: nivel.color }}
          >
            {nivel.label}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

// Helper para dibujar arcos
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ')
}

// Componente de desglose del score
interface ScoreBreakdownProps {
  desglose: {
    completado: number
    aciertos: number
    constancia: number
    tiempo: number
    tendencia: number
  }
}

export function ScoreBreakdown({ desglose }: ScoreBreakdownProps) {
  const items = [
    { label: 'Temario completado', value: desglose.completado, weight: 25, color: '#3B82F6' },
    { label: 'Aciertos en tests', value: desglose.aciertos, weight: 35, color: '#22C55E' },
    { label: 'Constancia (racha)', value: desglose.constancia, weight: 20, color: '#F97316' },
    { label: 'Tiempo de estudio', value: desglose.tiempo, weight: 10, color: '#8B5CF6' },
    { label: 'Tendencia', value: desglose.tendencia, weight: 10, color: '#06B6D4' },
  ]

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold">
              {item.value}% <span className="text-muted-foreground text-xs font-normal">({item.weight}%)</span>
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Mini gauge para usar en listas
export function MiniScoreGauge({ score }: { score: number }) {
  const nivel = NIVELES.find(n => score <= n.max) || NIVELES[NIVELES.length - 1]

  return (
    <motion.div
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
        style={{
          backgroundColor: nivel.color,
          boxShadow: `0 4px 14px 0 ${nivel.color}40`
        }}
      >
        {score}
      </div>
    </motion.div>
  )
}

// Score Badge compacto
export function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const nivel = NIVELES.find(n => score <= n.max) || NIVELES[NIVELES.length - 1]

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  }

  return (
    <motion.div
      className={cn(
        'rounded-2xl flex items-center justify-center text-white font-bold',
        sizes[size]
      )}
      style={{
        backgroundColor: nivel.color,
        boxShadow: `0 4px 14px 0 ${nivel.color}40`
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {score}
    </motion.div>
  )
}
