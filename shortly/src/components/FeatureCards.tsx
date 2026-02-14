import { Link2, QrCode, Search, BarChart3 } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";

const features = [
  {
    icon: Link2,
    title: "URL Shortening",
    description:
      "Transform long, unwieldy URLs into short, memorable links. Set custom aliases and expiration dates for full control.",
  },
  {
    icon: QrCode,
    title: "QR Code Generator",
    description:
      "Generate scannable QR codes for your shortened URLs. Perfect for print materials, presentations, and offline sharing.",
  },
  {
    icon: Search,
    title: "User Lookup",
    description:
      "Quickly find the original URL behind any short code. Verify destinations before clicking for added security.",
  },
  {
    icon: BarChart3,
    title: "Real-time Stats",
    description:
      "Track every click in real-time. View detailed analytics including click counts, creation dates, and link performance.",
  },
];

export function FeatureCards() {
  return (
    <section className="max-w-5xl mx-auto mb-20">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
        Everything You Need
      </h2>
      <p className="text-muted-foreground text-center max-w-xl mx-auto mb-10">
        Powerful features to shorten, share, track, and manage your links.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
