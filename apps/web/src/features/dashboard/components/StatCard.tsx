import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number | null;
  subtitle?: string;
  loading?: boolean;
}

export const StatCard = ({ title, value, subtitle, loading }: StatCardProps) => (
  <Card className="border-border shadow-sm hover:bg-muted/30 transition-colors">
    <CardHeader className="pb-1">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
        {loading ? (
          <p className="text-3xl font-semibold tracking-tight opacity-50">…</p>
        ) : (
          <p className="text-3xl font-semibold tracking-tight">
            {value ?? "—"}
          </p>
        )}

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
  </Card>
);
