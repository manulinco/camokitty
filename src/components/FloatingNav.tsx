"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingNav() {
  const pathname = usePathname();

  // If we are on a specific challenge page, we might want to highlight "SEEK"
  const isSeekActive = pathname === '/' || pathname.startsWith('/challenge');
  const isHideActive = pathname === '/create';
  const isRankActive = pathname === '/leaderboard';

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        
        <Link 
          href="/" 
          className={`px-6 py-2.5 rounded-full text-sm font-black tracking-widest transition-all duration-300 ${
            isSeekActive 
              ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          🔍 SEEK
        </Link>

        <Link 
          href="/create" 
          className={`px-6 py-2.5 rounded-full text-sm font-black tracking-widest transition-all duration-300 ${
            isHideActive 
              ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          🎨 HIDE
        </Link>

        <Link 
          href="/leaderboard" 
          className={`px-6 py-2.5 rounded-full text-sm font-black tracking-widest transition-all duration-300 ${
            isRankActive 
              ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          🏆 RANK
        </Link>

      </div>
    </div>
  );
}
