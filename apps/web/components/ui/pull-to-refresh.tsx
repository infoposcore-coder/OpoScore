// ===========================================
// OpoMetrics - Pull to Refresh Component
// Indicador visual de pull-to-refresh para mobile
// ===========================================

'use client'

import * as React from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  disabled?: boolean
  threshold?: number
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isPulling, setIsPulling] = React.useState(false)
  const pullDistance = useMotionValue(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Transformaciones para el indicador
  const scale = useTransform(pullDistance, [0, threshold], [0.5, 1])
  const opacity = useTransform(pullDistance, [0, threshold * 0.5, threshold], [0, 0.5, 1])
  const rotate = useTransform(pullDistance, [0, threshold], [0, 180])

  const startY = React.useRef(0)
  const currentY = React.useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    const scrollTop = containerRef.current?.scrollTop || 0
    if (scrollTop > 0) return // Solo activar si estamos en el top

    startY.current = e.touches[0].clientY
    setIsPulling(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return

    currentY.current = e.touches[0].clientY
    const diff = currentY.current - startY.current

    if (diff > 0) {
      // Aplicar resistencia al pull
      const resistance = 0.5
      const distance = Math.min(diff * resistance, threshold * 1.5)
      pullDistance.set(distance)
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling || disabled || isRefreshing) return

    const distance = pullDistance.get()

    if (distance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    pullDistance.set(0)
    setIsPulling(false)
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-auto', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Indicador de refresh */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && (
          <motion.div
            className="absolute top-0 left-0 right-0 flex justify-center py-4 z-10"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
              style={{ scale, opacity }}
            >
              {isRefreshing ? (
                <motion.svg
                  className="w-5 h-5 text-primary-foreground"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </motion.svg>
              ) : (
                <motion.svg
                  className="w-5 h-5 text-primary-foreground"
                  style={{ rotate }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </motion.svg>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido con offset durante el pull */}
      <motion.div
        style={{
          y: useTransform(pullDistance, (val) => (isPulling || isRefreshing ? val : 0)),
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Componente simple de loading spinner
export function RefreshSpinner({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('flex items-center justify-center py-8', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

// Hook para manejar el estado de refresh
export function useRefresh(refreshFn: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [lastRefreshed, setLastRefreshed] = React.useState<Date | null>(null)

  const refresh = React.useCallback(async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await refreshFn()
      setLastRefreshed(new Date())
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshFn, isRefreshing])

  return { isRefreshing, lastRefreshed, refresh }
}
