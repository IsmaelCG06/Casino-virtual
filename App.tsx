
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster, toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('casino_user');
    const token = localStorage.getItem('casino_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('casino_user', JSON.stringify(userData));
    localStorage.setItem('casino_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('casino_user');
    localStorage.removeItem('casino_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === UserRole.ADMIN
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactElement, adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate('/login');
  };

  return (
    <nav className="border-b border-amber-500/20 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <i className="fas fa-dice-d20 text-3xl text-amber-500"></i>
            <span className="font-casino text-2xl gold-text tracking-widest uppercase">CASINOBET</span>
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-zinc-400 text-sm hidden md:block">Bienvenido, <span className="text-amber-500 font-bold">{user?.nombre}</span></span>
                <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-400 uppercase tracking-tighter">
                  Salir <i className="fas fa-sign-out-alt ml-1"></i>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-gold px-4 py-2 rounded-md text-sm">Ingresar</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute adminOnly>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="bg-black py-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
            <p>&copy; 2024 CASINOBET. El juego responsable es nuestra prioridad.</p>
          </footer>
        </div>
        <Toaster position="top-right" />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
