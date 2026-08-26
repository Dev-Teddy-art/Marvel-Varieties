// components/storefront/StorefrontClient.tsx
'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { ProductCanvas } from '@/components/canvas/ProductCanvas';
import { ProductCarousel } from '@/components/ui/ProductCarousel';
import { Footer } from '@/components/ui/Footer';
import { useCart } from '@/lib/store/useCart';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Check, 
  Building2, 
  ChevronRight, 
  Star, 
  Clock, 
  Zap,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

interface StorefrontProps {
  initialProducts: any[];
}

export function StorefrontClient({ initialProducts }: StorefrontProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const { addItem, openCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = selectedCategory === 'All Products'
    ? initialProducts
    : initialProducts.filter((p) => p.category === selectedCategory);

  const featuredProducts = initialProducts.filter((p) => p.isFeatured);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.imageUrl || (product.images && product.images[0]),
      category: product.category,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
    openCart();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between pb-16 lg:pb-0">
      <div>
        <Navbar activeCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16">
          
          {/* Hero Banner */}
          <section className="relative rounded-3xl bg-gradient-to-r from-[#0B1B3D] via-[#10234d] to-slate-950 text-white overflow-hidden shadow-2xl p-6 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full">
                  <Sparkles size={14} className="text-[#D4AF37]" />
                  <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    Official Online Storefront
                  </span>
                </div>

                <h1 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight">
                  Premium Essentials <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-400">
                    Direct To Your Doorstep
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                  Shop quality household appliances, designer footwear, bags, fashion items, and smart gadgets with direct bank transfer payment verification.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#catalog"
                    className="bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D] font-black text-xs px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2"
                  >
                    <span>Shop All Catalog</span>
                    <ChevronRight size={16} />
                  </a>
                  <Link
                    href="/track"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-2xl border border-white/20 transition"
                  >
                    Track Existing Order
                  </Link>
                </div>
              </div>

              {/* 3D Visualizer Canvas */}
              <div className="lg:col-span-5 h-56 sm:h-80 w-full relative">
                <ProductCanvas />
              </div>
            </div>
          </section>

          {/* Value Props */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0B1B3D] flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0B1B3D]">Nationwide Dispatch</h4>
                <p className="text-[11px] text-slate-400">Quick delivery across all 36 states</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0B1B3D]">Verified Direct Transfers</h4>
                <p className="text-[11px] text-slate-400">Official Sterling Bank verification</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0B1B3D]">Quality Guaranteed</h4>
                <p className="text-[11px] text-slate-400">Every item is manually inspected</p>
              </div>
            </div>
          </section>

          {/* FEATURED SPOTLIGHT */}
          {featuredProducts.length > 0 && (
            <section className="space-y-6">
              <div className="flex justify-between items-end border-b border-slate-200/80 pb-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Star size={14} className="fill-[#D4AF37]" /> Handpicked Selection
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
                    Featured Best-Sellers
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  {featuredProducts.length} Spotlight {featuredProducts.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border-2 border-[#D4AF37]/30 overflow-hidden shadow-md hover:shadow-2xl transition flex flex-col justify-between group relative"
                  >
                    <div className="relative">
                      <ProductCarousel
                        images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]}
                        alt={product.title}
                        aspectClass="h-64"
                      />
                      <span className="absolute top-3 left-3 bg-[#0B1B3D]/90 backdrop-blur-md text-[#D4AF37] text-[10px] uppercase font-bold px-2.5 py-1 rounded-full z-10 pointer-events-none">
                        {product.category}
                      </span>
                      <span className="absolute top-3 right-3 bg-[#D4AF37] text-[#0B1B3D] text-[10px] uppercase font-black px-2.5 py-1 rounded-full z-10 pointer-events-none flex items-center gap-1 shadow">
                        <Star size={11} className="fill-[#0B1B3D]" /> Featured
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 min-h-[40px]">
                          {product.title}
                        </h3>
                        <p className="text-lg font-black text-[#0B1B3D] mt-1">
                          ₦{product.price?.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          addedId === product.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0B1B3D] hover:bg-[#142752] text-white shadow-md'
                        }`}
                      >
                        {addedId === product.id ? (
                          <>
                            <Check size={14} /> Added to Bag
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} className="text-[#D4AF37]" /> Add to Bag
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MAIN CATALOG */}
          <section id="catalog" className="space-y-6 pt-4">
            <div className="flex justify-between items-end border-b border-slate-200/80 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3D] tracking-tight">
                  {selectedCategory}
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3 max-w-md mx-auto">
                <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Products in this Category</h3>
                <p className="text-xs text-slate-500">
                  Select another category or add items in the Admin panel.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
                  >
                    <div className="relative">
                      <ProductCarousel
                        images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]}
                        alt={product.title}
                        aspectClass="h-60"
                      />
                      <span className="absolute top-3 left-3 bg-[#0B1B3D]/80 backdrop-blur-md text-[#D4AF37] text-[10px] uppercase font-bold px-2.5 py-1 rounded-full z-10 pointer-events-none">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 min-h-[40px]">
                          {product.title}
                        </h3>
                        <p className="text-base font-black text-[#0B1B3D] mt-1">
                          ₦{product.price?.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          addedId === product.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0B1B3D] hover:bg-[#142752] text-white shadow-md'
                        }`}
                      >
                        {addedId === product.id ? (
                          <>
                            <Check size={14} /> Added to Bag
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} className="text-[#D4AF37]" /> Add to Bag
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CREDIBILITY GUARANTEE SECTION */}
          <section className="rounded-3xl bg-gradient-to-br from-[#0B1B3D] via-[#10234d] to-slate-950 p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl space-y-3 relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] bg-white/10 px-3 py-1 rounded-full inline-block">
                The Marvel Guarantee
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Built on Trust, Punctual Delivery & Uncompromising Efficiency.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                At Marvel Varieties, we bridge the gap between quality merchandise and dependable nationwide fulfilment. Every single order is inspected, verified, and dispatched with speed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative z-10 pt-2">
              <div className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-2xl space-y-2.5 backdrop-blur-sm">
                <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center">
                  <Clock size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Punctual Timelines</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fast order processing with real-time tracking so your package reaches your doorstep on schedule.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-2xl space-y-2.5 backdrop-blur-sm">
                <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Trustworthy & Verified</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Official corporate Sterling Bank payment verification with instant manual review for 100% peace of mind.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-2xl space-y-2.5 backdrop-blur-sm">
                <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center">
                  <Zap size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Maximum Efficiency</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Seamless order placement with direct WhatsApp support for all your product inquiries and requests.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}