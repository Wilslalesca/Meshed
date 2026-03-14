import React, { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components//ui/button";
import { Label } from "@/shared/components//ui/label";
import { Input } from "@/shared/components//ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/shared/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { ReoccurrType, TeamEventType } from "../../types/event";
import { useAddTeamEvent } from "../../hooks/useAddTeamEvent";
import { toast } from "sonner";
import { Textarea } from "@/shared/components/ui/textarea";
import { apiGetEventFacilities } from "@/features/teams/api/events";
import type { Facility } from "@/features/facilities/types/facilities";
import type { OptimizationTeamEvent } from "../../types/OptimizationResult"

export const AddOptimizedEventModal = ({
    open,
    onOpenChange,
    teamId,
    eventInfo,
    onShowOptimizedResultsModal,
}: { open: boolean; onOpenChange: (open: boolean) => void; teamId: string; eventInfo:OptimizationTeamEvent; onShowOptimizedResultsModal:(result?:OptimizationTeamEvent)=>void}) => {
    const { token } = useAuth();

    const formatLocalDate = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const selectedDay: string[] =  eventInfo?.dayOfWeek ? [eventInfo.dayOfWeek] : [];
    const startTime = eventInfo?.startTime
    const endTime= eventInfo?.endTime

    const reoccurrTypes: readonly ReoccurrType[] = ReoccurrType;
    const [selectedReoccurrType, setSelectedReoccurrType] = useState<
        ReoccurrType | undefined
    >();

    const teamEvents: readonly TeamEventType[] = TeamEventType;
    const [eventName, setEventName] = useState<string>();
    const [eventTypeID, setEventTypeID] = useState<TeamEventType>();
    const [reoccurring, setReoccurring] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [teamFacilityId, setTeamFacilityId] = useState<string>();
    const [status] = useState<string>("pending");
    const [opponent, setOpponent] = useState<string | undefined>(undefined);
    const [homeAway, setHomeAway] = useState<"Home" | "Away" | undefined>(
        undefined,
    );
    const [liftType, setLiftType] = useState<string>();
    const [notes, setNotes] = useState<string>();

    const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
    
    const { addTeamEvent } = useAddTeamEvent();

    useEffect(() => {
        const fetchFacilities = async () => {
            const facilities = await apiGetEventFacilities(token!);
            if (facilities) {
                setAllFacilities(facilities);
            }
        };

        fetchFacilities();
    }, [token]);

    useEffect(() => {
        if (!reoccurring) setSelectedReoccurrType(undefined);
    }, [reoccurring]);


    async function handleSubmit() {
        if (!token) return;

        if (!eventTypeID) {
            toast.error("No event type selected!");
            return;
        }
        if (!startDate) {
            toast.error("Start date is required!");
            return;
        }

        if (reoccurring && !endDate) {
            toast.error("End date is required for recurring events!");
            return;
        }

        if (reoccurring && endDate && endDate < startDate) {
            toast.error("End date cannot be earlier than start date!");
            return;
        }
        if (eventTypeID === "Game") {
            if (!opponent?.trim()) {
                toast.error("Opponent is required for a Game");
                return;
            }
            if (!homeAway) {
                toast.error("Home/Away is required for a Game");
                return;
            }
        }

        try {
            await addTeamEvent(
                teamId,
                teamFacilityId,
                eventName,
                startDate,
                endDate,
                startTime,
                endTime,
                reoccurring,
                selectedReoccurrType,
                selectedDay,
                status,
                opponent,
                homeAway,
                notes,
                liftType,
                eventTypeID,
            );
            toast.success("Event Created!");
            onShowOptimizedResultsModal(eventInfo);
        } catch (error) {
            throw (error instanceof Error ? error : new Error("An error occurred"));
        }

    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-150 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <button onClick={()=>onShowOptimizedResultsModal()}>Calendar View</button>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Add Event</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    </DialogTitle>
                    <DialogDescription>
                        Confirm Event Creation for: {selectedDay} from {startTime} - {endTime}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-6">
                    <div className="flex-col p-4 items-center">
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="event_name">Event Name</Label>
                            <Input
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                id="event_name"
                                type="text"
                                placeholder="ex. Night Practice"
                                required
                            ></Input>
                        </div>
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="event_type">Event Type</Label>
                            <Select
                                value={eventTypeID}
                                onValueChange={(val: TeamEventType) =>
                                    setEventTypeID(val as TeamEventType)
                                }
                            >
                                <SelectTrigger id="event_type">
                                    <SelectValue placeholder="Event Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teamEvents.map((e) => (
                                        <SelectItem key={e} value={e}>
                                            {e}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="reoccurring">
                                Reocurring Event
                            </Label>
                            <Select
                                value={reoccurring ? "true" : "false"}
                                onValueChange={(v: string) =>
                                    setReoccurring(v === "true")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Yes/No" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="false">No</SelectItem>
                                    <SelectItem value="true">Yes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {reoccurring && (
                            <div className="grid w-full items-center gap-3 py-2">
                                <Label htmlFor="reoccurring">
                                    Type of Reocurrance
                                </Label>
                                <Select
                                    value={selectedReoccurrType}
                                    onValueChange={(val: string) =>
                                        setSelectedReoccurrType(
                                            val as (typeof reoccurrTypes)[number],
                                        )
                                    }
                                >
                                    <SelectTrigger id="selectedReoccurrType">
                                        <SelectValue placeholder="Reocurr" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reoccurrTypes.map((e) => (
                                            <SelectItem key={e} value={e}>
                                                {e}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedReoccurrType == "Daily" && (
                                    <Label className="text-red-500">
                                        Warning: selected days of the week will
                                        be ignored if creating daily recurring
                                        events
                                    </Label>
                                )}
                            </div>
                        )}

                        <div className="grid w-full items-center gap-3 py-2">
                            
                            <Label htmlFor="facility">Facility</Label>
                            <Select
                                value={teamFacilityId}
                                onValueChange={setTeamFacilityId}
                            >
                                <SelectTrigger id="facility">
                                    <SelectValue placeholder="Select a facility" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allFacilities.map((facility) => (
                                        <SelectItem
                                            key={facility.id}
                                            value={facility.id}
                                        >
                                            {facility.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="start_date">
                                {reoccurring ? "Start Date" : "Date"}
                            </Label>
                            <Input
                                type="date"
                                id="start_date"
                                min="2025-01-01"
                                max="2035-12-31"
                                value={
                                    startDate
                                        ? formatLocalDate(startDate)
                                        : ""
                                }
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [year, month, day] = e.target.value.split('-');
                                        setStartDate(new Date(Number(year), Number(month) - 1, Number(day)));
                                    } else {
                                        setStartDate(null);
                                    }
                                }}
                                required
                            />
                        </div>

                        {reoccurring && (
                            <div className="grid w-full items-center gap-3 py-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    type="date"
                                    id="end_date"
                                    min="2025-01-01"
                                    max="2035-12-31"
                                    value={
                                        endDate
                                            ? formatLocalDate(endDate)
                                            : ""
                                    }
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const [year, month, day] = e.target.value.split('-');
                                            setEndDate(new Date(Number(year), Number(month) - 1, Number(day)));
                                        } else {
                                            setEndDate(null);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {eventTypeID === "Game" && (
                            <div>
                                <div className="grid w-full items-center gap-3 py-2">
                                    <Label htmlFor="opponent">Opponent</Label>
                                    <Input
                                        type="text"
                                        id="opponent"
                                        placeholder="ex. Team A"
                                        value={opponent}
                                        onChange={(e) =>
                                            setOpponent(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="grid w-full items-center gap-3 py-2">
                                    <Label htmlFor="home_away">
                                        Home or Away
                                    </Label>
                                    <Select
                                        value={homeAway}
                                        onValueChange={(
                                            value: "Home" | "Away",
                                        ) => setHomeAway(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="ex. Home" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Home">
                                                Home
                                            </SelectItem>
                                            <SelectItem value="Away">
                                                Away
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {eventTypeID === "Lift" && (
                            <div className="grid w-full items-center gap-3 py-2">
                                <Label htmlFor="liftType">Lift Type</Label>
                                <Input
                                    type="text"
                                    id="liftType"
                                    placeholder="ex. Team Lift"
                                    value={liftType}
                                    onChange={(e) =>
                                        setLiftType(e.target.value)
                                    }
                                />
                            </div>
                        )}

                        {(eventTypeID === "Practice" ||
                            eventTypeID === "Other") && (
                            <div className="grid w-full items-center gap-3 py-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="ex. Cardio Training"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-4 items-center">
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full gap-3"
                    >
                        Submit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
