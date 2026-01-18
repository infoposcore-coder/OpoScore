-- =========================================== 
-- OpoScore - TEMARIOS ADICIONALES (Seed)
-- Correos, Guardia Civil, Policía Nacional
-- Generado automáticamente via MCP
-- =========================================== 

-- =========================================== 
-- OPOSICIÓN: CORREOS - Personal Laboral
-- =========================================== 
INSERT INTO oposiciones (id, nombre, slug, descripcion, categoria, activa, metadata)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'Correos - Personal Laboral Fijo',
  'correos-personal-laboral',
  'Oposiciones para Personal Laboral Fijo de Correos. Una de las oposiciones más demandadas con más de 4000 plazas anuales.',
  'Empresas Públicas',
  TRUE,
  '{
    "grupo": "Grupo IV",
    "requisitos": {
      "titulacion": "Graduado en ESO o equivalente",
      "nacionalidad": "Española o UE",
      "edad_minima": 18,
      "carnet_conducir": "B (recomendado)"
    },
    "tipo_examen": {
      "primera_fase": "Test 100 preguntas (90 min)",
      "segunda_fase": "Méritos y valoración"
    },
    "salario_aproximado": "1.200-1.500€/mes",
    "plazas_ultimas_convocatorias": [4055, 3381, 5000]
  }'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Bloques Correos
INSERT INTO bloques (id, oposicion_id, nombre, orden) VALUES
('bc000001-0000-0000-0000-000000000001', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Organización y Normativa', 1),
('bc000002-0000-0000-0000-000000000002', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Productos y Servicios', 2),
('bc000003-0000-0000-0000-000000000003', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Procesos Operativos', 3),
('bc000004-0000-0000-0000-000000000004', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Atención al Cliente y Normativa', 4)
ON CONFLICT DO NOTHING;

-- Temas Correos (12 temas oficiales 2025-2026)
INSERT INTO temas (id, bloque_id, nombre, descripcion, orden, tiempo_estimado_minutos) VALUES
-- Bloque 1: Organización
('tc000001-0000-0000-0000-000000000001', 'bc000001-0000-0000-0000-000000000001', 
 'Correos: Marco Normativo y Naturaleza Jurídica', 
 'Marco normativo postal y naturaleza jurídica. Organismos reguladores nacionales e internacionales. Organizaciones postales internacionales. Organización del Grupo Correos. Correos y su adaptación a los cambios.', 
 1, 90),
('tc000002-0000-0000-0000-000000000001', 'bc000001-0000-0000-0000-000000000001', 
 'Experiencia de Personas y RSC', 
 'Experiencia de personas en Correos. Diversidad, Inclusión e Igualdad. Prevención de riesgos y bienestar. Responsabilidad Social Corporativa (RSC). Objetivos de Desarrollo Sostenible (ODS). Ejes de la sostenibilidad. Emprendimiento e Innovación.', 
 2, 75),

-- Bloque 2: Productos y Servicios
('tc000003-0000-0000-0000-000000000001', 'bc000002-0000-0000-0000-000000000002', 
 'Productos: Comunicación y Paquetería', 
 'Productos y servicios de Comunicación. Paquetería de Correos y de Correos Express. Servicios e-commerce y Citypaq.', 
 3, 90),
('tc000004-0000-0000-0000-000000000001', 'bc000002-0000-0000-0000-000000000002', 
 'Servicios en Oficinas', 
 'Productos y servicios en Oficinas. Servicios Financieros. Soluciones Digitales. Filatelia.', 
 4, 75),
('tc000005-0000-0000-0000-000000000001', 'bc000002-0000-0000-0000-000000000002', 
 'Nuevas Líneas de Negocio', 
 'Correos Logística. Correos Frío. Otros negocios complementarios.', 
 5, 60),
('tc000006-0000-0000-0000-000000000001', 'bc000002-0000-0000-0000-000000000002', 
 'Herramientas Corporativas', 
 'Herramientas internas. Funciones y utilidad de cada aplicación.', 
 6, 60),

-- Bloque 3: Procesos Operativos
('tc000007-0000-0000-0000-000000000001', 'bc000003-0000-0000-0000-000000000003', 
 'Procesos Operativos I: Admisión', 
 'Proceso de admisión de envíos. Tipos de admisión. Documentación. Franqueo.', 
 7, 90),
('tc000008-0000-0000-0000-000000000001', 'bc000003-0000-0000-0000-000000000003', 
 'Procesos Operativos II: Tratamiento y Transporte', 
 'Clasificación de envíos. Centros de tratamiento. Red de transporte. Logística.', 
 8, 90),
('tc000009-0000-0000-0000-000000000001', 'bc000003-0000-0000-0000-000000000003', 
 'Procesos Operativos III: Distribución y Entrega', 
 'Proceso de distribución. Tipos de entrega. Avisos. Devoluciones. Incidencias.', 
 9, 90),

-- Bloque 4: Atención y Normativa
('tc000010-0000-0000-0000-000000000001', 'bc000004-0000-0000-0000-000000000004', 
 'Atención al Cliente y Calidad', 
 'El cliente: Atención al cliente y calidad. Protocolos de Ventas. Gestión de reclamaciones.', 
 10, 75),
('tc000011-0000-0000-0000-000000000001', 'bc000004-0000-0000-0000-000000000004', 
 'Internacionalización y Aduanas', 
 'Envíos internacionales. Normativa aduanera. Documentación. Restricciones.', 
 11, 90),
('tc000012-0000-0000-0000-000000000001', 'bc000004-0000-0000-0000-000000000004', 
 'Normas de Cumplimiento', 
 'Protección de datos (RGPD/LOPDGDD). Prevención de Blanqueo de Capitales. Compromiso ético y transparencia. Seguridad de la Información y Ciberseguridad.', 
 12, 90)
ON CONFLICT DO NOTHING;


-- =========================================== 
-- OPOSICIÓN: GUARDIA CIVIL - Escala Cabos y Guardias
-- =========================================== 
INSERT INTO oposiciones (id, nombre, slug, descripcion, categoria, activa, metadata)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  'Guardia Civil - Escala de Cabos y Guardias',
  'guardia-civil-escala-basica',
  'Oposiciones para ingreso en la Escala de Cabos y Guardias de la Guardia Civil. Cuerpo de seguridad del Estado.',
  'Fuerzas y Cuerpos de Seguridad',
  TRUE,
  '{
    "grupo": "C1",
    "requisitos": {
      "titulacion": "Título de Bachiller o equivalente",
      "nacionalidad": "Española",
      "edad": "18-41 años",
      "estatura_minima": "160 cm (mujeres) / 165 cm (hombres)",
      "permiso_armas": "No tener antecedentes penales"
    },
    "tipo_examen": {
      "primera_fase": "Test conocimientos (100 preguntas)",
      "segunda_fase": "Pruebas físicas",
      "tercera_fase": "Entrevista personal",
      "cuarta_fase": "Reconocimiento médico"
    },
    "salario_aproximado": "1.800-2.200€/mes",
    "plazas_ultimas_convocatorias": [2091, 2154, 2500]
  }'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Bloques Guardia Civil
INSERT INTO bloques (id, oposicion_id, nombre, orden) VALUES
('bgc00001-0000-0000-0000-000000000001', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'Ciencias Jurídicas', 1),
('bgc00002-0000-0000-0000-000000000002', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'Ciencias Sociales', 2),
('bgc00003-0000-0000-0000-000000000003', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'Materias Técnico-Científicas', 3),
('bgc00004-0000-0000-0000-000000000004', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'Lengua Extranjera', 4)
ON CONFLICT DO NOTHING;

-- Temas Guardia Civil (25 temas oficiales)
INSERT INTO temas (id, bloque_id, nombre, descripcion, orden, tiempo_estimado_minutos) VALUES
-- Bloque 1: Ciencias Jurídicas (Temas 1-12)
('tgc00001-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Derechos Humanos', 
 'La Declaración Universal de Derechos Humanos. Convenio Europeo de Derechos Humanos. Carta de Derechos Fundamentales de la UE.', 
 1, 90),
('tgc00002-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Igualdad Efectiva de Mujeres y Hombres', 
 'Ley Orgánica 3/2007. Políticas de igualdad. Violencia de género. Medidas de protección.', 
 2, 90),
('tgc00003-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Prevención de Riesgos Laborales', 
 'Ley 31/1995 de Prevención de Riesgos Laborales. Derechos y obligaciones. Servicios de prevención.', 
 3, 75),
('tgc00004-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'La Constitución Española (I)', 
 'Título Preliminar. Derechos y deberes fundamentales. Garantías de los derechos.', 
 4, 120),
('tgc00005-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'La Constitución Española (II)', 
 'La Corona. Las Cortes Generales. El Gobierno y la Administración. Poder Judicial. Organización territorial.', 
 5, 120),
('tgc00006-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'La Unión Europea', 
 'Tratados constitutivos. Instituciones de la UE. Cooperación policial y judicial.', 
 6, 90),
('tgc00007-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Derecho Penal (I)', 
 'Concepto de delito. Grados de ejecución. Autoría y participación. Circunstancias modificativas.', 
 7, 120),
('tgc00008-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Derecho Penal (II)', 
 'Delitos contra las personas. Delitos contra el patrimonio. Delitos contra la seguridad colectiva.', 
 8, 120),
('tgc00009-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Derecho Procesal Penal', 
 'La denuncia. La querella. La detención. Derechos del detenido. Habeas corpus.', 
 9, 90),
('tgc00010-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Derecho Administrativo', 
 'Procedimiento administrativo común. Responsabilidad patrimonial. Régimen sancionador.', 
 10, 90),
('tgc00011-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Protección de Datos', 
 'RGPD y LOPDGDD. Principios. Derechos de los interesados. Autoridades de control.', 
 11, 75),
('tgc00012-0000-0000-0000-000000000001', 'bgc00001-0000-0000-0000-000000000001', 
 'Fuerzas y Cuerpos de Seguridad', 
 'Ley Orgánica 2/1986. Principios de actuación. Funciones. Régimen disciplinario de la Guardia Civil.', 
 12, 90),

-- Bloque 2: Ciencias Sociales (Temas 13-17)
('tgc00013-0000-0000-0000-000000000001', 'bgc00002-0000-0000-0000-000000000002', 
 'Protección Civil', 
 'Fundamentos de protección civil. Sistema Nacional de Protección Civil. Planes de emergencia.', 
 13, 60),
('tgc00014-0000-0000-0000-000000000001', 'bgc00002-0000-0000-0000-000000000002', 
 'Organizaciones Internacionales', 
 'ONU. OTAN. Consejo de Europa. OSCE. Otras organizaciones de seguridad.', 
 14, 75),
('tgc00015-0000-0000-0000-000000000001', 'bgc00002-0000-0000-0000-000000000002', 
 'Deontología Policial', 
 'Ética profesional. Código de conducta. Deontología de la Guardia Civil.', 
 15, 60),
('tgc00016-0000-0000-0000-000000000001', 'bgc00002-0000-0000-0000-000000000002', 
 'Ecología y Medio Ambiente', 
 'Contaminación. Espacios naturales protegidos. Delitos ambientales. SEPRONA.', 
 16, 75),
('tgc00017-0000-0000-0000-000000000001', 'bgc00002-0000-0000-0000-000000000002', 
 'Geografía e Historia de España', 
 'Geografía física y humana. Historia contemporánea. Organización territorial.', 
 17, 90),

-- Bloque 3: Materias Técnico-Científicas (Temas 18-24)
('tgc00018-0000-0000-0000-000000000001', 'bgc00003-0000-0000-0000-000000000003', 
 'Tecnologías de la Información', 
 'Sistemas informáticos. Redes. Internet. Ciberdelincuencia. Evidencias digitales.', 
 18, 90),
('tgc00019-0000-0000-0000-000000000001', 'bgc00003-0000-0000-0000-000000000003', 
 'Topografía', 
 'Mapas y planos. Coordenadas. Orientación. GPS. Cartografía militar.', 
 19, 75),
('tgc00020-0000-0000-0000-000000000001', 'bgc00003-0000-0000-0000-000000000003', 
 'Automoción', 
 'Mecánica del automóvil. Sistemas de seguridad. Normativa de tráfico.', 
 20, 60),
('tgc00021-0000-0000-0000-000000000001', 'bgc00003-0000-0000-0000-000000000003', 
 'Transmisiones', 
 'Comunicaciones. Radiofrecuencia. Sistemas de transmisión. Protocolos.', 
 21, 60),
('tgc00022-0000-0000-0000-000000000001', 'bgc00003-0000-0000-0000-000000000003', 
 'Armamento y Tiro', 
 'Armas reglamentarias. Balística. Normativa de armas y explosivos. Seguridad.', 
 22, 90),
('tgc00023-0000-0000-0000-000000000001', 'bgc00003-0000-0000-0000-000000000003', 
 'Primeros Auxilios', 
 'Valoración del accidentado. RCP. Hemorragias. Fracturas. Protocolo PAS.', 
 23, 75),
('tgc00024-0000-0000-0000-000000000001', 'bgc00003-0000-0000-0000-000000000003', 
 'Ortografía', 
 'Reglas ortográficas. Acentuación. Puntuación. Uso de mayúsculas.', 
 24, 45),

-- Bloque 4: Lengua Extranjera (Tema 25)
('tgc00025-0000-0000-0000-000000000001', 'bgc00004-0000-0000-0000-000000000004', 
 'Lengua Inglesa', 
 'Comprensión lectora. Gramática. Vocabulario policial. Expresiones habituales.', 
 25, 90)
ON CONFLICT DO NOTHING;


-- =========================================== 
-- OPOSICIÓN: POLICÍA NACIONAL - Escala Básica
-- =========================================== 
INSERT INTO oposiciones (id, nombre, slug, descripcion, categoria, activa, metadata)
VALUES (
  'd4e5f6a7-b8c9-0123-defa-456789012345',
  'Policía Nacional - Escala Básica',
  'policia-nacional-escala-basica',
  'Oposiciones para ingreso en la Escala Básica del Cuerpo Nacional de Policía. Categoría de Policía.',
  'Fuerzas y Cuerpos de Seguridad',
  TRUE,
  '{
    "grupo": "C1",
    "requisitos": {
      "titulacion": "Título de Bachiller o equivalente",
      "nacionalidad": "Española",
      "edad": "18-65 años (máx 41 para primera vez)",
      "estatura_minima": "160 cm (mujeres) / 165 cm (hombres)",
      "permiso_armas": "Compromiso de portar armas"
    },
    "tipo_examen": {
      "primera_fase": "Test conocimientos (100 preguntas, 50 min)",
      "segunda_fase": "Pruebas físicas",
      "tercera_fase": "Psicotécnicos",
      "cuarta_fase": "Entrevista personal",
      "quinta_fase": "Reconocimiento médico"
    },
    "salario_aproximado": "1.900-2.300€/mes",
    "plazas_ultimas_convocatorias": [2218, 2880, 3000]
  }'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Bloques Policía Nacional
INSERT INTO bloques (id, oposicion_id, nombre, orden) VALUES
('bpn00001-0000-0000-0000-000000000001', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'Ciencias Jurídicas', 1),
('bpn00002-0000-0000-0000-000000000002', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'Ciencias Sociales', 2),
('bpn00003-0000-0000-0000-000000000003', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'Materias Técnico-Científicas', 3)
ON CONFLICT DO NOTHING;

-- Temas Policía Nacional Escala Básica (46 temas oficiales)
INSERT INTO temas (id, bloque_id, nombre, descripcion, orden, tiempo_estimado_minutos) VALUES
-- Bloque 1: Ciencias Jurídicas (Temas 1-26)
('tpn00001-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'El Derecho: Concepto y Acepciones', 
 'Las normas jurídicas positivas: concepto, estructura, clases y caracteres. Principio de jerarquía normativa. La persona jurídica. Nacionalidad española. Domicilio. Vecindad civil.', 
 1, 90),
('tpn00002-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'La Constitución Española (I)', 
 'Estructura y caracteres. Valores y principios constitucionales. Estado democrático, de derecho, social. Monarquía parlamentaria. Derechos y deberes fundamentales. Defensor del Pueblo.', 
 2, 120),
('tpn00003-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'La Constitución Española (II)', 
 'La Corona. Cortes Generales. Gobierno y Administración. Relaciones Gobierno-Cortes. Poder Judicial. Organización territorial. Tribunal Constitucional. Reforma constitucional.', 
 3, 120),
('tpn00004-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'La Unión Europea', 
 'Referencia histórica. Derecho derivado. Instituciones de la UE. Cooperación policial internacional. TEDH y TJUE.', 
 4, 90),
('tpn00005-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Administración General del Estado', 
 'Organización y funcionamiento. Principios. Órganos superiores y directivos. El Gobierno: composición, organización, funciones.', 
 5, 90),
('tpn00006-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Los Funcionarios Públicos', 
 'Concepto y clases. Adquisición y pérdida de la condición de funcionario. Situaciones administrativas apply.', 
 6, 75),
('tpn00007-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'El Ministerio del Interior', 
 'Estructura orgánica básica. Secretaría de Estado de Seguridad: estructura y funciones.', 
 7, 60),
('tpn00008-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Dirección General de la Policía', 
 'Estructura orgánica de servicios centrales y periféricos. Funciones, escalas, categorías. Sistemas de acceso. Régimen disciplinario.', 
 8, 90),
('tpn00009-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Ley Orgánica de Fuerzas y Cuerpos de Seguridad', 
 'LO 2/1986. Disposiciones generales. Principios básicos de actuación. Derechos de representación colectiva. Policías autonómicas y locales.', 
 9, 90),
('tpn00010-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Prevención de Riesgos Laborales', 
 'Concepto de riesgo laboral. Daños derivados del trabajo. Derechos y obligaciones. Servicios de prevención.', 
 10, 75),
('tpn00011-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Igualdad Efectiva de Mujeres y Hombres', 
 'LO 3/2007. Políticas públicas de igualdad. Tutela contra discriminación. Planes de igualdad.', 
 11, 75),
('tpn00012-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Violencia de Género', 
 'LO 1/2004. Medidas de sensibilización y prevención. Derechos de las víctimas. Tutela institucional.', 
 12, 90),
('tpn00013-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Extranjería', 
 'Régimen general. Residencia. Trabajo. Infracciones y sanciones. Expulsión.', 
 13, 90),
('tpn00014-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Protección Internacional', 
 'Asilo y refugio. Protección subsidiaria. Procedimientos. Menores no acompañados.', 
 14, 75),
('tpn00015-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Seguridad Ciudadana', 
 'LO 4/2015. Documentación e identificación. Actuaciones para el mantenimiento de la seguridad. Régimen sancionador.', 
 15, 90),
('tpn00016-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Seguridad Privada', 
 'Ley 5/2014. Personal de seguridad privada. Servicios y actividades. Control administrativo.', 
 16, 75),
('tpn00017-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Infraestructuras Críticas', 
 'Ley 8/2011. Sistema de protección. Catálogo. Planes de seguridad del operador.', 
 17, 60),
('tpn00018-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Código Penal (I): Parte General', 
 'Concepto de delito. Grados de ejecución. Personas responsables. Circunstancias modificativas. Penas.', 
 18, 120),
('tpn00019-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Código Penal (II): Delitos contra las Personas', 
 'Homicidio y asesinato. Lesiones. Detenciones ilegales. Amenazas y coacciones.', 
 19, 120),
('tpn00020-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Código Penal (III): Delitos contra el Patrimonio', 
 'Hurto. Robo. Extorsión. Estafa. Daños. Receptación.', 
 20, 90),
('tpn00021-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Código Penal (IV): Otros Delitos', 
 'Delitos contra la Administración. Delitos contra el orden público. Tráfico de drogas.', 
 21, 90),
('tpn00022-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Derecho Procesal Penal (I)', 
 'La denuncia. La querella. Policía Judicial. Detención. Derechos del detenido.', 
 22, 90),
('tpn00023-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Derecho Procesal Penal (II)', 
 'Entrada y registro. Detención de correspondencia. Intervención telefónica. Circulación y entrega vigilada.', 
 23, 90),
('tpn00024-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Protección de Datos', 
 'RGPD. LOPDGDD. Principios. Derechos. Tratamiento. Ficheros policiales.', 
 24, 90),
('tpn00025-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Tráfico, Circulación y Seguridad Vial', 
 'Permiso de conducción. Infracciones y sanciones. Inmovilización y retirada de vehículos.', 
 25, 90),
('tpn00026-0000-0000-0000-000000000001', 'bpn00001-0000-0000-0000-000000000001', 
 'Armas y Explosivos', 
 'Clasificación de armas. Licencias y permisos. Depósito y custodia. Explosivos.', 
 26, 75),

-- Bloque 2: Ciencias Sociales (Temas 27-38)
('tpn00027-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Derechos Humanos', 
 'Declaración Universal. Convenio Europeo. Carta de Derechos Fundamentales de la UE.', 
 27, 75),
('tpn00028-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Globalización y Sociedad', 
 'Concepto de globalización. Efectos sociales. Movimientos migratorios. Multiculturalidad.', 
 28, 60),
('tpn00029-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Ecología y Desarrollo Sostenible', 
 'Cambio climático. Contaminación. Desarrollo sostenible. Delitos ambientales.', 
 29, 60),
('tpn00030-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Inmigración', 
 'Migraciones contemporáneas. Causas. Efectos. Integración social.', 
 30, 60),
('tpn00031-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Pluralidad Cultural', 
 'Identidad cultural. Minorías. Políticas de integración. Educación intercultural.', 
 31, 60),
('tpn00032-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Psicología y Comunicación', 
 'Procesos psicológicos básicos. Comunicación interpersonal. Habilidades sociales.', 
 32, 75),
('tpn00033-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Psicología de la Delincuencia', 
 'Factores criminógenos. Prevención. Reinserción social.', 
 33, 75),
('tpn00034-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Atención a las Víctimas', 
 'Estatuto de la víctima. Asistencia y protección. Victimización secundaria.', 
 34, 75),
('tpn00035-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Minoría de Edad', 
 'Legislación de menores. Responsabilidad penal. Medidas de protección.', 
 35, 75),
('tpn00036-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Drogodependencias', 
 'Tipos de drogas. Efectos. Prevención. Marco legal.', 
 36, 75),
('tpn00037-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Deontología Policial', 
 'Ética profesional. Código de conducta. Buenas prácticas policiales.', 
 37, 60),
('tpn00038-0000-0000-0000-000000000001', 'bpn00002-0000-0000-0000-000000000002', 
 'Habilidades del Mando', 
 'Liderazgo. Trabajo en equipo. Resolución de conflictos. Toma de decisiones.', 
 38, 60),

-- Bloque 3: Materias Técnico-Científicas (Temas 39-46)
('tpn00039-0000-0000-0000-000000000001', 'bpn00003-0000-0000-0000-000000000003', 
 'Tecnologías de la Información', 
 'Hardware y software. Redes. Internet. Ciberseguridad. Delitos informáticos.', 
 39, 90),
('tpn00040-0000-0000-0000-000000000001', 'bpn00003-0000-0000-0000-000000000003', 
 'Transmisiones', 
 'Sistemas de comunicación. Frecuencias. Protocolos policiales.', 
 40, 60),
('tpn00041-0000-0000-0000-000000000001', 'bpn00003-0000-0000-0000-000000000003', 
 'Armamento', 
 'Armas reglamentarias. Características técnicas. Mantenimiento. Seguridad.', 
 41, 75),
('tpn00042-0000-0000-0000-000000000001', 'bpn00003-0000-0000-0000-000000000003', 
 'Explosivos', 
 'Tipos de explosivos. Artificios pirotécnicos. Desactivación.', 
 42, 60),
('tpn00043-0000-0000-0000-000000000001', 'bpn00003-0000-0000-0000-000000000003', 
 'Primeros Auxilios', 
 'Valoración del accidentado. RCP. Hemorragias. Fracturas. Quemaduras.', 
 43, 75),
('tpn00044-0000-0000-0000-000000000001', 'bpn00003-0000-0000-0000-000000000003', 
 'Medicina Legal y Forense', 
 'Criminalística. Identificación. Huellas dactilares. Documentoscopia.', 
 44, 90),
('tpn00045-0000-0000-0000-000000000001', 'bpn00003-0000-0000-0000-000000000003', 
 'Topografía', 
 'Mapas y planos. Escalas. Coordenadas. Orientación.', 
 45, 60),
('tpn00046-0000-0000-0000-000000000001', 'bpn00003-0000-0000-0000-000000000003', 
 'Automoción', 
 'Mecánica básica. Sistemas de seguridad vial. Identificación de vehículos.', 
 46, 60)
ON CONFLICT DO NOTHING;


-- =========================================== 
-- RESUMEN DE OPOSICIONES AÑADIDAS
-- =========================================== 
-- 
-- 1. CORREOS - Personal Laboral Fijo
--    - 4 bloques, 12 temas
--    - Plazas: ~4000/año
--    - Dificultad: Media-Baja
--
-- 2. GUARDIA CIVIL - Escala Cabos y Guardias
--    - 4 bloques, 25 temas
--    - Plazas: ~2500/año
--    - Dificultad: Alta
--
-- 3. POLICÍA NACIONAL - Escala Básica
--    - 3 bloques, 46 temas
--    - Plazas: ~3000/año
--    - Dificultad: Alta
--
-- =========================================== 
