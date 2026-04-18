'use client';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../lib/authStore';
import { useAppStore } from '../lib/store';
import { authMe } from '../lib/api';
import Lenis from 'lenis';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, setInitialized, setLoading } = useAuthStore();
  const { setPhase } = useAppStore();
  const initRef = useRef(false);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem('relife_access_token');
      const refreshToken = localStorage.getItem('relife_refresh_token');

      if (!accessToken || !refreshToken) {
        setPhase('auth');
        setInitialized();
        setLoading(false);
        return;
      }

      try {
        const { user } = await authMe();
        setAuth(user, accessToken, refreshToken);
        setPhase('landing');
      } catch {
        clearAuth();
        setPhase('auth');
      } finally {
        setInitialized();
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <>
      <div className="noise-bg" />
      {children}
    </>
  );
}
