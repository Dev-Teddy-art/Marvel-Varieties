// components/ui/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/useCart';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  User, 
  Package, 
  LogOut, 
  PhoneCall, 
  HelpCircle,
  Truck
} from 'lucide-react';

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export function Navbar({ activeCategory, onSelectCategory }: NavbarProps) {
  const { items, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = items?.length || 0;
  const [user, setUser] = useState<any | null>(null);

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

  const handleLogout = () => {
    localStorage.removeItem('marvel_user');
    setUser(null);
    window.location.reload();
  };

  const navCategories = [
    'All Products',
    'Household Items',
    'Kitchen Items',
    'Bags & Luggage',
    'Sneakers & Footwear',
    'Health & Beauty',
    "Women's Fashion",
    "Men's Fashion",
    'Gadgets & Accessories',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-[#0B1B3D] text-[#D4AF37] px-4 py-1.5 text-[10px] sm:text-xs font-bold flex justify-between items-center tracking-wider">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="animate-pulse" />
          <span>Your One-Stop Destination • Nationwide Delivery</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/track" className="hover:underline flex items-center gap-1">
            <Truck size={12} />
            <span>Track Order</span>
          </Link>
          <a 
            href="https://wa.me/2347062297299" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline hidden sm:inline"
          >
            WhatsApp Support: +234 706 229 7299
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo with sizes prop added */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative h-10 w-32 sm:h-12 sm:w-40">
            <Image 
              src="/MARVEL_VARIETIES-removebg-preview.png" 
              alt="Marvel Varieties" 
              fill 
              sizes="(max-width: 640px) 128px, 160px"
              className="object-contain" 
              priority 
            />
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/track"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0B1B3D] bg-slate-100 px-3.5 py-2 rounded-xl transition"
          >
            <Truck size={14} className="text-[#D4AF37]" />
            <span>Track</span>
          </Link>

          {user ? (
            <div className="relative group">
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0B1B3D] bg-slate-100 px-3.5 py-2 rounded-xl transition"
              >
                <User size={14} className="text-[#0B1B3D]" />
                <span className="max-w-[80px] truncate">{user.fullName?.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0B1B3D] bg-slate-100 px-3.5 py-2 rounded-xl transition"
            >
              <User size={14} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Cart Bag Trigger */}
          <button
            onClick={openCart}
            className="relative bg-[#0B1B3D] text-[#D4AF37] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[#142752] transition shadow cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Bag</span>
            {totalItems > 0 && (
              <span className="bg-[#D4AF37] text-[#0B1B3D] text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center -ml-0.5">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 lg:hidden rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 overflow-x-auto no-scrollbar py-2.5 gap-2">
        {navCategories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory && onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#0B1B3D] text-[#D4AF37] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700"
            >
              <Truck size={14} className="text-[#0B1B3D]" />
              <span>Track Orders</span>
            </Link>

            {user ? (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700"
              >
                <Package size={14} className="text-[#0B1B3D]" />
                <span>My Orders</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700"
              >
                <User size={14} className="text-[#0B1B3D]" />
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-1">Categories</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {navCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#0B1B3D] text-[#D4AF37]'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}