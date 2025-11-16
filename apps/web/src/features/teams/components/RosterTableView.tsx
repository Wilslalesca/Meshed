import { Button } from "@/shared/components/ui/button";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  roster: any[];
  onRemoveAthlete?: (id: string) => void;
}

export const RosterTableView = ({ roster, onRemoveAthlete }: Props) => {
  const navigate = useNavigate();

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

            <td className="p-2 text-right">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
