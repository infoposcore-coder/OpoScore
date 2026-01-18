// ===========================================
// OpoMetrics - Componente StatsCard Premium
// Tarjeta de estadisticas con animaciones
// ===========================================

'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  description?: string
  icon?: React.ReactNode
  trend?: number
  color?: 'default' | 'success' | 'warning' | 'danger' | 'primary'
  animate?: boolean
  className?: string
}

export function StatsCard({
  title,
  value,
  suffix = '',
  prefix = '',
  description,
  icon,
  trend,
  color = 'default',
  animate = true,
  className,
}: StatsCardProps) {
  const spring = useSpring(animate ? 0 : value, { stiffness: 50, damping: 20 })
  const display = useTransform(spring, (v) => Math.round(v))
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value)

  useEffect(() => {
    spring.set(value)
    const unsubscribe = display.on('change', setDisplayValue)
    return unsubscribe
  }, [value, spring, display])

  const colors = {
    default: 'text-foreground',
    success: 'text-green-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
    primary: 'text-primary',
  }

  const bgColors = {
    default: 'bg-muted',
    success: 'bg-green-500/10',
    warning: 'bg-amber-500/10',
    danger: 'bg-red-500/10',
    primary: 'bg-primary/10',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn('card-premium overflow-hidden', className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className={cn('p-2 rounded-lg', bgColors[color], colors[color])}>
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={cn('text-3xl font-bold', colors[color])}>
              {prefix}{displayValue}{suffix}
            </span>
            {trend !== undefined && trend !== 0 && (
              <motion.span
                className={cn(
                  'text-sm font-medium flex items-center gap-0.5',
                  trend > 0 ? 'text-green-500' : 'text-red-500'
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {trend > 0 ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {Math.abs(trend)}%
              </motion.span>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Grid de stats cards
interface StatsGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  )
}

// Mini stat para uso inline
interface MiniStatProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  color?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export function MiniStat({ label, value, icon, color = 'default', className }: MiniStatProps) {
  const colors = {
    default: 'text-foreground',
    success: 'text-green-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {icon && (
        <div className={cn('w-8 h-8 rounded-lg bg-muted flex items-center justify-center', colors[color])}>
          {icon}
        </div>
      )}
      <div>
        <div className={cn('font-bold', colors[color])}>{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

// Progress stat con barra
interface ProgressStatProps {
  label: string
  value: number
  max?: number
  suffix?: string
  color?: 'default' | 'success' | 'warning' | 'danger' | 'primary'
  showPercentage?: boolean
  className?: string
}

export function ProgressStat({
  label,
  value,
  max = 100,
  suffix = '',
  color = 'primary',
  showPercentage = true,
  className,
}: ProgressStatProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const bgColors = {
    default: 'bg-foreground',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    primary: 'bg-primary',
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}{suffix}
          {showPercentage && max !== 100 && ` / ${max}${suffix}`}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', bgColors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Stat con icono grande
interface IconStatProps {
  icon: React.ReactNode
  value: string | number
  label: string
  color?: 'default' | 'success' | 'warning' | 'danger' | 'primary'
  className?: string
}

export function IconStat({ icon, value, label, color = 'primary', className }: IconStatProps) {
  const colors = {
    default: { bg: 'bg-muted', text: 'text-foreground' },
    success: { bg: 'bg-green-500/10', text: 'text-green-500' },
    warning: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
    danger: { bg: 'bg-red-500/10', text: 'text-red-500' },
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
  }

  return (
    <motion.div
      className={cn('flex flex-col items-center text-center p-4', className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-3', colors[color].bg, colors[color].text)}>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}

// Stat comparativo (vs anterior)
interface ComparisonStatProps {
  label: string
  current: number
  previous: number
  suffix?: string
  higherIsBetter?: boolean
  className?: string
}

export function ComparisonStat({
  label,
  current,
  previous,
  suffix = '',
  higherIsBetter = true,
  className,
}: ComparisonStatProps) {
  const diff = current - previous
  const percentage = previous !== 0 ? Math.round((diff / previous) * 100) : 0
  const isPositive = higherIsBetter ? diff > 0 : diff < 0

  return (
    <div className={cn('space-y-1', className)}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{current}{suffix}</span>
        {diff !== 0 && (
          <span className={cn(
            'text-sm font-medium',
            isPositive ? 'text-green-500' : 'text-red-500'
          )}>
            {diff > 0 ? '+' : ''}{diff}{suffix} ({percentage > 0 ? '+' : ''}{percentage}%)
          </span>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        Anterior: {previous}{suffix}
      </div>
    </div>
  )
}
