-- =============================================
-- MIGRACIÓN: Vistas Materializadas
-- Para acelerar queries de dashboard y analytics
-- =============================================

-- =============================================
-- VISTA: Estadísticas de Usuario (últimos 30 días)
-- Usada en dashboard y cálculo de OpoScore
-- =============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_stats_30d AS
SELECT
  rp.user_id,
  COUNT(*) as total_respuestas,
  COUNT(*) FILTER (WHERE rp.correcta = true) as respuestas_correctas,
  ROUND(
    (COUNT(*) FILTER (WHERE rp.correcta = true)::numeric / NULLIF(COUNT(*), 0) * 100),
    2
  ) as precision_porcentaje,
  COUNT(DISTINCT DATE(rp.created_at)) as dias_activos,
  COUNT(DISTINCT rp.tema_id) as temas_practicados,
  AVG(rp.tiempo_respuesta) as tiempo_promedio_respuesta,
  MAX(rp.created_at) as ultima_actividad
FROM respuestas_preguntas rp
WHERE rp.created_at > NOW() - INTERVAL '30 days'
GROUP BY rp.user_id;

-- Índice único para refresh concurrente
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_user_stats_30d_user
ON mv_user_stats_30d(user_id);

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_mv_user_stats_precision
ON mv_user_stats_30d(precision_porcentaje DESC);

COMMENT ON MATERIALIZED VIEW mv_user_stats_30d IS
'Estadísticas agregadas de usuarios (últimos 30 días). Refrescar cada hora.';

-- =============================================
-- VISTA: Actividad Diaria por Usuario
-- Para gráficos de actividad y rachas
-- =============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_daily_activity AS
SELECT
  user_id,
  DATE(created_at) as fecha,
  COUNT(*) as total_respuestas,
  COUNT(*) FILTER (WHERE correcta = true) as correctas,
  ROUND(
    (COUNT(*) FILTER (WHERE correcta = true)::numeric / NULLIF(COUNT(*), 0) * 100),
    2
  ) as precision_dia,
  COUNT(DISTINCT tema_id) as temas_practicados
FROM respuestas_preguntas
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY user_id, DATE(created_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_activity_pk
ON mv_user_daily_activity(user_id, fecha);

CREATE INDEX IF NOT EXISTS idx_mv_daily_activity_fecha
ON mv_user_daily_activity(fecha DESC);

COMMENT ON MATERIALIZED VIEW mv_user_daily_activity IS
'Actividad diaria por usuario (últimos 90 días). Refrescar cada hora.';

-- =============================================
-- VISTA: Rendimiento por Tema
-- Para identificar puntos débiles
-- =============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_tema_performance AS
SELECT
  rp.user_id,
  rp.tema_id,
  t.nombre as tema_nombre,
  t.bloque_id,
  b.nombre as bloque_nombre,
  COUNT(*) as total_respuestas,
  COUNT(*) FILTER (WHERE rp.correcta = true) as correctas,
  ROUND(
    (COUNT(*) FILTER (WHERE rp.correcta = true)::numeric / NULLIF(COUNT(*), 0) * 100),
    2
  ) as precision_tema,
  MAX(rp.created_at) as ultima_practica,
  -- Clasificación del nivel
  CASE
    WHEN COUNT(*) < 10 THEN 'sin_datos'
    WHEN (COUNT(*) FILTER (WHERE rp.correcta = true)::numeric / COUNT(*)) >= 0.85 THEN 'dominado'
    WHEN (COUNT(*) FILTER (WHERE rp.correcta = true)::numeric / COUNT(*)) >= 0.70 THEN 'avanzado'
    WHEN (COUNT(*) FILTER (WHERE rp.correcta = true)::numeric / COUNT(*)) >= 0.50 THEN 'intermedio'
    ELSE 'necesita_mejora'
  END as nivel_dominio
FROM respuestas_preguntas rp
JOIN temas t ON t.id = rp.tema_id
JOIN bloques b ON b.id = t.bloque_id
WHERE rp.created_at > NOW() - INTERVAL '90 days'
GROUP BY rp.user_id, rp.tema_id, t.nombre, t.bloque_id, b.nombre;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_tema_performance_pk
ON mv_user_tema_performance(user_id, tema_id);

CREATE INDEX IF NOT EXISTS idx_mv_tema_performance_precision
ON mv_user_tema_performance(user_id, precision_tema);

CREATE INDEX IF NOT EXISTS idx_mv_tema_performance_debiles
ON mv_user_tema_performance(user_id, precision_tema)
WHERE nivel_dominio = 'necesita_mejora';

COMMENT ON MATERIALIZED VIEW mv_user_tema_performance IS
'Rendimiento por tema y usuario. Refrescar cada 6 horas.';

-- =============================================
-- VISTA: Leaderboard Global
-- Rankings y comparativas
-- =============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_leaderboard AS
SELECT
  p.id as user_id,
  p.nombre,
  p.avatar_url,
  COALESCE(s.precision_porcentaje, 0) as precision,
  COALESCE(s.total_respuestas, 0) as total_respuestas,
  COALESCE(s.dias_activos, 0) as dias_activos,
  COALESCE(r.racha_actual, 0) as racha_actual,
  COALESCE(r.racha_maxima, 0) as racha_maxima,
  -- Ranking por precisión (mínimo 50 respuestas)
  CASE
    WHEN COALESCE(s.total_respuestas, 0) >= 50
    THEN RANK() OVER (
      ORDER BY COALESCE(s.precision_porcentaje, 0) DESC
    )
    ELSE NULL
  END as rank_precision,
  -- Ranking por constancia
  RANK() OVER (
    ORDER BY COALESCE(r.racha_actual, 0) DESC,
             COALESCE(s.dias_activos, 0) DESC
  ) as rank_constancia
FROM profiles p
LEFT JOIN mv_user_stats_30d s ON s.user_id = p.id
LEFT JOIN rachas r ON r.user_id = p.id
WHERE COALESCE(s.total_respuestas, 0) > 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_leaderboard_user
ON mv_leaderboard(user_id);

CREATE INDEX IF NOT EXISTS idx_mv_leaderboard_precision
ON mv_leaderboard(rank_precision) WHERE rank_precision IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mv_leaderboard_constancia
ON mv_leaderboard(rank_constancia);

COMMENT ON MATERIALIZED VIEW mv_leaderboard IS
'Leaderboard global de usuarios. Refrescar cada hora.';

-- =============================================
-- VISTA: Estadísticas Públicas
-- Para landing page y marketing
-- =============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_public_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '30 days') as usuarios_nuevos_mes,
  (SELECT COUNT(*) FROM profiles) as usuarios_totales,
  (SELECT COUNT(*) FROM preguntas WHERE activa = true) as preguntas_activas,
  (SELECT COUNT(*) FROM tests WHERE completado = true) as tests_completados,
  (SELECT COUNT(*) FROM respuestas_preguntas) as respuestas_totales,
  (SELECT COUNT(DISTINCT user_id) FROM sesiones_estudio WHERE fecha = CURRENT_DATE) as usuarios_activos_hoy,
  (SELECT COUNT(DISTINCT user_id) FROM sesiones_estudio WHERE fecha > CURRENT_DATE - INTERVAL '7 days') as usuarios_activos_semana,
  (SELECT ROUND(AVG(precision_porcentaje), 1) FROM mv_user_stats_30d WHERE total_respuestas >= 100) as precision_media,
  (SELECT COUNT(*) FROM oposiciones WHERE activa = true) as oposiciones_activas,
  NOW() as ultima_actualizacion;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_public_stats_single
ON mv_public_stats((1));

COMMENT ON MATERIALIZED VIEW mv_public_stats IS
'Estadísticas públicas para landing. Refrescar cada hora.';

-- =============================================
-- FUNCIONES PARA REFRESCAR VISTAS
-- =============================================

-- Función para refrescar todas las vistas
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_stats_30d;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_daily_activity;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_tema_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_leaderboard;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_public_stats;
END;
$$ LANGUAGE plpgsql;

-- Función para refrescar vistas críticas (más frecuente)
CREATE OR REPLACE FUNCTION refresh_critical_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_stats_30d;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_public_stats;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PROGRAMAR REFRESH CON PG_CRON (si está disponible)
-- =============================================

-- Nota: Esto requiere la extensión pg_cron habilitada en Supabase
-- Descomentar si pg_cron está disponible:

-- SELECT cron.schedule('refresh-critical-views', '0 * * * *',
--   'SELECT refresh_critical_views()');

-- SELECT cron.schedule('refresh-all-views', '0 */6 * * *',
--   'SELECT refresh_all_materialized_views()');

-- =============================================
-- GRANTS
-- =============================================

-- Permitir a usuarios autenticados leer las vistas
GRANT SELECT ON mv_user_stats_30d TO authenticated;
GRANT SELECT ON mv_user_daily_activity TO authenticated;
GRANT SELECT ON mv_user_tema_performance TO authenticated;
GRANT SELECT ON mv_leaderboard TO authenticated;
GRANT SELECT ON mv_public_stats TO anon, authenticated;

-- =============================================
-- RLS NO APLICA A MATERIALIZED VIEWS
-- Usar funciones de seguridad para acceso
-- =============================================

-- Función segura para obtener stats del usuario actual
CREATE OR REPLACE FUNCTION get_my_stats()
RETURNS TABLE (
  total_respuestas bigint,
  respuestas_correctas bigint,
  precision_porcentaje numeric,
  dias_activos bigint,
  temas_practicados bigint,
  tiempo_promedio_respuesta numeric,
  ultima_actividad timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.total_respuestas,
    s.respuestas_correctas,
    s.precision_porcentaje,
    s.dias_activos,
    s.temas_practicados,
    s.tiempo_promedio_respuesta,
    s.ultima_actividad
  FROM mv_user_stats_30d s
  WHERE s.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función segura para obtener rendimiento por tema
CREATE OR REPLACE FUNCTION get_my_tema_performance()
RETURNS TABLE (
  tema_id uuid,
  tema_nombre text,
  bloque_nombre text,
  total_respuestas bigint,
  correctas bigint,
  precision_tema numeric,
  nivel_dominio text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tema_id,
    t.tema_nombre,
    t.bloque_nombre,
    t.total_respuestas,
    t.correctas,
    t.precision_tema,
    t.nivel_dominio
  FROM mv_user_tema_performance t
  WHERE t.user_id = auth.uid()
  ORDER BY t.precision_tema ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
