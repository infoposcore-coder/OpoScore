// ===========================================
// OpoScore - Cliente OpenRouter (Fallback)
// ===========================================

import type { ChatMessage } from './groq'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Modelos gratuitos disponibles en OpenRouter (puede cambiar)
const FREE_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemma-2-9b-it:free',
  'mistralai/mistral-7b-instruct:free',
]

interface OpenRouterOptions {
  temperature?: number
  max_tokens?: number
}

export async function openRouterFallback(
  messages: ChatMessage[],
  options: OpenRouterOptions = {}
): Promise<string> {
  const { temperature = 0.7, max_tokens = 1024 } = options

  // Intentar con cada modelo gratuito
  for (const model of FREE_MODELS) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://oposcore.es',
          'X-Title': 'OpoScore',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
        }),
      })

      if (!response.ok) {
        console.warn(`OpenRouter model ${model} failed, trying next...`)
        continue
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      console.warn(`OpenRouter model ${model} error:`, error)
      continue
    }
  }

  throw new Error('All OpenRouter fallback models failed')
}

// Verificar disponibilidad de modelos gratuitos
export async function checkFreeModelsAvailability(): Promise<string[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    const freeModels = data.data
      .filter((m: { pricing: { prompt: string } }) => m.pricing.prompt === '0')
      .map((m: { id: string }) => m.id)

    return freeModels
  } catch {
    return []
  }
}
