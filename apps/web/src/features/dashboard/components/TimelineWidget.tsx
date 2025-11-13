interface TimelineItem {
  time: string
  label: string
  location: string
}

export const TimelineWidget = ({ data }: { data: TimelineItem[] }) => (
  <div className="overflow-x-auto px-4 py-4">
    <div className="flex gap-4 min-w-max">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="min-w-[180px] bg-muted/40 hover:bg-muted/60 rounded-lg p-3 border border-border/40 transition-colors"
        >
          <p className="text-xs text-muted-foreground">{item.time}</p>
          <p className="font-medium text-sm">{item.label}</p>
          <p className="text-xs text-muted-foreground">{item.location}</p>
        </div>
      ))}
    </div>
  </div>
)
