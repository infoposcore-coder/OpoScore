# 🎯 OpoScore

**La primera academia de oposiciones con IA predictiva que te dice cuándo estás listo para aprobar.**

![OpoScore](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

---

## 🚀 Características

### ✅ MVP Completo
- **Dashboard interactivo** con gráficos de progreso (Recharts)
- **Tests adaptativos** con feedback inmediato y explicaciones
- **Simulacros cronometrados** en condiciones reales de examen
- **Sistema de gamificación** con rachas, logros y OpoScore
- **Tutor IA** potenciado por Groq API (Llama 3.3)
- **PWA** - Funciona como app nativa en móvil

### 🎨 Diseño Premium
- Sistema de colores OKLCH profesional
- Animaciones con Framer Motion
- Dark/Light mode
- Componentes shadcn/ui personalizados

### 📊 Métricas Avanzadas
- OpoScore: tu probabilidad estimada de aprobar
- Gráficos semanales de progreso
- Radar de dominio por temas
- Heatmap de actividad estilo GitHub

### 🏆 Gamificación Científica
- Sistema de rachas (streaks)
- 18 logros desbloqueables
- Confetti en aciertos consecutivos
- Progreso visual por tema

---

## 🛠️ Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Animaciones** | Framer Motion |
| **Gráficos** | Recharts |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) |
| **IA** | Groq API (Llama 3.3) |
| **Hosting** | Vercel |

---

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- npm o pnpm
- Cuenta en [Supabase](https://supabase.com)
- (Opcional) API key de [Groq](https://console.groq.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/infoposcore-coder/OpoScore.git
cd OpoScore
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar el ejemplo
cp apps/web/.env.example apps/web/.env.local

# Editar con tus valores
nano apps/web/.env.local
```

### 4. Configurar Supabase

Ejecuta las migraciones SQL en orden:
1. `supabase/migrations_combined/01_schema_base.sql`
2. `supabase/migrations_combined/02_schema_extended.sql`
3. `supabase/migrations_combined/03_functions_triggers.sql`
4. `supabase/migrations_combined/04_rls_policies.sql`
5. `supabase/migrations_combined/05_seed_data.sql`

Ver [scripts/setup-database.md](scripts/setup-database.md) para instrucciones detalladas.

### 5. Ejecutar en desarrollo

```bash
cd apps/web
npm run dev
```

Visita http://localhost:3000

---

## 📁 Estructura del Proyecto

```
OpoScore/
├── apps/
│   └── web/                    # Aplicación Next.js
│       ├── app/                # App Router pages
│       ├── components/         # Componentes React
│       │   ├── charts/         # Gráficos Recharts
│       │   ├── gamification/   # Logros, rachas
│       │   ├── oposcore/       # ScoreGauge
│       │   ├── onboarding/     # Flujo de bienvenida
│       │   ├── tests/          # Feedback, timer
│       │   └── ui/             # shadcn/ui + custom
│       ├── hooks/              # Custom hooks
│       └── lib/                # Utilidades
├── packages/                   # Paquetes compartidos
├── supabase/
│   ├── migrations/             # Migraciones SQL
│   ├── migrations_combined/    # Migraciones agrupadas
│   └── seed.sql                # Datos iniciales
└── scripts/                    # Scripts de utilidad
```

---

## 🗄️ Base de Datos

### Tablas principales

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfiles de usuario |
| `oposiciones` | Oposiciones disponibles |
| `temas` | Temas del temario |
| `preguntas` | Banco de preguntas |
| `tests` | Tests realizados |
| `rachas` | Días consecutivos de estudio |
| `logros` | Sistema de achievements |
| `flashcards` | Sistema Leitner de repaso |

Ver [supabase/migrations/](supabase/migrations/) para el schema completo.

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GROQ_API_KEY`
3. Deploy automático en cada push

---

## 📊 Coste de Infraestructura

| Servicio | Coste |
|----------|-------|
| Dominio .es | 8-15€/año |
| Vercel | **GRATIS** |
| Supabase | **GRATIS** (hasta 500MB) |
| Cloudflare R2 | **GRATIS** (hasta 10GB) |
| Groq API | **GRATIS** (14,400 req/día) |
| **TOTAL** | **~10€/año** |

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

## 📧 Contacto

- **Proyecto:** OpoScore
- **GitHub:** [@infoposcore-coder](https://github.com/infoposcore-coder)

---

*Desarrollado con ❤️ para opositores españoles*
