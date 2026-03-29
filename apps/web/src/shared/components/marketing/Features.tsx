import { Calendar, Users, Building2, ShieldCheck } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function Features() {
    return (
        <section id="features" className="py-16">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-2xl font-bold">Features that fix the mess</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Reduce time-consuming scheduling work, prevent booking conflicts,
                    remove inefficient manual processes, and keep communication organized.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard
                        title="Faster Scheduling"
                        desc="Cut the time-consuming back-and-forth with one shared calendar and clear approvals."
                        icon={<Calendar className="h-5 w-5" />}
                    />
                    <FeatureCard
                        title="Conflict Prevention"
                        desc="Spot overlaps early to avoid double-bookings and last-minute facility changes."
                        icon={<Users className="h-5 w-5" />}
                    />
                    <FeatureCard
                        title="Facilities"
                        desc="Centralize availability and requests so booking stays efficient and consistent."
                        icon={<Building2 className="h-5 w-5" />}
                    />
                    <FeatureCard
                        title="Organized Communication"
                        desc="Keep updates, changes, and notifications in one place so everyone stays aligned."
                        icon={<ShieldCheck className="h-5 w-5" />}
                    />
                </div>
            </div>
        </section>
    );
}
