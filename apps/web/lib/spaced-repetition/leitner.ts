// ===========================================
// OpoScore - Sistema Leitner Simplificado
// ===========================================
// Sistema de repaso espaciado con 5 cajas

export const CAJAS = {
  1: { dias: 1, nombre: 'Diario' },
  2: { dias: 2, nombre: 'Cada 2 días' },
  3: { dias: 4, nombre: 'Cada 4 días' },
  4: { dias: 7, nombre: 'Semanal' },
  5: { dias: 14, nombre: 'Quincenal' }
} as const

export type NumeroCaja = 1 | 2 | 3 | 4 | 5

export interface FlashcardState {
  caja: NumeroCaja
  proximaRevision: Date
  totalRevisiones: number
  aciertosConsecutivos: number
}

export interface RevisionResult {
  nuevaCaja: NumeroCaja
  proximaRevision: Date
  mensaje: string
}

// Calcular próxima revisión basada en resultado
export function calcularProximaRevision(
  cajaActual: NumeroCaja,
  acertado: boolean
): RevisionResult {
  let nuevaCaja: NumeroCaja

  if (acertado) {
    // Subir de caja (máximo 5)
    nuevaCaja = Math.min(cajaActual + 1, 5) as NumeroCaja
  } else {
    // Volver a caja 1 si falla
    nuevaCaja = 1
  }

  const proximaRevision = new Date()
  proximaRevision.setDate(proximaRevision.getDate() + CAJAS[nuevaCaja].dias)
  proximaRevision.setHours(0, 0, 0, 0) // Normalizar a medianoche

  const mensaje = acertado
    ? nuevaCaja === 5
      ? '¡Perfecto! Esta tarjeta está dominada.'
      : `Bien. Próxima revisión en ${CAJAS[nuevaCaja].dias} día(s).`
    : 'A repasar. La verás de nuevo mañana.'

  return { nuevaCaja, proximaRevision, mensaje }
}

// Obtener tarjetas pendientes de revisión
export function filtrarTarjetasPendientes<T extends { proxima_revision: string }>(
  tarjetas: T[],
  fecha: Date = new Date()
): T[] {
  const hoy = new Date(fecha)
  hoy.setHours(23, 59, 59, 999) // Fin del día

  return tarjetas.filter(t => new Date(t.proxima_revision) <= hoy)
}

// Ordenar tarjetas por prioridad de revisión
export function ordenarPorPrioridad<T extends { caja: number; proxima_revision: string }>(
  tarjetas: T[]
): T[] {
  return [...tarjetas].sort((a, b) => {
    // Primero las de caja más baja (más urgentes)
    if (a.caja !== b.caja) {
      return a.caja - b.caja
    }
    // Luego por fecha de revisión
    return new Date(a.proxima_revision).getTime() - new Date(b.proxima_revision).getTime()
  })
}

// Calcular estadísticas de las tarjetas
export interface LeitnerStats {
  total: number
  porCaja: Record<NumeroCaja, number>
  pendientesHoy: number
  dominadas: number // En caja 5
  porcentajeDominio: number
}

export function calcularEstadisticasLeitner<T extends { caja: number; proxima_revision: string }>(
  tarjetas: T[]
): LeitnerStats {
  const porCaja: Record<NumeroCaja, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  tarjetas.forEach(t => {
    const caja = t.caja as NumeroCaja
    if (caja >= 1 && caja <= 5) {
      porCaja[caja]++
    }
  })

  const pendientes = filtrarTarjetasPendientes(tarjetas)
  const dominadas = porCaja[5]
  const total = tarjetas.length

  return {
    total,
    porCaja,
    pendientesHoy: pendientes.length,
    dominadas,
    porcentajeDominio: total > 0 ? Math.round((dominadas / total) * 100) : 0
  }
}

// Calcular sesión óptima de revisión
export interface SesionRevision {
  tarjetas: number
  tiempoEstimadoMinutos: number
  mensaje: string
}

export function calcularSesionOptima(
  pendientes: number,
  tiempoDisponibleMinutos: number = 15
): SesionRevision {
  // Asumimos ~20 segundos por tarjeta en promedio
  const SEGUNDOS_POR_TARJETA = 20
  const tarjetasPosibles = Math.floor((tiempoDisponibleMinutos * 60) / SEGUNDOS_POR_TARJETA)

  const tarjetas = Math.min(pendientes, tarjetasPosibles)
  const tiempoEstimadoMinutos = Math.ceil((tarjetas * SEGUNDOS_POR_TARJETA) / 60)

  let mensaje: string
  if (pendientes === 0) {
    mensaje = '¡No tienes tarjetas pendientes hoy!'
  } else if (tarjetas === pendientes) {
    mensaje = `Revisarás todas tus ${tarjetas} tarjetas pendientes.`
  } else {
    mensaje = `Revisarás ${tarjetas} de ${pendientes} tarjetas pendientes.`
  }

  return { tarjetas, tiempoEstimadoMinutos, mensaje }
}

// Algoritmo SM-2 simplificado para calcular facilidad
export function calcularFacilidadSM2(
  facilidadActual: number,
  calidad: 0 | 1 | 2 | 3 | 4 | 5 // 0=fallo total, 5=perfecto
): number {
  // Fórmula SM-2: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const nuevaFacilidad = facilidadActual + (0.1 - (5 - calidad) * (0.08 + (5 - calidad) * 0.02))

  // La facilidad mínima es 1.3
  return Math.max(1.3, nuevaFacilidad)
}
