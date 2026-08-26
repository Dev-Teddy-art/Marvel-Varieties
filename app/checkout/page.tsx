'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/useCart';
import { createOrderAction } from '@/lib/actions';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  UploadCloud, 
  Building2, 
  ShieldCheck, 
  Truck, 
  Clock, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const total = getTotal();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryState: 'Lagos',
    deliveryAddress: '',
  });

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  // Fixed Delivery calculation
  const deliveryFee = formData.deliveryState === 'Lagos' ? 2500 : 4500;
  const grandTotal = total + deliveryFee;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('0100286255');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiptFile) {
      alert('Please upload your bank transfer payment receipt / snapshot to proceed.');
      return;
    }

    setIsSubmitting(true);
    const generatedRef = `MV-${Math.floor(100000 + Math.random() * 900000)}`;

    const res = await createOrderAction({
      orderReference: generatedRef,
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      deliveryState: formData.deliveryState,
      deliveryAddress: formData.deliveryAddress,
      totalAmount: grandTotal,
      receiptUrl: receiptPreview || '',
      items: items,
    });

    if (res.success) {
      setOrderRef(generatedRef);
      setIsSuccess(true);
      clearCart();
    } else {
      alert('Failed to place order. Please try again.');
    }

    setIsSubmitting(false);
  };

  // Guard: Empty cart
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="h-16 w-16 bg-slate-100 text-[#0B1B3D] rounded-full flex items-center justify-center mx-auto">
            <Building2 size={28} />
          </div>
          <h2 className="text-xl font-bold text-[#0B1B3D]">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0B1B3D] text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-[#142752] transition"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  // Success Confirmation Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full text-center space-y-6"
        >
          <div className="h-20 w-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
            <FileCheck2 size={36} />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#0B1B3D] px-3.5 py-1 rounded-full inline-block">
              Transfer Receipt Under Verification
            </span>
            <h2 className="text-2xl font-black text-[#0B1B3D] pt-2">Order Submitted!</h2>
            <p className="text-xs text-slate-500">
              Order Reference: <strong className="text-slate-900 font-mono text-sm">{orderRef}</strong>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 text-slate-600">
            <p><strong>Customer:</strong> {formData.fullName}</p>
            <p><strong>Phone Number:</strong> {formData.phone}</p>
            <p><strong>Payment Account:</strong> Sterling Bank (0100286255)</p>
            <p><strong>Total Amount:</strong> ₦{grandTotal.toLocaleString()}</p>
            <p><strong>Delivery Address:</strong> {formData.deliveryAddress}, {formData.deliveryState}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-left flex gap-3 text-amber-900 text-xs">
            <AlertCircle size={20} className="shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              Our team will review your transfer proof during operating hours (10:00 AM – 5:00 PM). You can track this package anytime with either your Order Reference or Phone Number.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/track"
              className="w-full bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D] font-bold text-sm py-3.5 rounded-xl transition shadow-md text-center"
            >
              Track Package Status
            </Link>
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 py-2">
              Back to Catalog
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16">
      {/* Checkout Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-[#0B1B3D] hover:opacity-80 transition">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div className="relative h-10 w-36 sm:w-44">
            <Image 
              src="/MARVEL VARIETIES.png" 
              alt="Marvel Varieties" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <ShieldCheck size={16} className="text-emerald-600" /> Secure Checkout
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500 mb-6">Complete your delivery address and transfer slip upload</p>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Customer Delivery & Bank Slip Upload */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Contact & Address */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0B1B3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                <Truck size={18} className="text-[#D4AF37]" />
                1. Delivery & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Adeleke"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number (For Tracking) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08146875777"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Delivery State *</label>
                  <select
                    value={formData.deliveryState}
                    onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B1B3D]"
                  >
                    <option value="Lagos">Lagos State (₦2,500 Delivery)</option>
                    <option value="Ogun">Ogun State (₦4,500 Delivery)</option>
                    <option value="Oyo">Oyo / Ibadan (₦4,500 Delivery)</option>
                    <option value="Abuja">Abuja FCT (₦4,500 Delivery)</option>
                    <option value="Rivers">Rivers / Port Harcourt (₦4,500 Delivery)</option>
                    <option value="Other">Other Nationwide States (₦4,500 Delivery)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">Full Delivery Street Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="House number, street name, nearest landmark..."
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                />
              </div>
            </div>

            {/* 2. Sterling Bank Instructions & Proof Upload */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0B1B3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 size={18} className="text-[#D4AF37]" />
                2. Direct Bank Transfer Instruction
              </h3>

              {/* Sterling Account Card */}
              <div className="bg-gradient-to-r from-[#0B1B3D] to-[#142752] p-4 sm:p-5 rounded-2xl text-white space-y-3 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase font-semibold">Official Business Account</span>
                    <h4 className="text-lg font-black text-[#D4AF37]">Sterling Bank</h4>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-slate-200">
                    Direct Verification
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/10">
                  <div>
                    <p className="text-[10px] text-slate-300">Account Number</p>
                    <p className="text-lg font-mono font-black tracking-wider text-white">0100286255</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D] text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedAccount ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-300 flex justify-between pt-1">
                  <span>Account Name:</span>
                  <strong className="text-white">MARVEL VARIETIES NIG. LTD</strong>
                </div>
              </div>

              {/* Proof of Payment Upload */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700 block">
                  Upload Payment Slip / Screenshot Proof *
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#0B1B3D] transition rounded-2xl p-5 text-center cursor-pointer relative bg-slate-50">
                  <input
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {receiptPreview ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <div className="relative h-28 w-28 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={receiptPreview} alt="Receipt Preview" className="h-full w-full object-cover" />
                      </div>
                      <p className="text-xs font-bold text-emerald-600">✓ {receiptFile?.name}</p>
                      <p className="text-[10px] text-slate-400">Click to change snapshot</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-12 w-12 bg-slate-100 text-[#0B1B3D] rounded-full flex items-center justify-center mx-auto">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Click to select receipt or capture snapshot</p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, or PDF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Right Summary & Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 sticky top-20">
              <h3 className="font-bold text-base text-[#0B1B3D] border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              <div className="max-h-56 overflow-y-auto space-y-3 text-xs pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee ({formData.deliveryState})</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#0B1B3D] border-t border-slate-100 pt-2">
                  <span>Total Due</span>
                  <span className="text-[#0B1B3D]">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Transfer Proof...</span>
                ) : (
                  <>
                    <span>Confirm Bank Transfer</span>
                    <span className="text-[#D4AF37]">₦{grandTotal.toLocaleString()}</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <Clock size={12} className="text-[#D4AF37]" />
                <span>Dispatches within 24 hours of slip approval</span>
              </div>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}