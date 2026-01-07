-- ===========================================
-- OpoScore - Row Level Security (RLS)
-- ===========================================
-- Migración 7: Políticas de seguridad a nivel de fila

-- ===========================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ===========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rachas ENABLE ROW LEVEL SECURITY;
ALTER TABLE oposiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloques ENABLE ROW LEVEL SECURITY;
ALTER TABLE temas ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE respuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_respuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_oposiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_estudio ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_temas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_abandono ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervenciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE logros ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logros ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- POLÍTICAS DE PROFILES
-- ===========================================

-- Los usuarios pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- ===========================================
-- POLÍTICAS DE RACHAS
-- ===========================================

CREATE POLICY "Users can view own racha"
    ON rachas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own racha"
    ON rachas FOR UPDATE
    USING (auth.uid() = user_id);

-- ===========================================
-- POLÍTICAS DE CONTENIDO EDUCATIVO (Solo lectura para autenticados)
-- ===========================================

CREATE POLICY "Authenticated users can view oposiciones"
    ON oposiciones FOR SELECT
    TO authenticated
    USING (activa = TRUE);

CREATE POLICY "Authenticated users can view bloques"
    ON bloques FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM oposiciones WHERE id = bloques.oposicion_id AND activa = TRUE
    ));

CREATE POLICY "Authenticated users can view temas"
    ON temas FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM bloques b
        JOIN oposiciones o ON b.oposicion_id = o.id
        WHERE b.id = temas.bloque_id AND o.activa = TRUE
    ));

CREATE POLICY "Authenticated users can view subtemas"
    ON subtemas FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM temas t
        JOIN bloques b ON t.bloque_id = b.id
        JOIN oposiciones o ON b.oposicion_id = o.id
        WHERE t.id = subtemas.tema_id AND o.activa = TRUE
    ));

CREATE POLICY "Authenticated users can view preguntas"
    ON preguntas FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Authenticated users can view respuestas"
    ON respuestas FOR SELECT
    TO authenticated
    USING (TRUE);

-- ===========================================
-- POLÍTICAS DE TESTS
-- ===========================================

CREATE POLICY "Users can view own tests"
    ON tests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tests"
    ON tests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tests"
    ON tests FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own test_respuestas"
    ON test_respuestas FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tests WHERE id = test_respuestas.test_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can create own test_respuestas"
    ON test_respuestas FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM tests WHERE id = test_respuestas.test_id AND user_id = auth.uid()
    ));

-- ===========================================
-- POLÍTICAS DE PROGRESO
-- ===========================================

CREATE POLICY "Users can view own user_oposiciones"
    ON user_oposiciones FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own user_oposiciones"
    ON user_oposiciones FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sesiones"
    ON sesiones_estudio FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sesiones"
    ON sesiones_estudio FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own metricas"
    ON metricas_diarias FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progreso_temas"
    ON progreso_temas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progreso_temas"
    ON progreso_temas FOR ALL
    USING (auth.uid() = user_id);

-- ===========================================
-- POLÍTICAS DE ABANDONO
-- ===========================================

CREATE POLICY "Users can view own alertas"
    ON alertas_abandono FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own intervenciones"
    ON intervenciones FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM alertas_abandono WHERE id = intervenciones.alerta_id AND user_id = auth.uid()
    ));

-- ===========================================
-- POLÍTICAS DE FLASHCARDS
-- ===========================================

CREATE POLICY "Users can view own flashcards"
    ON flashcards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own flashcards"
    ON flashcards FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own flashcard_reviews"
    ON flashcard_reviews FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM flashcards WHERE id = flashcard_reviews.flashcard_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can create own flashcard_reviews"
    ON flashcard_reviews FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM flashcards WHERE id = flashcard_reviews.flashcard_id AND user_id = auth.uid()
    ));

-- ===========================================
-- POLÍTICAS DE GAMIFICACIÓN
-- ===========================================

CREATE POLICY "Everyone can view logros"
    ON logros FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Users can view own user_logros"
    ON user_logros FOR SELECT
    USING (auth.uid() = user_id);
