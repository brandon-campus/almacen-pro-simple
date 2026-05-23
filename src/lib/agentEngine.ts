import { Producto, Venta, Gasto } from '../data/mockData';

export interface AgentData {
  productos: Producto[];
  ventas: Venta[];
  gastos: Gasto[];
}

function fmt(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}

function contains(msg: string, keywords: string[]): boolean {
  const lower = msg.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

// ── Helpers de cálculo ────────────────────────────────────────────────────────

function ventasPorPeriodo(ventas: Venta[], periodo: string): Venta[] {
  return ventas.filter(v => v.fecha === periodo);
}

function totalVentas(ventas: Venta[]): number {
  return ventas.reduce((s, v) => s + v.monto, 0);
}

function totalGastos(gastos: Gasto[]): number {
  return gastos.reduce((s, g) => s + g.monto, 0);
}

// Ventas agrupadas por producto, con cantidad total y monto
function topProductos(ventas: Venta[]): { producto: string; cantidad: number; monto: number }[] {
  const map: Record<string, { cantidad: number; monto: number }> = {};
  ventas.forEach(v => {
    if (!map[v.producto]) map[v.producto] = { cantidad: 0, monto: 0 };
    map[v.producto].cantidad += v.cantidad;
    map[v.producto].monto += v.monto;
  });
  return Object.entries(map)
    .map(([producto, data]) => ({ producto, ...data }))
    .sort((a, b) => b.monto - a.monto);
}

// Ventas agrupadas por hora (franja)
function horasConMasVentas(ventas: Venta[]): { hora: string; total: number }[] {
  const map: Record<string, number> = {};
  ventas.forEach(v => {
    const h = v.hora.split(':')[0] + ':00';
    map[h] = (map[h] || 0) + v.monto;
  });
  return Object.entries(map)
    .map(([hora, total]) => ({ hora, total }))
    .sort((a, b) => b.total - a.total);
}

// Margen de ganancia promedio de los productos
function margenPromedio(productos: Producto[]): number {
  if (!productos.length) return 0;
  const total = productos.reduce((s, p) => {
    const margen = ((p.precioVenta - p.precioCosto) / p.precioVenta) * 100;
    return s + margen;
  }, 0);
  return Math.round(total / productos.length);
}

// Producto con mayor margen
function mejorMargen(productos: Producto[]): Producto {
  return [...productos].sort((a, b) => {
    const mA = (a.precioVenta - a.precioCosto) / a.precioVenta;
    const mB = (b.precioVenta - b.precioCosto) / b.precioVenta;
    return mB - mA;
  })[0];
}

// ── Resolución de intenciones ────────────────────────────────────────────────

export function resolveIntent(msg: string, data: AgentData): string {
  const { productos, ventas, gastos } = data;

  // ── VENTAS HOY ────────────────────────────────────────────────────────────
  if (contains(msg, ['vendí hoy', 'vendi hoy', 'vendiste hoy', 'venta hoy', 'ventas hoy', 'vendido hoy', 'cuánto vendí hoy', 'cuanto vendi hoy'])) {
    const vHoy = ventasPorPeriodo(ventas, 'hoy');
    const total = totalVentas(vHoy);
    if (!vHoy.length) return 'Hoy todavía no registraste ninguna venta. ¡Ánimo, que el día recién empieza! 🌅';
    const ticket = Math.round(total / vHoy.length);
    const top = topProductos(vHoy)[0];
    return `Hoy vendiste ${fmt(total)} en ${vHoy.length} transacciones 🛒\nTu ticket promedio fue de ${fmt(ticket)}.\nEl producto estrella del día fue ${top?.producto ?? '(sin datos)'}. ¡Seguí así!`;
  }

  // ── VENTAS SEMANA ─────────────────────────────────────────────────────────
  if (contains(msg, ['vendí esta semana', 'vendi esta semana', 'ventas semana', 'semana', 'semanal'])
    && contains(msg, ['vendí', 'vendi', 'venta', 'vendiste', 'cuánto', 'cuanto'])) {
    const vHoy = ventasPorPeriodo(ventas, 'hoy');
    const vAyer = ventasPorPeriodo(ventas, 'ayer');
    const baseWeek = 61600; // mock static
    const total = baseWeek + totalVentas(vHoy) + totalVentas(vAyer);
    return `Esta semana llevas ${fmt(total)} en ventas 📅\nTu mejor día fue el sábado con ${fmt(14500)}.\nSi mantenés este ritmo, vas a cerrar el mes muy bien.`;
  }

  // ── VENTAS MES ────────────────────────────────────────────────────────────
  if (contains(msg, ['vendí este mes', 'vendi este mes', 'ventas mes', 'mensual', 'del mes'])
    && contains(msg, ['vendí', 'vendi', 'venta', 'vendiste', 'cuánto', 'cuanto'])) {
    const vHoy = ventasPorPeriodo(ventas, 'hoy');
    const total = 245000 + 61600 + totalVentas(vHoy);
    return `Este mes vendiste ${fmt(total)} 🗓️\nVas muy bien comparado con el mes anterior.\nRecordá revisar el stock para no quedarte sin mercadería en los días pico.`;
  }

  // ── MEJOR DÍA DE VENTAS ───────────────────────────────────────────────────
  if (contains(msg, ['mejor día', 'mejor dia', 'mejor día de ventas', 'más vendí', 'mas vendi'])) {
    return `Tu mejor día de ventas fue el sábado 🏆\nVendiste ${fmt(14500)} ese día.\nLos fines de semana son tu punto fuerte, no te quedes sin stock para el viernes/sábado.`;
  }

  // ── HORA CON MÁS VENTAS ───────────────────────────────────────────────────
  if (contains(msg, ['hora', 'qué hora', 'que hora', 'cuando vendo más', 'cuándo vendo', 'a qué hora', 'a que hora'])) {
    const horas = horasConMasVentas(ventas);
    const top = horas[0];
    if (top) {
      return `Vendés más alrededor de las ${top.hora} 🕙\nEse es tu horario pico, asegurate de tener el local bien surtido a esa hora.\nTambién tenés buena actividad a media mañana.`;
    }
    return `Todavía no hay suficientes datos para detectar tu hora pico.\nRegistrá más ventas con la hora y te digo cuándo vendés más 📊`;
  }

  // ── GANANCIAS HOY ────────────────────────────────────────────────────────
  if (contains(msg, ['gané hoy', 'gane hoy', 'ganancia hoy', 'resultado hoy', 'cuánto gané hoy', 'cuanto gane hoy'])) {
    const vHoy = ventasPorPeriodo(ventas, 'hoy');
    const gHoy = gastos.filter(g => g.fecha === 'hoy');
    const totalV = totalVentas(vHoy);
    const totalG = totalGastos(gHoy);
    const resultado = totalV - totalG;
    if (resultado >= 0) {
      return `Hoy cerrás en verde ✅\nVendiste ${fmt(totalV)} · Gastaste ${fmt(totalG)}\nTe quedaron ${fmt(resultado)} limpios por ahora.\n¡Bien hecho, seguí así!`;
    }
    return `Hoy estás en rojo por ahora 🔴\nVendiste ${fmt(totalV)} pero gastaste ${fmt(totalG)}\nTe faltan ${fmt(Math.abs(resultado))} para cubrir los gastos de hoy.\nVeamos si la tarde lo da vuelta.`;
  }

  // ── GANANCIAS SEMANA ─────────────────────────────────────────────────────
  if (contains(msg, ['gané', 'gane', 'perdí', 'perdi', 'resultado', 'ganancia'])
    && contains(msg, ['semana', 'semanal'])) {
    const vHoy = ventasPorPeriodo(ventas, 'hoy');
    const gHoy = gastos.filter(g => g.fecha === 'hoy');
    const totalV = 61600 + totalVentas(vHoy);
    const totalG = 19700 + totalGastos(gHoy);
    const resultado = totalV - totalG;
    return `Esta semana cerraste en ${resultado >= 0 ? 'verde ✅' : 'rojo 🔴'}\nVendiste ${fmt(totalV)} · Gastaste ${fmt(totalG)}\nTe quedaron ${fmt(Math.abs(resultado))} ${resultado >= 0 ? 'limpios' : 'en negativo'}.\nTu mejor día fue el sábado.`;
  }

  // ── MARGEN DE GANANCIA ───────────────────────────────────────────────────
  if (contains(msg, ['margen', 'porcentaje', 'ganancia por producto', 'cuánto gano por'])) {
    const margen = margenPromedio(productos);
    const mejor = mejorMargen(productos);
    const margenMejor = Math.round(((mejor.precioVenta - mejor.precioCosto) / mejor.precioVenta) * 100);
    return `Tu margen de ganancia promedio es del ${margen}% 📈\nEl producto que más te deja es ${mejor.nombre} con un ${margenMejor}% de margen.\n¿Querés potenciar las ventas de ese producto?`;
  }

  // ── MEJOR PRODUCTO (por ganancia) ────────────────────────────────────────
  if (contains(msg, ['qué producto me deja', 'que producto me deja', 'más ganancia', 'mas ganancia', 'más rentable', 'mas rentable', 'conviene vender más', 'conviene vender mas'])) {
    const mejor = mejorMargen(productos);
    const margen = Math.round(((mejor.precioVenta - mejor.precioCosto) / mejor.precioVenta) * 100);
    return `El producto más rentable es ${mejor.nombre} 💰\nTe deja un ${margen}% de ganancia por unidad.\nTe conviene impulsarlo: si vendés más unidades, tu resultado mejora bastante.`;
  }

  // ── STOCK BAJO / REPONER ─────────────────────────────────────────────────
  if (contains(msg, ['falta reponer', 'reponer', 'stock bajo', 'agotarse', 'agotando', 'quedan poco', 'poca mercadería', 'poca mercaderia', 'qué me falta', 'que me falta', 'productos por agotarse'])) {
    const bajos = productos.filter(p => p.stock < p.stockMinimo);
    if (!bajos.length) return '¡Todo el stock está en orden! 🟢 Ningún producto está por debajo del mínimo.\nRevisá igual antes de los fines de semana.';
    const lista = bajos.map(p => `· ${p.nombre}: quedan ${p.stock} unidades`).join('\n');
    return `Tenés ${bajos.length} producto${bajos.length > 1 ? 's' : ''} por agotarse ⚠️\n${lista}\n¿Querés que te arme la lista de compras?`;
  }

  // ── STOCK ESPECÍFICO (cuánto queda de X) ────────────────────────────────
  const productosMencionados = productos.filter(p =>
    msg.toLowerCase().includes(p.nombre.toLowerCase().split(' ')[0].toLowerCase())
  );
  if (productosMencionados.length > 0 && contains(msg, ['queda', 'quedan', 'stock', 'cuánto', 'cuanto', 'unidades', 'tengo'])) {
    const p = productosMencionados[0];
    const alerta = p.stock < p.stockMinimo ? ' ⚠️ ¡Está por debajo del mínimo!' : ' ✅';
    return `De ${p.nombre} te quedan ${p.stock} unidades en stock.${alerta}\nEl mínimo que te conviene tener es ${p.stockMinimo} unidades.\n${p.stock < p.stockMinimo ? 'Te recomiendo reponer pronto.' : '¡Bien surtido!'}`;
  }

  // ── TOTAL EN STOCK ───────────────────────────────────────────────────────
  if (contains(msg, ['cuántos productos', 'cuantos productos', 'total de productos', 'stock total', 'cuántas unidades', 'cuantas unidades'])) {
    const totalUnidades = productos.reduce((s, p) => s + p.stock, 0);
    const bajos = productos.filter(p => p.stock < p.stockMinimo).length;
    return `Tenés ${productos.length} productos en tu catálogo con un total de ${totalUnidades} unidades 📦\n${bajos > 0 ? `Ojo: ${bajos} producto${bajos > 1 ? 's' : ''} están por debajo del stock mínimo.` : 'Todo el stock está en buen nivel.'}`;
  }

  // ── PRODUCTO MÁS VENDIDO ─────────────────────────────────────────────────
  if (contains(msg, ['más vendido', 'mas vendido', 'mejor producto', 'qué vendí más', 'que vendi mas', 'top', 'tres mejores', '3 mejores', 'tres productos', '3 productos'])) {
    const top = topProductos(ventas).slice(0, 3);
    if (!top.length) return 'Todavía no hay ventas registradas para calcular tus productos más vendidos. ¡Empezá a cargar ventas! 🛒';
    const lista = top.map((p, i) => `${i + 1}. ${p.producto}: ${p.cantidad} unidades · ${fmt(p.monto)}`).join('\n');
    return `Tus mejores productos son 🏆\n${lista}\n¡Asegurate de tenerlos siempre en stock!`;
  }

  // ── GASTOS HOY ───────────────────────────────────────────────────────────
  if (contains(msg, ['gasté hoy', 'gaste hoy', 'gasto hoy', 'cuánto gasté hoy', 'cuanto gaste hoy'])) {
    const gHoy = gastos.filter(g => g.fecha === 'hoy');
    const total = totalGastos(gHoy);
    if (!gHoy.length) return 'Hoy no registraste ningún gasto todavía. ¡Ojalá siga así! 💪';
    const mayor = [...gHoy].sort((a, b) => b.monto - a.monto)[0];
    return `Hoy gastaste ${fmt(total)} en ${gHoy.length} registro${gHoy.length > 1 ? 's' : ''} 💸\nEl mayor gasto fue "${mayor.descripcion}" (${fmt(mayor.monto)}).\nRevisá que todos los gastos estén bien anotados.`;
  }

  // ── GASTOS SEMANA ────────────────────────────────────────────────────────
  if (contains(msg, ['gasté', 'gaste', 'gastaste', 'gasto'])
    && contains(msg, ['semana', 'semanal', 'semana'])) {
    const gHoy = gastos.filter(g => g.fecha === 'hoy');
    const total = 19700 + totalGastos(gHoy);
    const catMap: Record<string, number> = {};
    gastos.forEach(g => { catMap[g.categoria] = (catMap[g.categoria] || 0) + g.monto; });
    const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    return `Esta semana gastaste ${fmt(total)} 💸\nTu mayor categoría de gasto fue ${topCat?.[0] ?? 'Proveedores'} (${fmt(topCat?.[1] ?? 0)}).\nControlá los gastos de proveedores, son los que más pesan.`;
  }

  // ── DEUDA PROVEEDORES ────────────────────────────────────────────────────
  if (contains(msg, ['debo', 'deuda', 'proveedores', 'proveedor', 'cuánto le debo', 'cuanto le debo'])) {
    const gastosProveedor = gastos.filter(g => g.categoria === 'Proveedores');
    const total = totalGastos(gastosProveedor);
    const lista = gastosProveedor
      .filter(g => g.proveedor)
      .map(g => `· ${g.proveedor}: ${fmt(g.monto)}`)
      .join('\n');
    return `Tenés ${fmt(total)} registrados en gastos de proveedores 🏪\n${lista || '(sin proveedores detallados)'}\nAnotá siempre el proveedor para tener el control claro.`;
  }

  // ── FALLBACK ─────────────────────────────────────────────────────────────
  return `No entendí bien la pregunta 😅 Probá preguntarme algo como:\n¿Cuánto vendí hoy? · ¿Qué me falta reponer?\n¿Gané o perdí esta semana? · ¿Cuál fue mi mejor producto?`;
}
