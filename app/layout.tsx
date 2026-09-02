// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { MobileBottomNav } from '@/components/ui/MobileBottomNav';

const inter = Inter({ subsets: ['latin'] });

// 1. Mobile Browser Top Bar Color (Safari & Chrome)
export const viewport: Viewport = {
  themeColor: '#0B1B3D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// 2. Complete Search Engine & Cross-Browser Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://marvelvarieties.com'),
  title: {
    default: 'Marvel Varieties | Online Storefront for Quality Essentials',
    template: '%s | Marvel Varieties',
  },
  description:
    'Shop Marvel Varieties for quality household appliances, designer footwear, hair extensions, and trending gadgets in Lagos, Nigeria. Fast nationwide delivery.',
  applicationName: 'Marvel Varieties',
  keywords: [
    'Marvel Varieties',
    'marvelvarieties',
    'marvel-varieties',
    'Marvel Varieties Lagos',
    'Marvel Varieties store',
    'human hair extensions Lagos',
    'household appliances Nigeria',
    'kitchen utilities Lagos',
    'designer footwear Nigeria',
    'Online Shopping Lagos',
    'Ojodu Berger store',
  ],
  authors: [{ name: 'Marvel Varieties', url: 'https://marvelvarieties.com' }],
  creator: 'Marvel Varieties',
  publisher: 'Marvel Varieties',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/MARVEL_VARIETIES-removebg-preview.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://marvelvarieties.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://marvelvarieties.com',
    siteName: 'Marvel Varieties',
    title: 'Marvel Varieties | Official Online Storefront',
    description:
      'Order quality household items, hair extensions, and gadgets directly from Marvel Varieties. Quick Lagos dispatch and nationwide delivery.',
    images: [
      {
        url: '/MARVEL_VARIETIES-removebg-preview.png',
        width: 800,
        height: 600,
        alt: 'Marvel Varieties Logo & Storefront',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marvel Varieties | Quality Essentials Lagos',
    description: 'Shop household appliances, footwear, and essentials with verified bank transfer verification.',
    images: ['/MARVEL_VARIETIES-removebg-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Marvel Varieties',
    alternateName: ['marvelvarieties', 'Marvel-Varieties', 'Marvel Varieties Store'],
    url: 'https://marvelvarieties.com',
    logo: 'https://marvelvarieties.com/MARVEL_VARIETIES-removebg-preview.png',
    image: 'https://marvelvarieties.com/MARVEL_VARIETIES-removebg-preview.png',
    description:
      'Official store of Marvel Varieties for quality household appliances, hair products, and fashion items in Lagos, Nigeria.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3 Olanipekun Street, Opposite Akiode Health Centre, Ojodu Berger',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos State',
      addressCountry: 'NG',
    },
    telephone: '+2347062297299',
    priceRange: '₦₦',
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Direct Bank Transfer, OPay',
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} pb-16 md:pb-0 antialiased`}>
        {children}

        {/* Global Cart Slide-Over Drawer */}
        <CartDrawer />

        {/* Global Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}