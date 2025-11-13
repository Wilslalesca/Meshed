export const PerformanceGauge = ({ progress = 75 }: { progress: number }) => (
  <div className="relative flex flex-col items-center justify-center">
    <div
      className="relative w-36 h-36 rounded-full"
      style={{
        background: `conic-gradient(var(--primary) ${progress * 3.6}deg, rgba(200,200,200,0.1) 0deg)`,
      }}
    >
      <div className="absolute inset-3 rounded-full bg-background flex flex-col items-center justify-center">
        <p className="text-3xl font-semibold">{progress}%</p>
        <p className="text-xs text-muted-foreground">Performance</p>
      </div>
    </div>
  </div>
)
