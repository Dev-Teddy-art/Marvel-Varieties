// components/storefront/HeroFeaturedSlider.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/store/useCart';
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react';

interface HeroFeaturedSliderProps {
  featuredProducts?: any[];
  allProducts?: any[];
  onQuickView?: (product: any) => void;
}

export function HeroFeaturedSlider({ 
  featuredProducts = [], 
  allProducts = [], 
  onQuickView 
}: HeroFeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cart = useCart() as any;
  const addItem = cart.addItem || (() => {});
  const openCart = cart.openCart || (() => {});

  const displayItems = featuredProducts.length > 0 
    ? featuredProducts 
    : allProducts.slice(0, 5);

  useEffect(() => {
    if (!displayItems || displayItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  if (!displayItems || displayItems.length === 0) {
    return (
      <div className="h-64 sm:h-80 w-full rounded-3xl bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center text-center space-y-3 backdrop-blur-md shadow-2xl">
        <div className="relative h-16 w-32">
          <Image
            src="/MARVEL_VARIETIES-removebg-preview.png"
            alt="Marvel Varieties"
            fill
            sizes="(max-width: 640px) 128px, 144px"
            className="object-contain brightness-0 invert"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-white/10 px-3 py-1 rounded-full inline-block">
            ✨ Verified Hub
          </span>
          <p className="text-xs font-bold text-white">Direct Lagos Dispatch</p>
        </div>
      </div>
    );
  }

  const activeIndex = currentIndex >= displayItems.length ? 0 : currentIndex;
  const current = displayItems[activeIndex];

  const isAvailable = (current.stockQuantity ?? 10) > 0 && current.inStock !== false;
  const currentImg = current.imageUrl || (current.images && current.images[0]) || '/MARVEL_VARIETIES-removebg-preview.png';

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addItem({
      id: current.id,
      title: current.title,
      price: current.price,
      image: currentImg,
      imageUrl: currentImg,
    });
    openCart();
  };

  return (
    <div className="relative h-72 sm:h-84 w-full rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl flex flex-col justify-between overflow-hidden group">
      <div className="flex items-center justify-between z-20">
        <span className="bg-[#0B1B3D]/90 border border-white/10 text-[#D4AF37] text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
          <Star size={10} className="fill-[#D4AF37]" /> {current.isFeatured ? 'Spotlight Item' : 'Top Selection'}
        </span>
        <span className="text-[10px] font-mono font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded-full">
          {activeIndex + 1} / {displayItems.length}
        </span>
      </div>

      <div 
        className="relative flex-1 w-full flex items-center justify-center my-2 cursor-pointer"
        onClick={() => onQuickView && onQuickView(current)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative h-36 sm:h-44 w-full rounded-2xl overflow-hidden shadow-inner bg-black/20 flex items-center justify-center"
          >
            <img
              src={currentImg}
              alt={current.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-2 left-2 bg-[#0B1B3D]/80 backdrop-blur-md text-[#D4AF37] text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-md">
              {current.category}
            </span>
          </motion.div>
        </AnimatePresence>

        {displayItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-1 z-30 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-sm cursor-pointer shadow"
              aria-label="Previous product"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-1 z-30 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-sm cursor-pointer shadow"
              aria-label="Next product"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 z-20">
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onQuickView && onQuickView(current)}
        >
          <h4 className="text-white font-bold text-xs truncate">{current.title}</h4>
          <p className="text-[#D4AF37] font-black text-xs sm:text-sm">₦{current.price?.toLocaleString()}</p>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`px-3 py-2 rounded-xl text-[10px] sm:text-xs font-black flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow ${
            isAvailable
              ? 'bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D]'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShoppingBag size={13} />
          <span>{isAvailable ? 'Bag' : 'Sold Out'}</span>
        </button>
      </div>

      {displayItems.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1.5 z-20">
          {displayItems.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}