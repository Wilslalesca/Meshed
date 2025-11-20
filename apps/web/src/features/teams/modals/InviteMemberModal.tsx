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
import { useEffect, useState } from "react";
import { apiAddAthleteByEmail } from "../api/teams";
import { apiAddStaff } from "../api/staff";
import { useAuth } from "@/shared/hooks/useAuth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  teamId: string;
  defaultRole?: "athlete" | "manager";
  onInvited: () => void;
}

export const InviteMemberModal = ({ open, onOpenChange, teamId, defaultRole = "athlete", onInvited }: Props) => {
  const { token } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(defaultRole);
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(open) {
      setRole(defaultRole);
      setEmail("");
      setPosition("");
    }
  }, [open, defaultRole]);

  async function handleInvite() {
    if (!token) return;
    setLoading(true);

    if (role === "athlete") {
      await apiAddAthleteByEmail(teamId, email, token);

    } else {
      await apiAddStaff(teamId, email, role, position, token);

    }
    setLoading(false);

    onOpenChange(false);
    onInvited();
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

          <Select value={role} onValueChange={(v) => setRole(v as "athlete" | "manager")}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="athlete">Athlete</SelectItem>
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
