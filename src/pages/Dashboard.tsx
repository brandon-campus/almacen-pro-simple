import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Receipt, BarChart3, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import { getGreeting, formatMoney, totalVentasHoy, totalGastosHoy, resultadoHoy } from '@/data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();

  const modules = [
    { label: 'Caja', icon: ShoppingCart, path: '/caja' },
    { label: 'Stock', icon: Package, path: '/stock' },
    { label: 'Gastos', icon: Receipt, path: '/gastos' },
    { label: 'Resumen', icon: BarChart3, path: '/resumen' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-lg px-4 pt-6">
        {/* Greeting */}
        <div className="mb-6 animate-fade-in">
          <p className="text-muted-foreground text-sm">{getGreeting()},</p>
          <h1 className="text-2xl font-bold text-foreground">Carlos 👋</h1>
          <p className="text-sm text-muted-foreground">Almacén Don Carlos</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in">
          <Card className="p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Vendí hoy</p>
            <p className="text-lg font-bold text-foreground">{formatMoney(totalVentasHoy)}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Gasté hoy</p>
            <p className="text-lg font-bold text-foreground">{formatMoney(totalGastosHoy)}</p>
          </Card>
          <Card className={`p-3 text-center ${resultadoHoy >= 0 ? 'border-success/30' : 'border-destructive/30'}`}>
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Resultado</p>
            <p className={`text-lg font-bold ${resultadoHoy >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatMoney(resultadoHoy)}
            </p>
          </Card>
        </div>

        {/* Quick access */}
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Acceso rápido</h2>
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          {modules.map(({ label, icon: Icon, path }) => (
            <Card
              key={path}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors active:scale-[0.98]"
              onClick={() => navigate(path)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon size={20} className="text-primary" />
              </div>
              <span className="font-semibold text-foreground">{label}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/caja?nueva=1')}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:scale-95 transition-transform md:right-[calc(50%-220px)]"
      >
        <Plus size={28} className="text-primary-foreground" />
      </button>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
