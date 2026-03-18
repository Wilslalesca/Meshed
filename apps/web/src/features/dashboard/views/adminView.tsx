import { apiGetEventFacilities } from "@/features/teams/api/events"
import type { Facility } from "@/features/facilities/types/facilities";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { AllEventTable } from "../components/admin/AllEventTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components//ui/label";
import { IndividualFacilityEventTable } from "../components/admin/IndividualFacilityEventTable";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from "@/shared/components/ui/card";
import { IndividualFacilityEventCalendar } from "../components/admin/IndividualFacilityEventCalendar";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export const AdminDashboard = () => {
    const { token } = useAuth();
    const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
    const [displayFacility, setDisplayFacility] = useState<string | undefined>("All");
    const [filter, setFilter] = useState<string>("All");
    const [individualView, setIndividualView] = useState<string>("table");
    
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
        <div className="px-6 py-2">
            <Card className="justify-start mb-6 shadow-none">
                <CardHeader>
                    <CardTitle>
                        Dashboard Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-left gap-3">
                        <div className="gap-3 min-w-0">
                            <Label htmlFor="facility">Facility</Label>
                        </div>
                        <div className="gap-3 min-w-0">
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
                        { displayFacility != "All" && (
                            <>
                                <div className="gap-3 min-w-0">
                                    <Label htmlFor="filter">Status</Label>
                                </div>
                                <div className="gap-3 min-w-0">
                                    <Select value={filter} onValueChange={setFilter}>
                                        <SelectTrigger id="filter">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key="all" value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem key="pending" value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem key="conflicts" value="conflicts">
                                                Conflicts
                                            </SelectItem>
                                            <SelectItem key="approved" value="approved">
                                                Approved
                                            </SelectItem>
                                            <SelectItem key="denied" value="denied">
                                                Denied
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                        { displayFacility != "All" && (
                            <div className="gap-3">
                                <Tabs
                                    value={individualView}
                                    onValueChange={setIndividualView}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger className="w-full" value="table">
                                            Table
                                        </TabsTrigger>
                                        <TabsTrigger className="w-full" value="calendar">
                                            Calendar
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            {
                (() => {
                    const selectedFacility = displayFacility === "All" ? null : allFacilities.find(f => f.id === displayFacility);
                    return selectedFacility ? (
                        individualView == "table" ? (
                            <IndividualFacilityEventTable facilityId={selectedFacility.id} facilityName={selectedFacility.name} filter={filter} />
                        ) : (
                            <IndividualFacilityEventCalendar facilityId={selectedFacility.id} filter={filter} />
                        )
                    ) : (
                        <AllEventTable />
                    );
                })()
            }
        </div>
    );
};


