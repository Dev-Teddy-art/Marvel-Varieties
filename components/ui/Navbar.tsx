// components/ui/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/useCart';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  Truck, 
  ChevronRight,
  ShieldAlert,
  Phone,
  MessageCircle
} from 'lucide-react';

const CATEGORIES = [
  'All Products',
  'Household Items',
  'Kitchen Items',
  'Bags & Luggage',
  'Kiddies',
  'Sneakers & Footwear',
  'Health & Beauty',
  "Women's Fashion",
  "Men's Fashion",
  'Gadgets & Accessories',
];

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export function Navbar({ activeCategory = 'All Products', onSelectCategory }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const { items, openCart } = useCart();
  const cartItemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    const savedUser = localStorage.getItem('marvel_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
      {/* Top Banner */}
      <div className="bg-[#0B1B3D] text-slate-300 text-[11px] py-1.5 px-4 hidden sm:block border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span>Your One-Stop Destination • Nationwide Delivery</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Link href="/track" className="hover:text-white transition">Track Order</Link>
            <span>|</span>
            <a 
              href="https://wa.me/2347062297299?text=Hello%20Marvel%20Varieties" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#25D366] transition flex items-center gap-1"
            >
              <MessageCircle size={12} className="text-[#25D366]" />
              <span>WhatsApp Support: +234 706 229 7299</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative h-10 w-32 sm:h-12 sm:w-40">
              <Image 
                src="/MARVEL VARIETIES.png" 
                alt="Marvel Varieties" 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
          </Link>

          {/* Search Box */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              placeholder="Search products, household, kitchen..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0B1B3D] transition"
            />
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/track" 
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B1B3D] transition p-2 rounded-xl hover:bg-slate-50"
            >
              <Truck size={17} />
              <span>Track</span>
            </Link>

            <Link 
              href="/account" 
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0B1B3D] transition border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              <User size={16} />
              <span className="hidden sm:inline">
                {user ? user.fullName?.split(' ')[0] : 'Sign In'}
              </span>
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative bg-[#0B1B3D] text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:bg-[#142752] transition cursor-pointer"
            >
              <ShoppingBag size={18} className="text-[#D4AF37]" />
              <span className="hidden sm:inline text-xs font-black">Bag</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0B1B3D] text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-[#0B1B3D] rounded-xl hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-slate-100 hidden md:block bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs font-bold">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory && onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1B3D] text-[#D4AF37] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-xl">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Categories</p>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-xs p-2 rounded-xl font-bold ${
                    activeCategory === cat ? 'bg-[#0B1B3D] text-[#D4AF37]' : 'text-slate-600 bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-bold">
            <Link 
              href="/track" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-700"
            >
              <div className="flex items-center gap-2">
                <Truck size={16} />
                <span>Track Order</span>
              </div>
              <ChevronRight size={14} />
            </Link>

            <a 
              href="https://wa.me/2347062297299?text=Hello%20Marvel%20Varieties"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-[#25D366]" />
                <span>WhatsApp Customer Support</span>
              </div>
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}