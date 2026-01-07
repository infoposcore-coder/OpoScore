// ===========================================
// OpoScore - Logo Component
// ===========================================

'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
  animated?: boolean
}

export function Logo({
  size = 'md',
  showText = true,
  className,
  animated = true
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'relative rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 p-1.5 shadow-lg',
        animated && 'transition-transform hover:scale-105',
        sizeClasses[size]
      )}>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10" />

        {/* Icon - Stylized "O" with score indicator */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full text-primary-foreground"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={animated ? 'animate-[spin_20s_linear_infinite]' : ''}
            strokeDasharray="40 16"
          />
          {/* Inner progress arc */}
          <path
            d="M12 5 A7 7 0 0 1 19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          {/* Center dot with pulse */}
          <circle
            cx="12"
            cy="12"
            r="3"
            fill="currentColor"
            className={animated ? 'animate-pulse' : ''}
          />
          {/* Score indicator line */}
          <path
            d="M12 12 L16 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn(
            'font-bold tracking-tight',
            textSizes[size]
          )}>
            <span className="text-primary">Opo</span>
            <span className="text-foreground">Score</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
              Academia IA
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Logo variant for dark backgrounds
export function LogoLight({
  size = 'md',
  showText = true,
  className
}: Omit<LogoProps, 'animated'>) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'rounded-xl bg-white/10 backdrop-blur p-1.5',
        sizeClasses[size]
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="40 16"
          />
          <path
            d="M12 5 A7 7 0 0 1 19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path
            d="M12 12 L16 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={cn('font-bold tracking-tight text-white', textSizes[size])}>
          OpoScore
        </span>
      )}
    </div>
  )
}
