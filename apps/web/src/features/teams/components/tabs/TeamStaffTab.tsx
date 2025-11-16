import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { StaffMember } from "../../types/staff";
import { Button } from "@/shared/components/ui/button";

interface Props {
  staff: StaffMember[];
  onUpdated: () => void;
  onRemoved: (staffId: string) => void;
}

export const TeamStaffTab = ({ staff, onRemoved }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {staff.length === 0 && (
          <p className="text-muted-foreground">No staff added yet.</p>
        )}

        {staff.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between text-sm"
          >
            <span>
              {s.first_name} {s.last_name} ({s.role})
            </span>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {                
                onRemoved(s.id);
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
