import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { apiAddAthleteByEmail, apiBulkAddAthletesByCsv } from "../api/teams";
import { useAuth } from "@/shared/hooks/useAuth";
import { toast } from "sonner";

export const AddAthleteModal = ({ open, onOpenChange, teamId, onAdded }: any) => {
    const [email, setEmail] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const { token } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file type
            if (!selectedFile.name.endsWith('.csv')) {
                toast.error("Please select a CSV file");
                return;
            }
            setFile(selectedFile);
            setEmail(""); // Clear email if file is selected
        }
    };

    const handleSubmit = async () => {
        // Validate input early
        if (!file && !email) {
            toast.error("Please enter an email or upload a CSV file");
            return;
        }

        setUploading(true);
        try {
            if (file) {
                // Upload CSV file
                const result = await apiBulkAddAthletesByCsv(teamId, file, token!);
                toast.success(result.message || "Athletes added successfully");
                setFile(null);
            } else if (email) {
                // Add single athlete by email
                const res = await apiAddAthleteByEmail(teamId, email, token!);
                if (res) {
                    toast.success("Athlete invited successfully");
                    setEmail("");
                } else {
                    toast.error("Failed to add athlete");
                }
            }
            
            onAdded();
            onOpenChange(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to add athletes");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Athlete</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Add Single Athlete</label>
                        <Input
                            placeholder="athlete@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setFile(null); // Clear file if email is entered
                            }}
                            disabled={!!file}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Upload CSV File</label>
                        <Input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            disabled={!!email}
                        />
                        {file && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Selected: {file.name}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            CSV should contain email addresses (one per line or comma-separated)
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={uploading}>
                        {uploading ? "Processing..." : "Send Invite"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};