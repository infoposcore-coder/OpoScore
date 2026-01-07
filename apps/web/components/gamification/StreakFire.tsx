// ===========================================
// OpoScore - Componente StreakFire
// Indicador de racha de estudio animado
// ===========================================

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StreakFireProps {
  days: number
  bestStreak: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StreakFire({ days, bestStreak, size = 'md', className }: StreakFireProps) {
  const sizes = {
    sm: { fire: 'text-2xl', text: 'text-lg', sub: 'text-xs' },
    md: { fire: 'text-4xl', text: 'text-2xl', sub: 'text-sm' },
    lg: { fire: 'text-6xl', text: 'text-4xl', sub: 'text-base' },
  }

  const isOnFire = days >= 3
  const isNewRecord = days > 0 && days >= bestStreak

  const getEmoji = () => {
    if (days === 0) return '❄️'
    if (days < 3) return '🔥'
    if (days < 7) return '🔥'
    if (days < 14) return '💥'
    if (days < 30) return '⚡'
    return '🏆'
  }

  const getMessage = () => {
    if (days === 0) return 'Sin racha activa'
    if (days === 1) return '¡Buen comienzo!'
    if (days < 3) return '¡Sigue así!'
    if (days < 7) return '¡Vas genial!'
    if (days < 14) return '¡Imparable!'
    if (days < 30) return '¡Increíble!'
    return '¡Leyenda!'
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.div
        className={cn('relative', sizes[size].fire)}
        animate={isOnFire ? {
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: isOnFire ? Infinity : 0,
          repeatType: 'loop',
        }}
      >
        {getEmoji()}

        {/* Particulas de fuego */}
        {isOnFire && (
          <>
            <motion.span
              className="absolute -top-2 left-1/2 text-xs"
              animate={{ y: [-5, -15], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.span>
            <motion.span
              className="absolute -top-1 left-1/4 text-xs"
              animate={{ y: [-5, -12], opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
            >
              ✨
            </motion.span>
          </>
        )}
      </motion.div>

      <div>
        <motion.div
          className={cn('font-bold', sizes[size].text)}
          key={days}
          initial={{ scale: 1.2, color: '#F97316' }}
          animate={{ scale: 1, color: 'inherit' }}
        >
          {days} {days === 1 ? 'día' : 'días'}
        </motion.div>
        <div className={cn('text-muted-foreground', sizes[size].sub)}>
          {isNewRecord && days > 0 ? (
            <motion.span
              className="text-amber-500 font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              🏆 ¡Nuevo récord!
            </motion.span>
          ) : (
            `Mejor: ${bestStreak} días`
          )}
        </div>
      </div>
    </div>
  )
}

// Componente compacto para la barra lateral
export function StreakBadge({ days }: { days: number }) {
  const isOnFire = days >= 3

  return (
    <motion.div
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium',
        days === 0 ? 'bg-muted text-muted-foreground' : 'bg-orange-500/10 text-orange-600'
      )}
      whileHover={{ scale: 1.05 }}
    >
      <motion.span
        animate={isOnFire ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: isOnFire ? Infinity : 0 }}
      >
        {days === 0 ? '❄️' : '🔥'}
      </motion.span>
      <span>{days}</span>
    </motion.div>
  )
}

// Calendario de racha visual
interface StreakCalendarProps {
  lastDays: boolean[] // Array de los ultimos 7 dias, true = estudio activo
  className?: string
}

export function StreakCalendar({ lastDays, className }: StreakCalendarProps) {
  const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  // Asegurarse de que tenemos exactamente 7 dias
  const days = lastDays.slice(-7)
  while (days.length < 7) {
    days.unshift(false)
  }

  return (
    <div className={cn('flex gap-1', className)}>
      {days.map((active, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <span className="text-xs text-muted-foreground">{dayNames[index]}</span>
          <motion.div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium',
              active
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-muted text-muted-foreground'
            )}
            style={active ? { boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.4)' } : {}}
            whileHover={{ scale: 1.1 }}
          >
            {active ? '✓' : '·'}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

// Componente de motivacion basado en la racha
export function StreakMotivation({ days, bestStreak }: { days: number; bestStreak: number }) {
  const daysToRecord = bestStreak - days + 1

  const getMessage = () => {
    if (days === 0) {
      return {
        title: '¡Empieza tu racha hoy!',
        subtitle: 'Estudia al menos 5 minutos para comenzar',
        color: 'text-muted-foreground'
      }
    }
    if (days < bestStreak) {
      return {
        title: `¡${daysToRecord} ${daysToRecord === 1 ? 'día' : 'días'} para tu récord!`,
        subtitle: 'Sigue así, cada día cuenta',
        color: 'text-orange-500'
      }
    }
    if (days === bestStreak) {
      return {
        title: '¡Igualaste tu récord!',
        subtitle: 'Un día más y lo superas',
        color: 'text-amber-500'
      }
    }
    return {
      title: '¡Nuevo récord personal!',
      subtitle: `Llevas ${days} días consecutivos`,
      color: 'text-green-500'
    }
  }

  const message = getMessage()

  return (
    <motion.div
      className="text-center p-4 rounded-xl bg-muted/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className={cn('font-bold text-lg', message.color)}>
        {message.title}
      </h4>
      <p className="text-sm text-muted-foreground mt-1">
        {message.subtitle}
      </p>
    </motion.div>
  )
}
