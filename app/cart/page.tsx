// app/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/useCart';
import { Navbar } from '@/components/ui/Navbar';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  ArrowLeft 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FullCartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const total = getTotal();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar activeCategory="All Products" onSelectCategory={() => {}} />

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">Shopping Bag</h1>
              <p className="text-xs text-slate-500">Review your chosen items before heading to checkout</p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 font-semibold transition cursor-pointer"
              >
                Clear Cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4 max-w-md mx-auto my-12">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-lg font-bold text-[#0B1B3D]">Your Cart is Empty</h2>
              <p className="text-xs text-slate-400">
                You haven&apos;t added any products yet. Browse our catalog to get started.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#0B1B3D] text-white font-bold text-xs px-6 py-3.5 rounded-full hover:bg-[#142752] transition shadow-md"
              >
                <ArrowLeft size={16} /> Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Cart Items List */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#D4AF37]">{item.category}</span>
                          <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                          <p className="text-sm font-black text-[#0B1B3D] mt-0.5">₦{item.price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        {/* Counter */}
                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-slate-500 hover:text-slate-900 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-slate-500 hover:text-slate-900 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-slate-900 min-w-20 text-right">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 sticky top-24">
                <h3 className="font-bold text-base text-[#0B1B3D] border-b border-slate-100 pb-3">
                  Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Subtotal</span>
                    <span className="font-bold text-slate-900">₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery</span>
                    <span className="text-slate-400">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-[#0B1B3D]">
                    <span>Subtotal</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} className="text-[#D4AF37]" />
                </Link>

                <div className="space-y-2 pt-2 text-[11px] text-slate-500">
                  <p className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>Direct bank transfer receipt verification</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck size={14} className="text-[#0B1B3D] shrink-0" />
                    <span>Nationwide delivery dispatch within 24h</span>
                  </p>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      <footer className="bg-[#0B1B3D] text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-12">
        <p>© {new Date().getFullYear()} Marvel Varieties. All Rights Reserved.</p>
      </footer>
    </div>
  );
}