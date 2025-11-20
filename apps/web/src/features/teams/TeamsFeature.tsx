// import { useTeams } from "./hooks/useTeams";
// import { useRoster } from "./hooks/useRoster";
// import { useLookups } from "./hooks/useLookups";
// import { useAuth } from "@/shared/hooks/useAuth";
// import { useUserRole } from "@/shared/hooks/useUserRole";

// import { TeamGrid } from "./components/TeamGrid";
// import { TeamDetailsPanel } from "./components/TeamDetailsPanel";
// import { RosterCard } from "./components/RosterCard";
// import { AddAthleteForm } from "./components/AddAthleteForm";
// import { CreateTeamForm } from "./components/CreateTeamForm";
// import { TeamManagementToolbar } from "./components/TeamManagementToolbar";
// import { apiAddAthleteByEmail, apiCreateTeam } from "./api/teams";
// import { useState, useMemo } from "react";

// export const TeamsFeature = () => {
//     const { token } = useAuth();
//     const { isManager, isAdmin } = useUserRole();
//     const canManage = isManager || isAdmin;
//     const [search, setSearch] = useState("");
//     const [sportFilter, setSportFilter] = useState("all");
//     const [genderFilter, setGenderFilter] = useState("all");
//     const [sort, setSort] = useState("newest");

//     const { teams, loading, selectedTeamId, setSelectedTeamId, reloadTeams } =
//         useTeams();

//     const { roster, reload: reloadRoster } = useRoster(selectedTeamId);
//     const { sports, leagues } = useLookups();

//     const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? null;

//     const selectedSport = selectedTeam
//         ? sports.find((s) => s.id === selectedTeam.sport_id) ?? null
//         : null;

//     const selectedLeague = selectedTeam
//         ? leagues.find((l) => l.id === selectedTeam.league_id) ?? null
//         : null;

//     const onAddAthlete = async (email: string) => {
//         if (!token || !selectedTeamId) return;
//         const res = await apiAddAthleteByEmail(selectedTeamId, email, token);
//         if (res.success) reloadRoster();
//     };

//     const onCreateTeam = async (data: any) => {
//         if (!token) return;
//         const res = await apiCreateTeam(data, token);
//         if (res) {
//             await reloadTeams();
//             setSelectedTeamId(res.id);
//         }
//     };
//     const filteredTeams = useMemo(() => {
//         let list = [...teams];

//         // Search
//         if (search.trim()) {
//             const q = search.toLowerCase();
//             list = list.filter((t) => t.name.toLowerCase().includes(q));
//         }

//         // Sport filter
//         if (sportFilter !== "all") {
//             list = list.filter((t) => t.sport_id === sportFilter);
//         }

//         // Gender filter
//         if (genderFilter !== "all") {
//             list = list.filter((t) => t.gender === genderFilter);
//         }

//         // Sort
//         list.sort((a, b) => {
//             if (sort === "alphabetical") return a.name.localeCompare(b.name);
//             if (sort === "newest")
//                 return (
//                     new Date(b.created_at!).getTime() -
//                     new Date(a.created_at!).getTime()
//                 );
//             if (sort === "oldest")
//                 return (
//                     new Date(a.created_at!).getTime() -
//                     new Date(b.created_at!).getTime()
//                 );
//             return 0;
//         });

//         return list;
//     }, [teams, search, sportFilter, genderFilter, sort]);

//     return (
//         <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* LEFT */}
//             <div className="lg:col-span-3 space-y-6">
//                 <TeamManagementToolbar
//                     search={search}
//                     onSearchChange={setSearch}
//                     sportFilter={sportFilter}
//                     onSportFilterChange={setSportFilter}
//                     genderFilter={genderFilter}
//                     onGenderFilterChange={setGenderFilter}
//                     sort={sort}
//                     onSortChange={setSort}
//                     sports={sports}
//                     onAddTeam={() => setSelectedTeamId(null)} seasonFilter={""} onSeasonFilterChange={function (v: string): void {
//                         throw new Error("Function not implemented.");
//                     } }                />

//                 {!loading && (
//                     <TeamGrid
//                         teams={filteredTeams}
//                         selectedId={selectedTeamId}
//                         onSelect={setSelectedTeamId}
//                         rosterCounts={{}}
//                     />
//                 )}

//                 {selectedTeam && (
//                     <>
//                         {canManage && <AddAthleteForm onAdd={onAddAthlete} />}
//                         <RosterCard roster={roster} />
//                     </>
//                 )}
//             </div>

//             {/* RIGHT */}
//             <div className="lg:col-span-1 space-y-6">
//                 <TeamDetailsPanel
//                     team={selectedTeam}
//                     sport={selectedSport}
//                     league={selectedLeague}
//                 />

//                 {canManage && (
//                     <CreateTeamForm
//                         sports={sports}
//                         leagues={leagues}
//                         onCreate={onCreateTeam}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };
