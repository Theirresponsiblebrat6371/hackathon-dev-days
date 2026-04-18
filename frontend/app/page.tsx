import Image from "next/image";
import AppInitializer from './components/AppInitializer';
import AuthScreen from './components/AuthScreen';
import LandingScreen from './components/LandingScreen';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

function ErrorToast() {
  const { error, setError } = useAppStore();
  if (!error) return null;
  return (
    <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', background: '#fff1f0', border: '1px solid #fca5a5', borderRadius: 12, padding: '0.7rem 1.2rem', zIndex: 200, maxWidth: '90vw', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 16px rgba(0,0,0,.12)', fontSize: '0.875rem', color: '#991b1b', fontFamily: 'var(--fb)' }}>
      <span>⚠️ {error}</span>
      <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', fontSize: '1.1rem', color: '#991b1b', cursor: 'pointer', lineHeight: 1 }}>×</button>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(155deg,#f5f0e8,#edf5e8)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#3d8a20,#5ca836)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 1rem', boxShadow: '0 6px 20px rgba(61,138,32,0.28)', animation: 'spin 2s linear infinite' }}>♻️</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <div className="dot" /><div className="dot" /><div className="dot" />
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

export default function Page() {
  const { phase } = useAppStore();
  const { isInitialized } = useAuthStore();

  return (
    <AppInitializer>
      <ErrorToast />
      {!isInitialized ? <LoadingScreen /> : (
        <>
          {phase === 'auth' && <AuthScreen />}
          {phase === 'landing' && <LandingScreen />}
          
        </>
      )}
    </AppInitializer>
  );
}
