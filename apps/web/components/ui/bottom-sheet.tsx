// ===========================================
// OpoMetrics - Bottom Sheet Component
// Para mejorar la experiencia mobile
// ===========================================

'use client'

import * as React from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  snapPoints?: number[]
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  className,
}: BottomSheetProps) {
  const dragControls = useDragControls()
  const [currentSnap, setCurrentSnap] = React.useState(0)
  const sheetRef = React.useRef<HTMLDivElement>(null)

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y
    const offset = info.offset.y

    // Si se arrastra hacia abajo con velocidad o distancia suficiente, cerrar
    if (velocity > 500 || offset > 100) {
      onClose()
      return
    }

    // Si se arrastra hacia arriba, ir al siguiente snap point
    if (velocity < -500 || offset < -50) {
      const nextSnap = Math.min(currentSnap + 1, snapPoints.length - 1)
      setCurrentSnap(nextSnap)
      return
    }

    // Encontrar el snap point mas cercano
    const windowHeight = window.innerHeight
    const sheetHeight = sheetRef.current?.offsetHeight || 0
    const currentPosition = sheetHeight / windowHeight

    let closestSnap = 0
    let minDistance = Infinity

    snapPoints.forEach((snap, index) => {
      const distance = Math.abs(currentPosition - snap)
      if (distance < minDistance) {
        minDistance = distance
        closestSnap = index
      }
    })

    setCurrentSnap(closestSnap)
  }

  // Cerrar al presionar Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-2xl',
              'flex flex-col max-h-[90vh]',
              className
            )}
            initial={{ y: '100%' }}
            animate={{ y: `${(1 - snapPoints[currentSnap]) * 100}%` }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Handle */}
            <div
              className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Title */}
            {title && (
              <div className="px-6 pb-4 border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
              {children}
            </div>

            {/* Safe area bottom padding */}
            <div className="safe-area-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook para manejar el bottom sheet
export function useBottomSheet() {
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}

// Componente de accion para el bottom sheet
interface BottomSheetActionProps {
  icon?: React.ReactNode
  label: string
  description?: string
  onClick?: () => void
  destructive?: boolean
  disabled?: boolean
}

export function BottomSheetAction({
  icon,
  label,
  description,
  onClick,
  destructive = false,
  disabled = false,
}: BottomSheetActionProps) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-4 p-4 rounded-xl transition-colors',
        'hover:bg-muted focus:bg-muted focus:outline-none',
        destructive && 'text-destructive hover:bg-destructive/10',
        disabled && 'opacity-50 pointer-events-none'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          destructive ? 'bg-destructive/10' : 'bg-muted'
        )}>
          {icon}
        </div>
      )}
      <div className="flex-1 text-left">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      <svg
        className="w-5 h-5 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}

// Componente de confirmacion para el bottom sheet
interface BottomSheetConfirmProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

export function BottomSheetConfirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
}: BottomSheetConfirmProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="text-center py-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 px-4 rounded-xl border font-medium hover:bg-muted transition-colors"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors',
              destructive
                ? 'bg-destructive hover:bg-destructive/90'
                : 'bg-primary hover:bg-primary/90'
            )}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
