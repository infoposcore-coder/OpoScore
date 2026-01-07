-- ===========================================
-- OpoScore - Sistema de Gamificación
-- ===========================================
-- Migración 5: Logros y sistema de recompensas

-- ===========================================
-- LOGROS
-- ===========================================

-- Catálogo de logros disponibles
CREATE TABLE logros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    icono TEXT NOT NULL, -- nombre del icono (lucide)
    condicion JSONB NOT NULL, -- condiciones para desbloquear
    puntos INTEGER DEFAULT 10 NOT NULL,
    categoria TEXT DEFAULT 'general' NOT NULL -- 'racha', 'tests', 'flashcards', 'progreso', 'especial'
);

-- Logros desbloqueados por usuarios
CREATE TABLE user_logros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    logro_id UUID NOT NULL REFERENCES logros(id) ON DELETE CASCADE,
    desbloqueado_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, logro_id)
);

-- Índices
CREATE INDEX idx_user_logros_user ON user_logros(user_id);

-- ===========================================
-- LOGROS INICIALES (SEED)
-- ===========================================

INSERT INTO logros (nombre, descripcion, icono, condicion, puntos, categoria) VALUES
-- Logros de racha
('Primera Racha', 'Estudia 3 días seguidos', 'flame', '{"tipo": "racha", "dias": 3}', 10, 'racha'),
('Semana Perfecta', 'Estudia 7 días seguidos', 'calendar-check', '{"tipo": "racha", "dias": 7}', 25, 'racha'),
('Mes de Fuego', 'Estudia 30 días seguidos', 'trophy', '{"tipo": "racha", "dias": 30}', 100, 'racha'),

-- Logros de tests
('Primer Test', 'Completa tu primer test', 'check-circle', '{"tipo": "tests_completados", "cantidad": 1}', 10, 'tests'),
('Estudiante Aplicado', 'Completa 10 tests', 'book-open', '{"tipo": "tests_completados", "cantidad": 10}', 25, 'tests'),
('Experto en Tests', 'Completa 50 tests', 'award', '{"tipo": "tests_completados", "cantidad": 50}', 50, 'tests'),
('Perfección', 'Obtén 100% en un test de 20+ preguntas', 'star', '{"tipo": "test_perfecto", "min_preguntas": 20}', 50, 'tests'),

-- Logros de flashcards
('Memoria Activa', 'Revisa 50 flashcards', 'brain', '{"tipo": "flashcards_revisadas", "cantidad": 50}', 15, 'flashcards'),
('Memorión', 'Revisa 500 flashcards', 'lightbulb', '{"tipo": "flashcards_revisadas", "cantidad": 500}', 50, 'flashcards'),
('Caja 5', 'Lleva 10 flashcards a la caja 5', 'box', '{"tipo": "flashcards_dominadas", "cantidad": 10}', 30, 'flashcards'),

-- Logros de progreso
('Primer Tema', 'Completa tu primer tema', 'bookmark', '{"tipo": "temas_completados", "cantidad": 1}', 15, 'progreso'),
('Medio Temario', 'Completa el 50% del temario', 'pie-chart', '{"tipo": "temario_porcentaje", "porcentaje": 50}', 50, 'progreso'),
('Temario Completo', 'Completa el 100% del temario', 'check-circle-2', '{"tipo": "temario_porcentaje", "porcentaje": 100}', 100, 'progreso'),

-- Logros especiales
('Madrugador', 'Estudia antes de las 7:00', 'sunrise', '{"tipo": "hora_estudio", "antes_de": "07:00"}', 15, 'especial'),
('Noctámbulo', 'Estudia después de las 23:00', 'moon', '{"tipo": "hora_estudio", "despues_de": "23:00"}', 15, 'especial'),
('OpoScore 50', 'Alcanza un OpoScore de 50', 'trending-up', '{"tipo": "oposcore", "minimo": 50}', 25, 'especial'),
('OpoScore 75', 'Alcanza un OpoScore de 75', 'zap', '{"tipo": "oposcore", "minimo": 75}', 50, 'especial'),
('Preparado', 'Alcanza un OpoScore de 85', 'rocket', '{"tipo": "oposcore", "minimo": 85}', 100, 'especial');
