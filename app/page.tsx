// app/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { HeroFeaturedSlider } from '@/components/storefront/HeroFeaturedSlider';
import { ProductCarousel } from '@/components/ui/ProductCarousel';
import { ProductQuickViewModal } from '@/components/ui/ProductQuickViewModal';
import { Footer } from '@/components/ui/Footer';
import { useCart } from '@/lib/store/useCart';
import { useProductStore } from '@/lib/store/useProductStore';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Check, 
  Building2, 
  ChevronRight, 
  Loader2, 
  PlusCircle,
  Star,
  Clock,
  Zap,
  Eye,
  MessageCircle
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

function HomePageContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') || 'All Products';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [user, setUser] = useState<any | null>(null);
  const [enlargedProduct, setEnlargedProduct] = useState<any | null>(null);

  // Read catalog directly from the instant Zustand cache
  const { products: productsList, fetchProducts, isLoaded } = useProductStore();

  const { addItem, openCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const queryCategory = searchParams.get('category');
    if (queryCategory) {
      setSelectedCategory(queryCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    const savedUser = localStorage.getItem('marvel_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }

    // Loads instantly from cache if previously visited; updates in background
    fetchProducts();
  }, [fetchProducts]);

  // Loading spinner only displays on the very first cold load before cache initializes
  const loading = !isLoaded && productsList.length === 0;

  const filteredProducts = selectedCategory === 'All Products'
    ? productsList
    : productsList.filter((p) => p.category === selectedCategory);

  const featuredProducts = productsList.filter((p) => p.isFeatured);

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ((product.stockQuantity ?? 10) <= 0 && product.inStock === false) return;

    const itemImage = product.imageUrl || (product.images && product.images[0]) || '/MARVEL_VARIETIES-removebg-preview.png';

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: itemImage,
      imageUrl: itemImage,
    } as any);

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
    openCart();
  };

  const handleCategorySelection = (category: string) => {
    setSelectedCategory(category);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between pb-16 lg:pb-0">
      <div>
        <Navbar 
          activeCategory={selectedCategory} 
          onSelectCategory={handleCategorySelection} 
        />

        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10 sm:space-y-16">
          
          {/* Hero Banner with Featured Slider */}
          <section className="relative rounded-3xl bg-gradient-to-r from-[#0B1B3D] via-[#10234d] to-slate-950 text-white overflow-hidden shadow-2xl p-6 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full">
                  <Sparkles size={14} className="text-[#D4AF37]" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
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
                    className="bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D] font-black text-xs px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2"
                  >
                    <span>Shop All Catalog</span>
                    <ChevronRight size={16} />
                  </a>
                  <Link
                    href="/track"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl border border-white/20 transition"
                  >
                    Track Existing Order
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 w-full flex items-center justify-center">
                <HeroFeaturedSlider 
                  featuredProducts={featuredProducts}
                  allProducts={productsList}
                  onQuickView={(prod) => setEnlargedProduct(prod)} 
                />
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
                <p className="text-[11px] text-slate-400">Official OPay account settlement</p>
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

          {/* Featured Spotlight Section */}
          {featuredProducts.length > 0 && (
            <section className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-end border-b border-slate-200/80 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Star size={13} className="fill-[#D4AF37]" /> Handpicked Selection
                  </span>
                  <h2 className="text-lg sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
                    Featured Best-Sellers
                  </h2>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">
                  {featuredProducts.length} Spotlight {featuredProducts.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* 2-Column Grid on Mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {featuredProducts.map((product) => {
                  const isAvailable = (product.stockQuantity ?? 10) > 0 && product.inStock !== false;
                  const whatsappInquiryUrl = `https://wa.me/2347062297299?text=${encodeURIComponent(
                    `Hello Marvel Varieties, I want to order "${product.title}" (₦${product.price?.toLocaleString()}). Is it available?`
                  )}`;

                  return (
                    <div
                      key={product.id}
                      onClick={() => setEnlargedProduct(product)}
                      className="bg-white rounded-2xl sm:rounded-3xl border-2 border-[#D4AF37]/30 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group relative cursor-pointer"
                    >
                      <div className="relative">
                        <ProductCarousel
                          images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]}
                          alt={product.title}
                          aspectClass="h-44 sm:h-64"
                        />
                        <span className="absolute top-2 left-2 bg-[#0B1B3D]/90 backdrop-blur-md text-[#D4AF37] text-[8px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full z-10 pointer-events-none">
                          {product.category}
                        </span>
                        <span className="absolute top-2 right-2 bg-[#D4AF37] text-[#0B1B3D] text-[8px] sm:text-[10px] uppercase font-black px-2 py-0.5 rounded-full z-10 pointer-events-none flex items-center gap-0.5 shadow">
                          <Star size={10} className="fill-[#0B1B3D]" /> Featured
                        </span>

                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-2 z-10">
                            <span className="bg-red-600 text-white text-[9px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md rotate-[-6deg]">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-5 space-y-2 sm:space-y-4 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 min-h-[32px] sm:min-h-[40px] leading-tight">
                            {product.title}
                          </h3>
                          <p className="text-sm sm:text-lg font-black text-[#0B1B3D] mt-1">
                            ₦{product.price?.toLocaleString()}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            {isAvailable ? (
                              <p className="text-[9px] sm:text-[10px] font-bold text-emerald-600">
                                {product.stockQuantity ? `● ${product.stockQuantity} in stock` : '● In Stock'}
                              </p>
                            ) : (
                              <p className="text-[9px] sm:text-[10px] font-bold text-red-500">
                                ○ Sold Out
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1.5 sm:gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEnlargedProduct(product);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 sm:p-3 rounded-xl transition cursor-pointer shrink-0"
                            title="Quick View Details"
                          >
                            <Eye size={14} />
                          </button>

                          {isAvailable && (
                            <a
                              href={whatsappInquiryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] p-2 sm:p-3 rounded-xl transition flex items-center justify-center shrink-0 border border-[#25D366]/30"
                              title="Ask on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}

                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={(e) => handleAddToCart(product, e)}
                            className={`flex-1 py-2 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
                              !isAvailable
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : addedId === product.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#0B1B3D] hover:bg-[#142752] text-white shadow-md'
                            }`}
                          >
                            {addedId === product.id ? (
                              <>
                                <Check size={12} /> <span className="hidden sm:inline">Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={12} className={isAvailable ? "text-[#D4AF37]" : "text-slate-400"} /> 
                                <span>{isAvailable ? 'Add' : 'Sold Out'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Main Catalog Grid */}
          <section id="catalog" className="space-y-4 sm:space-y-6 pt-2">
            <div className="flex justify-between items-end border-b border-slate-200/80 pb-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-[#0B1B3D] tracking-tight">
                  {selectedCategory}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <Loader2 size={32} className="animate-spin text-[#0B1B3D]" />
                <p className="text-xs text-slate-400 font-semibold">Loading catalog from Neon DB...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-8 sm:p-14 rounded-3xl border border-slate-100 text-center space-y-3 max-w-md mx-auto shadow-sm">
                <div className="h-12 sm:h-14 w-12 sm:w-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="text-base font-black text-[#0B1B3D]">No Products Available Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We are currently restocking this collection. Explore our other categories or check back shortly.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    onClick={() => handleCategorySelection('All Products')}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    View All Products
                  </button>

                  {(user?.role === 'admin' || user?.role === 'editor') && (
                    <Link
                      href="/admin"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0B1B3D] hover:bg-[#142752] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
                    >
                      <PlusCircle size={14} className="text-[#D4AF37]" />
                      <span>Add Products in Admin</span>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {filteredProducts.map((product) => {
                  const isAvailable = (product.stockQuantity ?? 10) > 0 && product.inStock !== false;
                  const whatsappInquiryUrl = `https://wa.me/2347062297299?text=${encodeURIComponent(
                    `Hello Marvel Varieties, I want to order "${product.title}" (₦${product.price?.toLocaleString()}). Is it available?`
                  )}`;

                  return (
                    <div
                      key={product.id}
                      onClick={() => setEnlargedProduct(product)}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group cursor-pointer relative"
                    >
                      <div className="relative">
                        <ProductCarousel
                          images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]}
                          alt={product.title}
                          aspectClass="h-40 sm:h-60"
                        />
                        <span className="absolute top-2 left-2 bg-[#0B1B3D]/80 backdrop-blur-md text-[#D4AF37] text-[8px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full z-10 pointer-events-none">
                          {product.category}
                        </span>

                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-2 z-10">
                            <span className="bg-red-600 text-white text-[9px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded shadow rotate-[-6deg]">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 min-h-[30px] sm:min-h-[40px] leading-tight">
                            {product.title}
                          </h3>
                          <p className="text-sm sm:text-base font-black text-[#0B1B3D] mt-1">
                            ₦{product.price?.toLocaleString()}
                          </p>
                          <div className="mt-0.5">
                            {isAvailable ? (
                              <p className="text-[8px] sm:text-[10px] font-semibold text-slate-400">
                                {product.stockQuantity ?? 10} in stock
                              </p>
                            ) : (
                              <p className="text-[8px] sm:text-[10px] font-bold text-red-500">
                                Unavailable
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1.5 sm:gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEnlargedProduct(product);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 sm:p-3 rounded-xl transition cursor-pointer shrink-0"
                            title="Enlarge & Inspect"
                          >
                            <Eye size={13} />
                          </button>

                          {isAvailable && (
                            <a
                              href={whatsappInquiryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] p-2 sm:p-3 rounded-xl transition flex items-center justify-center shrink-0 border border-[#25D366]/30"
                              title="WhatsApp Inquiry"
                            >
                              <MessageCircle size={13} />
                            </a>
                          )}

                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={(e) => handleAddToCart(product, e)}
                            className={`flex-1 py-2 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
                              !isAvailable
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : addedId === product.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#0B1B3D] hover:bg-[#142752] text-white shadow-md'
                            }`}
                          >
                            {addedId === product.id ? (
                              <>
                                <Check size={12} /> <span className="hidden sm:inline">Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={12} className={isAvailable ? "text-[#D4AF37]" : "text-slate-400"} /> 
                                <span>{isAvailable ? 'Add' : 'Sold Out'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Credibility Guarantee Section */}
          <section className="rounded-3xl bg-gradient-to-br from-[#0B1B3D] via-[#10234d] to-slate-950 p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl space-y-3 relative z-10">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#D4AF37] bg-white/10 px-3 py-1 rounded-full inline-block">
                The Marvel Guarantee
              </span>
              <h2 className="text-xl sm:text-4xl font-black tracking-tight leading-tight">
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
                  Official OPay direct transfer payment verification with instant manual review for 100% peace of mind.
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

      <AnimatePresence>
        {enlargedProduct && (
          <ProductQuickViewModal
            product={enlargedProduct}
            onClose={() => setEnlargedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#0B1B3D]" />
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}