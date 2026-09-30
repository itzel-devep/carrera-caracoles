import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  nombre_completo: string;
  correo: string;
}

interface AuthState {
  user: User | null;
  balance: number;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      balance: 0,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, balance: 0 }),
      updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
    }),
    {
      name: 'carrera-caracoles-auth',
    }
  )
);
