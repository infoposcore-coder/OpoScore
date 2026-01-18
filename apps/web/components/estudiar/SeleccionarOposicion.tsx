// ===========================================
// OpoMetrics - Selector de Oposición (Client Component)
// Permite al usuario seleccionar su oposición activa
// ===========================================

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface Oposicion {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  categoria: string
}

interface SeleccionarOposicionProps {
  oposiciones: Oposicion[]
  userId: string
}

// Iconos por categoría
const categoryIcons: Record<string, string> = {
  administracion: '🏛️',
  justicia: '⚖️',
  correos: '📮',
  hacienda: '💰',
  educacion: '📚',
  sanidad: '🏥',
  seguridad: '🛡️',
  defensa: '🎖️',
  default: '📋',
}

export function SeleccionarOposicion({ oposiciones, userId }: SeleccionarOposicionProps) {
  const [seleccionando, setSeleccionando] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSeleccionar = async (oposicionId: string) => {
    setSeleccionando(oposicionId)
    setError(null)

    try {
      const supabase = createClient()

      // Crear la entrada en user_oposiciones
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('user_oposiciones')
        .insert({
          user_id: userId,
          oposicion_id: oposicionId,
          activa: true,
        })

      if (insertError) {
        // Si ya existe, actualizarla como activa
        if (insertError.code === '23505') { // unique_violation
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: updateError } = await (supabase as any)
            .from('user_oposiciones')
            .update({ activa: true })
            .eq('user_id', userId)
            .eq('oposicion_id', oposicionId)

          if (updateError) throw updateError
        } else {
          throw insertError
        }
      }

      // Desactivar otras oposiciones del usuario
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('user_oposiciones')
        .update({ activa: false })
        .eq('user_id', userId)
        .neq('oposicion_id', oposicionId)

      // Refrescar la página
      router.refresh()
    } catch (err) {
      console.error('Error seleccionando oposición:', err)
      setError('Error al seleccionar la oposición. Inténtalo de nuevo.')
      setSeleccionando(null)
    }
  }

  // Agrupar por categoría
  const oposicionesPorCategoria = oposiciones.reduce((acc, oposicion) => {
    const categoria = oposicion.categoria || 'default'
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(oposicion)
    return acc
  }, {} as Record<string, Oposicion[]>)

  const categorias = Object.keys(oposicionesPorCategoria)

  if (oposiciones.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-medium mb-2">No hay oposiciones disponibles</h3>
          <p className="text-muted-foreground">
            Vuelve pronto, estamos añadiendo nuevas oposiciones constantemente.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {categorias.map((categoria) => (
        <div key={categoria}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl" role="img" aria-hidden="true">
              {categoryIcons[categoria] || categoryIcons.default}
            </span>
            <h2 className="text-xl font-semibold capitalize">
              {categoria === 'default' ? 'Otras oposiciones' : categoria}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oposicionesPorCategoria[categoria].map((oposicion) => (
              <Card
                key={oposicion.id}
                className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                  seleccionando === oposicion.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => !seleccionando && handleSeleccionar(oposicion.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{oposicion.nombre}</CardTitle>
                  {oposicion.descripcion && (
                    <CardDescription className="line-clamp-2">
                      {oposicion.descripcion}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    disabled={seleccionando !== null}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSeleccionar(oposicion.id)
                    }}
                  >
                    {seleccionando === oposicion.id ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Seleccionando...
                      </>
                    ) : (
                      'Seleccionar'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
