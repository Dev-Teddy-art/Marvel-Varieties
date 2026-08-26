'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { OrderCountdown } from '@/components/ui/OrderCountdown';
import { loginUserAction, registerUserAction, getCustomerOrdersAction } from '@/lib/actions';
import { 
  User, 
  Package, 
  Phone, 
  Mail, 
  Lock, 
  LogOut, 
  ExternalLink,
  Loader2,
  Calendar,
  Building2,
  ShieldCheck,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form input state
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('marvel_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        loadOrders(parsed.phone);
      } catch (e) {
        localStorage.removeItem('marvel_user');
      }
    }
  }, []);

  const loadOrders = async (phone: string) => {
    setLoading(true);
    const orders = await getCustomerOrdersAction(phone);
    setCustomerOrders(orders || []);
    setLoading(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (authMode === 'register') {
      const res = await registerUserAction({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('marvel_user', JSON.stringify(res.user));
        if (res.user.role === 'admin') {
          sessionStorage.setItem('marvel_admin_session', 'true');
        }
        await loadOrders(res.user.phone);
      } else {
        setErrorMsg(res.error || 'Failed to register account');
      }
    } else {
      const res = await loginUserAction(form.email || form.phone, form.password);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('marvel_user', JSON.stringify(res.user));
        if (res.user.role === 'admin') {
          sessionStorage.setItem('marvel_admin_session', 'true');
        }
        await loadOrders(res.user.phone);
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('marvel_user');
    sessionStorage.removeItem('marvel_admin_session');
    setUser(null);
    setCustomerOrders([]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between pb-16 lg:pb-0">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          
          {/* USER LOGGED IN VIEW */}
          {user ? (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-[#0B1B3D] via-[#142752] to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="h-16 w-16 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                    <User size={30} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                      {user.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
                    </span>
                    <h1 className="text-2xl font-black">{user.fullName}</h1>
                    <p className="text-xs text-slate-300 mt-0.5">{user.email} • {user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* ADMIN CONTROL BUTTON (ONLY FOR ADMIN ROLE) */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="bg-[#D4AF37] text-[#0B1B3D] text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#E8C766] transition flex items-center gap-1.5 shadow-md"
                    >
                      <span>Control Center</span>
                      <ExternalLink size={14} />
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Order History */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-black text-[#0B1B3D] flex items-center gap-2">
                    <Package size={20} className="text-[#D4AF37]" />
                    My Order History
                  </h2>
                  <Link href="/track" className="text-xs text-[#0B1B3D] font-bold hover:underline">
                    Track by Ref →
                  </Link>
                </div>

                {loading ? (
                  <div className="py-8 flex justify-center items-center gap-2 text-xs text-slate-400">
                    <Loader2 size={18} className="animate-spin text-[#0B1B3D]" /> Loading your orders...
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Package size={32} className="mx-auto text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                    <p className="text-xs text-slate-400">Orders placed with phone {user.phone} will appear here automatically.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 text-xs">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-black text-[#0B1B3D] text-sm">{order.orderReference}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
                          </div>
                          
                          {/* Real-time 5-Hour Payment Timer */}
                          <OrderCountdown createdAt={order.createdAt} status={order.status} />

                          <p className="text-slate-500">{order.deliveryAddress}, {order.deliveryState}</p>
                        </div>

                        <div className="text-left sm:text-right space-y-1">
                          <p className="font-black text-slate-900 text-base">₦{order.totalAmount?.toLocaleString()}</p>
                          <Link href="/track" className="text-[#0B1B3D] font-bold text-[11px] hover:underline inline-flex items-center gap-0.5">
                            Live Tracking Details <ChevronRight size={12} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            
            /* GUEST / AUTHENTICATION FORM */
            <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
              
              {/* Toggle Mode */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    authMode === 'login' ? 'bg-[#0B1B3D] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    authMode === 'register' ? 'bg-[#0B1B3D] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-[#0B1B3D]">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                </h2>
                <p className="text-xs text-slate-400">
                  {authMode === 'login' 
                    ? 'Sign in to view your orders and update account details' 
                    : 'Register to manage orders and track dispatches seamlessly'}
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
                {authMode === 'register' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samuel Adeleke"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                      />
                      <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {authMode === 'login' ? 'Email Address or Phone Number *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="name@example.com or 0814..."
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                    />
                    <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  </div>
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number (For Order Tracking) *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="08146875777"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                      />
                      <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                    />
                    <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>{authMode === 'login' ? 'Sign In to Account' : 'Register Account'}</span>
                </button>
              </form>

            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}