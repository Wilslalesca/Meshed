import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { apiAddAthleteByEmail } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";

export const AddAthleteModal = ({ open, onOpenChange, teamId, onAdded }: any) => {
    const [email, setEmail] = useState("");
    const { token } = useAuth();

    const handleSubmit = async () => {
        const res = await apiAddAthleteByEmail(teamId, email, token!);
        if (res) {
            setEmail("");
            onAdded();
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Athlete</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="athlete@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <DialogFooter>
                    <Button onClick={handleSubmit}>Send Invite</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
