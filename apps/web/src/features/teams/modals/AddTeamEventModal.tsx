import React, { useState, type JSX } from 'react';
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components//ui/button";
import type { EventItem } from "@/features/dashboard/types/eventItem"
import { Label } from "@/shared/components//ui/label";
import { EventWidget } from "@/features/dashboard/components/EventWidget";
import { Input } from "@/shared/components//ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/shared/components/ui/select";
import { TeamEventFactoryRegistry } from '../types/factories/registry';
import type { TeamEventType } from '../types/event';


export const AddTeamEventModal = ({ open, onOpenChange, teamId, onAdded }: any) => {
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

    const reoccurrTypes = [
        "Daily",
        "Weekly",
        "Bi-Weekly",
        "Monthly"
    ];
    const [selectedReoccurrType, setSelectedReoccurrType] = React.useState<string[]>([]);

    const teamEvents = ["Practice", "Game", "Lift", "Other"] //change to lookup like sportslookup

    const [eventTypeID, setEventTypeID] = useState<TeamEventType>();
    const [reoccurring, setReoccurring] = React.useState("");
    const [startTime, setStartTime] = React.useState("10:30:00");
    const [endTime, setEndTime] = React.useState("11:20:00");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [events, setEvents] = useState<EventItem[]>([]);
    
    /**
     * Going to need to make to add multiple practices at once? I.e. they can make monday,
     * tuesday, wednesday, repeating classes?
     * D
     * 
     */

    //const navigate = useNavigate();

    async function handleSubmit() {
        
        if (!token) return;

        const baseInput = {
            teamId,
            startDate,
            endDate,
            startTime,
            endTime,
            reoccurring,
            selectedReoccurrType,
            daysOfWeek: selectedDays,
        };

        if (!eventTypeID) {
            console.error("No event type selected!");
            return;
        }

        const FactoryClass = TeamEventFactoryRegistry[eventTypeID];

        const factory = new FactoryClass({
            ...baseInput
        });

        //loop per date and send to DB
        const event = factory.createEvent();
        console.log(event)

    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-150 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add a Team Event</DialogTitle>
                    <DialogDescription>Create a single or reocurring event for you and your team.</DialogDescription>
                </DialogHeader>
                <div>
                    <div className="grid w-full items-center gap-3 py-2">
                        <Select value={eventTypeID} onValueChange={(val: TeamEventType) => setEventTypeID(val as TeamEventType)}>
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

                    <div className="grid w-full items-center gap-3 py-2">
                        <Label>Day(s) of the Week</Label>
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                            {weekdays.map((day) => (
                            <div className="flex items-center gap-3" key={day}>
                                <input
                                type="checkbox"
                                value={day}
                                name="selectedDays"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                    setSelectedDays((s) => [...s, day]);
                                    } else {
                                    setSelectedDays((s) => s.filter((d) => d !== day));
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
                            <Label htmlFor="reoccurring">Reocurring Event</Label>
                            <Select id ="reoccurring" value={reoccurring} onValueChange={setReoccurring}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Yes/No" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={false}>
                                        {"No"}
                                    </SelectItem>
                                    <SelectItem value={true}>
                                        {"Yes"}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full items-center gap-3 py-2">
                        {reoccurring ? (
                            <>
                                <Label htmlFor="reoccurring">Type of Reocurrance</Label>
                                <Select id = "selectedReoccurrType" value={selectedReoccurrType} onValueChange={setSelectedReoccurrType}>
                                    <SelectTrigger>
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
                        )
                        :   <div className="invisible">
                                <Label>Placeholder</Label>
                                <div className="h-10" />
                            </div>
                        } 
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
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        {reoccurring ? 
                            <div className="grid w-full items-center gap-3 py-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    type="date"
                                    id="end_date"
                                    min="2025-01-01"
                                    max="2035-12-31"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        :   <div className="invisible">
                                <Label>Placeholder</Label>
                                <div className="h-10" />
                            </div>
                        } 
                    </div>

                    {events 
                    ? <div className="lg:col-span-1 flex flex-col gap-4"><EventWidget events={events} /></div>
                    :  ""
                    }
                </div>
                <div className="flex flex-col p-4 items-center">
                    <Button type="submit" onClick={handleSubmit} className="w-full gap-3">Submit</Button>
                </div>
        </DialogContent>
        </Dialog>
    );
};
