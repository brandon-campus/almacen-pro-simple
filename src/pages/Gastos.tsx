import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import { formatMoney } from '@/data/mockData';
import { useGlobalContext } from '../context/GlobalContext';
import type { Expense } from '../types';

const categoriaColor: Record<string, string> = {
  Proveedores: 'bg-primary/10 text-primary',
  Servicios: 'bg-warning/20 text-warning-foreground',
  Otros: 'bg-secondary text-secondary-foreground',
};

const formatFecha = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (isToday) return 'Hoy ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const Gastos = () => {
  const { gastos, registrarGasto, eliminarGasto } = useGlobalContext();
  const [filtro, setFiltro] = useState<string>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    category: 'Proveedores' as Expense['category'],
    description: '',
    supplier_name: '',
  });

  const filtrados = filtro === 'todos' ? gastos : gastos.filter(g => g.category === filtro);

  const guardarGasto = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error('Ingresá un monto válido');
      return;
    }
    setSaving(true);
    try {
      await registrarGasto({
        amount: Number(form.amount),
        category: form.category,
        description: form.description || undefined,
        supplier_name: form.supplier_name || undefined,
      });
      setModalOpen(false);
      setForm({ amount: '', category: 'Proveedores', description: '', supplier_name: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-64">
      <div className="mx-auto max-w-lg px-4 pt-6 md:max-w-4xl md:px-8 md:pt-8">
        <h1 className="text-xl font-bold text-foreground mb-4">Gastos</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
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
        <div className="space-y-2 animate-fade-in md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {filtrados.map(g => (
            <Card key={g.id} className="p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-[10px] ${categoriaColor[g.category]}`}>{g.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{formatFecha(g.date)}</span>
                  </div>
                  <p className="text-sm text-foreground">{g.description || 'Sin descripción'}</p>
                  {g.supplier_name && (
                    <p className="text-xs text-muted-foreground mt-0.5">{g.supplier_name}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-bold text-destructive text-lg">-{formatMoney(g.amount)}</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                        <Trash2 size={12} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-sm mx-auto">
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Vas a eliminar este gasto de {formatMoney(g.amount)}. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => eliminarGasto(g.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
          {filtrados.length === 0 && (
            <p className="text-center text-muted-foreground py-8 col-span-full">
              {filtro === 'todos' ? 'No hay gastos registrados aún' : `No hay gastos en "${filtro}"`}
            </p>
          )}
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
            <Input
              placeholder="Monto ($) *"
              type="number"
              inputMode="decimal"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className={`h-11 ${!form.amount ? 'border-red-500/40' : ''}`}
            />
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Categoría</label>
              <div className="flex gap-2">
                {(['Proveedores', 'Servicios', 'Otros'] as const).map(cat => (
                  <Button
                    key={cat}
                    variant={form.category === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForm({ ...form, category: cat })}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <Input
              placeholder="Descripción (opcional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="h-11"
            />
            <Input
              placeholder="Proveedor (opcional)"
              value={form.supplier_name}
              onChange={e => setForm({ ...form, supplier_name: e.target.value })}
              className="h-11"
            />
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 h-12 text-base" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="flex-1 h-12 text-base font-semibold" onClick={guardarGasto} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Gastos;
