import { useState } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  nombre_completo: string;
  correo: string;
}

interface SnailPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: (amountToAdd: number, operationId: string) => void;
}

export const SnailPayModal: React.FC<SnailPayModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const [tarjeta, setTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [monto, setMonto] = useState(0);
  const [nombre, setNombre] = useState(user.nombre_completo || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (tarjeta !== '1234123412341234') newErrors.tarjeta = 'Tarjeta inválida';
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
          payer_id: user.id,
          payer_email: user.correo
        })
      });
      const data = await response.json();

      if (response.ok && data.status === 'approved') {
        const amountToAdd = Number(monto);
        onSuccess(amountToAdd, data.id);
        toast.success('Recarga exitosa');
        onClose();
      } else {
        toast.error('Error al recargar');
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">SnailPay - Cargar Saldo</h2>
        <form onSubmit={handleCharge} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm font-medium">Tarjeta</label>
            <input required placeholder="Número de tarjeta a 16 dígitos" value={tarjeta} onChange={e => setTarjeta(e.target.value)} className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tarjeta ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.tarjeta && <p className="text-red-500 text-xs mt-1">{errors.tarjeta}</p>}
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-sm font-medium">Vencimiento</label>
              <input required placeholder="MM/AA" value={vencimiento} onChange={e => setVencimiento(e.target.value)} className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vencimiento ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.vencimiento && <p className="text-red-500 text-xs mt-1">{errors.vencimiento}</p>}
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium">CVV</label>
              <input required placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Monto</label>
            <input type="number" required min="1" value={monto} onChange={e => setMonto(Number(e.target.value))} className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.monto ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto}</p>}
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={onClose} className="w-1/2 bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="w-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors font-medium">
              {loading ? 'Cargando...' : 'Recargar saldo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
