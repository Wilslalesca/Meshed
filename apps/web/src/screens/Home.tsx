import React from "react";
import { RotatingHeader } from "@/shared/components/layout/RotatingHeader";

export const Home: React.FC = () => (
    <div className="flex flex-col">
        <RotatingHeader />
        <section className="p-6">
            <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-10 text-center text-sm text-muted-foreground">
                Landing content placeholder.
            </div>
        </section>
    </div>
);
