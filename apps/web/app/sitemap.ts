/**
 * Sitemap dinámico
 * Genera sitemap.xml automáticamente
 */

import { MetadataRoute } from 'next'
import { getOposiciones } from '@/lib/cache'

const BASE_URL = 'https://oposcore.es'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener oposiciones para páginas dinámicas
  const oposiciones = await getOposiciones()

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/oposiciones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/precios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Páginas dinámicas de oposiciones
  const oposicionPages: MetadataRoute.Sitemap = oposiciones.map((oposicion) => ({
    url: `${BASE_URL}/oposiciones/${oposicion.slug}`,
    lastModified: new Date(oposicion.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Combinar todas las páginas
  return [...staticPages, ...oposicionPages]
}
