export interface Producto {
  id: number;
  nombre: string;
  precioCosto: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
}

export interface Venta {
  id: number;
  hora: string;
  producto: string;
  cantidad: number;
  monto: number;
  fecha: string;
}

export interface Gasto {
  id: number;
  monto: number;
  categoria: 'Proveedores' | 'Servicios' | 'Otros';
  descripcion: string;
  proveedor?: string;
  fecha: string;
}

export const productos: Producto[] = [
  { id: 1, nombre: 'Aceite', precioCosto: 800, precioVenta: 1200, stock: 12, stockMinimo: 5 },
  { id: 2, nombre: 'Arroz 1kg', precioCosto: 500, precioVenta: 750, stock: 8, stockMinimo: 5 },
  { id: 3, nombre: 'Leche entera', precioCosto: 600, precioVenta: 900, stock: 3, stockMinimo: 5 },
  { id: 4, nombre: 'Azúcar 1kg', precioCosto: 400, precioVenta: 650, stock: 20, stockMinimo: 5 },
  { id: 5, nombre: 'Fideos 500g', precioCosto: 350, precioVenta: 550, stock: 15, stockMinimo: 5 },
  { id: 6, nombre: 'Huevo (docena)', precioCosto: 1200, precioVenta: 1800, stock: 60, stockMinimo: 12 },
  { id: 7, nombre: 'Yerba 500g', precioCosto: 900, precioVenta: 1350, stock: 6, stockMinimo: 5 },
];

export const ventasHoy: Venta[] = [
  { id: 1, hora: '09:15', producto: 'Aceite', cantidad: 2, monto: 2400, fecha: 'hoy' },
  { id: 2, hora: '10:30', producto: 'Arroz 1kg', cantidad: 3, monto: 2250, fecha: 'hoy' },
  { id: 3, hora: '11:45', producto: 'Yerba 500g', cantidad: 1, monto: 1350, fecha: 'hoy' },
];

export const ventasAyer: Venta[] = [
  { id: 4, hora: '08:20', producto: 'Leche entera', cantidad: 2, monto: 1800, fecha: 'ayer' },
  { id: 5, hora: '14:10', producto: 'Fideos 500g', cantidad: 4, monto: 2200, fecha: 'ayer' },
];

export const gastos: Gasto[] = [
  { id: 1, monto: 15000, categoria: 'Proveedores', descripcion: 'Reposición de aceite y arroz', proveedor: 'Distribuidora López', fecha: 'hoy' },
  { id: 2, monto: 3500, categoria: 'Servicios', descripcion: 'Luz del local', fecha: 'esta semana' },
  { id: 3, monto: 1200, categoria: 'Otros', descripcion: 'Bolsas y packaging', fecha: 'este mes' },
];

export const ventasPorDia = [
  { dia: 'Lun', ventas: 8500 },
  { dia: 'Mar', ventas: 6200 },
  { dia: 'Mié', ventas: 9100 },
  { dia: 'Jue', ventas: 7300 },
  { dia: 'Vie', ventas: 11000 },
  { dia: 'Sáb', ventas: 14500 },
  { dia: 'Dom', ventas: 5000 },
];

export const totalVentasHoy = ventasHoy.reduce((s, v) => s + v.monto, 0);
export const totalGastosHoy = gastos.filter(g => g.fecha === 'hoy').reduce((s, g) => s + g.monto, 0);
export const resultadoHoy = totalVentasHoy - totalGastosHoy;

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buen día';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function formatMoney(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}
