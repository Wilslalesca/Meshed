import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { apiDeleteTeam } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  teamId: string;
  onDeleted: () => void;
}

export const DeleteTeamModal = ({
  open,
  onOpenChange,
  teamId,
  onDeleted,
}: Props) => {
  const { token } = useAuth();

  async function handleDelete() {
    if (!token) return;
    await apiDeleteTeam(teamId, token);
    onDeleted();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team?</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground">
          This action cannot be undone. All athletes, staff, and associations will be removed.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
