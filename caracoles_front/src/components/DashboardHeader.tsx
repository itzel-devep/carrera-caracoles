
interface User {
  id: string;
  nombre_completo: string;
  correo: string;
}

interface DashboardHeaderProps {
  user: User;
  displayBalance: number;
  onOpenModal: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, displayBalance, onOpenModal, onLogout }) => {
  return (
    <header className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hola, {user.nombre_completo}</h1>
        <p className="text-gray-500">{user.correo}</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Saldo</p>
          <p id="balance-display" className="text-3xl font-bold text-green-600">${displayBalance.toFixed(2)}</p>
        </div>
        <button onClick={onOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Recargar saldo
        </button>
        <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};
