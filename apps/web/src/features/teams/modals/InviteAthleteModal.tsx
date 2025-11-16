import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiInviteUser } from "../api/invites";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  teamId: string;
  onInvited: () => void;
}

export const InviteAthleteModal = ({
  open,
  onOpenChange,
  teamId,
  onInvited,
}: Props) => {
  const { token } = useAuth();
  const [email, setEmail] = useState("");

  async function handleInvite() {
    if (!token || !email.trim()) return;

    const res = await apiInviteUser(teamId, email, "athlete", null, token);
    if (res.success) {
      onOpenChange(false);
      setEmail("");
      onInvited();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Athlete</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="athlete@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={!email.trim()}>
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
