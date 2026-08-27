// app/account/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { 
  loginUserAction, 
  registerUserAction, 
  getCustomerOrdersAction 
} from '@/lib/actions';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Package, 
  ArrowRight, 
  LogOut, 
  ShoppingBag,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form inputs
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('marvel_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        loadCustomerOrders(parsed.phone || parsed.email);
      } catch (e) {}
    }
  }, []);

  const loadCustomerOrders = async (phoneOrEmail: string) => {
    const res = await getCustomerOrdersAction(phoneOrEmail);
    setOrders(res || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await loginUserAction(identifier, password);
    if (res.success && res.user) {
      localStorage.setItem('marvel_user', JSON.stringify(res.user));
      setUser(res.user);
      loadCustomerOrders(res.user.phone || res.user.email);
    } else {
      setErrorMsg(res.error || 'Invalid credentials.');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await registerUserAction({
      fullName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });

    if (res.success && res.user) {
      localStorage.setItem('marvel_user', JSON.stringify(res.user));
      setUser(res.user);
      loadCustomerOrders(res.user.phone || res.user.email);
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('marvel_user');
    sessionStorage.removeItem('marvel_admin_session');
    setUser(null);
    setOrders([]);
    setIdentifier('');
    setPassword('');
  };

  const isSuperAdmin = user?.role === 'admin';
  const isStaffAdmin = user?.role === 'editor';
  const hasAdminAccess = isSuperAdmin || isStaffAdmin;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {user ? (
            <div className="space-y-6">
              {/* Account Hero Card */}
              <div className="bg-gradient-to-r from-[#0B1B3D] via-[#142752] to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <User size={30} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                        isSuperAdmin 
                          ? 'bg-[#D4AF37] text-[#0B1B3D]' 
                          : isStaffAdmin 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        {isSuperAdmin ? '👑 Super Administrator' : isStaffAdmin ? '🛡️ Staff Product Manager' : 'Verified Customer'}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">{user.fullName}</h2>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      {user.email} • {user.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {hasAdminAccess && (
                    <Link
                      href="/admin"
                      className="flex-1 sm:flex-initial bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D] font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <Layers size={15} />
                      <span>Control Center ↗</span>
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Order History */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-black text-base text-[#0B1B3D] flex items-center gap-2">
                    <Package size={18} className="text-[#D4AF37]" /> My Order History
                  </h3>
                  <Link href="/track" className="text-xs font-bold text-slate-500 hover:text-[#0B1B3D]">
                    Track by Ref →
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <ShoppingBag size={22} />
                    </div>
                    <p className="text-xs font-bold text-slate-700">No orders placed yet</p>
                    <p className="text-[11px] text-slate-400">
                      Orders placed with phone {user.phone} will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                        <div>
                          <p className="font-mono font-bold text-xs text-[#0B1B3D]">{o.orderReference}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Total: ₦{o.totalAmount?.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                            {o.status.replace('_', ' ')}
                          </span>
                          <Link href={`/track?ref=${o.orderReference}`} className="p-2 rounded-xl bg-white text-[#0B1B3D] hover:bg-slate-100 transition shadow-sm">
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Sign In / Register Card */
            <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                  className={`flex-1 py-2.5 rounded-xl transition cursor-pointer ${
                    activeTab === 'login' ? 'bg-[#0B1B3D] text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                  className={`flex-1 py-2.5 rounded-xl transition cursor-pointer ${
                    activeTab === 'register' ? 'bg-[#0B1B3D] text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold">
                  {errorMsg}
                </div>
              )}

              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address or Phone Number *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. editor@marvelvarieties.com"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                      />
                      <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                      />
                      <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Account'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Staff Manager"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="staff@marvelvarieties.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="07062297299"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Creating Account...' : 'Register Account'}
                  </button>
                </form>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}