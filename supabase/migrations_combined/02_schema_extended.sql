-- ===========================================
-- OpoScore - Migración Completa (Parte 2)
-- ===========================================
-- Ejecutar DESPUÉS de 01_schema_base.sql

-- ===========================================
-- TABLAS DE PROGRESO DE USUARIO
-- ===========================================

-- Oposiciones en las que el usuario está inscrito
CREATE TABLE IF NOT EXISTS user_oposiciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    oposicion_id UUID NOT NULL REFERENCES oposiciones(id) ON DELETE CASCADE,
    fecha_inicio DATE DEFAULT CURRENT_DATE NOT NULL,
    fecha_objetivo DATE,
    activa BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE(user_id, oposicion_id)
);

-- Sesiones de estudio
CREATE TABLE IF NOT EXISTS sesiones_estudio (
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
CREATE TABLE IF NOT EXISTS metricas_diarias (
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
CREATE TABLE IF NOT EXISTS progreso_temas (
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

-- ===========================================
-- SISTEMA ANTI-ABANDONO
-- ===========================================

-- Alertas de abandono detectadas
CREATE TABLE IF NOT EXISTS alertas_abandono (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tipo_alerta TEXT NOT NULL CHECK (tipo_alerta IN ('inactividad', 'caida_rendimiento', 'patron_evasion', 'racha_rota')),
    nivel_riesgo TEXT NOT NULL CHECK (nivel_riesgo IN ('bajo', 'medio', 'alto')),
    detectada_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resuelta_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Intervenciones realizadas
CREATE TABLE IF NOT EXISTS intervenciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    alerta_id UUID NOT NULL REFERENCES alertas_abandono(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('email', 'push', 'in_app')),
    contenido TEXT NOT NULL,
    enviada_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    interactuada_at TIMESTAMPTZ
);

-- ===========================================
-- FLASHCARDS (Sistema Leitner)
-- ===========================================

-- Flashcards de los usuarios
CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    frente TEXT NOT NULL,
    reverso TEXT NOT NULL,
    caja INTEGER DEFAULT 1 CHECK (caja >= 1 AND caja <= 5) NOT NULL,
    proxima_revision DATE DEFAULT CURRENT_DATE NOT NULL,
    total_revisiones INTEGER DEFAULT 0 NOT NULL,
    aciertos_consecutivos INTEGER DEFAULT 0 NOT NULL
);

-- Historial de revisiones de flashcards
CREATE TABLE IF NOT EXISTS flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    acertada BOOLEAN NOT NULL,
    caja_anterior INTEGER NOT NULL,
    caja_nueva INTEGER NOT NULL,
    tiempo_respuesta_ms INTEGER
);

-- ===========================================
-- GAMIFICACIÓN
-- ===========================================

-- Catálogo de logros disponibles
CREATE TABLE IF NOT EXISTS logros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    icono TEXT NOT NULL,
    condicion JSONB NOT NULL,
    puntos INTEGER DEFAULT 10 NOT NULL,
    categoria TEXT DEFAULT 'general' NOT NULL
);

-- Logros desbloqueados por usuarios
CREATE TABLE IF NOT EXISTS user_logros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    logro_id UUID NOT NULL REFERENCES logros(id) ON DELETE CASCADE,
    desbloqueado_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, logro_id)
);

-- ===========================================
-- ÍNDICES ADICIONALES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_user_oposiciones_user ON user_oposiciones(user_id);
CREATE INDEX IF NOT EXISTS idx_user_oposiciones_activa ON user_oposiciones(user_id, activa) WHERE activa = TRUE;
CREATE INDEX IF NOT EXISTS idx_sesiones_user ON sesiones_estudio(user_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha ON sesiones_estudio(user_id, inicio);
CREATE INDEX IF NOT EXISTS idx_metricas_user_fecha ON metricas_diarias(user_id, oposicion_id, fecha);
CREATE INDEX IF NOT EXISTS idx_progreso_user ON progreso_temas(user_id);
CREATE INDEX IF NOT EXISTS idx_progreso_proxima_revision ON progreso_temas(user_id, proxima_revision);
CREATE INDEX IF NOT EXISTS idx_alertas_user ON alertas_abandono(user_id);
CREATE INDEX IF NOT EXISTS idx_alertas_activas ON alertas_abandono(user_id, resuelta_at) WHERE resuelta_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_intervenciones_alerta ON intervenciones(alerta_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_user ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_tema ON flashcards(tema_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_pendientes ON flashcards(user_id, proxima_revision) WHERE proxima_revision <= CURRENT_DATE;
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_flashcard ON flashcard_reviews(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_user_logros_user ON user_logros(user_id);
