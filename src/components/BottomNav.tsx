import { Home, ShoppingCart, Package, Receipt, BarChart3, Sparkles, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Inicio' },
  { path: '/caja', icon: ShoppingCart, label: 'Caja' },
  { path: '/stock', icon: Package, label: 'Stock' },
  { path: '/gastos', icon: Receipt, label: 'Gastos' },
  { path: '/resumen', icon: BarChart3, label: 'Resumen' },
  { path: '/consejero', icon: Sparkles, label: 'Consejero' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useGlobalContext();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-area-bottom md:w-64 md:border-t-0 md:border-r md:top-0 md:h-screen md:flex md:flex-col md:py-6">
      <div className="hidden md:flex items-center px-6 mb-8">
        <span className="text-xl font-bold text-primary">AlmacénPro</span>
      </div>
      <div className="mx-auto flex max-w-lg w-full items-center justify-around py-2 md:py-0 md:flex-col md:max-w-none md:justify-start md:gap-2 md:px-4 md:flex-1">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors md:flex-row md:w-full md:gap-3 md:px-4 md:py-3 ${active ? 'text-primary md:bg-primary/10' : 'text-muted-foreground md:hover:bg-secondary'
                }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} className="md:w-5 md:h-5" />
              <span className="text-[11px] md:text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
      <div className="hidden md:flex px-4 mt-auto w-full">
        <button
          onClick={logout}
          className="flex items-center w-full gap-3 px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
        >
          <LogOut size={22} className="md:w-5 md:h-5" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
