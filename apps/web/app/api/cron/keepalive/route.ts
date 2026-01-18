// ===========================================
// OpoMetrics - Cron Keepalive
// ===========================================
// Endpoint para evitar que Supabase se pause por inactividad
// Llamar cada 5-6 días con un servicio como cron-job.org

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Verificar secret para proteger el endpoint
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const supabase = createServiceClient()

    // Hacer una query simple para mantener la BD activa
    const { data, error } = await supabase
      .from('oposiciones')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keepalive query error:', error)
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Database is alive',
      oposiciones_count: data?.length || 0,
    })
  } catch (error) {
    console.error('Keepalive error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
