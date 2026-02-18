import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { createTeamNotification } from "@/features/teams/api/notifications.api";
import { useAuth } from "@/shared/hooks/useAuth";

export function CreateTeamNotificationModal({
    open,
    onOpenChange,
    teamId,
    teamName,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    teamId: string;
    teamName: string;
}) {
    const { token } = useAuth();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit() {
        if (!message.trim()) return;
        if (!token) return;
        setLoading(true);
        try {
            await createTeamNotification(
                teamId,
                { type: "SYSTEM", message, meta: { teamId, url: `/teams/${teamId}` } },
                token!,
            );
            onOpenChange(false);
            setMessage("");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Create notification for {teamName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    {/* <div>
            <div className="text-sm mb-1">Type</div>
            <Input value={type} onChange={(e) => setType(e.target.value)} />
          </div> */}

                    <div>
                        <div className="text-sm mb-1">Message</div>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a short message to the team..."
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={loading || !message.trim()}
                    >
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
