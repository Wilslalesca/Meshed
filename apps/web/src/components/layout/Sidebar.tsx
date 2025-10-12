import React from 'react';
import { useLocation } from 'react-router-dom';

interface SidebarProps { open: boolean; onClose(): void; }

const links = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Teams', href: '/teams' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Schedules', href: '/schedules' },
//   { label: 'Settings', href: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { pathname } = useLocation();
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
          <span className="font-semibold tracking-wide">Menu</span>
          <button
            className="lg:hidden text-sm px-2 py-1 rounded hover:bg-muted"
            onClick={onClose}
            aria-label="Close sidebar"
          >✕</button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-sm">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <a
                key={l.label}
                href={l.href}
                className={`block px-3 py-2 rounded-md transition
                  ${active
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'}`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-sidebar-border text-xs opacity-70">
          v0.1.0
        </div>
      </aside>
    </>
  );
};