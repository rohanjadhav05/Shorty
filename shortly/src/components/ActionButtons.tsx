"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Link2, QrCode, Search, BarChart3 } from "lucide-react";

interface ActionButtonsProps {
  onShortUrlClick?: () => void;
}

export function ActionButtons({ onShortUrlClick }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 mb-12">
      <Button
        size="lg"
        className="w-full sm:w-auto gap-2 font-semibold shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
        onClick={onShortUrlClick}
      >
        <Link2 className="h-4 w-4" />
        Short URL
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full sm:w-auto gap-2 font-semibold"
        asChild
      >
        <Link href="/qr">
          <QrCode className="h-4 w-4" />
          QR Code
        </Link>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full sm:w-auto gap-2 font-semibold"
        asChild
      >
        <Link href="/lookup">
          <Search className="h-4 w-4" />
          User Lookup
        </Link>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full sm:w-auto gap-2 font-semibold"
        asChild
      >
        <Link href="/stats">
          <BarChart3 className="h-4 w-4" />
          Stats / Analytics
        </Link>
      </Button>
    </div>
  );
}
