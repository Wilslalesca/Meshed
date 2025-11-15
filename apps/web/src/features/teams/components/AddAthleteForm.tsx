import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface AddAthleteFormProps {
  onAdd: (email: string) => void;
}

export const AddAthleteForm = ({ onAdd }: AddAthleteFormProps) => {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        onAdd(email);
        setEmail("");
      }}
      className="flex gap-3"
    >
      <Input
        type="email"
        placeholder="athlete@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button type="submit">Add</Button>
    </form>
  );
};
