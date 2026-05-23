// ============================================================
// Tipos alineados con el schema real de Supabase
// ============================================================

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  plan: string;
}

export interface Product {
  id: string;
  org_id: string;
  name: string;
  sku: string | null;
  cost_price: number | null;
  sale_price: number;
  stock_quantity: number;
  min_stock: number;
  category: string | null;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  // populated via join
  product?: Pick<Product, 'name' | 'sale_price'>;
}

export interface Sale {
  id: string;
  org_id: string;
  date: string;
  total: number;
  notes: string | null;
  // populated via join
  sale_items?: SaleItem[];
}

export interface Expense {
  id: string;
  org_id: string;
  date: string;
  amount: number;
  category: 'Proveedores' | 'Servicios' | 'Otros';
  description: string | null;
  supplier_id: string | null;
  // denormalized for UI convenience
  supplier_name?: string;
}

// Payload para crear una venta (una sola línea de producto por ahora)
export interface NewSalePayload {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

// Payload para crear un gasto
export interface NewExpensePayload {
  amount: number;
  category: Expense['category'];
  description?: string;
  supplier_name?: string;
}

// Payload para crear/actualizar un producto
export interface ProductFormPayload {
  name: string;
  cost_price: number;
  sale_price: number;
  stock_quantity: number;
  min_stock: number;
  sku?: string;
  category?: string;
}

// Datos para el gráfico de ventas por día
export interface DailySales {
  dia: string;
  ventas: number;
}
