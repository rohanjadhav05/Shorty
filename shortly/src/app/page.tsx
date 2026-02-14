"use client";

import { useState, useRef } from "react";
import { UrlForm } from "@/components/UrlForm";
import { ShortUrlCard } from "@/components/ShortUrlCard";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ActionButtons } from "@/components/ActionButtons";
import { FeatureCards } from "@/components/FeatureCards";
import { ShortenResponse } from "@/lib/types";
import {
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

/**
 * Feature card for the "Why Choose Shortly?" section
 */
function WhyFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div className="p-3 rounded-xl bg-primary/10 text-primary mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * Home page component with hero section and URL shortening form
 */
export default function Home() {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenResponse | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  /**
   * Handles successful URL shortening
   */
  const handleSuccess = (response: ShortenResponse) => {
    setShortenedUrl(response);
  };

  /**
   * Scrolls to the URL shortening form
   */
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Action Buttons */}
        <ActionButtons onShortUrlClick={scrollToForm} />

        {/* URL Shortener Card */}
        <section ref={formRef} className="max-w-2xl mx-auto mb-12">
          <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary/5">
            <UrlForm onSuccess={handleSuccess} />
          </div>
        </section>

        {/* Result Card */}
        {shortenedUrl && (
          <section className="max-w-2xl mx-auto mb-12">
            <ShortUrlCard data={shortenedUrl} />
          </section>
        )}

        {/* Feature Cards Section */}
        <FeatureCards />

        {/* How It Works Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-10">
            Three simple steps to create and share your short links.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Paste Your URL</h3>
                <p className="text-sm text-muted-foreground">
                  Enter any long URL into the input field. Add a custom alias or
                  set an expiration date if needed.
                </p>
              </div>
              <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2" />
            </div>
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Get Short Link</h3>
                <p className="text-sm text-muted-foreground">
                  Click the button and instantly receive a short, unique
                  7-character code for your URL.
                </p>
              </div>
              <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2" />
            </div>
            <div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Share & Track</h3>
                <p className="text-sm text-muted-foreground">
                  Share your short link anywhere. Track clicks and view analytics
                  to measure engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Shortly Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Why Choose <span className="gradient-text">Shortly</span>?
          </h2>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-10">
            Built for speed, security, and simplicity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WhyFeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Generate short links instantly with our optimized infrastructure powered by intelligent caching."
            />
            <WhyFeatureCard
              icon={Shield}
              title="Secure & Reliable"
              description="Your links are secure with HTTPS support and 99.9% uptime for your shortened URLs."
            />
            <WhyFeatureCard
              icon={BarChart3}
              title="Analytics Ready"
              description="Track every click in real-time. See how many times your links are accessed and when."
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Shortly. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Built with Next.js, Tailwind CSS, and shadcn/ui
          </p>
        </footer>
      </main>
    </div>
  );
}
