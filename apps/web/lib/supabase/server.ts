// ===========================================
// OpoScore - Supabase Server Client
// ===========================================

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

interface CookieToSet {
  name: string
  value: string
  options?: Record<string, unknown>
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // La función `setAll` es llamada desde un Server Component.
            // Esto se puede ignorar si tienes middleware refrescando
            // las sesiones de usuario.
          }
        },
      },
    }
  )
}

// Cliente con Service Role para operaciones administrativas
export function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}

// Cliente estático para operaciones públicas (sin cookies)
// Usado en unstable_cache donde cookies no están disponibles
export function createStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si no hay env vars, retornar un cliente mock para build time
  if (!url || !key) {
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: [], error: null }),
              single: () => Promise.resolve({ data: null, error: null }),
              limit: () => ({
                single: () => Promise.resolve({ data: null, error: null }),
              }),
            }),
            order: () => Promise.resolve({ data: [], error: null }),
            single: () => Promise.resolve({ data: null, error: null }),
          }),
          order: () => Promise.resolve({ data: [], error: null }),
          not: () => Promise.resolve({ data: [], error: null, count: 0 }),
        }),
      }),
    } as unknown as ReturnType<typeof createServerClient<Database>>
  }

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}
