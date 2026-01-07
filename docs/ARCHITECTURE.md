# Arquitectura de OpoScore

## Visión General

OpoScore sigue una arquitectura serverless moderna optimizada para bajo coste:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Vercel Edge   │────▶│    Supabase     │────▶│  Cloudflare R2  │
│   (Next.js)     │     │   (PostgreSQL)  │     │    (Storage)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │
         │                      │
         ▼                      ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│    Groq API     │     │   OpenRouter    │
│   (IA Primary)  │     │  (IA Fallback)  │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

## Capas de la Aplicación

### 1. Presentación (Frontend)

- **Next.js 14 App Router**: SSR y RSC para mejor SEO y rendimiento
- **React Server Components**: Reducen JavaScript enviado al cliente
- **shadcn/ui**: Componentes accesibles y personalizables
- **Tailwind CSS**: Estilos utility-first

### 2. Estado (Client)

- **Zustand**: Estado global ligero
- **TanStack Query**: Caché y sincronización de datos del servidor
- **Formularios**: React Hook Form + Zod para validación

### 3. API (Backend)

- **Next.js Route Handlers**: API routes en el edge
- **Supabase Client**: Acceso a base de datos con RLS
- **Edge Functions**: Lógica compleja en Supabase

### 4. Datos (Database)

- **PostgreSQL**: Base de datos relacional en Supabase
- **Row Level Security**: Seguridad a nivel de fila
- **Realtime**: Suscripciones en tiempo real

### 5. IA

- **Groq API**: Modelo principal (Llama 3.3 70B)
- **OpenRouter**: Fallback con múltiples modelos gratuitos
- **Caché**: Reducción del 60% de llamadas

## Patrones de Diseño

### Server Components por Defecto

```tsx
// app/(dashboard)/page.tsx - Server Component
export default async function DashboardPage() {
  const supabase = await createClient()
  const data = await supabase.from('tests').select()
  return <Dashboard data={data} />
}
```

### Client Components para Interactividad

```tsx
// components/tests/TestRunner.tsx
'use client'

export function TestRunner() {
  const [answer, setAnswer] = useState(null)
  // Lógica interactiva
}
```

### Custom Hooks para Lógica Reutilizable

```tsx
// hooks/useOpoScore.ts
export function useOpoScore({ userId, oposicionId }) {
  return useQuery({
    queryKey: ['oposcore', userId, oposicionId],
    queryFn: async () => { /* ... */ }
  })
}
```

## Seguridad

### Row Level Security (RLS)

Todas las tablas tienen políticas RLS:

```sql
-- Usuarios solo ven sus propios datos
CREATE POLICY "Users can view own tests"
    ON tests FOR SELECT
    USING (auth.uid() = user_id);
```

### Autenticación

- Supabase Auth con email/password
- Middleware de Next.js para proteger rutas
- Cookies HTTP-only para sesiones

### API Protection

- CRON_SECRET para endpoints de cron
- Rate limiting en edge functions
- Validación de entrada con Zod

## Optimizaciones

### Rendimiento

1. **ISR/SSG** para páginas estáticas
2. **Streaming** para datos pesados
3. **Lazy loading** de componentes
4. **Image optimization** con next/image

### Costes

1. **Caché agresivo** de respuestas IA
2. **Edge computing** reduce latencia
3. **Compresión** de assets
4. **Keepalive** para evitar pausa de Supabase

## Monitorización

### Logs

- Vercel Logs para frontend
- Supabase Logs para backend
- Console.error para errores críticos

### Métricas

- Vercel Analytics (básico gratuito)
- Supabase Dashboard para uso de BD

## Escalabilidad

### Horizontal

- Vercel escala automáticamente
- Supabase soporta connection pooling
- R2 sin límite de egress

### Vertical (Upgrade Path)

1. **Supabase Pro**: Más recursos, sin pausas
2. **Vercel Pro**: Más builds, analytics
3. **Groq Pro**: Más requests/día
