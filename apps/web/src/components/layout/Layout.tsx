import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BurgerButton } from './BurgerButton';
import Logo from '@/assets/Logo.png';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps { children: React.ReactNode; title?: string; }

export const Layout: React.FC<LayoutProps> = ({ children, title = 'UMA' }) => {
  const [open, setOpen] = React.useState(false);
  const { pathname } = useLocation();
  const { token } = useAuth(); // minimal usage

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      <header className="h-14 flex items-center gap-4 px-4 border-b border-border bg-card/70 backdrop-blur">
        <BurgerButton open={open} onClick={() => setOpen(o => !o)} />
        <a href="/" className="flex items-center gap-2 select-none">
          <img src={Logo} alt="UMA Logo" className="h-7 w-auto" />
          <span className="text-sm font-semibold tracking-wide">{title}</span>
        </a>
        <div className="ml-auto flex items-center gap-2">
          {token ? (
            <a
              href="/settings"
              className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition text-sm"
              aria-label="User settings"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </a>
          ) : (
            <a
              href="/login"
              className="text-sm px-3 py-1 rounded-md border border-border hover:bg-muted transition"
            >
              Login
            </a>
          )}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};