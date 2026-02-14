import { CheckCircle } from "lucide-react";

export function HeroSection() {
  return (
    <header className="text-center mb-12 md:mb-16">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
        Shorten URLs.{" "}
        <span className="gradient-text">Share Smarter.</span>
      </h1>

      {/* Product Description */}
      <p className="text-lg md:text-xl text-foreground/80 font-medium max-w-2xl mx-auto mb-4">
        A modern, high-performance URL shortening platform with QR code
        generation, user lookup, and real-time analytics.
      </p>

      {/* Supporting Benefits */}
      <p className="text-muted-foreground max-w-xl mx-auto mb-8">
        Create short, memorable links in seconds. Track clicks, customize
        aliases, generate QR codes, and share with confidence -- all in one
        place.
      </p>

      {/* Trust Badges */}
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
  );
}
