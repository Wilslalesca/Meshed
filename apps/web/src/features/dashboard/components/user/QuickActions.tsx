import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    Contact2,
    Users,
    Settings,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/shared/components/ui/card";

export const QuickActions = () => {
    const navigate = useNavigate();
    const [activeAction, setActiveAction] = useState<string | null>(null);

    const handleAction = (label: string, path: string) => {
        setActiveAction(label);
        navigate(path);
    };

    const actions = [
        {
            id: "schedule",
            label: "My Schedule",
            icon: Calendar,
            path: "/mySchedule",
        },
        {
            id: "teams",
            label: "My Teams",
            icon: Users,
            path: "/teams",
        },
        {
            id: "profile",
            label: "My Profile",
            icon: Contact2,
            path: "/profile",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/profile",
        },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                    Access your most common student or athlete tools.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-3">
                    {actions.map((action) => (
                        <Button
                            key={action.id}
                            variant="outline"
                            className="flex h-full flex-col items-center justify-center gap-2"
                            onClick={() =>
                                handleAction(action.label, action.path)
                            }
                            disabled={activeAction === action.label}
                        >
                            {activeAction === action.label ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                <action.icon className="h-5 w-5" />
                            )}
                            <span className="text-center text-xs leading-tight">
                                {action.label}
                            </span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
