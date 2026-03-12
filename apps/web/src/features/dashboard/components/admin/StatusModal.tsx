import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { ButtonGroupSeparator } from "@/shared/components/ui/button-group";
import { Textarea } from "@/shared/components/ui/textarea";
import { apiUpdateEventStatus } from "@/features/teams/api/events";
import { toast } from "sonner";
import type { TeamEvent } from "@/features/teams/types/event";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export const StatusModal = ({
    open,
    onOpenChange,
    eventInfo,
    teamName,
    onAdded,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eventInfo: TeamEvent;
    teamName?: string;
    onAdded?: () => void;
}) => {
    const { token } = useAuth();
    const [status, setStatus] = useState<string>("pending");
    const [loading, setLoading] = useState(false);
    const [showCommentBox, setCommentBox] = useState(false);
    const [comment, setComment] = useState<string>("");

    async function handleSubmit() {
        if (!eventInfo.id) {
            toast.error("Event ID is missing!");
            return;
        }
        const data = { status: status, id: eventInfo.id, comments: comment };

        if (status !== "approved" && comment.trim() === "") {
            toast.error("Please provide a comment for non-approved statuses.");
            return;
        }
        try {
            const res = await apiUpdateEventStatus(data, token!);
            if (!res) {
                toast.error("Something went wrong!");
            } else {
                toast.success("Event status updated!");
                onAdded?.();
                onOpenChange(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-150 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Updating {eventInfo.name} status for {teamName}
                    </DialogTitle>
                    <DialogDescription>
                        Select a status from the dropdown and click submit to
                        confirm your changes
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 items-center w-full">
                    <div className="text-sm mb-1">
                        Select a status for this event
                    </div>
                    <Tabs
                        value={status}
                        onValueChange={setStatus}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger className="w-full" value="approved">
                                Approved
                            </TabsTrigger>
                            <TabsTrigger className="w-full" value="denied">
                                Denied
                            </TabsTrigger>
                            <TabsTrigger className="w-full" value="pending">
                                Pending
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className=" p-4 items-center w-full">
                    <div className="text-sm mb-1">
                        Status set to <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>, {status == "approved" ? "(optional) " : ""}please provide a comment:
                    </div>
                    <div className="flex flex-col">
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={4}
                        />
                    </div>
                </div>

                <div className="flex flex-col p-4 items-center">
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full gap-3"
                    >
                        Submit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
