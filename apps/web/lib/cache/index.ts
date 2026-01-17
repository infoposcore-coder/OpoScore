/**
 * Caching Strategy - Sistema de caché para Next.js
 * Usa unstable_cache para Server Components
 */

import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// ============================================
// CACHE TAGS
// ============================================

export const CacheTags = {
  // Datos públicos (alta duración de caché)
  OPOSICIONES: 'oposiciones',
  OPOSICION: (slug: string) => `oposicion-${slug}`,
  TEMARIO: (oposicionId: string) => `temario-${oposicionId}`,
  TEMAS_PUBLICOS: 'temas-publicos',

  // Datos de usuario (baja duración de caché)
  USER_PROFILE: (userId: string) => `profile-${userId}`,
  USER_STATS: (userId: string) => `stats-${userId}`,
  USER_OPOSCORE: (userId: string) => `oposcore-${userId}`,
  USER_RACHA: (userId: string) => `racha-${userId}`,

  // Datos dinámicos (sin caché o muy corta)
  TESTS: 'tests',
  RESPUESTAS: 'respuestas',
} as const

// ============================================
// CACHE DURATIONS (en segundos)
// ============================================

export const CacheDurations = {
  STATIC: 60 * 60 * 24 * 7,    // 7 días - Contenido estático
  LONG: 60 * 60 * 24,          // 1 día - Datos que cambian poco
  MEDIUM: 60 * 60,             // 1 hora - Datos que cambian moderadamente
  SHORT: 60 * 5,               // 5 minutos - Datos frecuentemente actualizados
  REALTIME: 60,                // 1 minuto - Datos casi en tiempo real
  NONE: 0,                     // Sin caché
} as const

// ============================================
// CACHED FUNCTIONS - Datos Públicos
// ============================================

/**
 * Obtiene todas las oposiciones activas (cached)
 */
export const getOposiciones = unstable_cache(
  async () => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('oposiciones')
      .select('*')
      .eq('activa', true)
      .order('nombre')

    if (error) {
      console.error('Error fetching oposiciones:', error)
      return []
    }

    return data || []
  },
  [CacheTags.OPOSICIONES],
  {
    revalidate: CacheDurations.LONG,
    tags: [CacheTags.OPOSICIONES],
  }
)

/**
 * Obtiene una oposición por slug (cached)
 */
export const getOposicionBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('oposiciones')
      .select(`
        *,
        bloques:bloques(
          id, nombre, orden,
          temas:temas(id, nombre, orden)
        )
      `)
      .eq('slug', slug)
      .eq('activa', true)
      .single()

    if (error) return null
    return data
  },
  ['oposicion-by-slug'],
  {
    revalidate: CacheDurations.LONG,
    tags: ['oposiciones'],
  }
)

/**
 * Obtiene el temario completo de una oposición (cached)
 */
export const getTemario = unstable_cache(
  async (oposicionId: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('bloques')
      .select(`
        id,
        nombre,
        orden,
        temas:temas(
          id,
          nombre,
          orden,
          subtemas:subtemas(id, titulo, orden)
        )
      `)
      .eq('oposicion_id', oposicionId)
      .order('orden')

    if (error) {
      console.error('Error fetching temario:', error)
      return []
    }

    return data || []
  },
  ['temario'],
  {
    revalidate: CacheDurations.LONG,
  }
)

/**
 * Obtiene estadísticas públicas (cached)
 */
export const getPublicStats = unstable_cache(
  async () => {
    const supabase = await createClient()

    // Ejecutar queries en paralelo
    const [usersResult, preguntasResult, testsResult] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('preguntas').select('id', { count: 'exact', head: true }).eq('activa', true),
      supabase.from('tests').select('id', { count: 'exact', head: true }).eq('completado', true),
    ])

    return {
      totalUsuarios: usersResult.count || 0,
      totalPreguntas: preguntasResult.count || 0,
      totalTests: testsResult.count || 0,
      tasaAprobados: 85, // Esto debería calcularse realmente
    }
  },
  ['public-stats'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: ['stats'],
  }
)

// ============================================
// CACHED FUNCTIONS - Datos de Usuario
// ============================================

/**
 * Obtiene el perfil de un usuario (cached)
 */
export const getUserProfile = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null
    return data
  },
  ['user-profile'],
  {
    revalidate: CacheDurations.SHORT,
  }
)

/**
 * Obtiene las oposiciones del usuario (cached)
 */
export const getUserOposiciones = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_oposiciones')
      .select(`
        *,
        oposicion:oposiciones(*)
      `)
      .eq('user_id', userId)
      .eq('activa', true)

    if (error) return []
    return data || []
  },
  ['user-oposiciones'],
  {
    revalidate: CacheDurations.SHORT,
  }
)

// ============================================
// CACHE INVALIDATION HELPERS
// ============================================

import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * Invalida el caché de oposiciones
 */
export function invalidateOposiciones() {
  revalidateTag(CacheTags.OPOSICIONES)
}

/**
 * Invalida el caché de una oposición específica
 */
export function invalidateOposicion(slug: string) {
  revalidateTag(CacheTags.OPOSICION(slug))
}

/**
 * Invalida el caché del temario de una oposición
 */
export function invalidateTemario(oposicionId: string) {
  revalidateTag(CacheTags.TEMARIO(oposicionId))
}

/**
 * Invalida todo el caché de un usuario
 */
export function invalidateUserCache(userId: string) {
  revalidateTag(CacheTags.USER_PROFILE(userId))
  revalidateTag(CacheTags.USER_STATS(userId))
  revalidateTag(CacheTags.USER_OPOSCORE(userId))
  revalidateTag(CacheTags.USER_RACHA(userId))
}

/**
 * Invalida una ruta específica
 */
export function invalidatePath(path: string) {
  revalidatePath(path)
}

// ============================================
// UTILITY: Prefetch para rutas
// ============================================

/**
 * Prefetch datos para una ruta
 * Llamar en layouts para pre-cargar datos
 */
export async function prefetchForRoute(route: string) {
  switch (route) {
    case '/':
      await Promise.all([
        getOposiciones(),
        getPublicStats(),
      ])
      break
    case '/oposiciones':
      await getOposiciones()
      break
    default:
      break
  }
}

// ============================================
// IN-MEMORY CACHE (para datos muy frecuentes)
// ============================================

const memoryCache = new Map<string, { data: unknown; expires: number }>()

/**
 * Cache en memoria con TTL
 */
export function getFromMemoryCache<T>(key: string): T | null {
  const cached = memoryCache.get(key)
  if (!cached) return null
  if (Date.now() > cached.expires) {
    memoryCache.delete(key)
    return null
  }
  return cached.data as T
}

/**
 * Guarda en cache de memoria
 */
export function setInMemoryCache<T>(key: string, data: T, ttlSeconds: number): void {
  memoryCache.set(key, {
    data,
    expires: Date.now() + ttlSeconds * 1000,
  })
}

/**
 * Limpia cache de memoria expirado
 */
export function cleanExpiredMemoryCache(): void {
  const now = Date.now()
  for (const [key, value] of memoryCache.entries()) {
    if (now > value.expires) {
      memoryCache.delete(key)
    }
  }
}

// Limpiar cache cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(cleanExpiredMemoryCache, 5 * 60 * 1000)
}
