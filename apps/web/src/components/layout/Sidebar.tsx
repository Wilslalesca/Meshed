import {
  Home, Users, Calendar, Building2, Settings, X, LogOut,
  PanelLeftOpen, PanelLeftClose, User, ChevronUp, ChevronDown,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar = ({
  open, collapsed, isMobile, onClose, onToggleCollapse,
}: {
  open: boolean; collapsed: boolean; isMobile: boolean;
  onClose(): void; onToggleCollapse(): void;
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Schedules", href: "/schedules", icon: Calendar },
    { name: "Facilities", href: "/facilities", icon: Building2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {open && isMobile && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" />
      )}

      <aside
        className={[
          "fixed lg:static z-50 inset-y-0 left-0 flex flex-col",
          "bg-sidebar/95 border-r border-sidebar-border",
          "transition-all duration-300",
          isMobile ? (open ? "translate-x-0 w-full" : "-translate-x-full w-full")
                   : (collapsed ? "lg:w-[72px]" : "lg:w-64"),
        ].join(" ")}
      >
        {/* Header */}
        <div className={`h-16 mt-2 flex items-center justify-between ${collapsed ? "lg:px-2" : "lg:px-4"} px-4`}>
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <img src="/Logo.png" alt="UMA" className="h-8 w-auto" />
              <span className="font-semibold text-lg">UMA</span>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <button onClick={onToggleCollapse}
                className="p-2 rounded-md hover:bg-accent" aria-label="Expand sidebar">
                <PanelLeftOpen className="h-5 w-5 text-foreground/70" />
              </button>
            </div>
          )}

          {!isMobile && !collapsed && (
            <button onClick={onToggleCollapse}
              className="p-2 rounded-md hover:bg-accent text-foreground/70"
              aria-label="Collapse sidebar">
              <PanelLeftClose className="h-5 w-5" />
            </button>
          )}

          {isMobile && (
            <button onClick={onClose} className="p-1 rounded-md hover:bg-accent" aria-label="Close sidebar">
              <X className="h-5 w-5 text-foreground" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pt-2 space-y-1 text-sm">
          {links.map(({ name, href, icon: Icon }) => {
            const isActive = location.pathname === href;
            return (
              <NavLink
                key={name} to={href}
                className={[
                  "relative flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all",
                  isActive
                    ? "text-[--color-vice-teal] bg-accent"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent",
                ].join(" ")}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[--color-vice-pink] rounded-r" />
                )}
                <Icon className={isActive ? "h-4 w-4 text-[--color-vice-teal]" : "h-4 w-4 text-foreground/60"} />
                {!collapsed && name}
              </NavLink>
            );
          })}
        </nav>

        {/* Account */}
        <div className="mt-auto p-4 mb-2">
          <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
            <DropdownMenuTrigger asChild>
              <button className={`w-full flex items-center gap-3 rounded-md p-1 hover:bg-accent transition ${collapsed ? "justify-center" : ""}`}>
                <div className="h-8 w-8 rounded-full bg-foreground/10 flex items-center justify-center font-semibold">
                  {user?.firstName?.[0] ?? "U"}
                </div>
                {!collapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="truncate font-medium text-sm">{user?.firstName ?? "User"}</p>
                    <p className="truncate text-xs opacity-70">{user?.email ?? "example@email.com"}</p>
                  </div>
                )}
                {!collapsed && (openMenu ? <ChevronDown className="h-4 w-4 opacity-60" /> : <ChevronUp className="h-4 w-4 opacity-60" />)}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" side="top" sideOffset={8}
              className="w-56 rounded-lg border border-sidebar-border bg-card/95 shadow-lg">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span className="text-sm font-medium">{user?.firstName ?? "User"}</span>
                <span className="text-xs opacity-70 truncate">{user?.email ?? "example@email.com"}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/profile")}>
                <User className="h-4 w-4 opacity-70" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 opacity-70" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-[--color-vice-orange] cursor-pointer focus:text-[--color-vice-orange]"
                onClick={logout}>
                <LogOut className="h-4 w-4 text-[--color-vice-orange]" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
      </aside>
    </>
  );
};


