import { useState } from 'react';
import { Search, Plus, AlertTriangle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BottomNav from '@/components/BottomNav';
import { productos as initialProducts, formatMoney, Producto } from '@/data/mockData';

const Stock = () => {
  const [lista, setLista] = useState<Producto[]>(initialProducts);
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', precioCosto: '', precioVenta: '', stock: '', stockMinimo: '5' });

  const filtrados = lista.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const agregarProducto = () => {
    if (!form.nombre || !form.precioVenta) return;
    const nuevo: Producto = {
      id: Date.now(),
      nombre: form.nombre,
      precioCosto: Number(form.precioCosto) || 0,
      precioVenta: Number(form.precioVenta) || 0,
      stock: Number(form.stock) || 0,
      stockMinimo: Number(form.stockMinimo) || 5,
    };
    setLista([...lista, nuevo]);
    setModalOpen(false);
    setForm({ nombre: '', precioCosto: '', precioVenta: '', stock: '', stockMinimo: '5' });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Stock</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="pl-9 h-11"
          />
        </div>

        {/* Product list */}
        <div className="space-y-2 animate-fade-in">
          {filtrados.map(p => {
            const stockBajo = p.stock <= p.stockMinimo;
            return (
              <Card key={p.id} className="flex items-center justify-between p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{p.nombre}</p>
                    {stockBajo && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0 gap-1">
                        <AlertTriangle size={10} /> Poco stock
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatMoney(p.precioVenta)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${stockBajo ? 'text-destructive' : 'text-foreground'}`}>
                    {p.stock}
                  </p>
                  <p className="text-[10px] text-muted-foreground">unidades</p>
                </div>
              </Card>
            );
          })}
        </div>

        <Button className="w-full mt-4 h-12 text-base font-semibold gap-2" onClick={() => setModalOpen(true)}>
          <Plus size={20} /> Agregar producto
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Nuevo producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nombre del producto" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="h-11" />
            <Input placeholder="Precio de costo ($)" type="number" value={form.precioCosto} onChange={e => setForm({ ...form, precioCosto: e.target.value })} className="h-11" />
            <Input placeholder="Precio de venta ($)" type="number" value={form.precioVenta} onChange={e => setForm({ ...form, precioVenta: e.target.value })} className="h-11" />
            <Input placeholder="Stock actual" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="h-11" />
            <Input placeholder="Stock mínimo (para alerta)" type="number" value={form.stockMinimo} onChange={e => setForm({ ...form, stockMinimo: e.target.value })} className="h-11" />
            <Button className="w-full h-12 text-base font-semibold" onClick={agregarProducto} disabled={!form.nombre || !form.precioVenta}>
              Guardar producto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Stock;
