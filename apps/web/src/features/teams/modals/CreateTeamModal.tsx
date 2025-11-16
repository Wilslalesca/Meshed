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
import type { SportLookup, League } from "../types/teams";
import { apiCreateTeam } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (teamId: string) => void;
  sports: SportLookup[];
  leagues: League[];
}

export const CreateTeamModal = ({
  open,
  onOpenChange,
  onCreated,
  sports,
  leagues,
}: Props) => {
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [sportId, setSportId] = useState<string | null>(null);
  const [leagueId, setLeagueId] = useState<string | null>(null);
  const [season, setSeason] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "coed" | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!token) return;
    setLoading(true);

    const body = {
      name,
      sport_id: sportId,
      league_id: leagueId,
      season,
      gender,
    };

    const res = await apiCreateTeam(body, token);
    setLoading(false);

    if (res?.id) {
      onOpenChange(false);
      onCreated(res.id);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* SPORT */}
          <Select value={sportId ?? ""} onValueChange={(v) => setSportId(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.sport_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* LEAGUE */}
          <Select value={leagueId ?? ""} onValueChange={(v) => setLeagueId(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select league" />
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
            placeholder="Season (e.g., 2025)"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />

          <Select value={gender ?? ""} onValueChange={(v) => setGender(v as any)}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading || !name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
