"use client";

import { useState } from "react";
import Link from "next/link";
import { UrlForm } from "@/components/UrlForm";
import { ShortUrlCard } from "@/components/ShortUrlCard";
import { ShortenResponse } from "@/lib/types";
import {
  Link2,
  Zap,
  Shield,
  BarChart3,
  Search,
  ArrowRight,
  Sparkles,
  QrCode,
  Globe,
  MousePointerClick,
  Clock,
  CheckCircle,
} from "lucide-react";

/**
 * Navigation card component for quick actions
 */
function NavCard({
  href,
  icon: Icon,
  title,
  description,
  gradient,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Link href={href} className="group block">
      <div
        className={`relative overflow-hidden rounded-2xl p-6 border border-border/30 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 ${gradient}`}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent" />

        <div className="relative flex items-start gap-4">
          <div className="p-3 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 group-hover:border-primary/30 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

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
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Transform long, unwieldy URLs into short, memorable links in seconds. 
            Track clicks, customize aliases, generate QR codes, and share with confidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No registration required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Instant generation
            </span>
          </div>
        </header>

        {/* URL Shortener Card */}
        <section className="max-w-2xl mx-auto mb-12">
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

        {/* Quick Actions - Navigation Cards */}
        <section className="max-w-3xl mx-auto mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NavCard
              href="/lookup"
              icon={Search}
              title="URL Lookup"
              description="Find the original URL from a short code"
              gradient="bg-gradient-to-br from-secondary/40 to-secondary/20"
            />
            <NavCard
              href="/stats"
              icon={BarChart3}
              title="URL Analytics"
              description="View click statistics and URL details"
              gradient="bg-gradient-to-br from-secondary/40 to-secondary/20"
            />
            <NavCard
              href="/qr"
              icon={QrCode}
              title="QR Code"
              description="Generate QR codes for your URLs"
              gradient="bg-gradient-to-br from-secondary/40 to-secondary/20"
            />
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              What is <span className="gradient-text">Shortly</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Shortly is a modern, high-performance URL shortening service that transforms 
              long, complex URLs into short, memorable links. Perfect for social media, 
              marketing campaigns, and anywhere character count matters.
            </p>
          </div>

          {/* Stats/Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="text-center p-6 rounded-2xl bg-secondary/20 border border-border/30">
              <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-bold text-foreground">Global</p>
              <p className="text-sm text-muted-foreground">Availability</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-secondary/20 border border-border/30">
              <MousePointerClick className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-bold text-foreground">Real-time</p>
              <p className="text-sm text-muted-foreground">Click Tracking</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-secondary/20 border border-border/30">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-bold text-foreground">Custom</p>
              <p className="text-sm text-muted-foreground">Expiration</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-secondary/20 border border-border/30">
              <QrCode className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-bold text-foreground">QR Code</p>
              <p className="text-sm text-muted-foreground">Generation</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Paste Your URL</h3>
                <p className="text-sm text-muted-foreground">
                  Enter any long URL into the input field. Add a custom alias or set an expiration date if needed.
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
                  Click the button and instantly receive a short, unique 7-character code for your URL.
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
                  Share your short link anywhere. Track clicks and view analytics to measure engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why Choose <span className="gradient-text">Shortly</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Generate short links instantly with our optimized infrastructure powered by MongoDB and intelligent caching."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Reliable"
              description="Your links are secure with HTTPS support, and our service ensures 99.9% uptime for your shortened URLs."
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics Ready"
              description="Track every click in real-time. See how many times your links are accessed and when."
            />
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Perfect <span className="gradient-text">For</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Social Media Marketing</h3>
                  <p className="text-sm text-muted-foreground">
                    Share clean, professional links on Twitter, Instagram, LinkedIn, and other platforms where character count matters.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Email Campaigns</h3>
                  <p className="text-sm text-muted-foreground">
                    Create trackable links for newsletters and email marketing to measure click-through rates and engagement.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Print & QR Codes</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate QR codes for flyers, business cards, and posters. Short URLs make better QR codes with faster scanning.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/30">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">SMS & Messaging</h3>
                  <p className="text-sm text-muted-foreground">
                    Save characters in text messages and chat apps. Short links are easier to type and share on mobile devices.
                  </p>
                </div>
              </div>
            </div>
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
