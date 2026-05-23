// ============================================================
// Utilidades puras — sin tipos de dominio (migrados a src/types/index.ts)
// ============================================================

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buen día';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function formatMoney(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}
