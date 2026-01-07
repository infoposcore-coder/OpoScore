-- ===========================================
-- OpoScore - Sistema de Flashcards (Leitner)
-- ===========================================
-- Migración 4: Flashcards y sistema de repaso espaciado

-- ===========================================
-- FLASHCARDS
-- ===========================================

-- Flashcards de los usuarios
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    frente TEXT NOT NULL, -- Pregunta/Concepto
    reverso TEXT NOT NULL, -- Respuesta/Definición
    caja INTEGER DEFAULT 1 CHECK (caja >= 1 AND caja <= 5) NOT NULL, -- Caja Leitner (1-5)
    proxima_revision DATE DEFAULT CURRENT_DATE NOT NULL,
    total_revisiones INTEGER DEFAULT 0 NOT NULL,
    aciertos_consecutivos INTEGER DEFAULT 0 NOT NULL
);

-- Historial de revisiones de flashcards
CREATE TABLE flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    acertada BOOLEAN NOT NULL,
    caja_anterior INTEGER NOT NULL,
    caja_nueva INTEGER NOT NULL,
    tiempo_respuesta_ms INTEGER -- tiempo que tardó en responder
);

-- Índices
CREATE INDEX idx_flashcards_user ON flashcards(user_id);
CREATE INDEX idx_flashcards_tema ON flashcards(tema_id);
CREATE INDEX idx_flashcards_pendientes ON flashcards(user_id, proxima_revision) WHERE proxima_revision <= CURRENT_DATE;
CREATE INDEX idx_flashcard_reviews_flashcard ON flashcard_reviews(flashcard_id);
