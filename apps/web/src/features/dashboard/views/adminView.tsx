import { QuickActions } from "../components/user/QuickActions";
import { StatCard } from "../components/StatCard";
import { TeamSchedule } from "../components/user/TeamSchedule";
import { ActivityFeed } from "../components/user/ActivityFeed";
import { apiGetTeamEvents } from "@/features/teams/api/teamSchedule.API";
import { EventWidget } from "../components/EventWidget";
import { apiGetEventFacilities } from "@/features/teams/api/events"
import type { Facility } from "@/features/facilities/types/facilities";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import type { TeamEvent } from "@/features/teams/types/event";
import { AllEventTable } from "../components/admin/AllEventTable";

export const AdminDashboard = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState<TeamEvent[]>([]);

    const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
    
    
    useEffect(() => {
        const fetchFacilities = async () => {
            const facilities = await apiGetEventFacilities(token!);
            if (facilities) {
                setAllFacilities(facilities);
            }
        };

        fetchFacilities();
    }, [token]);
    

    return (
        //change this to switch between different cards, one per facility, one per team
        //insert a selectitem here, and show all facility options plus 'ALL' whichever they click is what is displayed below
        <AllEventTable/>
    );
};


