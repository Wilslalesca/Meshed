import React from 'react';
import { Hero } from "@/shared/components/marketing/Hero";
import { Features } from "@/shared/components/marketing/Features";
import { Stats } from "@/shared/components/marketing/Stats";
import { Testimonial } from "@/shared/components/marketing/Testimonial";
import { CTA } from "@/shared/components/marketing/CTA";

export const Home: React.FC = () => (
  <div className="flex min-h-screen flex-col meshed-bg text-foreground">

    {/* ── Nav ── */}
    <header style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "14px 36px",
      borderBottom: "2px solid #5db8ae",
    }}>
      <img
        src="/o_mast_color.png"
        alt="Meshed"
        style={{ height: 440, width: 1040, objectFit: "contain", flexShrink: 0 }}
        draggable={false}
      />
    </header>

    {/* ── Page content ── */}
    <Hero />
    <Features />
    <Stats />
    <Testimonial />
    <CTA />

  </div>
);