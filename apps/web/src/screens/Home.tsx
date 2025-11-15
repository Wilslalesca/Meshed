import React from 'react';
import { RotatingHeader } from '@/shared/components/layout/RotatingHeader';
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Stats } from "@/components/marketing/Stats";
import { Testimonial } from "@/components/marketing/Testimonial";
import { CTA } from "@/components/marketing/CTA";

export const Home: React.FC = () => (
  <div className="flex flex-col">
    <RotatingHeader />
    <section className="p-6">
      <Hero />
      <Features />
      <Stats />
      <Testimonial />
      <CTA />
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-10 text-center text-sm text-muted-foreground">
        Landing content placeholder.
      </div>
    </section>
  </div>
);
