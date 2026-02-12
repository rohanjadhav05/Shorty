"use client";

import { useState, FormEvent, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  QrCode,
  Link2,
  ArrowLeft,
  Loader2,
  Download,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { generateQrCode } from "@/lib/api";
import { ApiError } from "@/lib/types";

/**
 * QR Code generation page
 */
export default function QrPage() {
  const [url, setUrl] = useState("");
  const [qrBlob, setQrBlob] = useState<Blob | null>(null);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);

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
   * Real-time URL validation status
   */
  const urlValidation = useMemo(() => {
    if (!url.trim()) {
      return { isValid: false, message: "", showStatus: false };
    }

    const isValid = isValidUrl(url);
    return {
      isValid,
      message: isValid ? "Valid URL" : "URL must start with http:// or https://",
      showStatus: touched || url.length > 5,
    };
  }, [url, touched, isValidUrl]);

  /**
   * Handles form submission to generate QR code
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);

    // Clean up previous preview URL
    if (qrPreviewUrl) {
      URL.revokeObjectURL(qrPreviewUrl);
    }

    try {
      const blob = await generateQrCode(url.trim(), 300);
      setQrBlob(blob);

      // Create preview URL from blob
      const previewUrl = URL.createObjectURL(blob);
      setQrPreviewUrl(previewUrl);

      toast.success("QR code generated successfully!");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to generate QR code");
      setQrBlob(null);
      setQrPreviewUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles QR code download
   */
  const handleDownload = () => {
    if (!qrBlob) return;

    // Create temporary anchor element
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(qrBlob);
    anchor.download = "qr.png";

    // Trigger download
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Clean up
    URL.revokeObjectURL(anchor.href);

    toast.success("QR code downloaded!");
  };

  /**
   * Handle URL input change
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  /**
   * Handle input blur to show validation
   */
  const handleUrlBlur = () => {
    if (url.trim()) {
      setTouched(true);
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
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">QR Code</span> Generator
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Generate a QR code for any URL. The URL is automatically shortened
            and encoded into the QR code.
          </p>
        </header>

        {/* QR Form */}
        <section className="max-w-xl mx-auto mb-8">
          <Card className="glass-card">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm font-medium">
                    Enter URL
                  </Label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="url"
                      type="text"
                      placeholder="https://example.com/your-url-here"
                      value={url}
                      onChange={handleUrlChange}
                      onBlur={handleUrlBlur}
                      disabled={isLoading}
                      className={`pl-12 pr-12 h-14 text-base bg-input/50 border-border/50 placeholder:text-muted-foreground/50 transition-colors ${
                        urlValidation.showStatus
                          ? urlValidation.isValid
                            ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/20"
                            : "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                          : "focus:border-primary focus:ring-primary"
                      }`}
                      required
                    />
                    {/* Validation Icon */}
                    {urlValidation.showStatus && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {urlValidation.isValid ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {/* Validation Message */}
                  {urlValidation.showStatus ? (
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        urlValidation.isValid ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {urlValidation.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      The URL will be shortened and encoded into the QR code
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !url.trim() ||
                    (urlValidation.showStatus && !urlValidation.isValid)
                  }
                  className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-5 w-5" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* QR Preview */}
        {qrPreviewUrl && (
          <section className="max-w-xl mx-auto animate-fade-in-up">
            <Card className="glass-card border-primary/30">
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your QR Code</p>
                    <p className="text-lg font-semibold text-primary">
                      Ready to download
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* QR Image Preview */}
                <div className="flex justify-center p-6 bg-white rounded-xl">
                  <img
                    src={qrPreviewUrl}
                    alt="Generated QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>

                {/* Original URL */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Original URL
                  </p>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-sm text-foreground/80 break-all font-mono">
                      {url}
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <Button
                  onClick={handleDownload}
                  className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
