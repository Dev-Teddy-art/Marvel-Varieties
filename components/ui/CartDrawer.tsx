// components/ui/CartDrawer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const router = useRouter();
  const cart = useCart() as any;
  const items = cart.items || [];
  const isOpen = cart.isOpen || false;
  const closeCart = cart.closeCart || (() => {});
  const removeItem = cart.removeItem || (() => {});
  const updateQuantity = cart.updateQuantity || (() => {});

  const totalItems = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
  const totalPrice = items.reduce((acc: number, item: any) => acc + ((item.price || 0) * (item.quantity || 1)), 0);

  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('marvel_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, [isOpen]);

  const handleCheckoutClick = () => {
    closeCart();
    // Rule: Guest users must register or login before paying
    if (!currentUser) {
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-[#0B1B3D] text-[#D4AF37] flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#0B1B3D]">Shopping Bag</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200/50 transition cursor-pointer"
                title="Close bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-16 w-16 rounded-3xl bg-slate-100 text-slate-300 flex items-center justify-center">
                    <ShoppingBag size={32} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-700">Your bag is empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Explore our catalog and click &quot;Add to Bag&quot; to begin your purchase.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-2 bg-[#0B1B3D] text-[#D4AF37] font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item: any, idx: number) => {
                  const displayImg = item.image || item.imageUrl || '/MARVEL_VARIETIES-removebg-preview.png';
                  return (
                    <div
                      key={`${item.id}-${item.selectedColor || ''}-${idx}`}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex gap-3 items-center group"
                    >
                      <div className="relative h-16 w-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                        <img
                          src={displayImg}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-bold text-xs text-[#0B1B3D] truncate">{item.title}</h4>
                        {item.selectedColor && (
                          <span className="inline-block bg-[#0B1B3D] text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-md">
                            Shade: {item.selectedColor}
                          </span>
                        )}
                        <p className="font-black text-xs text-slate-900">
                          ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="p-1 text-slate-500 hover:text-black cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold px-2 text-slate-800 font-mono">
                              {item.quantity || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="p-1 text-slate-500 hover:text-black cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-red-500 p-1 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Checkout Actions */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3 shadow-lg">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-700">₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Fee</span>
                    <span className="text-[11px] text-emerald-600 font-bold">Calculated at Checkout</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#0B1B3D] pt-2 border-t border-slate-100">
                    <span>Estimated Total</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {!currentUser && (
                  <div className="bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl flex items-center gap-2 text-[11px] text-amber-800">
                    <Lock size={14} className="shrink-0 text-amber-600" />
                    <span>Registration required before completing purchase.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37] font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>{currentUser ? 'Proceed to Checkout' : 'Register / Sign In to Checkout'}</span>
                  <ArrowRight size={15} />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                  <ShieldCheck size={12} className="text-[#D4AF37]" />
                  <span>Direct Bank Verification • Fast Delivery</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}