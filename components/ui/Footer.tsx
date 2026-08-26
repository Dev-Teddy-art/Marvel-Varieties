// components/ui/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Building2, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B1B3D] text-white border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="relative h-10 w-44">
              <Image
                src="/MARVEL VARIETIES.png"
                alt="Marvel Varieties"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your one-stop destination for quality household items, kitchen appliances, designer footwear, fashion, and gadgets with direct bank transfer payment verification.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1.5 rounded-full text-[#D4AF37] text-[11px] font-bold">
              <ShieldCheck size={14} /> Registered Enterprise
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/track" className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-[#D4AF37]" /> Track Order Dispatch
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-[#D4AF37]" /> Customer Account & Orders
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-[#D4AF37]" /> Browse Storefront Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Bank Transfer Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              Payment Verification
            </h4>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1.5 text-xs">
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase">Official Bank Account</span>
              <p className="font-bold text-white">Sterling Bank</p>
              <p className="font-mono text-sm font-black text-amber-300">0100286255</p>
              <p className="text-[11px] text-slate-300 truncate">MARVEL VARIETIES NIG. LTD</p>
            </div>
          </div>

          {/* Contact & Physical Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              Contact & Dispatch Hub
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span>23, Golden Plaza, Opp. Filling Station, Lagos State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#D4AF37] shrink-0" />
                <span className="font-mono font-bold text-white">+234 814 687 5777</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#D4AF37] shrink-0" />
                <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Marvel Varieties. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 size={13} /> Direct Transfer Verified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#D4AF37] font-semibold">
              <Truck size={13} /> Nationwide Delivery
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}