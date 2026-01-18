// ===========================================
// OpoMetrics - Cliente Groq API
// ===========================================

import { openRouterFallback } from './openrouter'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqResponse {
  id: string
  choices: {
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface GroqOptions {
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

// Respuestas demo cuando no hay API key
function generateDemoResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('constitución') || q.includes('constitucion')) {
    return `La Constitución Española de 1978 es la norma suprema del ordenamiento jurídico español. Fue aprobada en referéndum el 6 de diciembre de 1978 y entró en vigor el 29 de diciembre del mismo año.

**Estructura:**
- Preámbulo
- Título Preliminar (arts. 1-9)
- 10 Títulos (arts. 10-169)
- 4 Disposiciones Adicionales
- 9 Disposiciones Transitorias
- 1 Disposición Derogatoria
- 1 Disposición Final

¿Quieres que profundicemos en algún título en particular?`
  }

  if (q.includes('administrativo') || q.includes('procedimiento')) {
    return `El procedimiento administrativo común está regulado por la **Ley 39/2015**, de 1 de octubre.

**Fases del procedimiento:**
1. **Iniciación** - De oficio o a instancia de parte
2. **Instrucción** - Alegaciones, prueba, informes
3. **Terminación** - Resolución, desistimiento, renuncia, caducidad

**Plazos importantes:**
- Resolución expresa: 3 meses (si no se especifica otro)
- Recurso de alzada: 1 mes
- Recurso de reposición: 1 mes

¿Necesitas que te explique alguna fase con más detalle?`
  }

  if (q.includes('ayuda') || q.includes('help') || q.includes('hola') || q.includes('qué puedes')) {
    return `¡Hola! Soy tu **tutor de oposiciones**. Puedo ayudarte con:

📚 **Dudas de temario** - Pregúntame sobre cualquier tema
📝 **Explicar preguntas** - Si fallas un test, te explico por qué
💡 **Técnicas de estudio** - Consejos para memorizar mejor
📅 **Planificación** - Cómo organizar tu tiempo de estudio

*Este es el modo demo. Configura GROQ_API_KEY para respuestas más avanzadas.*

¿En qué puedo ayudarte hoy?`
  }

  if (q.includes('memorizar') || q.includes('estudiar') || q.includes('técnica')) {
    return `Aquí tienes algunas **técnicas de memorización** efectivas:

**1. Repetición espaciada** 📆
Revisa el material a intervalos crecientes: 1 día, 3 días, 7 días, 15 días...

**2. Técnica de la casa** 🏠
Asocia cada concepto a una habitación de tu casa.

**3. Acrónimos y frases**
Por ejemplo, para los Títulos de la Constitución: "PRELI CO CG GO TJ EP EC OT TC RE"

**4. Enseña a otros** 👥
Explicar un tema te obliga a entenderlo profundamente.

**5. Tests activos** ✍️
Es mejor hacer tests que solo leer pasivamente.

¿Quieres que te ayude a crear técnicas para un tema específico?`
  }

  return `Entiendo tu pregunta sobre "${question.slice(0, 50)}${question.length > 50 ? '...' : ''}".

En el **modo demo**, mis respuestas son limitadas. Puedo ayudarte con preguntas sobre:

- 📜 **Constitución Española**
- 📋 **Procedimiento Administrativo**
- 📚 **Técnicas de estudio**

Para respuestas más completas y personalizadas:
1. Configura tu **GROQ_API_KEY** en .env.local
2. La API de Groq es gratuita (14,400 requests/día)

¿Hay algo específico de estos temas que quieras aprender?`
}

// Cliente principal Groq con fallback a OpenRouter
export async function chat(
  messages: ChatMessage[],
  options: GroqOptions = {}
): Promise<string> {
  const { temperature = 0.7, max_tokens = 1024 } = options

  // Modo demo sin API key
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    return generateDemoResponse(lastUserMessage?.content || '')
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature,
        max_tokens,
      }),
    })

    if (!response.ok) {
      // Si Groq falla, intentar fallback
      if (response.status === 429 || response.status >= 500) {
        console.warn('Groq API fallback activated, using OpenRouter')
        return openRouterFallback(messages, options)
      }
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data: GroqResponse = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Groq error, attempting fallback:', error)
    return openRouterFallback(messages, options)
  }
}

// Chat con streaming
export async function chatStream(
  messages: ChatMessage[],
  options: GroqOptions = {},
  onChunk: (chunk: string) => void
): Promise<void> {
  const { temperature = 0.7, max_tokens = 1024 } = options

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature,
      max_tokens,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('No response body')
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'))

    for (const line of lines) {
      const data = line.replace('data: ', '').trim()
      if (data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices[0]?.delta?.content
        if (content) {
          onChunk(content)
        }
      } catch {
        // Ignorar líneas que no son JSON válido
      }
    }
  }
}

// Función de utilidad para caché simple en memoria
const cache = new Map<string, { response: string; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hora

export async function chatWithCache(
  messages: ChatMessage[],
  options: GroqOptions = {}
): Promise<string> {
  const cacheKey = JSON.stringify({ messages, options })
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response
  }

  const response = await chat(messages, options)
  cache.set(cacheKey, { response, timestamp: Date.now() })

  // Limpiar caché antiguo
  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value
    if (oldestKey) cache.delete(oldestKey)
  }

  return response
}
