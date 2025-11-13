export const MiniCalendar = () => {
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const today = 13
  return (
    <div className="grid grid-cols-7 gap-2 text-center text-sm p-2">
      {days.map((d) => (
        <div key={d} className="text-muted-foreground font-medium">
          {d}
        </div>
      ))}
      {[...Array(28)].map((_, i) => {
        const day = i + 1
        const isToday = day === today
        return (
          <div
            key={day}
            className={`aspect-square flex items-center justify-center rounded-full text-sm cursor-pointer transition ${
              isToday
                ? "bg-primary text-primary-foreground font-semibold"
                : "hover:bg-muted/60"
            }`}
          >
            {day}
          </div>
        )
      })}
    </div>
  )
}
