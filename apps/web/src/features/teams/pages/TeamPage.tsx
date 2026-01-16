import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTeams } from "../hooks/useTeams";
import { useLookups } from "../hooks/useLookups";

import { TeamManagementToolbar } from "../components/TeamManagementToolbar";
import { TeamGrid } from "../components/TeamGrid";
import { CreateTeamModal } from "../modals/CreateTeamModal";

export const TeamsPage = () => {
    const navigate = useNavigate();

    const { teams, loading, reloadTeams } = useTeams();
    const { sports, leagues } = useLookups();
    
    const [search, setSearch] = useState("");
    const [sportFilter, setSportFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");
    const [sort, setSort] = useState("newest");

    const [openCreateTeam, setOpenCreateTeam] = useState(false);

    const filteredTeams = useMemo(() => {
        let list = [...teams];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((t) => t.name.toLowerCase().includes(q));
        }

        if (sportFilter !== "all") {
            list = list.filter((t) => t.sport_id === sportFilter);
        }

        if (genderFilter !== "all") {
            list = list.filter((t) => t.gender === genderFilter);
        }

        list.sort((a, b) => {
            if (sort === "alphabetical") return a.name.localeCompare(b.name);
            if (sort === "newest")
                return (
                    new Date(b.created_at!).getTime() -
                    new Date(a.created_at!).getTime()
                );
            if (sort === "oldest")
                return (
                    new Date(a.created_at!).getTime() -
                    new Date(b.created_at!).getTime()
                );
            return 0;
        });

        return list;
    }, [teams, search, sportFilter, genderFilter, sort]);

    return (
        <div className="p-6 space-y-6">
            <TeamManagementToolbar
                search={search}
                onSearchChange={setSearch}
                sportFilter={sportFilter}
                onSportFilterChange={setSportFilter}
                genderFilter={genderFilter}
                onGenderFilterChange={setGenderFilter}
                sort={sort}
                onSortChange={setSort}
                sports={sports}
                onAddTeam={() => setOpenCreateTeam(true)}
            />

            {!loading && (
                <TeamGrid
                    teams={filteredTeams}
                    onSelect={(id: any) => navigate(`/teams/${id}`)}
                    rosterCounts={{}}
                />
            )}

            <CreateTeamModal
                open={openCreateTeam}
                onOpenChange={setOpenCreateTeam}
                onCreated={async (teamId: string) => {
                    await reloadTeams();
                    navigate(`/teams/${teamId}`);
                } }
                sports={sports} leagues={leagues}            />
        </div>
    );
};
