import { Button } from "@/shared/components/ui/button";

interface Props {
  staff: any[];
  onRemove: (id: string) => void;
}

export const StaffTableView = ({ staff, onRemove }: Props) => {
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="p-3">
                {s.first_name} {s.last_name}
              </td>
              <td className="p-3">{s.role}</td>
              <td className="p-3 text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(s.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
