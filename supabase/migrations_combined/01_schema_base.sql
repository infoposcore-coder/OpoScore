-- ===========================================
-- OpoScore - Migración Completa
-- ===========================================
-- Ejecutar en: https://supabase.com/dashboard/project/bsnnlapjqmpvlikfbgcz/sql/new
-- Ejecutar EN ORDEN, esperar a que termine cada bloque

-- ===========================================
-- PARTE 1: EXTENSIONES Y TABLAS BASE
-- ===========================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLAS DE USUARIO
-- ===========================================

-- Perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT NOT NULL,
    study_hours_goal INTEGER DEFAULT 15 NOT NULL,
    notification_email BOOLEAN DEFAULT TRUE NOT NULL,
    notification_push BOOLEAN DEFAULT TRUE NOT NULL,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')) NOT NULL
);

-- Rachas de estudio
CREATE TABLE IF NOT EXISTS rachas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    dias_consecutivos INTEGER DEFAULT 0 NOT NULL,
    mejor_racha INTEGER DEFAULT 0 NOT NULL,
    ultima_actividad DATE DEFAULT CURRENT_DATE NOT NULL,
    UNIQUE(user_id)
);

-- ===========================================
-- TABLAS DE CONTENIDO EDUCATIVO
-- ===========================================

-- Oposiciones disponibles
CREATE TABLE IF NOT EXISTS oposiciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    categoria TEXT NOT NULL,
    activa BOOLEAN DEFAULT TRUE NOT NULL,
    imagen_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Bloques temáticos
CREATE TABLE IF NOT EXISTS bloques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    oposicion_id UUID NOT NULL REFERENCES oposiciones(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    orden INTEGER NOT NULL,
    UNIQUE(oposicion_id, orden)
);

-- Temas del temario
CREATE TABLE IF NOT EXISTS temas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    bloque_id UUID NOT NULL REFERENCES bloques(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL,
    tiempo_estimado_minutos INTEGER DEFAULT 60 NOT NULL,
    UNIQUE(bloque_id, orden)
);

-- Subtemas
CREATE TABLE IF NOT EXISTS subtemas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    contenido_md TEXT,
    orden INTEGER NOT NULL,
    UNIQUE(tema_id, orden)
);

-- ===========================================
-- TABLAS DE TESTS Y PREGUNTAS
-- ===========================================

-- Banco de preguntas
CREATE TABLE IF NOT EXISTS preguntas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    enunciado TEXT NOT NULL,
    tipo TEXT DEFAULT 'multiple' CHECK (tipo IN ('multiple', 'verdadero_falso')) NOT NULL,
    dificultad TEXT DEFAULT 'media' CHECK (dificultad IN ('facil', 'media', 'dificil')) NOT NULL,
    explicacion TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Respuestas de las preguntas
CREATE TABLE IF NOT EXISTS respuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    pregunta_id UUID NOT NULL REFERENCES preguntas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE NOT NULL,
    orden INTEGER NOT NULL,
    UNIQUE(pregunta_id, orden)
);

-- Tests realizados por usuarios
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    oposicion_id UUID NOT NULL REFERENCES oposiciones(id) ON DELETE CASCADE,
    tipo TEXT DEFAULT 'practica' CHECK (tipo IN ('practica', 'simulacro', 'repaso')) NOT NULL,
    config JSONB DEFAULT '{}'::jsonb NOT NULL,
    completed_at TIMESTAMPTZ,
    puntuacion NUMERIC(5,2)
);

-- Respuestas dadas en cada test
CREATE TABLE IF NOT EXISTS test_respuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    pregunta_id UUID NOT NULL REFERENCES preguntas(id) ON DELETE CASCADE,
    respuesta_id UUID REFERENCES respuestas(id) ON DELETE SET NULL,
    tiempo_ms INTEGER DEFAULT 0 NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(test_id, pregunta_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_preguntas_tema ON preguntas(tema_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_dificultad ON preguntas(dificultad);
CREATE INDEX IF NOT EXISTS idx_respuestas_pregunta ON respuestas(pregunta_id);
CREATE INDEX IF NOT EXISTS idx_tests_user ON tests(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_oposicion ON tests(oposicion_id);
CREATE INDEX IF NOT EXISTS idx_test_respuestas_test ON test_respuestas(test_id);
