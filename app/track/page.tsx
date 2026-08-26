'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { searchOrderAction } from '@/lib/actions';
import { 
  Search, 
  ArrowLeft, 
  Package, 
  Clock, 
  Truck, 
  CheckCheck, 
  AlertCircle,
  Phone,
  FileText,
  Calendar,
  MapPin,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_STEPS = [
  { key: 'pending_verification', label: 'Payment Verification', desc: 'Verifying bank slip / transfer confirmation' },
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Payment verified and approved' },
  { key: 'processing', label: 'Packing & Quality Check', desc: 'Items secured and packaged at warehouse' },
  { key: 'dispatched', label: 'Dispatched / In Transit', desc: 'Handed over to delivery courier' },
  { key: 'delivered', label: 'Delivered', desc: 'Received and completed' },
];

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState<'ref' | 'phone'>('ref');
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setIsLoading(true);

    const found = await searchOrderAction(query);
    setSearchedOrder(found);
    setIsLoading(false);
  };

  const getStepIndex = (status: string) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-[#0B1B3D] hover:opacity-80 transition">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div className="relative h-10 w-36">
            <Image src="/MARVEL VARIETIES.png" alt="Marvel Varieties" fill className="object-contain" priority />
          </div>
          <span className="text-xs text-slate-400 font-semibold">Live Tracker</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-[#0B1B3D] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <Package size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Search with your Order Reference ID or the Phone Number entered at checkout.
          </p>
        </div>

        {/* Search Mode Toggle & Input */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => { setSearchType('ref'); setSearched(false); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                searchType === 'ref' ? 'bg-[#0B1B3D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText size={14} /> By Order Reference
            </button>
            <button
              type="button"
              onClick={() => { setSearchType('phone'); setSearched(false); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                searchType === 'phone' ? 'bg-[#0B1B3D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone size={14} /> By Phone Number
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder={searchType === 'ref' ? 'e.g. MV-849201' : 'e.g. 08146875777'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0B1B3D]"
              />
              <Search className="absolute left-4 top-4 text-slate-400" size={18} />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#0B1B3D] hover:bg-[#142752] text-white font-bold text-xs sm:text-sm px-6 rounded-2xl flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Track'}
            </button>
          </form>
        </div>

        {/* Tracking Timeline Output */}
        {searched && searchedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="bg-[#0B1B3D] p-5 text-white flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">Order Reference</span>
                <h3 className="text-xl font-mono font-black">{searchedOrder.orderReference}</h3>
              </div>
              <div className="text-right text-xs text-slate-300">
                <p className="flex items-center gap-1.5 justify-end">
                  <Calendar size={13} className="text-[#D4AF37]" />
                  {searchedOrder.createdAt ? new Date(searchedOrder.createdAt).toLocaleDateString() : 'Recent'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sterling Bank Transfer</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Progress Steps */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Progress</h4>
                
                <div className="space-y-6 relative pl-4 sm:pl-6 border-l-2 border-slate-200 ml-4">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentStepIdx = getStepIndex(searchedOrder.status);
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.key} className="relative">
                        <div
                          className={`absolute -left-[25px] sm:-left-[33px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                            isCompleted
                              ? 'bg-[#0B1B3D] border-[#0B1B3D] text-[#D4AF37]'
                              : 'bg-white border-slate-300 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-[#D4AF37]/30' : ''}`}
                        >
                          {isCompleted ? <CheckCheck size={12} /> : idx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className={`text-sm font-bold ${isCompleted ? 'text-[#0B1B3D]' : 'text-slate-400'}`}>
                              {step.label}
                            </h5>
                            {isCurrent && (
                              <span className="bg-[#D4AF37]/20 text-[#0B1B3D] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                                Current Status
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold">Recipient</span>
                  <p className="font-bold text-slate-800">{searchedOrder.customerName}</p>
                  <p className="text-slate-500">{searchedOrder.customerPhone}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <MapPin size={12} className="text-[#D4AF37]" /> Delivery Address
                  </span>
                  <p className="font-medium text-slate-700">{searchedOrder.deliveryAddress}, {searchedOrder.deliveryState}</p>
                </div>
              </div>

              {/* Items in order */}
              {Array.isArray(searchedOrder.items) && searchedOrder.items.length > 0 && (
                <div className="space-y-2 text-xs">
                  <h5 className="font-bold text-slate-700">Package Contents</h5>
                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-100">
                    {searchedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{item.title}</p>
                          <p className="text-[11px] text-slate-400">Qty: {item.quantity || 1}</p>
                        </div>
                        <span className="font-bold text-slate-900">₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Not Found Screen */}
        {searched && !isLoading && !searchedOrder && (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center space-y-3 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-bold text-slate-800">No matching order found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No active order corresponds to &ldquo;{query}&rdquo;. Check the phone number or reference ID and try again.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}