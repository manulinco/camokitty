import { BACKGROUNDS } from '@/lib/levels';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24 bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center text-center mb-16 mt-8">
        <div className="w-32 h-32 md:w-48 md:h-48 relative mb-6 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(217,70,239,0.3)]">
          <Image src="/logo.png" alt="Camo Kitty Logo" fill className="object-cover" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-6 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          CAMO KITTY
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light">
          The ultimate next-gen hide and seek challenge. Paint your kitty to blend into stunning 4K environments, then dare your friends to find it.
        </p>
      </div>

      {/* Level Selection Grid */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-fuchsia-400 mb-8 border-b border-white/10 pb-4">
          SELECT A WORLD
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BACKGROUNDS.map((bg) => (
            <div key={bg.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-fuchsia-500/50 transition-colors group">
              <div className="aspect-video relative w-full overflow-hidden">
                {/* Fallback to regular img tag for external urls if they are not configured in next.config.mjs */}
                <img 
                  src={bg.url} 
                  alt={bg.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <h3 className="absolute bottom-3 left-4 text-xl font-bold text-white drop-shadow-md">
                  {bg.name}
                </h3>
              </div>
              
              <div className="p-4 flex gap-3">
                <Link 
                  href={`/hider/${bg.id}`}
                  className="flex-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 py-2.5 rounded-xl font-bold text-center hover:bg-cyan-500 hover:text-black transition-colors"
                >
                  🎨 HIDE
                </Link>
                <Link 
                  href={`/seeker/${bg.id}`}
                  className="flex-1 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 py-2.5 rounded-xl font-bold text-center hover:bg-fuchsia-500 hover:text-black transition-colors"
                >
                  🔍 SEEK
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
