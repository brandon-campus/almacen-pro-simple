import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Receipt, BarChart3, Sparkles, Rocket } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Caja', href: '/caja', icon: ShoppingCart },
  { name: 'Stock', href: '/stock', icon: Package },
  { name: 'Gastos', href: '/gastos', icon: Receipt },
  { name: 'Resumen', href: '/resumen', icon: BarChart3 },
];

const aiTools = [
  { name: 'Consejero AI', href: '/consejero', icon: Sparkles },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-app-bg text-white">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Almacén<span className="text-primary-foreground/70">Pro</span></span>
          </div>
        </div>

        <div className="px-4 space-y-1 flex-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-white text-app-bg shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive ? 'text-app-bg' : 'text-gray-400 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            );
          })}

          <div className="mt-8 mb-4">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Herramientas Pro
            </p>
          </div>
          
          {aiTools.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-white text-app-bg shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive ? 'text-app-bg' : 'text-gray-400 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Upgrade Card */}
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <h3 className="text-white font-bold mb-1">Upgrade to Pro</h3>
              <p className="text-white/80 text-xs mb-4">Obtené una experiencia más completa y avanzada.</p>
              <button className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Upgrade Now
              </button>
            </div>
            <Rocket className="absolute -bottom-4 -right-4 w-24 h-24 text-white/20 transform rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
};
