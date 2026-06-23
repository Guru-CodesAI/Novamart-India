import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NovaMart India — Next Generation 3D Commerce Platform",
    template: "%s | NovaMart India",
  },
  description:
    "Experience shopping beyond reality. India's most futuristic eCommerce platform with immersive 3D product experiences, premium brands, and lightning-fast delivery.",
  keywords: [
    "NovaMart India",
    "Indian eCommerce",
    "3D Shopping",
    "Premium Electronics",
    "Luxury Fashion",
    "Online Shopping India",
    "Futuristic Shopping",
  ],
  authors: [{ name: "NovaMart India" }],
  creator: "NovaMart India",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "NovaMart India",
    title: "NovaMart India — Next Generation 3D Commerce Platform",
    description: "Experience shopping beyond reality. India's most futuristic eCommerce platform.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaMart India",
    description: "Experience shopping beyond reality.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-background text-white font-body antialiased">
        <Providers>
          <SmoothScrollProvider>
            <CursorGlow />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  );
}
