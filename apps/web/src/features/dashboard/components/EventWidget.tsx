import { Card, CardContent } from "@/shared/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Calendar } from "@/shared/components/ui/calendar";
import { cn } from "@/shared/utils/utils";
import type { EventItem } from "../types/eventItem";
    
export const EventWidget = ({ events }: { events: EventItem[] }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    const filteredEvents = useMemo(() => {
        return events.filter(
            (curr) => curr.date === selectedDate?.toISOString().split("T")[0]
        );
    }, [events, selectedDate]);

    return (
        <Card className="h-[650px] flex flex-col">
            <CardContent className="flex flex-col gap-4 overflow-hidden p-2">
                <div className="relative rounded-md">

                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="w-full"
                        components={{
                            Day: ({ day, modifiers, ...props }) => {
                                const iso = day.date.toISOString().split("T")[0];
                                const isSelected = selectedDate?.toISOString().split("T")[0] === iso;
                                const hasEvent = events.some(
                                    (ev) => ev.date === iso
                                );

                                return (
                                    <div
                                        {...props}
                                        onClick={(e) => {
                                            props.onClick?.(e);
                                            setSelectedDate(day.date);
                                        }}
                                        className={cn(
                                            "relative flex items-center justify-center w-full h-full rounded-md cursor-pointer",
                                            isSelected && `text-white font-medium bg-[#346E68]`,
                                            !isSelected && hasEvent && "font-normal bg-transparent",
                                            props.className

                                        )}
                                    >
                                        {day.date.getDate()}

                                        {hasEvent && (
                                            <span className="absolute left-1/2 top-[75%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
                                        )}
                                    </div>
                                );
                            },
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                        {event.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {event.date}
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        ))
                    ) : (
                        <span className="text-sm text-muted-foreground mt-2 align-middle justify-center flex">
                            No events for the selected date.
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
