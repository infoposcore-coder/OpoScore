# Instalación de Nuevas Oposiciones

## Oposiciones Añadidas

Este paquete incluye **3 nuevas oposiciones** con sus temarios completos y bancos de preguntas:

| Oposición | Temas | Preguntas | Plazas/año |
|-----------|-------|-----------|------------|
| **Correos** - Personal Laboral | 12 | 99 | ~4.000 |
| **Guardia Civil** - Escala Básica | 25 | 107 | ~2.500 |
| **Policía Nacional** - Escala Básica | 46 | 112 | ~3.000 |
| **TOTAL** | **83** | **318** | ~9.500 |

## Archivos Incluidos

```
supabase/migrations_combined/
├── 06_seed_oposiciones_nuevas.sql  # Temarios (25 KB)
└── 07_seed_preguntas.sql           # Preguntas (103 KB)
```

## Instalación

### Opción 1: Ejecutar en Supabase Dashboard

1. Ir a **SQL Editor** en tu proyecto Supabase
2. Ejecutar primero `06_seed_oposiciones_nuevas.sql`
3. Ejecutar después `07_seed_preguntas.sql`

### Opción 2: Usando psql

```bash
# Conectar a tu base de datos Supabase
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Ejecutar los scripts en orden
\i supabase/migrations_combined/06_seed_oposiciones_nuevas.sql
\i supabase/migrations_combined/07_seed_preguntas.sql
```

### Opción 3: Script automático

```bash
# Desde la raíz del proyecto
cd OpoScore

# Establecer variables de entorno
export SUPABASE_URL="https://tu-proyecto.supabase.co"
export SUPABASE_DB_PASSWORD="tu-password"

# Ejecutar migraciones
psql "$SUPABASE_URL" -f supabase/migrations_combined/06_seed_oposiciones_nuevas.sql
psql "$SUPABASE_URL" -f supabase/migrations_combined/07_seed_preguntas.sql
```

## Estructura de Datos

### Oposiciones

```sql
-- Correos
ID: b2c3d4e5-f6a7-8901-bcde-f23456789012
Slug: correos-personal-laboral

-- Guardia Civil  
ID: c3d4e5f6-a7b8-9012-cdef-345678901234
Slug: guardia-civil-escala-basica

-- Policía Nacional
ID: d4e5f6a7-b8c9-0123-defa-456789012345
Slug: policia-nacional-escala-basica
```

### Bloques y Temas

Cada oposición tiene sus bloques temáticos organizados:

**Correos (4 bloques):**
- Organización y Normativa
- Productos y Servicios
- Procesos Operativos
- Atención al Cliente y Normativa

**Guardia Civil (4 bloques):**
- Ciencias Jurídicas (12 temas)
- Ciencias Sociales (5 temas)
- Materias Técnico-Científicas (7 temas)
- Lengua Extranjera (1 tema)

**Policía Nacional (3 bloques):**
- Ciencias Jurídicas (26 temas)
- Ciencias Sociales (12 temas)
- Materias Técnico-Científicas (8 temas)

### Preguntas

Las preguntas siguen el formato:

```json
{
  "tema_id": "UUID del tema",
  "enunciado": "Texto de la pregunta",
  "opciones": {
    "A": "Opción A",
    "B": "Opción B", 
    "C": "Opción C",
    "D": "Opción D"
  },
  "respuesta_correcta": "B",
  "explicacion": "Explicación detallada",
  "dificultad": "facil|media|dificil"
}
```

## Verificación

Después de ejecutar los scripts, verifica con:

```sql
-- Contar oposiciones
SELECT COUNT(*) FROM oposiciones;
-- Esperado: 4 (1 original + 3 nuevas)

-- Contar temas
SELECT o.nombre, COUNT(t.id) as temas
FROM oposiciones o
LEFT JOIN bloques b ON b.oposicion_id = o.id
LEFT JOIN temas t ON t.bloque_id = b.id
GROUP BY o.nombre;

-- Contar preguntas
SELECT COUNT(*) FROM preguntas;
-- Esperado: 318+
```

## Notas

- Los UUIDs son fijos para permitir referencias cruzadas
- Usar `ON CONFLICT DO NOTHING` para evitar duplicados
- Las preguntas incluyen explicaciones para feedback educativo
- Dificultad clasificada: fácil (33%), media (55%), difícil (12%)

---

*Generado automáticamente con MCP - OpoScore v1.0*
