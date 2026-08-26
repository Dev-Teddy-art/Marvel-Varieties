// components/canvas/ProductCanvas.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export function ProductCanvas() {
  return (
    <div className="relative w-full h-full min-h-[260px] flex items-center justify-center">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 via-[#142752]/40 to-transparent rounded-3xl blur-2xl -z-10" />

      {/* Floating Interactive Product Card */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="relative w-64 sm:w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 shadow-2xl text-white space-y-3"
      >
        <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900/50 border border-white/10">
          <Image
            src="/MARVEL VARIETIES.png"
            alt="Marvel Varieties Showcase"
            fill
            className="object-contain p-3"
            priority
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider flex items-center gap-1">
              <Sparkles size={11} /> Verified Hub
            </span>
            <h4 className="text-xs font-bold text-white">Marvel Varieties</h4>
          </div>
          <span className="text-[10px] bg-[#D4AF37] text-[#0B1B3D] font-extrabold px-2 py-0.5 rounded-full">
            Direct Dispatch
          </span>
        </div>
      </motion.div>
    </div>
  );
}