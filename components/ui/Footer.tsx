// components/ui/Footer.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  MessageCircle
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#070F22] text-white border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Overview */}
          <div className="space-y-4">
            <div className="relative h-10 w-36">
              <Image 
                src="/marvel-varieties/public/MARVEL_VARIETIES-removebg-preview.png" 
                alt="Marvel Varieties" 
                fill 
                className="object-contain brightness-0 invert" 
              />
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Your one-stop destination for quality household items, kitchen appliances, designer footwear, fashion, and gadgets with direct bank transfer payment verification.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-slate-300">
              <ShieldCheck size={14} className="text-[#D4AF37]" />
              <span className="text-[10px] font-bold tracking-wide">Registered Enterprise</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-widest text-[#D4AF37] text-[10px]">Customer Service</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/track" className="hover:text-white transition flex items-center gap-1">
                  <span>Track Order Dispatch</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition flex items-center gap-1">
                  <span>Customer Account & Orders</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition flex items-center gap-1">
                  <span>Browse Storefront Catalog</span>
                  <ArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Verified Payment Account */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-widest text-[#D4AF37] text-[10px]">Payment Verification</h4>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Official Bank Account</p>
              <p className="font-bold text-white text-sm">OPay</p>
              <p className="font-mono text-base font-black text-[#D4AF37] tracking-wider">7062297299</p>
              <p className="text-[10px] text-slate-300 font-medium">OYELEYE MARVELLOUS</p>
            </div>
          </div>

          {/* Contact & Physical Hub */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-widest text-[#D4AF37] text-[10px]">Contact & Dispatch Hub</h4>
            <ul className="space-y-2.5 text-slate-400 text-[11px]">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span>3 Olanipekun Street, Opposite Akiode Health Centre, Ojodu Berger, Lagos State</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#D4AF37] shrink-0" />
                <a href="tel:07062297299" className="hover:text-white transition font-mono">+234 706 229 7299</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[#25D366] shrink-0" />
                <a 
                  href="https://wa.me/2347062297299?text=Hello%20Marvel%20Varieties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition font-bold"
                >
                  WhatsApp: 07062297299
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-[#D4AF37] shrink-0" />
                <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Marvel Varieties. All rights reserved.</p>
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