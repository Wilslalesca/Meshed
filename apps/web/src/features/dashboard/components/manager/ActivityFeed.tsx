export interface ManagerActivityItem {
  user: string;
  action: string;
  time: string;
}

export const ActivityFeed = ({ data = [] }: { data?: ManagerActivityItem[] }) => {
  if (data.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground text-sm">
        No recent team activity.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border text-sm">
      {data.map((a, i) => (
        <li key={i} className="flex items-start gap-3 p-3 hover:bg-muted/40">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
            {a.user.charAt(0)}
          </div>

          <div className="flex flex-col">
            <p className="font-medium">{a.user}</p>
            <p className="text-muted-foreground text-xs">{a.action}</p>
            <span className="text-[11px] text-muted-foreground mt-1">{a.time}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
