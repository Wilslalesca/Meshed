export interface ActivityItem {
  user: string
  text: string
  time: string
}

export const ActivityFeed = ({ data = [] }: { data?: ActivityItem[] }) => {
    if (data.length === 0) {
      return (
        <div className="flex w-full flex-col items-center justify-center text-sm text-muted-foreground">
          No recent activity.
        </div>
      );
    }

    return (
      <ul className="divide-y divide-border text-sm">
        {data.map((a, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 hover:bg-muted/40 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
              {a.user.charAt(0)}
            </div>

            <div className="flex flex-col">
              <p className="font-medium">{a.user}</p>
              <p className="text-muted-foreground text-xs">{a.text}</p>
              <span className="text-[11px] text-muted-foreground mt-1">
                {a.time}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
};