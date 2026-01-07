-- ===========================================
-- OpoScore - Sistema Anti-Abandono
-- ===========================================
-- Migración 3: Alertas e intervenciones

-- ===========================================
-- DETECCIÓN DE ABANDONO
-- ===========================================

-- Alertas de abandono detectadas
CREATE TABLE alertas_abandono (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tipo_alerta TEXT NOT NULL CHECK (tipo_alerta IN ('inactividad', 'caida_rendimiento', 'patron_evasion', 'racha_rota')),
    nivel_riesgo TEXT NOT NULL CHECK (nivel_riesgo IN ('bajo', 'medio', 'alto')),
    detectada_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resuelta_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb -- datos adicionales del contexto
);

-- Intervenciones realizadas
CREATE TABLE intervenciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    alerta_id UUID NOT NULL REFERENCES alertas_abandono(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('email', 'push', 'in_app')),
    contenido TEXT NOT NULL,
    enviada_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    interactuada_at TIMESTAMPTZ -- cuando el usuario interactuó con la intervención
);

-- Índices
CREATE INDEX idx_alertas_user ON alertas_abandono(user_id);
CREATE INDEX idx_alertas_activas ON alertas_abandono(user_id, resuelta_at) WHERE resuelta_at IS NULL;
CREATE INDEX idx_intervenciones_alerta ON intervenciones(alerta_id);
