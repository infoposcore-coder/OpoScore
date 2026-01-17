-- =============================================
-- MIGRACIÓN: Índices de rendimiento
-- Optimizaciones para queries frecuentes
-- =============================================

-- =============================================
-- ÍNDICES PARA RESPUESTAS_PREGUNTAS
-- Tabla más consultada para estadísticas
-- =============================================

-- Índice para obtener respuestas por usuario ordenadas por fecha
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_respuestas_user_created
ON respuestas_preguntas(user_id, created_at DESC);

-- Índice para calcular precisión por tema
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_respuestas_user_tema
ON respuestas_preguntas(user_id, tema_id, correcta);

-- Índice para respuestas de un test específico
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_respuestas_test
ON respuestas_preguntas(test_id) WHERE test_id IS NOT NULL;

-- Índice parcial para respuestas correctas (métricas)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_respuestas_correctas
ON respuestas_preguntas(user_id, created_at) WHERE correcta = true;

-- =============================================
-- ÍNDICES PARA SESIONES_ESTUDIO
-- Para tracking de tiempo de estudio
-- =============================================

-- Índice para sesiones por usuario y fecha
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sesiones_user_fecha
ON sesiones_estudio(user_id, fecha DESC);

-- Índice para sesiones por tipo
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sesiones_user_tipo
ON sesiones_estudio(user_id, tipo, fecha DESC);

-- Índice para sesiones activas (sin finalizar)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sesiones_activas
ON sesiones_estudio(user_id, inicio DESC) WHERE fin IS NULL;

-- =============================================
-- ÍNDICES PARA PREGUNTAS
-- Optimizar selección de preguntas para tests
-- =============================================

-- Índice para preguntas por tema y dificultad
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preguntas_tema_dificultad
ON preguntas(tema_id, dificultad) WHERE activa = true;

-- Índice para preguntas activas ordenadas aleatoriamente
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preguntas_activas_tema
ON preguntas(tema_id) WHERE activa = true;

-- Índice de texto completo para búsqueda en enunciados
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_preguntas_enunciado_search
ON preguntas USING gin(to_tsvector('spanish', enunciado));

-- =============================================
-- ÍNDICES PARA TESTS
-- Historial de tests del usuario
-- =============================================

-- Índice para tests por usuario ordenados por fecha
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tests_user_created
ON tests(user_id, created_at DESC);

-- Índice para tests completados
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tests_completados
ON tests(user_id, finished_at DESC) WHERE completado = true;

-- Índice para tests en progreso
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tests_en_progreso
ON tests(user_id, created_at DESC) WHERE completado = false;

-- Índice por oposición
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tests_oposicion
ON tests(oposicion_id, created_at DESC);

-- =============================================
-- ÍNDICES PARA MÉTRICAS_DIARIAS
-- Agregados para dashboard
-- =============================================

-- Índice para métricas por usuario y rango de fechas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_metricas_user_fecha
ON metricas_diarias(user_id, fecha DESC);

-- Índice para métricas de los últimos 30 días
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_metricas_recientes
ON metricas_diarias(user_id, fecha DESC)
WHERE fecha > CURRENT_DATE - INTERVAL '30 days';

-- =============================================
-- ÍNDICES PARA PROGRESO_TEMAS
-- Estado de progreso por tema
-- =============================================

-- Índice para progreso por usuario y oposición
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_progreso_user_oposicion
ON progreso_temas(user_id, oposicion_id);

-- Índice para temas con bajo rendimiento
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_progreso_bajo_rendimiento
ON progreso_temas(user_id, precision_actual)
WHERE precision_actual < 0.6;

-- =============================================
-- ÍNDICES PARA FLASHCARDS
-- Sistema Leitner de repetición espaciada
-- =============================================

-- Índice para flashcards pendientes de revisión
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flashcards_revision
ON flashcards(user_id, proxima_revision)
WHERE proxima_revision <= CURRENT_TIMESTAMP;

-- Índice por caja Leitner
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flashcards_caja
ON flashcards(user_id, caja, proxima_revision);

-- =============================================
-- ÍNDICES PARA RACHAS
-- Gamificación
-- =============================================

-- Índice para verificar racha activa
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rachas_user_activa
ON rachas(user_id, ultima_actividad DESC);

-- =============================================
-- ÍNDICES PARA LOGROS
-- Sistema de achievements
-- =============================================

-- Índice para logros no obtenidos
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_logros_pendientes
ON user_logros(user_id, logro_id)
WHERE obtenido_at IS NULL;

-- =============================================
-- ÍNDICES PARA ALERTAS_ABANDONO
-- Sistema anti-abandono
-- =============================================

-- Índice para alertas activas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_alertas_activas
ON alertas_abandono(user_id, created_at DESC)
WHERE resuelta = false;

-- =============================================
-- ÍNDICES PARA SUBSCRIPTIONS
-- Control de planes premium
-- =============================================

-- Índice para suscripciones activas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_activas
ON subscriptions(user_id)
WHERE status = 'active';

-- =============================================
-- ÍNDICES COMPUESTOS PARA QUERIES COMPLEJAS
-- =============================================

-- Para calcular OpoScore (combinación de métricas)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_oposcore_calculation
ON respuestas_preguntas(user_id, created_at DESC, correcta)
INCLUDE (tiempo_respuesta);

-- Para dashboard de actividad semanal
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_actividad_semanal
ON sesiones_estudio(user_id, fecha, duracion_minutos)
WHERE fecha > CURRENT_DATE - INTERVAL '7 days';

-- =============================================
-- ANÁLISIS Y ESTADÍSTICAS
-- =============================================

-- Actualizar estadísticas de las tablas principales
ANALYZE respuestas_preguntas;
ANALYZE sesiones_estudio;
ANALYZE tests;
ANALYZE preguntas;
ANALYZE metricas_diarias;
ANALYZE progreso_temas;
ANALYZE flashcards;

-- =============================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =============================================

COMMENT ON INDEX idx_respuestas_user_created IS 'Optimiza: historial de respuestas del usuario';
COMMENT ON INDEX idx_respuestas_user_tema IS 'Optimiza: precisión por tema';
COMMENT ON INDEX idx_sesiones_user_fecha IS 'Optimiza: historial de sesiones de estudio';
COMMENT ON INDEX idx_preguntas_tema_dificultad IS 'Optimiza: selección de preguntas para tests';
COMMENT ON INDEX idx_tests_completados IS 'Optimiza: historial de tests completados';
COMMENT ON INDEX idx_metricas_user_fecha IS 'Optimiza: dashboard de métricas';
COMMENT ON INDEX idx_flashcards_revision IS 'Optimiza: sistema Leitner de repetición';
COMMENT ON INDEX idx_oposcore_calculation IS 'Optimiza: cálculo del OpoScore';
