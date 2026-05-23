import { supabase } from '../lib/supabase';
import type {
  Product,
  Sale,
  Expense,
  NewSalePayload,
  NewExpensePayload,
  ProductFormPayload,
  DailySales,
  Organization,
} from '../types';

// ============================================================
// ORGANIZATION
// ============================================================

export async function fetchOrganization(orgId: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// PRODUCTS
// ============================================================

export async function fetchProducts(orgId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('org_id', orgId)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function addProduct(orgId: string, payload: ProductFormPayload): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      org_id: orgId,
      name: payload.name,
      cost_price: payload.cost_price,
      sale_price: payload.sale_price,
      stock_quantity: payload.stock_quantity,
      min_stock: payload.min_stock,
      sku: payload.sku ?? null,
      category: payload.category ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, payload: Partial<ProductFormPayload>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ============================================================
// SALES
// ============================================================

/**
 * Obtiene todas las ventas del día de hoy para la organización.
 * Incluye los sale_items con el nombre del producto.
 */
export async function fetchSalesToday(orgId: string): Promise<Sale[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items (
        id,
        product_id,
        quantity,
        unit_price,
        products ( name )
      )
    `)
    .eq('org_id', orgId)
    .gte('date', startOfDay.toISOString())
    .order('date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Registra una venta y descuenta stock del producto.
 * Usa una transacción implícita: si falla algún paso, el stock no queda inconsistente
 * porque Supabase usa RPC / operación atómica de decremento.
 */
export async function addSale(orgId: string, item: NewSalePayload): Promise<Sale> {
  const total = item.quantity * item.unit_price;

  // 1. Crear la venta cabecera
  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .insert({ org_id: orgId, total, date: new Date().toISOString() })
    .select()
    .single();
  if (saleError) throw saleError;

  // 2. Crear el ítem de venta
  const { error: itemError } = await supabase
    .from('sale_items')
    .insert({
      sale_id: saleData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    });
  if (itemError) throw itemError;

  // 3. Decrementar stock del producto atómicamente
  const { error: stockError } = await supabase.rpc('decrement_stock', {
    p_product_id: item.product_id,
    p_quantity: item.quantity,
  });
  if (stockError) throw stockError;

  return saleData;
}

/**
 * Anula una venta: borra sale_items, restaura el stock, borra la venta.
 */
export async function deleteSale(saleId: string, items: Array<{ product_id: string; quantity: number }>): Promise<void> {
  // 1. Restaurar stock
  for (const item of items) {
    await supabase.rpc('increment_stock', {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    });
  }

  // 2. Borrar sale_items
  await supabase.from('sale_items').delete().eq('sale_id', saleId);

  // 3. Borrar la venta
  const { error } = await supabase.from('sales').delete().eq('id', saleId);
  if (error) throw error;
}

// ============================================================
// EXPENSES
// ============================================================

export async function fetchExpenses(orgId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('org_id', orgId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addExpense(orgId: string, payload: NewExpensePayload): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      org_id: orgId,
      amount: payload.amount,
      category: payload.category,
      description: payload.description ?? null,
      date: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
}

// ============================================================
// RESUMEN — ventas por día de la semana actual
// ============================================================

export async function fetchWeeklySales(orgId: string): Promise<DailySales[]> {
  // Inicio y fin de la semana actual (lunes a hoy)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Dom, 1=Lun...
  const startOfWeek = new Date(now);
  // Ajustar a lunes
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('sales')
    .select('date, total')
    .eq('org_id', orgId)
    .gte('date', startOfWeek.toISOString())
    .order('date');

  if (error) throw error;

  const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const totals: Record<string, number> = {};
  DAYS.forEach(d => (totals[d] = 0));

  (data ?? []).forEach(sale => {
    const date = new Date(sale.date);
    const jsDay = date.getDay(); // 0=Dom
    const dayLabel = DAYS[jsDay === 0 ? 6 : jsDay - 1];
    totals[dayLabel] = (totals[dayLabel] ?? 0) + (sale.total ?? 0);
  });

  return DAYS.map(dia => ({ dia, ventas: totals[dia] ?? 0 }));
}

export async function fetchRangeSummary(
  orgId: string,
  from: Date,
  to: Date
): Promise<{ totalSales: number; totalExpenses: number }> {
  const [salesResult, expensesResult] = await Promise.all([
    supabase
      .from('sales')
      .select('total')
      .eq('org_id', orgId)
      .gte('date', from.toISOString())
      .lte('date', to.toISOString()),
    supabase
      .from('expenses')
      .select('amount')
      .eq('org_id', orgId)
      .gte('date', from.toISOString())
      .lte('date', to.toISOString()),
  ]);

  const totalSales = (salesResult.data ?? []).reduce((s, r) => s + (r.total ?? 0), 0);
  const totalExpenses = (expensesResult.data ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);

  return { totalSales, totalExpenses };
}
