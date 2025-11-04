import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

// If the import path is flaky in dev, use the public path as a fallback:
// import Logo from "@/assets/Logo.png";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[--color-paper] text-[--color-foreground]">
      {/* Left side */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <div className="bg-[--color-teal] text-[--color-primary-foreground] flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            UMA
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side: keep logo visible */}
      <div className="relative hidden lg:flex items-center justify-center bg-[--color-navy]">
        {/* If your bundler import works, swap src to {Logo} */}
        <img
          src="/Logo.png"
          alt="UMA Logo"
          className="max-w-[420px] w-3/4 h-auto object-contain drop-shadow-xl"
        />
      </div>
      
      <div className="relative hidden lg:block bg-muted">
        <img src="/Logo.png" alt="UMA Logo" className="absolute inset-0 h-full w-full object-contain" />
        </div>

    </div>
    
  );
}
