"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { ShortenResponse } from "@/lib/types";

interface ShortUrlCardProps {
  data: ShortenResponse;
}

/**
 * Formats a date string for display
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
 * Truncates a URL for display
 */
function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + "...";
}

/**
 * Card component displaying the shortened URL with copy functionality
 */
export function ShortUrlCard({ data }: ShortUrlCardProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Copies the short URL to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please try again.");
    }
  };

  /**
   * Opens the short URL in a new tab
   */
  const handleOpenLink = () => {
    window.open(data.shortUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full glass-card animate-fade-in-up overflow-hidden">
      <CardContent className="p-6 space-y-4">
        {/* Short URL - Main Display */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Your shortened URL
          </p>
          <div className="flex items-center gap-3">
            <p className="flex-1 text-xl font-semibold text-primary break-all">
              {data.shortUrl}
            </p>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="h-10 w-10 border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
                aria-label={copied ? "Copied" : "Copy to clipboard"}
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpenLink}
                className="h-10 w-10 border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
                aria-label="Open link in new tab"
              >
                <ExternalLink className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/30" />

        {/* Original URL */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Original URL
          </p>
          <p className="text-sm text-foreground/70 break-all" title={data.longUrl}>
            {truncateUrl(data.longUrl, 80)}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 pt-2">
          {/* Created Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDate(data.createdAt)}</span>
          </div>

          {/* Expiration Date */}
          {data.expiresAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Expires: {formatDate(data.expiresAt)}</span>
            </div>
          )}
        </div>

        {/* Copy Button - Large */}
        <Button
          onClick={handleCopy}
          className="w-full h-12 mt-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all"
          variant="outline"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-5 w-5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-5 w-5" />
              Copy Short URL
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
