import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="AlmacénPro" width={120} height={120} className="mb-4" />
          <h1 className="text-2xl font-bold text-foreground">AlmacénPro</h1>
          <p className="text-muted-foreground mt-1">Tu almacén, organizado</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold">
            Entrar
          </Button>
        </form>

        <p className="text-center mt-6 text-muted-foreground text-sm">
          ¿No tenés cuenta?{' '}
          <button onClick={() => navigate('/dashboard')} className="text-primary font-semibold underline">
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
