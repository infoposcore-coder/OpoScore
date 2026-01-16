// ===========================================
// OpoScore - Next.js Middleware
// ===========================================
// Maneja autenticación básica.
// La protección por plan (premium/elite) se maneja
// con el componente PlanGate en cada página.
// ===========================================

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface CookieToSet {
  name: string
  value: string
  options?: Record<string, unknown>
}

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/estudiar', '/progreso', '/simulacros', '/perfil', '/tutor']

// Rutas de autenticación (redirigir a dashboard si ya está logueado)
const authRoutes = ['/login', '/register']

// Rutas que requieren plan premium - verificación server-side
const premiumRoutes = ['/simulacros', '/tutor']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Verificar configuración de Supabase
  // En producción, las variables DEBEN estar configuradas
  if (!supabaseUrl || supabaseUrl.trim() === '' || !supabaseAnonKey || supabaseAnonKey.trim() === '') {
    // En desarrollo, permitir modo demo solo si NODE_ENV es development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Middleware] Modo demo activo - Supabase no configurado')
      return res
    }
    // En producción, redirigir a página de error/mantenimiento
    const maintenanceUrl = new URL('/maintenance', req.url)
    // Permitir acceso a rutas públicas básicas
    const publicPaths = ['/', '/login', '/register', '/privacidad', '/terminos', '/contacto', '/maintenance']
    if (publicPaths.includes(req.nextUrl.pathname)) {
      return res
    }
    return NextResponse.redirect(maintenanceUrl)
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const isProtectedRoute = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  const isAuthRoute = authRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirigir a login si intenta acceder a ruta protegida sin sesión
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirigir a dashboard si ya tiene sesión y accede a login/register
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Verificación server-side de plan premium
  const isPremiumRoute = premiumRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (isPremiumRoute && session) {
    // Verificar si el usuario tiene suscripción activa
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .in('status', ['active', 'trialing'])
      .single()

    // Si no tiene suscripción activa, redirigir a página de precios
    if (!subscription) {
      const upgradeUrl = new URL('/precios', req.url)
      upgradeUrl.searchParams.set('upgrade', 'required')
      upgradeUrl.searchParams.set('feature', req.nextUrl.pathname.split('/')[1])
      return NextResponse.redirect(upgradeUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/estudiar/:path*',
    '/progreso/:path*',
    '/simulacros/:path*',
    '/perfil/:path*',
    '/tutor/:path*',
    '/login',
    '/register',
  ],
}
