
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Student, Transaction, TransactionStatus } from '../types';
import { toast } from 'react-hot-toast';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'visualize' | 'register' | 'bet'>('visualize');
  const [students, setStudents] = useState<Student[]>([]);
  
  // Form States
  const [studentName, setStudentName] = useState('');
  const [carrera, setCarrera] = useState('');
  const [correo, setCorreo] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const saved = JSON.parse(localStorage.getItem('mock_db_students') || '[]');
    setStudents(saved);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande (Máx 5MB)");
        return;
      }
      setReceipt(file);
    }
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receipt) {
      toast.error("Debes subir un comprobante");
      return;
    }

    setLoading(true);
    try {
      const isBet = activeTab === 'bet';
      
      // Validation from C++ logic
      const studentExists = students.some(s => s.nombre === studentName);
      
      if (isBet && !studentExists) {
        toast.error("Nombre de estudiante no existente");
        setLoading(false);
        return;
      }

      if (!isBet && studentExists) {
        toast.error("Nombre de estudiante ya registrado");
        setLoading(false);
        return;
      }

      const base64 = await toBase64(receipt);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        userId: user?.id || '',
        userName: user?.nombre || '',
        studentName,
        carrera,
        correo,
        receiptName: receipt.name,
        receiptUrl: base64,
        status: TransactionStatus.PENDING,
        type: isBet ? 'bet' : 'registration',
        createdAt: new Date().toISOString()
      };

      const transactions = JSON.parse(localStorage.getItem('mock_db_transactions') || '[]');
      transactions.push(newTransaction);
      localStorage.setItem('mock_db_transactions', JSON.stringify(transactions));

      toast.success("Apuesta registrada correctamente. Pendiente de aprobación.");
      setStudentName('');
      setCarrera('');
      setCorreo('');
      setReceipt(null);
      setActiveTab('visualize');
    } catch (err) {
      toast.error("Error al procesar la transacción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-casino text-4xl gold-text mb-2">PANEL DE JUGADOR</h1>
            <p className="text-zinc-500 uppercase tracking-[0.2em] text-sm">Bienvenido, {user?.nombre}</p>
          </div>
          <div className="flex bg-zinc-900 rounded-xl p-1 shadow-inner border border-zinc-800">
            <button 
              onClick={() => setActiveTab('visualize')}
              className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${activeTab === 'visualize' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <i className="fas fa-list"></i>
              <span>ESTUDIANTES</span>
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${activeTab === 'register' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <i className="fas fa-user-plus"></i>
              <span>REGISTRAR</span>
            </button>
            <button 
              onClick={() => setActiveTab('bet')}
              className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${activeTab === 'bet' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <i className="fas fa-dice"></i>
              <span>APOSTAR</span>
            </button>
          </div>
        </header>

        {activeTab === 'visualize' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.length > 0 ? students.sort((a,b) => b.votos - a.votos).map((student, idx) => (
              <div key={student.id} className="card-premium p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 bg-amber-500 text-black font-black text-6xl opacity-10 group-hover:opacity-20 transition-opacity">#{idx + 1}</div>
                <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-wider">{student.nombre}</h3>
                <p className="text-amber-500 text-sm font-medium mb-4">{student.carrera}</p>
                <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <i className="fas fa-ticket-alt text-amber-500"></i>
                    <span className="text-sm">Votos recibidos</span>
                  </div>
                  <span className="text-3xl font-casino gold-text">{student.votos}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                <i className="fas fa-folder-open text-6xl text-zinc-700 mb-4"></i>
                <p className="text-zinc-500">No hay estudiantes participando aún.</p>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'register' || activeTab === 'bet') && (
          <div className="max-w-2xl mx-auto card-premium p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center space-x-3">
              <span className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-black">
                <i className={`fas ${activeTab === 'register' ? 'fa-user-plus' : 'fa-hand-holding-usd'}`}></i>
              </span>
              <span>{activeTab === 'register' ? 'Registrar Estudiante' : 'Realizar Apuesta'}</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-zinc-500 text-xs font-bold uppercase mb-2">Nombre del Estudiante</label>
                  <input 
                    type="text" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 focus:border-amber-500 outline-none"
                    placeholder="Nombre completo..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-xs font-bold uppercase mb-2">Carrera Perteneciente</label>
                  <input 
                    type="text" 
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 focus:border-amber-500 outline-none"
                    placeholder="Ej. Ingeniería..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 text-xs font-bold uppercase mb-2">Tu Correo Electrónico</label>
                <input 
                  type="email" 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 focus:border-amber-500 outline-none"
                  placeholder="apostador@example.com"
                  required
                />
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl mb-4">
                <p className="text-amber-500 font-bold text-sm mb-2"><i className="fas fa-info-circle mr-2"></i>Información de Pago</p>
                <p className="text-zinc-300 text-sm">Pagar a Nequi: <span className="font-bold text-white">3147260658</span></p>
                <p className="text-zinc-500 text-xs mt-1">Sube el comprobante JPG, PNG o PDF (Máx 5MB)</p>
              </div>

              <div className="relative border-2 border-dashed border-zinc-800 rounded-2xl p-8 text-center hover:border-amber-500 transition-colors cursor-pointer group">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {receipt ? (
                  <div className="flex items-center justify-center space-x-3 text-amber-500">
                    <i className="fas fa-file-invoice text-3xl"></i>
                    <div className="text-left">
                      <p className="font-bold truncate max-w-[200px]">{receipt.name}</p>
                      <p className="text-xs">{(receipt.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <i className="fas fa-cloud-upload-alt text-4xl text-zinc-700 group-hover:text-amber-500 mb-2"></i>
                    <p className="text-zinc-500 font-medium">Click para subir comprobante</p>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-gold py-4 rounded-2xl text-lg flex items-center justify-center space-x-2"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : (
                  <>
                    <i className="fas fa-check-circle"></i>
                    <span>CONFIRMAR OPERACIÓN</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
