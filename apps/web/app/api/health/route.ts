// ===========================================
// OpoScore - Health Check API
// ===========================================

import { NextResponse } from 'next/server'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  checks: {
    database: 'ok' | 'error' | 'unconfigured'
    ai: 'ok' | 'error' | 'unconfigured'
    stripe: 'ok' | 'error' | 'unconfigured'
  }
  uptime: number
}

const startTime = Date.now()

export async function GET() {
  const checks: {
    database: 'ok' | 'error' | 'unconfigured'
    ai: 'ok' | 'error' | 'unconfigured'
    stripe: 'ok' | 'error' | 'unconfigured'
  } = {
    database: 'unconfigured',
    ai: 'unconfigured',
    stripe: 'unconfigured',
  }

  // Check Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { error } = await supabase.from('profiles').select('id').limit(1)
      checks.database = error ? 'error' : 'ok'
    } catch {
      checks.database = 'error'
    }
  }

  // Check AI (Groq)
  if (process.env.GROQ_API_KEY) {
    checks.ai = 'ok' // Asumimos OK si la key está configurada
  }

  // Check Stripe
  if (process.env.STRIPE_SECRET_KEY) {
    checks.stripe = 'ok' // Asumimos OK si la key está configurada
  }

  // Determinar status general
  const allChecks = Object.values(checks)
  let status: HealthStatus['status'] = 'healthy'

  if (allChecks.includes('error')) {
    status = 'unhealthy'
  } else if (allChecks.every(c => c === 'unconfigured')) {
    status = 'degraded' // Modo demo
  }

  const healthStatus: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks,
    uptime: Math.floor((Date.now() - startTime) / 1000),
  }

  const httpStatus = status === 'unhealthy' ? 503 : 200

  return NextResponse.json(healthStatus, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
