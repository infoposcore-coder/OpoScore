// ===========================================
// OpoMetrics - Logo Component
// Diseño orientado a métricas y datos
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
        'relative rounded-xl bg-gradient-to-br from-primary via-primary to-emerald-500 p-1.5 shadow-lg',
        animated && 'transition-transform hover:scale-105',
        sizeClasses[size]
      )}>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10" />

        {/* Icon - Chart/Metrics design */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full text-primary-foreground"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background grid dots */}
          <circle cx="6" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="12" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="18" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="6" cy="12" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="18" cy="12" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="6" cy="18" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="12" cy="18" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="18" cy="18" r="0.5" fill="currentColor" opacity="0.3" />

          {/* Rising chart line */}
          <path
            d="M4 18 L8 14 L12 16 L16 10 L20 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className={animated ? 'animate-[draw_2s_ease-in-out_infinite]' : ''}
          />

          {/* Data points */}
          <circle cx="8" cy="14" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="16" cy="10" r="1.5" fill="currentColor" opacity="0.8" />

          {/* Peak indicator with pulse */}
          <circle
            cx="20"
            cy="6"
            r="2"
            fill="currentColor"
            className={animated ? 'animate-pulse' : ''}
          />

          {/* Arrow up indicator */}
          <path
            d="M20 4 L20 2 M19 3 L20 2 L21 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
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
            <span className="text-foreground">Metrics</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
              Predicción con IA
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
          {/* Grid dots */}
          <circle cx="6" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="12" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="18" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="6" cy="18" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="12" cy="18" r="0.5" fill="currentColor" opacity="0.3" />
          <circle cx="18" cy="18" r="0.5" fill="currentColor" opacity="0.3" />

          {/* Chart line */}
          <path
            d="M4 18 L8 14 L12 16 L16 10 L20 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Data points */}
          <circle cx="8" cy="14" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="16" cy="10" r="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="20" cy="6" r="2" fill="currentColor" />

          {/* Arrow */}
          <path
            d="M20 4 L20 2 M19 3 L20 2 L21 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={cn('font-bold tracking-tight text-white', textSizes[size])}>
          OpoMetrics
        </span>
      )}
    </div>
  )
}
