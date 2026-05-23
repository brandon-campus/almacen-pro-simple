import { useState } from 'react';
import { Search, Plus, AlertTriangle, Trash2, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BottomNav from '@/components/BottomNav';
import { formatMoney } from '@/data/mockData';
import { useGlobalContext } from '../context/GlobalContext';
import { toast } from 'sonner';
import type { Product } from '../types';

const Stock = () => {
  const { productos, agregarProducto, editarProducto, eliminarProducto } = useGlobalContext();
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    cost_price: '',
    sale_price: '',
    stock_quantity: '',
    min_stock: '5',
    category: '',
  });

  const filtrados = productos.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const openNewModal = () => {
    setEditingId(null);
    setForm({ name: '', cost_price: '', sale_price: '', stock_quantity: '', min_stock: '5', category: '' });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      cost_price: p.cost_price?.toString() ?? '',
      sale_price: p.sale_price.toString(),
      stock_quantity: p.stock_quantity.toString(),
      min_stock: p.min_stock.toString(),
      category: p.category ?? '',
    });
    setModalOpen(true);
  };

  const saveProducto = async () => {
    if (!form.name || !form.sale_price) {
      toast.error('Nombre y precio de venta son obligatorios');
      return;
    }

    const payload = {
      name: form.name,
      cost_price: Number(form.cost_price) || 0,
      sale_price: Number(form.sale_price) || 0,
      stock_quantity: Number(form.stock_quantity) || 0,
      min_stock: Number(form.min_stock) || 5,
      category: form.category || undefined,
    };

    setSaving(true);
    try {
      if (editingId) {
        await editarProducto(editingId, payload);
      } else {
        await agregarProducto(payload);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-64">
      <div className="mx-auto max-w-lg px-4 pt-6 md:max-w-4xl md:px-8 md:pt-8">
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
        <div className="space-y-2 animate-fade-in md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {filtrados.map(p => {
            const stockBajo = p.stock_quantity <= p.min_stock;
            return (
              <Card key={p.id} className="flex flex-col p-3 gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{p.name}</p>
                    {stockBajo && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0 gap-1">
                        <AlertTriangle size={10} /> Poco stock
                      </Badge>
                    )}
                  </div>
                  <div className="text-right flex items-center gap-1">
                    <p className={`text-lg font-bold ${stockBajo ? 'text-destructive' : 'text-foreground'}`}>
                      {p.stock_quantity}
                    </p>
                    <p className="text-[10px] text-muted-foreground ml-1">un.</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <div>
                    <p className="text-sm text-muted-foreground">{formatMoney(p.sale_price)}</p>
                    {p.category && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">{p.category}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => openEditModal(p)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => eliminarProducto(p.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
          {filtrados.length === 0 && (
            <p className="text-center text-muted-foreground py-8 col-span-full">
              {busqueda ? 'Sin resultados para tu búsqueda' : 'Aún no tenés productos. ¡Agregá el primero!'}
            </p>
          )}
        </div>

        <Button className="w-full mt-4 h-12 text-base font-semibold gap-2" onClick={openNewModal}>
          <Plus size={20} /> Agregar producto
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Nombre del producto *"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="h-11"
            />
            <Input
              placeholder="Precio de costo ($)"
              type="number"
              inputMode="decimal"
              value={form.cost_price}
              onChange={e => setForm({ ...form, cost_price: e.target.value })}
              className="h-11"
            />
            <Input
              placeholder="Precio de venta ($) *"
              type="number"
              inputMode="decimal"
              value={form.sale_price}
              onChange={e => setForm({ ...form, sale_price: e.target.value })}
              className="h-11"
            />
            <Input
              placeholder="Stock actual"
              type="number"
              inputMode="numeric"
              value={form.stock_quantity}
              onChange={e => setForm({ ...form, stock_quantity: e.target.value })}
              className="h-11"
            />
            <Input
              placeholder="Stock mínimo (alerta)"
              type="number"
              inputMode="numeric"
              value={form.min_stock}
              onChange={e => setForm({ ...form, min_stock: e.target.value })}
              className="h-11"
            />
            <Input
              placeholder="Categoría (opcional)"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="h-11"
            />
            <Button className="w-full h-12 text-base font-semibold" onClick={saveProducto} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar producto'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Stock;
