// ===========================================
// OpoScore - Dashboard Layout
// ===========================================

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { Logo } from '@/components/ui/logo'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

// Datos mock para modo demo
const mockProfile = {
  full_name: 'Usuario Demo',
  avatar_url: null,
  email: 'demo@oposcore.es'
}

// Tipo para el profile
interface ProfileData {
  full_name: string | null
  avatar_url: string | null
  email: string
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let profile: ProfileData | null = null
  let userEmail: string = ''

  if (DEMO_MODE) {
    // Modo demo: usar datos mock
    profile = mockProfile
    userEmail = mockProfile.email
  } else {
    // Modo producción: usar Supabase
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    userEmail = user.email || ''

    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, email')
      .eq('id', user.id)
      .single() as { data: ProfileData | null }

    profile = profileData
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : userEmail?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-background">
      {/* Demo mode banner */}
      {DEMO_MODE && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 text-center py-1 text-sm font-medium">
          Modo Demo - Los datos no se guardarán
        </div>
      )}

      {/* Sidebar para desktop */}
      <aside className={`fixed left-0 z-40 hidden h-screen w-64 border-r bg-card lg:block ${DEMO_MODE ? 'top-8' : 'top-0'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Logo size="sm" />
              </Link>
              {DEMO_MODE && (
                <Badge variant="secondary" className="text-xs">
                  Demo
                </Badge>
              )}
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4" role="navigation" aria-label="Menu principal del dashboard">
            <NavLink href="/dashboard" icon="home">
              Dashboard
            </NavLink>
            <NavLink href="/estudiar" icon="book">
              Estudiar
            </NavLink>
            <NavLink href="/progreso" icon="chart">
              Progreso
            </NavLink>
            <NavLink href="/simulacros" icon="clock">
              Simulacros
            </NavLink>
            <NavLink href="/tutor" icon="brain">
              Tutor IA
            </NavLink>
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">
                    {profile?.full_name || userEmail}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/perfil">Mi perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil/configuracion">Configuración</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {DEMO_MODE ? (
                  <DropdownMenuItem asChild>
                    <Link href="/">Salir del demo</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <form action="/api/auth/logout" method="POST">
                      <button type="submit" className="w-full text-left">
                        Cerrar sesión
                      </button>
                    </form>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className={`fixed z-40 w-full border-b bg-card/80 backdrop-blur-lg lg:hidden ${DEMO_MODE ? 'top-8' : 'top-0'}`}>
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/estudiar">Estudiar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/progreso">Progreso</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/simulacros">Simulacros</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil">Mi perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {DEMO_MODE ? (
                <DropdownMenuItem asChild>
                  <Link href="/">Salir del demo</Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="w-full text-left">
                      Cerrar sesión
                    </button>
                  </form>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="lg:pl-64" role="main">
        <div className={`min-h-screen lg:pt-0 ${DEMO_MODE ? 'pt-24' : 'pt-16'}`}>
          <DashboardContent>{children}</DashboardContent>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card lg:hidden safe-area-bottom" role="navigation" aria-label="Navegacion movil">
        <div className="grid h-16 grid-cols-5">
          <MobileNavLink href="/dashboard" icon="home" label="Inicio" />
          <MobileNavLink href="/estudiar" icon="book" label="Estudiar" />
          <MobileNavLink href="/progreso" icon="chart" label="Progreso" />
          <MobileNavLink href="/simulacros" icon="clock" label="Simulacros" />
          <MobileNavLink href="/tutor" icon="brain" label="Tutor" />
        </div>
      </nav>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  )
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <NavIcon name={icon} />
      <span>{children}</span>
    </Link>
  )
}

function MobileNavLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
    >
      <NavIcon name={icon} />
      <span className="text-xs">{label}</span>
    </Link>
  )
}

function NavIcon({ name }: { name: string }) {
  // Iconos simples en SVG
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    book: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    chart: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    clock: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    brain: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  }

  return icons[name] || null
}
