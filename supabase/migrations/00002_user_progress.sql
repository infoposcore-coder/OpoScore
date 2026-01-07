-- ===========================================
-- OpoScore - Progreso de Usuario
-- ===========================================
-- Migración 2: Tablas de seguimiento y métricas

-- ===========================================
-- INSCRIPCIÓN Y SEGUIMIENTO
-- ===========================================

-- Oposiciones en las que el usuario está inscrito
CREATE TABLE user_oposiciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    oposicion_id UUID NOT NULL REFERENCES oposiciones(id) ON DELETE CASCADE,
    fecha_inicio DATE DEFAULT CURRENT_DATE NOT NULL,
    fecha_objetivo DATE, -- Fecha estimada del examen
    activa BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE(user_id, oposicion_id)
);

-- Sesiones de estudio
CREATE TABLE sesiones_estudio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    oposicion_id UUID NOT NULL REFERENCES oposiciones(id) ON DELETE CASCADE,
    inicio TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    fin TIMESTAMPTZ,
    tipo_actividad TEXT NOT NULL CHECK (tipo_actividad IN ('lectura', 'test', 'flashcards', 'simulacro')),
    duracion_minutos INTEGER GENERATED ALWAYS AS (
        CASE
            WHEN fin IS NOT NULL THEN EXTRACT(EPOCH FROM (fin - inicio)) / 60
            ELSE NULL
        END
    ) STORED
);

-- Métricas diarias agregadas
CREATE TABLE metricas_diarias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    oposicion_id UUID NOT NULL REFERENCES oposiciones(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    tiempo_total_minutos INTEGER DEFAULT 0 NOT NULL,
    preguntas_total INTEGER DEFAULT 0 NOT NULL,
    preguntas_correctas INTEGER DEFAULT 0 NOT NULL,
    oposcore INTEGER DEFAULT 0 NOT NULL CHECK (oposcore >= 0 AND oposcore <= 100),
    UNIQUE(user_id, oposicion_id, fecha)
);

-- Progreso por tema
CREATE TABLE progreso_temas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    porcentaje_completado INTEGER DEFAULT 0 NOT NULL CHECK (porcentaje_completado >= 0 AND porcentaje_completado <= 100),
    nivel_dominio TEXT DEFAULT 'sin_empezar' CHECK (nivel_dominio IN ('sin_empezar', 'aprendiendo', 'practicando', 'dominado')) NOT NULL,
    ultima_revision TIMESTAMPTZ,
    proxima_revision TIMESTAMPTZ,
    aciertos_totales INTEGER DEFAULT 0 NOT NULL,
    intentos_totales INTEGER DEFAULT 0 NOT NULL,
    UNIQUE(user_id, tema_id)
);

-- Índices
CREATE INDEX idx_user_oposiciones_user ON user_oposiciones(user_id);
CREATE INDEX idx_user_oposiciones_activa ON user_oposiciones(user_id, activa) WHERE activa = TRUE;
CREATE INDEX idx_sesiones_user ON sesiones_estudio(user_id);
CREATE INDEX idx_sesiones_fecha ON sesiones_estudio(user_id, inicio);
CREATE INDEX idx_metricas_user_fecha ON metricas_diarias(user_id, oposicion_id, fecha);
CREATE INDEX idx_progreso_user ON progreso_temas(user_id);
CREATE INDEX idx_progreso_proxima_revision ON progreso_temas(user_id, proxima_revision);
