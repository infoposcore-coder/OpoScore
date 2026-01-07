-- ===========================================
-- OpoScore - Datos Iniciales (Seed)
-- ===========================================
-- Ejecutar DESPUÉS de 04_rls_policies.sql

-- ===========================================
-- LOGROS INICIALES
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
('Preparado', 'Alcanza un OpoScore de 85', 'rocket', '{"tipo": "oposcore", "minimo": 85}', 100, 'especial')
ON CONFLICT DO NOTHING;

-- ===========================================
-- OPOSICIÓN: AUXILIAR ADMINISTRATIVO AGE
-- ===========================================

INSERT INTO oposiciones (id, nombre, slug, descripcion, categoria, activa, metadata)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Auxiliar Administrativo del Estado',
    'auxiliar-administrativo-estado',
    'Oposiciones para el Cuerpo General Auxiliar de la Administración del Estado (C2). Una de las oposiciones más demandadas con plazas estables y buenas condiciones laborales.',
    'AGE',
    TRUE,
    '{
        "grupo": "C2",
        "requisitos": {
            "titulacion": "Graduado en ESO o equivalente",
            "nacionalidad": "Española o UE",
            "edad_minima": 16
        },
        "tipo_examen": {
            "primera_fase": "Test 60 preguntas + 5 reserva (60 min)",
            "segunda_fase": "Ejercicio práctico ofimática"
        },
        "salario_aproximado": "1.400-1.600€/mes",
        "plazas_ultimas_convocatorias": [3000, 2500, 4000]
    }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- ===========================================
-- BLOQUES TEMÁTICOS
-- ===========================================

INSERT INTO bloques (id, oposicion_id, nombre, orden) VALUES
('b1000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Organización del Estado y Administración Pública', 1),
('b1000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Organización de Oficinas Públicas', 2),
('b1000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Actividad Administrativa y Atención al Ciudadano', 3),
('b1000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ofimática', 4)
ON CONFLICT DO NOTHING;

-- ===========================================
-- TEMAS
-- ===========================================

-- Bloque 1: Organización del Estado
INSERT INTO temas (id, bloque_id, nombre, descripcion, orden, tiempo_estimado_minutos) VALUES
('t1000001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001',
 'La Constitución Española de 1978',
 'Características, estructura y contenido. Derechos y deberes fundamentales. La Corona.',
 1, 90),
('t1000002-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001',
 'Las Cortes Generales',
 'Composición, atribuciones y funcionamiento del Congreso de los Diputados y del Senado.',
 2, 60),
('t1000003-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001',
 'El Gobierno y la Administración',
 'El Gobierno: composición y funciones. La Administración General del Estado.',
 3, 75),
('t1000004-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001',
 'El Poder Judicial',
 'El Poder Judicial. El Consejo General del Poder Judicial. El Tribunal Constitucional.',
 4, 60),
('t1000005-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001',
 'Organización Territorial del Estado',
 'Las Comunidades Autónomas. La Administración Local.',
 5, 75),
('t1000006-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001',
 'La Unión Europea',
 'Instituciones de la Unión Europea. Derecho de la Unión Europea.',
 6, 60)
ON CONFLICT DO NOTHING;

-- Bloque 2: Organización de Oficinas
INSERT INTO temas (id, bloque_id, nombre, descripcion, orden, tiempo_estimado_minutos) VALUES
('t2000001-0000-0000-0000-000000000002', 'b1000002-0000-0000-0000-000000000002',
 'El Personal al Servicio de las AAPP',
 'Clases de personal. Derechos y deberes de los funcionarios. La carrera administrativa.',
 1, 90),
('t2000002-0000-0000-0000-000000000002', 'b1000002-0000-0000-0000-000000000002',
 'Igualdad y Violencia de Género',
 'Políticas de igualdad. Prevención de la violencia de género. Normativa aplicable.',
 2, 60),
('t2000003-0000-0000-0000-000000000002', 'b1000002-0000-0000-0000-000000000002',
 'Transparencia y Buen Gobierno',
 'Ley de Transparencia. Derecho de acceso a la información pública.',
 3, 45)
ON CONFLICT DO NOTHING;

-- Bloque 3: Actividad Administrativa
INSERT INTO temas (id, bloque_id, nombre, descripcion, orden, tiempo_estimado_minutos) VALUES
('t3000001-0000-0000-0000-000000000003', 'b1000003-0000-0000-0000-000000000003',
 'El Procedimiento Administrativo Común',
 'Fases del procedimiento. Recursos administrativos. Silencio administrativo.',
 1, 120),
('t3000002-0000-0000-0000-000000000003', 'b1000003-0000-0000-0000-000000000003',
 'Atención al Ciudadano',
 'Servicios de información y atención. Quejas y sugerencias.',
 2, 45),
('t3000003-0000-0000-0000-000000000003', 'b1000003-0000-0000-0000-000000000003',
 'Administración Electrónica',
 'Sede electrónica. Registro electrónico. Notificaciones electrónicas.',
 3, 60),
('t3000004-0000-0000-0000-000000000003', 'b1000003-0000-0000-0000-000000000003',
 'Protección de Datos',
 'RGPD y LOPDGDD. Principios de protección de datos. Derechos de los ciudadanos.',
 4, 75)
ON CONFLICT DO NOTHING;

-- Bloque 4: Ofimática
INSERT INTO temas (id, bloque_id, nombre, descripcion, orden, tiempo_estimado_minutos) VALUES
('t4000001-0000-0000-0000-000000000004', 'b1000004-0000-0000-0000-000000000004',
 'Microsoft Word',
 'Procesador de textos: funciones principales, formato, tablas, combinación de correspondencia.',
 1, 90),
('t4000002-0000-0000-0000-000000000004', 'b1000004-0000-0000-0000-000000000004',
 'Microsoft Excel',
 'Hoja de cálculo: fórmulas, funciones, gráficos, tablas dinámicas.',
 2, 90),
('t4000003-0000-0000-0000-000000000004', 'b1000004-0000-0000-0000-000000000004',
 'Correo Electrónico y Navegadores',
 'Correo electrónico y agenda electrónica. Navegadores web. Búsqueda de información.',
 3, 45)
ON CONFLICT DO NOTHING;

-- ===========================================
-- PREGUNTAS DE EJEMPLO: CONSTITUCIÓN ESPAÑOLA
-- ===========================================

INSERT INTO preguntas (id, tema_id, enunciado, tipo, dificultad, explicacion, metadata) VALUES
('p1000001-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 '¿En qué fecha fue aprobada la Constitución Española por las Cortes Generales?',
 'multiple', 'facil',
 'La Constitución fue aprobada por las Cortes Generales el 31 de octubre de 1978, ratificada en referéndum el 6 de diciembre de 1978 y sancionada por el Rey el 27 de diciembre de 1978.',
 '{"fuente": "CE art. disposición final"}'::jsonb),

('p1000002-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 '¿Cuántos títulos tiene la Constitución Española?',
 'multiple', 'facil',
 'La Constitución Española se estructura en un Preámbulo, un Título Preliminar y 10 Títulos numerados (del I al X).',
 '{"fuente": "Estructura CE"}'::jsonb),

('p1000003-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 'Según el artículo 1.1 de la Constitución, España se constituye en:',
 'multiple', 'media',
 'Art. 1.1 CE: "España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político."',
 '{"fuente": "CE art. 1.1"}'::jsonb),

('p1000004-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 '¿Cuál es el idioma oficial del Estado según la Constitución?',
 'multiple', 'facil',
 'Art. 3.1 CE: "El castellano es la lengua española oficial del Estado. Todos los españoles tienen el deber de conocerla y el derecho a usarla."',
 '{"fuente": "CE art. 3.1"}'::jsonb),

('p1000005-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 'La soberanía nacional reside en:',
 'multiple', 'media',
 'Art. 1.2 CE: "La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado."',
 '{"fuente": "CE art. 1.2"}'::jsonb),

('p1000006-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 '¿Cuántos artículos tiene la Constitución Española?',
 'multiple', 'media',
 'La Constitución Española tiene 169 artículos, además de 4 disposiciones adicionales, 9 transitorias, 1 derogatoria y 1 final.',
 '{"fuente": "Estructura CE"}'::jsonb),

('p1000007-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 '¿Quién es el Jefe del Estado según la Constitución Española?',
 'multiple', 'facil',
 'Art. 56.1 CE: "El Rey es el Jefe del Estado, símbolo de su unidad y permanencia..."',
 '{"fuente": "CE art. 56.1"}'::jsonb),

('p1000008-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 'Los valores superiores del ordenamiento jurídico español son:',
 'multiple', 'dificil',
 'Art. 1.1 CE: "...propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político."',
 '{"fuente": "CE art. 1.1"}'::jsonb),

('p1000009-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 'La persona del Rey es:',
 'multiple', 'media',
 'Art. 56.3 CE: "La persona del Rey es inviolable y no está sujeta a responsabilidad..."',
 '{"fuente": "CE art. 56.3"}'::jsonb),

('p1000010-0000-0000-0000-000000000001', 't1000001-0000-0000-0000-000000000001',
 '¿En qué Título de la Constitución se regulan los derechos y deberes fundamentales?',
 'multiple', 'media',
 'El Título I de la Constitución (artículos 10 a 55) regula "De los derechos y deberes fundamentales".',
 '{"fuente": "CE Título I"}'::jsonb)
ON CONFLICT DO NOTHING;

-- ===========================================
-- RESPUESTAS
-- ===========================================

-- Pregunta 1
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000001-0000-0000-0000-000000000001', '6 de diciembre de 1978', FALSE, 1),
('p1000001-0000-0000-0000-000000000001', '31 de octubre de 1978', TRUE, 2),
('p1000001-0000-0000-0000-000000000001', '27 de diciembre de 1978', FALSE, 3),
('p1000001-0000-0000-0000-000000000001', '29 de diciembre de 1978', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 2
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000002-0000-0000-0000-000000000001', '8 títulos', FALSE, 1),
('p1000002-0000-0000-0000-000000000001', '10 títulos más el Título Preliminar', TRUE, 2),
('p1000002-0000-0000-0000-000000000001', '12 títulos', FALSE, 3),
('p1000002-0000-0000-0000-000000000001', '9 títulos', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 3
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000003-0000-0000-0000-000000000001', 'Un Estado federal', FALSE, 1),
('p1000003-0000-0000-0000-000000000001', 'Un Estado social y democrático de Derecho', TRUE, 2),
('p1000003-0000-0000-0000-000000000001', 'Una Monarquía absoluta', FALSE, 3),
('p1000003-0000-0000-0000-000000000001', 'Una República parlamentaria', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 4
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000004-0000-0000-0000-000000000001', 'El español', FALSE, 1),
('p1000004-0000-0000-0000-000000000001', 'El castellano', TRUE, 2),
('p1000004-0000-0000-0000-000000000001', 'El castellano y las lenguas cooficiales', FALSE, 3),
('p1000004-0000-0000-0000-000000000001', 'Todas las lenguas españolas', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 5
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000005-0000-0000-0000-000000000001', 'El Rey', FALSE, 1),
('p1000005-0000-0000-0000-000000000001', 'Las Cortes Generales', FALSE, 2),
('p1000005-0000-0000-0000-000000000001', 'El pueblo español', TRUE, 3),
('p1000005-0000-0000-0000-000000000001', 'El Gobierno', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 6
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000006-0000-0000-0000-000000000001', '155 artículos', FALSE, 1),
('p1000006-0000-0000-0000-000000000001', '169 artículos', TRUE, 2),
('p1000006-0000-0000-0000-000000000001', '175 artículos', FALSE, 3),
('p1000006-0000-0000-0000-000000000001', '180 artículos', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 7
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000007-0000-0000-0000-000000000001', 'El Presidente del Gobierno', FALSE, 1),
('p1000007-0000-0000-0000-000000000001', 'El Rey', TRUE, 2),
('p1000007-0000-0000-0000-000000000001', 'El Presidente del Congreso', FALSE, 3),
('p1000007-0000-0000-0000-000000000001', 'El Presidente del Tribunal Constitucional', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 8
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000008-0000-0000-0000-000000000001', 'Libertad, seguridad, igualdad y solidaridad', FALSE, 1),
('p1000008-0000-0000-0000-000000000001', 'Libertad, justicia, igualdad y pluralismo político', TRUE, 2),
('p1000008-0000-0000-0000-000000000001', 'Libertad, democracia, igualdad y unidad', FALSE, 3),
('p1000008-0000-0000-0000-000000000001', 'Justicia, paz, igualdad y solidaridad', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 9
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000009-0000-0000-0000-000000000001', 'Inviolable pero sujeta a responsabilidad civil', FALSE, 1),
('p1000009-0000-0000-0000-000000000001', 'Inviolable y no está sujeta a responsabilidad', TRUE, 2),
('p1000009-0000-0000-0000-000000000001', 'Sujeta a la misma responsabilidad que cualquier ciudadano', FALSE, 3),
('p1000009-0000-0000-0000-000000000001', 'Inviolable solo en el ejercicio de sus funciones', FALSE, 4)
ON CONFLICT DO NOTHING;

-- Pregunta 10
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p1000010-0000-0000-0000-000000000001', 'Título Preliminar', FALSE, 1),
('p1000010-0000-0000-0000-000000000001', 'Título I', TRUE, 2),
('p1000010-0000-0000-0000-000000000001', 'Título II', FALSE, 3),
('p1000010-0000-0000-0000-000000000001', 'Título III', FALSE, 4)
ON CONFLICT DO NOTHING;

-- ===========================================
-- PREGUNTAS ADICIONALES: PROCEDIMIENTO
-- ===========================================

INSERT INTO preguntas (id, tema_id, enunciado, tipo, dificultad, explicacion, metadata) VALUES
('p3000001-0000-0000-0000-000000000003', 't3000001-0000-0000-0000-000000000003',
 '¿Cuál es el plazo máximo general para resolver un procedimiento administrativo?',
 'multiple', 'media',
 'Art. 21.3 Ley 39/2015: El plazo máximo será de 3 meses, salvo que una norma con rango de ley establezca uno mayor o así venga previsto en la normativa de la UE.',
 '{"fuente": "Ley 39/2015 art. 21.3"}'::jsonb),

('p3000002-0000-0000-0000-000000000003', 't3000001-0000-0000-0000-000000000003',
 'El silencio administrativo positivo significa que:',
 'multiple', 'dificil',
 'El silencio positivo implica la estimación de la solicitud por el transcurso del plazo sin resolución expresa, excepto en los casos legalmente previstos.',
 '{"fuente": "Ley 39/2015 art. 24"}'::jsonb),

('p3000003-0000-0000-0000-000000000003', 't3000001-0000-0000-0000-000000000003',
 '¿Cuál es el plazo para interponer un recurso de alzada?',
 'multiple', 'media',
 'Art. 122.1 Ley 39/2015: El plazo para interponer recurso de alzada será de un mes si el acto es expreso, o de tres meses si no lo es.',
 '{"fuente": "Ley 39/2015 art. 122.1"}'::jsonb)
ON CONFLICT DO NOTHING;

-- Respuestas Procedimiento
INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p3000001-0000-0000-0000-000000000003', '1 mes', FALSE, 1),
('p3000001-0000-0000-0000-000000000003', '3 meses', TRUE, 2),
('p3000001-0000-0000-0000-000000000003', '6 meses', FALSE, 3),
('p3000001-0000-0000-0000-000000000003', '1 año', FALSE, 4)
ON CONFLICT DO NOTHING;

INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p3000002-0000-0000-0000-000000000003', 'La solicitud se entiende desestimada', FALSE, 1),
('p3000002-0000-0000-0000-000000000003', 'La solicitud se entiende estimada', TRUE, 2),
('p3000002-0000-0000-0000-000000000003', 'El procedimiento queda suspendido', FALSE, 3),
('p3000002-0000-0000-0000-000000000003', 'Debe reiniciarse el procedimiento', FALSE, 4)
ON CONFLICT DO NOTHING;

INSERT INTO respuestas (pregunta_id, texto, es_correcta, orden) VALUES
('p3000003-0000-0000-0000-000000000003', '15 días', FALSE, 1),
('p3000003-0000-0000-0000-000000000003', '1 mes (acto expreso) o 3 meses (sin resolución)', TRUE, 2),
('p3000003-0000-0000-0000-000000000003', '2 meses en todos los casos', FALSE, 3),
('p3000003-0000-0000-0000-000000000003', '6 meses', FALSE, 4)
ON CONFLICT DO NOTHING;

-- ===========================================
-- ¡SEED COMPLETADO!
-- ===========================================
-- Total: 
-- - 18 logros
-- - 1 oposición (Auxiliar AGE)
-- - 4 bloques temáticos
-- - 16 temas
-- - 13 preguntas con respuestas
