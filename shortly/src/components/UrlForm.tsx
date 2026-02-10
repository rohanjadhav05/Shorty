"use client";

import { useState, FormEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Link2, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { shortenUrl } from "@/lib/api";
import { ShortenRequest, ShortenResponse, ApiError } from "@/lib/types";

interface UrlFormProps {
  onSuccess: (response: ShortenResponse) => void;
}

/**
 * URL shortening form component with validation and loading state
 */
export function UrlForm({ onSuccess }: UrlFormProps) {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationDays, setExpirationDays] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  /**
   * Validates the URL format
   */
  const isValidUrl = useCallback((url: string): boolean => {
    if (!url.trim()) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  }, []);

  /**
   * Validates the custom alias format
   */
  const isValidAlias = useCallback((alias: string): boolean => {
    if (!alias) return true; // Optional field
    const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return aliasRegex.test(alias);
  }, []);

  /**
   * Validates expiration days
   */
  const isValidExpiration = useCallback((days: string): boolean => {
    if (!days) return true; // Optional field
    const num = parseInt(days, 10);
    return !isNaN(num) && num > 0 && num <= 365;
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate URL
    if (!isValidUrl(longUrl)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    // Validate custom alias if provided
    if (customAlias && !isValidAlias(customAlias)) {
      toast.error(
        "Custom alias must be 3-20 characters and contain only letters, numbers, hyphens, and underscores"
      );
      return;
    }

    // Validate expiration days if provided
    if (expirationDays && !isValidExpiration(expirationDays)) {
      toast.error("Expiration days must be between 1 and 365");
      return;
    }

    setIsLoading(true);

    try {
      const request: ShortenRequest = {
        longUrl: longUrl.trim(),
        ...(customAlias && { customAlias: customAlias.trim() }),
        ...(expirationDays && { expirationDays: parseInt(expirationDays, 10) }),
      };

      const response = await shortenUrl(request);
      
      toast.success("URL shortened successfully!");
      onSuccess(response);
      
      // Reset form
      setLongUrl("");
      setCustomAlias("");
      setExpirationDays("");
      setShowAdvanced(false);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Main URL Input */}
      <div className="space-y-2">
        <Label htmlFor="longUrl" className="text-sm font-medium text-foreground/80">
          Enter your long URL
        </Label>
        <div className="relative">
          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="longUrl"
            type="url"
            placeholder="https://example.com/your-very-long-url-here"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            disabled={isLoading}
            className="pl-12 h-14 text-base bg-input/50 border-border/50 focus:border-primary focus:ring-primary placeholder:text-muted-foreground/50"
            required
            aria-describedby="url-hint"
          />
        </div>
        <p id="url-hint" className="text-xs text-muted-foreground">
          Paste any long URL to create a short, shareable link
        </p>
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        aria-expanded={showAdvanced}
      >
        <Sparkles className="h-4 w-4" />
        {showAdvanced ? "Hide" : "Show"} advanced options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 p-4 rounded-xl bg-secondary/30 border border-border/30 animate-fade-in-up">
          {/* Custom Alias */}
          <div className="space-y-2">
            <Label htmlFor="customAlias" className="text-sm font-medium text-foreground/80">
              Custom alias (optional)
            </Label>
            <Input
              id="customAlias"
              type="text"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              disabled={isLoading}
              className="h-12 bg-input/50 border-border/50 focus:border-primary focus:ring-primary placeholder:text-muted-foreground/50"
              maxLength={20}
              aria-describedby="alias-hint"
            />
            <p id="alias-hint" className="text-xs text-muted-foreground">
              3-20 characters: letters, numbers, hyphens, underscores
            </p>
          </div>

          {/* Expiration Days */}
          <div className="space-y-2">
            <Label htmlFor="expirationDays" className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expiration (optional)
            </Label>
            <Input
              id="expirationDays"
              type="number"
              placeholder="30"
              value={expirationDays}
              onChange={(e) => setExpirationDays(e.target.value)}
              disabled={isLoading}
              className="h-12 bg-input/50 border-border/50 focus:border-primary focus:ring-primary placeholder:text-muted-foreground/50"
              min={1}
              max={365}
              aria-describedby="expiration-hint"
            />
            <p id="expiration-hint" className="text-xs text-muted-foreground">
              Number of days until the link expires (1-365)
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !longUrl.trim()}
        className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Shortening...
          </>
        ) : (
          <>
            <Link2 className="mr-2 h-5 w-5" />
            Shorten URL
          </>
        )}
      </Button>
    </form>
  );
}
