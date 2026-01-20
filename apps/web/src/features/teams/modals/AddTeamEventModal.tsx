import React, { useEffect, useState, type JSX } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components//ui/button";
import type { EventItem } from "@/features/dashboard/types/eventItem";
import { Label } from "@/shared/components//ui/label";
import { EventWidget } from "@/features/dashboard/components/EventWidget";
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
import { TeamEventFactoryRegistry } from "../types/factories/registry";
import type { TeamEventType } from "../types/event";
import { useAddTeamEvent } from "../hooks/useAddTeamEvent";
import { toast } from "sonner";
import { Textarea } from "@/shared/components/ui/textarea";
import { apiGetEventFacilities } from "@/features/teams/api/events"
import type { Facility } from "@/features/facilities/types/facilities";

export const AddTeamEventModal = ({
    open,
    onOpenChange,
    teamId,
    onAdded,
}: any) => {
    const { token } = useAuth();

    const weekdays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const [selectedDays, setSelectedDays] = React.useState<string[]>([]);

    const reoccurrTypes = ["Daily", "Weekly", "Bi-Weekly", "Monthly"] as const;
    const [selectedReoccurrType, setSelectedReoccurrType] = useState<typeof reoccurrTypes[number] | undefined>();

    const teamEvents = ["Practice", "Game", "Lift", "Other"]; //change to lookup like sportslookup

    const [eventName, setEventName] = useState<string>();
    const [eventTypeID, setEventTypeID] = useState<TeamEventType>();
    const [reoccurring, setReoccurring] = useState<boolean>(false);
    const [startTime, setStartTime] = useState("10:30:00");
    const [endTime, setEndTime] = useState("11:20:00");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [teamFacilityId, setTeamFacilityId] = useState<string>();
    const [status, setStatus] = useState<string>('pending');
    const [opponent, setOpponent] = useState<string>();
    const [homeAway, setHomeAway] = useState<"Home" | "Away" | undefined>(undefined);
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

    useEffect(() => {
        if (!open) resetForm();
    }, [open]);

    function resetForm() {
        setSelectedDays([]);
        setSelectedReoccurrType(undefined);

        setEventName(undefined);
        setEventTypeID(undefined);

        setReoccurring(false);
        setStartTime("10:30:00");
        setEndTime("11:20:00");

        setStartDate(null);
        setEndDate(null);

        setTeamFacilityId(undefined);
        setStatus('pending');

        setOpponent(undefined);
        setHomeAway(undefined);
        setLiftType(undefined);
        setNotes(undefined);
    }

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
        if (!selectedDays.length) {
            toast.error("No days selected!");
            return;
        }

        const FactoryClass = TeamEventFactoryRegistry[eventTypeID];

        for (const day of selectedDays) {
            const factory = new FactoryClass({
                teamId,
                teamFacilityId,
                name : eventName,
                startDate,
                endDate : endDate || undefined,
                startTime,
                endTime,
                reoccurring,
                reoccurrType: selectedReoccurrType,
                dayOfWeek: day,
                status:status,
                opponent,
                homeAway,
                notes,
                liftType,
            });
            console.log(factory)

            const event = factory.createEvent();

            try{
                await addTeamEvent(event);
            }
            catch(error){
                toast.error(error instanceof Error ? error.message : "An error occurred");
            }
        }
        resetForm();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-150 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add a Team Event</DialogTitle>
                    <DialogDescription>
                        Create a single or reocurring event for you and your
                        team.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="columns-1 sm:columns-2 gap-6">
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="event_name">Event Name</Label>
                            <Input value={eventName} 
                                onChange={(e) => setEventName(e.target.value)} 
                                id = "event_name"
                                type="text" 
                                placeholder="ex. Night Practice"
                                required
                            ></Input>
                        </div>
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="event_type">Event Type</Label>
                            <Select
                                id = "event_type"
                                placeholder="ex. Practice"
                                value={eventTypeID}
                                onValueChange={(val: TeamEventType) =>
                                    setEventTypeID(val as TeamEventType)
                                }
                            >
                                <SelectTrigger>
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
                    </div>

                    <div className="grid w-full items-center gap-3 py-2">
                        <Label>Day(s) of the Week</Label>
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                            {weekdays.map((day) => (
                                <div
                                    className="flex items-center gap-3"
                                    key={day}
                                >
                                    <input
                                        type="checkbox"
                                        value={day}
                                        name="selectedDays"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedDays((s) => [
                                                    ...s,
                                                    day,
                                                ]);
                                            } else {
                                                setSelectedDays((s) =>
                                                    s.filter((d) => d !== day)
                                                );
                                            }
                                        }}
                                    />
                                    <Label>{day}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="columns-1 sm:columns-2 gap-6">
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="start_time">Start Time</Label>
                            <Input
                                type="time"
                                id="start_time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="end_time">End Time</Label>
                            <Input
                                type="time"
                                id="end_time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="columns-1 sm:columns-2 gap-6">
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="reoccurring">
                                Reocurring Event
                            </Label>
                            <Select
                                value={reoccurring ? "true" : "false"}
                                onValueChange={(v: string) => setReoccurring(v === "true")}
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

                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="facility">Facility</Label>
                            <Select value={teamFacilityId} onValueChange={setTeamFacilityId}>
                                <SelectTrigger id="facility">
                                    <SelectValue placeholder="Select a facility" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allFacilities.map((facility) => (
                                        <SelectItem key={facility.id} value={facility.id}>
                                            {facility.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full items-center gap-3 py-2">
                            {reoccurring ? (
                                <>
                                    <Label htmlFor="reoccurring">
                                        Type of Reocurrance
                                    </Label>
                                    <Select
                                        value={selectedReoccurrType}
                                        onValueChange={setSelectedReoccurrType}
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
                                </>
                            ) : (
                                <div className="invisible">
                                    <Label>Placeholder</Label>
                                    <div className="h-10" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="columns-1 sm:columns-2 gap-6">
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
                                        ? startDate.toISOString().slice(0, 10)
                                        : ""
                                }
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                            ? new Date(e.target.value)
                                            : null
                                    )
                                }
                                required
                            />
                        </div>

                        {reoccurring ? (
                            <div className="grid w-full items-center gap-3 py-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    type="date"
                                    id="end_date"
                                    min="2025-01-01"
                                    max="2035-12-31"
                                    value={
                                        endDate
                                            ? endDate.toISOString().slice(0, 10)
                                            : ""
                                    }
                                    onChange={(e) =>
                                        setEndDate(
                                            e.target.value
                                                ? new Date(e.target.value)
                                                : null
                                        )
                                    }
                                />
                            </div>
                        ) : (
                            <div className="invisible">
                                <Label>Placeholder</Label>
                                <div className="h-10" />
                            </div>
                        )}
                    </div>
                    
                    {eventTypeID === "Game" && (
                    <div className="columns-1 sm:columns-2 gap-6">
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="opponent">
                                Opponent
                            </Label>
                            <Input
                                type="text"
                                id="opponent"
                                placeholder="ex. Team A"
                                value={opponent}
                                onChange={(e) => setOpponent(e.target.value)}
                            />
                        </div>
                        
                        <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="home_away">
                                Home or Away
                            </Label>
                            <Select
                                value={homeAway}
                                onValueChange={(value: "Home" | "Away") => setHomeAway(value)}                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="ex. Home" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Home">Home</SelectItem>
                                    <SelectItem value="Away">Away</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    )}

                    {eventTypeID === "Lift" && (
                         <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="liftType">
                                Lift Type
                            </Label>
                            <Input
                                type="text"
                                id="liftType"
                                placeholder="ex. Team Lift"
                                value={liftType}
                                onChange={(e) => setLiftType(e.target.value)}
                            />
                        </div>
                    )}

                    {(eventTypeID === "Practice" || eventTypeID === "Other") && (
                         <div className="grid w-full items-center gap-3 py-2">
                            <Label htmlFor="notes">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="ex. Cardio Training"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            
                        </div>
                    )}

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
