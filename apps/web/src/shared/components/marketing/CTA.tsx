import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="card p-8 text-center relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(500px 250px at 10% 0%, #00e5ff22 0%, transparent 60%), radial-gradient(500px 250px at 90% 100%, #ff8a4225 0%, transparent 60%)",
            }}
          />
          <h3 className="text-2xl font-bold">Ready to try Meshed?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a free account—bring your first team in minutes.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button size="lg" className="btn-primary">
              <Link to="/register">Start free</Link>
            </Button>
            <Button variant="outline" size="lg" className="btn-outline">
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
