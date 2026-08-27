//ProductQuickViewModal
'use client';

import React, { useState } from 'react';
import { ProductCarousel } from '@/components/ui/ProductCarousel';
import { useCart } from '@/lib/store/useCart';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Star, 
  ShieldCheck, 
  Truck, 
  Boxes, 
  MessageCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductQuickViewModalProps {
  product: any | null;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const stockCount = product.stockQuantity ?? 10;
  const isLowStock = stockCount <= 5 && stockCount > 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: images[0],
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    openCart();
  };

  const whatsappInquiryUrl = `https://wa.me/2347062297299?text=${encodeURIComponent(
    `Hello Marvel Varieties, I am interested in inquiring about: ${product.title} (₦${product.price?.toLocaleString()})`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col justify-between"
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md border border-slate-100 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* Left Column: Image Carousel / Zoom Display */}
          <div className="md:col-span-6 bg-slate-50 relative p-4 sm:p-6 flex flex-col justify-center">
            <ProductCarousel images={images} alt={product.title} aspectClass="h-72 sm:h-96" />
            <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className="bg-[#0B1B3D] text-[#D4AF37] px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              {product.isFeatured && (
                <span className="bg-[#D4AF37] text-[#0B1B3D] px-2.5 py-1 rounded-full flex items-center gap-1 font-black">
                  <Star size={11} className="fill-[#0B1B3D]" /> Featured
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Overview & Specifications */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3D] leading-snug">
                  {product.title}
                </h2>
                <p className="text-2xl font-black text-[#0B1B3D] mt-2">
                  ₦{product.price?.toLocaleString()}
                </p>
              </div>

              {/* Stock Quantity Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    product.inStock && stockCount > 0
                      ? isLowStock
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  <Boxes size={14} />
                  {product.inStock && stockCount > 0
                    ? isLowStock
                      ? `Hurry! Only ${stockCount} left in stock`
                      : `${stockCount} units available in hub`
                    : 'Currently Out of Stock'}
                </span>
              </div>

              {/* Product Detailed Description */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Product Overview & Details
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line max-h-44 overflow-y-auto">
                  {product.description ||
                    'Premium quality guaranteed. Inspected and verified by Marvel Varieties for immediate dispatch across Nigeria.'}
                </p>
              </div>

              {/* Value Signals */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
                <div className="bg-slate-50 p-2.5 rounded-xl flex items-center gap-2">
                  <Truck size={15} className="text-[#0B1B3D] shrink-0" />
                  <span>Doorstep Delivery</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#D4AF37] shrink-0" />
                  <span>Quality Inspected</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || stockCount === 0}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : product.inStock && stockCount > 0
                    ? 'bg-[#0B1B3D] hover:bg-[#142752] text-white'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} className="text-[#D4AF37]" /> Add to Shopping Bag
                  </>
                )}
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={15} className="text-[#25D366]" /> Ask Question on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}