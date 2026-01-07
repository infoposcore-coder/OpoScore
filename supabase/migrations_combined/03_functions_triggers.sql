-- ===========================================
-- OpoScore - Funciones y Triggers
-- ===========================================
-- Ejecutar DESPUÉS de 02_schema_extended.sql

-- ===========================================
-- FUNCIONES DE UTILIDAD
-- ===========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rachas_updated_at ON rachas;
CREATE TRIGGER update_rachas_updated_at
    BEFORE UPDATE ON rachas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_progreso_temas_updated_at ON progreso_temas;
CREATE TRIGGER update_progreso_temas_updated_at
    BEFORE UPDATE ON progreso_temas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FUNCIÓN: Crear perfil automáticamente al registrarse
-- ===========================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );

    -- Crear registro de racha inicial
    INSERT INTO rachas (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- FUNCIÓN: Actualizar racha
-- ===========================================

CREATE OR REPLACE FUNCTION actualizar_racha(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_ultima_actividad DATE;
    v_hoy DATE := CURRENT_DATE;
    v_dias_consecutivos INTEGER;
    v_mejor_racha INTEGER;
BEGIN
    SELECT ultima_actividad, dias_consecutivos, mejor_racha
    INTO v_ultima_actividad, v_dias_consecutivos, v_mejor_racha
    FROM rachas
    WHERE user_id = p_user_id;

    IF v_ultima_actividad IS NULL THEN
        UPDATE rachas
        SET dias_consecutivos = 1,
            mejor_racha = 1,
            ultima_actividad = v_hoy
        WHERE user_id = p_user_id;
    ELSIF v_ultima_actividad = v_hoy THEN
        NULL;
    ELSIF v_ultima_actividad = v_hoy - 1 THEN
        v_dias_consecutivos := v_dias_consecutivos + 1;
        UPDATE rachas
        SET dias_consecutivos = v_dias_consecutivos,
            mejor_racha = GREATEST(v_mejor_racha, v_dias_consecutivos),
            ultima_actividad = v_hoy
        WHERE user_id = p_user_id;
    ELSE
        UPDATE rachas
        SET dias_consecutivos = 1,
            ultima_actividad = v_hoy
        WHERE user_id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- TRIGGER: Actualizar métricas al completar test
-- ===========================================

CREATE OR REPLACE FUNCTION after_test_completed()
RETURNS TRIGGER AS $$
DECLARE
    v_fecha DATE := CURRENT_DATE;
    v_total INTEGER;
    v_correctas INTEGER;
BEGIN
    IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
        SELECT COUNT(*), SUM(CASE WHEN es_correcta THEN 1 ELSE 0 END)
        INTO v_total, v_correctas
        FROM test_respuestas
        WHERE test_id = NEW.id;

        NEW.puntuacion := CASE WHEN v_total > 0
                              THEN (v_correctas::NUMERIC / v_total) * 100
                              ELSE 0 END;

        INSERT INTO metricas_diarias (user_id, oposicion_id, fecha, preguntas_total, preguntas_correctas)
        VALUES (NEW.user_id, NEW.oposicion_id, v_fecha, v_total, v_correctas)
        ON CONFLICT (user_id, oposicion_id, fecha)
        DO UPDATE SET
            preguntas_total = metricas_diarias.preguntas_total + v_total,
            preguntas_correctas = metricas_diarias.preguntas_correctas + v_correctas;

        PERFORM actualizar_racha(NEW.user_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_after_test_completed ON tests;
CREATE TRIGGER trigger_after_test_completed
    BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION after_test_completed();

-- ===========================================
-- TRIGGER: Actualizar flashcard después de revisión
-- ===========================================

CREATE OR REPLACE FUNCTION after_flashcard_review()
RETURNS TRIGGER AS $$
DECLARE
    v_dias_por_caja INTEGER[] := ARRAY[1, 2, 4, 7, 14];
BEGIN
    UPDATE flashcards
    SET caja = NEW.caja_nueva,
        proxima_revision = CURRENT_DATE + v_dias_por_caja[NEW.caja_nueva],
        total_revisiones = total_revisiones + 1,
        aciertos_consecutivos = CASE
            WHEN NEW.acertada THEN aciertos_consecutivos + 1
            ELSE 0
        END
    WHERE id = NEW.flashcard_id;

    PERFORM actualizar_racha(
        (SELECT user_id FROM flashcards WHERE id = NEW.flashcard_id)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_after_flashcard_review ON flashcard_reviews;
CREATE TRIGGER trigger_after_flashcard_review
    AFTER INSERT ON flashcard_reviews
    FOR EACH ROW EXECUTE FUNCTION after_flashcard_review();
