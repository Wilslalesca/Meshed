import { CalendarClock } from "lucide-react";

interface ScheduleWidgetProps {
  data?: { time: string; event: string; location: string }[];
}

export const ScheduleWidget = ({
  data = [
    { time: "08:00 AM", event: "Strength Training", location: "Gym A" },
    { time: "10:30 AM", event: "Math Lecture", location: "Tilley Hall 203" },
    { time: "02:00 PM", event: "Team Practice", location: "Field 1" },
  ],
}: ScheduleWidgetProps) => {
  return (
    <div className="p-3">
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
                <p className="font-medium text-sm leading-tight">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.location}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
