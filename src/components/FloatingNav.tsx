"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function FloatingNav() {
  return (
    <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
      <Link 
        href="/" 
        className="flex items-center gap-3 bg-black/60 backdrop-blur-xl pl-2 pr-4 py-2 rounded-full border border-white/10 shadow-[0_5px_20px_rgba(0,0,0,0.5)] hover:bg-black/80 hover:scale-105 transition-all duration-300 group"
      >
        <div className="w-8 h-8 relative rounded-full overflow-hidden border border-fuchsia-500/30 group-hover:border-fuchsia-500 transition-colors">
          <Image src="/logo.png" alt="Camo Kitty" fill className="object-cover" />
        </div>
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 tracking-widest text-sm">
          CAMO KITTY
        </span>
      </Link>
    </div>
  );
}
