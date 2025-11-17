import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { apiVerifyEmail, apiSendEmailVerification } from "../api/verify";
import { Loader2 } from "lucide-react";

export const EmailVerifyModal = ({
    open,
    onOpenChange,
    email,
    onSuccess,
}: any) => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async () => {
        setLoading(true);
        setError("");

        const res = await apiVerifyEmail(email, code);

        if (!res) {
            setError("Invalid verification code.");
            setLoading(false);
            return;
        }

        setLoading(false);
        onOpenChange(false);
        onSuccess();
    };

    const handleResend = async () => {
        setResending(true);
        setError("");

        await apiSendEmailVerification(email);

        setResending(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Email Verification</DialogTitle>
                </DialogHeader>

                <p className="text-sm mb-2">
                    Enter the 6-digit code we sent to <strong>{email}</strong>.
                </p>

                <Input
                    value={code}
                    maxLength={6}
                    onChange={(e) => setCode(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                    className="w-full mt-4"
                    onClick={handleVerify}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                        "Verify Email"
                    )}
                </Button>

                <Button
                    variant="ghost"
                    className="w-full mt-2 text-sm"
                    onClick={handleResend}
                    disabled={resending}
                >
                    {resending ? "Code Resent!" : "Resend Code"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
