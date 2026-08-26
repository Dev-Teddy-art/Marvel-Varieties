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
  deleteOrderAction
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
  Truck, 
  ArrowLeft,
  UploadCloud,
  ChevronRight,
  Layers
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

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [currentView, setCurrentView] = useState<'overview' | 'orders' | 'products'>('overview');
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');

  // Modal State (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null);
  const [productPreviews, setProductPreviews] = useState<string[]>([]);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  const [productForm, setProductForm] = useState({
    title: '',
    category: CATEGORIES[0],
    price: '',
    description: '',
    inStock: true,
    isFeatured: false,
  });

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('marvel_admin_session');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [ordersData, productsData] = await Promise.all([
      getOrdersAction(),
      getProductsAction(),
    ]);
    setOrdersList(ordersData || []);
    setProductsList(productsData || []);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '9983' || pinInput === '1234') {
      sessionStorage.setItem('marvel_admin_session', 'true');
      setIsAuthenticated(true);
      setPinError(false);
      fetchDashboardData();
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('marvel_admin_session');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      category: CATEGORIES[0],
      price: '',
      description: '',
      inStock: true,
      isFeatured: false,
    });
    setProductPreviews([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: any) => {
    setEditingProductId(p.id);
    setProductForm({
      title: p.title,
      category: p.category,
      price: p.price.toString(),
      description: p.description || '',
      inStock: p.inStock,
      isFeatured: p.isFeatured || false,
    });
    setProductPreviews(p.images && p.images.length > 0 ? p.images : [p.imageUrl]);
    setIsModalOpen(true);
  };

  const handleMultipleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveUploadedImage = (indexToRemove: number) => {
    setProductPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price || productPreviews.length === 0) {
      alert('Please select at least 1 photo and fill in title & price.');
      return;
    }

    setIsSubmittingProduct(true);

    if (editingProductId) {
      const res = await updateProductAction(editingProductId, {
        title: productForm.title,
        category: productForm.category,
        price: parseInt(productForm.price, 10),
        description: productForm.description,
        images: productPreviews,
        inStock: productForm.inStock,
        isFeatured: productForm.isFeatured,
      });

      if (res.success) {
        setIsModalOpen(false);
        await fetchDashboardData();
      } else {
        alert('Failed to update product.');
      }
    } else {
      const res = await addProductAction({
        title: productForm.title,
        category: productForm.category,
        price: parseInt(productForm.price, 10),
        description: productForm.description,
        images: productPreviews,
        inStock: productForm.inStock,
        isFeatured: productForm.isFeatured,
      });

      if (res.success) {
        setIsModalOpen(false);
        await fetchDashboardData();
      } else {
        alert('Failed to save product.');
      }
    }
    setIsSubmittingProduct(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to remove this product from the live catalog?')) {
      await deleteProductAction(id);
      await fetchDashboardData();
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatusAction(orderId, newStatus);
    await fetchDashboardData();
  };

  const handleDeleteOrder = async (orderId: string, reference: string) => {
    if (confirm(`Are you sure you want to permanently delete order ${reference}?`)) {
      const res = await deleteOrderAction(orderId);
      if (res.success) {
        await fetchDashboardData();
      } else {
        alert('Failed to delete order.');
      }
    }
  };

  const metrics = useMemo(() => {
    const totalRevenue = ordersList.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const pendingSlips = ordersList.filter((o) => o.status === 'pending_verification').length;
    const confirmedOrders = ordersList.filter((o) => o.status === 'confirmed' || o.status === 'dispatched').length;
    const featuredCount = productsList.filter((p) => p.isFeatured).length;

    return { totalRevenue, pendingSlips, confirmedOrders, featuredCount };
  }, [ordersList, productsList]);

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
    return productsList.filter((p) => {
      return productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
    });
  }, [productsList, productCategoryFilter]);

  if (!isAuthenticated) {
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
              Marvel Control Center
            </span>
            <h1 className="text-2xl font-black text-[#0B1B3D] pt-2">Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Enter your PIN to manage the catalog & orders</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                maxLength={8}
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-center tracking-widest font-mono text-lg font-black focus:outline-none focus:border-[#0B1B3D]"
              />
              <KeyRound className="absolute left-4 top-4 text-slate-400" size={18} />
            </div>

            {pinError && <p className="text-xs font-bold text-red-500">Invalid Security PIN. Try again.</p>}

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
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0B1B3D] font-bold transition">
              <ArrowLeft size={16} /> View Store
            </Link>
            <span className="text-slate-300">|</span>
            <div className="relative h-8 w-32">
              <Image src="/MARVEL VARIETIES.png" alt="Marvel Varieties" fill className="object-contain" priority />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D] text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus size={16} /> Add Product
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition rounded-xl hover:bg-slate-100 cursor-pointer"
              title="Lock & Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 sticky top-20">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Control Hub</div>

          <button
            onClick={() => setCurrentView('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              currentView === 'overview' ? 'bg-[#0B1B3D] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} className={currentView === 'overview' ? 'text-[#D4AF37]' : 'text-slate-400'} />
              <span>Overview & KPIs</span>
            </div>
            <ChevronRight size={14} className={currentView === 'overview' ? 'text-[#D4AF37]' : 'text-slate-300'} />
          </button>

          <button
            onClick={() => setCurrentView('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
              currentView === 'orders' ? 'bg-[#0B1B3D] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <PackageCheck size={18} className={currentView === 'orders' ? 'text-[#D4AF37]' : 'text-slate-400'} />
              <span>Orders & Transfers</span>
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
        </aside>

        {/* Right Dynamic Pane */}
        <main className="lg:col-span-9 space-y-6">
          {/* VIEW 1: OVERVIEW */}
          {currentView === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Total Revenue</span>
                    <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1B3D]">₦{metrics.totalRevenue.toLocaleString()}</h3>
                  <p className="text-[11px] text-slate-400">All recorded orders</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Pending Proofs</span>
                    <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-amber-600">{metrics.pendingSlips}</h3>
                  <p className="text-[11px] text-slate-400">Awaiting verification</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Featured Items</span>
                    <div className="h-8 w-8 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center">
                      <Star size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1B3D]">{metrics.featuredCount}</h3>
                  <p className="text-[11px] text-slate-400">Promoted on homepage</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>Total Products</span>
                    <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Layers size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1B3D]">{productsList.length}</h3>
                  <p className="text-[11px] text-slate-400">Catalog size</p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-[#0B1B3D]">Recent Orders</h3>
                    <p className="text-xs text-slate-400">Latest bank transfer checkouts</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('orders')}
                    className="text-xs font-bold text-[#0B1B3D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All <ChevronRight size={14} />
                  </button>
                </div>

                {ordersList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No orders recorded yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100 text-xs">
                    {ordersList.slice(0, 5).map((order) => (
                      <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-mono font-bold text-[#0B1B3D]">{order.orderReference}</p>
                          <p className="text-slate-500 font-medium">{order.customerName} ({order.customerPhone})</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">₦{order.totalAmount?.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-amber-600 uppercase">
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: ORDERS (WITH PERMANENT DELETE BUTTON) */}
          {currentView === 'orders' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#0B1B3D]">Customer Orders & Slips</h3>
                  <p className="text-xs text-slate-400">Inspect transfer receipts, update shipping, or remove test records</p>
                </div>

                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-2xl text-[11px] font-bold">
                  {['ALL', 'pending_verification', 'confirmed', 'dispatched', 'delivered'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setOrderStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        orderStatusFilter === s ? 'bg-[#0B1B3D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Destination</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Payment Slip</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">No matching orders found.</td>
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
                            <p>{order.deliveryState}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.deliveryAddress}</p>
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
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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

                              {/* PERMANENT ORDER DELETE BUTTON */}
                              <button
                                onClick={() => handleDeleteOrder(order.id, order.orderReference)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                title="Delete Order Record"
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

          {/* VIEW 3: INVENTORY */}
          {currentView === 'products' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#0B1B3D]">Live Store Inventory</h3>
                  <p className="text-xs text-slate-400">Click &apos;Edit&apos; to update photos, stock, prices, or feature badges</p>
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
                    <Plus size={14} /> Add New
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 flex flex-col justify-between gap-3 group">
                    <div className="space-y-3">
                      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-white border border-slate-200">
                        <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-2 left-2 bg-[#0B1B3D]/80 backdrop-blur-md text-[#D4AF37] text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                          {p.category}
                        </span>
                        {p.isFeatured && (
                          <span className="absolute top-2 right-2 bg-[#D4AF37] text-[#0B1B3D] text-[9px] uppercase font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                            <Star size={10} className="fill-[#0B1B3D]" /> Featured
                          </span>
                        )}
                        {p.images && p.images.length > 1 && (
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {p.images.length} photos
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{p.title}</h4>
                        <p className="text-sm font-black text-[#0B1B3D] mt-1">₦{p.price?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                      <span className={`text-[10px] font-bold ${p.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                        {p.inStock ? '● In Stock' : '○ Out of Stock'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-slate-500 hover:text-[#0B1B3D] hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                          title="Edit Product Details & Stock"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                  {editingProductId ? 'Edit Product Details' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-700 block">
                      Product Photos {productPreviews.length > 0 && `(${productPreviews.length} selected)`} *
                    </label>
                    {productPreviews.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setProductPreviews([])}
                        className="text-[11px] text-red-500 font-bold hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-slate-200 hover:border-[#0B1B3D] transition rounded-2xl p-4 text-center cursor-pointer relative bg-slate-50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleImagesSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-1">
                      <div className="h-10 w-10 bg-slate-100 text-[#0B1B3D] rounded-full flex items-center justify-center mx-auto">
                        <UploadCloud size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Click to upload 1 or more photos</p>
                      <p className="text-[10px] text-slate-400">Select multiple items to build an interactive carousel</p>
                    </div>
                  </div>

                  {productPreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {productPreviews.map((src, index) => (
                        <div key={index} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                          <img src={src} alt="Preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveUploadedImage(index);
                            }}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shadow hover:bg-red-700 cursor-pointer z-20"
                            title="Remove photo"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-[#0B1B3D] text-[#D4AF37] text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                              Cover
                            </span>
                          )}
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
                    placeholder="e.g. Ashake Luxury Leather Footwear"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D] font-semibold"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price in ₦ *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 6500"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stockCheck"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#0B1B3D] cursor-pointer"
                    />
                    <label htmlFor="stockCheck" className="font-semibold text-slate-800 cursor-pointer">
                      In Stock (Ready for immediate purchase)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featureCheck"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#0B1B3D] cursor-pointer"
                    />
                    <label htmlFor="featureCheck" className="font-semibold text-[#0B1B3D] flex items-center gap-1.5 cursor-pointer">
                      <Star size={13} className="text-[#D4AF37] fill-[#D4AF37]" /> Feature this product in the Homepage Spotlight
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="w-2/3 bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: RECEIPT SLIP */}
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
                <span className="text-xs font-black text-[#0B1B3D]">Payment Proof Screenshot</span>
                <button onClick={() => setPreviewReceipt(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center">
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