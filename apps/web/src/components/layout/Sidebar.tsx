import {
    Home,
    Users,
    Calendar,
    Building2,
    Settings,
    X,
    LogOut,
    PanelLeftOpen,
    PanelLeftClose,
    User,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar = ({
    open,
    collapsed,
    isMobile,
    onClose,
    onToggleCollapse,
}: {
    open: boolean;
    collapsed: boolean;
    isMobile: boolean;
    onClose(): void;
    onToggleCollapse(): void;
}) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const accent = "#346E68";
    const [openMenu, setOpenMenu] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const navigate = useNavigate();

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Teams", href: "/teams", icon: Users },
        {
            name: "Schedules",
            href: "/schedules",
            icon: Calendar,
            subLinks: [{ name: "My Schedule", href: "/myschedule" }],
        },
        { name: "Facilities", href: "/facilities", icon: Building2 },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {open && isMobile && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static z-50 inset-y-0 left-0 flex flex-col bg-[#F9FAFB] border-r border-[#F9FAFB] transition-all duration-300
                  ${
                      isMobile
                          ? open
                              ? "translate-x-0 w-full"
                              : "-translate-x-full w-full"
                          : collapsed
                          ? "lg:w-[72px]"
                          : "lg:w-64"
                  }
                `}
            >
                {/* Header */}
                <div
                    className={`h-16 mt-2 flex items-center justify-between px-4 ${
                        collapsed ? "lg:px-2" : "lg:px-4"
                    }`}
                >
                    {/* Logo  */}
                    {!collapsed ? (
                        <div className="flex items-center gap-2">
                            <img
                                src="/Logo.png"
                                alt="UMA"
                                className="h-8 w-auto"
                            />
                            <span className="font-semibold text-lg">UMA</span>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <button
                                onClick={onToggleCollapse}
                                className="p-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
                                aria-label="Expand sidebar"
                            >
                                <PanelLeftOpen className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    )}

                    {!isMobile && !collapsed && (
                        <button
                            onClick={onToggleCollapse}
                            className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
                            aria-label="Collapse sidebar"
                        >
                            <PanelLeftClose className="h-5 w-5" />
                        </button>
                    )}

                    {isMobile && (
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md hover:bg-gray-200"
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5 text-gray-700" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 pt-2 space-y-1 text-sm">
                    {links.map(({ name, href, icon: Icon, subLinks }) => {
                        const isActive = location.pathname === href;
                        const isOpen = openSubMenu === name;
                        const hasSub = (subLinks?.length ?? 0) > 0;

                        const handleClick = () => {
                            if (hasSub) setOpenSubMenu(isOpen ? null : name);
                            else navigate(href);
                        };

                        return (
                            <div key={name}>
                                <button
                                    onClick={handleClick}
                                    className={`relative flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all ${
                                        isActive
                                            ? `text-[#346E68] bg-white`
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                                >
                                    {isActive && (
                                        <span
                                            className={`absolute left-0 top-0 h-full w-1 rounded-r bg-[#346E68]`}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <Icon
                                        className={`h-4 w-4 ${
                                            isActive
                                                ? `text-[#346E68]`
                                                : "text-gray-500"
                                        }`}
                                    />
                                    {!collapsed && name}
                                    {!collapsed &&
                                        hasSub &&
                                        (isOpen ? (
                                            <ChevronUp className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        ))}
                                </button>

                                {/*SubMenu*/}
                                {hasSub && isOpen && !collapsed && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {subLinks?.map((sub) => (
                                            <NavLink
                                                key={sub.name}
                                                to={sub.href}
                                                className={`relative flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all ${
                                                    isActive
                                                        ? `text-[#346E68] bg-white`
                                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                }`}
                                            >
                                                {sub.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Account */}
                <div className="mt-auto p-4 mb-2">
                    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={`w-full flex items-center gap-3 rounded-md p-1 hover:bg-gray-100 transition ${
                                    collapsed ? "justify-center" : ""
                                }`}
                            >
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                                    {user?.firstName?.[0] ?? "U"}
                                </div>
                                {!collapsed && (
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="truncate font-medium text-sm">
                                            {user?.firstName ?? "User"}
                                        </p>
                                        <p className="truncate text-xs text-gray-500">
                                            {user?.email ?? "example@email.com"}
                                        </p>
                                    </div>
                                )}
                                {!collapsed &&
                                    (openMenu ? (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <ChevronUp className="h-4 w-4 text-gray-400" />
                                    ))}
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            side="top"
                            sideOffset={8}
                            className="w-56 rounded-lg border border-gray-200 bg-white shadow-lg"
                        >
                            <DropdownMenuLabel className="flex flex-col gap-1">
                                <span className="text-sm font-medium">
                                    {user?.firstName ?? "User"}
                                </span>
                                <span className="text-xs text-gray-500 truncate">
                                    {user?.email ?? "example@email.com"}
                                </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => navigate("/profile")}
                            >
                                <User className="h-4 w-4 text-gray-500" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => navigate("/settings")}
                            >
                                <Settings className="h-4 w-4 text-gray-500" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 cursor-pointer focus:text-red-600"
                                onClick={logout}
                            >
                                <LogOut className="h-4 w-4 text-red-600 cursor-pointer focus:text-red-600" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
        </>
    );
};