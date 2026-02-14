import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shortly - Shorten URLs. Share Smarter.",
  description:
    "Shortly is a modern URL shortener that helps you create short, memorable links. Share smarter with custom aliases and link analytics.",
  keywords: ["url shortener", "short links", "link management", "shortly"],
  authors: [{ name: "Shortly Team" }],
  openGraph: {
    title: "Shortly - Shorten URLs. Share Smarter.",
    description:
      "Create short, memorable links with Shortly. Custom aliases, analytics, and more.",
    type: "website",
    locale: "en_US",
    siteName: "Shortly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shortly - Shorten URLs. Share Smarter.",
    description:
      "Create short, memorable links with Shortly. Custom aliases, analytics, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
