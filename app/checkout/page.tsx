// app/checkout/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { OrderCountdown } from '@/components/ui/OrderCountdown';
import { createOrderAction, getStoreSettingsAction } from '@/lib/actions';
import { 
  ArrowLeft, 
  ShieldCheck, 
  UploadCloud, 
  Copy, 
  Check, 
  CheckCircle2, 
  Building2, 
  ShoppingBag, 
  Truck, 
  AlertCircle 
} from 'lucide-react';

const LAGOS_AREAS = [
  'Ojodu Berger / Ikeja',
  'Lagos Island / Victoria Island / Lekki Phase 1',
  'Chevron / Ajah / Sangotedo',
  'Surulere / Yaba / Maryland',
  'Festac / Mile 2 / Trade Fair',
  'Ikorodu / Ketu / Mile 12',
  'Alimosho / Egbeda / Iyana Ipaja',
  'Outside Lagos (Nationwide Interstate Logistics)',
];

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart() as any;
  const items = cart.items || [];
  const clearCart = cart.clearCart || (() => {});

  const totalPrice = items.reduce(
    (acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  // Delivery Details Form
  const [deliveryState, setDeliveryState] = useState(LAGOS_AREAS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [isDropship, setIsDropship] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // Live Bank Details State
  const [bankSettings, setBankSettings] = useState({
    bankName: 'OPay',
    accountNumber: '7062297299',
    accountName: 'OYELEYE MARVELLOUS',
  });

  // Calculate dynamic delivery fee
  const deliveryFee = deliveryState.includes('Outside Lagos') ? 4500 : 2500;
  const grandTotal = totalPrice + deliveryFee;

  useEffect(() => {
    // 1. Check user login session
    const savedUser = localStorage.getItem('marvel_user');
    if (!savedUser) {
      router.push('/login?redirect=checkout');
      return;
    }
    try {
      setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      router.push('/login?redirect=checkout');
    }

    // 2. Load live bank settings from database
    async function fetchBankInfo() {
      const data = await getStoreSettingsAction();
      if (data) {
        setBankSettings({
          bankName: data.bankName || 'OPay',
          accountNumber: data.accountNumber || '7062297299',
          accountName: data.accountName || 'OYELEYE MARVELLOUS',
        });
      }
    }
    fetchBankInfo();
  }, [router]);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankSettings.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timerExpired) {
      alert('Your 20-minute payment session expired. Please refresh the page to restart.');
      return;
    }

    if (!receiptPreview) {
      alert('Please upload a screenshot or image of your bank transfer receipt.');
      return;
    }

    if (!deliveryAddress.trim()) {
      alert('Please provide your complete delivery street address.');
      return;
    }

    setSubmitting(true);
    const orderRef = `MV-${Date.now().toString().slice(-6)}`;

    try {
      const res = await createOrderAction({
        orderReference: orderRef,
        customerName: currentUser?.fullName || 'Customer',
        customerPhone: currentUser?.phone || '',
        customerEmail: currentUser?.email || '',
        deliveryState,
        deliveryAddress: deliveryAddress.trim(),
        recipientName: isDropship ? recipientName.trim() : currentUser?.fullName,
        recipientPhone: isDropship ? recipientPhone.trim() : (alternatePhone.trim() || currentUser?.phone),
        isDropship,
        totalAmount: grandTotal,
        receiptUrl: receiptPreview,
        items,
      });

      if (res.success) {
        // Clear session deadline and cart
        sessionStorage.removeItem('mv_payment_deadline');
        clearCart();
        setOrderComplete(orderRef);
      } else {
        alert('Could not record order. Please try again.');
      }
    } catch (err) {
      alert('Network error submitting order.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 border border-slate-100 shadow-xl">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#0B1B3D] px-3 py-1 rounded-full inline-block">
              Order Logged Successfully
            </span>
            <h1 className="text-2xl font-black text-[#0B1B3D] pt-2">Payment Slip Received</h1>
            <p className="text-xs text-slate-500">
              Your order reference number is:
            </p>
            <p className="font-mono text-base font-black text-[#0B1B3D] bg-slate-50 border border-slate-200 py-2 rounded-xl mt-1">
              {orderComplete}
            </p>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Our dispatch admin will verify your bank transfer slip and package your items for delivery.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/track"
              className="flex-1 bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37] text-xs font-bold py-3 rounded-xl shadow-md transition"
            >
              Track Dispatch Status
            </Link>
            <Link
              href="/"
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY BAG VIEW
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 border border-slate-100 shadow-xl">
          <div className="h-14 w-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-lg font-black text-[#0B1B3D]">Your Bag is Empty</h2>
          <p className="text-xs text-slate-400">
            Please select items from the catalog before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0B1B3D] text-[#D4AF37] text-xs font-bold px-6 py-3 rounded-xl shadow transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 pb-16">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0B1B3D] font-bold transition">
            <ArrowLeft size={16} /> Return to Store
          </Link>
          <div className="relative h-7 w-28">
            <Image
              src="/MARVEL_VARIETIES-removebg-preview.png"
              alt="Marvel Varieties"
              fill
              sizes="112px"
              className="object-contain"
              priority
            />
          </div>
          <div className="text-xs font-bold text-slate-400">
            Secure Direct Transfer
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 20-Minute Payment Countdown Timer */}
        <OrderCountdown
          initialMinutes={20}
          onExpire={() => setTimerExpired(true)}
        />

        {timerExpired && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>
              Your 20-minute reservation window has ended. Please refresh this page to begin a new verification session.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Col: Delivery Form & Payment Transfer */}
          <div className="md:col-span-7 space-y-5">
            {/* Delivery Destination Box */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-[#0B1B3D] flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Truck size={16} className="text-[#D4AF37]" /> Delivery & Recipient Details
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer / Ordering As</label>
                  <input
                    type="text"
                    disabled
                    value={`${currentUser?.fullName || ''} (${currentUser?.phone || ''})`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery Destination / Region *</label>
                  <select
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B1B3D]"
                  >
                    {LAGOS_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Street Address / Landmark *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Flat 4, 12 Olanipekun Street, Opposite Akiode Health Centre..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alternative Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. 08123456789"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0B1B3D]"
                  />
                </div>

                {/* Dropshipping / Gift Recipient Toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isDropship}
                      onChange={(e) => setIsDropship(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#0B1B3D]"
                    />
                    <span>Deliver to someone else (Gift / Dropship Order)?</span>
                  </label>

                  {isDropship && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Recipient Name</label>
                        <input
                          type="text"
                          required={isDropship}
                          placeholder="Receiver's full name"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Recipient Phone Number</label>
                        <input
                          type="tel"
                          required={isDropship}
                          placeholder="Receiver's contact number"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Official Bank Account Box */}
            <div className="bg-[#0B1B3D] text-white p-5 rounded-3xl shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <Building2 size={14} /> Official Settlement Account
                </span>
                <span className="text-[10px] text-slate-400">20-Min Window</span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-slate-400">Bank Name:</p>
                <p className="font-bold text-white text-sm">{bankSettings.bankName}</p>
                
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-slate-400 text-[10px]">Account Number:</p>
                    <p className="font-mono text-xl font-black text-[#D4AF37] tracking-wider">
                      {bankSettings.accountNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="bg-white/10 hover:bg-white/20 text-[#D4AF37] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition text-xs cursor-pointer"
                  >
                    {copiedAccount ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-1">
                  <p className="text-slate-400 text-[10px]">Account Name:</p>
                  <p className="font-bold text-xs uppercase text-slate-200">{bankSettings.accountName}</p>
                </div>
              </div>
            </div>

            {/* Receipt Proof Upload Box */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-black text-[#0B1B3D] flex items-center gap-2">
                <UploadCloud size={16} className="text-[#D4AF37]" /> Upload Transfer Receipt Proof *
              </h3>
              <p className="text-xs text-slate-400">
                Attach a screenshot or image of your bank debit slip to verify payment.
              </p>

              <div className="border-2 border-dashed border-slate-200 hover:border-[#0B1B3D] rounded-2xl p-4 text-center relative bg-slate-50 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleReceiptUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <UploadCloud size={24} className="mx-auto text-[#0B1B3D]" />
                <p className="text-xs font-bold text-slate-700 mt-1">
                  {receiptPreview ? 'Change Receipt Slip' : 'Tap to Upload Debit Receipt'}
                </p>
              </div>

              {receiptPreview && (
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img src={receiptPreview} alt="Receipt Slip Preview" className="h-full w-full object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Order Summary & Placement */}
          <div className="md:col-span-5 space-y-4 md:sticky md:top-20">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-[#0B1B3D] border-b border-slate-100 pb-2">
                Order Items Summary ({items.length})
              </h3>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {items.map((item: any, idx: number) => {
                  const img = item.image || item.imageUrl || '/MARVEL_VARIETIES-removebg-preview.png';
                  return (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
                      <img src={img} alt={item.title} className="h-12 w-12 rounded-lg object-cover bg-white border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.title}</p>
                        {item.selectedColor && (
                          <span className="text-[10px] text-amber-700 font-semibold">Shade: {item.selectedColor}</span>
                        )}
                        <p className="text-slate-500 font-mono text-[11px]">
                          {item.quantity} × ₦{item.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-slate-800">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Logistics / Dispatch</span>
                  <span className="font-bold text-slate-800">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#0B1B3D] border-t border-slate-100 pt-2">
                  <span>Total Due</span>
                  <span className="text-[#D4AF37] font-black text-base">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || timerExpired}
                className={`w-full py-4 rounded-2xl font-black text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  timerExpired
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37]'
                }`}
              >
                {submitting ? 'Confirming Order...' : 'I Have Transferred - Submit Order'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck size={14} className="text-[#D4AF37]" />
                <span>Verified Direct Settlement • Fast Lagos Dispatch</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}