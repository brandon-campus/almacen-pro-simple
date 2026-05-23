# AlmacénPro — Documento Maestro del Proyecto

> **Versión:** 1.0  
> **Fecha:** Abril 2026  
> **Autor:** Brandon Candia  
> **Estado:** Pre-desarrollo — MVP en definición

---

## 1. El Problema

Los almacenes barriales en Argentina representan uno de los comercios más comunes del país, con más de **40.000 locales estimados solo en el conurbano bonaerense**. Sin embargo, la gran mayoría opera sin ningún sistema de gestión: registran ventas en cuadernos, manejan el stock de memoria y no tienen visibilidad sobre si su negocio gana o pierde plata.

Esto genera un ciclo de estancamiento: sin datos, no hay decisiones. Sin decisiones, no hay crecimiento.

Los supermercados como Día y Carrefour tienen sistemas de miles de dólares para controlar exactamente esto. El almacenero barrial, no tiene nada.

**AlmacénPro** es la solución diseñada específicamente para este segmento: simple, mobile-first, barata y en español rioplatense.

---

## 2. La Solución

Una plataforma web + mobile que permite al dueño de un almacén barrial:

- Registrar cada venta del día con pocos toques
- Controlar el stock en tiempo real
- Ver un resumen financiero simple (entradas, salidas, resultado)
- Gestionar proveedores y gastos
- Tomar decisiones con datos, no con intuición

---

## 3. Usuario Objetivo

### Usuario primario
**Dueño de almacén barrial** en Buenos Aires y GBA.

**Perfil:**
- 35–60 años
- Celular Android (uso básico)
- Puede tener una computadora en el local
- No tiene experiencia con software de gestión
- Registra ventas en cuaderno o de memoria
- Trabaja 10–14 horas por día, 6–7 días a la semana

### Usuarios secundarios (fase 2+)
- Almacenes de otras provincias argentinas
- Kioscos y verdulerías barriales
- Pequeños minimercados familiares

---

## 4. Propuesta de Valor

> "Lo que Día y Carrefour usan para crecer, ahora disponible para tu almacén, por menos de lo que ganás en una hora."

- **Simple:** Interfaz diseñada para no-técnicos. Sin capacitación.
- **Rápido:** Registrar una venta en menos de 10 segundos.
- **Accesible:** Funciona desde celular sin instalar nada (PWA).
- **Barato:** $5 USD/mes. Menos que un kilo de asado.
- **Local:** En español rioplatense, pensado para el mercado argentino.

---

## 5. Funcionalidades

### MVP — Fase 1 (semanas 1–3)

#### Módulo 1: Caja del Día ⭐ (prioridad máxima)
- Registrar venta rápida: producto + cantidad + precio
- Total acumulado del día en tiempo real
- Historial de ventas por día, semana, mes
- Cierre de caja diario con resumen

#### Módulo 2: Stock
- Alta de productos con nombre, precio de costo y precio de venta
- Descuento automático de stock al registrar venta
- Alerta de stock bajo (umbral configurable por producto)
- Vista de inventario actual

#### Módulo 3: Resumen Financiero Simple
- Total de ingresos del día / semana / mes
- Registro de gastos y compras a proveedores
- Resultado neto (verde / rojo)
- Gráfico simple de evolución

### Fase 2 (mes 2–3)
- Gestión de proveedores (contacto, historial de compras, deuda)
- Fiado / cuentas corrientes de clientes
- Exportar reportes en PDF
- Multi-usuario (empleado + dueño)

### Fase 3 (mes 4+)
- Código de barras (escaneo con cámara del celular)
- Alertas de vencimiento de productos
- Comparación de precios entre proveedores
- App nativa Android

---

## 6. Stack Técnico

### Frontend Web
- **Framework:** React + TypeScript
- **Builder:** Lovable (prototipo) → Antigravity o Cursor (iteración)
- **Estilos:** Tailwind CSS
- **Deploy:** Vercel

### Mobile
- **Fase 1:** PWA (Progressive Web App) — funciona desde el navegador del celular sin instalar nada
- **Fase 2+:** App nativa Android (React Native o Expo)

### Backend & Base de Datos
- **BaaS:** Supabase
  - Auth (multi-tenant: cada almacén es una cuenta independiente)
  - PostgreSQL para datos de ventas, stock, gastos
  - Row Level Security (RLS) para aislar datos por almacén
  - Realtime para actualización de stock en tiempo real

### Integraciones (fase 2+)
- **Pagos:** MercadoPago (suscripción en ARS) + Stripe (suscripción en USD)
- **Notificaciones:** WhatsApp API (alertas de stock bajo)
- **Automatizaciones:** n8n

### Arquitectura de Multi-tenancy
Cada almacén = 1 organización en Supabase.
Aislamiento de datos por `organization_id` en todas las tablas con RLS.

---

## 7. Modelo de Base de Datos (esquema inicial)

```sql
-- Organizaciones (almacenes)
organizations (id, name, owner_id, created_at, plan)

-- Productos
products (id, org_id, name, sku, cost_price, sale_price, stock_quantity, min_stock, category)

-- Ventas
sales (id, org_id, date, total, notes)
sale_items (id, sale_id, product_id, quantity, unit_price)

-- Gastos
expenses (id, org_id, date, amount, category, description, supplier_id)

-- Proveedores
suppliers (id, org_id, name, phone, notes)

-- Usuarios
users (id, org_id, email, role) -- roles: owner | employee
```

---

## 8. Roadmap de Desarrollo (8 etapas)

| Etapa | Nombre | Entregable | Tiempo estimado |
|-------|--------|------------|-----------------|
| 1 | Idea & Validación | Documento maestro + usuario beta confirmado | ✅ Hecho |
| 2 | Arquitectura | Esquema DB, flujos de usuario, wireframes | Semana 1 |
| 3 | Diseño UI | Pantallas en Figma o directamente en Lovable | Semana 1–2 |
| 4 | Base de Datos | Supabase configurado con schema + auth | Semana 2 |
| 5 | Desarrollo MVP | Caja del día + stock básico funcionando | Semana 2–3 |
| 6 | Integraciones | Pagos (MercadoPago), notificaciones | Semana 4 |
| 7 | Deploy | Vercel + dominio + onboarding del beta | Semana 4 |
| 8 | Adquisición | Primeros 10 clientes pagos | Mes 2 |

---

## 9. Modelo de Negocio

### Pricing
| Plan | Precio | Incluye |
|------|--------|---------|
| Trial | Gratis 14 días | Todo el MVP sin límites |
| Básico | $5 USD/mes | 1 usuario, hasta 500 productos |
| Pro | $10 USD/mes | Multi-usuario, reportes avanzados, soporte |

### Métodos de cobro
- **ARS:** MercadoPago (suscripción automática)
- **USD:** Stripe o Lemon Squeezy

### Proyección de ingresos
| Etapa | Almacenes | MRR |
|-------|-----------|-----|
| Beta (mes 1) | 1 gratis | $0 |
| Lanzamiento (mes 2) | 10 | $50 USD |
| 6 meses | 100 | $500 USD |
| 12 meses | 500 | $2.500 USD |
| 24 meses | 2.000 | $10.000 USD |

---

## 10. Go-To-Market

### Fase 1 — Validación local (mes 1–2)
- Usuario beta: almacén de cuñado en Berazategui
- Objetivo: validar que lo usan a diario sin soporte
- Métrica clave: ¿registra ventas todos los días?

### Fase 2 — Expansión barrial (mes 2–3)
- Visitar almacenes del mismo barrio con demo en mano
- Ofrecer primer mes gratis a cambio de feedback
- Boca a boca entre almaceneros (comunidades de WhatsApp)

### Fase 3 — Digital (mes 3+)
- TikTok y Reels mostrando "cómo un almacén dejó el cuaderno"
- Facebook Ads geolocalizados (GBA, CABA, Córdoba, Rosario)
- SEO: "sistema para almacén", "control de stock almacén Argentina"

### Canal principal de adquisición
WhatsApp directo + demostración en el local. El almacenero confía en lo que ve y toca, no en lo que lee.

---

## 11. Competencia

| Competidor | Problema |
|-----------|----------|
| Excel / Google Sheets | Complejo, no mobile-friendly, requiere conocimiento |
| Sistemas de facturación (Tucan, Siigo) | Caros, complejos, pensados para empresas |
| Apps genéricas de stock | En inglés, no adaptadas al almacén argentino |
| Cuaderno | Sin datos, sin historial, sin alertas |

**Ventaja diferencial de AlmacénPro:** diseñado desde cero para el almacenero argentino. No es una app adaptada. Es la solución nativa.

---

## 12. Métricas Clave (KPIs)

### Producto
- DAU/MAU (usuarios activos diarios vs. mensuales)
- Ventas registradas por día por usuario
- % de usuarios que usan stock activamente
- Churn mensual (objetivo: < 5%)

### Negocio
- MRR (Monthly Recurring Revenue)
- CAC (Costo de adquisición por cliente)
- LTV (valor de vida del cliente)
- Conversión trial → pago (objetivo: > 30%)

---

## 13. Próximos Pasos Inmediatos

- [ ] Confirmar con cuñado que acepta ser beta tester activo
- [ ] Crear proyecto en Supabase con schema inicial
- [ ] Construir pantalla de caja del día en Lovable
- [ ] Primera sesión de uso real en el almacén
- [ ] Iterar basado en feedback de uso real
- [ ] Agregar módulo de stock
- [ ] Configurar MercadoPago para cobro de suscripción

---

## 14. Notas del Fundador

Este proyecto nació de un problema real y cercano. El almacén de mi cuñado en Berazategui lleva más de 5 años sin crecer, no por falta de esfuerzo sino por falta de información. Si AlmacénPro lo ayuda a él, puede ayudar a decenas de miles de almaceneros en todo el país.

La estrategia es simple: **construir despacio con un usuario real, antes de escalar rápido con muchos.**

---

*Documento generado como base para desarrollo con vibe coding. Actualizar con cada iteración del producto.*