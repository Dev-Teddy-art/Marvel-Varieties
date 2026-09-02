// app/admin/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/ui/Footer';
import { 
  addProductAction, 
  updateProductAction, 
  getProductsAction, 
  deleteProductAction, 
  getOrdersAction, 
  updateOrderStatusAction, 
  deleteOrderAction,
  getStoreSettingsAction,
  updateStoreSettingsAction
} from '@/lib/actions';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PackageCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  Eye, 
  X, 
  Lock, 
  KeyRound, 
  LogOut, 
  Search, 
  TrendingUp, 
  Clock, 
  ArrowLeft, 
  UploadCloud, 
  ChevronRight, 
  Boxes,
  Palette,
  Camera,
  Settings,
  Building2,
  Phone,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Household Items',
  'Kitchen Items',
  'Bags & Luggage',
  'Kiddies',
  'Sneakers & Footwear',
  'Health & Beauty',
  "Women's Fashion",
  "Men's Fashion",
  'Gadgets & Accessories',
  'Watches',
];

interface ColorVariantItem {
  name: string;
  image?: string;
}

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [currentView, setCurrentView] = useState<'overview' | 'orders' | 'products' | 'settings'>('products');
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null);
  const [productPreviews, setProductPreviews] = useState<string[]>([]);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Store Settings State
  const [settingsForm, setSettingsForm] = useState({
    bankName: 'OPay',
    accountNumber: '7062297299',
    accountName: 'OYELEYE MARVELLOUS',
    contactAddress: '3 Olanipekun Street, Opposite Akiode Health Centre, Ojodu Berger, Lagos State',
    contactPhone: '+234 706 229 7299',
    whatsappNumber: '07062297299',
    operatingHours: 'Mon – Sat: 8:00 AM – 6:00 PM',
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState({
    title: '',
    category: CATEGORIES[0],
    price: '',
    stockQuantity: '10',
    description: '',
    colors: [] as ColorVariantItem[],
    inStock: true,
    isFeatured: false,
  });

  const [colorNameInput, setColorNameInput] = useState('');
  const [colorImagePreview, setColorImagePreview] = useState<string>('');

  useEffect(() => {
    const savedUser = localStorage.getItem('marvel_user');
    const sessionAuth = sessionStorage.getItem('marvel_admin_session');

    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === 'admin' || u.role === 'editor') {
          setCurrentUser(u);
          fetchDashboardData();
          return;
        }
      } catch (e) {}
    }

    if (sessionAuth === 'super_admin') {
      setCurrentUser({ role: 'admin', fullName: 'Super Administrator' });
      fetchDashboardData();
    } else if (sessionAuth === 'staff_admin') {
      setCurrentUser({ role: 'editor', fullName: 'Staff Product Manager' });
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [ordersData, productsData, storeSettingsData] = await Promise.all([
      getOrdersAction(),
      getProductsAction(),
      getStoreSettingsAction(),
    ]);
    setOrdersList(ordersData || []);
    setProductsList(productsData || []);
    if (storeSettingsData) {
      setSettingsForm({
        bankName: storeSettingsData.bankName || 'OPay',
        accountNumber: storeSettingsData.accountNumber || '7062297299',
        accountName: storeSettingsData.accountName || 'OYELEYE MARVELLOUS',
        contactAddress: storeSettingsData.contactAddress || '3 Olanipekun Street, Opposite Akiode Health Centre, Ojodu Berger, Lagos State',
        contactPhone: storeSettingsData.contactPhone || '+234 706 229 7299',
        whatsappNumber: storeSettingsData.whatsappNumber || '07062297299',
        operatingHours: storeSettingsData.operatingHours || 'Mon – Sat: 8:00 AM – 6:00 PM',
      });
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();

    if (cleanPin === '24687' || cleanPin === '9983' || cleanPin === '1234') {
      sessionStorage.setItem('marvel_admin_session', 'super_admin');
      setCurrentUser({ role: 'admin', fullName: 'Super Administrator' });
      setPinError(false);
      fetchDashboardData();
    } else if (cleanPin === '5544') {
      sessionStorage.setItem('marvel_admin_session', 'staff_admin');
      setCurrentUser({ role: 'editor', fullName: 'Staff Product Manager' });
      setPinError(false);
      fetchDashboardData();
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('marvel_admin_session');
    localStorage.removeItem('marvel_user');
    setCurrentUser(null);
    setPinInput('');
  };

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const res = await updateStoreSettingsAction(settingsForm);
    if (res.success) {
      setSettingsSavedSuccess(true);
      setTimeout(() => setSettingsSavedSuccess(false), 3000);
    } else {
      alert('Error updating store settings.');
    }
    setIsSavingSettings(false);
  };

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      category: CATEGORIES[0],
      price: '',
      stockQuantity: '10',
      description: '',
      colors: [],
      inStock: true,
      isFeatured: false,
    });
    setColorNameInput('');
    setColorImagePreview('');
    setProductPreviews([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: any) => {
    setEditingProductId(p.id);
    const rawColors = Array.isArray(p.colors) ? p.colors : [];
    const normalizedColors: ColorVariantItem[] = rawColors.map((c: any) => 
      typeof c === 'string' ? { name: c, image: p.imageUrl } : c
    );

    setProductForm({
      title: p.title,
      category: p.category,
      price: p.price.toString(),
      stockQuantity: (p.stockQuantity ?? 10).toString(),
      description: p.description || '',
      colors: normalizedColors,
      inStock: p.inStock,
      isFeatured: p.isFeatured || false,
    });
    setColorNameInput('');
    setColorImagePreview('');
    setProductPreviews(p.images && p.images.length > 0 ? p.images : [p.imageUrl]);
    setIsModalOpen(true);
  };

  const handleColorImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setColorImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddColorVariant = (e: React.MouseEvent) => {
    e.preventDefault();
    const cleanName = colorNameInput.trim();
    if (!cleanName) {
      alert('Please enter a color name (e.g. Burgundy, 1B Natural Black)');
      return;
    }

    const fallbackImg = colorImagePreview || productPreviews[0] || '/MARVEL_VARIETIES-removebg-preview.png';

    setProductForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: cleanName, image: fallbackImg }],
    }));

    setColorNameInput('');
    setColorImagePreview('');
  };

  const handleRemoveColor = (indexToRemove: number) => {
    setProductForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleMultipleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price || productPreviews.length === 0) {
      alert('Please upload main product photos, title, and price.');
      return;
    }

    setIsSubmittingProduct(true);
    const count = parseInt(productForm.stockQuantity, 10);
    const payload = {
      title: productForm.title,
      category: productForm.category,
      price: parseInt(productForm.price, 10),
      stockQuantity: isNaN(count) ? 0 : count,
      description: productForm.description,
      colors: productForm.colors,
      images: productPreviews,
      inStock: (isNaN(count) ? 0 : count) > 0,
      isFeatured: productForm.isFeatured,
    };

    try {
      if (editingProductId) {
        await updateProductAction(editingProductId, payload as any);
      } else {
        await addProductAction(payload as any);
      }

      setIsModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Save product error:', err);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to remove this product?')) {
      await deleteProductAction(id);
      await fetchDashboardData();
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatusAction(orderId, newStatus);
    await fetchDashboardData();
  };

  const handleDeleteOrder = async (orderId: string, reference: string) => {
    if (confirm(`Permanently delete order ${reference}?`)) {
      await deleteOrderAction(orderId);
      await fetchDashboardData();
    }
  };

  const metrics = useMemo(() => {
    const totalRevenue = ordersList.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const pendingSlips = ordersList.filter((o) => o.status === 'pending_verification').length;
    const confirmedOrders = ordersList.filter((o) => o.status === 'confirmed' || o.status === 'dispatched').length;

    return { totalRevenue, pendingSlips, confirmedOrders };
  }, [ordersList]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchesSearch =
        o.orderReference?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.customerPhone?.toLowerCase().includes(orderSearchQuery.toLowerCase());

      const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ordersList, orderSearchQuery, orderStatusFilter]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => productCategoryFilter === 'ALL' || p.category === productCategoryFilter);
  }, [productsList, productCategoryFilter]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#070F22] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 sm:p-10 rounded-3xl max-w-sm w-full space-y-6 text-center shadow-2xl border border-slate-100"
        >
          <div className="h-16 w-16 bg-[#0B1B3D] text-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock size={28} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#0B1B3D] px-3.5 py-1 rounded-full inline-block">
              Marvel Varieties
            </span>
            <h1 className="text-2xl font-black text-[#0B1B3D] pt-2">Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Enter password or staff access PIN</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                maxLength={10}
                placeholder="Enter PIN / Password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-center tracking-widest font-mono text-base font-black focus:outline-none focus:border-[#0B1B3D]"
              />
              <KeyRound className="absolute left-4 top-4 text-slate-400" size={18} />
            </div>

            {pinError && <p className="text-xs font-bold text-red-500">Invalid PIN or Password.</p>}

            <button
              type="submit"
              className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg transition cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-800 transition">
            <ArrowLeft size={14} /> Back to Storefront
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0B1B3D] font-bold transition">
              <ArrowLeft size={16} /> View Store
            </Link>
            <span className="text-slate-300">|</span>
            <div className="relative h-8 w-32">
              <Image 
                src="/MARVEL_VARIETIES-removebg-preview.png" 
                alt="Marvel Varieties" 
                fill 
                sizes="128px"
                className="object-contain" 
                priority 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-[#0B1B3D]">
              👑 Super Admin
            </span>
            <button
              onClick={handleOpenAddModal}
              className="bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D] text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus size={16} /> Add Product
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition rounded-xl hover:bg-slate-100 cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Responsive flex layout that prevents overlapping */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col md:flex-row gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 shrink-0 md:sticky md:top-20 z-10">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Navigation</div>

          <button
            onClick={() => setCurrentView('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              currentView === 'overview' ? 'bg-[#0B1B3D] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} className={currentView === 'overview' ? 'text-[#D4AF37]' : 'text-slate-400'} />
              <span>Financial Overview</span>
            </div>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => setCurrentView('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              currentView === 'orders' ? 'bg-[#0B1B3D] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <PackageCheck size={18} className={currentView === 'orders' ? 'text-[#D4AF37]' : 'text-slate-400'} />
              <span>Orders & Slips</span>
            </div>
            {metrics.pendingSlips > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {metrics.pendingSlips}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('products')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              currentView === 'products' ? 'bg-[#0B1B3D] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} className={currentView === 'products' ? 'text-[#D4AF37]' : 'text-slate-400'} />
              <span>Product Inventory</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">{productsList.length}</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              currentView === 'settings' ? 'bg-[#0B1B3D] text-[#D4AF37] shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} className={currentView === 'settings' ? 'text-[#D4AF37]' : 'text-slate-400'} />
              <span>Store & Bank Info</span>
            </div>
            <span className="bg-[#D4AF37]/20 text-[#0B1B3D] text-[9px] font-black px-2 py-0.5 rounded-md">Edit</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full min-w-0 space-y-6">
          {/* VIEW: SETTINGS */}
          {currentView === 'settings' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-[#0B1B3D]">Edit Bank Account & Store Details</h3>
                  <p className="text-xs text-slate-400">Everything changed here updates the footer & checkout bank details live</p>
                </div>
                {settingsSavedSuccess && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <Check size={14} /> Saved & Published Live!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveStoreSettings} className="space-y-6 text-xs">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1B3D] flex items-center gap-2">
                    <Building2 size={16} className="text-[#D4AF37]" /> Payment Verification Box (Footer & Checkout)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Official Bank Name</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.bankName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                        placeholder="e.g. OPay, Moniepoint, Zenith"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Account Number</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.accountNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accountNumber: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 font-mono font-bold focus:outline-none focus:border-[#0B1B3D]"
                        placeholder="e.g. 7062297299"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Account Name</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.accountName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accountName: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                        placeholder="e.g. OYELEYE MARVELLOUS"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1B3D] flex items-center gap-2">
                    <Phone size={16} className="text-[#D4AF37]" /> Contact & Dispatch Hub Details
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Physical Dispatch Hub Address</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.contactAddress}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                        placeholder="e.g. 3 Olanipekun Street, Opposite Akiode Health Centre..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Customer Care Phone</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.contactPhone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                          placeholder="e.g. +234 706 229 7299"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">WhatsApp Order Number</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                          placeholder="e.g. 07062297299"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.operatingHours}
                          onChange={(e) => setSettingsForm({ ...settingsForm, operatingHours: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                          placeholder="e.g. Mon – Sat: 8:00 AM – 6:00 PM"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentView('products')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-2xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37] font-black px-6 py-3 rounded-2xl transition shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {isSavingSettings ? 'Saving to Database...' : 'Save & Publish Live'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: OVERVIEW */}
          {currentView === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Total Revenue</span>
                    <TrendingUp size={16} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1B3D]">₦{metrics.totalRevenue.toLocaleString()}</h3>
                  <p className="text-[11px] text-slate-400">All recorded customer orders</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Pending Proofs</span>
                    <Clock size={16} className="text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-black text-amber-600">{metrics.pendingSlips}</h3>
                  <p className="text-[11px] text-slate-400">Awaiting bank verification</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Total Products</span>
                    <Boxes size={16} className="text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1B3D]">{productsList.length}</h3>
                  <p className="text-[11px] text-slate-400">Items currently listed</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ORDERS */}
          {currentView === 'orders' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#0B1B3D]">Customer Orders & Slips</h3>
                  <p className="text-xs text-slate-400">Inspect transfer receipts and update delivery progress</p>
                </div>

                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-2xl text-[11px] font-bold">
                  {['ALL', 'pending_verification', 'confirmed', 'dispatched', 'delivered'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setOrderStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        orderStatusFilter === s ? 'bg-[#0B1B3D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : s === 'pending_verification' ? 'Pending' : s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, or Phone..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-[#0B1B3D]"
                />
                <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Reference</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Delivery Address</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Payment Slip</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">No orders found.</td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/60 transition">
                          <td className="p-3.5 font-mono font-bold text-[#0B1B3D]">{order.orderReference}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{order.customerName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</p>
                          </td>
                          <td className="p-3.5 text-slate-600 font-medium">
                            <p className="font-bold text-[#0B1B3D]">{order.deliveryState}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{order.deliveryAddress || 'Pickup'}</p>
                          </td>
                          <td className="p-3.5 font-black text-slate-900">₦{order.totalAmount?.toLocaleString()}</td>
                          <td className="p-3.5">
                            {order.receiptUrl ? (
                              <button
                                onClick={() => setPreviewReceipt(order.receiptUrl)}
                                className="inline-flex items-center gap-1 text-[#0B1B3D] bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer text-[11px]"
                              >
                                <Eye size={13} /> View Slip
                              </button>
                            ) : (
                              <span className="text-slate-400 italic">No proof</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'pending_verification'
                                  ? 'bg-amber-100 text-amber-800'
                                  : order.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'dispatched'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:outline-none focus:border-[#0B1B3D]"
                              >
                                <option value="pending_verification">Pending Slip</option>
                                <option value="confirmed">Approve / Confirmed</option>
                                <option value="processing">Packing / Quality</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="delivered">Delivered</option>
                              </select>

                              <button
                                onClick={() => handleDeleteOrder(order.id, order.orderReference)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: PRODUCTS */}
          {currentView === 'products' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#0B1B3D]">Store Inventory & Stock Count</h3>
                  <p className="text-xs text-slate-400">Manage photos, color shades, descriptions, and stock counts</p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="ALL">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <button
                    onClick={handleOpenAddModal}
                    className="bg-[#0B1B3D] hover:bg-[#142752] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((p) => {
                  const colorCount = Array.isArray(p.colors) ? p.colors.length : 0;
                  return (
                    <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 flex flex-col justify-between gap-3 group">
                      <div className="space-y-3">
                        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-white border border-slate-200">
                          <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                          <span className="absolute top-2 left-2 bg-[#0B1B3D]/80 backdrop-blur-md text-[#D4AF37] text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                            {p.category}
                          </span>
                          <span className={`absolute bottom-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            (p.stockQuantity ?? 0) > 5 ? 'bg-emerald-600/90' : (p.stockQuantity ?? 0) > 0 ? 'bg-amber-600/90' : 'bg-red-600/90'
                          }`}>
                            {p.stockQuantity ?? 0} In Stock
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{p.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{p.description || 'No description added.'}</p>
                          
                          {colorCount > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {p.colors.map((c: any, idx: number) => {
                                const cName = typeof c === 'string' ? c : c.name;
                                return (
                                  <span key={idx} className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                                    {cName}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          <p className="text-sm font-black text-[#0B1B3D] mt-1.5">₦{p.price?.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                        <span className={`text-[10px] font-bold ${(p.stockQuantity ?? 0) > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {(p.stockQuantity ?? 0) > 0 ? '● Active' : '○ Out of Stock'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-slate-500 hover:text-[#0B1B3D] hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-lg text-[#0B1B3D] flex items-center gap-2">
                  {editingProductId ? <Edit3 size={20} className="text-[#D4AF37]" /> : <Plus size={20} className="text-[#D4AF37]" />}
                  {editingProductId ? 'Edit Product & Color Variants' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">General Product Photos *</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer relative bg-slate-50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleImagesSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <UploadCloud size={22} className="mx-auto text-[#0B1B3D]" />
                    <p className="text-xs font-bold text-slate-700 mt-1">Upload Product Photos</p>
                  </div>

                  {productPreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {productPreviews.map((src, index) => (
                        <div key={index} className="relative h-16 rounded-xl overflow-hidden border border-slate-200">
                          <img src={src} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Loose Wave French Curls Hair Extensions"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                  />
                </div>

                {/* COLOR VARIANT & PHOTO UPLOADER */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Palette size={15} className="text-[#0B1B3D]" />
                      <span>Hair Color Variants & Photos</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">Optional</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Color name (e.g. Burgundy, Honey Blonde 27, 1B)..."
                        value={colorNameInput}
                        onChange={(e) => setColorNameInput(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0B1B3D]"
                      />

                      <label className="h-10 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer text-slate-700 text-xs font-bold transition shrink-0">
                        <Camera size={14} className="text-[#0B1B3D]" />
                        <span>{colorImagePreview ? 'Photo Picked' : 'Add Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleColorImageSelect}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {colorImagePreview && (
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <img src={colorImagePreview} alt="Color preview" className="h-10 w-10 object-cover rounded-md border" />
                        <span className="text-[11px] font-bold text-emerald-700 flex-1 truncate">Photo attached for this shade</span>
                        <button
                          type="button"
                          onClick={() => setColorImagePreview('')}
                          className="text-xs text-red-500 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddColorVariant}
                      className="w-full bg-[#0B1B3D] text-[#D4AF37] py-2 rounded-xl text-xs font-bold hover:bg-[#142752] transition cursor-pointer"
                    >
                      + Save Color Variant
                    </button>
                  </div>

                  {productForm.colors.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-bold text-slate-500">Configured Shades ({productForm.colors.length}):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {productForm.colors.map((col, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 p-2 rounded-xl flex items-center justify-between gap-2 shadow-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={col.image || productPreviews[0] || '/MARVEL_VARIETIES-removebg-preview.png'}
                                alt={col.name}
                                className="h-8 w-8 object-cover rounded-lg border border-slate-200 shrink-0"
                              />
                              <span className="font-bold text-slate-800 text-[11px] truncate">{col.name}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveColor(idx)}
                              className="text-red-400 hover:text-red-600 font-black p-1 text-sm cursor-pointer"
                              title="Delete color"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Detailed Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe hair length, grade, texture, heat tolerance, sizing..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price (₦) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stock Left (Units) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="10"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featCheck"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#0B1B3D] cursor-pointer"
                  />
                  <label htmlFor="featCheck" className="text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer">
                    <Star size={13} className="text-[#D4AF37] fill-[#D4AF37]" /> Feature on Homepage Spotlight
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="w-2/3 bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer"
                  >
                    {isSubmittingProduct ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECEIPT PREVIEW MODAL */}
      <AnimatePresence>
        {previewReceipt && (
          <div
            onClick={() => setPreviewReceipt(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-4 max-w-lg w-full relative shadow-2xl space-y-3"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-[#0B1B3D]">Bank Transfer Slip Proof</span>
                <button onClick={() => setPreviewReceipt(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto rounded-2xl bg-slate-50 flex items-center justify-center p-2">
                <img src={previewReceipt} alt="Bank Slip" className="w-full h-auto object-contain rounded-2xl" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}