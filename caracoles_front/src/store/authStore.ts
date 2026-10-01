import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  nombre_completo: string;
  correo: string;
  saldo?: number;
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
      login: (user) => set({ user, isAuthenticated: true, balance: user.saldo || 0 }),
      logout: () => set({ user: null, isAuthenticated: false, balance: 0 }),
      updateBalance: (amount) => set((state) => ({ balance: Number(state.balance) + Number(amount) })),
    }),
    {
      name: 'carrera-caracoles-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
