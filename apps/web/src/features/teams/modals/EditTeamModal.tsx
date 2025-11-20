import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/shared/components/ui/select";
import { useState } from "react";
import type { Team, SportLookup, League } from "../types/teams";
import { apiUpdateTeam } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    team: Team;
    sports: SportLookup[];
    leagues: League[];
    onUpdated: (team: Team) => void;
}

export const EditTeamModal = ({
    open,
    onOpenChange,
    team,
    sports,
    leagues,
    onUpdated,
}: Props) => {
    const { token } = useAuth();

    const [name, setName] = useState(team.name);
    const [sportId, setSportId] = useState(team.sport_id ?? "");
    const [leagueId, setLeagueId] = useState(team.league_id ?? "");
    const [season, setSeason] = useState(team.season ?? "");
    const [gender, setGender] = useState<"male" | "female" | "coed" | null>(
        (team.gender as "male" | "female" | "coed" | null) ?? null
    );

    async function handleSave() {
        if (!token) return;

        const updated = await apiUpdateTeam(
            team.id,
            {
                name,
                sport_id: sportId,
                league_id: leagueId,
                season,
                gender,
            },
            token
        );

        if (updated) {
            onUpdated(updated);
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Team</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Select value={sportId} onValueChange={setSportId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sport" />
                        </SelectTrigger>
                        <SelectContent>
                            {sports.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.sport_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={leagueId} onValueChange={setLeagueId}>
                        <SelectTrigger>
                            <SelectValue placeholder="League" />
                        </SelectTrigger>
                        <SelectContent>
                            {leagues.map((l) => (
                                <SelectItem key={l.id} value={l.id}>
                                    {l.league_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        value={season}
                        placeholder="Season"
                        onChange={(e) => setSeason(e.target.value)}
                    />

                    <Select
                        value={gender ?? ""}
                        onValueChange={(v) =>
                            setGender(v as "male" | "female" | "coed")
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="coed">Co-ed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
