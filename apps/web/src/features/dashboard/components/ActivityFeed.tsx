import { MessageCircle } from "lucide-react";

interface ActivityFeedProps {
  data?: { text: string; timestamp?: string }[];
}

export const ActivityFeed = ({
  data = [
    { text: "🏋️ Completed a strength training session", timestamp: "Today" },
    { text: "📅 New schedule uploaded by Coach Miller", timestamp: "Yesterday" },
    { text: "💬 Message: 'Practice moved to 2 PM'", timestamp: "2 days ago" },
  ],
}: ActivityFeedProps) => {
  return (
    <div className="p-3">
      <ul className="space-y-3">
        {data.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/40 transition-colors px-3 py-2"
          >
            <div className="rounded-md bg-primary/10 p-2 mt-0.5">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm">{item.text}</p>
              {item.timestamp && (
                <span className="text-xs text-muted-foreground">
                  {item.timestamp}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
