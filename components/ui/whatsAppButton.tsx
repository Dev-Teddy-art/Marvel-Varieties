// components/ui/WhatsAppButton.tsx
'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppButton({ 
  phoneNumber = '2347062297299', 
  defaultMessage = 'Hello Marvel Varieties, I would like to make an inquiry about an order.' 
}: WhatsAppButtonProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 group cursor-pointer"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={26} className="fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
        Chat With Us
      </span>
    </a>
  );
}