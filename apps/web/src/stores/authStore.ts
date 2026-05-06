import { create } from 'zustand';

interface User {
  id: number;
  login: string;
  avatar_url?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  guestId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  quota: { limit: number; remaining: number; reset_at: number } | null;
  setUser: (user: User | null) => void;
  setGuestId: (id: string | null) => void;
  setQuota: (quota: AuthState['quota']) => void;
  setLoading: (loading: boolean) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  guestId: typeof window !== 'undefined' ? localStorage.getItem('portfolio_guest_id') : null,
  isAuthenticated: false,
  isLoading: true,
  quota: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setGuestId: (id) => {
    if (id) localStorage.setItem('portfolio_guest_id', id);
    else localStorage.removeItem('portfolio_guest_id');
    set({ guestId: id });
  },
  setQuota: (quota) => set({ quota }),
  setLoading: (loading) => set({ isLoading: loading }),
  login: (token, user) => {
    localStorage.setItem('portfolio_access_token', token);
    localStorage.removeItem('portfolio_guest_id');
    set({ user, isAuthenticated: true, guestId: null });
  },
  logout: () => {
    localStorage.removeItem('portfolio_access_token');
    localStorage.removeItem('portfolio_guest_id');
    set({ user: null, isAuthenticated: false, guestId: null });
  },
}));
