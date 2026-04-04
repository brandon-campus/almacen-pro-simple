import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BottomNav from '@/components/BottomNav';
import { gastos as initialGastos, formatMoney, Gasto } from '@/data/mockData';

const categoriaColor: Record<string, string> = {
  Proveedores: 'bg-primary/10 text-primary',
  Servicios: 'bg-warning/20 text-warning-foreground',
  Otros: 'bg-secondary text-secondary-foreground',
};

const Gastos = () => {
  const [lista, setLista] = useState<Gasto[]>(initialGastos);
  const [filtro, setFiltro] = useState<string>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ monto: '', categoria: 'Proveedores' as Gasto['categoria'], descripcion: '', proveedor: '' });

  const filtrados = filtro === 'todos' ? lista : lista.filter(g => g.categoria === filtro);

  const registrarGasto = () => {
    if (!form.monto) return;
    const nuevo: Gasto = {
      id: Date.now(),
      monto: Number(form.monto),
      categoria: form.categoria,
      descripcion: form.descripcion,
      proveedor: form.proveedor || undefined,
      fecha: 'hoy',
    };
    setLista([...lista, nuevo]);
    setModalOpen(false);
    setForm({ monto: '', categoria: 'Proveedores', descripcion: '', proveedor: '' });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Gastos</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['todos', 'Proveedores', 'Servicios', 'Otros'].map(cat => (
            <Button
              key={cat}
              variant={filtro === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltro(cat)}
              className="shrink-0"
            >
              {cat === 'todos' ? 'Todos' : cat}
            </Button>
          ))}
        </div>

        {/* Expenses list */}
        <div className="space-y-2 animate-fade-in">
          {filtrados.map(g => (
            <Card key={g.id} className="p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-[10px] ${categoriaColor[g.categoria]}`}>{g.categoria}</Badge>
                    <span className="text-[10px] text-muted-foreground capitalize">{g.fecha}</span>
                  </div>
                  <p className="text-sm text-foreground">{g.descripcion || 'Sin descripción'}</p>
                  {g.proveedor && <p className="text-xs text-muted-foreground mt-0.5">{g.proveedor}</p>}
                </div>
                <p className="font-bold text-destructive text-lg">-{formatMoney(g.monto)}</p>
              </div>
            </Card>
          ))}
        </div>

        <Button className="w-full mt-4 h-12 text-base font-semibold gap-2" onClick={() => setModalOpen(true)}>
          <Plus size={20} /> Registrar gasto
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Nuevo gasto</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Monto ($)" type="number" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} className="h-11" />
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Categoría</label>
              <div className="flex gap-2">
                {(['Proveedores', 'Servicios', 'Otros'] as const).map(cat => (
                  <Button
                    key={cat}
                    variant={form.categoria === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForm({ ...form, categoria: cat })}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <Input placeholder="Descripción (opcional)" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="h-11" />
            <Input placeholder="Proveedor (opcional)" value={form.proveedor} onChange={e => setForm({ ...form, proveedor: e.target.value })} className="h-11" />
            <Button className="w-full h-12 text-base font-semibold" onClick={registrarGasto} disabled={!form.monto}>
              Guardar gasto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Gastos;
