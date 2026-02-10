"use client";

import { useState } from "react";
import { UrlForm } from "@/components/UrlForm";
import { ShortUrlCard } from "@/components/ShortUrlCard";
import { ShortenResponse } from "@/lib/types";
import { Link2, Zap, Shield, BarChart3 } from "lucide-react";

/**
 * Feature card component for the features section
 */
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/20 border border-border/30 transition-all duration-300 hover:bg-secondary/30 hover:border-primary/30">
      <div className="p-3 rounded-xl bg-primary/10 text-primary mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/**
 * Home page component with hero section and URL shortening form
 */
export default function Home() {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenResponse | null>(null);

  /**
   * Handles successful URL shortening
   */
  const handleSuccess = (response: ShortenResponse) => {
    setShortenedUrl(response);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          {/* Logo & Brand */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-primary/10 animate-pulse-glow">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Shortly
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-foreground/80 font-medium mb-4">
            Shorten URLs. Share Smarter.
          </p>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create short, memorable links in seconds. Track clicks, customize aliases,
            and share with confidence.
          </p>
        </header>

        {/* URL Shortener Card */}
        <section className="max-w-2xl mx-auto mb-12">
          <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary/5">
            <UrlForm onSuccess={handleSuccess} />
          </div>
        </section>

        {/* Result Card */}
        {shortenedUrl && (
          <section className="max-w-2xl mx-auto mb-16">
            <ShortUrlCard data={shortenedUrl} />
          </section>
        )}

        {/* Features Section */}
        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why Choose <span className="gradient-text">Shortly</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Generate short links instantly with our optimized infrastructure."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Reliable"
              description="Your links are secure and always available when you need them."
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics Ready"
              description="Track clicks and monitor performance of your shortened links."
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-20 pt-8 border-t border-border/30">
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
