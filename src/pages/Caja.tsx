import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Clock, Search, X, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BottomNav from '@/components/BottomNav';
import { formatMoney } from '@/data/mockData';
import { useGlobalContext } from '../context/GlobalContext';

const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
};

const formatHora = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

const Caja = () => {
  const { productos, ventas, registrarVenta, eliminarVenta } = useGlobalContext();
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(searchParams.get('nueva') === '1');
  const [verAnteriores, setVerAnteriores] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [productoSelId, setProductoSelId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);

  const ventasHoyList = ventas.filter(v => isToday(v.date));
  // En esta versión el contexto solo carga ventas de hoy, así que "anteriores" queda vacío
  // Se puede expandir en el futuro con paginación o filtro de fecha
  const listaActual = verAnteriores ? [] : ventasHoyList;
  const total = listaActual.reduce((s, v) => s + v.total, 0);

  const productosFiltrados = productos.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );
  const productoActual = productos.find(p => p.id === productoSelId);
  const precioUnitario = productoActual?.sale_price ?? 0;
  const maxStock = productoActual?.stock_quantity ?? 0;

  const confirmarVenta = async () => {
    if (!productoSelId || cantidad < 1 || !productoActual) return;
    setLoading(true);
    try {
      await registrarVenta({
        product_id: productoActual.id,
        product_name: productoActual.name,
        quantity: cantidad,
        unit_price: precioUnitario,
      });
      setModalOpen(false);
      setBusqueda('');
      setProductoSelId('');
      setCantidad(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="mx-auto max-w-lg px-4 pt-6 md:max-w-4xl md:px-8 md:pt-8">
        <h1 className="text-xl font-bold text-foreground mb-1">Caja</h1>

        {/* Total */}
        <Card className="p-4 mb-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">Total acumulado hoy</p>
          <p className="text-3xl font-bold text-primary">{formatMoney(total)}</p>
        </Card>

        {/* Toggle days */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={!verAnteriores ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVerAnteriores(false)}
          >
            Hoy ({ventasHoyList.length})
          </Button>
          <Button
            variant={verAnteriores ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVerAnteriores(true)}
          >
            Anteriores
          </Button>
        </div>

        {/* Sales list */}
        <div className="space-y-2 animate-fade-in md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {listaActual.map(venta => {
            const firstItem = venta.sale_items?.[0];
            const productName = (firstItem?.products as any)?.name ?? 'Producto';
            const quantity = firstItem?.quantity ?? 1;
            return (
              <Card key={venta.id} className="flex flex-col p-3 gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary shrink-0">
                      <Clock size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {productName} <span className="text-muted-foreground">x{quantity}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{formatHora(venta.date)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-foreground">{formatMoney(venta.total)}</p>
                    <button
                      onClick={() => eliminarVenta(venta.id)}
                      className="text-xs text-destructive hover:underline mt-1 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Anular
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
          {listaActual.length === 0 && (
            <p className="text-center text-muted-foreground py-8 col-span-full">
              {verAnteriores ? 'El historial anterior estará disponible próximamente' : 'No hay ventas registradas hoy'}
            </p>
          )}
        </div>

        {/* New sale button */}
        <Button
          className="w-full mt-4 h-12 text-base font-semibold gap-2"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={20} /> Nueva venta
        </Button>
      </div>

      {/* New sale modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => {
        if (!open) { setBusqueda(''); setProductoSelId(''); setCantidad(1); }
        setModalOpen(open);
      }}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Registrar venta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Producto</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar producto..."
                  value={productoActual ? productoActual.name : busqueda}
                  onChange={e => {
                    setBusqueda(e.target.value);
                    setProductoSelId('');
                  }}
                  className="pl-9 h-11"
                />
                {productoSelId && (
                  <button onClick={() => { setProductoSelId(''); setBusqueda(''); }} className="absolute right-3 top-3.5">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                )}
              </div>
              {busqueda && !productoSelId && (
                <div className="border border-border rounded-md mt-1 max-h-40 overflow-y-auto bg-card">
                  {productosFiltrados.map(p => (
                    <button
                      key={p.id}
                      disabled={p.stock_quantity <= 0}
                      className="w-full text-left px-3 py-2 hover:bg-secondary text-sm flex justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => { setProductoSelId(p.id); setBusqueda(''); setCantidad(1); }}
                    >
                      <span className="flex flex-col">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">Stock: {p.stock_quantity}</span>
                      </span>
                      <span className="text-muted-foreground">{formatMoney(p.sale_price)}</span>
                    </button>
                  ))}
                  {productosFiltrados.length === 0 && (
                    <div className="p-3 text-sm text-center text-muted-foreground">Sin resultados</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Cantidad</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</Button>
                <span className="text-lg font-bold w-8 text-center">{cantidad}</span>
                <Button variant="outline" size="icon" disabled={cantidad >= maxStock} onClick={() => setCantidad(cantidad + 1)}>+</Button>
              </div>
            </div>

            {productoSelId && (
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Total a cobrar</p>
                <p className="text-2xl font-bold text-foreground">{formatMoney(precioUnitario * cantidad)}</p>
              </div>
            )}

            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={confirmarVenta}
              disabled={!productoSelId || cantidad < 1 || cantidad > maxStock || loading}
            >
              {loading ? 'Guardando...' : 'Confirmar venta'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BottomNav is now in Layout */}
    </div>
  );
};

export default Caja;
