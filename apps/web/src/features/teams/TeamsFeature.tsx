import { useTeams } from "./hooks/useTeams";
import { useRoster } from "./hooks/useRoster";
import { useLookups } from "./hooks/useLookups";
import { useAuth } from "@/shared/hooks/useAuth";
import { useUserRole } from "@/shared/hooks/useUserRole";

import { TeamGrid } from "./components/TeamGrid";
import { TeamDetailsPanel } from "./components/TeamDetailsPanel";
import { RosterCard } from "./components/RosterCard";
import { AddAthleteForm } from "./components/AddAthleteForm";
import { CreateTeamForm } from "./components/CreateTeamForm";

import {
  apiAddAthleteByEmail,
  apiCreateTeam,
} from "./api/teams";

export const TeamsFeature = () => {
  const { token } = useAuth();
  const { isManager, isAdmin } = useUserRole();
  const canManage = isManager || isAdmin;

  const {
    teams,
    loading,
    selectedTeamId,
    setSelectedTeamId,
    reloadTeams,
  } = useTeams();

  const { roster, reload: reloadRoster } = useRoster(selectedTeamId);
  const { sports, leagues } = useLookups();

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? null;

  const selectedSport = selectedTeam
    ? sports.find((s) => s.id === selectedTeam.sport_id) ?? null
    : null;

  const selectedLeague = selectedTeam
    ? leagues.find((l) => l.id === selectedTeam.league_id) ?? null
    : null;

  const onAddAthlete = async (email: string) => {
    if (!token || !selectedTeamId) return;
    const res = await apiAddAthleteByEmail(selectedTeamId, email, token);
    if (res.success) reloadRoster();
  };

  const onCreateTeam = async (data: any) => {
    if (!token) return;
    const res = await apiCreateTeam(data, token);
    if (res) {
      await reloadTeams(); 
      setSelectedTeamId(res.id); 
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-3 space-y-6">
        {!loading && (
          <TeamGrid
            teams={teams}
            selectedId={selectedTeamId}
            onSelect={setSelectedTeamId}
            rosterCounts={{}}
          />
        )}

        {selectedTeam && (
          <>
            {canManage && (
              <AddAthleteForm onAdd={onAddAthlete} />
            )}
            <RosterCard roster={roster} />
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-1 space-y-6">
        <TeamDetailsPanel
          team={selectedTeam}
          sport={selectedSport}
          league={selectedLeague}
        />

        {canManage && (
          <CreateTeamForm
            sports={sports}
            leagues={leagues}
            onCreate={onCreateTeam}
          />
        )}
      </div>
    </div>
  );
};
