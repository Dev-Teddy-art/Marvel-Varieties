// app/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const cart = useCart() as any;
  const items = cart.items || [];
  const removeItem = cart.removeItem || (() => {});
  const updateQuantity = cart.updateQuantity || (() => {});
  const clearCart = cart.clearCart || (() => {});

  // Compute total price safely without relying on getTotal()
  const totalPrice = items.reduce(
    (acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const totalCount = items.reduce(
    (acc: number, item: any) => acc + (item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    const savedUser = localStorage.getItem('marvel_user');
    if (!savedUser) {
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="h-16 w-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-xl font-black text-[#0B1B3D]">Your Bag is Empty</h1>
        <p className="text-xs text-slate-400 max-w-xs mt-1 mb-6">
          Looks like you haven't added any items to your bag yet.
        </p>
        <Link
          href="/"
          className="bg-[#0B1B3D] text-[#D4AF37] font-bold text-xs px-6 py-3 rounded-xl shadow transition"
        >
          Explore Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-slate-400 hover:text-slate-700 transition mr-2">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-xl font-black text-[#0B1B3D]">Your Shopping Bag</h1>
            <span className="text-xs text-slate-400 font-bold">({totalCount} items)</span>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Items List */}
          <div className="md:col-span-8 space-y-3">
            {items.map((item: any, idx: number) => {
              const displayImg = item.image || item.imageUrl || '/MARVEL_VARIETIES-removebg-preview.png';
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex gap-4 items-center shadow-xs"
                >
                  <div className="relative h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    <img
                      src={displayImg}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-xs sm:text-sm text-[#0B1B3D] truncate">{item.title}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 transition p-1"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {item.category && (
                      <span className="inline-block text-[9px] font-bold text-slate-400 uppercase">
                        {item.category}
                      </span>
                    )}

                    {item.selectedColor && (
                      <p className="text-[10px] text-amber-700 font-bold">
                        Shade: {item.selectedColor}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <p className="font-black text-xs sm:text-sm text-slate-900">
                        ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>

                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          className="p-1 text-slate-400 hover:text-black"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold px-2 font-mono">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1 text-slate-400 hover:text-black"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Box */}
          <div className="md:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs sticky top-20">
            <h2 className="font-black text-sm text-[#0B1B3D] border-b border-slate-100 pb-2">
              Bag Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-slate-700">₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Logistics</span>
                <span className="text-emerald-600 font-bold">Calculated at Checkout</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#0B1B3D] border-t border-slate-100 pt-2">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37] font-black text-xs py-3.5 rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck size={13} className="text-[#D4AF37]" />
              <span>Direct Bank Settlement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}