# 🧪 SMOKE TEST — AlmacénPro
**Fecha:** ___23/05/2026_____________  
**Testeador:** ___Brandon Candia_____________  
**Versión:** ___1.0_____________  
**Ambiente:** ☐ Local  
✅ Staging  
☐ Production  
**URL testeada:** ___localhost:8080

---

## A) AUTENTICACIÓN Y SEGURIDAD

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 1 | Puedo crear una cuenta nueva con email y contraseña | ✅ | |
| 2 | Al registrarme, se crea automáticamente mi organización (almacén) en Supabase | ✅ | |
| 3 | Puedo iniciar sesión con una cuenta existente | ☐ | |
| 4 | Puedo cerrar sesión correctamente | ☐ | |
| 5 | Las credenciales incorrectas muestran un mensaje de error visible | ☐ | |
| 6 | La sesión persiste al recargar la página (no me desloguea) | ☐ | |
| 7 | Si intento entrar a /dashboard sin sesión, me redirige al login | ☐ | |
| 8 | No puedo acceder a rutas protegidas escribiendo la URL directamente | ☐ | |

---

## B) MÓDULO: CAJA DEL DÍA

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 9 | Puedo buscar un producto por nombre al registrar una venta | ☐ | |
| 10 | El precio se completa automáticamente al seleccionar el producto | ☐ | |
| 11 | Puedo seleccionar la cantidad y se calcula el total correctamente | ☐ | |
| 12 | Al confirmar la venta, aparece en el historial del día | ☐ | |
| 13 | Al confirmar la venta, el stock del producto baja en tiempo real | ☐ | |
| 14 | Puedo anular una venta registrada por error | ☐ | |
| 15 | Al anular una venta, el stock del producto se restaura automáticamente | ☐ | |
| 16 | El total acumulado del día se actualiza con cada venta registrada | ☐ | |
| 17 | El historial muestra la hora y los productos de cada venta | ☐ | |

---

## C) MÓDULO: STOCK

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 18 | Puedo agregar un producto nuevo con todos sus campos (nombre, precio costo, precio venta, stock, stock mínimo, categoría) | ☐ | |
| 19 | El producto nuevo aparece en la lista inmediatamente | ☐ | |
| 20 | Puedo editar un producto existente (ej: cambiar el precio de venta) | ☐ | |
| 21 | Los cambios de edición se guardan y se reflejan en pantalla | ☐ | |
| 22 | Puedo eliminar un producto con confirmación previa | ☐ | |
| 23 | El buscador filtra productos por nombre en tiempo real | ☐ | |
| 24 | Los productos con stock por debajo del mínimo muestran el badge de alerta "Poco stock" | ☐ | |
| 25 | Los datos del stock persisten al recargar la página | ☐ | |

---

## D) MÓDULO: GASTOS

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 26 | Puedo registrar un gasto con monto, categoría y descripción | ☐ | |
| 27 | El gasto aparece en el listado inmediatamente después de guardarlo | ☐ | |
| 28 | Puedo filtrar gastos por categoría (Proveedores, Servicios, Otros) | ☐ | |
| 29 | Puedo eliminar un gasto con confirmación previa mediante modal | ☐ | |
| 30 | Los gastos persisten al recargar la página | ☐ | |

---

## E) MÓDULO: DASHBOARD Y RESUMEN

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 31 | El dashboard muestra el total de "Vendí hoy" con datos reales | ☐ | |
| 32 | El dashboard muestra el total de "Gasté hoy" con datos reales | ☐ | |
| 33 | El resultado neto del día es correcto (ventas - gastos) | ☐ | |
| 34 | El indicador visual es verde cuando el resultado es positivo | ☐ | |
| 35 | El indicador visual es rojo cuando el resultado es negativo | ☐ | |
| 36 | Al registrar una venta nueva, el dashboard se actualiza sin recargar | ☐ | |
| 37 | El filtro de tiempo funciona: Hoy / Esta semana / Este mes | ☐ | |
| 38 | El gráfico de barras de ventas semanales carga y muestra datos reales | ☐ | |

---

## F) MÓDULO: CONSEJERO IA

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 39 | El módulo Consejero carga correctamente desde el menú | ☐ | |
| 40 | Aparece el mensaje de bienvenida al abrir el chat | ☐ | |
| 41 | Puedo escribir una pregunta y enviarla | ☐ | |
| 42 | El agente muestra el indicador "escribiendo..." mientras procesa | ☐ | |
| 43 | El agente responde con datos reales del almacén (no datos genéricos) | ☐ | |
| 44 | La pregunta "¿Cuánto vendí hoy?" devuelve el monto correcto | ☐ | |
| 45 | La pregunta "¿Qué me falta reponer?" lista los productos con stock bajo | ☐ | |
| 46 | La pregunta "¿Cuál fue mi mejor producto?" responde con datos reales | ☐ | |
| 47 | El webhook de n8n responde correctamente (no hay error 500 o timeout) | ☐ | |
| 48 | El historial de la conversación se mantiene visible durante la sesión | ☐ | |

---

## G) BASE DE DATOS Y SEGURIDAD MULTI-TENANT

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 49 | Los datos se guardan correctamente en Supabase (verificar en el dashboard de Supabase) | ☐ | |
| 50 | Un almacén no puede ver los datos de otro almacén (RLS activo) | ☐ | |
| 51 | La función `decrement_stock` descuenta el stock correctamente al vender | ☐ | |
| 52 | La función `increment_stock` restaura el stock correctamente al anular | ☐ | |
| 53 | No hay errores críticos en los logs de Supabase | ☐ | |

---

## H) NAVEGACIÓN Y UX GENERAL

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 54 | Todos los módulos del menú navegan correctamente (Caja, Stock, Gastos, Resumen, Consejero) | ☐ | |
| 55 | El botón "atrás" del navegador funciona sin romper la app | ☐ | |
| 56 | No hay páginas 404 en ninguna ruta principal | ☐ | |
| 57 | Los formularios muestran validación visible cuando falta un campo requerido | ☐ | |
| 58 | Aparece un mensaje de éxito (toast) al confirmar una venta o guardar un gasto | ☐ | |
| 59 | La app se ve correctamente en mobile (menú inferior visible, botones tocables) | ☐ | |
| 60 | La app se ve correctamente en desktop | ☐ | |

---

## I) CONSOLA Y ERRORES TÉCNICOS

| # | Caso a testear | ☐ Pasa / ☐ Falla | Notas |
|---|----------------|------------------|-------|
| 61 | No hay errores críticos en la consola del navegador (F12 → Console) | ☐ | |
| 62 | No hay warnings rojos importantes en consola | ☐ | |
| 63 | Las requests a Supabase responden con 200/201 (no 400/500) | ☐ | |
| 64 | La request al webhook de n8n responde correctamente | ☐ | |
| 65 | No hay errores de CORS en ninguna llamada | ☐ | |

---

## RESULTADO FINAL

**Total de casos:** 65  
**Casos que pasan:** ______  
**Casos que fallan:** ______  

### Veredicto:

☐ ✅ **PASA** — Todos los casos críticos (A, B, C, D) funcionan. Puedo continuar al desarrollo de Fase 2.

☐ ⚠️ **PASA CON OBSERVACIONES** — Los módulos core funcionan pero hay bugs menores a corregir.

☐ ❌ **FALLA** — Hay bugs críticos que bloquean el uso real. Debo resolverlos antes de continuar.

---

## BUGS ENCONTRADOS

| # | Módulo | Descripción del bug | Severidad | Estado |
|---|--------|---------------------|-----------|--------|
| 1 | | | 🔴 Crítico / 🟠 Alto / 🟡 Medio / ⚪ Bajo | ☐ Abierto / ☐ Resuelto |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

---

## NOTAS ADICIONALES DEL TESTEADOR

```
(Escribir acá observaciones generales, comportamientos inesperados 
o sugerencias de mejora que no entran en ningún caso de arriba)




```

---

*AlmacénPro — Documento de Testing v1.0 — Fase 1 MVP*