// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/whatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Marvel Varieties | Your One-Stop Destination',
  description: 'Premium essentials with verified direct bank transfer and nationwide fulfillment.',
  icons: {
    icon: '/MARVEL VARIETIES.png',
    shortcut: '/marvel-varieties/public/MARVEL_VARIETIES-removebg-preview.png',
    apple: '/MARVEL VARIETIES.png',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <CartDrawer />
        <WhatsAppButton phoneNumber="2347062297299" />
      </body>
    </html>
  );
}