
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Replicating C++ length validations
    if (isAdmin) {
      if (nombre.length < 3 || nombre.length > 10) {
        toast.error("El ID debe tener entre 4 y 10 caracteres");
        setLoading(false);
        return;
      }
      if (password.length < 4 || password.length > 12) {
        toast.error("El Password debe tener entre 5 y 12 caracteres");
        setLoading(false);
        return;
      }
    } else {
      if (nombre.length < 3) {
        toast.error("El nombre de usuario es muy corto (mínimo 3)");
        setLoading(false);
        return;
      }
      if (password.length < 6 || password.length > 12) {
        toast.error("El password debe tener entre 6 y 12 caracteres");
        setLoading(false);
        return;
      }
    }

    try {
      // Mocking Backend Auth Logic based on C++ structures
      // In a real environment, this would be a fetch to /api/login
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      
      // Simulating C++ strcmp check logic
      const storedUsers = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
      const storedAdmins = JSON.parse(localStorage.getItem('mock_db_admins') || '[]');
      
      if (isAdmin) {
        const foundAdmin = storedAdmins.find((a: any) => a.id === nombre && a.password === password);
        if (foundAdmin) {
          login({ id: foundAdmin.id, nombre: foundAdmin.id, role: UserRole.ADMIN }, mockToken);
          toast.success("Admin Iniciado Correctamente");
          navigate('/admin');
        } else {
          toast.error("Error: ID o password incorrecto");
        }
      } else {
        const foundUser = storedUsers.find((u: any) => u.nombre === nombre && u.password === password);
        if (foundUser) {
          login({ id: foundUser.nombre, nombre: foundUser.nombre, role: UserRole.USER }, mockToken);
          toast.success("Sesión Iniciada Correctamente");
          navigate('/dashboard');
        } else {
          toast.error("Error: Usuario o password incorrecto");
        }
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[url('https://picsum.photos/1920/1080?blur=10&grayscale')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="card-premium w-full max-w-md p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <i className="fas fa-crown text-5xl text-amber-500 mb-4 animate-pulse"></i>
          <h2 className="font-casino text-3xl gold-text mb-2">INICIAR SESIÓN</h2>
          <p className="text-zinc-500 text-sm">Bienvenido al Olimpo de las Apuestas</p>
        </div>

        <div className="flex mb-6 bg-zinc-900 p-1 rounded-lg">
          <button 
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isAdmin ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            USUARIO
          </button>
          <button 
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isAdmin ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            ADMIN
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-widest">{isAdmin ? 'ID Admin' : 'Nombre de Usuario'}</label>
            <div className="relative">
              <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50"></i>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500"
                placeholder={isAdmin ? "ID Admin..." : "Nombre de usuario..."}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-widest">Contraseña</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50"></i>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500"
                placeholder="********"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-gold py-4 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (
              <>
                <span>INGRESAR AL PANEL</span>
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            ¿No tienes cuenta? {' '}
            <Link to="/register" className="text-amber-500 font-bold hover:underline">Regístrate ahora</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
