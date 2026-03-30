import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

export function CTA() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-5xl px-6 text-center">
                <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to try Meshed?</h3>
                <p className="mt-3 text-lg text-muted-foreground">
                    Create a free account—bring your first team in minutes.
                </p>
                <div className="mt-8 flex justify-center gap-3">
                    <Button size="lg" className="btn-primary">
                        <Link to="/register">Start free</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="btn-outline">
                        <Link to="/contact">Talk to us</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
