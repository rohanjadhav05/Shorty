"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Link2,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { getLongUrl } from "@/lib/api";
import { ApiError } from "@/lib/types";

/**
 * Lookup page to retrieve the original URL from a short code
 */
export default function LookupPage() {
  const [shortCode, setShortCode] = useState("");
  const [longUrl, setLongUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  /**
   * Handles form submission to lookup the original URL
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const code = shortCode.trim();
    if (!code) {
      toast.error("Please enter a short code");
      return;
    }

    setIsLoading(true);
    setLongUrl(null);

    try {
      const result = await getLongUrl(code);
      setLongUrl(result);
      toast.success("Original URL found!");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to lookup URL");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Copies the long URL to clipboard
   */
  const handleCopy = async () => {
    if (!longUrl) return;
    try {
      await navigator.clipboard.writeText(longUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
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
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">URL</span> Lookup
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a short code to retrieve the original long URL
          </p>
        </header>

        {/* Lookup Form */}
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
                    Enter the 7-character code from your shortened URL
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
                      Looking up...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Lookup URL
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Result */}
        {longUrl && (
          <section className="max-w-xl mx-auto animate-fade-in-up">
            <Card className="glass-card border-primary/30">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-500">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Original URL Found</span>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-sm text-muted-foreground mb-2">
                      Original URL:
                    </p>
                    <p className="text-foreground break-all font-mono text-sm">
                      {longUrl}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="flex-1 h-12 border-border/50 hover:bg-primary/10 hover:border-primary/50"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy URL
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(longUrl, "_blank", "noopener,noreferrer")
                      }
                      variant="outline"
                      className="flex-1 h-12 border-border/50 hover:bg-primary/10 hover:border-primary/50"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit URL
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
