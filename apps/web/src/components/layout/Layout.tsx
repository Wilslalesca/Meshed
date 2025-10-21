import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* #1: Miami gradient + token text on the page wrapper */}
      <div className="min-h-screen w-screen bg-vice-gradient text-foreground flex">
        <Sidebar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onClose={() => setSidebarOpen(false)}
        />

        {/* #2: Token-based panel */}
        <div className="flex flex-col flex-1 m-2 rounded-xl overflow-hidden border border-sidebar-border bg-sidebar/80 backdrop-blur shadow-md">
          <Topbar
            onMenuClick={() =>
              isMobile
                ? setSidebarOpen((v) => !v)
                : setSidebarCollapsed((v) => !v)
            }
            isMobile={isMobile}
          />

          {/* keep zero padding */}
          <main className="flex-1 overflow-y-auto px-0 py-0">{children}</main>
        </div>
      </div>
    </>
  );
};
