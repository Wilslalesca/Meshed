import { cn } from "@/shared/utils/utils";
import { validatePassword } from "../utils/passwordValidation";

export function PasswordRequirements({ password }: { password: string }) {
    if (password.length === 0) return null;

    const passwordValidation = validatePassword(password);

    return (
        <div className="text-xs space-y-1">
            <div
                className={cn(
                    "flex items-center gap-2",
                    passwordValidation.minLength
                        ? "text-green-600"
                        : "text-destructive",
                )}
            >
                <span className="text-xs">
                    {passwordValidation.minLength ? "✓" : "✗"}
                </span>
                At least 8 characters
            </div>

            <div
                className={cn(
                    "flex items-center gap-2",
                    passwordValidation.hasNumber
                        ? "text-green-600"
                        : "text-destructive",
                )}
            >
                <span className="text-xs">
                    {passwordValidation.hasNumber ? "✓" : "✗"}
                </span>
                At least 1 number
            </div>

            <div
                className={cn(
                    "flex items-center gap-2",
                    passwordValidation.hasSpecialChar
                        ? "text-green-600"
                        : "text-destructive",
                )}
            >
                <span className="text-xs">
                    {passwordValidation.hasSpecialChar ? "✓" : "✗"}
                </span>
                At least 1 special character
            </div>
        </div>
    );
}
