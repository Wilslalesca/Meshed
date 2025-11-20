import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiDeleteTeam } from "../api/teams";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  teamId: string;
}

export const DeleteTeamModal = ({ open, onOpenChange, teamId }: Props) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  async function handleDelete() {
    if (!token) return;
    const ok = await apiDeleteTeam(teamId, token);
    if (ok) {
      onOpenChange(false);
      navigate("/teams");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure? This action cannot be undone.
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
