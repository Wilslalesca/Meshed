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
import { Label } from "@/shared/components//ui/label";
import { IndividualFacilityEventTable } from "../components/admin/IndividualFacilityEventTable";

export const AdminDashboard = () => {
    const { token } = useAuth();
    const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
    const [displayFacility, setDisplayFacility] = useState<string | undefined>("All");
    const [displayStatus, setDisplayStatus] = useState<string | undefined>("All");
    const allStatus = ["pending", "confirmed", "denied"];
    
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
        <div className="px-6">
            <div className="flex items-center gap-6">
                <div className="gap-3 py-2">
                    <Label htmlFor="facility">Selected Facility</Label>
                </div>
                <div className="gap-3 py-2">
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
                <div className="gap-3 py-2">
                    <Label htmlFor="status">Selected Status</Label>
                </div>
                <div className="gap-3 py-2">
                    <Select value={displayStatus} onValueChange={setDisplayStatus}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key="all" value="All">
                                All
                            </SelectItem>
                            {allStatus.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {
                (() => {
                    const selectedFacility = displayFacility === "All" ? null : allFacilities.find(f => f.id === displayFacility);
                    return selectedFacility ? (
                        <IndividualFacilityEventTable facilityId={selectedFacility.id} facilityName={selectedFacility.name} />
                    ) : (
                        <AllEventTable />
                    );
                })()
            }
        </div>
    );
};


