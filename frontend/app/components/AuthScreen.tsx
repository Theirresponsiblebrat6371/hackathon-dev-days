'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../lib/authStore';
import { useAppStore } from '../lib/store';
import { authLogin, authRegister } from '../lib/api';
import { ArrowRight, Leaf, EyeOff, Eye, Sparkles } from 'lucide-react';

type Mode = 'login' | 'register';
interface FieldError { name?: string; email?: string; password?: string; confirm?: string; general?: string; }

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { setAuth } = useAuthStore();
  const { setPhase } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
      tl.fromTo('.auth-image-bg', { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 })
        .fromTo('.auth-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15 }, '-=1.2')
        .fromTo('.auth-card-anim', { x: 40, opacity: 0 }, { x: 0, opacity: 1 }, '-=1.0');
    });
  }, []);

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    import('gsap').then(({ gsap }) => {
      gsap.to(formRef.current, { x: -20, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
        setMode(next); setErrors({});
        gsap.fromTo(formRef.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
      }});
    });
  };

  const validate = (): boolean => {
    const e: FieldError = {};
    if (mode === 'register' && !name.trim()) e.name = 'Name is required';
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (mode === 'register' && password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const data = mode === 'login'
        ? await authLogin(email, password)
        : await authRegister(name, email, password);
      setAuth(data.user, data.accessToken, data.refreshToken);
      import('gsap').then(({ gsap }) => {
        gsap.to(containerRef.current, { opacity: 0, scale: 0.98, duration: 0.6, ease: 'power2.inOut', onComplete: () => setPhase('landing') });
      });
    } catch (err: any) {
      setErrors({ general: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden relative bg-[#faf7f2]">
      {/* Left side Editorial Typography */}
      <div className="auth-image-bg lg:w-1/2 w-full p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-[#e3e6df]">
        <div className="absolute inset-0 z-0 opacity-40" style={{ background: 'radial-gradient(circle at center, var(--accent-light) 0%, transparent 70%)' }}></div>
        
        <div className="flex items-center gap-3 relative z-10 auth-title">
          <div className="w-12 h-12 rounded-full bg-[#1a1c19] flex items-center justify-center text-white">
            <Leaf size={22} className="text-[#faf7f2]" />
          </div>
          <span className="font-mono text-sm tracking-[0.25em] font-medium text-[#1a1c19] uppercase">ReLife AI</span>
        </div>

        <div className="relative z-10 mt-20 lg:mt-0 font-serif leading-[1.1]">
          <h1 className="text-[clamp(3.5rem,8vw,7rem)] tracking-tight text-[#1a1c19] auth-title">
            Restore.
          </h1>
          <h1 className="text-[clamp(3.5rem,8vw,7rem)] tracking-tight text-[#1a1c19] auth-title opacity-70 italic">
            Renew.
          </h1>
          <h1 className="text-[clamp(3.5rem,8vw,7rem)] tracking-tight text-[#758d6e] auth-title">
            ReLife.
          </h1>
          <p className="mt-8 font-sans text-lg text-[#5e635b] max-w-md auth-title">
            Join a new paradigm of sustainability. Advanced AI diagnostics meet mindful repair.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-8 lg:p-16 z-10 relative">
        <div className="auth-card-anim w-full max-w-md glass-panel p-8 lg:p-12 rounded-[2rem]">
          <div className="flex bg-[rgba(255,255,255,0.4)] rounded-full p-1.5 mb-10 w-full relative">
            <div className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] bg-white rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm" style={{ transform: mode === 'register' ? 'translateX(100%)' : 'translateX(0)' }}></div>
            {(['login', 'register'] as Mode[]).map(m => (
              <button key={m} onClick={() => switchMode(m)} className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-colors relative z-10 ${mode === m ? 'text-[#1a1c19]' : 'text-[#5e635b]'}`}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5e635b] uppercase tracking-wider">Full Name</label>
                  <input className={`auth-input ${errors.name ? 'border-red-400' : ''}`} type="text" placeholder="Ada Lovelace" value={name} onChange={e => setName(e.target.value)} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#5e635b] uppercase tracking-wider">Email Address</label>
                <input className={`auth-input ${errors.email ? 'border-red-400' : ''}`} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#5e635b] uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input className={`auth-input pr-12 ${errors.password ? 'border-red-400' : ''}`} type={showPass ? 'text' : 'password'} placeholder="8+ characters" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5e635b] hover:text-[#1a1c19] transition-colors p-1">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5e635b] uppercase tracking-wider">Confirm Password</label>
                  <input className={`auth-input ${errors.confirm ? 'border-red-400' : ''}`} type={showPass ? 'text' : 'password'} placeholder="Match password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                  {errors.confirm && <p className="text-red-500 text-xs">{errors.confirm}</p>}
                </div>
              )}

              {errors.general && (
                <div className="bg-red-50 text-red-800 text-sm p-4 rounded-xl border border-red-200 flex items-start gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="primary-btn w-full py-4 mt-6 text-base shadow-sm">
                <span>
                  {loading ? (
                    <div className="flex gap-1.5 justify-center py-1">
                      <div className="dot" /><div className="dot" /><div className="dot" />
                    </div>
                  ) : (
                    mode === 'login' ? <span className="flex items-center gap-2">Enter Portal <ArrowRight size={18} /></span> : <span className="flex items-center gap-2">Join Movement <ArrowRight size={18} /></span>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
