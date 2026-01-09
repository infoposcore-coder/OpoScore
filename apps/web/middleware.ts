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

// Rutas que requieren plan premium (tutor_ia incluido en premium)
// La verificación se hace con PlanGate en el cliente
// const premiumRoutes = ['/simulacros', '/tutor']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // MODO DEMO: Si no hay Supabase configurado, permitir acceso
  if (!supabaseUrl || supabaseUrl.trim() === '' || !supabaseAnonKey || supabaseAnonKey.trim() === '') {
    return res
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
