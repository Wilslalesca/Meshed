import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useTeamById } from "../hooks/useTeamById";
import { useRoster } from "../hooks/useRoster";
import { useStaff } from "../hooks/useStaff";
import { useLookups } from "../hooks/useLookups";

import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { TeamTabs } from "../components/TeamTabs";
import { TeamProfileTab } from "../components/tabs/TeamProfileTab";
import { RosterCardView } from "../components/RosterCardView";
import { RosterTableView } from "../components/RosterTableView";
import { TeamScheduleTab } from "../components/tabs/TeamScheduleTab";
import { TeamStaffTab } from "../components/tabs/TeamStaffTab";

import { EditTeamModal } from "../modals/EditTeamModal";
import { DeleteTeamModal } from "../modals/DeleteTeamModal";
import { InviteMemberModal } from "../modals/InviteMemberModal";
// import { InviteStaffModal } from "../modals/InviteStaffModal";

export const TeamDetailsPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const { team, loading } = useTeamById(teamId!);
  const { roster, reloadRoster } = useRoster(teamId!);
  const { staff, reloadStaff } = useStaff(teamId!);
  const { sports, leagues } = useLookups();

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openInviteAthlete, setOpenInviteAthlete] = useState(false);
  const [openInviteStaff, setOpenInviteStaff] = useState(false);

  if (loading || !team) return <p className="p-6">Loading...</p>;

  const sport = sports.find((s) => s.id === team.sport_id) ?? null;
  const league = leagues.find((l) => l.id === team.league_id) ?? null;

  return (
    <div className="p-6 space-y-6">

      <Button
        variant="ghost"
        onClick={() => navigate("/teams")}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Teams
      </Button>

      <TeamTabs
        team={team}
        sport={sport}
        league={league}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onEdit={() => setOpenEdit(true)}
        onDelete={() => setOpenDelete(true)}
        onInviteAthlete={() => setOpenInviteAthlete(true)}
        onInviteStaff={() => setOpenInviteStaff(true)}
      >
        {{
          profile: (
            <TeamProfileTab
              team={team}
              sport={sport}
              league={league}
            />
          ),

          roster:
            viewMode === "cards" ? (
              <RosterCardView
                roster={roster}
                onRemoved={() => reloadRoster()}
              />
            ) : (
              <RosterTableView
                roster={roster}
                onRemoved={() => reloadRoster()}
              />
            ),

          staff: (
            <TeamStaffTab
              staff={staff}
              onUpdated={reloadStaff}
              onRemoved={reloadStaff}
            />
          ),

          schedule: <TeamScheduleTab />,
        }}
      </TeamTabs>

      <EditTeamModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        team={team}
      />

      <DeleteTeamModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        teamId={team.id}
      />

      <InviteAthleteModal
        open={openInviteAthlete}
        onOpenChange={setOpenInviteAthlete}
        teamId={team.id}
        onInvited={() => reloadRoster()}
      />

      <InviteStaffModal
        open={openInviteStaff}
        onOpenChange={setOpenInviteStaff}
        teamId={team.id}
        onInvited={() => reloadStaff()}
      />

    </div>
  );
};
