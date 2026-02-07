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
import { apiAddAthleteByEmail, apiBulkAddAthletesByCsv } from "../api/teams";
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
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if(open) {
      setRole(defaultRole);
      setEmail("");
      setPosition("");
      setFile(null);
    }
  }, [open, defaultRole]);

  async function handleInvite() {
    if (!token) return;
    setLoading(true);

    try {
      if (file) {
        await apiBulkAddAthletesByCsv(teamId, file, token);
      } else if (role === "athlete") {
        await apiAddAthleteByEmail(teamId, email, token);
      } else {
        await apiAddStaff(teamId, email, role, position, token);
      }
    } finally {
      setLoading(false);

      onOpenChange(false);
      onInvited();
      setPosition("");
      setFile(null);
    }
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
            onChange={(e) => { setEmail(e.target.value); setFile(null); }}
            disabled={!!file}
          />

          <Select value={role} onValueChange={(v) => setRole(v as "athlete" | "staff")}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="athlete">Athlete</SelectItem>
              <SelectItem value="staff">Manager</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Position (optional)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          {/* <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Or upload a CSV/Excel of athlete emails</div>
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f) {
                  setRole("athlete");
                  setEmail("");
                }
              }}
              disabled={!!email}
            />
          </div> */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={(!email.trim() && !file) || loading}>
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
