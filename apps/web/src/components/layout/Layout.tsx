import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const Layout = ({ children, title }: { children: React.ReactNode, title?: string }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pagetitle = title || "";

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
        <div className="flex h-screen w-screen bg-[#F9FAFB] text-gray-900">
            <Sidebar
                open={sidebarOpen}
                collapsed={sidebarCollapsed}
                isMobile={isMobile}
                onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex flex-col flex-1 bg-white mt-2.5 mb-2.5 mr-2.5 ml-1 rounded-lg shadow-md overflow-hidden">
                <Topbar
                    onMenuClick={() =>
                        isMobile
                            ? setSidebarOpen(!sidebarOpen)
                            : setSidebarCollapsed(!sidebarCollapsed)
                    }
                    isMobile={isMobile}
                    title={pagetitle}
                />

                {/* NOTE the padding px and py are set to zero i had them at px-6 and py-4 just so it looked better but some pages may need no margin for example the calendar */}
                <main className="flex-1 overflow-y-auto px-0 py-0">
                    {children}
                </main>
            </div>
        </div>
    );
};
