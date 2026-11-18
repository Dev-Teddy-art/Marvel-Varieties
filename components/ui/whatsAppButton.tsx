// components/ui/whatsAppButton.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function WhatsAppButton() {
  const pathname = usePathname();

  // Hide on checkout so the "Submit Order" button is 100% unobstructed on mobile
  if (pathname === '/checkout') return null;

  const whatsappUrl =
    'https://wa.me/2347062297299?text=Hello%20Marvel%20Varieties%2C%20I%20need%20help%20with%20an%20order.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 h-11 w-11 md:h-12 md:w-12 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg flex items-center justify-center transition-transform active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 md:h-6 md:w-6"
      >
        <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.758.459 3.473 1.332 4.986L2 22l5.188-1.361a9.927 9.927 0 0 0 4.843 1.258h.004c5.515 0 9.969-4.454 9.969-9.969A9.936 9.936 0 0 0 19.08 4.92 9.905 9.905 0 0 0 12.031 2Zm5.822 14.262c-.246.693-1.434 1.326-1.99 1.409-.51.076-1.155.108-1.864-.117-.43-.137-.982-.32-1.69-.626-2.976-1.285-4.92-4.283-5.069-4.482-.148-.198-1.21-1.61-1.21-3.071 0-1.461.766-2.18 1.038-2.477.272-.297.594-.371.792-.371.198 0 .396.002.569.01.183.009.428-.07.669.51.247.594.841 2.054.915 2.203.074.148.124.322.025.52-.099.198-.149.322-.297.495-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.769 1.269 1.651 2.055 1.135 1.012 2.092 1.326 2.389 1.474.297.149.47.124.644-.074.173-.198.742-.866.94-1.163.198-.297.396-.248.668-.149.272.099 1.732.817 2.029.965.297.149.495.223.569.347.074.124.074.718-.172 1.411Z" />
      </svg>
    </a>
  );
}