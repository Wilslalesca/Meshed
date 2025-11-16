import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import { useState } from "react";
import { apiInviteToTeam } from "../api/invites";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  teamId: string;
}

export const InviteMemberModal = ({ open, onOpenChange, teamId }: Props) => {
  const { token } = useAuth();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("athlete");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleInvite() {
    if (!token) return;

    setLoading(true);
    await apiInviteToTeam(teamId, { email, role, position }, token);
    setLoading(false);

    onOpenChange(false);
    setEmail("");
    setPosition("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="athlete">Athlete</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Position (optional)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={!email.trim() || loading}>
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
