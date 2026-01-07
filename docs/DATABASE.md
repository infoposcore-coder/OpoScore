# Schema de Base de Datos - OpoScore

## Diagrama de Entidades

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   profiles  │───────│user_oposiciones│─────│ oposiciones │
└─────────────┘       └──────────────┘       └─────────────┘
      │                                            │
      │                                            │
      ▼                                            ▼
┌─────────────┐                            ┌─────────────┐
│   rachas    │                            │   bloques   │
└─────────────┘                            └─────────────┘
      │                                            │
      │                                            ▼
      │                                    ┌─────────────┐
      │                                    │    temas    │
      │                                    └─────────────┘
      │                                      │         │
      │                                      ▼         ▼
      │                              ┌──────────┐ ┌──────────┐
      │                              │ subtemas │ │ preguntas│
      │                              └──────────┘ └──────────┘
      │                                                │
      │                                                ▼
      │                                         ┌──────────┐
      │                                         │respuestas│
      │                                         └──────────┘
      │
      ├───────────────────────┬────────────────────┐
      ▼                       ▼                    ▼
┌─────────────┐       ┌──────────────┐     ┌─────────────┐
│    tests    │       │  flashcards  │     │alertas_aband│
└─────────────┘       └──────────────┘     └─────────────┘
      │                     │                    │
      ▼                     ▼                    ▼
┌─────────────┐       ┌──────────────┐     ┌─────────────┐
│test_respuest│       │flashcard_rev │     │intervencione│
└─────────────┘       └──────────────┘     └─────────────┘
```

## Tablas Principales

### profiles
Extiende auth.users con datos adicionales del usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Referencia a auth.users |
| email | TEXT | Email del usuario |
| full_name | TEXT | Nombre completo |
| avatar_url | TEXT | URL del avatar |
| study_hours_goal | INT | Objetivo horas semanales |
| theme | TEXT | Tema UI preferido |

### oposiciones
Catálogo de oposiciones disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| nombre | TEXT | Nombre de la oposición |
| slug | TEXT | URL-friendly name |
| categoria | TEXT | AGE, CCAA, Local, etc. |
| activa | BOOLEAN | Si está disponible |
| metadata | JSONB | Requisitos, plazas, etc. |

### temas
Temas del temario de cada oposición.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| bloque_id | UUID (FK) | Bloque al que pertenece |
| nombre | TEXT | Título del tema |
| orden | INT | Posición en el bloque |
| tiempo_estimado_minutos | INT | Tiempo de estudio estimado |

### preguntas
Banco de preguntas para tests.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| tema_id | UUID (FK) | Tema relacionado |
| enunciado | TEXT | Texto de la pregunta |
| tipo | TEXT | multiple, verdadero_falso |
| dificultad | TEXT | facil, media, dificil |
| explicacion | TEXT | Explicación de la respuesta |

### tests
Registro de tests realizados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| user_id | UUID (FK) | Usuario que realizó el test |
| oposicion_id | UUID (FK) | Oposición del test |
| tipo | TEXT | practica, simulacro, repaso |
| config | JSONB | Configuración del test |
| completed_at | TIMESTAMP | Fecha de finalización |
| puntuacion | NUMERIC | Porcentaje de aciertos |

### flashcards
Tarjetas de repaso espaciado.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| user_id | UUID (FK) | Propietario |
| tema_id | UUID (FK) | Tema relacionado |
| frente | TEXT | Pregunta/concepto |
| reverso | TEXT | Respuesta/definición |
| caja | INT | Caja Leitner (1-5) |
| proxima_revision | DATE | Cuándo revisar |

### metricas_diarias
Métricas agregadas por día.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| user_id | UUID (FK) | Usuario |
| oposicion_id | UUID (FK) | Oposición |
| fecha | DATE | Día de las métricas |
| tiempo_total_minutos | INT | Tiempo estudiado |
| preguntas_total | INT | Preguntas respondidas |
| preguntas_correctas | INT | Aciertos |
| oposcore | INT | Puntuación del día |

## Funciones SQL

### calcular_oposcore(user_id, oposicion_id)
Calcula el OpoScore actual del usuario para una oposición.

### actualizar_racha(user_id)
Actualiza la racha de estudio del usuario.

### after_test_completed()
Trigger que actualiza métricas al completar un test.

### after_flashcard_review()
Trigger que actualiza la flashcard tras revisión.

## Políticas RLS

Todas las tablas tienen Row Level Security habilitado:

- **Datos personales**: Solo el propietario puede ver/editar
- **Contenido educativo**: Lectura para todos los autenticados
- **Logros**: Catálogo público, logros de usuario privados

## Índices

Se han creado índices para optimizar las consultas más frecuentes:

- `idx_tests_user`: Búsqueda de tests por usuario
- `idx_flashcards_pendientes`: Flashcards que tocan revisar hoy
- `idx_metricas_user_fecha`: Métricas por usuario y fecha
- `idx_progreso_user`: Progreso de temas por usuario

## Migraciones

Las migraciones están en `supabase/migrations/`:

1. `00001_initial_schema.sql` - Tablas base
2. `00002_user_progress.sql` - Seguimiento y métricas
3. `00003_abandono_system.sql` - Sistema anti-abandono
4. `00004_flashcards.sql` - Sistema Leitner
5. `00005_gamification.sql` - Logros y gamificación
6. `00006_functions_triggers.sql` - Funciones y triggers
7. `00007_rls_policies.sql` - Políticas de seguridad
