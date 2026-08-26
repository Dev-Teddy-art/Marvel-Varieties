'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerified: (isValid: boolean) => void;
}

export function CaptchaChallenge({ onVerified }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 1;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsCorrect(false);
    onVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);

    if (parseInt(val, 10) === num1 + num2) {
      setIsCorrect(true);
      onVerified(true);
    } else {
      setIsCorrect(false);
      onVerified(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-[#0B1B3D]">
          <ShieldCheck size={16} className="text-[#D4AF37]" /> Human Verification
        </span>
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-[11px] cursor-pointer"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-mono font-black text-sm text-[#0B1B3D] tracking-wider select-none shadow-xs">
          {num1} + {num2} = ?
        </div>
        <input
          type="number"
          required
          placeholder="Answer"
          value={userAnswer}
          onChange={handleInputChange}
          className={`flex-1 bg-white border rounded-xl py-2 px-3 text-xs font-bold focus:outline-none ${
            isCorrect ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 focus:border-[#0B1B3D]'
          }`}
        />
      </div>
      {isCorrect && (
        <p className="text-[11px] font-bold text-emerald-600">✓ Human Verification Confirmed</p>
      )}
    </div>
  );
}