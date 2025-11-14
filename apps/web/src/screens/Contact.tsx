import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true); // wire up later to your API
  }

  return (
    <div className="min-h-screen w-screen bg-vice-gradient text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Have questions about UMA? Drop your info and we’ll reach out.
        </p>

        <form className="mt-8 card p-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            <span>Name</span>
            <input
              className="mt-1 w-full rounded-md border bg-transparent p-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[--color-vice-pink]/40"
              placeholder="Jane Doe"
              required
            />
          </label>
          <label className="block text-sm">
            <span>Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-md border bg-transparent p-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[--color-vice-pink]/40"
              placeholder="jane@example.com"
              required
            />
          </label>
          <label className="block text-sm">
            <span>Message</span>
            <textarea
              rows={5}
              className="mt-1 w-full rounded-md border bg-transparent p-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[--color-vice-pink]/40"
              placeholder="Tell us about your program…"
            />
          </label>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Or email us later: <span className="text-[--color-vice-teal]">hello@use-uma.dev</span>
            </div>
            <Button type="submit" className="btn-primary">Send</Button>
          </div>

          {sent && (
            <div className="mt-3 rounded-md border border-[--color-vice-teal]/40 bg-[--color-vice-teal]/10 p-3 text-sm">
              Thanks! This form isn’t wired yet—we’ll hook it up to email later.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
