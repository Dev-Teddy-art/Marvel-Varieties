// components/ui/Footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  MessageCircle 
} from 'lucide-react';
import { getStoreSettingsAction } from '@/lib/actions';

export function Footer() {
  const [settings, setSettings] = useState({
    bankName: 'OPay',
    accountNumber: '7062297299',
    accountName: 'OYELEYE MARVELLOUS',
    contactAddress: '3 Olanipekun Street, Opposite Akiode Health Centre, Ojodu Berger, Lagos State',
    contactPhone: '+234 706 229 7299',
    whatsappNumber: '07062297299',
    operatingHours: 'Mon – Sat: 8:00 AM – 6:00 PM',
  });

  useEffect(() => {
    async function loadLiveSettings() {
      const data = await getStoreSettingsAction();
      if (data) {
        setSettings({
          bankName: data.bankName || 'OPay',
          accountNumber: data.accountNumber || '7062297299',
          accountName: data.accountName || 'OYELEYE MARVELLOUS',
          contactAddress: data.contactAddress || '3 Olanipekun Street, Opposite Akiode Health Centre, Ojodu Berger, Lagos State',
          contactPhone: data.contactPhone || '+234 706 229 7299',
          whatsappNumber: data.whatsappNumber || '07062297299',
          operatingHours: data.operatingHours || 'Mon – Sat: 8:00 AM – 6:00 PM',
        });
      }
    }
    loadLiveSettings();
  }, []);

  return (
    <footer className="bg-[#0B1B3D] text-slate-300 border-t border-[#D4AF37]/20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="relative h-10 w-36">
              <Image 
                src="/MARVEL_VARIETIES-removebg-preview.png" 
                alt="Marvel Varieties" 
                fill 
                sizes="144px"
                className="object-contain brightness-0 invert" 
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your one-stop destination for quality household items, kitchen appliances, designer footwear, fashion, and gadgets with direct bank transfer payment verification.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#D4AF37]">
              <ShieldCheck size={14} /> Registered Enterprise
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">Customer Service</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track" className="hover:text-white transition flex items-center gap-1">
                  Track Order Dispatch <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition flex items-center gap-1">
                  Customer Account & Orders <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition flex items-center gap-1">
                  Browse Storefront Catalog <ArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Dynamic Bank Payment Verification Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">Payment Verification</h4>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 text-xs">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Official Bank Account</p>
              <p className="font-bold text-white text-sm">{settings.bankName}</p>
              <p className="font-mono text-base font-black text-[#D4AF37] tracking-wider">{settings.accountNumber}</p>
              <p className="text-[10px] text-slate-400 uppercase">{settings.accountName}</p>
            </div>
          </div>

          {/* Dynamic Contact & Dispatch Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">Contact & Dispatch Hub</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.contactAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#D4AF37] shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[#25D366] shrink-0" />
                <a 
                  href={`https://wa.me/234${settings.whatsappNumber.replace(/^0/, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#D4AF37] shrink-0" />
                <span>{settings.operatingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 Marvel Varieties. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure Direct Bank Settlement</span>
            <span>•</span>
            <span>Fast Nationwide Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}