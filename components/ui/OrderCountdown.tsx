// components/ui/OrderCountdown.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface OrderCountdownProps {
  initialMinutes?: number;
  onExpire?: () => void;
}

export function OrderCountdown({ initialMinutes = 20, onExpire }: OrderCountdownProps) {
  // Store target expiration timestamp in sessionStorage so page refreshes don't reset the timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (typeof window === 'undefined') return initialMinutes * 60;
    
    const savedDeadline = sessionStorage.getItem('mv_payment_deadline');
    const now = Date.now();
    
    if (savedDeadline) {
      const remaining = Math.max(0, Math.floor((parseInt(savedDeadline, 10) - now) / 1000));
      return remaining;
    } else {
      const deadline = now + initialMinutes * 60 * 1000;
      sessionStorage.setItem('mv_payment_deadline', deadline.toString());
      return initialMinutes * 60;
    }
  });

  useEffect(() => {
    if (secondsRemaining <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, onExpire]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isExpired = secondsRemaining === 0;
  const isUrgent = secondsRemaining < 300; // Under 5 mins

  return (
    <div
      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${
        isExpired
          ? 'bg-red-50 border-red-200 text-red-700'
          : isUrgent
          ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
          : 'bg-[#0B1B3D]/5 border-[#0B1B3D]/15 text-[#0B1B3D]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            isExpired
              ? 'bg-red-200 text-red-700'
              : isUrgent
              ? 'bg-amber-200 text-amber-800'
              : 'bg-[#0B1B3D] text-[#D4AF37]'
          }`}
        >
          {isExpired ? <AlertTriangle size={16} /> : <Clock size={16} />}
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider">
            {isExpired ? 'Payment Session Expired' : 'Transfer Verification Timer'}
          </p>
          <p className="text-[10px] text-slate-500">
            {isExpired
              ? 'Your reserved order session has timed out. Please restart checkout.'
              : 'Complete bank transfer and upload receipt before timer elapses.'}
          </p>
        </div>
      </div>

      <div className="text-right pl-3">
        <span
          className={`font-mono text-base sm:text-lg font-black tracking-wider ${
            isExpired ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-[#0B1B3D]'
          }`}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}