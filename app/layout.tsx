import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? new URL(process.env.NEXT_PUBLIC_APP_URL)
  : new URL("http://localhost:3000");

export const viewport: Viewport = {
  themeColor: "teal",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: baseUrl,

  alternates: {
    canonical: "./",
  },

  title: {
    default: "Directory | Find the Best Local Businesses",
    template: "%s | Directory",
  },
  description:
    "The most comprehensive guide to Coffee Shops, Gyms, and local professionals.",

  openGraph: {
    title: {
      default: "Directory | Find Local Professionals",
      template: "%s | Directory",
    },
    description: "Discover top-rated businesses in your area.",
    url: baseUrl,
    siteName: "Directory",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Directory Preview",
      },
    ],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
