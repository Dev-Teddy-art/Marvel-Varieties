// app/wishlist/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Heart, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar activeCategory="All Products" onSelectCategory={() => {}} />

        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4 max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto">
              <Heart size={32} />
            </div>
            <h1 className="text-xl font-bold text-[#0B1B3D]">Your Wishlist is Empty</h1>
            <p className="text-xs text-slate-400">
              Explore products in the catalog and click the heart icon to save them for later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#0B1B3D] text-white font-bold text-xs px-6 py-3.5 rounded-full hover:bg-[#142752] transition shadow-md"
            >
              <ArrowLeft size={16} /> Explore Catalog
            </Link>
          </div>
        </main>
      </div>

      <footer className="bg-[#0B1B3D] text-slate-400 py-6 text-center text-xs border-t border-slate-800">
        <p>© {new Date().getFullYear()} Marvel Varieties. All Rights Reserved.</p>
      </footer>
    </div>
  );
}