
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Transaction, TransactionStatus, Student } from '../types';
import { toast } from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'students'>('pending');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const trans = JSON.parse(localStorage.getItem('mock_db_transactions') || '[]');
    const stud = JSON.parse(localStorage.getItem('mock_db_students') || '[]');
    setTransactions(trans);
    setStudents(stud);
  };

  const handleAction = (id: string, approve: boolean) => {
    const updatedTrans = transactions.map(t => {
      if (t.id === id) {
        return { ...t, status: approve ? TransactionStatus.APPROVED : TransactionStatus.REJECTED };
      }
      return t;
    });

    const target = transactions.find(t => t.id === id);
    if (approve && target) {
      // Logic from Aprobar_Rechazar_Expotar in C++
      const existingStudents = [...students];
      const studentIdx = existingStudents.findIndex(s => s.nombre === target.studentName);

      if (studentIdx !== -1) {
        existingStudents[studentIdx].votos += 1;
      } else {
        existingStudents.push({
          id: Date.now().toString(),
          nombre: target.studentName,
          carrera: target.carrera,
          votos: 1
        });
      }
      setStudents(existingStudents);
      localStorage.setItem('mock_db_students', JSON.stringify(existingStudents));
    }

    setTransactions(updatedTrans);
    localStorage.setItem('mock_db_transactions', JSON.stringify(updatedTrans));
    toast.success(`Transacción ${approve ? 'Aprobada' : 'Rechazada'}`);
  };

  const filteredTransactions = transactions.filter(t => t.status === activeTab);

  return (
    <div className="bg-zinc-950 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="font-casino text-4xl gold-text mb-2">CENTRO DE CONTROL ADMIN</h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">Gestionando la transparencia del sistema</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-4">
            <div className="card-premium p-4 rounded-2xl flex flex-col space-y-2">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                <span>RECIBIDAS</span>
                <span className="bg-black/20 px-2 py-0.5 rounded text-xs">{transactions.filter(t => t.status === TransactionStatus.PENDING).length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('approved')}
                className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${activeTab === 'approved' ? 'bg-green-600 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                <span>APROBADAS</span>
                <span className="bg-black/20 px-2 py-0.5 rounded text-xs">{transactions.filter(t => t.status === TransactionStatus.APPROVED).length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('rejected')}
                className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${activeTab === 'rejected' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                <span>RECHAZADAS</span>
                <span className="bg-black/20 px-2 py-0.5 rounded text-xs">{transactions.filter(t => t.status === TransactionStatus.REJECTED).length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('students')}
                className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                <span>ESTUDIANTES</span>
              </button>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            {activeTab === 'students' ? (
              <div className="card-premium rounded-2xl overflow-hidden">
                 <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900 text-amber-500 uppercase tracking-widest text-xs">
                    <tr>
                      <th className="px-6 py-4 font-bold">Carrera</th>
                      <th className="px-6 py-4 font-bold">Estudiante</th>
                      <th className="px-6 py-4 font-bold text-center">Votos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-zinc-900/50">
                        <td className="px-6 py-4 font-medium text-zinc-400">{s.carrera}</td>
                        <td className="px-6 py-4 font-bold text-white">{s.nombre}</td>
                        <td className="px-6 py-4 text-center font-casino text-xl gold-text">{s.votos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                  <div key={t.id} className="card-premium p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-amber-500">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${t.type === 'registration' ? 'bg-blue-500/20 text-blue-500' : 'bg-amber-500/20 text-amber-500'}`}>
                          {t.type === 'registration' ? 'REGISTRO' : 'APUESTA'}
                        </span>
                        <span className="text-zinc-600 text-xs">{new Date(t.createdAt).toLocaleString()}</span>
                      </div>
                      <h3 className="font-bold text-lg text-white">{t.studentName} <span className="text-zinc-500 text-sm font-normal">({t.carrera})</span></h3>
                      <p className="text-zinc-500 text-sm">Apostador: <span className="text-amber-500 font-medium">{t.userName}</span> ({t.correo})</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setViewingReceipt(t.receiptUrl)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 border border-zinc-800"
                      >
                        <i className="fas fa-image"></i>
                        <span>VER RECIBO</span>
                      </button>

                      {t.status === TransactionStatus.PENDING && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAction(t.id, false)}
                            className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white w-10 h-10 rounded-lg transition-all border border-red-600/30 flex items-center justify-center"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                          <button 
                            onClick={() => handleAction(t.id, true)}
                            className="bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white w-10 h-10 rounded-lg transition-all border border-green-600/30 flex items-center justify-center"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                    <p className="text-zinc-500">No hay transacciones en esta categoría.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal for Receipt */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setViewingReceipt(null)}>
          <div className="max-w-4xl w-full bg-zinc-900 p-2 rounded-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setViewingReceipt(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-amber-500 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="overflow-auto max-h-[80vh] flex justify-center">
              {viewingReceipt.startsWith('data:application/pdf') ? (
                <iframe src={viewingReceipt} className="w-full h-[70vh] rounded-lg"></iframe>
              ) : (
                <img src={viewingReceipt} alt="Comprobante" className="max-w-full h-auto rounded-lg shadow-2xl" />
              )}
            </div>
            <div className="p-4 text-center">
              <p className="text-zinc-500 text-xs">Comprobante verificado por el sistema de seguridad CasinoBet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
