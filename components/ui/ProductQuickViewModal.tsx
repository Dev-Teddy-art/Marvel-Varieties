// components/ui/ProductQuickViewModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/store/useCart';
import { ProductCarousel } from '@/components/ui/ProductCarousel';
import { X, ShoppingBag, MessageCircle, Check, Palette } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: any;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addItem, openCart } = useCart();

  // Normalize colors whether string[] or { name: string, image?: string }[]
  const rawColors: any[] = Array.isArray(product?.colors) ? product.colors : [];
  const normalizedColors = rawColors.map((c) => 
    typeof c === 'string' ? { name: c, image: product?.imageUrl } : c
  );

  const [selectedColor, setSelectedColor] = useState<string>(
    normalizedColors.length > 0 ? normalizedColors[0].name : ''
  );
  const [activeVariantImage, setActiveVariantImage] = useState<string>(
    normalizedColors.length > 0 && normalizedColors[0].image ? normalizedColors[0].image : ''
  );
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isAvailable = (product.stockQuantity ?? 10) > 0 && product.inStock !== false;
  const generalImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const currentDisplayImage = activeVariantImage || generalImages[0] || '/MARVEL_VARIETIES-removebg-preview.png';

  const handleColorSelect = (col: { name: string; image?: string }) => {
    setSelectedColor(col.name);
    if (col.image) {
      setActiveVariantImage(col.image);
    }
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    
    addItem({
      id: `${product.id}${selectedColor ? `-${selectedColor.replace(/\s+/g, '-').toLowerCase()}` : ''}`,
      title: selectedColor ? `${product.title} (${selectedColor})` : product.title,
      price: product.price,
      image: currentDisplayImage,
      imageUrl: currentDisplayImage,
    } as any);

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      openCart();
    }, 400);
  };

  const whatsappInquiryUrl = `https://wa.me/2347062297299?text=${encodeURIComponent(
    `Hello Marvel Varieties, I would like to order "${product.title}"${
      selectedColor ? ` in color ${selectedColor}` : ''
    } (₦${product.price?.toLocaleString()}). Is it available?`
  )}`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col justify-between"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#0B1B3D] px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 rounded-lg transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Main Swappable Product Photo */}
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative h-60 sm:h-72 bg-slate-50 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentDisplayImage}
                src={currentDisplayImage}
                alt={product.title}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.4 }}
                transition={{ duration: 0.25 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>

            {selectedColor && (
              <span className="absolute bottom-3 left-3 bg-[#0B1B3D]/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold px-2.5 py-1 rounded-lg">
                Shade: {selectedColor}
              </span>
            )}
          </div>

          {/* Title & Price */}
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {product.title}
            </h2>
            <p className="text-xl font-black text-[#0B1B3D]">
              ₦{product.price?.toLocaleString()}
            </p>
          </div>

          {/* Color Variant Visual Selector with Thumbnails */}
          {normalizedColors.length > 0 && (
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Palette size={13} className="text-[#0B1B3D]" /> Choose Color Shade:
                </span>
                <span className="font-black text-[#0B1B3D]">{selectedColor}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {normalizedColors.map((col, idx) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleColorSelect(col)}
                      className={`p-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                        isSelected
                          ? 'bg-[#0B1B3D] text-[#D4AF37] border-[#0B1B3D] ring-2 ring-[#D4AF37] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={col.image || generalImages[0] || '/MARVEL_VARIETIES-removebg-preview.png'}
                        alt={col.name}
                        className="h-7 w-7 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <span className="truncate text-[11px]">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="space-y-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Product Details</p>
              <p>{product.description}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex gap-2 sticky bottom-0">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-emerald-50 text-[#25D366] border border-emerald-200 rounded-xl hover:bg-emerald-100 transition flex items-center justify-center shrink-0 cursor-pointer"
            title="Inquire on WhatsApp"
          >
            <MessageCircle size={18} />
          </a>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              !isAvailable
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37]'
            }`}
          >
            {added ? (
              <>
                <Check size={16} /> Added {selectedColor ? `(${selectedColor})` : ''}
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> {isAvailable ? (selectedColor ? `Add ${selectedColor} to Bag` : 'Add to Bag') : 'Out of Stock'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}