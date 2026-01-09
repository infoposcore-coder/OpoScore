// ===========================================
// OpoScore - Componente Chat del Tutor IA
// ===========================================

'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface TutorChatProps {
  oposicion?: string
  className?: string
  initialMessage?: string | null
  onMessageSent?: () => void
}

export function TutorChat({ oposicion, className, initialMessage, onMessageSent }: TutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu tutor de oposiciones. ¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Manejar mensaje inicial desde sugerencias
  useEffect(() => {
    if (initialMessage && !loading) {
      setPendingMessage(initialMessage)
    }
  }, [initialMessage, loading])

  useEffect(() => {
    if (pendingMessage && !loading) {
      setInput(pendingMessage)
      setPendingMessage(null)
      // Auto-enviar después de un pequeño delay
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [pendingMessage, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: input,
          oposicion: oposicion || 'General',
          historial: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.respuesta }])
      onMessageSent?.()
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.'
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  // Renderizar contenido con markdown básico
  const renderContent = (content: string) => {
    // Convertir **texto** a negrita y otros formatos básicos
    const parts = content.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">🤖</span>
            Tutor IA
          </CardTitle>
          {oposicion && (
            <Badge variant="secondary" className="text-xs">
              {oposicion}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {renderContent(message.content)}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                'Enviar'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente de sugerencias
export function TutorSuggestions({ onSelect }: { onSelect: (suggestion: string) => void }) {
  const suggestions = [
    '¿Cuántos títulos tiene la Constitución?',
    'Explícame el procedimiento administrativo',
    '¿Qué es el silencio administrativo?',
    'Dame tips para memorizar leyes',
    '¿Qué diferencia hay entre recurso de alzada y reposición?',
    '¿Cómo organizo mi tiempo de estudio?',
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="text-left text-sm p-3 rounded-lg border hover:bg-muted transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
