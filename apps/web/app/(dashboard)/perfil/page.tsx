// ===========================================
// OpoScore - Página de Perfil
// Perfil de usuario con estadísticas y ajustes
// ===========================================

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScoreGauge } from '@/components/oposcore/ScoreGauge'
import { StreakFire } from '@/components/gamification/StreakFire'
import { AchievementGrid, ACHIEVEMENTS } from '@/components/gamification/AchievementBadge'

// Mock de datos de usuario
const USER_DATA = {
  nombre: 'Antonio',
  email: 'antonio@ejemplo.com',
  oposicion: 'Auxiliar Administrativo AGE',
  miembroDesde: '2024-11-15',
  plan: 'premium',
  opoScore: 67,
  opoScoreChange: 5,
  racha: 12,
  rachaRecord: 23,
  testsCompletados: 156,
  horasEstudio: 87,
  temasCompletados: 8,
}

// Cálculo de días como miembro

export default function PerfilPage() {
  const [nombre, setNombre] = useState(USER_DATA.nombre)
  const [notificacionesEmail, setNotificacionesEmail] = useState(true)
  const [notificacionesPush, setNotificacionesPush] = useState(true)
  const [recordatoriosDiarios, setRecordatoriosDiarios] = useState(true)
  const [horaRecordatorio, setHoraRecordatorio] = useState('09:00')

  const diasMiembro = Math.floor(
    (Date.now() - new Date(USER_DATA.miembroDesde).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header con stats principales */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Perfil basico */}
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {USER_DATA.nombre.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold">{USER_DATA.nombre}</h1>
                <p className="text-muted-foreground truncate">{USER_DATA.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline">🏛️ {USER_DATA.oposicion}</Badge>
                  <Badge className="bg-primary/10 text-primary">
                    {USER_DATA.plan === 'premium' ? '⭐ Premium' : 'Gratis'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Miembro desde hace {diasMiembro} días
                </p>
              </div>
              <div className="shrink-0">
                <ScoreGauge score={USER_DATA.opoScore} size="md" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats rapidas */}
        <div className="grid grid-cols-2 gap-3 lg:w-64">
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <StreakFire days={USER_DATA.racha} bestStreak={USER_DATA.rachaRecord} size="sm" />
              <div className="text-sm text-muted-foreground mt-1">Racha actual</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-primary">{USER_DATA.testsCompletados}</div>
              <div className="text-sm text-muted-foreground">Tests hechos</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-primary">{USER_DATA.horasEstudio}h</div>
              <div className="text-sm text-muted-foreground">Horas estudio</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-primary">{USER_DATA.temasCompletados}</div>
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
                  value={USER_DATA.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El email no se puede cambiar
                </p>
              </div>
              <Button>Guardar cambios</Button>
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
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Plan Premium</span>
                  <Badge className="bg-primary">Activo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  19€/mes - Próxima facturación: 15 de febrero
                </p>
                <div className="text-sm">
                  ✓ Tests ilimitados - ✓ Tutor IA 24/7 - ✓ Todas las oposiciones
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Cambiar plan</Button>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  Cancelar suscripción
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
