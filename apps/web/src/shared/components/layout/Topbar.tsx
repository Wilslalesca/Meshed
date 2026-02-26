import { useEffect, useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/shared/components/ui/command";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
export const Topbar = ({
    onMenuClick,
    isMobile,
}: {
    onMenuClick(): void;
    isMobile: boolean;
}) => {
    const { notifications, unreadCount, markAsRead, refresh } =
        useNotifications();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <header className="h-16 border-b border-border bg-background px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <button
                            className="p-2 rounded-md hover:bg-muted"
                            onClick={onMenuClick}
                        >
                            <Menu className="h-5 w-5 text-foreground" />
                        </button>
                    )}

                    <button
                        onClick={() => setOpen(true)}
                        className="group flex items-center gap-2 rounded-md border border-border bg-background/80 backdrop-blur-sm hover:bg-muted/70 transition-colors px-3 py-2 text-sm text-muted-foreground shadow-sm w-[220px] sm:w-[280px] md:w-[320px]"
                    >
                        <Search className="h-4 w-4 opacity-70 group-hover:opacity-100 transition" />
                        <span className="truncate">Search anything...</span>
                        <kbd className="ml-auto hidden md:flex items-center gap-1 rounded bg-background/80 border border-border px-1.5 font-mono text-[10px] text-muted-foreground shadow-sm">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                <DropdownMenu
                    onOpenChange={(isOpen) => {
                        if (isOpen) refresh(10);
                    }}
                >
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-muted relative transition-colors">
                            <Bell className="h-5 w-5 text-foreground" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-72 rounded-lg border border-border bg-background shadow-lg"
                    >
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                                No notifications at this time.
                            </div>
                        ) : (
                            notifications.map((note) => (
                                <DropdownMenuItem
                                    key={note.id}
                                    onSelect={() => {
                                        if (!note.read_at) {
                                            markAsRead(note.id);
                                        }
                                    }}
                                    className={`flex flex-col items-start gap-1 py-2 ${!note.read_at ? "bg-muted/40" : ""}`}
                                >
                                    <div
                                        className={`${!note.read_at ? "font-medium" : ""}`}
                                    >
                                        {note.message}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(
                                            note.created_at,
                                        ).toLocaleString()}
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Navigation">
                        <CommandItem
                            onSelect={() => location.assign("/dashboard")}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Dashboard
                        </CommandItem>
                        <CommandItem onSelect={() => location.assign("/teams")}>
                            <Search className="mr-2 h-4 w-4" />
                            Teams
                        </CommandItem>
                        <CommandItem
                            onSelect={() => location.assign("/schedules")}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Schedules
                        </CommandItem>
                        <CommandItem
                            onSelect={() => location.assign("/facilities")}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Facilities
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Settings">
                        <CommandItem
                            onSelect={() => location.assign("/settings")}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Settings
                        </CommandItem>
                        <CommandItem
                            onSelect={() => location.assign("/profile")}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Profile
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
};
