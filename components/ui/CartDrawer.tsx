'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/useCart';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCart();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer Container */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#0B1B3D] text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#D4AF37]" />
                <span className="font-bold text-base">Your Cart</span>
                <span className="text-xs bg-[#142752] text-slate-300 px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-[#142752] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBag size={32} />
                  </div>
                  <h4 className="font-bold text-slate-700">Your cart is empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Explore the catalog to find quality items for your home and lifestyle.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-2 text-xs font-bold text-[#0B1B3D] bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 relative group"
                  >
                    <div className="relative h-20 w-20 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs font-black text-[#0B1B3D] mt-0.5">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove item */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout Button */}
            {items.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-white space-y-3 shadow-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-black text-lg text-[#0B1B3D]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  *Delivery fee calculated at checkout. Direct transfer receipt verification.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} className="text-[#D4AF37]" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}