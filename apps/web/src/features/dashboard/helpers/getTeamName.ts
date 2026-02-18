import type { Team } from "@/features/teams/types/teams";
export function getTeamName(teamId: string, allTeams: Team[]){
        try{
           var team = allTeams.find(f => f.id === teamId)
            if(team?.name == undefined){
                return teamId
            }
            else{
                return team.name
            } 
        }
        catch{
            return teamId
        }
    }