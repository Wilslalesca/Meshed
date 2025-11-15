import { Calendar, Users, Building2, ShieldCheck } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function Features() {
  return (
    <section id="features" className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-bold">What you can run on UMA</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Plug-and-play modules—swap the copy later.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Smart Scheduling"
            desc="Recurring events, blackout windows, and conflict warnings."
            icon={<Calendar className="h-5 w-5" />}
          />
          <FeatureCard
            title="Teams & Rosters"
            desc="Keep athletes, staff, and permissions in sync."
            icon={<Users className="h-5 w-5" />}
          />
          <FeatureCard
            title="Facilities"
            desc="Manage fields, courts, time blocks, and requests."
            icon={<Building2 className="h-5 w-5" />}
          />
          <FeatureCard
            title="Compliance"
            desc="Eligibility, notes and simple audit trails."
            icon={<ShieldCheck className="h-5 w-5" />}
          />
        </div>
      </div>
    </section>
  );
}
