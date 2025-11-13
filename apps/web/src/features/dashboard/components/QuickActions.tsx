import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; 
import {
  FileUp,
  Calendar,
  User,
  MapPin,
  MessageSquare,
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

    setTimeout(() => {
      setActiveAction(null);
      toast.success(`${label} completed successfully`);
      navigate(path);
    }, 1000);
  };

  const actions = [
    { id: "upload", label: "Upload Schedule", icon: FileUp, path: "/upload" },
    { id: "profile", label: "Edit Profile", icon: User, path: "/profile" },
    { id: "schedule", label: "View Schedule", icon: Calendar, path: "/mySchedule" },
    { id: "facilities", label: "Book Facility", icon: MapPin, path: "/facilities" },
    { id: "messages", label: "Messages", icon: MessageSquare, path: "/messages" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Access your most common student or athlete tools.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="flex h-24 flex-col items-center justify-center gap-1"
              onClick={() => handleAction(action.label, action.path)}
              disabled={activeAction === action.label}
            >
              {activeAction === action.label ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <action.icon className="h-5 w-5" />
              )}
              <span className="text-xs text-center leading-tight">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
