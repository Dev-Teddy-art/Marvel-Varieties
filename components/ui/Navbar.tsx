// components/ui/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Package, 
  Menu, 
  X, 
  Home, 
  Grid, 
  Phone,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  'Watches',
];

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export function Navbar({ activeCategory = 'All Products', onSelectCategory }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { getItemCount, openCart } = useCart();
  const count = getItemCount();
  
  const [user, setUser] = useState<any | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem('marvel_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleCategoryClick = (category: string) => {
    setMobileMenuOpen(false);
    if (pathname !== '/') {
      // If clicked from /account, /track, etc. navigate directly to the category on the homepage
      router.push(`/?category=${encodeURIComponent(category)}#catalog`);
    } else {
      onSelectCategory?.(category);
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        {/* Top Utility Bar */}
        <div className="bg-[#0B1B3D] text-slate-300 text-[11px] py-1.5 px-4 hidden sm:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p className="flex items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              Your One-Stop Destination • Nationwide Delivery
            </p>
            <div className="flex items-center gap-4">
              <Link href="/track" className="hover:text-white transition flex items-center gap-1">
                <Package size={12} /> Track Order
              </Link>
              <span>|</span>
              <span>Support: +234 814 687 5777</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Left: Mobile Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Open Navigation"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="relative h-9 sm:h-10 w-32 sm:w-44 shrink-0">
              <Image
                src="/MARVEL VARIETIES.png"
                alt="Marvel Varieties"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search products, household, kitchen..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0B1B3D]"
            />
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={15} />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#0B1B3D] px-3 py-2 rounded-xl transition"
            >
              <Package size={16} />
              <span>Track</span>
            </Link>

            <Link
              href="/account"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                user?.role === 'admin'
                  ? 'bg-[#0B1B3D] text-[#D4AF37] border-[#0B1B3D]'
                  : user
                  ? 'bg-slate-50 border-slate-200 text-[#0B1B3D]'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User size={16} className={user?.role === 'admin' ? 'text-[#D4AF37]' : 'text-slate-600'} />
              <span className="hidden sm:inline-block">
                {user ? (user.role === 'admin' ? 'Admin Portal' : user.fullName.split(' ')[0]) : 'Sign In'}
              </span>
            </Link>

            <button
              onClick={openCart}
              className="relative bg-[#0B1B3D] hover:bg-[#142752] text-white p-2.5 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center"
              title="Cart"
            >
              <ShoppingBag size={18} className="text-[#D4AF37]" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0B1B3D] text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Category Scroller */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === category && pathname === '/'
                    ? 'bg-[#0B1B3D] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE HAMBURGER SIDE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-5 overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="relative h-8 w-32">
                    <Image src="/MARVEL VARIETIES.png" alt="Marvel" fill className="object-contain" />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"
                  >
                    <X size={20} />
                  </button>
                </div>

                {user ? (
                  <div className="bg-[#0B1B3D] text-white p-4 rounded-2xl space-y-2">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-bold">Logged In As</span>
                    <p className="text-sm font-bold truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-300 truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs bg-[#D4AF37] text-[#0B1B3D] font-black px-3 py-1 rounded-lg mt-1"
                      >
                        <span>Open Admin Panel</span>
                        <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center text-xs font-bold text-[#0B1B3D]"
                  >
                    Sign In or Create Account →
                  </Link>
                )}

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">Categories</p>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          activeCategory === cat && pathname === '/'
                            ? 'bg-[#0B1B3D] text-white'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat}</span>
                        {activeCategory === cat && pathname === '/' && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-[11px] text-slate-500">
                <p className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#0B1B3D]" /> +234 814 687 5777
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#0B1B3D]" /> Verified Sterling Bank
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          <Link href="/" className={`flex flex-col items-center gap-0.5 ${pathname === '/' ? 'text-[#0B1B3D]' : 'text-slate-600'}`}>
            <Home size={18} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#0B1B3D] cursor-pointer"
          >
            <Grid size={18} />
            <span className="text-[10px] font-medium">Categories</span>
          </button>

          <Link href="/track" className={`flex flex-col items-center gap-0.5 ${pathname === '/track' ? 'text-[#0B1B3D]' : 'text-slate-600'}`}>
            <Package size={18} />
            <span className="text-[10px] font-medium">Track</span>
          </Link>

          <Link href="/account" className={`flex flex-col items-center gap-0.5 ${pathname === '/account' ? 'text-[#0B1B3D]' : 'text-slate-600'}`}>
            <User size={18} className={user?.role === 'admin' ? 'text-[#D4AF37]' : ''} />
            <span className="text-[10px] font-medium">{user ? 'Account' : 'Sign In'}</span>
          </Link>

          <button
            onClick={openCart}
            className="relative flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#0B1B3D] cursor-pointer"
          >
            <ShoppingBag size={18} />
            <span className="text-[10px] font-medium">Bag</span>
            {count > 0 && (
              <span className="absolute -top-1 right-1 bg-[#D4AF37] text-[#0B1B3D] text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}