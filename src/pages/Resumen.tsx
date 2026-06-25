import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BottomNav from '@/components/BottomNav';
import { formatMoney } from '@/data/mockData';
import { useGlobalContext } from '../context/GlobalContext';
import { fetchWeeklySales, fetchRangeSummary } from '../services/supabase.service';
import type { DailySales } from '../types';

type Periodo = 'hoy' | 'semana' | 'mes';

const getRangeForPeriod = (periodo: Periodo): { from: Date; to: Date } => {
  const now = new Date();
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);

  if (periodo === 'hoy') {
    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }

  if (periodo === 'semana') {
    const from = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    from.setDate(now.getDate() + diff);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }

  // mes
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  from.setHours(0, 0, 0, 0);
  return { from, to };
};

const Resumen = () => {
  const { orgId } = useGlobalContext();
  const [periodo, setPeriodo] = useState<Periodo>('hoy');
  const [chartData, setChartData] = useState<DailySales[]>([]);
  const [summary, setSummary] = useState({ totalSales: 0, totalExpenses: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    const load = async () => {
      setLoading(true);
      try {
        const { from, to } = getRangeForPeriod(periodo);
        const [sum, weekly] = await Promise.all([
          fetchRangeSummary(orgId, from, to),
          fetchWeeklySales(orgId),
        ]);
        setSummary(sum);
        setChartData(weekly);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orgId, periodo]);

  const resultado = summary.totalSales - summary.totalExpenses;

  const periodos: { key: Periodo; label: string }[] = [
    { key: 'hoy', label: 'Hoy' },
    { key: 'semana', label: 'Esta semana' },
    { key: 'mes', label: 'Este mes' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="mx-auto max-w-lg px-4 pt-6 md:max-w-5xl md:px-8 md:pt-8">
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

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="space-y-3 mb-6 animate-fade-in md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
              <Card className="p-4 flex justify-between items-center md:flex-col md:items-start md:gap-2">
                <span className="text-sm text-muted-foreground">Total de ventas</span>
                <span className="text-xl font-bold text-foreground md:text-3xl">{formatMoney(summary.totalSales)}</span>
              </Card>
              <Card className="p-4 flex justify-between items-center md:flex-col md:items-start md:gap-2">
                <span className="text-sm text-muted-foreground">Total de gastos</span>
                <span className="text-xl font-bold text-destructive md:text-3xl">-{formatMoney(summary.totalExpenses)}</span>
              </Card>
              <Card className={`p-4 flex justify-between items-center border-2 md:flex-col md:items-start md:gap-2 ${resultado >= 0 ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'}`}>
                <span className="text-sm font-medium text-foreground">Resultado neto</span>
                <span className={`text-2xl font-bold md:text-3xl ${resultado >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {resultado >= 0 ? '+' : ''}{formatMoney(resultado)}
                </span>
              </Card>
            </div>

            {/* Chart */}
            <Card className="p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Ventas por día (esta semana)</p>
              {chartData.every(d => d.ventas === 0) ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Aún no hay ventas registradas esta semana
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatMoney(value)}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </>
        )}
      </div>

      {/* BottomNav is now in Layout */}
    </div>
  );
};

export default Resumen;
