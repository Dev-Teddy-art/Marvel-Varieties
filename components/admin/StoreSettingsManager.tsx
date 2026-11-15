// components/admin/StoreSettingsManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getStoreSettingsAction, updateStoreSettingsAction } from '@/lib/actions';
import { DeliveryZone } from '@/lib/db/schema';
import { Building2, Truck, Plus, Trash2, Save, Loader2, CheckCircle2 } from 'lucide-react';

export function StoreSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [bankName, setBankName] = useState('OPay');
  const [accountNumber, setAccountNumber] = useState('7062297299');
  const [accountName, setAccountName] = useState('OYELEYE MARVELLOUS');
  const [contactAddress, setContactAddress] = useState(
    '3 Olanipekun Street, Opposite Akiode Health Centre, Ojodu Berger, Lagos State'
  );
  const [contactPhone, setContactPhone] = useState('+234 706 229 7299');
  const [whatsappNumber, setWhatsappNumber] = useState('07062297299');
  const [operatingHours, setOperatingHours] = useState('Mon – Sat: 8:00 AM – 6:00 PM');
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

  useEffect(() => {
    getStoreSettingsAction().then((data) => {
      if (data) {
        setBankName(data.bankName || 'OPay');
        setAccountNumber(data.accountNumber || '7062297299');
        setAccountName(data.accountName || 'OYELEYE MARVELLOUS');
        setContactAddress(data.contactAddress || '');
        setContactPhone(data.contactPhone || '');
        setWhatsappNumber(data.whatsappNumber || '');
        setOperatingHours(data.operatingHours || '');
        setDeliveryZones(Array.isArray(data.deliveryZones) ? data.deliveryZones : []);
      }
      setLoading(false);
    });
  }, []);

  const handleAddZone = () => {
    setDeliveryZones((prev) => [
      ...prev,
      { id: `zone_${Date.now()}`, label: '', fee: 3000 },
    ]);
  };

  const handleUpdateZone = (index: number, field: 'label' | 'fee', value: string | number) => {
    setDeliveryZones((prev) =>
      prev.map((zone, i) => (i === index ? { ...zone, [field]: value } : zone))
    );
  };

  const handleRemoveZone = (index: number) => {
    setDeliveryZones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedNotice(false);

    const res = await updateStoreSettingsAction({
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      contactAddress: contactAddress.trim(),
      contactPhone: contactPhone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      operatingHours: operatingHours.trim(),
      deliveryZones,
    });

    setSaving(false);
    if (res.success) {
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } else {
      alert(res.error || 'Failed to save store settings.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading store settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
      {/* Bank & Contact Settings */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building2 size={16} className="text-[#D4AF37]" />
          <h3 className="font-black text-sm text-[#0B1B3D]">Settlement Account & Store Contact</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Bank / Fintech Name</label>
            <input
              type="text"
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Account Number</label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Account Name</label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Store Phone</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Store Pickup Address</label>
          <input
            type="text"
            value={contactAddress}
            onChange={(e) => setContactAddress(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
          />
        </div>
      </div>

      {/* Dispatch & Delivery Zone Pricing */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-[#D4AF37]" />
            <div>
              <h3 className="font-black text-sm text-[#0B1B3D]">Dispatch & Delivery Zone Pricing</h3>
              <p className="text-[11px] text-slate-400">
                Customers select one of these axes on checkout and pay the exact delivery fee
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddZone}
            className="inline-flex items-center gap-1.5 bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37] font-bold px-3.5 py-2 rounded-xl cursor-pointer transition"
          >
            <Plus size={14} /> Add Zone
          </button>
        </div>

        <div className="space-y-2.5">
          {deliveryZones.map((zone, idx) => (
            <div
              key={zone.id}
              className="flex flex-col sm:flex-row items-center gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80"
            >
              <input
                type="text"
                required
                placeholder="e.g. Lekki Phase 1 / Victoria Island / Ikoyi"
                value={zone.label}
                onChange={(e) => handleUpdateZone(idx, 'label', e.target.value)}
                className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:border-[#0B1B3D]"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="font-bold text-slate-400">₦</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  required
                  value={zone.fee}
                  onChange={(e) =>
                    handleUpdateZone(idx, 'fee', Math.max(0, Number(e.target.value) || 0))
                  }
                  className="w-32 bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-black text-[#0B1B3D] focus:outline-none focus:border-[#0B1B3D]"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveZone(idx)}
                  disabled={deliveryZones.length <= 1}
                  title="Delete zone"
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer disabled:opacity-30"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        {savedNotice && (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
            <CheckCircle2 size={16} /> Store & Delivery Rates Saved!
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0B1B3D] hover:bg-[#142752] text-[#D4AF37] font-black px-6 py-3.5 rounded-2xl shadow-lg transition cursor-pointer"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          <span>{saving ? 'Saving Changes...' : 'Save Store & Delivery Settings'}</span>
        </button>
      </div>
    </form>
  );
}