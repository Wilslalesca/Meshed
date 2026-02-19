import React, { useState } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import {
    Users,
    Upload,
    ClipboardList,
    Calendar,
    Settings,
    UserPlus,
    CalendarPlus,
    Megaphone,
    CalendarCheck
} from "lucide-react";
import { useUserRole } from "@/shared/hooks/useUserRole";
import type { Team, SportLookup, League } from "../types/teams";
interface Props {
    team: Team;
    sport: SportLookup | null;
    league: League | null;
    viewMode: "cards" | "table";
    onViewModeChange: (v: "cards" | "table") => void;

    onEdit: () => void;
    onDelete: () => void;
    onAddUser: () => void;
    onBulkUpload?: () => void;
    isManagerOverride?: boolean;
    onAddTeamEvent: () => void;
    onCreateNotification: () => void;
    onOptimizeSchedule: () => void;

    children: {
        profile: React.ReactNode;
        roster: React.ReactNode;
        staff: React.ReactNode;
        schedule: React.ReactNode;
    };
}

export const TeamTabs = ({
    team,
    sport,
    league,
    viewMode,
    onViewModeChange,
    onEdit,
    onDelete,
    onAddUser,
    onBulkUpload,
    onAddTeamEvent,
    onCreateNotification,
    onOptimizeSchedule,
    children,
    isManagerOverride,
}: Props) => {
    const userRole = useUserRole();
    const isManager = userRole.isManager;
    const [activeTab, setActiveTab] = useState<"profile" | "roster" | "staff" | "schedule">("profile");
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">{team.name}</h1>

                <p className="text-muted-foreground">
                    {sport?.sport_name ?? "—"} • {league?.league_name ?? "—"}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                    {isManager && (
                    <Button variant="outline" onClick={onEdit}>
                        <Settings size={16} className="mr-2" /> Edit
                    </Button>
                    )}

                    {isManager && (
                    <Button variant="outline" onClick={onDelete}>
                        Delete
                    </Button>
                    )}

                    {isManager && (
                    <>
                        <Button variant="default" onClick={onAddUser}>
                            <UserPlus size={16} className="mr-2" /> Add User
                        </Button>
                        {typeof onBulkUpload === "function" && (
                            <Button variant="default" onClick={onBulkUpload}>
                                <Upload size={16} className="mr-2" /> Bulk Upload CSV
                            </Button>
                        )}
                    </>
                    )}

                    {isManager && (
                    <Button variant="default" onClick={onAddTeamEvent}>
                        <CalendarPlus size={16} className="mr-2" /> Add Event
                    </Button>
                    )}
        
                    {isManager && (
                      <Button variant="default" onClick={onOptimizeSchedule}>
                        <CalendarCheck size={16} className="mr-2" /> Optimize Schedule
                      </Button>
                    )}

                    {isManager && (
                        <Button variant="default" onClick={onCreateNotification}>
                            <Megaphone size={16} className="mr-2" /> Create Notification
                        </Button>
                    )}
                    
                    <div
                    className={`ml-auto flex gap-2 transition-opacity ${
                        activeTab !== "profile" && activeTab !== "schedule"
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                    >
                    <Button
                        variant={viewMode === "cards" ? "default" : "outline"}
                        onClick={() => onViewModeChange("cards")}
                        size="sm"
                    >
                        Cards
                    </Button>
                    <Button
                        variant={viewMode === "table" ? "default" : "outline"}
                        onClick={() => onViewModeChange("table")}
                        size="sm"
                    >
                        Table
                    </Button>

                    </div>


                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full" onValueChange={(v: string) => setActiveTab(v as typeof activeTab)}>
                <TabsList className="w-full">
                    <TabsTrigger
                        value="profile"
                        className="flex items-center gap-1"
                    >
                        <ClipboardList size={16} /> Profile
                    </TabsTrigger>

                    <TabsTrigger
                        value="roster"
                        className="flex items-center gap-1"
                    >
                        <Users size={16} /> Roster
                    </TabsTrigger>

                    <TabsTrigger
                        value="staff"
                        className="flex items-center gap-1"
                    >
                        <Users size={16} /> Staff
                    </TabsTrigger>

                    <TabsTrigger
                        value="schedule"
                        className="flex items-center gap-1"
                    >
                        <Calendar size={16} /> Schedule
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">{children.profile}</TabsContent>
                <TabsContent value="roster">{children.roster}</TabsContent>
                <TabsContent value="staff">{children.staff}</TabsContent>
                <TabsContent value="schedule">{children.schedule}</TabsContent>
            </Tabs>
        </div>
    );
};
