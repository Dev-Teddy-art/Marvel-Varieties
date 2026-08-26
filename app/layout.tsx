// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/ui/CartDrawer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B1B3D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Marvel Varieties | Your One-Stop Shopping Destination",
    template: "%s | Marvel Varieties",
  },
  description: "Shop quality household essentials, fashion, footwear, kitchen appliances, and gadgets with verified direct payment dispatch.",
  icons: {
    icon: [
      { url: "/MARVEL%20VARIETIES.png", type: "image/png" },
    ],
    shortcut: "/MARVEL%20VARIETIES.png",
    apple: "/MARVEL%20VARIETIES.png",
  },
  openGraph: {
    title: "Marvel Varieties | Your One-Stop Shopping Destination",
    description: "Shop quality household essentials, fashion, kitchen appliances, and gadgets.",
    url: "https://marvelvarieties.com",
    siteName: "Marvel Varieties",
    images: [
      {
        url: "/MARVEL%20VARIETIES.png",
        width: 800,
        height: 800,
        alt: "Marvel Varieties Logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-[#F8FAFC] text-slate-900 selection:bg-[#D4AF37] selection:text-[#0B1B3D] min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}