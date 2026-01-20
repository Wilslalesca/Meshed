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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { IndividualFacilityEventTable } from "../components/admin/IndividualFacilityEventTable";

export const AdminDashboard = () => {
    const { token } = useAuth();
    const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
    const [displayFacility, setDisplayFacility] = useState<string | undefined>("All");
    
    
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
        <div>
            <div className="grid w-full items-center gap-3 py-2">
            <Label htmlFor="facility">Facility</Label>
            <Select value={displayFacility} onValueChange={setDisplayFacility}>
                <SelectTrigger id="facility">
                    <SelectValue placeholder="Select a facility" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key="all" value="All">
                        All
                    </SelectItem>
                    {allFacilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                            {facility.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            </div>
            {
                displayFacility
                ? (() => {
                    const facility = allFacilities.find(f => f.id === displayFacility);
                    console.log(facility?.id)
                    return facility ? 
                    <IndividualFacilityEventTable facilityId={facility.id} facilityName={facility.name} />
                    : <AllEventTable />;
                })()
                : <AllEventTable/>
            }
        </div>
    );
};


