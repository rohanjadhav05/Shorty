"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Link2,
  ArrowLeft,
  Loader2,
  MousePointerClick,
  Calendar,
  Clock,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { getUrlStats } from "@/lib/api";
import { UrlStatsResponse, ApiError } from "@/lib/types";

/**
 * Formats a date string for display
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Stat card component for displaying individual statistics
 */
function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        accent
          ? "bg-primary/10 border-primary/30"
          : "bg-secondary/30 border-border/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            accent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p
            className={`text-lg font-semibold ${
              accent ? "text-primary" : "text-foreground"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Stats page to view analytics for a shortened URL
 */
export default function StatsPage() {
  const [shortCode, setShortCode] = useState("");
  const [stats, setStats] = useState<UrlStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles form submission to get URL statistics
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const code = shortCode.trim();
    if (!code) {
      toast.error("Please enter a short code");
      return;
    }

    setIsLoading(true);
    setStats(null);

    try {
      const result = await getUrlStats(code);
      setStats(result);
      toast.success("Statistics loaded!");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-primary/20">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">URL</span> Analytics
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            View click statistics and details for your shortened URLs
          </p>
        </header>

        {/* Stats Form */}
        <section className="max-w-xl mx-auto mb-8">
          <Card className="glass-card">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shortCode" className="text-sm font-medium">
                    Short Code
                  </Label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="shortCode"
                      type="text"
                      placeholder="e.g., ABC1234"
                      value={shortCode}
                      onChange={(e) => setShortCode(e.target.value)}
                      disabled={isLoading}
                      className="pl-12 h-14 text-base bg-input/50 border-border/50 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the short code to view its analytics
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !shortCode.trim()}
                  className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading stats...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-5 w-5" />
                      View Analytics
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Stats Result */}
        {stats && (
          <section className="max-w-xl mx-auto animate-fade-in-up">
            <Card className="glass-card border-primary/30">
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Statistics for</p>
                    <p className="text-xl font-bold text-primary">
                      {stats.shortCode}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatCard
                    icon={MousePointerClick}
                    label="Total Clicks"
                    value={stats.clickCount.toLocaleString()}
                    accent
                  />
                  <StatCard
                    icon={Calendar}
                    label="Created"
                    value={formatDate(stats.createdAt)}
                  />
                  {stats.expiresAt && (
                    <StatCard
                      icon={Clock}
                      label="Expires"
                      value={formatDate(stats.expiresAt)}
                    />
                  )}
                </div>

                {/* Original URL */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Original URL
                  </p>
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-sm text-foreground/80 break-all font-mono">
                      {stats.longUrl}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  onClick={() =>
                    window.open(stats.longUrl, "_blank", "noopener,noreferrer")
                  }
                  variant="outline"
                  className="w-full h-12 border-border/50 hover:bg-primary/10 hover:border-primary/50"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Original URL
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
