// app/checkout/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CaptchaChallenge } from '@/components/ui/CaptchaChallenge';
import { useCart } from '@/lib/store/useCart';
import { createOrderAction } from '@/lib/actions';
import { 
  Building2, 
  Copy, 
  Check, 
  UploadCloud, 
  ArrowLeft, 
  Send,
  UserCheck,
  UserPlus
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const items = cart.items || [];
  const clearCart = cart.clearCart;

  // Safe direct total calculation
  const total = items.reduce(
    (acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity || 1)), 
    0
  );

  const [copied, setCopied] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main Buyer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryState, setDeliveryState] = useState('Lagos');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Optional Dropship / Alternate Recipient Toggle
  const [isDropship, setIsDropship] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [alternateAddress, setAlternateAddress] = useState('');

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('7062297299');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSlipPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaValid) {
      alert('Please complete the human verification question first.');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    const orderRef = `MV-${Math.floor(100000 + Math.random() * 900000)}`;

    const res = await createOrderAction({
      orderReference: orderRef,
      customerName,
      customerPhone,
      customerEmail,
      deliveryState,
      deliveryAddress,
      recipientName: isDropship ? recipientName : undefined,
      recipientPhone: isDropship ? recipientPhone : undefined,
      alternateAddress: isDropship ? alternateAddress : undefined,
      isDropship,
      totalAmount: total,
      receiptUrl: slipPreview || undefined,
      items,
    });

    if (res.success) {
      if (typeof clearCart === 'function') {
        clearCart();
      }
      router.push(`/track?ref=${orderRef}`);
    } else {
      alert(res.error || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between pb-16 lg:pb-0">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B1B3D]">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1 className="text-xl font-black text-[#0B1B3D]">Direct Bank Transfer Checkout</h1>
          </div>

          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Buyer & Dropship Alternate Receiver */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Primary Buyer Info */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-black text-sm text-[#0B1B3D] flex items-center gap-2">
                  <UserCheck size={18} className="text-[#D4AF37]" /> Your Contact Details (Buyer / Ordering Client)
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oluwunmi Sola"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="08101671286"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Destination State *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lagos State"
                        value={deliveryState}
                        onChange={(e) => setDeliveryState(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Address / Pickup Spot *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 14 Admiralty Way, Lekki"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Dropship / Middleman Toggle */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-black text-sm text-[#0B1B3D] flex items-center gap-2">
                      <UserPlus size={18} className="text-[#D4AF37]" /> Deliver to Another Person? (Optional)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Enable this if you are ordering for someone else or reselling as a middleman.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isDropship}
                    onChange={(e) => setIsDropship(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-[#0B1B3D] cursor-pointer"
                  />
                </div>

                {isDropship && (
                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Recipient&apos;s Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Samuel Adeleke"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Recipient&apos;s Phone Number</label>
                      <input
                        type="tel"
                        placeholder="08012345678"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Recipient&apos;s Exact Delivery Address</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Suite 4, Plot 12 Airport Road, Abuja"
                        value={alternateAddress}
                        onChange={(e) => setAlternateAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bot Security Math Challenge */}
              <CaptchaChallenge onVerified={setIsCaptchaValid} />
            </div>

            {/* Right Column: OPay Account Details & Payment Proof */}
            <div className="md:col-span-5 space-y-6">
              
              {/* OPay Account Box */}
              <div className="bg-gradient-to-br from-[#0B1B3D] via-[#10234d] to-slate-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#D4AF37] bg-white/10 px-3 py-1 rounded-full">
                    Official OPay Account
                  </span>
                  <Building2 size={20} className="text-[#D4AF37]" />
                </div>

                <div>
                  <p className="text-xs text-slate-300">Bank Name</p>
                  <p className="text-base font-black text-white">OPay</p>
                </div>

                <div className="flex items-center justify-between bg-white/10 p-3.5 rounded-2xl border border-white/10">
                  <div>
                    <p className="text-[10px] text-slate-300 uppercase font-bold">Account Number</p>
                    <p className="text-xl font-mono font-black text-[#D4AF37] tracking-wider">7062297299</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="bg-[#D4AF37] hover:bg-[#E8C766] text-[#0B1B3D] p-2.5 rounded-xl font-bold transition flex items-center gap-1 text-xs cursor-pointer shadow-md"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div>
                  <p className="text-[10px] text-slate-300">Account Name</p>
                  <p className="text-xs font-bold text-slate-100">OYELEYE MARVELLOUS</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-slate-300 font-bold">Total to Transfer:</span>
                  <span className="text-xl font-black text-[#D4AF37]">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Proof Slip Upload */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <label className="font-bold text-xs text-slate-700 block">
                  Upload Bank Transfer Slip / Proof *
                </label>
                
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer relative bg-slate-50 hover:border-[#0B1B3D] transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlipUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <UploadCloud size={24} className="mx-auto text-[#0B1B3D]" />
                  <p className="text-xs font-bold text-slate-700 mt-1">Tap to select payment receipt</p>
                  <p className="text-[10px] text-slate-400">PNG, JPG or bank debit screenshot</p>
                </div>

                {slipPreview && (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200">
                    <img src={slipPreview} alt="Transfer Slip" className="h-full w-full object-contain bg-slate-100" />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isCaptchaValid}
                className="w-full bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold text-xs py-4 rounded-2xl shadow-xl transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Recording Order & Verification...</span>
                ) : (
                  <>
                    <Send size={15} className="text-[#D4AF37]" /> Submit Order for Verification
                  </>
                )}
              </button>

            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}