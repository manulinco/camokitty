"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function FloatingNav() {
  return (
    <div className="fixed top-4 left-4 md:top-6 md:left-6 right-4 md:right-auto z-50 flex flex-wrap items-center gap-2 md:gap-4">
      <Link 
        href="/" 
        className="flex items-center gap-3 bg-black/60 backdrop-blur-xl pl-2 pr-4 py-2 rounded-full border border-white/10 shadow-[0_5px_20px_rgba(0,0,0,0.5)] hover:bg-black/80 hover:scale-105 transition-all duration-300 group"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 relative rounded-full overflow-hidden border border-fuchsia-500/30 group-hover:border-fuchsia-500 transition-colors shrink-0">
          <Image src="/logo.png" alt="Camo Kitty" fill className="object-cover" />
        </div>
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 tracking-widest text-xs md:text-sm whitespace-nowrap">
          CAMO KITTY
        </span>
      </Link>

      <div className="flex bg-black/60 backdrop-blur-xl rounded-full border border-white/10 p-1 shadow-[0_5px_20px_rgba(0,0,0,0.5)] overflow-x-auto max-w-full no-scrollbar">
        <Link href="/" className="px-4 py-2 text-xs md:text-sm font-bold text-white hover:text-cyan-400 whitespace-nowrap">PLAY</Link>
        <div className="w-[1px] bg-white/20 my-2"></div>
        <Link href="/create" className="px-4 py-2 text-xs md:text-sm font-bold text-white hover:text-fuchsia-400 whitespace-nowrap">CREATE</Link>
        <div className="w-[1px] bg-white/20 my-2"></div>
        <Link href="/leaderboard" className="px-4 py-2 text-xs md:text-sm font-bold text-white hover:text-yellow-400 whitespace-nowrap">LEADERBOARD</Link>
      </div>
    </div>
  );
}
