-- ===========================================
-- OpoScore - Funciones y Triggers
-- ===========================================
-- Migración 6: Funciones del sistema y triggers automáticos

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
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rachas_updated_at
    BEFORE UPDATE ON rachas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- FUNCIÓN: Calcular OpoScore
-- ===========================================

CREATE OR REPLACE FUNCTION calcular_oposcore(
    p_user_id UUID,
    p_oposicion_id UUID
) RETURNS INTEGER AS $$
DECLARE
    v_porcentaje_completado NUMERIC;
    v_media_aciertos NUMERIC;
    v_dias_racha INTEGER;
    v_tiempo_semana_horas NUMERIC;
    v_tendencia TEXT;
    v_score NUMERIC := 0;
    v_aciertos_recientes NUMERIC[];
BEGIN
    -- Factor 1: Porcentaje de temario completado (peso: 25%)
    SELECT COALESCE(AVG(porcentaje_completado), 0) INTO v_porcentaje_completado
    FROM progreso_temas pt
    JOIN temas t ON pt.tema_id = t.id
    JOIN bloques b ON t.bloque_id = b.id
    WHERE pt.user_id = p_user_id AND b.oposicion_id = p_oposicion_id;

    -- Factor 2: Media de aciertos en tests (peso: 35%)
    SELECT COALESCE(AVG(puntuacion), 0) INTO v_media_aciertos
    FROM tests
    WHERE user_id = p_user_id
      AND oposicion_id = p_oposicion_id
      AND completed_at IS NOT NULL
      AND created_at > NOW() - INTERVAL '30 days';

    -- Factor 3: Días de racha (peso: 20%)
    SELECT COALESCE(dias_consecutivos, 0) INTO v_dias_racha
    FROM rachas
    WHERE user_id = p_user_id;

    -- Factor 4: Tiempo de estudio semanal (peso: 10%)
    SELECT COALESCE(SUM(duracion_minutos) / 60.0, 0) INTO v_tiempo_semana_horas
    FROM sesiones_estudio
    WHERE user_id = p_user_id
      AND oposicion_id = p_oposicion_id
      AND inicio > NOW() - INTERVAL '7 days';

    -- Factor 5: Tendencia de aciertos (peso: 10%)
    -- Obtener últimos 7 días de porcentajes
    SELECT ARRAY_AGG(dia_aciertos ORDER BY fecha) INTO v_aciertos_recientes
    FROM (
        SELECT fecha,
               CASE WHEN preguntas_total > 0
                    THEN (preguntas_correctas::NUMERIC / preguntas_total) * 100
                    ELSE 0 END as dia_aciertos
        FROM metricas_diarias
        WHERE user_id = p_user_id AND oposicion_id = p_oposicion_id
        ORDER BY fecha DESC
        LIMIT 7
    ) sub;

    -- Calcular tendencia
    IF array_length(v_aciertos_recientes, 1) >= 3 THEN
        DECLARE
            v_primera_mitad NUMERIC;
            v_segunda_mitad NUMERIC;
        BEGIN
            v_primera_mitad := (v_aciertos_recientes[1] + v_aciertos_recientes[2]) / 2;
            v_segunda_mitad := (v_aciertos_recientes[array_length(v_aciertos_recientes, 1) - 1] +
                               v_aciertos_recientes[array_length(v_aciertos_recientes, 1)]) / 2;

            IF v_segunda_mitad - v_primera_mitad > 5 THEN
                v_tendencia := 'subiendo';
            ELSIF v_segunda_mitad - v_primera_mitad < -5 THEN
                v_tendencia := 'bajando';
            ELSE
                v_tendencia := 'estable';
            END IF;
        END;
    ELSE
        v_tendencia := 'estable';
    END IF;

    -- Calcular score final
    v_score := v_score + (v_porcentaje_completado * 0.25);
    v_score := v_score + (v_media_aciertos * 0.35);
    v_score := v_score + (LEAST(v_dias_racha * 5, 100) * 0.20);
    v_score := v_score + (LEAST((v_tiempo_semana_horas / 15.0) * 100, 100) * 0.10);
    v_score := v_score + (CASE v_tendencia
                            WHEN 'subiendo' THEN 100
                            WHEN 'estable' THEN 60
                            ELSE 20
                          END * 0.10);

    RETURN ROUND(v_score);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
        -- Primera actividad
        UPDATE rachas
        SET dias_consecutivos = 1,
            mejor_racha = 1,
            ultima_actividad = v_hoy
        WHERE user_id = p_user_id;
    ELSIF v_ultima_actividad = v_hoy THEN
        -- Ya estudió hoy, no hacer nada
        NULL;
    ELSIF v_ultima_actividad = v_hoy - 1 THEN
        -- Día consecutivo
        v_dias_consecutivos := v_dias_consecutivos + 1;
        UPDATE rachas
        SET dias_consecutivos = v_dias_consecutivos,
            mejor_racha = GREATEST(v_mejor_racha, v_dias_consecutivos),
            ultima_actividad = v_hoy
        WHERE user_id = p_user_id;
    ELSE
        -- Racha rota
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
        -- Contar respuestas
        SELECT COUNT(*), SUM(CASE WHEN es_correcta THEN 1 ELSE 0 END)
        INTO v_total, v_correctas
        FROM test_respuestas
        WHERE test_id = NEW.id;

        -- Actualizar puntuación del test
        NEW.puntuacion := CASE WHEN v_total > 0
                              THEN (v_correctas::NUMERIC / v_total) * 100
                              ELSE 0 END;

        -- Actualizar o insertar métricas diarias
        INSERT INTO metricas_diarias (user_id, oposicion_id, fecha, preguntas_total, preguntas_correctas)
        VALUES (NEW.user_id, NEW.oposicion_id, v_fecha, v_total, v_correctas)
        ON CONFLICT (user_id, oposicion_id, fecha)
        DO UPDATE SET
            preguntas_total = metricas_diarias.preguntas_total + v_total,
            preguntas_correctas = metricas_diarias.preguntas_correctas + v_correctas;

        -- Actualizar racha
        PERFORM actualizar_racha(NEW.user_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
    -- Actualizar la flashcard
    UPDATE flashcards
    SET caja = NEW.caja_nueva,
        proxima_revision = CURRENT_DATE + v_dias_por_caja[NEW.caja_nueva],
        total_revisiones = total_revisiones + 1,
        aciertos_consecutivos = CASE
            WHEN NEW.acertada THEN aciertos_consecutivos + 1
            ELSE 0
        END
    WHERE id = NEW.flashcard_id;

    -- Actualizar racha del usuario
    PERFORM actualizar_racha(
        (SELECT user_id FROM flashcards WHERE id = NEW.flashcard_id)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_after_flashcard_review
    AFTER INSERT ON flashcard_reviews
    FOR EACH ROW EXECUTE FUNCTION after_flashcard_review();
