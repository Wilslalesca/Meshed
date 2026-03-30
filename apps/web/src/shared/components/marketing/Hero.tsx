import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export function Hero() {
  return (
    <section className="text-foreground">
      <div className="mx-auto max-w-7xl px-10 py-24">

        {/* ── Centered headline block ─────────────────────────────────── */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-[--color-vice-teal]/20 text-[--color-meshed-teal-mid] border border-[--color-vice-teal]/40">
            New • Facility &amp; Team Ops
          </div>

          <h1 className="mt-6 text-7xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
            Schedule less,<br />do more
          </h1>

          <p className="mt-8 max-w-3xl text-xl/8 text-muted-foreground">
            Centralize rosters, practices, facilities and eligibility in one
            beautiful workspace. Inspired by platforms like EZFacility—built
            for modern college programs.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="btn-primary h-14 px-8 text-lg">
              <Link to="/register">Get started</Link>
            </Button>
            <Button variant="outline" size="lg" className="btn-outline h-14 px-8 text-lg">
              <a href="#features">See features</a>
            </Button>
          </div>

          <div className="mt-5 text-sm text-muted-foreground">
            No credit card. Try it free.
          </div>
        </div>

        {/* ── Dashboard + Calendar — stacked, image + blurb side by side ── */}
        <div className="mt-28 flex flex-col gap-24">

          {/* Dashboard — image left, blurb right */}
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="overflow-hidden rounded-2xl border border-[--color-vice-teal]/30 bg-white/70 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-[--color-vice-teal]/20 bg-[--color-vice-teal]/10 px-5 py-3">
                <div className="text-sm font-semibold text-foreground">Dashboard</div>
                <div className="text-xs text-muted-foreground">Teams, alerts, quick actions</div>
              </div>
              <div className="p-4">
                <img
                  src="/dashboard view.png"
                  alt="Dashboard view"
                  className="h-auto w-full rounded-lg border border-border bg-background object-contain"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Everything in one place</h2>
              <p className="mt-4 text-lg/8 text-muted-foreground">
                Get a bird's-eye view of your program the moment you log in. See
                team alerts, upcoming events, and key stats—all from a single,
                clean dashboard built for busy athletic staff.
              </p>
            </div>
          </div>

          {/* Calendar — blurb left, image right */}
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold tracking-tight">Facility bookings at a glance</h2>
              <p className="mt-4 text-lg/8 text-muted-foreground">
                Visualize every court, field, and room across your entire facility.
                Spot conflicts before they happen, drag-and-drop to reschedule, and
                keep coaches and athletes on the same page automatically.
              </p>
            </div>
            <div className="order-1 md:order-2 overflow-hidden rounded-2xl border border-[--color-vice-teal]/30 bg-white/70 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-[--color-vice-teal]/20 bg-[--color-vice-teal]/10 px-5 py-3">
                <div className="text-sm font-semibold text-foreground">Calendar</div>
                <div className="text-xs text-muted-foreground">Facility bookings at a glance</div>
              </div>
              <div className="p-4">
                <img
                  src="/calendar_example.png"
                  alt="Calendar example"
                  className="h-auto w-full rounded-lg border border-border bg-background object-contain"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}