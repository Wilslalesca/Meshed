import { Bell } from "lucide-react";

export const PageContainer = ({
    title,
    children,
    action,
}: {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}) => {
    return (
        <div className="flex flex-col h-full">
            {/* top bar */}
            <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6">
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                <div className="flex items-center gap-4">
                    {action}
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <Bell className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </header>

            {/* main content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
