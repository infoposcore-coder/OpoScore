-- ===========================================
-- OpoScore - Billing & Stripe Integration
-- ===========================================
-- Migracion 8: Sistema de suscripciones con Stripe

-- ===========================================
-- TABLA: customers (Relacion usuario-Stripe)
-- ===========================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    UNIQUE(user_id)
);

-- ===========================================
-- TABLA: products (Productos de Stripe sincronizados)
-- ===========================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, -- stripe product_id
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
    -- metadata incluira: { "plan_type": "premium" | "elite" }
);

-- ===========================================
-- TABLA: prices (Precios de Stripe sincronizados)
-- ===========================================
CREATE TABLE IF NOT EXISTS prices (
    id TEXT PRIMARY KEY, -- stripe price_id
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    currency TEXT DEFAULT 'eur' NOT NULL,
    unit_amount INTEGER, -- en centimos (1499 = 14.99 EUR)
    type TEXT DEFAULT 'recurring' CHECK (type IN ('one_time', 'recurring')),
    interval TEXT CHECK (interval IN ('day', 'week', 'month', 'year')),
    interval_count INTEGER DEFAULT 1,
    trial_period_days INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- TABLA: subscriptions (Suscripciones activas)
-- ===========================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY, -- stripe subscription_id
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN (
        'trialing',
        'active',
        'canceled',
        'incomplete',
        'incomplete_expired',
        'past_due',
        'unpaid',
        'paused'
    )),
    price_id TEXT REFERENCES prices(id),
    quantity INTEGER DEFAULT 1,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancel_at TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- INDICES para rendimiento
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_customers_user ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_prices_product ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_active ON prices(active);

-- ===========================================
-- FUNCION: Obtener plan activo del usuario
-- ===========================================
CREATE OR REPLACE FUNCTION get_user_plan(p_user_id UUID)
RETURNS TABLE (
    plan_type TEXT,
    status TEXT,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(
            (pr.metadata->>'plan_type')::TEXT,
            'free'
        ) as plan_type,
        s.status,
        s.current_period_end,
        s.cancel_at_period_end
    FROM subscriptions s
    LEFT JOIN prices p ON s.price_id = p.id
    LEFT JOIN products pr ON p.product_id = pr.id
    WHERE s.user_id = p_user_id
      AND s.status IN ('active', 'trialing')
    ORDER BY s.created_at DESC
    LIMIT 1;

    -- Si no hay suscripcion, devolver plan gratuito
    IF NOT FOUND THEN
        RETURN QUERY SELECT
            'free'::TEXT as plan_type,
            'free'::TEXT as status,
            NULL::TIMESTAMPTZ as current_period_end,
            FALSE as cancel_at_period_end;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- FUNCION: Verificar acceso a feature
-- ===========================================
CREATE OR REPLACE FUNCTION has_feature_access(
    p_user_id UUID,
    p_feature TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_plan_type TEXT;
BEGIN
    SELECT plan_type INTO v_plan_type
    FROM get_user_plan(p_user_id);

    -- Matriz de acceso a features
    -- Premium incluye tutor_ia (decision del usuario)
    RETURN CASE
        WHEN p_feature = 'simulacros' THEN
            v_plan_type IN ('premium', 'elite')
        WHEN p_feature = 'tutor_ia' THEN
            v_plan_type IN ('premium', 'elite')
        WHEN p_feature = 'tests_ilimitados' THEN
            v_plan_type IN ('premium', 'elite')
        WHEN p_feature = 'estadisticas_avanzadas' THEN
            v_plan_type IN ('premium', 'elite')
        WHEN p_feature = 'flashcards_ia' THEN
            v_plan_type IN ('premium', 'elite')
        WHEN p_feature = 'soporte_prioritario' THEN
            v_plan_type = 'elite'
        WHEN p_feature = 'sesiones_1a1' THEN
            v_plan_type = 'elite'
        ELSE
            TRUE -- Features basicas para todos
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- RLS Policies
-- ===========================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Customers: Usuario solo ve su propio registro
CREATE POLICY "Users can view own customer" ON customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage customers" ON customers
    FOR ALL USING (auth.role() = 'service_role');

-- Subscriptions: Usuario solo ve sus suscripciones
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Prices: Todos pueden ver precios activos
CREATE POLICY "Anyone can view active prices" ON prices
    FOR SELECT USING (active = TRUE);

CREATE POLICY "Service role can manage prices" ON prices
    FOR ALL USING (auth.role() = 'service_role');

-- Products: Todos pueden ver productos activos
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (active = TRUE);

CREATE POLICY "Service role can manage products" ON products
    FOR ALL USING (auth.role() = 'service_role');

-- ===========================================
-- Trigger: Actualizar updated_at
-- ===========================================
CREATE OR REPLACE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
