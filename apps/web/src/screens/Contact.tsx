import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const isValid = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <div className="flex min-h-screen flex-col meshed-bg text-foreground">

      {/* ── Nav ── */}
      <header style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "28px 48px",
        borderBottom: "2px solid #5db8ae",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 20, textDecoration: "none", color: "inherit" }}>
          <img
            src="/Meshed_m.png"
            alt="Meshed"
            style={{ height: 80, width: 80, objectFit: "contain", flexShrink: 0 }}
            draggable={false}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              if (el.src.includes("/Meshed_m.png")) el.src = "/meshed_m.png";
              else if (el.src.includes("/meshed_m.png")) el.src = "/meshed_M.png";
              else el.style.display = "none";
            }}
          />
          <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
            meshed
          </span>
        </Link>
      </header>

      {/* ── Content ── */}
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="w-full max-w-xl">

          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold tracking-tight">Talk to us</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question or want to see Meshed in action?<br />We'd love to hear from you.
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-2xl border border-[--color-vice-teal]/40 bg-white/70 backdrop-blur shadow-xl p-12 text-center">
              <div style={{ fontSize: 56 }}>🎉</div>
              <h2 className="mt-4 text-2xl font-bold">Message sent!</h2>
              <p className="mt-2 text-muted-foreground">
                We'll be in touch at{" "}
                <span className="font-medium text-foreground">{form.email}</span>.
              </p>
              <Button
                className="mt-8 btn-primary"
                size="lg"
                onClick={() => { setForm({ name: "", email: "", role: "", message: "" }); setStatus("idle"); }}
              >
                Send another
              </Button>
            </div>
          ) : (
            <form
              className="rounded-2xl border border-[--color-vice-teal]/40 bg-white/70 backdrop-blur shadow-xl p-10 flex flex-col gap-5"
              onSubmit={handleSubmit}
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold">Your name</span>
                <input
                  name="name" type="text" placeholder="Jane Smith"
                  value={form.name} onChange={handleChange} required
                  className="rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[--color-vice-teal] transition"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold">Your email</span>
                <input
                  name="email" type="email" placeholder="jane@university.edu"
                  value={form.email} onChange={handleChange} required
                  className="rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[--color-vice-teal] transition"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold">
                  Your role <span className="text-muted-foreground font-normal">(optional)</span>
                </span>
                <select
                  name="role" value={form.role} onChange={handleChange}
                  className="rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[--color-vice-teal] transition"
                >
                  <option value="">Select a role…</option>
                  <option>Athletic Director</option>
                  <option>Head Coach</option>
                  <option>Assistant Coach</option>
                  <option>Facilities Manager</option>
                  <option>Administrator</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold">Message</span>
                <textarea
                  name="message" rows={5}
                  placeholder="Tell us about your program or what you're looking for…"
                  value={form.message} onChange={handleChange} required
                  className="rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[--color-vice-teal] transition resize-none"
                />
              </label>

              {status === "error" && (
                <p className="text-sm text-destructive text-center">
                  Something went wrong — please try again or email us directly.
                </p>
              )}

              <Button
                type="submit" size="lg"
                className="btn-primary h-14 text-lg w-full mt-2"
                disabled={!isValid || status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Or reach us directly at{" "}
                <a href="mailto:unitematchalign@gmail.com" className="underline hover:text-foreground transition-colors">
                  unitematchalign@gmail.com
                </a>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}