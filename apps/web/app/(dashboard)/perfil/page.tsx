// ===========================================
// OpoMetrics - Página de Perfil
// Perfil de usuario con estadísticas y ajustes
// ===========================================

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScoreGauge } from '@/components/opometrics/ScoreGauge'
import { StreakFire } from '@/components/gamification/StreakFire'
import { AchievementGrid, ACHIEVEMENTS } from '@/components/gamification/AchievementBadge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSubscription, useBillingPortal } from '@/hooks/useSubscription'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// Mock de datos de usuario (se sobrescriben con datos reales)
const DEFAULT_USER_DATA = {
  nombre: 'Usuario',
  email: 'usuario@ejemplo.com',
  oposicion: 'Auxiliar Administrativo AGE',
  miembroDesde: '2024-11-15',
  plan: 'free',
  opoMetrics: 67,
  opoMetricsChange: 5,
  racha: 12,
  rachaRecord: 23,
  testsCompletados: 156,
  horasEstudio: 87,
  temasCompletados: 8,
}

export default function PerfilPage() {
  const [userData, setUserData] = useState(DEFAULT_USER_DATA)
  const [nombre, setNombre] = useState('')
  const [notificacionesEmail, setNotificacionesEmail] = useState(true)
  const [notificacionesPush, setNotificacionesPush] = useState(true)
  const [recordatoriosDiarios, setRecordatoriosDiarios] = useState(true)
  const [horaRecordatorio, setHoraRecordatorio] = useState('09:00')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null)

  const { subscription, isPro, isElite, isLoading: loadingSubscription } = useSubscription()
  const { openPortal } = useBillingPortal()

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createClient()
      const { data: { user } } = await (supabase as any).auth.getUser()

      if (user) {
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single() as { data: { full_name: string | null; created_at: string | null } | null }

        if (profile) {
          setUserData({
            ...DEFAULT_USER_DATA,
            nombre: profile.full_name || 'Usuario',
            email: user.email || '',
            miembroDesde: profile.created_at || DEFAULT_USER_DATA.miembroDesde,
            plan: isPro ? (isElite ? 'elite' : 'pro') : 'free',
          })
          setNombre(profile.full_name || '')
        }
      }
    }

    loadUserData()
  }, [isPro, isElite])

  // Guardar cambios del perfil
  const handleGuardarCambios = async () => {
    setGuardando(true)
    setMensaje(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await (supabase as any).auth.getUser()

      if (!user) throw new Error('No autenticado')

      const { error } = await (supabase as any)
        .from('profiles')
        .update({ full_name: nombre })
        .eq('id', user.id)

      if (error) throw error

      setMensaje({ tipo: 'success', texto: 'Cambios guardados correctamente' })
      setUserData(prev => ({ ...prev, nombre }))
    } catch (error) {
      console.error('Error al guardar:', error)
      setMensaje({ tipo: 'error', texto: 'Error al guardar los cambios' })
    } finally {
      setGuardando(false)
    }
  }

  // Abrir portal de facturación de Stripe
  const handleGestionarSuscripcion = async () => {
    try {
      await openPortal()
    } catch (error) {
      console.error('Error al abrir portal:', error)
      setMensaje({ tipo: 'error', texto: 'Error al abrir el portal de facturación' })
    }
  }

  const diasMiembro = Math.floor(
    (Date.now() - new Date(userData.miembroDesde).getTime()) / (1000 * 60 * 60 * 24)
  )

  const planLabel = userData.plan === 'elite' ? '👑 Elite' : userData.plan === 'premium' ? '⭐ Premium' : 'Gratis'

  return (
    <div className="p-6 space-y-6">
      {/* Mensaje de estado */}
      {mensaje && (
        <Alert variant={mensaje.tipo === 'error' ? 'destructive' : 'default'} className={mensaje.tipo === 'success' ? 'border-green-500 bg-green-50 text-green-800' : ''}>
          <AlertDescription>{mensaje.texto}</AlertDescription>
        </Alert>
      )}

      {/* Header con stats principales */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Perfil básico */}
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {userData.nombre.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold">{userData.nombre}</h1>
                <p className="text-muted-foreground truncate">{userData.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline">🏛️ {userData.oposicion}</Badge>
                  <Badge className="bg-primary/10 text-primary">
                    {planLabel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Miembro desde hace {diasMiembro} días
                </p>
              </div>
              <div className="shrink-0">
                <ScoreGauge score={userData.opoMetrics} size="md" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats rápidas */}
        <div className="grid grid-cols-2 gap-3 lg:w-64">
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <StreakFire days={userData.racha} bestStreak={userData.rachaRecord} size="sm" />
              <div className="text-sm text-muted-foreground mt-1">Racha actual</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-primary">{userData.testsCompletados}</div>
              <div className="text-sm text-muted-foreground">Tests hechos</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-primary">{userData.horasEstudio}h</div>
              <div className="text-sm text-muted-foreground">Horas estudio</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-primary">{userData.temasCompletados}</div>
              <div className="text-sm text-muted-foreground">Temas dominados</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs de configuracion */}
      <Tabs defaultValue="logros" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="logros">🏆 Logros</TabsTrigger>
          <TabsTrigger value="cuenta">👤 Cuenta</TabsTrigger>
          <TabsTrigger value="notificaciones">🔔 Notificaciones</TabsTrigger>
          <TabsTrigger value="suscripcion">💳 Suscripción</TabsTrigger>
        </TabsList>

        {/* Logros */}
        <TabsContent value="logros" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tus logros</CardTitle>
              <CardDescription>
                Desbloquea badges completando retos de estudio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AchievementGrid achievements={ACHIEVEMENTS} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cuenta */}
        <TabsContent value="cuenta" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de cuenta</CardTitle>
              <CardDescription>
                Gestiona tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={userData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El email no se puede cambiar
                </p>
              </div>
              <Button onClick={handleGuardarCambios} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notificaciones" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de notificaciones</CardTitle>
              <CardDescription>
                Configura como quieres recibir recordatorios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones por email</p>
                  <p className="text-sm text-muted-foreground">
                    Resumen semanal y novedades
                  </p>
                </div>
                <Switch
                  checked={notificacionesEmail}
                  onCheckedChange={setNotificacionesEmail}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones push</p>
                  <p className="text-sm text-muted-foreground">
                    Alertas en tu dispositivo
                  </p>
                </div>
                <Switch
                  checked={notificacionesPush}
                  onCheckedChange={setNotificacionesPush}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recordatorios diarios</p>
                  <p className="text-sm text-muted-foreground">
                    Te avisamos para que no pierdas tu racha
                  </p>
                </div>
                <Switch
                  checked={recordatoriosDiarios}
                  onCheckedChange={setRecordatoriosDiarios}
                />
              </div>
              {recordatoriosDiarios && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid gap-2"
                >
                  <Label htmlFor="hora">Hora del recordatorio</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={horaRecordatorio}
                    onChange={(e) => setHoraRecordatorio(e.target.value)}
                    className="w-32"
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suscripción */}
        <TabsContent value="suscripcion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tu suscripción</CardTitle>
              <CardDescription>
                Gestiona tu plan y facturación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingSubscription ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-20 bg-muted rounded-lg" />
                  <div className="h-10 bg-muted rounded w-32" />
                </div>
              ) : isPro || isElite ? (
                <>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Plan {isElite ? 'Elite' : 'Premium'}</span>
                      <Badge className="bg-primary">
                        {subscription?.isTrial ? 'Prueba' : 'Activo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {subscription?.currentPeriodEnd
                        ? `Próxima facturación: ${subscription.currentPeriodEnd.toLocaleDateString('es-ES')}`
                        : 'Plan activo'}
                    </p>
                    <div className="text-sm">
                      ✓ Tests ilimitados - ✓ Tutor IA 24/7 - ✓ Simulacros
                    </div>
                    {subscription?.cancelAtPeriodEnd && (
                      <p className="text-sm text-orange-600 mt-2">
                        ⚠️ Tu suscripción se cancelará al final del periodo
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={handleGestionarSuscripcion}>
                      Gestionar suscripción
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Plan Gratuito</span>
                      <Badge variant="secondary">Activo</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      50 preguntas/mes - Funciones limitadas
                    </p>
                  </div>
                  <Link href="/precios">
                    <Button>Actualizar a Premium</Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
