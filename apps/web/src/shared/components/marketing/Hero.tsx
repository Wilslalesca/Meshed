import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export function Hero() {
  return (
    <section className="bg-vice-gradient text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-[--color-vice-teal] text-[#001017]">
              New • Facility & Team Ops
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Schedule less, do more
            </h1>
            <p className="mt-4 text-sm/6 text-muted-foreground">
              Centralize rosters, practices, facilities and eligibility in one
              beautiful workspace. Inspired by platforms like EZFacility—built
              for modern college programs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="btn-primary">
                <Link to="/register">Get started</Link>
              </Button>
              <Button variant="outline" size="lg" className="btn-outline">
                <a href="#features">See features</a>
              </Button>
            </div>

            <div className="mt-6 text-xs text-muted-foreground">
              No credit card. Try it free.
            </div>
          </div>

          <div className="rounded-xl border border-sidebar-border bg-card/80 p-4 shadow-md backdrop-blur">
            <div className="grid gap-3">
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <img
                  src="/dashboard view.png"
                  alt="Dashboard view"
                  className="h-auto w-full object-cover"
                  draggable={false}
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <img
                  src="/calendar_example.png"
                  alt="Calendar example"
                  className="h-auto w-full object-cover"
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
