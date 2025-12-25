
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const storedUsers = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
    const storedAdmins = JSON.parse(localStorage.getItem('mock_db_admins') || '[]');

    if (isAdmin) {
      // C++ Limit: 1 Admin
      if (storedAdmins.length >= 1) {
        toast.error("Error: Se ha alcanzado el límite máximo de (1) administradores.");
        setLoading(false);
        return;
      }
      if (nombre.length < 3 || nombre.length > 10) {
        toast.error("ID Admin no válido (4-10 caracteres)");
        setLoading(false);
        return;
      }
      if (password.length < 4 || password.length > 12) {
        toast.error("Password Admin no válido (5-12 caracteres)");
        setLoading(false);
        return;
      }
      
      storedAdmins.push({ id: nombre, password });
      localStorage.setItem('mock_db_admins', JSON.stringify(storedAdmins));
      toast.success("Admin registrado correctamente");
      navigate('/login');
    } else {
      if (nombre.length < 3) {
        toast.error("Nombre muy corto");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("Password muy corto (min 6)");
        setLoading(false);
        return;
      }
      
      const userExists = storedUsers.find((u: any) => u.nombre === nombre);
      if (userExists) {
        toast.error("Nombre de usuario ya usado");
        setLoading(false);
        return;
      }

      storedUsers.push({ nombre, password });
      localStorage.setItem('mock_db_users', JSON.stringify(storedUsers));
      toast.success("Usuario registrado con éxito");
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=5')] bg-cover">
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="card-premium w-full max-w-md p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <i className="fas fa-user-plus text-5xl text-amber-500 mb-4"></i>
          <h2 className="font-casino text-3xl gold-text mb-2">CREAR CUENTA</h2>
          <p className="text-zinc-500 text-sm">Únete a la élite de los apostadores</p>
        </div>

        <div className="flex mb-6 bg-zinc-900 p-1 rounded-lg">
          <button onClick={() => setIsAdmin(false)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isAdmin ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}>USUARIO</button>
          <button onClick={() => setIsAdmin(true)} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isAdmin ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}>ADMIN</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-widest">{isAdmin ? 'ID de Administrador' : 'Nombre de Usuario'}</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-amber-500"
              placeholder="Ingresa tu identificación..."
              required
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-widest">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-amber-500"
              placeholder="Min 6 caracteres..."
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-gold py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center space-x-2"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <span>REGISTRARSE</span>}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          ¿Ya tienes cuenta? {' '}
          <Link to="/login" className="text-amber-500 font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
