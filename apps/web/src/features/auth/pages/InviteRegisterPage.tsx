import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiAcceptInvite } from "../api/invites";
import { RegisterForm } from "../components/RegisterForm";
import Logo from "@/assets/Logo_Master.png";

export default function InviteRegisterPage() {
    const [params] = useSearchParams();
    const token = params.get("invite");
    const [invite, setInvite] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    useEffect(() => {
        async function load() {
            if (!token) {
                nav("/register");
                return;
            }

            const accepted = await apiAcceptInvite(token);

            if (!accepted) {
                nav("/register");
                return;
            }

            setInvite(accepted);
            setLoading(false);
        }

        load();
    }, [token]);

    if (loading) {
        return <div className="p-8">Validating invite…</div>;
    }

    return (
        <div className="grid h-screen lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="/" className="flex items-center gap-2 font-medium">
                        Meshed
                    </a>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <RegisterForm
                            invitedEmail={invite.email}
                            invitedRole={invite.role}
                            invitedToken={token ?? undefined}
                        />
                    </div>
                </div>
            </div>

            <div className="relative hidden bg-muted lg:block">
                <img
                    src={Logo}
                    alt="Meshed Logo"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
