'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface OrderCountdownProps {
  createdAt: string | Date;
  status: string;
}

export function OrderCountdown({ createdAt, status }: OrderCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (status !== 'pending_verification') return;

    const orderTime = new Date(createdAt).getTime();
    const expiryTime = orderTime + 5 * 60 * 60 * 1000; // 5-hour payment review window

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [createdAt, status]);

  if (status !== 'pending_verification') return null;

  if (isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-xl text-[11px] font-bold">
        <AlertTriangle size={13} />
        <span>Payment Window Expired (Contact Support)</span>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-xl text-[11px] font-bold">
      <Clock size={13} className="text-amber-600 animate-pulse" />
      <span>
        Complete transfer within:{' '}
        <span className="font-mono text-xs font-black">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </span>
    </div>
  );
}