import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import type { Role } from "@/features/auth/types/auth";

export function AddMemberDialog({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (member: { email: string; role: Role }) => Promise<void> }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user" as Role);
    const [pending, setPending] = useState(false);

    async function handleSubmit() {

        if(!email.trim()) {
            toast.error("Email is required");
            return;
        }
        setPending(true);

        try {
            await onSubmit({ email: email.trim().toLowerCase(), role });
            setEmail("");
            setRole("user");
            toast.success("Member added successfully");
            onClose();
        }
        catch (error) {
            console.error("Error adding member:", error);
            toast.error("Failed to add member");
        }
        finally {
            setPending(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleSubmit} disabled={pending}>
                        {pending ? "Adding..." : "Add Member"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}