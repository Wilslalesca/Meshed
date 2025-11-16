import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

interface Props {
  staff: any;
  onRemove: (id: string) => void;
}

export const StaffCard = ({ staff, onRemove }: Props) => {
  return (
    <Card className="p-4 flex items-center justify-between">
      <CardHeader className="p-0">
        <p className="font-semibold">
          {staff.first_name} {staff.last_name}
        </p>
        <p className="text-sm text-muted-foreground">{staff.role}</p>
      </CardHeader>

      <CardContent className="p-0">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(staff.id)}
        >
          Remove
        </Button>
      </CardContent>
    </Card>
  );
};
