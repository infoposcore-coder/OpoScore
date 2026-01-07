// ===========================================
// OpoScore - Achievement Badge System
// Sistema de logros y badges gamificado
// ===========================================

'use client'

import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Achievement {
  id: string
  nombre: string
  descripcion: string
  icono: string
  color: string
  desbloqueado: boolean
  progreso?: number
  total?: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-test',
    nombre: 'Primer paso',
    descripcion: 'Completa tu primer test',
    icono: '🎯',
    color: 'from-blue-500 to-blue-600',
    desbloqueado: true,
  },
  {
    id: 'streak-7',
    nombre: 'En racha',
    descripcion: '7 días seguidos estudiando',
    icono: '🔥',
    color: 'from-orange-500 to-red-500',
    desbloqueado: true,
  },
  {
    id: 'perfect-test',
    nombre: 'Perfección',
    descripcion: '100% en un test de 20+ preguntas',
    icono: '💯',
    color: 'from-yellow-400 to-amber-500',
    desbloqueado: false,
    progreso: 95,
    total: 100,
  },
  {
    id: 'oposcore-50',
    nombre: 'En progreso',
    descripcion: 'Alcanza OpoScore 50',
    icono: '📈',
    color: 'from-green-500 to-emerald-500',
    desbloqueado: true,
  },
  {
    id: 'oposcore-85',
    nombre: 'Casi listo',
    descripcion: 'Alcanza OpoScore 85',
    icono: '🏆',
    color: 'from-purple-500 to-violet-500',
    desbloqueado: false,
    progreso: 67,
    total: 85,
  },
  {
    id: 'night-owl',
    nombre: 'Búho nocturno',
    descripcion: 'Estudia después de medianoche',
    icono: '🦉',
    color: 'from-indigo-500 to-purple-500',
    desbloqueado: false,
  },
  {
    id: '1000-questions',
    nombre: 'Incansable',
    descripcion: 'Responde 1000 preguntas',
    icono: '💪',
    color: 'from-rose-500 to-pink-500',
    desbloqueado: false,
    progreso: 342,
    total: 1000,
  },
  {
    id: 'social',
    nombre: 'Social',
    descripcion: 'Invita a un amigo',
    icono: '👥',
    color: 'from-cyan-500 to-teal-500',
    desbloqueado: false,
  },
]

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const sizes = {
    sm: { box: 'w-12 h-12', icon: 'text-xl', ring: 'w-14 h-14' },
    md: { box: 'w-16 h-16', icon: 'text-2xl', ring: 'w-18 h-18' },
    lg: { box: 'w-20 h-20', icon: 'text-3xl', ring: 'w-22 h-22' },
  }

  const progressPercent = achievement.progreso && achievement.total
    ? (achievement.progreso / achievement.total) * 100
    : 0

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`${sizes[size].box} rounded-2xl flex items-center justify-center relative overflow-hidden ${
                achievement.desbloqueado
                  ? `bg-gradient-to-br ${achievement.color} shadow-lg`
                  : 'bg-muted'
              }`}
            >
              <span className={`${sizes[size].icon} ${achievement.desbloqueado ? '' : 'grayscale opacity-40'}`}>
                {achievement.icono}
              </span>

              {/* Progreso circular si no está desbloqueado */}
              {!achievement.desbloqueado && achievement.progreso !== undefined && (
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-primary/30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercent * 2.83} 283`}
                    className="text-primary"
                  />
                </svg>
              )}
            </div>

            {/* Check si está desbloqueado */}
            {achievement.desbloqueado && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{achievement.nombre}</p>
          <p className="text-sm text-muted-foreground">{achievement.descripcion}</p>
          {!achievement.desbloqueado && achievement.progreso !== undefined && (
            <p className="text-xs text-primary mt-1">
              Progreso: {achievement.progreso}/{achievement.total}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Grid de logros
interface AchievementGridProps {
  achievements?: Achievement[]
}

export function AchievementGrid({ achievements = ACHIEVEMENTS }: AchievementGridProps) {
  const desbloqueados = achievements.filter(a => a.desbloqueado).length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Logros</h3>
        <span className="text-sm text-muted-foreground">
          {desbloqueados}/{achievements.length} desbloqueados
        </span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <AchievementBadge achievement={achievement} size="sm" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Componente de nuevo logro desbloqueado (para notificaciones)
interface NewAchievementProps {
  achievement: Achievement
  onClose?: () => void
}

export function NewAchievementUnlocked({ achievement, onClose }: NewAchievementProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card border rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          {achievement.icono}
        </motion.div>
        <motion.h2
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ¡Logro desbloqueado!
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xl font-medium text-primary mb-1">{achievement.nombre}</p>
          <p className="text-muted-foreground">{achievement.descripcion}</p>
        </motion.div>
        <motion.button
          className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Continuar
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
