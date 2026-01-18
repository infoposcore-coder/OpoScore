-- ===========================================
-- OpoScore - Tablas para Métricas ML
-- Migración: 00010_ml_metrics_tables.sql
-- ===========================================

-- 1. Tabla de sesiones de estudio
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    oposicion_id UUID REFERENCES oposiciones(id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    tests_completed INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    device_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_date ON user_sessions(started_at);

-- 2. Tabla de respuestas individuales (tracking detallado)
CREATE TABLE IF NOT EXISTS user_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pregunta_id UUID NOT NULL REFERENCES preguntas(id) ON DELETE CASCADE,
    test_id UUID REFERENCES tests(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    respuesta_elegida UUID REFERENCES respuestas(id),
    es_correcta BOOLEAN NOT NULL,
    tiempo_respuesta_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para user_responses
CREATE INDEX IF NOT EXISTS idx_user_responses_user ON user_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_pregunta ON user_responses(pregunta_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_date ON user_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_user_responses_user_date ON user_responses(user_id, created_at);

-- 3. Tabla de estadísticas diarias agregadas
CREATE TABLE IF NOT EXISTS user_daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    oposicion_id UUID REFERENCES oposiciones(id),
    fecha DATE NOT NULL,

    -- Métricas de actividad
    minutos_estudio INTEGER DEFAULT 0,
    tests_completados INTEGER DEFAULT 0,
    preguntas_respondidas INTEGER DEFAULT 0,
    respuestas_correctas INTEGER DEFAULT 0,

    -- Métricas calculadas
    porcentaje_aciertos DECIMAL(5,2),
    tiempo_medio_respuesta_ms INTEGER,

    -- Métricas por bloque (JSONB para flexibilidad)
    stats_por_bloque JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, oposicion_id, fecha)
);

-- Índices para user_daily_stats
CREATE INDEX IF NOT EXISTS idx_user_daily_stats_user ON user_daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_stats_fecha ON user_daily_stats(fecha);
CREATE INDEX IF NOT EXISTS idx_user_daily_stats_user_fecha ON user_daily_stats(user_id, fecha);

-- 4. Tabla de predicciones ML (cache)
CREATE TABLE IF NOT EXISTS user_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    oposicion_id UUID REFERENCES oposiciones(id),

    -- Predicciones
    probabilidad_aprobado DECIMAL(5,2),
    confianza_modelo DECIMAL(5,2),
    dias_hasta_listo INTEGER,
    fecha_estimada_listo DATE,

    -- Features usadas para la predicción
    features_snapshot JSONB,

    -- Metadatos
    modelo_version VARCHAR(50),
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para user_predictions
CREATE INDEX IF NOT EXISTS idx_user_predictions_user ON user_predictions(user_id);

-- 5. Tabla de ranking global
CREATE TABLE IF NOT EXISTS user_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    oposicion_id UUID REFERENCES oposiciones(id),

    -- Rankings
    posicion_global INTEGER,
    total_usuarios INTEGER,
    percentil DECIMAL(5,2),

    -- Rankings por categoría
    posicion_oposicion INTEGER,
    total_oposicion INTEGER,
    percentil_oposicion DECIMAL(5,2),

    -- Score usado para ranking
    score_ranking DECIMAL(10,4),

    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, oposicion_id)
);

-- Índices para user_rankings
CREATE INDEX IF NOT EXISTS idx_user_rankings_user ON user_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rankings_score ON user_rankings(score_ranking DESC);

-- 6. Tabla de análisis de debilidades
CREATE TABLE IF NOT EXISTS user_weaknesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    oposicion_id UUID REFERENCES oposiciones(id),

    -- Debilidades detectadas
    bloque_id UUID REFERENCES bloques(id),
    tema_id UUID REFERENCES temas(id),

    -- Métricas
    porcentaje_aciertos DECIMAL(5,2),
    total_intentos INTEGER,
    prioridad INTEGER, -- 1 = más urgente

    -- Comparativa
    media_plataforma DECIMAL(5,2),
    diferencia_media DECIMAL(5,2),

    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para user_weaknesses
CREATE INDEX IF NOT EXISTS idx_user_weaknesses_user ON user_weaknesses(user_id);

-- 7. Añadir campos a profiles para métricas agregadas
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_preguntas_respondidas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_respuestas_correctas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS porcentaje_global DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS minutos_totales_estudio INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tests_totales_completados INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mejor_racha INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ultimo_calculo_stats TIMESTAMPTZ;

-- ===========================================
-- Funciones y Triggers
-- ===========================================

-- Función para actualizar estadísticas diarias
CREATE OR REPLACE FUNCTION update_user_daily_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_oposicion_id UUID;
    v_fecha DATE;
BEGIN
    -- Obtener la oposición de la pregunta
    SELECT t.oposicion_id INTO v_oposicion_id
    FROM preguntas p
    JOIN temas t ON p.tema_id = t.id
    WHERE p.id = NEW.pregunta_id;

    v_fecha := DATE(NEW.created_at);

    -- Insertar o actualizar stats diarias
    INSERT INTO user_daily_stats (user_id, oposicion_id, fecha, preguntas_respondidas, respuestas_correctas, porcentaje_aciertos)
    VALUES (
        NEW.user_id,
        v_oposicion_id,
        v_fecha,
        1,
        CASE WHEN NEW.es_correcta THEN 1 ELSE 0 END,
        CASE WHEN NEW.es_correcta THEN 100.00 ELSE 0.00 END
    )
    ON CONFLICT (user_id, oposicion_id, fecha)
    DO UPDATE SET
        preguntas_respondidas = user_daily_stats.preguntas_respondidas + 1,
        respuestas_correctas = user_daily_stats.respuestas_correctas + CASE WHEN NEW.es_correcta THEN 1 ELSE 0 END,
        porcentaje_aciertos = ROUND(
            ((user_daily_stats.respuestas_correctas + CASE WHEN NEW.es_correcta THEN 1 ELSE 0 END)::DECIMAL /
            (user_daily_stats.preguntas_respondidas + 1)) * 100, 2
        ),
        updated_at = NOW();

    -- Actualizar totales en profile
    UPDATE profiles
    SET
        total_preguntas_respondidas = COALESCE(total_preguntas_respondidas, 0) + 1,
        total_respuestas_correctas = COALESCE(total_respuestas_correctas, 0) + CASE WHEN NEW.es_correcta THEN 1 ELSE 0 END,
        porcentaje_global = ROUND(
            ((COALESCE(total_respuestas_correctas, 0) + CASE WHEN NEW.es_correcta THEN 1 ELSE 0 END)::DECIMAL /
            (COALESCE(total_preguntas_respondidas, 0) + 1)) * 100, 2
        ),
        ultimo_calculo_stats = NOW()
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar stats en cada respuesta
DROP TRIGGER IF EXISTS trg_update_daily_stats ON user_responses;
CREATE TRIGGER trg_update_daily_stats
    AFTER INSERT ON user_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_user_daily_stats();

-- Función para calcular ranking
CREATE OR REPLACE FUNCTION calculate_user_ranking(p_user_id UUID, p_oposicion_id UUID DEFAULT NULL)
RETURNS TABLE(
    posicion_global INTEGER,
    total_usuarios INTEGER,
    percentil DECIMAL,
    score DECIMAL
) AS $$
DECLARE
    v_score DECIMAL;
    v_pos INTEGER;
    v_total INTEGER;
BEGIN
    -- Calcular score del usuario (basado en % aciertos ponderado por volumen)
    SELECT
        COALESCE(porcentaje_global, 0) * LOG(GREATEST(total_preguntas_respondidas, 1) + 1)
    INTO v_score
    FROM profiles
    WHERE id = p_user_id;

    -- Contar posición
    SELECT COUNT(*) + 1 INTO v_pos
    FROM profiles
    WHERE (porcentaje_global * LOG(GREATEST(total_preguntas_respondidas, 1) + 1)) > v_score
    AND total_preguntas_respondidas > 0;

    -- Total usuarios activos
    SELECT COUNT(*) INTO v_total
    FROM profiles
    WHERE total_preguntas_respondidas > 0;

    RETURN QUERY SELECT
        v_pos::INTEGER,
        v_total::INTEGER,
        ROUND(((v_total - v_pos + 1)::DECIMAL / GREATEST(v_total, 1)) * 100, 2),
        ROUND(v_score, 4);
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- RLS Policies
-- ===========================================

-- user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
    ON user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
    ON user_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON user_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- user_responses
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own responses"
    ON user_responses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
    ON user_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- user_daily_stats
ALTER TABLE user_daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily stats"
    ON user_daily_stats FOR SELECT
    USING (auth.uid() = user_id);

-- user_predictions
ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions"
    ON user_predictions FOR SELECT
    USING (auth.uid() = user_id);

-- user_rankings
ALTER TABLE user_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rankings"
    ON user_rankings FOR SELECT
    USING (auth.uid() = user_id);

-- user_weaknesses
ALTER TABLE user_weaknesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weaknesses"
    ON user_weaknesses FOR SELECT
    USING (auth.uid() = user_id);

-- ===========================================
-- Verificación
-- ===========================================
SELECT 'Migración ML Metrics completada' as resultado;
