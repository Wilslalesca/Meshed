import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { apiSendResetCode } from "@/features/auth/api/password";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const nav = useNavigate();

  async function handleSend() {
    await apiSendResetCode(email);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="p-6 max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-semibold">Check Your Email</h1>
        <p className="text-sm text-muted-foreground">
          A password reset code was sent to {email}.
        </p>
        <Button onClick={() => nav(`/reset-password?email=${email}`)}>
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Forgot Password</h1>

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button className="w-full" onClick={handleSend}>
        Send Reset Code
      </Button>
    </div>
  );
}
