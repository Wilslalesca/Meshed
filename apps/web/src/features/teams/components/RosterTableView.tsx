import { Button } from "@/shared/components/ui/button";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { Trash, Calendar, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Athlete } from "../types/roster";

interface Props {
  roster: Athlete[];
  onRemoveAthlete?: (id: string) => void;
}

export const RosterTableView = ({ roster, onRemoveAthlete }: Props) => {
  const navigate = useNavigate();
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
        {roster.map((athlete) => (
          <tr
            key={athlete.id}
            className="border-b hover:bg-muted cursor-pointer"
            onClick={() => navigate(`/athletes/${athlete.id}`)}
          >
            <td className="p-2">
              {athlete.first_name} {athlete.last_name}
            </td>
            <td className="p-2">{athlete.email}</td>
            <td className="p-2">{athlete.status}</td>
            <td className="p-2">
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-muted"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View schedule"
                >
                  <Calendar size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-muted"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Message athlete"
                >
                  <MessageCircle size={16} />
                </Button>
                {isManager && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveAthlete?.(athlete.id);
                    }}
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
