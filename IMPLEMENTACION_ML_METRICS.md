# Implementación Sistema de Métricas ML - OpoScore

## Resumen
Implementación completa de sistema de métricas basadas en Machine Learning para diferentes niveles de suscripción.

**Fecha inicio:** 2026-01-18
**Estado:** En progreso

---

## Fase 1: Base de Datos y Tracking

### 1.1 Nuevas Tablas
- [ ] `user_sessions` - Sesiones de estudio
- [ ] `user_responses` - Cada respuesta individual con metadata
- [ ] `user_daily_stats` - Estadísticas agregadas diarias
- [ ] `user_predictions` - Cache de predicciones ML
- [ ] `historical_candidates` - Datos históricos para entrenar modelo

### 1.2 Modificaciones Tablas Existentes
- [ ] Añadir campos a `profiles` para métricas agregadas
- [ ] Añadir campos a `tests` para tracking detallado

### 1.3 Funciones SQL
- [ ] Función calcular ranking percentil
- [ ] Función agregar estadísticas diarias
- [ ] Trigger actualizar stats en cada respuesta

---

## Fase 2: API y Backend

### 2.1 Endpoints API
- [ ] `GET /api/stats/basic` - Stats básicas (todos)
- [ ] `GET /api/stats/ranking` - Ranking usuario (Básico+)
- [ ] `GET /api/stats/predictions` - Predicciones ML (Pro+)
- [ ] `GET /api/stats/recommendations` - Recomendaciones IA (Elite)
- [ ] `GET /api/stats/detailed` - Stats completas por tema (Pro+)

### 2.2 Servicios
- [ ] `StatsService` - Cálculo de estadísticas
- [ ] `RankingService` - Sistema de ranking
- [ ] `PredictionService` - Predicciones ML
- [ ] `RecommendationService` - Recomendaciones personalizadas

### 2.3 Modelo ML
- [ ] Script Python para entrenar modelo
- [ ] Exportar modelo a formato usable en JS
- [ ] Implementar inferencia en Edge/Serverless

---

## Fase 3: Componentes Frontend

### 3.1 Componentes de Métricas
- [ ] `<BasicStats />` - Estadísticas básicas (Gratis)
- [ ] `<ProgressChart />` - Gráfico de evolución (Básico+)
- [ ] `<RankingCard />` - Posición en ranking (Básico+)
- [ ] `<PredictionGauge />` - Probabilidad de aprobar (Pro+)
- [ ] `<WeaknessAnalysis />` - Análisis puntos débiles (Pro+)
- [ ] `<ComparisonChart />` - Comparativa por bloques (Pro+)
- [ ] `<StudyPlanML />` - Plan estudio generado (Elite)
- [ ] `<PredictorQuestions />` - Predictor preguntas frecuentes (Elite)
- [ ] `<DetailedRanking />` - Ranking detallado (Elite)
- [ ] `<TimeEstimator />` - Estimación temporal (Elite)

### 3.2 Páginas
- [ ] `/progreso` - Rediseñar con nuevas métricas
- [ ] `/dashboard` - Integrar widgets de métricas
- [ ] `/estadisticas` - Nueva página dedicada (Pro+)

### 3.3 Hooks
- [ ] `useStats()` - Hook para estadísticas
- [ ] `useRanking()` - Hook para ranking
- [ ] `usePredictions()` - Hook para predicciones
- [ ] `useRecommendations()` - Hook para recomendaciones

---

## Fase 4: Lógica de Negocio

### 4.1 Control de Acceso por Plan
- [ ] Middleware verificar plan para cada endpoint
- [ ] Componentes con fallback "Upgrade to unlock"
- [ ] Blur/Lock para features no disponibles

### 4.2 Tracking de Actividad
- [ ] Tracker de tiempo en página
- [ ] Tracker de respuestas con timestamp
- [ ] Tracker de sesiones de estudio

---

## Fase 5: Testing y Validación

### 5.1 Tests
- [ ] Tests unitarios servicios
- [ ] Tests integración API
- [ ] Tests E2E flujo completo

### 5.2 Validación Manual
- [ ] Probar como usuario Gratuito
- [ ] Probar como usuario Básico
- [ ] Probar como usuario Pro
- [ ] Probar como usuario Elite
- [ ] Verificar restricciones de plan

---

## Fase 6: Datos Iniciales

### 6.1 Seed Data
- [ ] Generar datos históricos simulados para ML
- [ ] Popular rankings iniciales
- [ ] Crear baseline de comparación

---

## Progreso Detallado

### Día 1 (2026-01-18)
| Hora | Tarea | Estado |
|------|-------|--------|
| -- | Crear documento tracking | ✅ |
| -- | Crear migración SQL tablas | ⏳ |
| -- | Implementar tracking responses | ⏳ |
| -- | Crear API stats básicas | ⏳ |
| -- | Componente BasicStats | ⏳ |
| -- | Componente ProgressChart | ⏳ |
| -- | Componente RankingCard | ⏳ |
| -- | Componente PredictionGauge | ⏳ |
| -- | Integrar en /progreso | ⏳ |
| -- | Testing completo | ⏳ |

---

## Notas Técnicas

### Stack
- **DB:** Supabase (PostgreSQL)
- **Backend:** Next.js API Routes + Edge Functions
- **ML:** Modelo simple en JS (para MVP), Python para entrenamiento
- **Frontend:** React + Recharts para gráficos

### Modelo ML Simplificado (MVP)
Para el MVP, usaremos un modelo basado en reglas + regresión simple:
- Peso por % aciertos: 40%
- Peso por consistencia: 20%
- Peso por cobertura temario: 25%
- Peso por simulacros: 15%

### Fórmula Ranking
```
percentil = (usuarios_por_debajo / total_usuarios) * 100
```

---

## Checklist Final

- [ ] Todas las tablas creadas
- [ ] Todos los endpoints funcionando
- [ ] Todos los componentes renderizando
- [ ] Control de acceso por plan verificado
- [ ] Tracking funcionando correctamente
- [ ] Métricas calculándose en tiempo real
- [ ] UI/UX pulido
- [ ] Sin errores en consola
- [ ] Performance aceptable (<2s carga)
- [ ] Mobile responsive
