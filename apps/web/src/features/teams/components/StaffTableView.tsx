import { Button } from "@/shared/components/ui/button";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { Calendar, MessageCircle, Trash } from "lucide-react";

interface Props {
  staff: any[];
  onRemove: (id: string) => void;
}

export const StaffTableView = ({ staff, onRemove }: Props) => {
  const role = useUserRole();
  const isManager = role.isManager;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Name</th>
          <th className="text-left p-2">Email</th>
          <th className="text-left p-2">Status</th>
          <th className="text-right p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {staff.map((member) => (
          <tr key={member.id} className="border-b hover:bg-muted">
            <td className="p-2">
              {member.first_name} {member.last_name}
            </td>
            <td className="p-2">{member.email ?? "—"}</td>
            <td className="p-2">{member.status ?? "pending"}</td>
            <td className="p-2">
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-muted"
                  aria-label="View schedule"
                >
                  <Calendar size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-muted"
                  aria-label="Message staff"
                >
                  <MessageCircle size={16} />
                </Button>
                {isManager && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(member.id)}
                  >
                    <Trash className="text-red-500" size={18} />
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
