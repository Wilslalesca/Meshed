import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
              Scheduling, teams & compliance—made easy.
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
            {/* Placeholder “product shot” — swap later */}
            <div className="aspect-video rounded-lg bg-[linear-gradient(135deg,#0f142b_0%,#1e2442_100%)] relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background:
                       "radial-gradient(600px 300px at 100% 0%, #ff5ea833 0%, transparent 60%), radial-gradient(600px 300px at 0% 100%, #00e5ff33 0%, transparent 60%)"
                   }} />
              <div className="absolute inset-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"></div>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Preview panel — replace with a real screenshot later
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
