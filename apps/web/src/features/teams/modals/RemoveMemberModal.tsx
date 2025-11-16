import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { apiRemoveUserFromTeam } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  teamId: string;
  userId: string;
  onRemoved: () => void;
}

export const RemoveMemberDialog = ({
  open,
  onOpenChange,
  teamId,
  userId,
  onRemoved,
}: Props) => {
  const { token } = useAuth();

  async function handleRemove() {
    if (!token) return;

    await apiRemoveUserFromTeam(teamId, userId, token);
    onRemoved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member?</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground">
          This member will lose all access to the team.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRemove}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
