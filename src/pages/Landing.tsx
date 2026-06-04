import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGlobalContext } from '../context/GlobalContext';
import logo from '@/assets/logo.png';
import { ArrowRight, CheckCircle2, TrendingUp, Package, Wallet } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useGlobalContext();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="AlmacénPro" width={32} height={32} />
            <span className="text-xl font-bold text-foreground">AlmacénPro</span>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild variant="default" className="font-medium rounded-full px-6">
                <Link to="/dashboard">Ir al Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-medium">
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild variant="default" className="font-medium rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                  <Link to="/login">Empezar gratis</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container grid lg:grid-cols-2 gap-10 items-center py-20 md:py-32">
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit">
              Nuevo: Control de stock simplificado
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Tu almacén, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                100% organizado
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              La forma más simple e inteligente de gestionar tu stock, llevar el control de tu caja y administrar tus gastos en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="rounded-full text-base h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  {isAuthenticated ? "Ir a mi Almacén" : "Comenzar ahora"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <ul className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Uso fácil e intuitivo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sin tarjeta de crédito</li>
            </ul>
          </div>
          <div className="relative animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-3xl rounded-full opacity-50"></div>
            <div className="relative bg-card border rounded-2xl shadow-2xl overflow-hidden">
              <div className="border-b bg-muted/50 p-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-xs text-muted-foreground font-medium bg-background px-3 py-1 rounded-md border flex-1 text-center">almacenpro.com/dashboard</div>
              </div>
              <div className="p-8 grid gap-6">
                {/* Mockup elements */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Resumen de Hoy</h3>
                    <p className="text-sm text-muted-foreground">Tus ventas y gastos del día</p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-primary w-5 h-5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-xl p-4 border shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Caja total</p>
                    <p className="text-2xl font-bold">$14,500</p>
                  </div>
                  <div className="bg-background rounded-xl p-4 border shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Ventas</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3"></div>
                  </div>
                  <div className="h-2 w-3/4 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 border-t py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Todo lo que necesitas para tu negocio</h2>
              <p className="text-lg text-muted-foreground">
                Diseñado específicamente para pequeños y medianos comercios que buscan simplificar su gestión diaria.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Control de Stock</h3>
                <p className="text-muted-foreground">
                  Mantén un registro exacto de tus productos, actualiza cantidades y nunca te quedes sin mercadería clave.
                </p>
              </div>
              <div className="bg-background rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Caja Diaria</h3>
                <p className="text-muted-foreground">
                  Registra ingresos y egresos al instante. Conoce exactamente cuánto dinero tienes al final del día.
                </p>
              </div>
              <div className="bg-background rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Estadísticas Claras</h3>
                <p className="text-muted-foreground">
                  Visualiza tus ganancias, productos más vendidos y tendencias para tomar mejores decisiones.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="AlmacénPro" width={24} height={24} className="opacity-50 grayscale" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AlmacénPro. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Términos</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
            <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
