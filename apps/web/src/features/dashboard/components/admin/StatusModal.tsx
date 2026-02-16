import React, { useEffect, useState, type JSX } from "react";
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
import { apiUpdateEventStatus } from "@/features/teams/api/events";
import { toast } from "sonner";

export const StatusModal = ({
    open,
    onOpenChange,
    eventInfo,
    teamName,
    onAdded,
}: any) => {
    const { token } = useAuth();
    const [status, setStatus] = useState<string>("pending");

    async function handleSubmit() {
        const data = {status:status, id:eventInfo.id}
        try{
            const res = await apiUpdateEventStatus(data, token!)
            if(!res){
                toast.error("Something went wrong!")
            }
            else{
                toast.success("Event status updated!")
                onAdded?.();
                onOpenChange(false);
            }
        }
        catch (error){
            console.log(error)
            toast.error("Something went wrong!")
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-150 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Updating {eventInfo.name} status for {teamName}</DialogTitle>
                    <DialogDescription>
                        Select a status from the dropdown and click submit to confirm your changes
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col p-4 items-center">
                    <Select className="w-full gap-3"
                            value={status}
                            onValueChange={setStatus}
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="ex. Pending" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="denied">Denied</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
