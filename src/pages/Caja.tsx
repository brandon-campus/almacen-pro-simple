import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Clock, Search, X, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BottomNav from '@/components/BottomNav';
import { ventasHoy, ventasAyer, productos, formatMoney, Venta } from '@/data/mockData';

const Caja = () => {
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(searchParams.get('nueva') === '1');
  const [verAnteriores, setVerAnteriores] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [productoSel, setProductoSel] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [ventas, setVentas] = useState<Venta[]>(ventasHoy);

  const total = ventas.reduce((s, v) => s + v.monto, 0);
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  const precioUnitario = productos.find(p => p.nombre === productoSel)?.precioVenta || 0;

  const confirmarVenta = () => {
    if (!productoSel || cantidad < 1) return;
    const nueva: Venta = {
      id: Date.now(),
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      producto: productoSel,
      cantidad,
      monto: precioUnitario * cantidad,
      fecha: 'hoy',
    };
    setVentas([...ventas, nueva]);
    setModalOpen(false);
    setBusqueda('');
    setProductoSel('');
    setCantidad(1);
  };

  const listaActual = verAnteriores ? ventasAyer : ventas;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Caja del Día</h1>

        {/* Total */}
        <Card className="p-4 mb-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">Total acumulado</p>
          <p className="text-3xl font-bold text-primary">{formatMoney(total)}</p>
        </Card>

        {/* Toggle days */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={!verAnteriores ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVerAnteriores(false)}
          >
            Hoy
          </Button>
          <Button
            variant={verAnteriores ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVerAnteriores(true)}
          >
            Ayer
          </Button>
        </div>

        {/* Sales list */}
        <div className="space-y-2 animate-fade-in">
          {listaActual.map(v => (
            <Card key={v.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <Clock size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{v.producto} x{v.cantidad}</p>
                  <p className="text-xs text-muted-foreground">{v.hora}</p>
                </div>
              </div>
              <p className="font-bold text-foreground">{formatMoney(v.monto)}</p>
            </Card>
          ))}
          {listaActual.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No hay ventas todavía</p>
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
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
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
                  value={productoSel || busqueda}
                  onChange={e => {
                    setBusqueda(e.target.value);
                    setProductoSel('');
                  }}
                  className="pl-9 h-11"
                />
                {productoSel && (
                  <button onClick={() => { setProductoSel(''); setBusqueda(''); }} className="absolute right-3 top-3.5">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                )}
              </div>
              {busqueda && !productoSel && (
                <div className="border border-border rounded-md mt-1 max-h-40 overflow-y-auto bg-card">
                  {productosFiltrados.map(p => (
                    <button
                      key={p.id}
                      className="w-full text-left px-3 py-2 hover:bg-secondary text-sm flex justify-between"
                      onClick={() => { setProductoSel(p.nombre); setBusqueda(''); }}
                    >
                      <span>{p.nombre}</span>
                      <span className="text-muted-foreground">{formatMoney(p.precioVenta)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Cantidad</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</Button>
                <span className="text-lg font-bold w-8 text-center">{cantidad}</span>
                <Button variant="outline" size="icon" onClick={() => setCantidad(cantidad + 1)}>+</Button>
              </div>
            </div>

            {productoSel && (
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{formatMoney(precioUnitario * cantidad)}</p>
              </div>
            )}

            <Button className="w-full h-12 text-base font-semibold" onClick={confirmarVenta} disabled={!productoSel}>
              Confirmar venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Caja;
