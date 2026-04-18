'use client';
import { create } from 'zustand';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  analysisCount?: number;
  itemsSaved?: number;
  co2Saved?: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setLoading: (v: boolean) => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isInitialized: false,

  setAuth: (user, accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('relife_access_token', accessToken);
      localStorage.setItem('relife_refresh_token', refreshToken);
    }
    set({ user, accessToken, refreshToken });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('relife_access_token');
      localStorage.removeItem('relife_refresh_token');
    }
    set({ user: null, accessToken: null, refreshToken: null });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: () => set({ isInitialized: true })
}));
