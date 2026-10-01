import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardCharts } from '../components/DashboardCharts';
import { SnailPayModal } from '../components/SnailPayModal';

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const updateBalance = useAuthStore(state => state.updateBalance);

  const [displayBalance, setDisplayBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      const usersStr = localStorage.getItem('mock_users');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const currentUser = users.find((u: any) => u.id === user.id);
        if (currentUser && currentUser.saldo) {
          setDisplayBalance(currentUser.saldo);
        }
      }
    }
  }, [user]);

  if (!user) return null;

  const handleChargeSuccess = (amountToAdd: number, _operationId: string) => {
    updateBalance(amountToAdd);
    const usersStr = localStorage.getItem('mock_users');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const currentUserIndex = users.findIndex((u: any) => u.id === user.id);
      if (currentUserIndex !== -1) {
        users[currentUserIndex].saldo = (users[currentUserIndex].saldo || 0) + amountToAdd;
        localStorage.setItem('mock_users', JSON.stringify(users));
      }
    }

    const balanceElement = document.getElementById('balance-display');
    if (balanceElement) {
      const newTotal = displayBalance + amountToAdd;
      setDisplayBalance(newTotal);
      balanceElement.innerText = '$' + newTotal.toFixed(2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <DashboardHeader
          user={user}
          displayBalance={displayBalance}
          onOpenModal={() => setShowModal(true)}
          onLogout={logout}
        />

        <DashboardCharts />
      </div>

      <SnailPayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={user}
        onSuccess={handleChargeSuccess}
      />
    </div>
  );
};
