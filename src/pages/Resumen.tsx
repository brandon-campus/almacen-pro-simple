import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BottomNav from '@/components/BottomNav';
import { ventasPorDia, formatMoney } from '@/data/mockData';

const periodos = [
  { key: 'hoy', label: 'Hoy', ventas: 6000, gastos: 15000 },
  { key: 'semana', label: 'Esta semana', ventas: 61600, gastos: 19700 },
  { key: 'mes', label: 'Este mes', ventas: 245000, gastos: 78000 },
];

const Resumen = () => {
  const [periodo, setPeriodo] = useState('hoy');
  const data = periodos.find(p => p.key === periodo)!;
  const resultado = data.ventas - data.gastos;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Resumen</h1>

        {/* Period selector */}
        <div className="flex gap-2 mb-4">
          {periodos.map(p => (
            <Button
              key={p.key}
              variant={periodo === p.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodo(p.key)}
              className="flex-1"
            >
              {p.label}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-6 animate-fade-in">
          <Card className="p-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total de ventas</span>
            <span className="text-xl font-bold text-foreground">{formatMoney(data.ventas)}</span>
          </Card>
          <Card className="p-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total de gastos</span>
            <span className="text-xl font-bold text-destructive">-{formatMoney(data.gastos)}</span>
          </Card>
          <Card className={`p-4 flex justify-between items-center border-2 ${resultado >= 0 ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'}`}>
            <span className="text-sm font-medium text-foreground">Resultado neto</span>
            <span className={`text-2xl font-bold ${resultado >= 0 ? 'text-success' : 'text-destructive'}`}>
              {resultado >= 0 ? '+' : ''}{formatMoney(resultado)}
            </span>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Ventas por día (esta semana)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ventasPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatMoney(value)} labelStyle={{ color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Resumen;
