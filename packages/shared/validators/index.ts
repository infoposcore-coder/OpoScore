// ===========================================
// OpoScore - Validadores Zod
// ===========================================

import { z } from 'zod'

// Validadores de autenticación
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Validadores de tests
export const generateTestSchema = z.object({
  oposicionId: z.string().uuid(),
  temaIds: z.array(z.string().uuid()).optional(),
  cantidad: z.number().min(5).max(100).default(20),
  dificultad: z.enum(['facil', 'media', 'dificil', 'mixta']).default('mixta'),
  tipo: z.enum(['practica', 'simulacro', 'repaso']).default('practica'),
})

export const submitTestSchema = z.object({
  testId: z.string().uuid(),
  respuestas: z.array(z.object({
    preguntaId: z.string().uuid(),
    respuestaId: z.string().uuid().nullable(),
    tiempoMs: z.number().min(0),
  })),
})

// Validadores de flashcards
export const createFlashcardSchema = z.object({
  temaId: z.string().uuid(),
  frente: z.string().min(1, 'El frente no puede estar vacío').max(500),
  reverso: z.string().min(1, 'El reverso no puede estar vacío').max(2000),
})

export const reviewFlashcardSchema = z.object({
  flashcardId: z.string().uuid(),
  acertada: z.boolean(),
  tiempoRespuestaMs: z.number().min(0).optional(),
})

// Validadores de perfil
export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  studyHoursGoal: z.number().min(1).max(40).optional(),
  notificationEmail: z.boolean().optional(),
  notificationPush: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
})

// Validadores de IA
export const tutorMessageSchema = z.object({
  mensaje: z.string().min(1).max(1000),
  oposicion: z.string().min(1),
  tema: z.string().optional(),
  historial: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })).optional(),
})

export const explicarPreguntaSchema = z.object({
  preguntaId: z.string().uuid(),
  respuestaUsuarioId: z.string().uuid().optional(),
})

// Tipos inferidos
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type GenerateTestInput = z.infer<typeof generateTestSchema>
export type SubmitTestInput = z.infer<typeof submitTestSchema>
export type CreateFlashcardInput = z.infer<typeof createFlashcardSchema>
export type ReviewFlashcardInput = z.infer<typeof reviewFlashcardSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type TutorMessageInput = z.infer<typeof tutorMessageSchema>
export type ExplicarPreguntaInput = z.infer<typeof explicarPreguntaSchema>
