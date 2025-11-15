import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { SportLookup, League, CreateTeamPayload } from "../types/teams";

interface CreateTeamFormProps {
  sports: SportLookup[];
  leagues: League[];
  onCreate: (data: CreateTeamPayload) => void;
}

export const CreateTeamForm = ({ sports, leagues, onCreate }: CreateTeamFormProps) => {
  const [form, setForm] = useState<CreateTeamPayload>({
    name: "",
    season: "",
    sport_id: null,
    league_id: null,
    gender: null,
  });

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value || null }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Team</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3 text-sm">
        <Input
          name="name"
          placeholder="Team name"
          value={form.name}
          onChange={change}
          required
        />

        <Input
          name="season"
          placeholder="2025"
          value={form.season ?? ""}
          onChange={change}
        />

        <select
          name="sport_id"
          value={form.sport_id ?? ""}
          onChange={change}
          className="border rounded p-2"
        >
          <option value="">Select sport</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.sport_name}
            </option>
          ))}
        </select>

        <select
          name="league_id"
          value={form.league_id ?? ""}
          onChange={change}
          className="border rounded p-2"
        >
          <option value="">Select league</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.league_name}
            </option>
          ))}
        </select>

        <select
          name="gender"
          value={form.gender ?? ""}
          onChange={change}
          className="border rounded p-2"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="coed">Co-ed</option>
        </select>

        <Button onClick={() => onCreate(form)}>Create</Button>
      </CardContent>
    </Card>
  );
};
