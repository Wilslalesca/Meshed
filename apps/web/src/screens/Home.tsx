import React from 'react';
import { Hero } from "@/shared/components/marketing/Hero";
import { Features } from "@/shared/components/marketing/Features";
import { Stats } from "@/shared/components/marketing/Stats";
import { Testimonial } from "@/shared/components/marketing/Testimonial";
import { CTA } from "@/shared/components/marketing/CTA";

export const Home: React.FC = () => (
  <div className="flex min-h-screen flex-col meshed-bg text-foreground">

    {/* ── Nav ──────────────────────────────────────────────────────────── */}
    <header style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      padding: "28px 48px",
      borderBottom: "2px solid #5db8ae",
    }}>
      <img
        src="/Meshed_m.png"
        alt="Meshed"
        style={{ height: 200, width: 200, objectFit: "contain", flexShrink: 0 }}
        draggable={false}
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          if (el.src.includes("/Meshed_m.png")) el.src = "/meshed_m.png";
          else if (el.src.includes("/meshed_m.png")) el.src = "/meshed_M.png";
          else el.style.display = "none";
        }}
      />
      <span style={{
        fontSize: 72,
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        color: "inherit",
        fontFamily: "primary, sans-serif",
      }}>
        meshed
      </span>
    </header>

    {/* ── Page content ─────────────────────────────────────────────────── */}
    <Hero />
    <Features />
    <Stats />
    <Testimonial />
    <CTA />

  </div>
);