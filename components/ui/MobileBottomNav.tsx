// components/ui/MobileBottomNav.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { 
  Home, 
  LayoutGrid, 
  Truck, 
  ShoppingBag, 
  User 
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const cart = useCart() as any;
  const items = cart.items || [];
  const openCart = cart.openCart || (() => {});
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const totalCount = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);

  useEffect(() => {
    const saved = localStorage.getItem('marvel_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-2xl"
    >
      <Link
        href="/"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
          pathname === '/' ? 'text-[#0B1B3D]' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Home size={18} />
        <span>Home</span>
      </Link>

      <a
        href="/#catalog"
        className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-400 hover:text-slate-700 transition"
      >
        <LayoutGrid size={18} />
        <span>Browse</span>
      </a>

      {/* Floating Center Bag Button */}
      <button
        type="button"
        onClick={() => openCart()}
        className="relative -top-4 bg-[#0B1B3D] text-[#D4AF37] h-12 w-12 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white cursor-pointer active:scale-95 transition"
        title="Open Bag"
      >
        <ShoppingBag size={20} />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0B1B3D] font-black text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center shadow">
            {totalCount}
          </span>
        )}
      </button>

      <Link
        href="/track"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
          pathname === '/track' ? 'text-[#0B1B3D]' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Truck size={18} />
        <span>Track</span>
      </Link>

      <Link
        href={currentUser ? '/account' : '/login'}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
          pathname === '/account' || pathname === '/login' ? 'text-[#0B1B3D]' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <User size={18} />
        <span>{currentUser ? 'Account' : 'Sign In'}</span>
      </Link>
    </nav>
  );
}