import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(false);
      else setSidebarOpen(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-brand-soft text-foreground flex">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Use tokens so the panel is clearly distinct from the page */}
      <div className="flex flex-col flex-1 m-2 rounded-xl overflow-hidden border border-[--color-border] bg-[--color-paper] text-[--color-foreground] shadow-md">
        <Topbar
          onMenuClick={() =>
            isMobile
              ? setSidebarOpen((v) => !v)
              : setSidebarCollapsed((v) => !v)
          }
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
