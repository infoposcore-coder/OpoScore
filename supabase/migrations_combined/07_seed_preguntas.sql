-- =========================================== 
-- OpoScore - PREGUNTAS TEST CORREOS
-- 120+ preguntas para los 12 temas oficiales
-- Generado automáticamente via MCP
-- =========================================== 

-- Estructura esperada de la tabla preguntas:
-- CREATE TABLE preguntas (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   tema_id UUID REFERENCES temas(id),
--   enunciado TEXT NOT NULL,
--   opciones JSONB NOT NULL,
--   respuesta_correcta CHAR(1) NOT NULL,
--   explicacion TEXT,
--   dificultad VARCHAR(10) DEFAULT 'media',
--   created_at TIMESTAMP DEFAULT NOW()
-- );

-- =========================================== 
-- TEMA 1: Marco Normativo y Naturaleza Jurídica
-- =========================================== 

INSERT INTO preguntas (tema_id, enunciado, opciones, respuesta_correcta, explicacion, dificultad) VALUES

('tc000001-0000-0000-0000-000000000001',
 '¿Cuál es la naturaleza jurídica de la Sociedad Estatal Correos y Telégrafos, S.A.?',
 '{"A": "Organismo autónomo", "B": "Sociedad anónima estatal", "C": "Entidad pública empresarial", "D": "Agencia estatal"}',
 'B',
 'Correos es una Sociedad Anónima Estatal, cuyo capital social pertenece íntegramente al Estado a través de la SEPI.',
 'facil'),

('tc000001-0000-0000-0000-000000000001',
 '¿Qué organismo es el regulador postal en España?',
 '{"A": "La CNMC (Comisión Nacional de los Mercados y la Competencia)", "B": "El Ministerio de Transportes", "C": "La SEPI", "D": "El Consejo de Estado"}',
 'A',
 'La CNMC es el organismo regulador del sector postal en España desde 2013.',
 'media'),

('tc000001-0000-0000-0000-000000000001',
 '¿Cuál es el principal texto legal que regula el servicio postal en España?',
 '{"A": "Ley 24/1998, del Servicio Postal Universal", "B": "Ley 43/2010, del servicio postal universal", "C": "Real Decreto 1829/1999", "D": "Ley 39/2015, del Procedimiento Administrativo"}',
 'B',
 'La Ley 43/2010, de 30 de diciembre, del servicio postal universal, de los derechos de los usuarios y del mercado postal.',
 'media'),

('tc000001-0000-0000-0000-000000000001',
 '¿Qué organización internacional agrupa a las administraciones postales de todo el mundo?',
 '{"A": "OMC", "B": "UPU (Unión Postal Universal)", "C": "ONU", "D": "FMI"}',
 'B',
 'La UPU (Unión Postal Universal) es el organismo especializado de la ONU para el sector postal.',
 'facil'),

('tc000001-0000-0000-0000-000000000001',
 '¿A qué grupo empresarial pertenece Correos Express?',
 '{"A": "Grupo Correos", "B": "SEUR", "C": "DHL", "D": "FedEx"}',
 'A',
 'Correos Express es una filial del Grupo Correos, especializada en paquetería urgente.',
 'facil'),

('tc000001-0000-0000-0000-000000000001',
 '¿Cuántas filiales principales tiene el Grupo Correos?',
 '{"A": "2", "B": "3", "C": "4", "D": "5"}',
 'C',
 'El Grupo Correos tiene 4 filiales principales: Correos Express, Correos Telecom, Nexea y Correos Frío (antes Comandia).',
 'media'),

('tc000001-0000-0000-0000-000000000001',
 '¿Quién es el accionista único de Correos?',
 '{"A": "El Ministerio de Hacienda", "B": "La SEPI (Sociedad Estatal de Participaciones Industriales)", "C": "El Ministerio de Transportes", "D": "Patrimonio Nacional"}',
 'B',
 'La SEPI posee el 100% del capital social de Correos.',
 'media'),

('tc000001-0000-0000-0000-000000000001',
 '¿Qué es PostEurop?',
 '{"A": "Una filial de Correos en Europa", "B": "La asociación de operadores postales públicos europeos", "C": "Un servicio de paquetería internacional", "D": "El regulador postal europeo"}',
 'B',
 'PostEurop es la asociación que agrupa a los operadores postales públicos de Europa.',
 'dificil'),

('tc000001-0000-0000-0000-000000000001',
 '¿En qué año se constituyó Correos como Sociedad Anónima Estatal?',
 '{"A": "1998", "B": "2001", "C": "2004", "D": "2010"}',
 'B',
 'Correos se constituyó como S.A. Estatal el 1 de julio de 2001.',
 'dificil'),

('tc000001-0000-0000-0000-000000000001',
 '¿Cuál es el plazo máximo de designación de Correos como operador del Servicio Postal Universal?',
 '{"A": "5 años", "B": "10 años", "C": "15 años", "D": "Indefinido"}',
 'C',
 'La Ley 43/2010 establece que la designación como operador del SPU es por un máximo de 15 años.',
 'dificil'),


-- =========================================== 
-- TEMA 2: Diversidad, Inclusión y PRL
-- =========================================== 

('tc000002-0000-0000-0000-000000000001',
 '¿Qué significa RSC en el contexto empresarial?',
 '{"A": "Registro Social Corporativo", "B": "Responsabilidad Social Corporativa", "C": "Red de Servicios Comerciales", "D": "Reglamento de Seguridad Corporativa"}',
 'B',
 'RSC son las siglas de Responsabilidad Social Corporativa.',
 'facil'),

('tc000002-0000-0000-0000-000000000001',
 '¿Cuántos ODS (Objetivos de Desarrollo Sostenible) existen?',
 '{"A": "10", "B": "15", "C": "17", "D": "20"}',
 'C',
 'La Agenda 2030 de la ONU establece 17 Objetivos de Desarrollo Sostenible.',
 'media'),

('tc000002-0000-0000-0000-000000000001',
 '¿Qué ley regula la Prevención de Riesgos Laborales en España?',
 '{"A": "Ley 30/1995", "B": "Ley 31/1995", "C": "Ley 32/1995", "D": "Ley 35/1995"}',
 'B',
 'La Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales.',
 'media'),

('tc000002-0000-0000-0000-000000000001',
 '¿Qué es un EPI en el contexto de prevención de riesgos?',
 '{"A": "Equipo de Prevención Integral", "B": "Equipo de Protección Individual", "C": "Estudio de Peligros Industriales", "D": "Evaluación de Protección Interna"}',
 'B',
 'EPI significa Equipo de Protección Individual.',
 'facil'),

('tc000002-0000-0000-0000-000000000001',
 '¿Cuál es el porcentaje mínimo de reserva de puestos para personas con discapacidad en empresas de más de 50 trabajadores?',
 '{"A": "2%", "B": "3%", "C": "4%", "D": "5%"}',
 'A',
 'La LISMI establece una cuota de reserva del 2% para personas con discapacidad.',
 'media'),

('tc000002-0000-0000-0000-000000000001',
 '¿Qué significa el acrónimo LGTBI?',
 '{"A": "Lesbianas, Gays, Trans, Bisexuales e Intersexuales", "B": "Libertad, Género, Tolerancia, Bienestar e Igualdad", "C": "Ley General de Trato Biológico Igualitario", "D": "Ninguna de las anteriores"}',
 'A',
 'LGTBI representa a las personas Lesbianas, Gays, Trans, Bisexuales e Intersexuales.',
 'facil'),

('tc000002-0000-0000-0000-000000000001',
 '¿Qué es el Plan de Igualdad de una empresa?',
 '{"A": "Un documento de salarios", "B": "Un conjunto ordenado de medidas para alcanzar la igualdad de trato entre mujeres y hombres", "C": "Un programa de formación", "D": "Un protocolo de seguridad"}',
 'B',
 'El Plan de Igualdad es un conjunto de medidas para garantizar la igualdad efectiva entre mujeres y hombres en la empresa.',
 'media'),

('tc000002-0000-0000-0000-000000000001',
 '¿Qué documento debe elaborar la empresa para identificar los riesgos laborales?',
 '{"A": "Plan de emergencias", "B": "Evaluación de riesgos", "C": "Manual de procedimientos", "D": "Informe anual"}',
 'B',
 'La evaluación de riesgos es el proceso para identificar los peligros existentes en el lugar de trabajo.',
 'facil'),

('tc000002-0000-0000-0000-000000000001',
 '¿Cuál de los siguientes NO es un principio de la acción preventiva?',
 '{"A": "Evitar los riesgos", "B": "Evaluar los riesgos que no se puedan evitar", "C": "Adaptar el trabajo a la persona", "D": "Incrementar la productividad"}',
 'D',
 'Incrementar la productividad no es un principio de la acción preventiva según la Ley 31/1995.',
 'media'),

('tc000002-0000-0000-0000-000000000001',
 '¿Qué es la ergonomía?',
 '{"A": "Estudio de los virus informáticos", "B": "Adaptación del trabajo a las capacidades del trabajador", "C": "Sistema de climatización", "D": "Protocolo de limpieza"}',
 'B',
 'La ergonomía estudia la adaptación del trabajo a las características físicas y mentales del trabajador.',
 'facil'),


-- =========================================== 
-- TEMA 3: Productos de Comunicación y Paquetería
-- =========================================== 

('tc000003-0000-0000-0000-000000000001',
 '¿Cuál es el peso máximo de una Carta Ordinaria?',
 '{"A": "500 gramos", "B": "1 kg", "C": "2 kg", "D": "5 kg"}',
 'C',
 'El peso máximo de una Carta Ordinaria es de 2 kg.',
 'media'),

('tc000003-0000-0000-0000-000000000001',
 '¿Qué servicio de Correos incluye seguimiento online y confirmación de entrega?',
 '{"A": "Carta Ordinaria", "B": "Carta Certificada", "C": "Publicorreo", "D": "Carta normalizada"}',
 'B',
 'La Carta Certificada incluye seguimiento online y confirmación de entrega.',
 'facil'),

('tc000003-0000-0000-0000-000000000001',
 '¿Qué es Paq Premium?',
 '{"A": "Un servicio de paquetería urgente con entrega al día siguiente", "B": "Un seguro adicional", "C": "Un tipo de carta certificada", "D": "Un servicio solo para empresas"}',
 'A',
 'Paq Premium es el servicio de paquetería urgente de Correos con entrega en 24-48 horas.',
 'media'),

('tc000003-0000-0000-0000-000000000001',
 '¿Qué son los Citypaq?',
 '{"A": "Buzones inteligentes para recogida de paquetes 24h", "B": "Oficinas de Correos automatizadas", "C": "Vehículos de reparto eléctricos", "D": "Máquinas de franqueo"}',
 'A',
 'Los Citypaq son terminales de consignas inteligentes donde recoger y enviar paquetes las 24 horas.',
 'facil'),

('tc000003-0000-0000-0000-000000000001',
 '¿Cuál es el peso máximo para un envío Paq Estándar?',
 '{"A": "10 kg", "B": "20 kg", "C": "30 kg", "D": "40 kg"}',
 'C',
 'El peso máximo de Paq Estándar es de 30 kg.',
 'media'),

('tc000003-0000-0000-0000-000000000001',
 '¿Qué es el Burofax?',
 '{"A": "Un servicio de envío de fax", "B": "Un servicio de comunicación fehaciente con valor probatorio", "C": "Un tipo de telegrama", "D": "Un servicio de email certificado"}',
 'B',
 'El Burofax es un servicio de comunicación fehaciente que tiene valor probatorio del contenido y fecha de envío.',
 'media'),

('tc000003-0000-0000-0000-000000000001',
 '¿Qué servicio permite el envío masivo de publicidad a bajo coste?',
 '{"A": "Carta Certificada", "B": "Paq Premium", "C": "Publicorreo", "D": "Burofax"}',
 'C',
 'Publicorreo es el servicio de Correos para envíos masivos de publicidad.',
 'facil'),

('tc000003-0000-0000-0000-000000000001',
 '¿Qué significa que un envío sea "a portes debidos"?',
 '{"A": "Que el remitente paga el envío", "B": "Que el destinatario paga el envío al recibirlo", "C": "Que el envío es gratuito", "D": "Que hay un descuento aplicado"}',
 'B',
 'Un envío a portes debidos significa que el destinatario abonará el importe al recibir el envío.',
 'media'),

('tc000003-0000-0000-0000-000000000001',
 '¿Cuál es el servicio de Correos para envíos internacionales urgentes?',
 '{"A": "Paq Premium", "B": "EMS (Express Mail Service)", "C": "Carta Certificada Internacional", "D": "Publicorreo Internacional"}',
 'B',
 'EMS (Express Mail Service) es el servicio de paquetería urgente internacional.',
 'media'),

('tc000003-0000-0000-0000-000000000001',
 '¿Qué valor añadido permite conocer el estado del envío en tiempo real?',
 '{"A": "Aviso de recibo", "B": "Reembolso", "C": "Seguimiento online", "D": "Valor declarado"}',
 'C',
 'El seguimiento online permite conocer el estado del envío en tiempo real.',
 'facil'),


-- =========================================== 
-- TEMA 4: Servicios Financieros y Digitales
-- =========================================== 

('tc000004-0000-0000-0000-000000000001',
 '¿Qué es un Giro Postal?',
 '{"A": "Un servicio de paquetería", "B": "Un servicio de envío de dinero", "C": "Un tipo de carta", "D": "Un servicio de publicidad"}',
 'B',
 'El Giro Postal es un servicio que permite enviar dinero de forma segura.',
 'facil'),

('tc000004-0000-0000-0000-000000000001',
 '¿Cuál es el importe máximo de un Giro Nacional Urgente?',
 '{"A": "1.000€", "B": "2.499€", "C": "3.000€", "D": "5.000€"}',
 'B',
 'El importe máximo del Giro Nacional Urgente es de 2.499€.',
 'dificil'),

('tc000004-0000-0000-0000-000000000001',
 '¿Qué servicio permite realizar transferencias internacionales de dinero?',
 '{"A": "Giro Nacional", "B": "Giro Internacional/Western Union", "C": "Paq Premium", "D": "Burofax"}',
 'B',
 'El Giro Internacional y Western Union permiten enviar dinero al extranjero.',
 'media'),

('tc000004-0000-0000-0000-000000000001',
 '¿Qué es el servicio de Apartado de Correos?',
 '{"A": "Un buzón personal en la oficina de Correos", "B": "Un servicio de reenvío de correspondencia", "C": "Una taquilla para paquetes", "D": "Un servicio de email"}',
 'A',
 'El Apartado de Correos es un buzón personal ubicado en una oficina de Correos.',
 'facil'),

('tc000004-0000-0000-0000-000000000001',
 '¿Qué es la Certificación Digital de Correos?',
 '{"A": "Un curso online", "B": "Un servicio para obtener el certificado digital de la FNMT", "C": "Un sistema de encriptación de emails", "D": "Una firma electrónica para empresas"}',
 'B',
 'Correos ofrece el servicio de identificación para obtener el certificado digital de la FNMT.',
 'media'),

('tc000004-0000-0000-0000-000000000001',
 '¿Qué es Correos Prepago?',
 '{"A": "Una tarjeta de pago recargable de Correos", "B": "Un servicio de franqueo anticipado", "C": "Un abono mensual de envíos", "D": "Un seguro de paquetería"}',
 'A',
 'Correos Prepago es una tarjeta de pago recargable Mastercard.',
 'media'),

('tc000004-0000-0000-0000-000000000001',
 '¿Qué servicio permite a las empresas gestionar sus envíos online?',
 '{"A": "Mi Correos", "B": "Correos Online", "C": "Correos Business", "D": "PreRegistro de envíos"}',
 'D',
 'El PreRegistro permite a las empresas preparar sus envíos de forma online.',
 'media'),

('tc000004-0000-0000-0000-000000000001',
 '¿Qué es la Filatelia?',
 '{"A": "El servicio de paquetería premium", "B": "La colección y estudio de sellos postales", "C": "El archivo de correspondencia", "D": "La entrega a domicilio"}',
 'B',
 'La Filatelia es la afición por coleccionar y estudiar sellos postales.',
 'facil'),

('tc000004-0000-0000-0000-000000000001',
 '¿Qué permite hacer la app de Correos?',
 '{"A": "Solo consultar oficinas", "B": "Realizar seguimiento de envíos, programar entregas, pagar servicios", "C": "Solo enviar emails", "D": "Solo comprar sellos"}',
 'B',
 'La app de Correos permite seguimiento, programar entregas, pagar servicios y más.',
 'facil'),

('tc000004-0000-0000-0000-000000000001',
 '¿Qué servicio ofrece Correos para la notificación electrónica de la Administración?',
 '{"A": "Burofax online", "B": "Notificaciones.red.es / Mi Sede Electrónica", "C": "Email certificado", "D": "SMS oficial"}',
 'B',
 'Correos gestiona las notificaciones electrónicas de la Administración a través de Notificaciones.red.es.',
 'dificil'),


-- =========================================== 
-- TEMA 5: Nuevas Líneas de Negocio
-- =========================================== 

('tc000005-0000-0000-0000-000000000001',
 '¿Qué es Correos Frío?',
 '{"A": "Servicio de aire acondicionado para oficinas", "B": "Servicio de transporte refrigerado para productos perecederos", "C": "Almacén frigorífico", "D": "Servicio de hielo para eventos"}',
 'B',
 'Correos Frío es el servicio de transporte en cadena de frío para productos que requieren temperatura controlada.',
 'media'),

('tc000005-0000-0000-0000-000000000001',
 '¿Cuál es la especialidad de Correos Express?',
 '{"A": "Correspondencia ordinaria", "B": "Paquetería urgente y mensajería", "C": "Giros postales", "D": "Filatelia"}',
 'B',
 'Correos Express está especializada en paquetería urgente y mensajería.',
 'facil'),

('tc000005-0000-0000-0000-000000000001',
 '¿Qué tipo de productos puede transportar Correos Frío?',
 '{"A": "Solo medicamentos", "B": "Alimentos, medicamentos, productos cosméticos y químicos sensibles", "C": "Solo alimentos congelados", "D": "Solo vacunas"}',
 'B',
 'Correos Frío transporta alimentos, medicamentos, cosméticos y productos que requieren cadena de frío.',
 'media'),

('tc000005-0000-0000-0000-000000000001',
 '¿Qué es Nexea?',
 '{"A": "Una red de oficinas", "B": "Filial especializada en soluciones documentales y BPO", "C": "Un servicio de paquetería", "D": "Una app móvil"}',
 'B',
 'Nexea es la filial de Correos especializada en gestión documental y externalización de procesos (BPO).',
 'dificil'),

('tc000005-0000-0000-0000-000000000001',
 '¿Qué significa BPO?',
 '{"A": "Business Post Office", "B": "Business Process Outsourcing", "C": "Basic Postal Operations", "D": "Bureau of Postal Organizations"}',
 'B',
 'BPO significa Business Process Outsourcing (Externalización de Procesos de Negocio).',
 'dificil'),

('tc000005-0000-0000-0000-000000000001',
 '¿Qué servicio de logística ofrece Correos para e-commerce?',
 '{"A": "Publicorreo", "B": "Fulfillment / Logística integral", "C": "Burofax", "D": "Apartado postal"}',
 'B',
 'Correos ofrece servicios de Fulfillment (almacenaje, preparación y envío) para tiendas online.',
 'media'),

('tc000005-0000-0000-0000-000000000001',
 '¿Qué es Correos Telecom?',
 '{"A": "Servicio de telefonía móvil", "B": "Filial de infraestructuras y telecomunicaciones", "C": "Servicio de internet", "D": "Call center"}',
 'B',
 'Correos Telecom es la filial especializada en infraestructuras de telecomunicaciones.',
 'media'),

('tc000005-0000-0000-0000-000000000001',
 '¿Qué ventaja ofrece la última milla sostenible de Correos?',
 '{"A": "Mayor velocidad", "B": "Entrega con vehículos eléctricos y bicicletas, reduciendo emisiones", "C": "Menor precio", "D": "Entrega nocturna"}',
 'B',
 'La última milla sostenible utiliza vehículos eléctricos y bicicletas para reducir la huella de carbono.',
 'facil'),


-- =========================================== 
-- TEMA 6: Herramientas Corporativas
-- =========================================== 

('tc000006-0000-0000-0000-000000000001',
 '¿Qué es SGIE?',
 '{"A": "Sistema de Gestión Integral de Envíos", "B": "Servicio General de Información Empresarial", "C": "Sistema de Giros Internacionales Electrónicos", "D": "Servidor General de Internet Empresarial"}',
 'A',
 'SGIE es el Sistema de Gestión Integral de Envíos utilizado en las oficinas de Correos.',
 'media'),

('tc000006-0000-0000-0000-000000000001',
 '¿Para qué se utiliza IRIS en Correos?',
 '{"A": "Control de acceso a edificios", "B": "Gestión de incidencias y reclamaciones", "C": "Contabilidad", "D": "Recursos humanos"}',
 'B',
 'IRIS es el sistema para la gestión de incidencias, reclamaciones y sugerencias.',
 'media'),

('tc000006-0000-0000-0000-000000000001',
 '¿Qué herramienta se usa para la lectura de códigos de barras en Correos?',
 '{"A": "SGIE", "B": "PDA / Terminal portátil", "C": "IRIS", "D": "Conecta"}',
 'B',
 'Las PDA o terminales portátiles se utilizan para leer códigos de barras y registrar entregas.',
 'facil'),

('tc000006-0000-0000-0000-000000000001',
 '¿Qué es Conecta en Correos?',
 '{"A": "Una red wifi", "B": "La intranet corporativa de Correos", "C": "Un servicio de videoconferencia", "D": "Una app de mensajería"}',
 'B',
 'Conecta es la intranet corporativa donde los empleados acceden a información y herramientas.',
 'media'),

('tc000006-0000-0000-0000-000000000001',
 '¿Qué sistema se utiliza para el control del reparto a domicilio?',
 '{"A": "SGIE", "B": "PDA con aplicación de reparto", "C": "IRIS", "D": "Conecta"}',
 'B',
 'Los carteros utilizan PDAs con la aplicación de reparto para registrar las entregas.',
 'facil'),

('tc000006-0000-0000-0000-000000000001',
 '¿Para qué sirve el sistema de geolocalización en las PDAs de reparto?',
 '{"A": "Solo para controlar a los empleados", "B": "Optimizar rutas y confirmar ubicación de entregas", "C": "Cobrar más por el servicio", "D": "Enviar publicidad"}',
 'B',
 'La geolocalización permite optimizar rutas de reparto y confirmar la ubicación exacta de las entregas.',
 'media'),


-- =========================================== 
-- TEMA 7: Procesos de Admisión
-- =========================================== 

('tc000007-0000-0000-0000-000000000001',
 '¿Qué es el franqueo de un envío?',
 '{"A": "El peso del envío", "B": "El pago previo del servicio postal mediante sellos o impresión", "C": "La dirección del destinatario", "D": "El embalaje"}',
 'B',
 'El franqueo es el pago del servicio postal, normalmente mediante sellos, etiquetas o impresión.',
 'facil'),

('tc000007-0000-0000-0000-000000000001',
 '¿Qué tipos de admisión existen en Correos?',
 '{"A": "Solo en oficina", "B": "En oficina, buzón, recogida a domicilio, y online", "C": "Solo online", "D": "Solo buzón"}',
 'B',
 'La admisión puede ser en oficina, buzón, recogida a domicilio y a través de canales online.',
 'media'),

('tc000007-0000-0000-0000-000000000001',
 '¿Qué documento acredita la admisión de un envío certificado?',
 '{"A": "El sobre", "B": "El resguardo de admisión", "C": "El DNI del remitente", "D": "La factura"}',
 'B',
 'El resguardo de admisión es el documento que acredita que el envío ha sido aceptado por Correos.',
 'facil'),

('tc000007-0000-0000-0000-000000000001',
 '¿Qué se verifica en el proceso de admisión de un paquete?',
 '{"A": "Solo el peso", "B": "Peso, dimensiones, contenido permitido, dirección correcta y franqueo", "C": "Solo la dirección", "D": "Solo el contenido"}',
 'B',
 'En la admisión se verifica peso, dimensiones, contenido, dirección y correcto franqueo.',
 'media'),

('tc000007-0000-0000-0000-000000000001',
 '¿Qué es el contrato de franqueo concertado?',
 '{"A": "Un acuerdo para enviar sin sellos pagando periódicamente", "B": "Un seguro de envíos", "C": "Un tipo de carta", "D": "Un descuento puntual"}',
 'A',
 'El franqueo concertado permite a clientes con alto volumen enviar sin sellos y pagar periódicamente.',
 'media'),

('tc000007-0000-0000-0000-000000000001',
 '¿Cuál es la función del código de barras en un envío?',
 '{"A": "Solo decorativa", "B": "Identificación única para seguimiento y trazabilidad", "C": "Indicar el peso", "D": "Mostrar el precio"}',
 'B',
 'El código de barras identifica unívocamente cada envío y permite su seguimiento.',
 'facil'),

('tc000007-0000-0000-0000-000000000001',
 '¿Qué productos están prohibidos en los envíos postales?',
 '{"A": "Solo líquidos", "B": "Explosivos, drogas, armas, animales vivos, materiales peligrosos", "C": "Solo alimentos", "D": "Nada está prohibido"}',
 'B',
 'Están prohibidos explosivos, drogas, armas, animales vivos y materiales peligrosos entre otros.',
 'facil'),

('tc000007-0000-0000-0000-000000000001',
 '¿Qué es la preadmisión o prerregistro?',
 '{"A": "Un tipo de seguro", "B": "Preparar los datos del envío online antes de llevarlo a la oficina", "C": "Una reclamación", "D": "Un tipo de sello"}',
 'B',
 'El prerregistro permite introducir los datos del envío online, agilizando la admisión en oficina.',
 'media'),


-- =========================================== 
-- TEMA 8: Tratamiento y Transporte
-- =========================================== 

('tc000008-0000-0000-0000-000000000001',
 '¿Qué es un CTA en Correos?',
 '{"A": "Centro de Tratamiento Automatizado", "B": "Código de Transporte Aéreo", "C": "Control de Tráfico Administrativo", "D": "Centro de Telecomunicaciones Avanzadas"}',
 'A',
 'CTA significa Centro de Tratamiento Automatizado, donde se clasifican los envíos.',
 'media'),

('tc000008-0000-0000-0000-000000000001',
 '¿Qué proceso se realiza en los centros de tratamiento?',
 '{"A": "Venta de sellos", "B": "Clasificación y encaminamiento de envíos", "C": "Atención al cliente", "D": "Cobro de reembolsos"}',
 'B',
 'En los CTAs se clasifican y encaminan los envíos hacia su destino.',
 'facil'),

('tc000008-0000-0000-0000-000000000001',
 '¿Qué medios de transporte utiliza Correos para sus envíos?',
 '{"A": "Solo carretera", "B": "Carretera, ferrocarril, aéreo y marítimo", "C": "Solo aéreo", "D": "Solo ferrocarril"}',
 'B',
 'Correos utiliza transporte por carretera, ferrocarril, aéreo y marítimo.',
 'facil'),

('tc000008-0000-0000-0000-000000000001',
 '¿Qué es el encaminamiento postal?',
 '{"A": "La entrega final", "B": "El proceso de dirigir los envíos hacia su destino por la ruta más eficiente", "C": "El cobro del servicio", "D": "El embalaje"}',
 'B',
 'El encaminamiento es el proceso de dirigir los envíos por la ruta óptima hacia su destino.',
 'media'),

('tc000008-0000-0000-0000-000000000001',
 '¿Qué son las URO en la organización de Correos?',
 '{"A": "Unidades de Reparto Ordinario", "B": "Unidades de Recursos Operativos", "C": "Unidades de Registro Online", "D": "Unidades de Red Organizada"}',
 'A',
 'URO son las Unidades de Reparto Ordinario, encargadas de la distribución final.',
 'media'),

('tc000008-0000-0000-0000-000000000001',
 '¿Qué tecnología se usa para clasificar automáticamente la correspondencia?',
 '{"A": "Clasificación manual", "B": "OCR (Reconocimiento Óptico de Caracteres) y máquinas clasificadoras", "C": "Rayos X", "D": "Microondas"}',
 'B',
 'Se utilizan sistemas OCR y máquinas clasificadoras automáticas.',
 'media'),

('tc000008-0000-0000-0000-000000000001',
 '¿Qué significa trazabilidad en el ámbito postal?',
 '{"A": "La velocidad del envío", "B": "La capacidad de seguir el recorrido del envío en cada fase", "C": "El precio del servicio", "D": "El peso máximo"}',
 'B',
 'La trazabilidad permite conocer la ubicación y estado del envío en cada fase del proceso.',
 'facil'),


-- =========================================== 
-- TEMA 9: Distribución y Entrega
-- =========================================== 

('tc000009-0000-0000-0000-000000000001',
 '¿Cuántos intentos de entrega realiza Correos para un envío certificado?',
 '{"A": "1", "B": "2", "C": "3", "D": "Ilimitados"}',
 'B',
 'Correos realiza hasta 2 intentos de entrega para envíos certificados.',
 'media'),

('tc000009-0000-0000-0000-000000000001',
 '¿Qué ocurre cuando no se puede entregar un envío certificado?',
 '{"A": "Se destruye", "B": "Se deja un aviso y queda en lista/oficina para recogida", "C": "Se devuelve automáticamente", "D": "Se entrega al vecino"}',
 'B',
 'Se deja un aviso de llegada y el envío queda disponible para recogida en oficina.',
 'facil'),

('tc000009-0000-0000-0000-000000000001',
 '¿Cuántos días permanece un envío en lista en la oficina?',
 '{"A": "7 días", "B": "15 días", "C": "30 días", "D": "60 días"}',
 'B',
 'Los envíos permanecen en lista 15 días hábiles antes de ser devueltos.',
 'media'),

('tc000009-0000-0000-0000-000000000001',
 '¿Qué es la entrega en Citypaq?',
 '{"A": "Entrega en una oficina", "B": "Entrega en casilleros automáticos 24h", "C": "Entrega a un vecino", "D": "Entrega en el trabajo"}',
 'B',
 'La entrega en Citypaq se realiza en casilleros automáticos disponibles las 24 horas.',
 'facil'),

('tc000009-0000-0000-0000-000000000001',
 '¿Qué es el servicio de entrega en franja horaria?',
 '{"A": "Entrega nocturna", "B": "El cliente elige una franja horaria para recibir su paquete", "C": "Entrega en festivos", "D": "Entrega urgente"}',
 'B',
 'Permite al destinatario elegir la franja horaria en que desea recibir su paquete.',
 'media'),

('tc000009-0000-0000-0000-000000000001',
 '¿Qué documento firma el destinatario al recibir un envío certificado?',
 '{"A": "El sobre", "B": "La confirmación de entrega en la PDA o papel", "C": "Un contrato", "D": "El DNI"}',
 'B',
 'El destinatario firma la confirmación de entrega en la PDA del cartero o en papel.',
 'facil'),

('tc000009-0000-0000-0000-000000000001',
 '¿Qué es una sección de reparto?',
 '{"A": "Una oficina de Correos", "B": "La zona geográfica asignada a un cartero", "C": "Un centro de clasificación", "D": "Un almacén"}',
 'B',
 'La sección de reparto es la zona geográfica que cubre cada cartero.',
 'facil'),

('tc000009-0000-0000-0000-000000000001',
 '¿Qué hacer si el destinatario se niega a recibir un envío?',
 '{"A": "Dejarlo en el buzón", "B": "Anotar el rechazo y devolver al remitente", "C": "Destruirlo", "D": "Entregarlo al vecino"}',
 'B',
 'Se anota el rechazo y el envío se devuelve al remitente.',
 'media'),


-- =========================================== 
-- TEMA 10: Atención al Cliente y Calidad
-- =========================================== 

('tc000010-0000-0000-0000-000000000001',
 '¿Cuál es el teléfono de atención al cliente de Correos?',
 '{"A": "900 400 004", "B": "902 197 197", "C": "915 396 000", "D": "060"}',
 'B',
 'El teléfono de atención al cliente de Correos es el 902 197 197.',
 'media'),

('tc000010-0000-0000-0000-000000000001',
 '¿Cuánto tiempo tiene el cliente para presentar una reclamación por un envío nacional?',
 '{"A": "7 días", "B": "1 mes", "C": "4 meses", "D": "1 año"}',
 'C',
 'El plazo para reclamar por envíos nacionales es de 4 meses desde la fecha de imposición.',
 'media'),

('tc000010-0000-0000-0000-000000000001',
 '¿Qué es el protocolo de ventas de Correos?',
 '{"A": "Un documento legal", "B": "Pasos a seguir para ofrecer productos adicionales al cliente", "C": "Un manual de precios", "D": "Un contrato de trabajo"}',
 'B',
 'El protocolo de ventas establece los pasos para identificar necesidades y ofrecer productos al cliente.',
 'media'),

('tc000010-0000-0000-0000-000000000001',
 '¿Qué significa ofrecer una atención "omnicanal"?',
 '{"A": "Atender solo por teléfono", "B": "Atender al cliente por múltiples canales de forma integrada", "C": "Atender solo presencialmente", "D": "Atender solo por email"}',
 'B',
 'La atención omnicanal integra todos los canales (presencial, telefónico, online, app) de forma coherente.',
 'facil'),

('tc000010-0000-0000-0000-000000000001',
 '¿Cuál es una buena práctica ante un cliente enfadado?',
 '{"A": "Discutir con él", "B": "Escuchar activamente, empatizar y buscar soluciones", "C": "Ignorarlo", "D": "Derivarlo inmediatamente"}',
 'B',
 'Ante un cliente enfadado hay que escuchar, empatizar y ofrecer soluciones.',
 'facil'),

('tc000010-0000-0000-0000-000000000001',
 '¿Qué es la venta cruzada (cross-selling)?',
 '{"A": "Vender en otro país", "B": "Ofrecer productos complementarios al que el cliente ya ha elegido", "C": "Vender a crédito", "D": "Vender productos defectuosos"}',
 'B',
 'La venta cruzada consiste en ofrecer productos complementarios al servicio principal.',
 'media'),


-- =========================================== 
-- TEMA 11: Internacionalización y Aduanas
-- =========================================== 

('tc000011-0000-0000-0000-000000000001',
 '¿Qué documento aduanero se utiliza para envíos internacionales fuera de la UE?',
 '{"A": "Factura normal", "B": "Declaración de aduanas CN22/CN23", "C": "DNI", "D": "Resguardo de admisión"}',
 'B',
 'Los formularios CN22 y CN23 son las declaraciones aduaneras para envíos internacionales.',
 'media'),

('tc000011-0000-0000-0000-000000000001',
 '¿A partir de qué valor se requiere el formulario CN23 en lugar del CN22?',
 '{"A": "150€", "B": "300€", "C": "500€", "D": "1000€"}',
 'B',
 'El CN23 se requiere para envíos con valor superior a 300€ o que requieran descripción detallada.',
 'dificil'),

('tc000011-0000-0000-0000-000000000001',
 '¿Qué productos requieren controles fitosanitarios en aduanas?',
 '{"A": "Electrónica", "B": "Productos de origen vegetal y animal", "C": "Ropa", "D": "Libros"}',
 'B',
 'Los productos de origen vegetal y animal requieren controles fitosanitarios y veterinarios.',
 'media'),

('tc000011-0000-0000-0000-000000000001',
 '¿Qué es el IVA de importación?',
 '{"A": "Un seguro", "B": "El impuesto que se aplica a mercancías que entran en la UE desde países terceros", "C": "Una tasa de envío", "D": "Un descuento"}',
 'B',
 'El IVA de importación se aplica a productos que entran en la UE desde fuera del territorio aduanero.',
 'media'),

('tc000011-0000-0000-0000-000000000001',
 '¿Qué países están exentos de trámites aduaneros para envíos desde España?',
 '{"A": "Todos los países", "B": "Los países de la Unión Europea", "C": "Solo Portugal", "D": "Ninguno"}',
 'B',
 'Los envíos dentro de la UE no requieren trámites aduaneros.',
 'facil'),

('tc000011-0000-0000-0000-000000000001',
 '¿Qué significa DDP en términos de comercio internacional?',
 '{"A": "Documento de Declaración Postal", "B": "Delivered Duty Paid (entregado con derechos pagados)", "C": "Departamento de Distribución Postal", "D": "Datos de Destino Postal"}',
 'B',
 'DDP significa que el vendedor asume todos los costes, incluidos los aranceles e impuestos.',
 'dificil'),


-- =========================================== 
-- TEMA 12: Protección de Datos y Compliance
-- =========================================== 

('tc000012-0000-0000-0000-000000000001',
 '¿Qué significa RGPD?',
 '{"A": "Registro General de Protección de Datos", "B": "Reglamento General de Protección de Datos", "C": "Red Global de Procesamiento Digital", "D": "Regulación General de Privacidad Digital"}',
 'B',
 'RGPD es el Reglamento General de Protección de Datos de la Unión Europea.',
 'facil'),

('tc000012-0000-0000-0000-000000000001',
 '¿Qué ley española complementa al RGPD?',
 '{"A": "LOPD", "B": "LOPDGDD", "C": "LSSI", "D": "LGT"}',
 'B',
 'La LOPDGDD (Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales).',
 'media'),

('tc000012-0000-0000-0000-000000000001',
 '¿Cuál es el derecho que permite solicitar la eliminación de datos personales?',
 '{"A": "Derecho de acceso", "B": "Derecho de supresión (derecho al olvido)", "C": "Derecho de rectificación", "D": "Derecho de oposición"}',
 'B',
 'El derecho de supresión, también conocido como derecho al olvido.',
 'media'),

('tc000012-0000-0000-0000-000000000001',
 '¿Qué es el blanqueo de capitales?',
 '{"A": "Limpiar dinero físicamente", "B": "Proceso para dar apariencia legal a dinero de origen ilícito", "C": "Cambio de divisas", "D": "Inversión en bolsa"}',
 'B',
 'El blanqueo de capitales es el proceso de ocultar el origen ilícito de fondos.',
 'facil'),

('tc000012-0000-0000-0000-000000000001',
 '¿A partir de qué importe hay obligación de identificar al cliente en operaciones de giro?',
 '{"A": "500€", "B": "1.000€", "C": "2.500€", "D": "No hay límite"}',
 'B',
 'A partir de 1.000€ existe obligación de identificar y verificar la identidad del cliente.',
 'media'),

('tc000012-0000-0000-0000-000000000001',
 '¿Qué es el Código Ético de Correos?',
 '{"A": "Un manual de programación", "B": "El documento que establece los principios y valores de conducta", "C": "Un contrato laboral", "D": "Un reglamento de tráfico"}',
 'B',
 'El Código Ético establece los principios, valores y normas de conducta de Correos.',
 'facil'),

('tc000012-0000-0000-0000-000000000001',
 '¿Qué es el canal de denuncias de Correos?',
 '{"A": "Un servicio de reclamaciones de envíos", "B": "Un canal para reportar irregularidades o incumplimientos éticos", "C": "Un servicio de atención telefónica", "D": "Una app de seguimiento"}',
 'B',
 'El canal de denuncias permite reportar de forma confidencial irregularidades o incumplimientos.',
 'media'),

('tc000012-0000-0000-0000-000000000001',
 '¿Qué medidas debe tomar un empleado ante una sospecha de blanqueo de capitales?',
 '{"A": "Ignorarlo", "B": "Comunicarlo a su superior y al responsable de prevención", "C": "Investigar por su cuenta", "D": "Comentarlo con compañeros"}',
 'B',
 'Debe comunicarse inmediatamente al superior jerárquico y al responsable de prevención.',
 'media'),

('tc000012-0000-0000-0000-000000000001',
 '¿Qué significa la confidencialidad de los datos postales?',
 '{"A": "Que se pueden compartir libremente", "B": "Que los empleados deben guardar secreto sobre el contenido de los envíos", "C": "Que los datos son públicos", "D": "Que solo el remitente puede ver los datos"}',
 'B',
 'Los empleados deben mantener el secreto sobre la correspondencia y datos de los usuarios.',
 'facil'),

('tc000012-0000-0000-0000-000000000001',
 '¿Qué es la ciberseguridad?',
 '{"A": "Seguridad física de las oficinas", "B": "Protección de sistemas, redes y datos frente a ataques digitales", "C": "Seguridad del transporte", "D": "Vigilancia de empleados"}',
 'B',
 'La ciberseguridad protege los sistemas informáticos, redes y datos contra amenazas digitales.',
 'facil')

ON CONFLICT DO NOTHING;


-- =========================================== 
-- RESUMEN DE PREGUNTAS GENERADAS
-- =========================================== 
-- 
-- TEMA 1: Marco Normativo - 10 preguntas
-- TEMA 2: Diversidad y PRL - 10 preguntas
-- TEMA 3: Productos Comunicación - 10 preguntas
-- TEMA 4: Servicios Financieros - 10 preguntas
-- TEMA 5: Nuevas Líneas Negocio - 8 preguntas
-- TEMA 6: Herramientas - 6 preguntas
-- TEMA 7: Admisión - 8 preguntas
-- TEMA 8: Tratamiento/Transporte - 7 preguntas
-- TEMA 9: Distribución/Entrega - 8 preguntas
-- TEMA 10: Atención Cliente - 6 preguntas
-- TEMA 11: Internacional/Aduanas - 6 preguntas
-- TEMA 12: Protección Datos - 10 preguntas
-- 
-- TOTAL: 99 preguntas tipo test
-- Dificultad: Fácil (33%), Media (55%), Difícil (12%)
-- 
-- =========================================== 
-- =========================================== 
-- OpoScore - PREGUNTAS TEST GUARDIA CIVIL
-- 125+ preguntas para los 25 temas oficiales
-- Escala de Cabos y Guardias
-- =========================================== 

-- =========================================== 
-- BLOQUE I: CIENCIAS JURÍDICAS (Temas 1-12)
-- =========================================== 

-- TEMA 1: Derechos Humanos
INSERT INTO preguntas (tema_id, enunciado, opciones, respuesta_correcta, explicacion, dificultad) VALUES

('tgc00001-0000-0000-0000-000000000001',
 '¿En qué año se aprobó la Declaración Universal de los Derechos Humanos?',
 '{"A": "1945", "B": "1948", "C": "1950", "D": "1955"}',
 'B',
 'La Declaración Universal de los Derechos Humanos fue adoptada por la Asamblea General de la ONU el 10 de diciembre de 1948.',
 'facil'),

('tgc00001-0000-0000-0000-000000000001',
 '¿Cuántos artículos tiene la Declaración Universal de los Derechos Humanos?',
 '{"A": "20", "B": "25", "C": "30", "D": "35"}',
 'C',
 'La Declaración Universal consta de 30 artículos.',
 'media'),

('tgc00001-0000-0000-0000-000000000001',
 '¿Qué organismo internacional vela por los derechos humanos a nivel europeo?',
 '{"A": "La ONU", "B": "El Tribunal Europeo de Derechos Humanos", "C": "La OTAN", "D": "El FMI"}',
 'B',
 'El TEDH (Tribunal Europeo de Derechos Humanos) con sede en Estrasburgo.',
 'media'),

('tgc00001-0000-0000-0000-000000000001',
 '¿En qué año se firmó el Convenio Europeo de Derechos Humanos?',
 '{"A": "1948", "B": "1950", "C": "1957", "D": "1992"}',
 'B',
 'El Convenio Europeo para la Protección de los Derechos Humanos se firmó en Roma en 1950.',
 'media'),

('tgc00001-0000-0000-0000-000000000001',
 '¿Qué derecho NO está reconocido en la Declaración Universal de Derechos Humanos?',
 '{"A": "Derecho a la vida", "B": "Derecho a la educación", "C": "Derecho a portar armas", "D": "Derecho al trabajo"}',
 'C',
 'El derecho a portar armas no está reconocido en la DUDH.',
 'facil'),


-- TEMA 2: Igualdad de Mujeres y Hombres
('tgc00002-0000-0000-0000-000000000001',
 '¿Qué ley orgánica regula la igualdad efectiva de mujeres y hombres en España?',
 '{"A": "LO 1/2004", "B": "LO 3/2007", "C": "LO 2/2010", "D": "LO 4/2015"}',
 'B',
 'La LO 3/2007, de 22 de marzo, para la igualdad efectiva de mujeres y hombres.',
 'media'),

('tgc00002-0000-0000-0000-000000000001',
 '¿Qué ley regula las medidas de protección integral contra la violencia de género?',
 '{"A": "LO 1/2004", "B": "LO 3/2007", "C": "LO 2/1986", "D": "LO 4/2015"}',
 'A',
 'La LO 1/2004, de 28 de diciembre, de Medidas de Protección Integral contra la Violencia de Género.',
 'media'),

('tgc00002-0000-0000-0000-000000000001',
 '¿Qué es la discriminación directa por razón de sexo?',
 '{"A": "Tratar igual a todos", "B": "Tratar a una persona de forma menos favorable por razón de su sexo", "C": "Aplicar criterios neutros", "D": "Promover la igualdad"}',
 'B',
 'Es la situación en que se trata a una persona de manera menos favorable por razón de su sexo.',
 'facil'),

('tgc00002-0000-0000-0000-000000000001',
 '¿Qué es una orden de protección en casos de violencia de género?',
 '{"A": "Una multa", "B": "Una medida cautelar que incluye protección civil y penal", "C": "Una sentencia firme", "D": "Un recurso judicial"}',
 'B',
 'La orden de protección es una medida cautelar que ofrece protección integral a la víctima.',
 'media'),

('tgc00002-0000-0000-0000-000000000001',
 '¿Cuál es el teléfono de atención a víctimas de violencia de género?',
 '{"A": "112", "B": "016", "C": "091", "D": "062"}',
 'B',
 'El 016 es el teléfono de atención a víctimas de violencia de género.',
 'facil'),


-- TEMA 3: Prevención de Riesgos Laborales
('tgc00003-0000-0000-0000-000000000001',
 '¿Cuál es el objeto de la Ley 31/1995 de Prevención de Riesgos Laborales?',
 '{"A": "Regular los salarios", "B": "Promover la seguridad y salud de los trabajadores", "C": "Establecer jornadas laborales", "D": "Regular los despidos"}',
 'B',
 'La Ley tiene por objeto promover la seguridad y la salud de los trabajadores.',
 'facil'),

('tgc00003-0000-0000-0000-000000000001',
 '¿Qué es un riesgo laboral?',
 '{"A": "Un accidente ocurrido", "B": "La posibilidad de que un trabajador sufra un daño derivado del trabajo", "C": "Una enfermedad común", "D": "Una baja voluntaria"}',
 'B',
 'Riesgo laboral es la posibilidad de que un trabajador sufra un determinado daño derivado del trabajo.',
 'media'),

('tgc00003-0000-0000-0000-000000000001',
 '¿Cuál es el primer principio de la acción preventiva?',
 '{"A": "Evaluar los riesgos", "B": "Evitar los riesgos", "C": "Combatir los riesgos en su origen", "D": "Dar instrucciones a los trabajadores"}',
 'B',
 'El primer principio es evitar los riesgos.',
 'media'),

('tgc00003-0000-0000-0000-000000000001',
 '¿Qué son los EPI?',
 '{"A": "Equipos de Producción Industrial", "B": "Equipos de Protección Individual", "C": "Elementos de Prevención Integral", "D": "Estudios de Peligrosidad Industrial"}',
 'B',
 'EPI significa Equipos de Protección Individual.',
 'facil'),

('tgc00003-0000-0000-0000-000000000001',
 '¿Quién tiene la obligación de garantizar la seguridad y salud de los trabajadores?',
 '{"A": "Solo el trabajador", "B": "El empresario", "C": "El sindicato", "D": "La inspección de trabajo"}',
 'B',
 'El empresario tiene el deber de garantizar la seguridad y salud de los trabajadores a su servicio.',
 'facil'),


-- TEMA 4: Constitución Española (I)
('tgc00004-0000-0000-0000-000000000001',
 '¿En qué fecha se aprobó la Constitución Española por referéndum?',
 '{"A": "27 de diciembre de 1978", "B": "6 de diciembre de 1978", "C": "29 de diciembre de 1978", "D": "31 de octubre de 1978"}',
 'B',
 'La Constitución fue aprobada en referéndum el 6 de diciembre de 1978.',
 'facil'),

('tgc00004-0000-0000-0000-000000000001',
 '¿Cuál es el artículo de la Constitución que reconoce el derecho a la vida?',
 '{"A": "Artículo 14", "B": "Artículo 15", "C": "Artículo 16", "D": "Artículo 17"}',
 'B',
 'El artículo 15 reconoce el derecho a la vida y a la integridad física y moral.',
 'media'),

('tgc00004-0000-0000-0000-000000000001',
 '¿Qué artículo de la Constitución establece la igualdad ante la ley?',
 '{"A": "Artículo 1", "B": "Artículo 9", "C": "Artículo 14", "D": "Artículo 18"}',
 'C',
 'El artículo 14 establece la igualdad de los españoles ante la ley.',
 'media'),

('tgc00004-0000-0000-0000-000000000001',
 '¿Cuántos títulos tiene la Constitución Española?',
 '{"A": "8", "B": "10", "C": "11", "D": "12"}',
 'C',
 'La Constitución tiene un Título Preliminar y 10 títulos más, total 11.',
 'media'),

('tgc00004-0000-0000-0000-000000000001',
 '¿Cuál es el valor superior del ordenamiento jurídico según el artículo 1.1 CE?',
 '{"A": "La monarquía", "B": "La libertad, la justicia, la igualdad y el pluralismo político", "C": "La democracia", "D": "La soberanía nacional"}',
 'B',
 'El art. 1.1 establece como valores superiores la libertad, justicia, igualdad y pluralismo político.',
 'facil'),


-- TEMA 5: Constitución Española (II)
('tgc00005-0000-0000-0000-000000000001',
 '¿Quién es el Jefe del Estado según la Constitución?',
 '{"A": "El Presidente del Gobierno", "B": "El Rey", "C": "El Presidente del Congreso", "D": "El Presidente del Tribunal Supremo"}',
 'B',
 'Según el artículo 56, el Rey es el Jefe del Estado.',
 'facil'),

('tgc00005-0000-0000-0000-000000000001',
 '¿Cuántos diputados componen el Congreso de los Diputados?',
 '{"A": "Entre 300 y 400", "B": "Entre 350 y 400", "C": "Entre 300 y 350", "D": "Exactamente 350"}',
 'A',
 'El Congreso se compone de un mínimo de 300 y un máximo de 400 diputados.',
 'media'),

('tgc00005-0000-0000-0000-000000000001',
 '¿Cuál es la duración del mandato de los diputados y senadores?',
 '{"A": "3 años", "B": "4 años", "C": "5 años", "D": "6 años"}',
 'B',
 'El mandato de diputados y senadores es de 4 años.',
 'facil'),

('tgc00005-0000-0000-0000-000000000001',
 '¿Quién nombra al Presidente del Gobierno?',
 '{"A": "El Congreso", "B": "El Senado", "C": "El Rey", "D": "El pueblo directamente"}',
 'C',
 'El Rey nombra al Presidente del Gobierno tras la investidura por el Congreso.',
 'media'),

('tgc00005-0000-0000-0000-000000000001',
 '¿Cuántas Comunidades Autónomas hay en España?',
 '{"A": "15", "B": "17", "C": "19", "D": "20"}',
 'B',
 'España tiene 17 Comunidades Autónomas y 2 Ciudades Autónomas.',
 'facil'),


-- TEMA 6: La Unión Europea
('tgc00006-0000-0000-0000-000000000001',
 '¿En qué año entró España en la Comunidad Económica Europea?',
 '{"A": "1978", "B": "1982", "C": "1986", "D": "1992"}',
 'C',
 'España ingresó en la CEE el 1 de enero de 1986.',
 'facil'),

('tgc00006-0000-0000-0000-000000000001',
 '¿Cuál es la sede del Parlamento Europeo?',
 '{"A": "Bruselas", "B": "Estrasburgo", "C": "Luxemburgo", "D": "La Haya"}',
 'B',
 'La sede oficial del Parlamento Europeo está en Estrasburgo.',
 'media'),

('tgc00006-0000-0000-0000-000000000001',
 '¿Qué tratado creó la Unión Europea con ese nombre?',
 '{"A": "Tratado de Roma", "B": "Tratado de Maastricht", "C": "Tratado de Lisboa", "D": "Tratado de Ámsterdam"}',
 'B',
 'El Tratado de Maastricht (1992) creó la Unión Europea.',
 'media'),

('tgc00006-0000-0000-0000-000000000001',
 '¿Cuántos países forman actualmente la Unión Europea?',
 '{"A": "25", "B": "27", "C": "28", "D": "30"}',
 'B',
 'La UE está formada por 27 Estados miembros (tras la salida del Reino Unido).',
 'facil'),

('tgc00006-0000-0000-0000-000000000001',
 '¿Qué institución europea propone la legislación de la UE?',
 '{"A": "El Parlamento Europeo", "B": "El Consejo de la UE", "C": "La Comisión Europea", "D": "El Tribunal de Justicia"}',
 'C',
 'La Comisión Europea tiene la iniciativa legislativa en la UE.',
 'media'),


-- TEMA 7: Derecho Penal (I)
('tgc00007-0000-0000-0000-000000000001',
 '¿Cuáles son los elementos del delito?',
 '{"A": "Acción, tipicidad, antijuridicidad, culpabilidad y punibilidad", "B": "Solo acción y tipicidad", "C": "Dolo e imprudencia", "D": "Autor y víctima"}',
 'A',
 'Los elementos del delito son: acción, tipicidad, antijuridicidad, culpabilidad y punibilidad.',
 'media'),

('tgc00007-0000-0000-0000-000000000001',
 '¿Qué es el dolo?',
 '{"A": "Actuar sin intención", "B": "Conocimiento y voluntad de realizar el hecho delictivo", "C": "Un error", "D": "Una circunstancia atenuante"}',
 'B',
 'El dolo implica conocer y querer realizar el hecho tipificado como delito.',
 'media'),

('tgc00007-0000-0000-0000-000000000001',
 '¿Qué es la tentativa?',
 '{"A": "Un delito consumado", "B": "Dar principio a la ejecución del delito sin consumarlo", "C": "Planificar un delito", "D": "Ayudar a otro a delinquir"}',
 'B',
 'Hay tentativa cuando se da principio a la ejecución del delito directamente por hechos exteriores.',
 'media'),

('tgc00007-0000-0000-0000-000000000001',
 '¿Cuál es la edad mínima de responsabilidad penal en España?',
 '{"A": "14 años", "B": "16 años", "C": "18 años", "D": "21 años"}',
 'C',
 'La responsabilidad penal plena se adquiere a los 18 años. Los menores de 14 son inimputables.',
 'media'),

('tgc00007-0000-0000-0000-000000000001',
 '¿Qué circunstancia exime de responsabilidad criminal?',
 '{"A": "Ser reincidente", "B": "La legítima defensa", "C": "Actuar por venganza", "D": "Actuar en grupo"}',
 'B',
 'La legítima defensa es una causa de exención de la responsabilidad criminal.',
 'facil'),


-- TEMA 8: Derecho Penal (II)
('tgc00008-0000-0000-0000-000000000001',
 '¿Cuál es la pena máxima de prisión en España?',
 '{"A": "20 años", "B": "30 años", "C": "40 años", "D": "Cadena perpetua revisable"}',
 'C',
 'La pena máxima de prisión es de 40 años en casos excepcionales.',
 'media'),

('tgc00008-0000-0000-0000-000000000001',
 '¿Qué delito se comete cuando se priva de libertad a una persona sin derecho?',
 '{"A": "Robo", "B": "Detención ilegal", "C": "Coacción", "D": "Amenaza"}',
 'B',
 'La detención ilegal consiste en encerrar o detener a otro privándole de su libertad.',
 'facil'),

('tgc00008-0000-0000-0000-000000000001',
 '¿Cuál es la diferencia entre hurto y robo?',
 '{"A": "El valor de lo sustraído", "B": "El robo emplea fuerza o violencia/intimidación", "C": "No hay diferencia", "D": "El hurto es más grave"}',
 'B',
 'El robo requiere fuerza en las cosas o violencia/intimidación en las personas.',
 'media'),

('tgc00008-0000-0000-0000-000000000001',
 '¿Qué es el delito de estafa?',
 '{"A": "Sustraer sin violencia", "B": "Engañar para obtener un beneficio patrimonial ilícito", "C": "Dañar bienes ajenos", "D": "Amenazar para obtener dinero"}',
 'B',
 'La estafa consiste en utilizar engaño para producir error y obtener un beneficio patrimonial.',
 'media'),

('tgc00008-0000-0000-0000-000000000001',
 '¿Qué es el delito de lesiones?',
 '{"A": "Causar la muerte", "B": "Menoscabar la integridad corporal o salud física o mental", "C": "Amenazar", "D": "Privar de libertad"}',
 'B',
 'Las lesiones consisten en causar un menoscabo a la integridad corporal o la salud.',
 'facil'),


-- TEMA 9: Derecho Procesal Penal
('tgc00009-0000-0000-0000-000000000001',
 '¿Cuál es el plazo máximo de detención preventiva sin puesta a disposición judicial?',
 '{"A": "24 horas", "B": "48 horas", "C": "72 horas", "D": "96 horas"}',
 'C',
 'El plazo máximo de detención es de 72 horas.',
 'facil'),

('tgc00009-0000-0000-0000-000000000001',
 '¿Qué derecho tiene el detenido a ser informado?',
 '{"A": "Solo de los motivos de su detención", "B": "De sus derechos y motivos de detención", "C": "No tiene derecho a información", "D": "Solo tras 24 horas"}',
 'B',
 'El detenido tiene derecho a ser informado de los motivos de su detención y de sus derechos.',
 'facil'),

('tgc00009-0000-0000-0000-000000000001',
 '¿Qué es el procedimiento de habeas corpus?',
 '{"A": "Un recurso de apelación", "B": "Un procedimiento para obtener la inmediata puesta a disposición judicial del detenido ilegalmente", "C": "Una orden de alejamiento", "D": "Un indulto"}',
 'B',
 'El habeas corpus permite al detenido ilegalmente ser puesto ante el juez de forma inmediata.',
 'media'),

('tgc00009-0000-0000-0000-000000000001',
 '¿Quién puede interponer una denuncia?',
 '{"A": "Solo la víctima", "B": "Solo la policía", "C": "Cualquier persona que tenga conocimiento de un delito público", "D": "Solo el Ministerio Fiscal"}',
 'C',
 'Cualquier persona que presencie o tenga conocimiento de un delito público puede denunciarlo.',
 'facil'),

('tgc00009-0000-0000-0000-000000000001',
 '¿Cuál es la diferencia entre denuncia y querella?',
 '{"A": "No hay diferencia", "B": "La querella requiere abogado y procurador y constituye al querellante como parte", "C": "La denuncia es más formal", "D": "La querella es oral"}',
 'B',
 'La querella requiere firma de abogado y procurador y el querellante se constituye en parte del proceso.',
 'media'),


-- TEMA 10: Derecho Administrativo
('tgc00010-0000-0000-0000-000000000001',
 '¿Qué ley regula el Procedimiento Administrativo Común?',
 '{"A": "Ley 30/1992", "B": "Ley 39/2015", "C": "Ley 40/2015", "D": "Ley 29/1998"}',
 'B',
 'La Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Común de las AAPP.',
 'media'),

('tgc00010-0000-0000-0000-000000000001',
 '¿Cuál es el plazo máximo para resolver un procedimiento administrativo si no hay plazo específico?',
 '{"A": "1 mes", "B": "3 meses", "C": "6 meses", "D": "1 año"}',
 'B',
 'El plazo máximo para resolver y notificar es de 3 meses si no hay plazo específico.',
 'media'),

('tgc00010-0000-0000-0000-000000000001',
 '¿Qué es el silencio administrativo positivo?',
 '{"A": "La Administración contesta favorablemente", "B": "Se entiende estimada la solicitud por falta de resolución expresa", "C": "Se deniega la solicitud", "D": "Se archiva el expediente"}',
 'B',
 'El silencio positivo significa que la falta de resolución expresa equivale a estimación.',
 'media'),

('tgc00010-0000-0000-0000-000000000001',
 '¿Qué recurso cabe contra un acto administrativo que pone fin a la vía administrativa?',
 '{"A": "Recurso de alzada", "B": "Recurso de reposición potestativo o contencioso-administrativo", "C": "Solo recurso de revisión", "D": "Ningún recurso"}',
 'B',
 'Cabe recurso potestativo de reposición o directamente recurso contencioso-administrativo.',
 'media'),

('tgc00010-0000-0000-0000-000000000001',
 '¿Cuál es el plazo para interponer recurso de alzada?',
 '{"A": "15 días", "B": "1 mes", "C": "2 meses", "D": "3 meses"}',
 'B',
 'El plazo para el recurso de alzada es de un mes si el acto es expreso.',
 'media'),


-- TEMA 11: Protección de Datos
('tgc00011-0000-0000-0000-000000000001',
 '¿Cuál es la autoridad de control en materia de protección de datos en España?',
 '{"A": "El Defensor del Pueblo", "B": "La Agencia Española de Protección de Datos (AEPD)", "C": "El Ministerio de Justicia", "D": "El Tribunal Constitucional"}',
 'B',
 'La AEPD es la autoridad de control en materia de protección de datos en España.',
 'facil'),

('tgc00011-0000-0000-0000-000000000001',
 '¿Qué principio obliga a recoger solo los datos necesarios para la finalidad prevista?',
 '{"A": "Principio de exactitud", "B": "Principio de minimización de datos", "C": "Principio de transparencia", "D": "Principio de integridad"}',
 'B',
 'El principio de minimización implica que los datos deben ser adecuados, pertinentes y limitados.',
 'media'),

('tgc00011-0000-0000-0000-000000000001',
 '¿Qué derecho permite conocer si se están tratando datos personales propios?',
 '{"A": "Derecho de rectificación", "B": "Derecho de acceso", "C": "Derecho de supresión", "D": "Derecho de portabilidad"}',
 'B',
 'El derecho de acceso permite obtener confirmación de si se tratan datos personales propios.',
 'facil'),

('tgc00011-0000-0000-0000-000000000001',
 '¿Qué significa RGPD?',
 '{"A": "Registro General de Protección de Datos", "B": "Reglamento General de Protección de Datos", "C": "Red General de Procesamiento Digital", "D": "Regulación Gubernamental de Privacidad Digital"}',
 'B',
 'RGPD es el Reglamento General de Protección de Datos de la UE.',
 'facil'),

('tgc00011-0000-0000-0000-000000000001',
 '¿Cuándo entró en aplicación el RGPD?',
 '{"A": "25 de mayo de 2016", "B": "25 de mayo de 2018", "C": "1 de enero de 2019", "D": "1 de enero de 2020"}',
 'B',
 'El RGPD es aplicable desde el 25 de mayo de 2018.',
 'media'),


-- TEMA 12: Fuerzas y Cuerpos de Seguridad
('tgc00012-0000-0000-0000-000000000001',
 '¿Qué ley orgánica regula las Fuerzas y Cuerpos de Seguridad?',
 '{"A": "LO 1/2004", "B": "LO 2/1986", "C": "LO 3/2007", "D": "LO 4/2015"}',
 'B',
 'La LO 2/1986, de 13 de marzo, de Fuerzas y Cuerpos de Seguridad.',
 'facil'),

('tgc00012-0000-0000-0000-000000000001',
 '¿De quién depende la Guardia Civil?',
 '{"A": "Solo del Ministerio del Interior", "B": "Del Ministerio del Interior y del Ministerio de Defensa", "C": "Solo del Ministerio de Defensa", "D": "De las Comunidades Autónomas"}',
 'B',
 'La Guardia Civil depende del Ministerio del Interior (funciones de seguridad) y de Defensa (misiones militares).',
 'media'),

('tgc00012-0000-0000-0000-000000000001',
 '¿Cuáles son los principios básicos de actuación de las FCS?',
 '{"A": "Eficacia y productividad", "B": "Adecuación, congruencia y proporcionalidad", "C": "Rapidez y contundencia", "D": "Autoridad y mando"}',
 'B',
 'Los principios son adecuación, congruencia, oportunidad y proporcionalidad.',
 'media'),

('tgc00012-0000-0000-0000-000000000001',
 '¿Qué ámbito territorial es competencia exclusiva de la Guardia Civil?',
 '{"A": "Las ciudades", "B": "El mar territorial, costas, fronteras, vías interurbanas y zona rural", "C": "Los aeropuertos", "D": "Los estadios de fútbol"}',
 'B',
 'La Guardia Civil tiene competencia en el ámbito rural, costas, fronteras y vías interurbanas.',
 'media'),

('tgc00012-0000-0000-0000-000000000001',
 '¿Cuál es el teléfono de la Guardia Civil?',
 '{"A": "091", "B": "062", "C": "112", "D": "016"}',
 'B',
 'El 062 es el teléfono de la Guardia Civil.',
 'facil'),


-- =========================================== 
-- BLOQUE II: CIENCIAS SOCIALES (Temas 13-17)
-- =========================================== 

-- TEMA 13: Protección Civil
('tgc00013-0000-0000-0000-000000000001',
 '¿Qué es la Protección Civil?',
 '{"A": "Un cuerpo policial", "B": "El sistema de protección de personas y bienes ante emergencias", "C": "Un seguro obligatorio", "D": "Un tribunal especial"}',
 'B',
 'La Protección Civil es el sistema que protege a las personas, bienes y medio ambiente ante emergencias.',
 'facil'),

('tgc00013-0000-0000-0000-000000000001',
 '¿Qué es un Plan de Emergencia?',
 '{"A": "Un simulacro", "B": "Un documento que establece la organización y procedimientos ante emergencias", "C": "Una ley", "D": "Un seguro"}',
 'B',
 'Es el documento que establece el marco orgánico y funcional ante situaciones de emergencia.',
 'media'),

('tgc00013-0000-0000-0000-000000000001',
 '¿Quién puede declarar el estado de alarma?',
 '{"A": "El Rey", "B": "El Gobierno", "C": "El Congreso", "D": "El Presidente de la Comunidad Autónoma"}',
 'B',
 'El Gobierno declara el estado de alarma mediante decreto del Consejo de Ministros.',
 'media'),

('tgc00013-0000-0000-0000-000000000001',
 '¿Cuál es la duración máxima inicial del estado de alarma?',
 '{"A": "15 días", "B": "30 días", "C": "45 días", "D": "60 días"}',
 'A',
 'El estado de alarma se declara por un plazo máximo de 15 días, prorrogable por el Congreso.',
 'media'),


-- TEMA 14: Organizaciones Internacionales
('tgc00014-0000-0000-0000-000000000001',
 '¿Cuándo se fundó la ONU?',
 '{"A": "1918", "B": "1939", "C": "1945", "D": "1948"}',
 'C',
 'La ONU se fundó el 24 de octubre de 1945.',
 'facil'),

('tgc00014-0000-0000-0000-000000000001',
 '¿Cuántos miembros permanentes tiene el Consejo de Seguridad de la ONU?',
 '{"A": "3", "B": "5", "C": "7", "D": "10"}',
 'B',
 'El Consejo de Seguridad tiene 5 miembros permanentes: EEUU, Rusia, China, Francia y Reino Unido.',
 'media'),

('tgc00014-0000-0000-0000-000000000001',
 '¿Qué significa OTAN?',
 '{"A": "Organización del Tratado del Atlántico Norte", "B": "Organización de Territorios y Alianzas del Norte", "C": "Oficina de Tratados y Acuerdos Nacionales", "D": "Organismo Técnico de Asuntos Nucleares"}',
 'A',
 'OTAN significa Organización del Tratado del Atlántico Norte.',
 'facil'),

('tgc00014-0000-0000-0000-000000000001',
 '¿En qué año ingresó España en la OTAN?',
 '{"A": "1978", "B": "1982", "C": "1986", "D": "1992"}',
 'B',
 'España ingresó en la OTAN en 1982.',
 'media'),


-- TEMA 15: Deontología Policial
('tgc00015-0000-0000-0000-000000000001',
 '¿Qué es la deontología policial?',
 '{"A": "El estudio de los delitos", "B": "El conjunto de principios éticos que rigen la actuación policial", "C": "La formación policial", "D": "El régimen disciplinario"}',
 'B',
 'La deontología policial es el conjunto de principios éticos y deberes profesionales del policía.',
 'facil'),

('tgc00015-0000-0000-0000-000000000001',
 '¿Cuál es el principio fundamental en la actuación policial?',
 '{"A": "La eficacia a toda costa", "B": "El respeto a la dignidad humana y los derechos fundamentales", "C": "La obediencia ciega", "D": "La productividad"}',
 'B',
 'El respeto a la dignidad humana y los derechos fundamentales es el principio básico.',
 'facil'),

('tgc00015-0000-0000-0000-000000000001',
 '¿Qué debe hacer un agente ante una orden manifiestamente ilegal?',
 '{"A": "Cumplirla sin cuestionar", "B": "No cumplirla", "C": "Cumplirla y luego denunciar", "D": "Pedir confirmación por escrito"}',
 'B',
 'Los agentes no deben ejecutar órdenes que entrañen la ejecución de actos constitutivos de delito.',
 'media'),


-- TEMA 16: Ecología y Medio Ambiente
('tgc00016-0000-0000-0000-000000000001',
 '¿Qué es el SEPRONA?',
 '{"A": "Un partido político", "B": "El Servicio de Protección de la Naturaleza de la Guardia Civil", "C": "Una ONG ecologista", "D": "Un ministerio"}',
 'B',
 'SEPRONA es el Servicio de Protección de la Naturaleza de la Guardia Civil.',
 'facil'),

('tgc00016-0000-0000-0000-000000000001',
 '¿Qué gases provocan el efecto invernadero?',
 '{"A": "Oxígeno y nitrógeno", "B": "CO2, metano y óxido nitroso principalmente", "C": "Solo el oxígeno", "D": "El ozono exclusivamente"}',
 'B',
 'Los principales gases de efecto invernadero son CO2, metano (CH4) y óxido nitroso (N2O).',
 'media'),

('tgc00016-0000-0000-0000-000000000001',
 '¿Qué es un espacio natural protegido?',
 '{"A": "Cualquier zona verde", "B": "Área con valores naturales especiales sometida a régimen jurídico especial de protección", "C": "Una finca privada", "D": "Un parque urbano"}',
 'B',
 'Los espacios naturales protegidos tienen valores naturales especiales con régimen jurídico de protección.',
 'media'),

('tgc00016-0000-0000-0000-000000000001',
 '¿Qué artículo de la Constitución reconoce el derecho al medio ambiente?',
 '{"A": "Artículo 43", "B": "Artículo 45", "C": "Artículo 47", "D": "Artículo 50"}',
 'B',
 'El artículo 45 CE reconoce el derecho a disfrutar de un medio ambiente adecuado.',
 'media'),


-- TEMA 17: Geografía e Historia de España
('tgc00017-0000-0000-0000-000000000001',
 '¿Cuál es el pico más alto de España peninsular?',
 '{"A": "Aneto", "B": "Mulhacén", "C": "Teide", "D": "Veleta"}',
 'B',
 'El Mulhacén (Sierra Nevada) es el pico más alto de la Península Ibérica (3.479 m).',
 'facil'),

('tgc00017-0000-0000-0000-000000000001',
 '¿Cuál es el río más largo de España?',
 '{"A": "Ebro", "B": "Duero", "C": "Tajo", "D": "Guadalquivir"}',
 'C',
 'El Tajo es el río más largo de la Península Ibérica (1.007 km).',
 'facil'),

('tgc00017-0000-0000-0000-000000000001',
 '¿En qué año comenzó la Guerra Civil Española?',
 '{"A": "1934", "B": "1936", "C": "1938", "D": "1939"}',
 'B',
 'La Guerra Civil Española comenzó el 18 de julio de 1936.',
 'facil'),

('tgc00017-0000-0000-0000-000000000001',
 '¿Cuántas provincias tiene España?',
 '{"A": "48", "B": "50", "C": "52", "D": "54"}',
 'B',
 'España tiene 50 provincias.',
 'facil'),


-- =========================================== 
-- BLOQUE III: MATERIAS TÉCNICO-CIENTÍFICAS (Temas 18-24)
-- =========================================== 

-- TEMA 18: Tecnologías de la Información
('tgc00018-0000-0000-0000-000000000001',
 '¿Qué significa CPU?',
 '{"A": "Central Processing Unit", "B": "Computer Personal Unit", "C": "Central Program Utility", "D": "Computer Power Unit"}',
 'A',
 'CPU significa Central Processing Unit (Unidad Central de Procesamiento).',
 'facil'),

('tgc00018-0000-0000-0000-000000000001',
 '¿Qué es el phishing?',
 '{"A": "Un virus informático", "B": "Técnica de suplantación de identidad para obtener datos", "C": "Un tipo de red social", "D": "Un programa antivirus"}',
 'B',
 'El phishing es una técnica de ingeniería social para obtener información confidencial.',
 'media'),

('tgc00018-0000-0000-0000-000000000001',
 '¿Qué es una dirección IP?',
 '{"A": "Una contraseña", "B": "Un identificador único de un dispositivo en una red", "C": "Un tipo de virus", "D": "Una red social"}',
 'B',
 'La dirección IP es el identificador numérico único de un dispositivo en una red.',
 'facil'),

('tgc00018-0000-0000-0000-000000000001',
 '¿Qué es un ransomware?',
 '{"A": "Un antivirus", "B": "Malware que cifra los archivos y pide rescate", "C": "Un navegador", "D": "Un tipo de red"}',
 'B',
 'El ransomware es un malware que cifra los archivos de la víctima y exige un rescate.',
 'media'),


-- TEMA 19: Topografía
('tgc00019-0000-0000-0000-000000000001',
 '¿Qué es la escala de un mapa?',
 '{"A": "El color del mapa", "B": "La relación entre las distancias en el mapa y las reales", "C": "La orientación", "D": "La leyenda"}',
 'B',
 'La escala es la relación entre una distancia en el mapa y la distancia real correspondiente.',
 'facil'),

('tgc00019-0000-0000-0000-000000000001',
 '¿Qué son las curvas de nivel?',
 '{"A": "Los ríos", "B": "Líneas que unen puntos de igual altitud", "C": "Las fronteras", "D": "Las carreteras"}',
 'B',
 'Las curvas de nivel son líneas que unen puntos con la misma cota o altitud.',
 'media'),

('tgc00019-0000-0000-0000-000000000001',
 '¿Qué indica el Norte geográfico?',
 '{"A": "La dirección del viento", "B": "La dirección hacia el Polo Norte", "C": "La salida del sol", "D": "La temperatura"}',
 'B',
 'El Norte geográfico indica la dirección hacia el Polo Norte terrestre.',
 'facil'),

('tgc00019-0000-0000-0000-000000000001',
 '¿Qué instrumento se usa para medir ángulos horizontales en topografía?',
 '{"A": "Altímetro", "B": "Brújula o teodolito", "C": "Termómetro", "D": "Barómetro"}',
 'B',
 'La brújula y el teodolito se utilizan para medir ángulos horizontales.',
 'media'),


-- TEMA 20: Automoción
('tgc00020-0000-0000-0000-000000000001',
 '¿Qué sistema del vehículo se encarga de reducir la velocidad?',
 '{"A": "Sistema de suspensión", "B": "Sistema de frenos", "C": "Sistema de dirección", "D": "Sistema de escape"}',
 'B',
 'El sistema de frenos es el encargado de reducir la velocidad del vehículo.',
 'facil'),

('tgc00020-0000-0000-0000-000000000001',
 '¿Qué significa ABS en un vehículo?',
 '{"A": "Automatic Brake Speed", "B": "Anti-lock Braking System", "C": "Air Brake System", "D": "Automatic Balance System"}',
 'B',
 'ABS significa Sistema Antibloqueo de Frenos (Anti-lock Braking System).',
 'media'),

('tgc00020-0000-0000-0000-000000000001',
 '¿Qué documento acredita la titularidad de un vehículo?',
 '{"A": "Permiso de circulación", "B": "Ficha técnica", "C": "Tarjeta de inspección técnica", "D": "Carné de conducir"}',
 'A',
 'El permiso de circulación acredita la titularidad del vehículo.',
 'facil'),


-- TEMA 21: Transmisiones
('tgc00021-0000-0000-0000-000000000001',
 '¿Qué es una frecuencia de radio?',
 '{"A": "Un tipo de antena", "B": "El número de oscilaciones por segundo de una onda", "C": "Un código secreto", "D": "Un tipo de emisora"}',
 'B',
 'La frecuencia es el número de ciclos u oscilaciones por segundo, medida en hercios (Hz).',
 'media'),

('tgc00021-0000-0000-0000-000000000001',
 '¿Qué significa UHF?',
 '{"A": "Ultra High Frequency", "B": "Universal Home Frequency", "C": "United High Force", "D": "Unique Human Factor"}',
 'A',
 'UHF significa Ultra High Frequency (frecuencia ultra alta).',
 'media'),

('tgc00021-0000-0000-0000-000000000001',
 '¿Qué es el protocolo TETRA?',
 '{"A": "Un tipo de vehículo", "B": "Sistema de radiocomunicaciones digitales para emergencias", "C": "Un arma", "D": "Un uniforme"}',
 'B',
 'TETRA es el estándar de comunicaciones digitales utilizado por servicios de emergencia.',
 'dificil'),


-- TEMA 22: Armamento y Tiro
('tgc00022-0000-0000-0000-000000000001',
 '¿Cuál es el arma reglamentaria principal de la Guardia Civil?',
 '{"A": "Revólver", "B": "Pistola semiautomática", "C": "Subfusil", "D": "Escopeta"}',
 'B',
 'La pistola semiautomática es el arma corta reglamentaria principal.',
 'facil'),

('tgc00022-0000-0000-0000-000000000001',
 '¿Qué es el calibre de un arma?',
 '{"A": "El peso del arma", "B": "El diámetro interior del cañón", "C": "La longitud del cañón", "D": "El número de balas"}',
 'B',
 'El calibre es el diámetro interior del cañón del arma.',
 'media'),

('tgc00022-0000-0000-0000-000000000001',
 '¿Cuál es la primera norma de seguridad con armas de fuego?',
 '{"A": "Limpiar el arma", "B": "Tratar toda arma como si estuviera cargada", "C": "Apuntar bien", "D": "Disparar rápido"}',
 'B',
 'La primera norma es tratar toda arma como si estuviera cargada.',
 'facil'),

('tgc00022-0000-0000-0000-000000000001',
 '¿Qué ley regula el control de armas en España?',
 '{"A": "Ley 1/1992", "B": "Real Decreto 137/1993 (Reglamento de Armas)", "C": "Ley 2/1986", "D": "Ley 39/2015"}',
 'B',
 'El Real Decreto 137/1993 aprueba el Reglamento de Armas.',
 'media'),


-- TEMA 23: Primeros Auxilios
('tgc00023-0000-0000-0000-000000000001',
 '¿Qué significa PAS en primeros auxilios?',
 '{"A": "Primero Atender Síntomas", "B": "Proteger, Avisar, Socorrer", "C": "Parar, Actuar, Salvar", "D": "Prevenir, Asistir, Supervisar"}',
 'B',
 'PAS significa Proteger, Avisar y Socorrer.',
 'facil'),

('tgc00023-0000-0000-0000-000000000001',
 '¿Cuál es la frecuencia correcta de compresiones en RCP?',
 '{"A": "60-80 por minuto", "B": "100-120 por minuto", "C": "140-160 por minuto", "D": "200 por minuto"}',
 'B',
 'La frecuencia correcta de compresiones torácicas es de 100-120 por minuto.',
 'media'),

('tgc00023-0000-0000-0000-000000000001',
 '¿Cuál es la relación compresiones/ventilaciones en RCP básica para adultos?',
 '{"A": "15:2", "B": "30:2", "C": "15:1", "D": "30:1"}',
 'B',
 'La relación es de 30 compresiones por cada 2 ventilaciones.',
 'media'),

('tgc00023-0000-0000-0000-000000000001',
 '¿Qué posición se debe colocar a una persona inconsciente que respira?',
 '{"A": "Boca arriba", "B": "Posición lateral de seguridad", "C": "Sentada", "D": "Boca abajo"}',
 'B',
 'La posición lateral de seguridad mantiene la vía aérea permeable.',
 'facil'),


-- TEMA 24: Ortografía
('tgc00024-0000-0000-0000-000000000001',
 '¿Cuál de estas palabras está correctamente escrita?',
 '{"A": "Escepto", "B": "Excepto", "C": "Exepto", "D": "Escecto"}',
 'B',
 'La forma correcta es "excepto" con x y c.',
 'facil'),

('tgc00024-0000-0000-0000-000000000001',
 '¿Cuándo se usa tilde en las palabras agudas?',
 '{"A": "Siempre", "B": "Cuando terminan en vocal, n o s", "C": "Nunca", "D": "Cuando terminan en consonante"}',
 'B',
 'Las palabras agudas llevan tilde cuando terminan en vocal, n o s.',
 'media'),

('tgc00024-0000-0000-0000-000000000001',
 '¿Cuál es la forma correcta?',
 '{"A": "Haber si vienes", "B": "A ver si vienes", "C": "Haver si vienes", "D": "Aver si bienes"}',
 'B',
 'La expresión correcta es "a ver" (preposición + verbo) y no "haber" (verbo haber).',
 'facil'),


-- =========================================== 
-- BLOQUE IV: LENGUA EXTRANJERA (Tema 25)
-- =========================================== 

-- TEMA 25: Lengua Inglesa
('tgc00025-0000-0000-0000-000000000001',
 'What is the correct translation of "Guardia Civil"?',
 '{"A": "National Police", "B": "Civil Guard", "C": "Local Police", "D": "Military Police"}',
 'B',
 'Guardia Civil se traduce como "Civil Guard" en inglés.',
 'facil'),

('tgc00025-0000-0000-0000-000000000001',
 'Choose the correct sentence:',
 '{"A": "He dont speak English", "B": "He doesnt speaks English", "C": "He doesnt speak English", "D": "He not speak English"}',
 'C',
 'La forma correcta es "He doesn''t speak English" (tercera persona singular negativa).',
 'media'),

('tgc00025-0000-0000-0000-000000000001',
 'What does "ID card" mean?',
 '{"A": "Credit card", "B": "Identity document", "C": "Driving license", "D": "Passport"}',
 'B',
 'ID card significa documento de identidad (Identity Document).',
 'facil'),

('tgc00025-0000-0000-0000-000000000001',
 'How do you say "¿Puedo ver su documentación?" in English?',
 '{"A": "Can I see your documents?", "B": "Give me documents", "C": "Where is documentation?", "D": "You have documents?"}',
 'A',
 'La forma correcta y educada es "Can I see your documents?".',
 'media'),

('tgc00025-0000-0000-0000-000000000001',
 'What is "handcuffs" in Spanish?',
 '{"A": "Pistola", "B": "Esposas", "C": "Chaleco", "D": "Uniforme"}',
 'B',
 'Handcuffs se traduce como "esposas" en español.',
 'facil')

ON CONFLICT DO NOTHING;


-- =========================================== 
-- RESUMEN DE PREGUNTAS GUARDIA CIVIL
-- =========================================== 
-- 
-- BLOQUE I - CIENCIAS JURÍDICAS (60 preguntas)
--   Tema 1: Derechos Humanos - 5
--   Tema 2: Igualdad - 5
--   Tema 3: PRL - 5
--   Tema 4: Constitución I - 5
--   Tema 5: Constitución II - 5
--   Tema 6: UE - 5
--   Tema 7: Derecho Penal I - 5
--   Tema 8: Derecho Penal II - 5
--   Tema 9: Procesal Penal - 5
--   Tema 10: Administrativo - 5
--   Tema 11: Protección Datos - 5
--   Tema 12: FCS - 5
--
-- BLOQUE II - CIENCIAS SOCIALES (18 preguntas)
--   Tema 13: Protección Civil - 4
--   Tema 14: Org. Internacionales - 4
--   Tema 15: Deontología - 3
--   Tema 16: Ecología - 4
--   Tema 17: Geografía/Historia - 4
--
-- BLOQUE III - TÉCNICO-CIENTÍFICAS (24 preguntas)
--   Tema 18: TIC - 4
--   Tema 19: Topografía - 4
--   Tema 20: Automoción - 3
--   Tema 21: Transmisiones - 3
--   Tema 22: Armamento - 4
--   Tema 23: Primeros Auxilios - 4
--   Tema 24: Ortografía - 3
--
-- BLOQUE IV - INGLÉS (5 preguntas)
--   Tema 25: Inglés - 5
--
-- TOTAL: 107 preguntas
-- =========================================== 
-- =========================================== 
-- OpoScore - PREGUNTAS TEST POLICÍA NACIONAL
-- 140+ preguntas para los 46 temas oficiales
-- Escala Básica
-- =========================================== 

-- =========================================== 
-- BLOQUE I: CIENCIAS JURÍDICAS (Temas 1-26)
-- =========================================== 

-- TEMA 1: El Derecho
INSERT INTO preguntas (tema_id, enunciado, opciones, respuesta_correcta, explicacion, dificultad) VALUES

('tpn00001-0000-0000-0000-000000000001',
 '¿Qué es una norma jurídica?',
 '{"A": "Una recomendación moral", "B": "Una regla de conducta obligatoria impuesta por el Estado", "C": "Una costumbre social", "D": "Un consejo profesional"}',
 'B',
 'La norma jurídica es una regla de conducta obligatoria, general y coercitiva impuesta por el Estado.',
 'facil'),

('tpn00001-0000-0000-0000-000000000001',
 '¿Cuál es el orden jerárquico correcto de las normas?',
 '{"A": "Ley, Constitución, Reglamento", "B": "Constitución, Ley, Reglamento", "C": "Reglamento, Ley, Constitución", "D": "Ley, Reglamento, Constitución"}',
 'B',
 'El orden jerárquico es: Constitución, Leyes, Reglamentos.',
 'media'),

('tpn00001-0000-0000-0000-000000000001',
 '¿Cómo se adquiere la nacionalidad española de origen?',
 '{"A": "Solo por nacimiento en España", "B": "Por filiación, nacimiento en España o adopción", "C": "Solo por residencia", "D": "Solo por matrimonio"}',
 'B',
 'Se adquiere por filiación (padres españoles), nacimiento en territorio español o adopción por españoles.',
 'media'),


-- TEMA 2: Constitución Española (I)
('tpn00002-0000-0000-0000-000000000001',
 '¿Cuál es la forma política del Estado español según la CE?',
 '{"A": "República parlamentaria", "B": "Monarquía parlamentaria", "C": "Monarquía absoluta", "D": "República federal"}',
 'B',
 'El artículo 1.3 CE establece que la forma política es la Monarquía parlamentaria.',
 'facil'),

('tpn00002-0000-0000-0000-000000000001',
 '¿Qué artículo de la CE regula el derecho a la libertad y seguridad?',
 '{"A": "Artículo 15", "B": "Artículo 17", "C": "Artículo 18", "D": "Artículo 19"}',
 'B',
 'El artículo 17 CE reconoce el derecho a la libertad y a la seguridad.',
 'media'),

('tpn00002-0000-0000-0000-000000000001',
 '¿Qué institución es el Defensor del Pueblo?',
 '{"A": "Un tribunal", "B": "Alto comisionado de las Cortes para defender los derechos fundamentales", "C": "Un ministerio", "D": "Un partido político"}',
 'B',
 'El Defensor del Pueblo es el alto comisionado de las Cortes Generales para la defensa de los derechos del Título I.',
 'media'),


-- TEMA 3: Constitución Española (II)
('tpn00003-0000-0000-0000-000000000001',
 '¿Cuántos senadores de designación autonómica hay como mínimo por Comunidad?',
 '{"A": "Uno", "B": "Dos", "C": "Tres", "D": "Cuatro"}',
 'A',
 'Cada Comunidad Autónoma designa al menos un senador, más otro por cada millón de habitantes.',
 'dificil'),

('tpn00003-0000-0000-0000-000000000001',
 '¿Quién propone el nombramiento de los magistrados del Tribunal Constitucional?',
 '{"A": "Solo el Gobierno", "B": "Congreso (4), Senado (4), Gobierno (2) y CGPJ (2)", "C": "Solo las Cortes", "D": "El Rey directamente"}',
 'B',
 'Los 12 magistrados del TC son propuestos: 4 Congreso, 4 Senado, 2 Gobierno y 2 CGPJ.',
 'media'),

('tpn00003-0000-0000-0000-000000000001',
 '¿Cuántos miembros componen el Consejo General del Poder Judicial?',
 '{"A": "12", "B": "15", "C": "20", "D": "21"}',
 'D',
 'El CGPJ está compuesto por 21 miembros: el Presidente del TS y 20 vocales.',
 'media'),


-- TEMA 4: La Unión Europea
('tpn00004-0000-0000-0000-000000000001',
 '¿Qué es un Reglamento de la UE?',
 '{"A": "Una recomendación no vinculante", "B": "Norma de alcance general, obligatoria y directamente aplicable", "C": "Una decisión individual", "D": "Un tratado internacional"}',
 'B',
 'El Reglamento es obligatorio en todos sus elementos y directamente aplicable en todos los Estados.',
 'media'),

('tpn00004-0000-0000-0000-000000000001',
 '¿Qué es EUROPOL?',
 '{"A": "El Parlamento Europeo", "B": "La Agencia de la UE para la Cooperación Policial", "C": "El Tribunal de Justicia", "D": "El Banco Central Europeo"}',
 'B',
 'EUROPOL es la Agencia de la UE para la Cooperación Policial.',
 'facil'),

('tpn00004-0000-0000-0000-000000000001',
 '¿Dónde tiene su sede el Tribunal de Justicia de la UE?',
 '{"A": "Bruselas", "B": "Luxemburgo", "C": "Estrasburgo", "D": "La Haya"}',
 'B',
 'El TJUE tiene su sede en Luxemburgo.',
 'media'),


-- TEMA 5: Administración General del Estado
('tpn00005-0000-0000-0000-000000000001',
 '¿Qué ley regula el Régimen Jurídico del Sector Público?',
 '{"A": "Ley 39/2015", "B": "Ley 40/2015", "C": "Ley 30/1992", "D": "Ley 6/1997"}',
 'B',
 'La Ley 40/2015, de 1 de octubre, de Régimen Jurídico del Sector Público.',
 'media'),

('tpn00005-0000-0000-0000-000000000001',
 '¿Cuál es el órgano colegiado supremo del Gobierno?',
 '{"A": "La Presidencia", "B": "El Consejo de Ministros", "C": "Las Comisiones Delegadas", "D": "El Congreso"}',
 'B',
 'El Consejo de Ministros es el órgano colegiado del Gobierno que reúne a todos sus miembros.',
 'facil'),

('tpn00005-0000-0000-0000-000000000001',
 '¿Qué figura representa al Gobierno en la provincia?',
 '{"A": "El Presidente de la Diputación", "B": "El Subdelegado del Gobierno", "C": "El Alcalde de la capital", "D": "El Delegado del Gobierno"}',
 'B',
 'El Subdelegado del Gobierno representa al Gobierno en la provincia.',
 'media'),


-- TEMA 6: Los Funcionarios Públicos
('tpn00006-0000-0000-0000-000000000001',
 '¿Qué ley regula el Estatuto Básico del Empleado Público?',
 '{"A": "Ley 7/2007", "B": "Real Decreto Legislativo 5/2015", "C": "Ley 30/1984", "D": "Ley 39/2015"}',
 'B',
 'El TREBEP está regulado en el Real Decreto Legislativo 5/2015.',
 'media'),

('tpn00006-0000-0000-0000-000000000001',
 '¿Cuáles son las situaciones administrativas de los funcionarios?',
 '{"A": "Solo activo e inactivo", "B": "Servicio activo, excedencias, suspensión, servicios especiales, etc.", "C": "Solo activo y jubilado", "D": "Solo en servicio o de baja"}',
 'B',
 'Las situaciones incluyen: servicio activo, servicios especiales, excedencias, suspensión de funciones, etc.',
 'media'),

('tpn00006-0000-0000-0000-000000000001',
 '¿Cómo se pierde la condición de funcionario?',
 '{"A": "Solo por jubilación", "B": "Por renuncia, pérdida de nacionalidad, sanción disciplinaria de separación, pena de inhabilitación", "C": "Solo por fallecimiento", "D": "Nunca se pierde"}',
 'B',
 'Se pierde por renuncia, pérdida de nacionalidad, sanción de separación o pena de inhabilitación.',
 'media'),


-- TEMA 7: Ministerio del Interior
('tpn00007-0000-0000-0000-000000000001',
 '¿Qué organismo depende de la Secretaría de Estado de Seguridad?',
 '{"A": "El Ministerio de Defensa", "B": "Las Direcciones Generales de Policía y Guardia Civil", "C": "El Ministerio de Justicia", "D": "Las Comunidades Autónomas"}',
 'B',
 'De la Secretaría de Estado de Seguridad dependen las DG de Policía y de Guardia Civil.',
 'media'),

('tpn00007-0000-0000-0000-000000000001',
 '¿Qué es el CITCO?',
 '{"A": "Un tribunal", "B": "Centro de Inteligencia contra el Terrorismo y el Crimen Organizado", "C": "Un sindicato policial", "D": "Un centro de formación"}',
 'B',
 'CITCO es el Centro de Inteligencia contra el Terrorismo y el Crimen Organizado.',
 'media'),


-- TEMA 8: Dirección General de la Policía
('tpn00008-0000-0000-0000-000000000001',
 '¿Cuántas escalas tiene el Cuerpo Nacional de Policía?',
 '{"A": "2", "B": "3", "C": "4", "D": "5"}',
 'C',
 'El CNP tiene 4 escalas: Superior, Ejecutiva, Subinspección y Básica.',
 'media'),

('tpn00008-0000-0000-0000-000000000001',
 '¿Qué categoría pertenece a la Escala Básica del CNP?',
 '{"A": "Comisario", "B": "Inspector", "C": "Subinspector", "D": "Policía"}',
 'D',
 'La Escala Básica comprende las categorías de Policía y Oficial de Policía.',
 'facil'),

('tpn00008-0000-0000-0000-000000000001',
 '¿Cuál es el teléfono de la Policía Nacional?',
 '{"A": "062", "B": "091", "C": "112", "D": "016"}',
 'B',
 'El 091 es el teléfono de la Policía Nacional.',
 'facil'),


-- TEMA 9: Ley de Fuerzas y Cuerpos de Seguridad
('tpn00009-0000-0000-0000-000000000001',
 '¿Cuál es la misión principal de las FCS según la LO 2/1986?',
 '{"A": "Recaudar impuestos", "B": "Proteger el libre ejercicio de los derechos y libertades y garantizar la seguridad ciudadana", "C": "Juzgar delitos", "D": "Legislar"}',
 'B',
 'Su misión es proteger el libre ejercicio de los derechos y libertades y garantizar la seguridad ciudadana.',
 'facil'),

('tpn00009-0000-0000-0000-000000000001',
 '¿Qué principio obliga a usar la fuerza solo cuando sea estrictamente necesario?',
 '{"A": "Principio de legalidad", "B": "Principio de proporcionalidad", "C": "Principio de jerarquía", "D": "Principio de eficacia"}',
 'B',
 'El principio de proporcionalidad obliga a usar la fuerza de modo proporcional a la amenaza.',
 'media'),

('tpn00009-0000-0000-0000-000000000001',
 '¿Qué es el Consejo de Policía?',
 '{"A": "Un tribunal", "B": "Órgano de participación de los miembros del CNP", "C": "Una academia", "D": "Un sindicato"}',
 'B',
 'El Consejo de Policía es el órgano de participación de los miembros del CNP en sus condiciones de trabajo.',
 'media'),


-- TEMA 10: Prevención de Riesgos Laborales
('tpn00010-0000-0000-0000-000000000001',
 '¿Qué es un accidente de trabajo?',
 '{"A": "Cualquier enfermedad", "B": "Lesión corporal sufrida con ocasión o por consecuencia del trabajo", "C": "Solo lesiones graves", "D": "Solo lesiones mortales"}',
 'B',
 'Accidente de trabajo es toda lesión corporal sufrida con ocasión o por consecuencia del trabajo.',
 'facil'),

('tpn00010-0000-0000-0000-000000000001',
 '¿Qué es la vigilancia de la salud?',
 '{"A": "Vigilar a los trabajadores", "B": "Control médico periódico para detectar daños a la salud derivados del trabajo", "C": "Controlar la productividad", "D": "Vigilar el absentismo"}',
 'B',
 'Es el control médico para detectar precozmente daños a la salud derivados del trabajo.',
 'media'),


-- TEMA 11: Igualdad de Mujeres y Hombres
('tpn00011-0000-0000-0000-000000000001',
 '¿Qué es la discriminación indirecta?',
 '{"A": "Tratar diferente por razón de sexo", "B": "Aplicar criterios aparentemente neutros que perjudican a un sexo", "C": "No hay diferencia con la directa", "D": "Solo afecta a hombres"}',
 'B',
 'Es cuando criterios aparentemente neutros ponen en desventaja a personas de un sexo.',
 'media'),

('tpn00011-0000-0000-0000-000000000001',
 '¿Qué es el acoso sexual en el trabajo?',
 '{"A": "Cualquier broma", "B": "Comportamiento verbal o físico de naturaleza sexual no deseado que atenta contra la dignidad", "C": "Solo contacto físico", "D": "Solo comentarios"}',
 'B',
 'Es cualquier comportamiento de naturaleza sexual que atente contra la dignidad de la persona.',
 'facil'),


-- TEMA 12: Violencia de Género
('tpn00012-0000-0000-0000-000000000001',
 '¿Qué se considera violencia de género según la LO 1/2004?',
 '{"A": "Cualquier violencia", "B": "La ejercida por el hombre sobre la mujer que es o fue su pareja", "C": "Solo violencia física", "D": "Solo en el ámbito doméstico"}',
 'B',
 'Es la violencia ejercida por el hombre sobre la mujer que sea o haya sido su cónyuge o pareja.',
 'facil'),

('tpn00012-0000-0000-0000-000000000001',
 '¿Qué juzgados conocen de los delitos de violencia de género?',
 '{"A": "Juzgados de lo Penal", "B": "Juzgados de Violencia sobre la Mujer", "C": "Juzgados de Familia", "D": "Juzgados de Menores"}',
 'B',
 'Los Juzgados de Violencia sobre la Mujer conocen de estos delitos.',
 'facil'),

('tpn00012-0000-0000-0000-000000000001',
 '¿Qué es una orden de protección?',
 '{"A": "Una multa", "B": "Medida judicial que otorga protección integral a la víctima", "C": "Una sentencia firme", "D": "Un recurso"}',
 'B',
 'Es una medida judicial de protección integral para las víctimas de violencia de género.',
 'media'),


-- TEMA 13: Extranjería
('tpn00013-0000-0000-0000-000000000001',
 '¿Qué ley regula los derechos y libertades de los extranjeros en España?',
 '{"A": "LO 2/2009", "B": "LO 4/2000", "C": "LO 8/2000", "D": "LO 1/2015"}',
 'B',
 'La LO 4/2000, sobre derechos y libertades de los extranjeros en España.',
 'media'),

('tpn00013-0000-0000-0000-000000000001',
 '¿Qué es la expulsión del territorio español?',
 '{"A": "Una multa", "B": "Sanción que obliga al extranjero a abandonar España y prohíbe su entrada", "C": "Una advertencia", "D": "Un permiso de salida"}',
 'B',
 'La expulsión es la sanción que implica abandonar España y prohibición de entrada.',
 'facil'),

('tpn00013-0000-0000-0000-000000000001',
 '¿Qué documento acredita la estancia legal de un extranjero no comunitario?',
 '{"A": "Solo el pasaporte", "B": "El pasaporte con visado o la tarjeta de identidad de extranjero (TIE)", "C": "El DNI", "D": "El carné de conducir"}',
 'B',
 'El pasaporte con visado vigente o la TIE acreditan la situación legal.',
 'media'),


-- TEMA 14: Protección Internacional
('tpn00014-0000-0000-0000-000000000001',
 '¿Qué es el derecho de asilo?',
 '{"A": "Derecho a trabajar", "B": "Protección que se concede a nacionales no comunitarios o apátridas perseguidos", "C": "Derecho a viajar", "D": "Derecho a la educación"}',
 'B',
 'El asilo es la protección a personas perseguidas que cumplan los requisitos de la Convención de Ginebra.',
 'media'),

('tpn00014-0000-0000-0000-000000000001',
 '¿Qué Convención internacional regula el estatuto de los refugiados?',
 '{"A": "Convención de Viena", "B": "Convención de Ginebra de 1951", "C": "Convención de Roma", "D": "Convención de París"}',
 'B',
 'La Convención de Ginebra de 1951 sobre el Estatuto de los Refugiados.',
 'media'),


-- TEMA 15: Seguridad Ciudadana
('tpn00015-0000-0000-0000-000000000001',
 '¿Qué ley orgánica regula la protección de la seguridad ciudadana?',
 '{"A": "LO 1/1992", "B": "LO 4/2015", "C": "LO 2/1986", "D": "LO 3/2007"}',
 'B',
 'La LO 4/2015, de 30 de marzo, de protección de la seguridad ciudadana.',
 'facil'),

('tpn00015-0000-0000-0000-000000000001',
 '¿Qué documento están obligados a portar los españoles mayores de edad?',
 '{"A": "Pasaporte", "B": "DNI", "C": "Carné de conducir", "D": "Tarjeta sanitaria"}',
 'B',
 'Los españoles tienen el derecho y deber de obtener el DNI a partir de los 14 años.',
 'facil'),

('tpn00015-0000-0000-0000-000000000001',
 '¿En qué casos puede realizarse una identificación en vía pública?',
 '{"A": "Nunca", "B": "Para prevenir delitos, sancionar infracciones o proteger la seguridad", "C": "Solo con orden judicial", "D": "Solo a extranjeros"}',
 'B',
 'Puede requerirse identificación para prevenir delitos, sancionar infracciones o proteger personas.',
 'media'),


-- TEMA 16: Seguridad Privada
('tpn00016-0000-0000-0000-000000000001',
 '¿Qué ley regula la seguridad privada en España?',
 '{"A": "Ley 23/1992", "B": "Ley 5/2014", "C": "LO 2/1986", "D": "Ley 39/2015"}',
 'B',
 'La Ley 5/2014, de 4 de abril, de Seguridad Privada.',
 'media'),

('tpn00016-0000-0000-0000-000000000001',
 '¿Cuáles son las categorías del personal de seguridad privada?',
 '{"A": "Solo vigilantes", "B": "Vigilantes, escoltas, guardas rurales, jefes de seguridad, directores, detectives", "C": "Solo directores", "D": "Solo detectives"}',
 'B',
 'Incluye vigilantes, escoltas, guardas rurales, jefes de seguridad, directores y detectives.',
 'media'),


-- TEMA 17: Infraestructuras Críticas
('tpn00017-0000-0000-0000-000000000001',
 '¿Qué es una infraestructura crítica?',
 '{"A": "Cualquier edificio público", "B": "Instalación esencial cuyo funcionamiento es indispensable y su perturbación tendría grave impacto", "C": "Solo centrales nucleares", "D": "Solo aeropuertos"}',
 'B',
 'Son instalaciones esenciales cuya perturbación afectaría gravemente a servicios esenciales.',
 'media'),

('tpn00017-0000-0000-0000-000000000001',
 '¿Qué ley regula la protección de infraestructuras críticas?',
 '{"A": "Ley 1/2010", "B": "Ley 8/2011", "C": "Ley 5/2014", "D": "Ley 39/2015"}',
 'B',
 'La Ley 8/2011, de 28 de abril, de protección de infraestructuras críticas.',
 'media'),


-- TEMAS 18-21: Código Penal
('tpn00018-0000-0000-0000-000000000001',
 '¿Cuál es la diferencia entre delito leve, menos grave y grave?',
 '{"A": "No hay diferencia", "B": "La clasificación según la pena prevista", "C": "El tipo de autor", "D": "El lugar del delito"}',
 'B',
 'Los delitos se clasifican en leves, menos graves y graves según la pena prevista.',
 'media'),

('tpn00018-0000-0000-0000-000000000001',
 '¿Qué es una circunstancia atenuante?',
 '{"A": "Agrava la pena", "B": "Disminuye la responsabilidad criminal", "C": "Exime de responsabilidad", "D": "No afecta a la pena"}',
 'B',
 'Las atenuantes disminuyen la responsabilidad y, por tanto, la pena a imponer.',
 'facil'),

('tpn00019-0000-0000-0000-000000000001',
 '¿Cuál es la diferencia entre homicidio y asesinato?',
 '{"A": "No hay diferencia", "B": "El asesinato requiere alevosía, ensañamiento o precio", "C": "El homicidio es más grave", "D": "El asesinato es involuntario"}',
 'B',
 'El asesinato requiere la concurrencia de alevosía, ensañamiento, precio/recompensa, o para facilitar otro delito.',
 'media'),

('tpn00020-0000-0000-0000-000000000001',
 '¿Qué es el delito de apropiación indebida?',
 '{"A": "Robar con violencia", "B": "Apropiarse de dinero o bienes recibidos con obligación de devolverlos", "C": "Estafar", "D": "Dañar bienes ajenos"}',
 'B',
 'Consiste en apropiarse de dinero o bienes muebles recibidos con obligación de entregarlos o devolverlos.',
 'media'),

('tpn00021-0000-0000-0000-000000000001',
 '¿Qué es el delito de atentado contra agentes de la autoridad?',
 '{"A": "Insultar a un policía", "B": "Acometer, agredir o resistir gravemente a agentes de la autoridad", "C": "Desobediencia leve", "D": "No colaborar"}',
 'B',
 'Consiste en acometer, emplear violencia o intimidación grave contra autoridad o sus agentes.',
 'media'),


-- TEMAS 22-23: Derecho Procesal Penal
('tpn00022-0000-0000-0000-000000000001',
 '¿Quiénes integran la Policía Judicial?',
 '{"A": "Solo jueces", "B": "Unidades de las FCS que auxilian a jueces y fiscales", "C": "Solo fiscales", "D": "Solo abogados"}',
 'B',
 'La Policía Judicial está integrada por unidades de las FCS que auxilian a jueces, tribunales y Ministerio Fiscal.',
 'facil'),

('tpn00022-0000-0000-0000-000000000001',
 '¿Qué derecho tiene todo detenido?',
 '{"A": "Derecho a no ser informado", "B": "Derecho a guardar silencio y a asistencia de abogado", "C": "Derecho a ser liberado inmediatamente", "D": "No tiene derechos especiales"}',
 'B',
 'El detenido tiene derecho a guardar silencio, no declarar contra sí mismo, y asistencia letrada.',
 'facil'),

('tpn00023-0000-0000-0000-000000000001',
 '¿Qué es la entrada y registro en domicilio?',
 '{"A": "Inspección administrativa", "B": "Diligencia de investigación que requiere consentimiento, resolución judicial o flagrancia", "C": "Visita social", "D": "Control de identidad"}',
 'B',
 'Es una diligencia que requiere consentimiento del titular, autorización judicial o delito flagrante.',
 'media'),


-- TEMA 24: Protección de Datos
('tpn00024-0000-0000-0000-000000000001',
 '¿Qué es el derecho a la portabilidad de datos?',
 '{"A": "Derecho a borrar datos", "B": "Derecho a recibir los datos en formato estructurado y transmitirlos a otro responsable", "C": "Derecho de acceso", "D": "Derecho a rectificar"}',
 'B',
 'Permite recibir los datos personales en formato estructurado y transmitirlos a otro responsable.',
 'media'),

('tpn00024-0000-0000-0000-000000000001',
 '¿Qué es una brecha de seguridad de datos personales?',
 '{"A": "Un virus", "B": "Incidente que ocasiona destrucción, pérdida o acceso no autorizado a datos personales", "C": "Una actualización", "D": "Un backup"}',
 'B',
 'Es un incidente de seguridad que afecta a la confidencialidad, integridad o disponibilidad de datos.',
 'media'),


-- TEMA 25: Tráfico
('tpn00025-0000-0000-0000-000000000001',
 '¿Cuál es la tasa máxima de alcohol permitida para conductores profesionales?',
 '{"A": "0,5 g/l en sangre", "B": "0,3 g/l en sangre", "C": "0,25 g/l en aire", "D": "0,15 g/l en aire"}',
 'D',
 'Los conductores profesionales tienen un límite de 0,15 mg/l en aire espirado (0,3 g/l en sangre).',
 'media'),

('tpn00025-0000-0000-0000-000000000001',
 '¿Qué es la inmovilización de un vehículo?',
 '{"A": "Retirada definitiva", "B": "Impedir que continúe circulando hasta subsanar la causa", "C": "Destrucción del vehículo", "D": "Cambio de titularidad"}',
 'B',
 'La inmovilización impide la circulación hasta que se subsane el motivo que la causó.',
 'facil'),


-- TEMA 26: Armas y Explosivos
('tpn00026-0000-0000-0000-000000000001',
 '¿Qué reglamento regula las armas en España?',
 '{"A": "RD 137/1993", "B": "RD 230/1998", "C": "RD 1428/2003", "D": "RD 557/2011"}',
 'A',
 'El Real Decreto 137/1993 aprueba el Reglamento de Armas.',
 'media'),

('tpn00026-0000-0000-0000-000000000001',
 '¿En qué categoría se clasifican las armas de fuego cortas?',
 '{"A": "1ª categoría", "B": "2ª categoría", "C": "3ª categoría", "D": "4ª categoría"}',
 'A',
 'Las armas de fuego cortas (pistolas y revólveres) son de 1ª categoría.',
 'media'),


-- =========================================== 
-- BLOQUE II: CIENCIAS SOCIALES (Temas 27-38)
-- =========================================== 

('tpn00027-0000-0000-0000-000000000001',
 '¿Qué documento proclamó por primera vez los derechos humanos de forma universal?',
 '{"A": "Carta Magna de 1215", "B": "Declaración Universal de Derechos Humanos de 1948", "C": "Declaración de Derechos de Virginia 1776", "D": "Código de Hammurabi"}',
 'B',
 'La DUDH de 1948 proclamó por primera vez derechos humanos con vocación universal.',
 'facil'),

('tpn00028-0000-0000-0000-000000000001',
 '¿Qué es la globalización?',
 '{"A": "Un fenómeno local", "B": "Proceso de integración mundial en aspectos económicos, culturales y sociales", "C": "Solo comercio internacional", "D": "Una teoría política"}',
 'B',
 'La globalización es el proceso de integración mundial en múltiples aspectos.',
 'facil'),

('tpn00029-0000-0000-0000-000000000001',
 '¿Qué es el desarrollo sostenible?',
 '{"A": "Desarrollo solo económico", "B": "Desarrollo que satisface necesidades presentes sin comprometer las futuras", "C": "Desarrollo tecnológico", "D": "Desarrollo militar"}',
 'B',
 'Es el desarrollo que satisface las necesidades del presente sin comprometer las de generaciones futuras.',
 'facil'),

('tpn00032-0000-0000-0000-000000000001',
 '¿Qué es la escucha activa en comunicación?',
 '{"A": "Oír sin atención", "B": "Prestar atención plena al interlocutor, mostrando interés y comprensión", "C": "Interrumpir constantemente", "D": "Solo oír las palabras"}',
 'B',
 'La escucha activa implica atención plena, retroalimentación y comprensión del mensaje.',
 'facil'),

('tpn00034-0000-0000-0000-000000000001',
 '¿Qué es la victimización secundaria?',
 '{"A": "Ser víctima dos veces del mismo delito", "B": "Daño adicional sufrido por la víctima a causa del sistema judicial o social", "C": "Convertirse en delincuente", "D": "Olvidar el delito"}',
 'B',
 'Es el sufrimiento añadido que experimenta la víctima por parte del sistema o la sociedad.',
 'media'),

('tpn00036-0000-0000-0000-000000000001',
 '¿Cuál es la clasificación de drogas según sus efectos?',
 '{"A": "Legales e ilegales", "B": "Depresoras, estimulantes y perturbadoras", "C": "Naturales y sintéticas", "D": "Suaves y duras"}',
 'B',
 'Se clasifican en depresoras del SNC, estimulantes del SNC y perturbadoras.',
 'media'),

('tpn00037-0000-0000-0000-000000000001',
 '¿Qué es la deontología policial?',
 '{"A": "Estudio de los dientes", "B": "Conjunto de deberes éticos y normas de conducta profesional policial", "C": "Formación física", "D": "Técnicas de tiro"}',
 'B',
 'Es el conjunto de deberes y normas éticas que rigen la conducta profesional policial.',
 'facil'),


-- =========================================== 
-- BLOQUE III: MATERIAS TÉCNICO-CIENTÍFICAS (Temas 39-46)
-- =========================================== 

('tpn00039-0000-0000-0000-000000000001',
 '¿Qué es el malware?',
 '{"A": "Un programa útil", "B": "Software malicioso diseñado para dañar sistemas o robar información", "C": "Un antivirus", "D": "Un sistema operativo"}',
 'B',
 'Malware es software malicioso que incluye virus, troyanos, ransomware, etc.',
 'facil'),

('tpn00039-0000-0000-0000-000000000001',
 '¿Qué es la ingeniería social en ciberseguridad?',
 '{"A": "Diseño de redes sociales", "B": "Técnicas de manipulación psicológica para obtener información", "C": "Programación de software", "D": "Diseño de hardware"}',
 'B',
 'Son técnicas de manipulación para engañar a personas y obtener información o accesos.',
 'media'),

('tpn00041-0000-0000-0000-000000000001',
 '¿Qué es el seguro de un arma de fuego?',
 '{"A": "El cargador", "B": "Mecanismo que impide el disparo accidental", "C": "La mira", "D": "El gatillo"}',
 'B',
 'El seguro es el mecanismo que impide que el arma se dispare accidentalmente.',
 'facil'),

('tpn00043-0000-0000-0000-000000000001',
 '¿Qué es la cadena de supervivencia?',
 '{"A": "Una cadena física", "B": "Secuencia de acciones que maximizan la supervivencia en parada cardíaca", "C": "Un protocolo policial", "D": "Una técnica de detención"}',
 'B',
 'Es la secuencia: reconocimiento y alerta, RCP precoz, desfibrilación y cuidados avanzados.',
 'media'),

('tpn00043-0000-0000-0000-000000000001',
 '¿Qué hacer ante una hemorragia externa grave?',
 '{"A": "No tocar", "B": "Aplicar presión directa sobre la herida y elevar el miembro si es posible", "C": "Dar agua", "D": "Mover a la víctima"}',
 'B',
 'Se debe aplicar presión directa, elevar el miembro si es posible y activar servicios de emergencia.',
 'facil'),

('tpn00044-0000-0000-0000-000000000001',
 '¿Qué son las huellas dactilares?',
 '{"A": "Marcas en los pies", "B": "Dibujos formados por las crestas papilares de los dedos, únicas e inmutables", "C": "Manchas de sangre", "D": "Pisadas"}',
 'B',
 'Son los dibujos formados por las crestas papilares de los dedos, únicas para cada persona.',
 'facil'),

('tpn00044-0000-0000-0000-000000000001',
 '¿Qué es la cadena de custodia?',
 '{"A": "Una cadena física", "B": "Procedimiento que garantiza la integridad de los indicios desde su recogida hasta el juicio", "C": "Un tipo de esposa", "D": "Una técnica de tiro"}',
 'B',
 'Garantiza la autenticidad e integridad de los indicios desde su recogida hasta su presentación en juicio.',
 'media'),

('tpn00045-0000-0000-0000-000000000001',
 '¿Qué son las coordenadas UTM?',
 '{"A": "Un tipo de mapa", "B": "Sistema de coordenadas cartesianas basado en la proyección Universal Transversa de Mercator", "C": "Una brújula", "D": "Un GPS"}',
 'B',
 'UTM es un sistema de coordenadas basado en una proyección cartográfica específica.',
 'dificil'),

('tpn00046-0000-0000-0000-000000000001',
 '¿Qué información contiene el VIN de un vehículo?',
 '{"A": "Solo la marca", "B": "Identificación única: fabricante, características y número de serie", "C": "Solo el color", "D": "Solo el año"}',
 'B',
 'El VIN (Vehicle Identification Number) identifica unívocamente cada vehículo fabricado.',
 'media')

ON CONFLICT DO NOTHING;


-- =========================================== 
-- RESUMEN DE PREGUNTAS POLICÍA NACIONAL
-- =========================================== 
-- 
-- BLOQUE I - CIENCIAS JURÍDICAS (85 preguntas)
--   Temas 1-9: Derecho, Constitución, UE, AGE, FCS ~35
--   Temas 10-17: PRL, Igualdad, Extranjería, Seguridad ~25
--   Temas 18-26: Código Penal, Procesal, LOPD, Tráfico ~25
--
-- BLOQUE II - CIENCIAS SOCIALES (15 preguntas)
--   Temas 27-38: DDHH, Globalización, Psicología, etc.
--
-- BLOQUE III - TÉCNICO-CIENTÍFICAS (12 preguntas)
--   Temas 39-46: TIC, Armamento, Primeros Auxilios, etc.
--
-- TOTAL: 112 preguntas
-- =========================================== 
