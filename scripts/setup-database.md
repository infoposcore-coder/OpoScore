# 🚀 Configuración de Base de Datos Supabase - OpoScore

## ⚠️ PASO 0: REGENERAR CLAVES (CRÍTICO)

**Las claves fueron expuestas públicamente.** Debes regenerarlas AHORA:

1. Ve a: https://supabase.com/dashboard/project/bsnnlapjqmpvlikfbgcz/settings/api
2. En "Project API keys":
   - Haz clic en "Regenerate" en `anon` key
   - Haz clic en "Regenerate" en `service_role` key
3. Guarda las nuevas claves en un lugar seguro

---

## 📋 PASO 1: Aplicar Migraciones

### Opción A: Desde Supabase Dashboard (Más fácil)

1. Ve a: https://supabase.com/dashboard/project/bsnnlapjqmpvlikfbgcz/sql/new

2. **Ejecuta EN ORDEN** (espera que termine cada uno antes del siguiente):

   | Archivo | Descripción |
   |---------|-------------|
   | `migrations_combined/01_schema_base.sql` | Tablas base |
   | `migrations_combined/02_schema_extended.sql` | Tablas de progreso y gamificación |
   | `migrations_combined/03_functions_triggers.sql` | Funciones y triggers |
   | `migrations_combined/04_rls_policies.sql` | Políticas de seguridad |
   | `migrations_combined/05_seed_data.sql` | Datos iniciales |

3. Copia el contenido de cada archivo, pégalo en el editor SQL y haz clic en **"Run"**

### Opción B: Con Supabase CLI

```powershell
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Login
supabase login

# Ir al proyecto
cd C:\Users\antonio.burgos\OpoScore

# Linkear proyecto
supabase link --project-ref bsnnlapjqmpvlikfbgcz

# Aplicar migraciones
supabase db push
```

---

## 🔧 PASO 2: Actualizar Variables de Entorno

Edita `apps/web/.env.local` con tus **NUEVAS** claves:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bsnnlapjqmpvlikfbgcz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<TU_NUEVA_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<TU_NUEVA_SERVICE_KEY>

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Groq API para Tutor IA (obtener en console.groq.com)
GROQ_API_KEY=

# OpenRouter (fallback, opcional)
OPENROUTER_API_KEY=
```

---

## ✅ PASO 3: Verificar la Base de Datos

1. Ve a Table Editor: https://supabase.com/dashboard/project/bsnnlapjqmpvlikfbgcz/editor

2. Verifica que existen estas tablas:

   **Tablas de usuario:**
   - [ ] profiles
   - [ ] rachas

   **Tablas de contenido:**
   - [ ] oposiciones
   - [ ] bloques
   - [ ] temas
   - [ ] preguntas
   - [ ] respuestas

   **Tablas de progreso:**
   - [ ] tests
   - [ ] test_respuestas
   - [ ] user_oposiciones
   - [ ] sesiones_estudio
   - [ ] metricas_diarias
   - [ ] progreso_temas

   **Tablas de gamificación:**
   - [ ] logros
   - [ ] user_logros
   - [ ] flashcards
   - [ ] flashcard_reviews

   **Tablas de abandono:**
   - [ ] alertas_abandono
   - [ ] intervenciones

3. Verifica que hay datos en:
   - `oposiciones` (1 registro: Auxiliar AGE)
   - `bloques` (4 registros)
   - `temas` (16 registros)
   - `preguntas` (13 registros)
   - `logros` (18 registros)

---

## 🔐 PASO 4: Habilitar Autenticación

1. Ve a: https://supabase.com/dashboard/project/bsnnlapjqmpvlikfbgcz/auth/providers

2. Habilita **Email** provider:
   - Enable Email provider: ✅ ON
   - Confirm email: OFF (para desarrollo, ON en producción)
   - Double confirm email changes: OFF

3. (Opcional) Habilita **Google** OAuth:
   - Necesitarás credenciales de Google Cloud Console

---

## 🧪 PASO 5: Probar la Conexión

```powershell
cd C:\Users\antonio.burgos\OpoScore\apps\web
npm run dev
```

1. Visita http://localhost:3000
2. Prueba registrarte con un email
3. Verifica en Supabase que se creó el usuario en:
   - Authentication > Users
   - Table Editor > profiles

---

## 📊 Datos Incluidos en el Seed

| Entidad | Cantidad | Descripción |
|---------|----------|-------------|
| Oposiciones | 1 | Auxiliar Administrativo AGE |
| Bloques | 4 | Organización, Oficinas, Actividad, Ofimática |
| Temas | 16 | Todos los temas del temario |
| Preguntas | 13 | Constitución + Procedimiento |
| Logros | 18 | Rachas, tests, flashcards, progreso |

---

## 🆘 Solución de Problemas

### Error: "permission denied for table profiles"
- Verifica que ejecutaste `04_rls_policies.sql`
- Asegúrate de que el usuario está autenticado

### Error: "relation does not exist"
- Ejecuta las migraciones EN ORDEN
- No saltes ningún archivo

### Error de CORS
- Añade tu dominio en Supabase Dashboard > Settings > API > CORS

### El registro no crea perfil
- Verifica que el trigger `on_auth_user_created` existe
- Revisa Database > Functions > handle_new_user

---

## 📁 Estructura de Archivos de Migración

```
supabase/
├── migrations_combined/           # ← USA ESTOS (más fáciles)
│   ├── 01_schema_base.sql
│   ├── 02_schema_extended.sql
│   ├── 03_functions_triggers.sql
│   ├── 04_rls_policies.sql
│   └── 05_seed_data.sql
│
├── migrations/                    # Originales (granulares)
│   ├── 00001_initial_schema.sql
│   ├── 00002_user_progress.sql
│   ├── 00003_abandono_system.sql
│   ├── 00004_flashcards.sql
│   ├── 00005_gamification.sql
│   ├── 00006_functions_triggers.sql
│   └── 00007_rls_policies.sql
│
└── seed.sql                       # Datos de ejemplo
```

---

## ✨ ¡Listo!

Una vez completados todos los pasos, tu base de datos estará lista para:

- ✅ Registro/Login de usuarios
- ✅ Almacenar progreso de tests
- ✅ Sistema de rachas
- ✅ Gamificación con logros
- ✅ Flashcards con repaso espaciado
- ✅ Detección de abandono

---

*Creado: 7 Enero 2026*
