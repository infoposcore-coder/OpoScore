// ===========================================
// OpoScore - Datos Mock de Oposiciones
// ===========================================

export interface OposicionMock {
  id: string
  nombre: string
  slug: string
  descripcion: string
  categoria: 'administracion' | 'seguridad' | 'servicios'
  plazas_aproximadas: number
  requisitos: string[]
  temario_resumen: string[]
  dificultad: 1 | 2 | 3 | 4 | 5
  salario_aproximado: string
  icono: string
}

export const oposicionesMock: OposicionMock[] = [
  {
    id: 'aux-admin',
    nombre: 'Auxiliar Administrativo del Estado',
    slug: 'auxiliar-administrativo',
    descripcion: 'Funciones de apoyo administrativo en la Administración General del Estado. Una de las oposiciones más demandadas por su accesibilidad.',
    categoria: 'administracion',
    plazas_aproximadas: 500,
    requisitos: ['Nacionalidad española o UE', 'Mayor de 16 años', 'Graduado en ESO o equivalente'],
    temario_resumen: ['Constitución Española', 'Organización del Estado', 'Procedimiento Administrativo', 'Ofimática'],
    dificultad: 2,
    salario_aproximado: '1.400-1.600€/mes',
    icono: '📋'
  },
  {
    id: 'admin-estado',
    nombre: 'Administrativo del Estado',
    slug: 'administrativo-estado',
    descripcion: 'Gestión administrativa de nivel medio. Requiere Bachillerato. Mayor responsabilidad y mejor salario que Auxiliar.',
    categoria: 'administracion',
    plazas_aproximadas: 300,
    requisitos: ['Nacionalidad española o UE', 'Mayor de 16 años', 'Título de Bachiller o equivalente'],
    temario_resumen: ['Constitución Española', 'Derecho Administrativo', 'Gestión de Personal', 'Contratación Pública', 'Ofimática avanzada'],
    dificultad: 3,
    salario_aproximado: '1.800-2.200€/mes',
    icono: '🏛️'
  },
  {
    id: 'policia-nacional',
    nombre: 'Policía Nacional',
    slug: 'policia-nacional',
    descripcion: 'Cuerpo de seguridad del Estado. Incluye pruebas físicas, psicotécnicos y conocimientos.',
    categoria: 'seguridad',
    plazas_aproximadas: 2000,
    requisitos: ['Nacionalidad española', '18-65 años', 'Bachiller o equivalente', 'Estatura mínima: 1,65m (H) / 1,60m (M)', 'Permiso de conducir B'],
    temario_resumen: ['Ciencias Jurídicas', 'Ciencias Sociales', 'Materias Técnico-Científicas'],
    dificultad: 4,
    salario_aproximado: '2.200-2.800€/mes',
    icono: '👮'
  },
  {
    id: 'guardia-civil',
    nombre: 'Guardia Civil',
    slug: 'guardia-civil',
    descripcion: 'Instituto armado de naturaleza militar. Competencias en todo el territorio nacional, especialmente zonas rurales.',
    categoria: 'seguridad',
    plazas_aproximadas: 1800,
    requisitos: ['Nacionalidad española', '18-40 años', 'Bachiller o equivalente', 'Estatura mínima: 1,65m (H) / 1,60m (M)', 'Permiso de conducir B'],
    temario_resumen: ['Materias Jurídicas', 'Materias Socio-Culturales', 'Materias Técnico-Científicas'],
    dificultad: 4,
    salario_aproximado: '2.100-2.700€/mes',
    icono: '🛡️'
  },
  {
    id: 'correos',
    nombre: 'Personal Laboral de Correos',
    slug: 'correos',
    descripcion: 'Reparto y atención en oficinas de Correos. Convocatorias frecuentes con muchas plazas.',
    categoria: 'servicios',
    plazas_aproximadas: 3000,
    requisitos: ['Nacionalidad española o UE', 'Mayor de 18 años', 'Graduado en ESO o equivalente', 'Permiso de conducir (para reparto)'],
    temario_resumen: ['Productos y servicios de Correos', 'Procesos de admisión y entrega', 'Atención al cliente', 'Prevención de riesgos'],
    dificultad: 2,
    salario_aproximado: '1.200-1.500€/mes',
    icono: '📮'
  },
  {
    id: 'aux-justicia',
    nombre: 'Auxilio Judicial',
    slug: 'auxilio-judicial',
    descripcion: 'Funciones de apoyo en juzgados y tribunales. Estabilidad laboral en la Administración de Justicia.',
    categoria: 'administracion',
    plazas_aproximadas: 400,
    requisitos: ['Nacionalidad española o UE', 'Mayor de 18 años', 'Graduado en ESO o equivalente'],
    temario_resumen: ['Organización del Estado', 'Organización judicial', 'Procedimientos judiciales', 'Derecho Procesal básico'],
    dificultad: 3,
    salario_aproximado: '1.500-1.800€/mes',
    icono: '⚖️'
  },
]

// Preguntas mock por oposición
export const preguntasMock: Record<string, Array<{
  id: string
  enunciado: string
  respuestas: Array<{ id: string; texto: string; es_correcta: boolean }>
}>> = {
  'auxiliar-administrativo': [
    {
      id: 'aa-1',
      enunciado: 'Según la Constitución Española, el castellano es la lengua oficial del Estado. Todos los españoles tienen el deber de conocerla y el derecho a:',
      respuestas: [
        { id: 'aa-1a', texto: 'Aprenderla', es_correcta: false },
        { id: 'aa-1b', texto: 'Usarla', es_correcta: true },
        { id: 'aa-1c', texto: 'Enseñarla', es_correcta: false },
        { id: 'aa-1d', texto: 'Imponerla', es_correcta: false },
      ]
    },
    {
      id: 'aa-2',
      enunciado: 'La Constitución Española de 1978 fue aprobada en referéndum el día:',
      respuestas: [
        { id: 'aa-2a', texto: '6 de diciembre de 1978', es_correcta: true },
        { id: 'aa-2b', texto: '27 de diciembre de 1978', es_correcta: false },
        { id: 'aa-2c', texto: '31 de octubre de 1978', es_correcta: false },
        { id: 'aa-2d', texto: '29 de diciembre de 1978', es_correcta: false },
      ]
    },
    {
      id: 'aa-3',
      enunciado: '¿Cuántos títulos tiene la Constitución Española?',
      respuestas: [
        { id: 'aa-3a', texto: '8 títulos', es_correcta: false },
        { id: 'aa-3b', texto: '10 títulos más el Preliminar', es_correcta: true },
        { id: 'aa-3c', texto: '12 títulos', es_correcta: false },
        { id: 'aa-3d', texto: '9 títulos más el Preliminar', es_correcta: false },
      ]
    },
    {
      id: 'aa-4',
      enunciado: 'El plazo máximo para resolver un procedimiento administrativo, cuando no se haya fijado otro, es de:',
      respuestas: [
        { id: 'aa-4a', texto: '1 mes', es_correcta: false },
        { id: 'aa-4b', texto: '2 meses', es_correcta: false },
        { id: 'aa-4c', texto: '3 meses', es_correcta: true },
        { id: 'aa-4d', texto: '6 meses', es_correcta: false },
      ]
    },
    {
      id: 'aa-5',
      enunciado: 'El recurso de alzada se interpone en el plazo de:',
      respuestas: [
        { id: 'aa-5a', texto: '15 días', es_correcta: false },
        { id: 'aa-5b', texto: '1 mes si el acto es expreso', es_correcta: true },
        { id: 'aa-5c', texto: '2 meses', es_correcta: false },
        { id: 'aa-5d', texto: '10 días hábiles', es_correcta: false },
      ]
    },
  ],
  'policia-nacional': [
    {
      id: 'pn-1',
      enunciado: '¿Cuál es el artículo de la Constitución que reconoce el derecho a la libertad y seguridad?',
      respuestas: [
        { id: 'pn-1a', texto: 'Artículo 15', es_correcta: false },
        { id: 'pn-1b', texto: 'Artículo 17', es_correcta: true },
        { id: 'pn-1c', texto: 'Artículo 18', es_correcta: false },
        { id: 'pn-1d', texto: 'Artículo 24', es_correcta: false },
      ]
    },
    {
      id: 'pn-2',
      enunciado: 'El Cuerpo Nacional de Policía depende del:',
      respuestas: [
        { id: 'pn-2a', texto: 'Ministerio de Defensa', es_correcta: false },
        { id: 'pn-2b', texto: 'Ministerio del Interior', es_correcta: true },
        { id: 'pn-2c', texto: 'Ministerio de Justicia', es_correcta: false },
        { id: 'pn-2d', texto: 'Presidencia del Gobierno', es_correcta: false },
      ]
    },
    {
      id: 'pn-3',
      enunciado: 'La detención preventiva no podrá durar más de:',
      respuestas: [
        { id: 'pn-3a', texto: '24 horas', es_correcta: false },
        { id: 'pn-3b', texto: '48 horas', es_correcta: false },
        { id: 'pn-3c', texto: '72 horas', es_correcta: true },
        { id: 'pn-3d', texto: '96 horas', es_correcta: false },
      ]
    },
  ],
  'correos': [
    {
      id: 'co-1',
      enunciado: '¿Cuál es el plazo máximo de permanencia de un envío en lista de Correos?',
      respuestas: [
        { id: 'co-1a', texto: '7 días', es_correcta: false },
        { id: 'co-1b', texto: '15 días', es_correcta: true },
        { id: 'co-1c', texto: '30 días', es_correcta: false },
        { id: 'co-1d', texto: '20 días', es_correcta: false },
      ]
    },
    {
      id: 'co-2',
      enunciado: 'El servicio postal universal garantiza:',
      respuestas: [
        { id: 'co-2a', texto: 'Solo envíos nacionales', es_correcta: false },
        { id: 'co-2b', texto: 'Acceso a todos los ciudadanos a precio asequible', es_correcta: true },
        { id: 'co-2c', texto: 'Solo paquetería', es_correcta: false },
        { id: 'co-2d', texto: 'Envíos urgentes gratuitos', es_correcta: false },
      ]
    },
  ],
  'guardia-civil': [
    {
      id: 'gc-1',
      enunciado: 'La Guardia Civil fue fundada en el año:',
      respuestas: [
        { id: 'gc-1a', texto: '1820', es_correcta: false },
        { id: 'gc-1b', texto: '1844', es_correcta: true },
        { id: 'gc-1c', texto: '1876', es_correcta: false },
        { id: 'gc-1d', texto: '1900', es_correcta: false },
      ]
    },
    {
      id: 'gc-2',
      enunciado: 'El fundador de la Guardia Civil fue:',
      respuestas: [
        { id: 'gc-2a', texto: 'El Duque de Ahumada', es_correcta: true },
        { id: 'gc-2b', texto: 'El General Prim', es_correcta: false },
        { id: 'gc-2c', texto: 'El Conde de Romanones', es_correcta: false },
        { id: 'gc-2d', texto: 'El General Espartero', es_correcta: false },
      ]
    },
  ],
  'administrativo-estado': [
    {
      id: 'ae-1',
      enunciado: 'La Ley 39/2015 regula:',
      respuestas: [
        { id: 'ae-1a', texto: 'El régimen jurídico del sector público', es_correcta: false },
        { id: 'ae-1b', texto: 'El procedimiento administrativo común', es_correcta: true },
        { id: 'ae-1c', texto: 'Los contratos del sector público', es_correcta: false },
        { id: 'ae-1d', texto: 'La función pública', es_correcta: false },
      ]
    },
    {
      id: 'ae-2',
      enunciado: 'El silencio administrativo será positivo:',
      respuestas: [
        { id: 'ae-2a', texto: 'Siempre', es_correcta: false },
        { id: 'ae-2b', texto: 'Nunca', es_correcta: false },
        { id: 'ae-2c', texto: 'Como regla general en procedimientos iniciados a solicitud', es_correcta: true },
        { id: 'ae-2d', texto: 'Solo en procedimientos sancionadores', es_correcta: false },
      ]
    },
  ],
  'auxilio-judicial': [
    {
      id: 'aj-1',
      enunciado: 'El Consejo General del Poder Judicial está compuesto por:',
      respuestas: [
        { id: 'aj-1a', texto: '12 miembros', es_correcta: false },
        { id: 'aj-1b', texto: '20 miembros más el Presidente', es_correcta: true },
        { id: 'aj-1c', texto: '15 miembros', es_correcta: false },
        { id: 'aj-1d', texto: '25 miembros', es_correcta: false },
      ]
    },
    {
      id: 'aj-2',
      enunciado: 'El Tribunal Supremo tiene su sede en:',
      respuestas: [
        { id: 'aj-2a', texto: 'Barcelona', es_correcta: false },
        { id: 'aj-2b', texto: 'Madrid', es_correcta: true },
        { id: 'aj-2c', texto: 'Sevilla', es_correcta: false },
        { id: 'aj-2d', texto: 'Valencia', es_correcta: false },
      ]
    },
  ],
}

// Función para obtener oposición por slug
export function getOposicionBySlug(slug: string): OposicionMock | undefined {
  return oposicionesMock.find(o => o.slug === slug)
}

// Función para obtener preguntas de una oposición
export function getPreguntasByOposicion(slug: string, limit = 10) {
  const preguntas = preguntasMock[slug] || preguntasMock['auxiliar-administrativo']
  return preguntas.slice(0, limit)
}

// Función para obtener oposiciones por categoría
export function getOposicionesByCategoria(categoria: OposicionMock['categoria']) {
  return oposicionesMock.filter(o => o.categoria === categoria)
}
