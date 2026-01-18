// ===========================================
// OpoMetrics - Tipos de Base de Datos
// ===========================================
// Este archivo se regenerará con: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          email: string
          study_hours_goal: number
          notification_email: boolean
          notification_push: boolean
          theme: 'light' | 'dark' | 'system'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          email: string
          study_hours_goal?: number
          notification_email?: boolean
          notification_push?: boolean
          theme?: 'light' | 'dark' | 'system'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string
          study_hours_goal?: number
          notification_email?: boolean
          notification_push?: boolean
          theme?: 'light' | 'dark' | 'system'
        }
      }
      oposiciones: {
        Row: {
          id: string
          created_at: string
          nombre: string
          slug: string
          descripcion: string | null
          categoria: string
          activa: boolean
          imagen_url: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          nombre: string
          slug: string
          descripcion?: string | null
          categoria: string
          activa?: boolean
          imagen_url?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          nombre?: string
          slug?: string
          descripcion?: string | null
          categoria?: string
          activa?: boolean
          imagen_url?: string | null
          metadata?: Json | null
        }
      }
      bloques: {
        Row: {
          id: string
          created_at: string
          oposicion_id: string
          nombre: string
          orden: number
        }
        Insert: {
          id?: string
          created_at?: string
          oposicion_id: string
          nombre: string
          orden: number
        }
        Update: {
          id?: string
          created_at?: string
          oposicion_id?: string
          nombre?: string
          orden?: number
        }
      }
      temas: {
        Row: {
          id: string
          created_at: string
          bloque_id: string
          nombre: string
          descripcion: string | null
          orden: number
          tiempo_estimado_minutos: number
        }
        Insert: {
          id?: string
          created_at?: string
          bloque_id: string
          nombre: string
          descripcion?: string | null
          orden: number
          tiempo_estimado_minutos?: number
        }
        Update: {
          id?: string
          created_at?: string
          bloque_id?: string
          nombre?: string
          descripcion?: string | null
          orden?: number
          tiempo_estimado_minutos?: number
        }
      }
      subtemas: {
        Row: {
          id: string
          created_at: string
          tema_id: string
          nombre: string
          contenido_md: string | null
          orden: number
        }
        Insert: {
          id?: string
          created_at?: string
          tema_id: string
          nombre: string
          contenido_md?: string | null
          orden: number
        }
        Update: {
          id?: string
          created_at?: string
          tema_id?: string
          nombre?: string
          contenido_md?: string | null
          orden?: number
        }
      }
      preguntas: {
        Row: {
          id: string
          created_at: string
          tema_id: string
          enunciado: string
          tipo: 'multiple' | 'verdadero_falso'
          dificultad: 'facil' | 'media' | 'dificil'
          explicacion: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          tema_id: string
          enunciado: string
          tipo?: 'multiple' | 'verdadero_falso'
          dificultad?: 'facil' | 'media' | 'dificil'
          explicacion?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          tema_id?: string
          enunciado?: string
          tipo?: 'multiple' | 'verdadero_falso'
          dificultad?: 'facil' | 'media' | 'dificil'
          explicacion?: string | null
          metadata?: Json | null
        }
      }
      respuestas: {
        Row: {
          id: string
          created_at: string
          pregunta_id: string
          texto: string
          es_correcta: boolean
          orden: number
        }
        Insert: {
          id?: string
          created_at?: string
          pregunta_id: string
          texto: string
          es_correcta?: boolean
          orden: number
        }
        Update: {
          id?: string
          created_at?: string
          pregunta_id?: string
          texto?: string
          es_correcta?: boolean
          orden?: number
        }
      }
      tests: {
        Row: {
          id: string
          created_at: string
          user_id: string
          oposicion_id: string
          tipo: 'practica' | 'simulacro' | 'repaso'
          config: Json
          completed_at: string | null
          puntuacion: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          oposicion_id: string
          tipo?: 'practica' | 'simulacro' | 'repaso'
          config?: Json
          completed_at?: string | null
          puntuacion?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          oposicion_id?: string
          tipo?: 'practica' | 'simulacro' | 'repaso'
          config?: Json
          completed_at?: string | null
          puntuacion?: number | null
        }
      }
      test_respuestas: {
        Row: {
          id: string
          created_at: string
          test_id: string
          pregunta_id: string
          respuesta_id: string | null
          tiempo_ms: number
          es_correcta: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          test_id: string
          pregunta_id: string
          respuesta_id?: string | null
          tiempo_ms?: number
          es_correcta?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          test_id?: string
          pregunta_id?: string
          respuesta_id?: string | null
          tiempo_ms?: number
          es_correcta?: boolean
        }
      }
      user_oposiciones: {
        Row: {
          id: string
          created_at: string
          user_id: string
          oposicion_id: string
          fecha_inicio: string
          fecha_objetivo: string | null
          activa: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          oposicion_id: string
          fecha_inicio?: string
          fecha_objetivo?: string | null
          activa?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          oposicion_id?: string
          fecha_inicio?: string
          fecha_objetivo?: string | null
          activa?: boolean
        }
      }
      sesiones_estudio: {
        Row: {
          id: string
          created_at: string
          user_id: string
          oposicion_id: string
          inicio: string
          fin: string | null
          tipo_actividad: 'lectura' | 'test' | 'flashcards' | 'simulacro'
          duracion_minutos: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          oposicion_id: string
          inicio?: string
          fin?: string | null
          tipo_actividad: 'lectura' | 'test' | 'flashcards' | 'simulacro'
          duracion_minutos?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          oposicion_id?: string
          inicio?: string
          fin?: string | null
          tipo_actividad?: 'lectura' | 'test' | 'flashcards' | 'simulacro'
          duracion_minutos?: number | null
        }
      }
      metricas_diarias: {
        Row: {
          id: string
          created_at: string
          user_id: string
          oposicion_id: string
          fecha: string
          tiempo_total_minutos: number
          preguntas_total: number
          preguntas_correctas: number
          opometrics: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          oposicion_id: string
          fecha: string
          tiempo_total_minutos?: number
          preguntas_total?: number
          preguntas_correctas?: number
          opometrics?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          oposicion_id?: string
          fecha?: string
          tiempo_total_minutos?: number
          preguntas_total?: number
          preguntas_correctas?: number
          opometrics?: number
        }
      }
      progreso_temas: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          tema_id: string
          porcentaje_completado: number
          nivel_dominio: 'sin_empezar' | 'aprendiendo' | 'practicando' | 'dominado'
          ultima_revision: string | null
          proxima_revision: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          tema_id: string
          porcentaje_completado?: number
          nivel_dominio?: 'sin_empezar' | 'aprendiendo' | 'practicando' | 'dominado'
          ultima_revision?: string | null
          proxima_revision?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          tema_id?: string
          porcentaje_completado?: number
          nivel_dominio?: 'sin_empezar' | 'aprendiendo' | 'practicando' | 'dominado'
          ultima_revision?: string | null
          proxima_revision?: string | null
        }
      }
      alertas_abandono: {
        Row: {
          id: string
          created_at: string
          user_id: string
          tipo_alerta: 'inactividad' | 'caida_rendimiento' | 'patron_evasion' | 'racha_rota'
          nivel_riesgo: 'bajo' | 'medio' | 'alto'
          detectada_at: string
          resuelta_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          tipo_alerta: 'inactividad' | 'caida_rendimiento' | 'patron_evasion' | 'racha_rota'
          nivel_riesgo: 'bajo' | 'medio' | 'alto'
          detectada_at?: string
          resuelta_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          tipo_alerta?: 'inactividad' | 'caida_rendimiento' | 'patron_evasion' | 'racha_rota'
          nivel_riesgo?: 'bajo' | 'medio' | 'alto'
          detectada_at?: string
          resuelta_at?: string | null
          metadata?: Json | null
        }
      }
      intervenciones: {
        Row: {
          id: string
          created_at: string
          alerta_id: string
          tipo: 'email' | 'push' | 'in_app'
          contenido: string
          enviada_at: string
          interactuada_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          alerta_id: string
          tipo: 'email' | 'push' | 'in_app'
          contenido: string
          enviada_at?: string
          interactuada_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          alerta_id?: string
          tipo?: 'email' | 'push' | 'in_app'
          contenido?: string
          enviada_at?: string
          interactuada_at?: string | null
        }
      }
      flashcards: {
        Row: {
          id: string
          created_at: string
          user_id: string
          tema_id: string
          frente: string
          reverso: string
          caja: number
          proxima_revision: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          tema_id: string
          frente: string
          reverso: string
          caja?: number
          proxima_revision?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          tema_id?: string
          frente?: string
          reverso?: string
          caja?: number
          proxima_revision?: string
        }
      }
      flashcard_reviews: {
        Row: {
          id: string
          created_at: string
          flashcard_id: string
          acertada: boolean
          caja_anterior: number
          caja_nueva: number
        }
        Insert: {
          id?: string
          created_at?: string
          flashcard_id: string
          acertada: boolean
          caja_anterior: number
          caja_nueva: number
        }
        Update: {
          id?: string
          created_at?: string
          flashcard_id?: string
          acertada?: boolean
          caja_anterior?: number
          caja_nueva?: number
        }
      }
      logros: {
        Row: {
          id: string
          created_at: string
          nombre: string
          descripcion: string
          icono: string
          condicion: Json
          puntos: number
        }
        Insert: {
          id?: string
          created_at?: string
          nombre: string
          descripcion: string
          icono: string
          condicion: Json
          puntos?: number
        }
        Update: {
          id?: string
          created_at?: string
          nombre?: string
          descripcion?: string
          icono?: string
          condicion?: Json
          puntos?: number
        }
      }
      user_logros: {
        Row: {
          id: string
          created_at: string
          user_id: string
          logro_id: string
          desbloqueado_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          logro_id: string
          desbloqueado_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          logro_id?: string
          desbloqueado_at?: string
        }
      }
      rachas: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          dias_consecutivos: number
          mejor_racha: number
          ultima_actividad: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          dias_consecutivos?: number
          mejor_racha?: number
          ultima_actividad?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          dias_consecutivos?: number
          mejor_racha?: number
          ultima_actividad?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_opometrics: {
        Args: { p_user_id: string; p_oposicion_id: string }
        Returns: number
      }
      detectar_abandono: {
        Args: { p_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos de utilidad
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Tipos específicos comunes
export type Profile = Tables<'profiles'>
export type Oposicion = Tables<'oposiciones'>
export type Bloque = Tables<'bloques'>
export type Tema = Tables<'temas'>
export type Subtema = Tables<'subtemas'>
export type Pregunta = Tables<'preguntas'>
export type Respuesta = Tables<'respuestas'>
export type Test = Tables<'tests'>
export type TestRespuesta = Tables<'test_respuestas'>
export type UserOposicion = Tables<'user_oposiciones'>
export type SesionEstudio = Tables<'sesiones_estudio'>
export type MetricaDiaria = Tables<'metricas_diarias'>
export type ProgresoTema = Tables<'progreso_temas'>
export type AlertaAbandono = Tables<'alertas_abandono'>
export type Intervencion = Tables<'intervenciones'>
export type Flashcard = Tables<'flashcards'>
export type FlashcardReview = Tables<'flashcard_reviews'>
export type Logro = Tables<'logros'>
export type UserLogro = Tables<'user_logros'>
export type Racha = Tables<'rachas'>
