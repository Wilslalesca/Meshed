import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/shared/components/ui/select";
import { useState } from "react";
import { apiInviteUser } from "../api/invites";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  teamId: string;
  onInvited: () => void;
}

export const InviteStaffModal = ({
  open,
  onOpenChange,
  teamId,
  onInvited,
}: Props) => {
  const { token } = useAuth();

  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleInvite() {
    if (!token) return;

    setLoading(true);
    const res = await apiInviteUser(teamId, email, "staff", position, token);
    setLoading(false);

    if (res.success) {
      onInvited();
      setEmail("");
      setPosition("");
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Staff Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assistant_coach">Assistant Coach</SelectItem>
              <SelectItem value="trainer">Trainer</SelectItem>
              <SelectItem value="manager">Team Manager</SelectItem>
              <SelectItem value="scout">Scout</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={loading || !email.trim()}>
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
