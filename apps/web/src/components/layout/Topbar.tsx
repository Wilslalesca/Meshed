import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const Topbar = ({
    onMenuClick,
    isMobile,
    title,
}: {
    onMenuClick(): void;
    isMobile: boolean;
    title: string;
}) => {
    // TODO will talk about this later, but this is notifications if a user gets an update or a coach sends out an update etc
    const [notifications] = useState<string[]>([]);
    const pagetitle = title || "";

    return (
        <header className="h-16 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {isMobile && (
                    <button
                        className="p-2 rounded-md hover:bg-gray-100"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5 text-gray-700" />
                    </button>
                )}
                <h1 className="text-lg font-semibold text-gray-900">{pagetitle}</h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Notification Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell className="h-5 w-5 text-gray-700" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                            )}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-72 rounded-lg border border-gray-200 bg-white shadow-lg"
                    >
                        <DropdownMenuLabel className="text-gray-700">
                            Notifications
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500 text-center">
                                No notifications at this time.
                            </div>
                        ) : (
                            notifications.map((note, i) => (
                                <DropdownMenuItem
                                    key={i}
                                    className="text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    {note}
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
