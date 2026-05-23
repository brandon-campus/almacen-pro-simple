import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.png';
import { useGlobalContext } from '../context/GlobalContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useGlobalContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        await signup(email, password, orgName);
      } else {
        await login(email, password);
      }
    } catch (error) {
      // Los errores ya se manejan con un toast dentro de las funciones del contexto
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="AlmacénPro" width={120} height={120} className="mb-4" />
          <h1 className="text-2xl font-bold text-foreground">AlmacénPro</h1>
          <p className="text-muted-foreground mt-1">Tu almacén, organizado</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Input
                type="text"
                placeholder="Nombre de tu Almacén"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="h-12 text-base"
                required={isSignUp}
              />
            </div>
          )}
          <div>
            <Input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
            {loading ? "Cargando..." : (isSignUp ? "Crear cuenta" : "Entrar")}
          </Button>
        </form>

        <p className="text-center mt-6 text-muted-foreground text-sm">
          {isSignUp ? '¿Ya tienes cuenta?' : '¿No tenés cuenta?'}
          {' '}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-primary font-semibold underline"
          >
            {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
