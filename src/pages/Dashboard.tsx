import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Receipt, BarChart3, Bell, Search, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getGreeting, formatMoney } from '@/data/mockData';
import { useGlobalContext } from '../context/GlobalContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'May', ventas: 4000 },
  { name: 'Jun', ventas: 3000 },
  { name: 'Jul', ventas: 2000 },
  { name: 'Aug', ventas: 6000 },
  { name: 'Sep', ventas: 1890 },
  { name: 'Oct', ventas: 2390 },
  { name: 'Nov', ventas: 3490 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { ventas, gastos, organization } = useGlobalContext();

  const totalVentasHoy = ventas.reduce((s, v) => s + v.total, 0);
  const totalGastosHoy = gastos.reduce((s, g) => s + g.amount, 0);

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{getGreeting()}, {organization?.name ?? 'Administrador'}</h1>
          <p className="text-muted-foreground text-sm">Resumen general de tu comercio</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white rounded-full text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="hidden md:flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">Admin</span>
              <span className="text-xs text-muted-foreground">admin@almacen.com</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 border-none shadow-sm rounded-2xl" style={{ backgroundColor: 'hsl(var(--pastel-purple))', color: 'hsl(var(--pastel-purple-fg))' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium opacity-80">Ventas Hoy</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatMoney(totalVentasHoy)}</h3>
            </div>
            <div className="p-2 bg-white/50 rounded-full">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-medium">↑ 12% vs ayer</p>
        </Card>

        <Card className="p-5 border-none shadow-sm rounded-2xl" style={{ backgroundColor: 'hsl(var(--pastel-green))', color: 'hsl(var(--pastel-green-fg))' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium opacity-80">Stock Bajo</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">24</h3>
            </div>
            <div className="p-2 bg-white/50 rounded-full">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-medium">↓ 4% vs la semana pasada</p>
        </Card>

        <Card className="p-5 border-none shadow-sm rounded-2xl" style={{ backgroundColor: 'hsl(var(--pastel-orange))', color: 'hsl(var(--pastel-orange-fg))' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium opacity-80">Gastos Mensuales</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatMoney(totalGastosHoy)}</h3>
            </div>
            <div className="p-2 bg-white/50 rounded-full">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-medium">0% vs mes pasado</p>
        </Card>

        <Card className="p-5 border-none shadow-sm rounded-2xl" style={{ backgroundColor: 'hsl(var(--pastel-yellow))', color: 'hsl(var(--pastel-yellow-fg))' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium opacity-80">Tickets (Promedio)</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatMoney(2500)}</h3>
            </div>
            <div className="p-2 bg-white/50 rounded-full">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-medium">↑ 5% vs mes pasado</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="p-6 col-span-2 border-gray-100 shadow-sm rounded-[1.5rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Evolución de Ventas</h3>
            <select className="text-sm bg-gray-50 border-none rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-primary/20">
              <option>Mensual</option>
              <option>Semanal</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f5f5f5'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[6, 6, 6, 6]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="p-6 border-gray-100 shadow-sm rounded-[1.5rem] flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Alertas de Sistema</h3>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-500 text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Stock Crítico</p>
                  <p className="text-xs text-gray-400">Hace 30 min</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-red-500 text-white rounded-full">Crítico</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Vencimiento cercano</p>
                  <p className="text-xs text-gray-500">Hace 1 hora</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Aviso</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Caja iniciada</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Info</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
