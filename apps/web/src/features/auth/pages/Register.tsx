import React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import Logo from "@/assets/Logo_Master.png";
import Meshed_Icon from "@/assets/Icon.png";

export const Register: React.FC = () => (
    <div className="grid h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
                <a href="/" className="flex items-center gap-2 font-medium">
                    <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <img src={Meshed_Icon} alt="Meshed Icon" className="size-4" />
                    </div>
                    Meshed
                </a>
            </div>
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <RegisterForm />
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
