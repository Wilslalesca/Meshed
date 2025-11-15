import { CalendarClock } from "lucide-react";

export interface TeamScheduleItem {
    time: string;
    event: string;
    location: string;
}

export const TeamSchedule = ({ data = [] }: { data?: TeamScheduleItem[] }) => {
    return (
        <div className="p-3">
            {data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                    No team schedule available.
                </p>
            ) : (
                <ul className="space-y-3">
                    {data.map((item, idx) => (
                        <li
                            key={idx}
                            className="flex items-center justify-between rounded-lg border border-transparent hover:border-border hover:bg-muted/40 transition-colors px-3 py-2"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-md bg-primary/10 p-2">
                                    <CalendarClock className="h-4 w-4 text-primary" />
                                </div>

                                <div>
                                    <p className="font-medium text-sm leading-tight">
                                        {item.event}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.location}
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-medium text-muted-foreground">
                                {item.time}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
