import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useIsTeamManager } from "../hooks/useTeamManager";
import { useTeamById } from "../hooks/useTeamById";
import { useRoster } from "../hooks/useRoster";
import { useStaff } from "../hooks/useStaff";
import { useLookups } from "../hooks/useLookups";

import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { TeamTabs } from "../components/TeamTabs";
import { TeamProfileTab } from "../components/tabs/TeamProfileTab";
import { TeamScheduleTab } from "../components/tabs/TeamScheduleTab";
import { TeamStaffTab } from "../components/tabs/TeamStaffTab";
import { TeamRosterTab } from "../components/tabs/TeamRosterTab";
import { EditTeamModal } from "../modals/EditTeamModal";
import { AddTeamEventModal } from "../modals/AddTeamEventModal";
import { DeleteTeamModal } from "../modals/DeleteTeamModal";
import { InviteMemberModal } from "../modals/InviteMemberModal";
import { AddAthleteModal } from "../modals/AddAthleteModal";
import { useTeamSchedule } from "../hooks/useTeamSchedule";
import { startOfWeekISO, endOfWeekISO } from "../Services/isoRange";

export const TeamDetailsPage = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const { isManager } = useIsTeamManager(teamId!);
    const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

    const { team, loading, reload: reloadTeam } = useTeamById(teamId!);
    const { roster, removeAthlete, reloadRoster } = useRoster(teamId!);
    const { staff, reloadStaff, removeStaff } = useStaff(teamId!);
    const [range, setRange] = useState({
        fromISO: startOfWeekISO(),
        toISO: endOfWeekISO(),
    });
    const {events, reload: reloadSchedule} = useTeamSchedule(teamId!,range.fromISO,range.toISO )
    const { sports, leagues } = useLookups();

    const [openEdit, setOpenEdit] = useState(false);
    const [openAddTeamEvent, setOpenAddTeamEvent] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openInvite, setOpenInvite] = useState(false);
    const [openBulkAdd, setOpenBulkAdd] = useState(false);
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
                onBulkUpload={
                    isManager ? () => setOpenBulkAdd(true) : undefined
                }
                isManagerOverride={isManager}
                onAddTeamEvent = {isManager ? () => setOpenAddTeamEvent(true) : () => {}}
            >
                {{
                    profile: (
                        <TeamProfileTab
                            team={team}
                            sport={sport}
                            league={league}
                        />
                    ),

                    roster: (
                        <TeamRosterTab
                            roster={roster}
                            viewMode={viewMode}
                            onRemoveAthlete={(id) => removeAthlete(id)}
                        />
                    ),

                    staff: (
                        <TeamStaffTab
                            staff={staff}
                            onUpdated={reloadStaff}
                            onRemoved={(id) => removeStaff(id)}
                            viewMode={viewMode}
                        />
                    ),

                    schedule: <TeamScheduleTab
                                events={events}
                                range={range}
                                onRangeChange={setRange}
                                onReload={reloadSchedule}
                            />,
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
            {isManager && (
                <>
                <AddAthleteModal
                    open={openBulkAdd}
                    onOpenChange={setOpenBulkAdd}
                    teamId={team.id}
                    onAdded={() => {
                        reloadRoster();
                    }}
                />
                <AddTeamEventModal
                    open={openAddTeamEvent}
                    onOpenChange={setOpenAddTeamEvent}
                    teamId={team.id}
                    onAdded={() => {
                        reloadSchedule();
                    }}
                />
                </>
            )}
        </div>
    );
};
