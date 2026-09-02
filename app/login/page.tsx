// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUserAction, registerUserAction } from '@/lib/actions';
import { Lock, Mail, Phone, User, ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '';

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await loginUserAction(identifier, password);
      if (!res.success || !res.user) {
        setErrorMsg(res.error || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      localStorage.setItem('marvel_user', JSON.stringify(res.user));

      if (res.user.role === 'admin' || res.user.role === 'editor') {
        sessionStorage.setItem('marvel_admin_session', res.user.role === 'admin' ? 'super_admin' : 'staff_admin');
        router.push('/admin');
      } else if (redirectTo === 'checkout') {
        router.push('/checkout');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await registerUserAction({
        fullName,
        email: regEmail,
        phone: regPhone,
        password,
      });

      if (!res.success || !res.user) {
        setErrorMsg(res.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      localStorage.setItem('marvel_user', JSON.stringify(res.user));
      
      if (redirectTo === 'checkout') {
        router.push('/checkout');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setErrorMsg('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070F22] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="relative h-10 w-36 mx-auto">
            <Image
              src="/MARVEL_VARIETIES-removebg-preview.png"
              alt="Marvel Varieties"
              fill
              sizes="144px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-black text-[#0B1B3D]">
            {isRegistering ? 'Create Customer Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400">
            {isRegistering
              ? 'Join to track orders, receipts & delivery status'
              : 'Sign in to access your orders or staff portal'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer ${
              !isRegistering ? 'bg-[#0B1B3D] text-[#D4AF37] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer ${
              isRegistering ? 'bg-[#0B1B3D] text-[#D4AF37] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isRegistering ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleLogin}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email or Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 07062297299 or name@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                  />
                  <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-[#0B1B3D]"
                  />
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37] font-bold py-3.5 rounded-xl shadow-lg transition cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleRegister}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                  />
                  <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08012345678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                  />
                  <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#0B1B3D]"
                  />
                  <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-[#0B1B3D]"
                  />
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37] font-bold py-3.5 rounded-xl shadow-lg transition cursor-pointer mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-800 transition">
            <ArrowLeft size={14} /> Back to Store
          </Link>

          <Link href="/admin" className="inline-flex items-center gap-1 font-bold text-[#0B1B3D] hover:underline">
            <KeyRound size={14} /> Admin PIN Portal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}