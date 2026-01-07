-- ===========================================
-- OpoScore - Schema Inicial
-- ===========================================
-- Migración 1: Tablas base del sistema

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLAS DE USUARIO
-- ===========================================

-- Perfiles de usuario (extiende auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT NOT NULL,
    study_hours_goal INTEGER DEFAULT 15 NOT NULL, -- horas semanales objetivo
    notification_email BOOLEAN DEFAULT TRUE NOT NULL,
    notification_push BOOLEAN DEFAULT TRUE NOT NULL,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')) NOT NULL
);

-- Rachas de estudio
CREATE TABLE rachas (
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
CREATE TABLE oposiciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    categoria TEXT NOT NULL, -- 'AGE', 'CCAA', 'Local', 'Justicia', 'Sanidad', etc.
    activa BOOLEAN DEFAULT TRUE NOT NULL,
    imagen_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    -- Metadata puede incluir: requisitos, plazas_historico, proxima_convocatoria, etc.
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Bloques temáticos (agrupan temas)
CREATE TABLE bloques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    oposicion_id UUID NOT NULL REFERENCES oposiciones(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    orden INTEGER NOT NULL,
    UNIQUE(oposicion_id, orden)
);

-- Temas del temario
CREATE TABLE temas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    bloque_id UUID NOT NULL REFERENCES bloques(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL,
    tiempo_estimado_minutos INTEGER DEFAULT 60 NOT NULL,
    UNIQUE(bloque_id, orden)
);

-- Subtemas (secciones dentro de un tema)
CREATE TABLE subtemas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    contenido_md TEXT, -- Contenido en Markdown
    orden INTEGER NOT NULL,
    UNIQUE(tema_id, orden)
);

-- ===========================================
-- TABLAS DE TESTS Y PREGUNTAS
-- ===========================================

-- Banco de preguntas
CREATE TABLE preguntas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    enunciado TEXT NOT NULL,
    tipo TEXT DEFAULT 'multiple' CHECK (tipo IN ('multiple', 'verdadero_falso')) NOT NULL,
    dificultad TEXT DEFAULT 'media' CHECK (dificultad IN ('facil', 'media', 'dificil')) NOT NULL,
    explicacion TEXT, -- Explicación de la respuesta correcta
    metadata JSONB DEFAULT '{}'::jsonb -- año_examen, fuente, etc.
);

-- Respuestas de las preguntas
CREATE TABLE respuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    pregunta_id UUID NOT NULL REFERENCES preguntas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE NOT NULL,
    orden INTEGER NOT NULL,
    UNIQUE(pregunta_id, orden)
);

-- Tests realizados por usuarios
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    oposicion_id UUID NOT NULL REFERENCES oposiciones(id) ON DELETE CASCADE,
    tipo TEXT DEFAULT 'practica' CHECK (tipo IN ('practica', 'simulacro', 'repaso')) NOT NULL,
    config JSONB DEFAULT '{}'::jsonb NOT NULL, -- num_preguntas, temas, dificultad, tiempo_limite
    completed_at TIMESTAMPTZ,
    puntuacion NUMERIC(5,2) -- porcentaje 0-100
);

-- Respuestas dadas en cada test
CREATE TABLE test_respuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    pregunta_id UUID NOT NULL REFERENCES preguntas(id) ON DELETE CASCADE,
    respuesta_id UUID REFERENCES respuestas(id) ON DELETE SET NULL, -- NULL si no respondió
    tiempo_ms INTEGER DEFAULT 0 NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(test_id, pregunta_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_preguntas_tema ON preguntas(tema_id);
CREATE INDEX idx_preguntas_dificultad ON preguntas(dificultad);
CREATE INDEX idx_respuestas_pregunta ON respuestas(pregunta_id);
CREATE INDEX idx_tests_user ON tests(user_id);
CREATE INDEX idx_tests_oposicion ON tests(oposicion_id);
CREATE INDEX idx_test_respuestas_test ON test_respuestas(test_id);
