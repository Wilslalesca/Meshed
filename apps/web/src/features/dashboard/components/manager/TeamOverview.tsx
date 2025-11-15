import {
    CardHeader,
    CardTitle,
    CardContent,
} from "@/shared/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/shared/components/ui/select";

interface TeamOverviewData {
    teamId: string;
    teamName: string;
    count: number;
    attendanceRate?: number;
    alerts: number;
    upcomingSession?: {
        time: string;
        location: string;
    };
}

export const TeamOverview = ({
    teams,
    selectedTeamId,
    onTeamChange,
}: {
    teams: TeamOverviewData[];
    selectedTeamId: string;
    onTeamChange: (teamId: string) => void;
}) => {
    const selected = teams.find((t) => t.teamId === selectedTeamId);

    if (!teams || teams.length === 0) {
        return (
            <>
                <CardHeader>
                    <CardTitle>Your Team</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[230px] flex items-center justify-center text-muted-foreground">
                    No team data available.
                </CardContent>
            </>
        );
    }

    if (!selected) {
        return (
            <>
                <CardHeader>
                    <CardTitle>Your Team</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[230px] flex items-center justify-center text-muted-foreground">
                    Select a team to view details.
                </CardContent>
            </>
        );
    }

    return (
        <>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Your Team</CardTitle>

                <Select value={selectedTeamId} onValueChange={onTeamChange}>
                    <SelectTrigger className="h-8 w-40 text-sm">
                        <SelectValue placeholder="Select team" />
                    </SelectTrigger>

                    <SelectContent>
                        {teams.map((team) => (
                            <SelectItem key={team.teamId} value={team.teamId}>
                                {team.teamName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm flex justify-between">
                    <span>Members:</span>
                    <span className="font-semibold">{selected.count}</span>
                </p>

                {selected.attendanceRate !== undefined && (
                    <p className="text-sm flex justify-between">
                        <span>Attendance Rate:</span>
                        <span className="font-semibold">
                            {selected.attendanceRate}%
                        </span>
                    </p>
                )}

                <p className="text-sm flex justify-between">
                    <span>Alerts:</span>
                    <span className="font-semibold">{selected.alerts}</span>
                </p>

                <div className="text-sm pt-3">
                    <p className="font-medium">Upcoming Session:</p>
                    {selected.upcomingSession ? (
                        <p className="text-muted-foreground">
                            {selected.upcomingSession.time} — {selected.upcomingSession.location}
                        </p>
                    ) : (
                        <p className="text-muted-foreground">No upcoming session.</p>
                    )}
                </div>
            </CardContent>
        </>
    );
};
