import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { apiResetPassword } from "@/features/auth/api/password";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  async function handleReset() {
    await apiResetPassword(email, code, password);
    setDone(true);
  }

  if (done) {
    return (
      <div className="p-6 max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-semibold">Password Updated</h1>
        <p className="text-sm text-muted-foreground">You can now log in.</p>
        <Button onClick={() => (window.location.href = "/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Reset Password</h1>

      <Input
        placeholder="6-digit code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Input
        placeholder="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button className="w-full" onClick={handleReset}>
        Reset Password
      </Button>
    </div>
  );
}
