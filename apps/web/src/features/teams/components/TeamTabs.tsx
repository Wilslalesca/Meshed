import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import type { Team, SportLookup, League } from "../types/teams";
import type { Athlete } from "../types/roster";

interface TeamTabsProps {
  team: Team;
  sport: SportLookup | null;
  league: League | null;
  roster: Athlete[];
  viewMode: "cards" | "table";
  onViewModeChange: (v: "cards" | "table") => void;
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
  roster,
  viewMode,
  onViewModeChange,
  children,
}: TeamTabsProps) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-4 max-w-md">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="roster">Roster</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>

      {/* Profile */}
      <TabsContent value="profile">{children.profile}</TabsContent>

      {/* Roster */}
      <TabsContent value="roster">
        <div className="flex justify-end mb-4">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            onClick={() => onViewModeChange("cards")}
            className="mr-2"
          >
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => onViewModeChange("table")}
          >
            Table
          </Button>
        </div>
        {children.roster}
      </TabsContent>

      <TabsContent value="staff">{children.staff}</TabsContent>

      <TabsContent value="schedule">{children.schedule}</TabsContent>
    </Tabs>
  );
};
