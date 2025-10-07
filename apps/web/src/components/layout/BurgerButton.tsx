import React from 'react';

interface Props { open: boolean; onClick(): void; }

export const BurgerButton: React.FC<Props> = ({ open, onClick }) => (
  <button
    type="button"
    aria-label="Toggle navigation menu"
    aria-expanded={open}
    onClick={onClick}
    className="inline-flex flex-col justify-center gap-1.5 p-2 rounded-md border border-border hover:bg-muted transition"
  >
    <span className={`h-0.5 w-6 rounded bg-foreground transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
    <span className={`h-0.5 w-6 rounded bg-foreground transition ${open ? 'opacity-0' : ''}`} />
    <span className={`h-0.5 w-6 rounded bg-foreground transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
  </button>
);