import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const apuestasData = [
  { name: 'Ganadas', value: 15 },
  { name: 'Perdidas', value: 10 },
];
const COLORS = ['#22c55e', '#ef4444'];

const carrerasData = [
  { name: 'Rayo', victorias: 2 },
  { name: 'Turbo', victorias: 1 },
  { name: 'Lento', victorias: 0 },
  { name: 'Flash', victorias: 2 },
  { name: 'Sonic', victorias: 1 },
  { name: 'Baba', victorias: 0 },
];

export const Dashboard = () => {
  const { user, balance, logout, updateBalance } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [monto, setMonto] = useState(0);
  const [loading, setLoading] = useState(false);

  const [tarjeta, setTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [nombre, setNombre] = useState(user?.nombre_completo || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (tarjeta !== '1234123412341234') newErrors.tarjeta = 'Tarjeta inválida para prueba';
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) newErrors.vencimiento = 'Usa formato MM/AA ';
    else if (vencimiento !== '12/26') newErrors.vencimiento = 'Vencimiento inválido';
    if (cvv !== '543') newErrors.cvv = 'CVV inválido';
    if (monto <= 0) newErrors.monto = 'El monto debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:3001/api/snailpay/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_tarjeta: tarjeta,
          fecha_vencimiento: vencimiento,
          cvv,
          nombre_completo: nombre,
          monto,
          payer_id: user?.id,
          payer_email: user?.correo
        })
      });
      const data = await response.json();

      if (response.ok && data.status === 'approved') {
        updateBalance(data.transaction_amount);
        alert('Recarga exitosa. Operación: ' + data.id);
        setShowModal(false);
      } else {
        alert('Error en recarga (Backend): ' + (data.status_detail || 'Transacción rechazada'));
      }
    } catch (err) {
      alert('Error de conexión con SnailPay');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setTarjeta('');
    setVencimiento('');
    setCvv('');
    setMonto(0);
    setNombre(user?.nombre_completo || '');
    setErrors({});
    setShowModal(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hola, {user.nombre_completo}</h1>
            <p className="text-gray-500">{user.correo}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Saldo</p>
              <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
            </div>
            <button onClick={handleOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Recargar saldo
            </button>
            <button onClick={logout} className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100">
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Tus Apuestas</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={apuestasData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {apuestasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Victorias del Día (6 Carreras)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carrerasData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="victorias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">SnailPay - Cargar Saldo</h2>
            <form onSubmit={handleCharge} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <input required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium">Tarjeta</label>
                <input required placeholder="1234123412341234" value={tarjeta} onChange={e => setTarjeta(e.target.value)} className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tarjeta ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.tarjeta && <p className="text-red-500 text-xs mt-1">{errors.tarjeta}</p>}
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="text-sm font-medium">Vencimiento</label>
                  <input required placeholder="12/26" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vencimiento ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.vencimiento && <p className="text-red-500 text-xs mt-1">{errors.vencimiento}</p>}
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-medium">CVV</label>
                  <input required placeholder="543" value={cvv} onChange={e => setCvv(e.target.value)} className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Monto</label>
                <input type="number" required min="1" value={monto} onChange={e => setMonto(Number(e.target.value))} className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.monto ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="w-1/2 bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors font-medium">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="w-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors font-medium">
                  {loading ? 'Cargando...' : 'Recargar saldo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
