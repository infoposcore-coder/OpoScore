// ===========================================
// OpoScore - Empty State Components
// Estados vacíos profesionales
// ===========================================

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center p-8 ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button>{action.label}</Button>
          </Link>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </motion.div>
  )
}

// Empty states predefinidos
export function EmptyTests() {
  return (
    <EmptyState
      icon="📝"
      title="Aún no has hecho ningún test"
      description="Empieza a practicar para ver tu progreso aquí"
      action={{ label: 'Hacer mi primer test', href: '/estudiar' }}
    />
  )
}

export function EmptyProgress() {
  return (
    <EmptyState
      icon="📊"
      title="Sin datos de progreso"
      description="Completa algunos tests para ver tu evolución"
      action={{ label: 'Empezar a estudiar', href: '/estudiar' }}
    />
  )
}

export function EmptyAchievements() {
  return (
    <EmptyState
      icon="🏆"
      title="Aún no tienes logros"
      description="Estudia y completa retos para desbloquear badges"
      action={{ label: 'Ver retos disponibles', href: '/progreso' }}
    />
  )
}

export function EmptyFlashcards() {
  return (
    <EmptyState
      icon="🧠"
      title="Sin flashcards pendientes"
      description="Has completado todas tus revisiones de hoy. ¡Buen trabajo!"
    />
  )
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon="🔍"
      title="Sin resultados"
      description={`No encontramos nada para "${query}"`}
    />
  )
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="😕"
      title="Algo salió mal"
      description="Ha ocurrido un error. Por favor, inténtalo de nuevo."
      action={onRetry ? { label: 'Reintentar', onClick: onRetry } : undefined}
    />
  )
}

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
      <p className="text-sm text-muted-foreground mt-4">Cargando...</p>
    </motion.div>
  )
}

export function ComingSoon({ feature }: { feature: string }) {
  return (
    <EmptyState
      icon="🚀"
      title="Próximamente"
      description={`${feature} estará disponible pronto. ¡Estamos trabajando en ello!`}
    />
  )
}
