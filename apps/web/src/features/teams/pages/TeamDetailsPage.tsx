import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserRole } from "@/shared/hooks/useUserRole";
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

export const TeamDetailsPage = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const userRole = useUserRole();
    const isManager = userRole.isManager;
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

    const { team, loading, reload: reloadTeam } = useTeamById(teamId!);
    const { roster, removeAthlete, reloadRoster } = useRoster(teamId!);
    const { staff, reloadStaff, removeStaff, updateStaff } = useStaff(teamId!);
    const { sports, leagues } = useLookups();

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openInvite, setOpenInvite] = useState(false);
    const [inviteRole, setInviteRole] = useState<
        "athlete" | "manager"
    >("athlete");

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
                onEdit={isManager ? () => setOpenEdit(true) : () => {}}
                onDelete={
                    isManager ? () => setOpenDelete(true) : () => {}
                }
                onAddUser={
                    isManager
                        ? () => {
                              setOpenInvite(true);
                              setInviteRole("athlete");
                          }
                        : () => {}
                }
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
                                onRemoveAthlete={(id) => removeAthlete(id)}
                            />
                        ) : (
                            <RosterTableView
                                roster={roster}
                                onRemoveAthlete={(id) => removeAthlete(id)}
                            />
                        ),

                    staff: (
                        <TeamStaffTab
                            staff={staff}
                            onUpdated={reloadStaff}
                            onRemoved={(id) => removeStaff(id)}
                        />
                    ),

                    schedule: <TeamScheduleTab />,
                }}
            </TeamTabs>

            {isManager && (
                <EditTeamModal
                    open={openEdit}
                    onOpenChange={setOpenEdit}
                    team={team}
                    sports={sports}
                    leagues={leagues}
                    onUpdated={() => reloadTeam()}
                />
            )}
            {isManager && (
                <DeleteTeamModal
                    open={openDelete}
                    onOpenChange={setOpenDelete}
                    teamId={team.id}
                />
            )}
            {isManager && (
                <InviteMemberModal
                    open={openInvite}
                    onOpenChange={setOpenInvite}
                    teamId={team.id}
                    defaultRole={inviteRole}
                    onInvited={() => {
                        reloadRoster();
                        reloadStaff();
                    }}
                />
            )}
        </div>
    );
};
