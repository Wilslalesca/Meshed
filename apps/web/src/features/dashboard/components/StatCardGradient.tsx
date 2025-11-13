import { cn } from "@/shared/utils/utils"

interface StatCardGradientProps {
  title: string
  value: string
  subtitle?: string
  color?: string
  icon?: string
}

export const StatCardGradient = ({
  title,
  value,
  subtitle,
  color = "from-primary/20 to-primary/40",
  icon,
}: StatCardGradientProps) => (
  <div
    className={cn(
      "relative rounded-xl border border-border/40 shadow-sm p-4 overflow-hidden",
      "bg-gradient-to-br",
      color
    )}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm text-muted-foreground">{title}</h3>
        <p className="text-3xl font-semibold mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {icon && <div className="text-2xl opacity-70">{icon}</div>}
    </div>
  </div>
)
