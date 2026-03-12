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
import { useAuth } from "@/shared/hooks/useAuth";
import { toast } from "sonner";

export function FacilityComments({
    open,
    onOpenChange,
    facilityId,
    teamId,
    teamName,
    adminId
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    facilityId: string;
    teamId: string;
    teamName: string;
    adminId: string;
}) {
    const { token } = useAuth();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit() {
        if (!message.trim()) return;
        if (!token) return;
        setLoading(true);
        try {
           
        } catch  {
            toast.error("Failed to send notification. Please try again.");
        } 
        finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Comments required for: {teamName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">

                    <div>
                        <div className="text-sm mb-1">Comment</div>
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
