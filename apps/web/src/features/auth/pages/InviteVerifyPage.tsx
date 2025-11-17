import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { apiVerifyInvite, apiAcceptInvite } from "../api/invite";
import { useNavigate } from "react-router-dom";

export default function InviteVerifyPage() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleVerfiy () {
        setError("");

        const res = await apiVerifyInvite(email, code);

        if (!res.success) {
            setError("Invalid email or code.");
            return;
        }

        if (res.needsRegistration) {
            navigate(`/register?email=${email}&code=${code}`);
            return;
        }

        await apiAcceptInvite(email, code);
        navigate("/dashboard");
    }

    return (
        <div className="p-6 max-w-md mx-auto space-y-4">
            <h1 className="text-xl font-semibold">
                Accept Team Invite
            </h1>
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="text"
                placeholder="Verification Code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}

            <Button onClick={handleVerfiy}>
                Continue
            </Button>
        </div>
    );

}