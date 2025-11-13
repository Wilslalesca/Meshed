import { Building2 } from "lucide-react";

interface FacilityWidgetProps {
  data?: { name: string; status: string }[];
}

export const FacilityWidget = ({
  data = [
    { name: "Gym A", status: "Available" },
    { name: "Field 1", status: "Booked" },
    { name: "Pool", status: "Maintenance" },
  ],
}: FacilityWidgetProps) => {
  return (
    <div className="p-3">
      <ul className="space-y-3">
        {data.map((f, idx) => {
          const color =
            f.status === "Available"
              ? "text-green-600"
              : f.status === "Booked"
              ? "text-yellow-600"
              : "text-red-600";

          return (
            <li
              key={idx}
              className="flex items-center justify-between rounded-lg border border-transparent hover:border-border hover:bg-muted/40 transition-colors px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{f.name}</span>
              </div>
              <span className={`text-xs font-medium ${color}`}>{f.status}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
