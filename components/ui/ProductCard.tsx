// components/ui/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/store/useCart';
import { Eye, ShoppingBag, MessageCircle, Star, Palette } from 'lucide-react';
import { ProductQuickViewModal } from '@/components/ui/ProductQuickViewModal';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    category: string;
    price: number;
    description?: string;
    colors?: string[];
    imageUrl: string;
    images?: string[];
    inStock?: boolean;
    stockQuantity?: number;
    isFeatured?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [selectedForView, setSelectedForView] = useState<any | null>(null);

  const stock = product.stockQuantity ?? 10;
  const isAvailable = stock > 0 && product.inStock !== false;

  const whatsappUrl = `https://wa.me/2347062297299?text=${encodeURIComponent(
    `Hello Marvel Varieties, I want to order "${product.title}" (₦${product.price?.toLocaleString()}). Is it available?`
  )}`;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
        {/* Product Image Box */}
        <div 
          className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer" 
          onClick={() => setSelectedForView(product)}
        >
          <img
            src={product.imageUrl || (product.images && product.images[0]) || '/MARVEL_VARIETIES-removebg-preview.png'}
            alt={product.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Category Tag */}
          <span className="absolute top-1.5 left-1.5 bg-[#0B1B3D]/85 backdrop-blur-md text-[#D4AF37] text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            {product.category}
          </span>

          {/* Featured Badge */}
          {product.isFeatured && (
            <span className="absolute top-1.5 right-1.5 bg-[#D4AF37] text-[#0B1B3D] text-[8px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
              <Star size={9} className="fill-[#0B1B3D]" />
            </span>
          )}

          {/* Out of Stock Banner */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-2">
              <span className="bg-red-600 text-white text-[9px] sm:text-xs font-black uppercase tracking-wider px-2 py-1 rounded shadow-md rotate-[-6deg]">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Floating Action Icons */}
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedForView(product);
              }}
              className="h-7 w-7 rounded-full bg-white/95 text-[#0B1B3D] shadow flex items-center justify-center hover:scale-110 transition"
              title="Quick View"
            >
              <Eye size={13} />
            </button>
            {isAvailable && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="h-7 w-7 rounded-full bg-[#25D366] text-white shadow flex items-center justify-center hover:scale-110 transition"
                title="Inquire on WhatsApp"
              >
                <MessageCircle size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Info & Add-to-Bag */}
        <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 gap-1.5">
          <div>
            <h3 
              onClick={() => setSelectedForView(product)}
              className="font-bold text-[11px] sm:text-xs text-slate-800 line-clamp-2 hover:text-[#0B1B3D] cursor-pointer leading-snug"
            >
              {product.title}
            </h3>

            {/* Multi-Color Pill Badge on Mobile Cards */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-[#0B1B3D] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                  <Palette size={10} className="text-[#D4AF37]" />
                  {product.colors.length} {product.colors.length === 1 ? 'Color' : 'Colors'} Available
                </span>
              </div>
            )}
            
            <div className="flex items-baseline justify-between mt-1.5">
              <p className="font-black text-xs sm:text-sm text-[#0B1B3D]">
                ₦{product.price ? product.price.toLocaleString() : '0'}
              </p>
              <span className={`text-[8px] sm:text-[9px] font-bold ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                {isAvailable ? `${stock} left` : 'Sold Out'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (product.colors && product.colors.length > 0) {
                // If colors exist, open modal to let user choose their shade
                setSelectedForView(product);
              } else if (isAvailable) {
                const itemImg = product.imageUrl || (product.images && product.images[0]) || '/MARVEL_VARIETIES-removebg-preview.png';
                addItem({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: itemImg,
                  imageUrl: itemImg,
                } as any);
                openCart();
              }
            }}
            disabled={!isAvailable}
            className={`w-full py-1.5 sm:py-2 rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 transition cursor-pointer shadow-sm ${
              !isAvailable
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37]'
            }`}
          >
            <ShoppingBag size={12} className={isAvailable ? 'text-[#D4AF37]' : 'text-slate-400'} />
            <span>
              {!isAvailable ? 'Out of Stock' : product.colors && product.colors.length > 0 ? 'Select Color' : 'Add to Bag'}
            </span>
          </button>
        </div>
      </div>

      {selectedForView && (
        <ProductQuickViewModal
          product={selectedForView}
          onClose={() => setSelectedForView(null)}
        />
      )}
    </>
  );
}