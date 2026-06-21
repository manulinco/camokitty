"use client";

import React, { useState, useEffect, useRef } from 'react';
import PaintCanvas from './PaintCanvas';
import { HideEntry } from '@/lib/db';
import { BACKGROUNDS, POSES } from '@/lib/levels';

export default function SeekerContainer({ challengeId, bgId }: { challengeId?: string, bgId?: string }) {
  const [hideData, setHideData] = useState<HideEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Game State
  const [timeMs, setTimeMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [found, setFound] = useState(false);
  
  // Anti-Spam & Knock Mechanic State
  const [isStunned, setIsStunned] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [knockFeedback, setKnockFeedback] = useState<{x: number, y: number, id: number}[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastHitTimeRef = useRef<number>(0);
  const knockIdCounter = useRef<number>(0);

  useEffect(() => {
    // Fetch hide data: either specific ID or random from global pool/bgId
    let fetchUrl = '/api/hides/random';
    if (challengeId) {
      fetchUrl = `/api/hides?id=${challengeId}`;
    } else if (bgId) {
      fetchUrl = `/api/hides/random?bgId=${bgId}`;
    }
    
    fetch(fetchUrl)
      .then(res => res.json() as any)
      .then(data => {
        if (data.success) {
          setHideData(data.hide);
        } else {
          setError(data.error);
        }
      })
      .catch(err => {
        setError("Failed to connect to the Matrix.");
      });
  }, [challengeId, bgId]);

  const startGame = () => {
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setTimeMs(prev => prev + 10);
    }, 10);
  };

  const handleFound = async () => {
    setFound(true);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await fetch('/api/hides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: hideData?.id || challengeId, timeMs })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent background miss trigger
    if (!isPlaying || found || isStunned) return;

    const now = Date.now();
    let currentHits = hitCount;

    // Reset hits if it's been more than 2 seconds since last hit
    if (now - lastHitTimeRef.current > 2000) {
      currentHits = 0;
    }

    currentHits += 1;
    lastHitTimeRef.current = now;
    setHitCount(currentHits);

    // Add visual knock feedback at cursor location
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newKnock = { x, y, id: knockIdCounter.current++ };
    setKnockFeedback(prev => [...prev, newKnock]);
    
    // Remove the feedback element after animation
    setTimeout(() => {
      setKnockFeedback(prev => prev.filter(k => k.id !== newKnock.id));
    }, 500);

    if (currentHits >= 3) {
      handleFound();
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (!isPlaying || found || isStunned) return;

    // Trigger Stun / Cooldown
    setIsStunned(true);
    
    // Optional: Reset cat hit streak if they miss
    setHitCount(0);
    
    setTimeout(() => {
      setIsStunned(false);
    }, 500);
  };

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#0a0a0a] text-center px-4">
        <h2 className="text-3xl md:text-5xl font-black text-fuchsia-500 mb-6 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          {error === 'No challenges available for this scene yet!' ? 'NO CHALLENGES YET!' : 'CHALLENGE NOT FOUND!'}
        </h2>
        <p className="text-slate-400 mb-8 text-lg max-w-md">
          {error === 'No challenges available for this scene yet!' 
            ? "It looks like nobody has hidden a cat here yet. Be the first to deploy a camouflage!"
            : "The challenge you're looking for doesn't exist or has expired."}
        </p>
        <a 
          href="/create"
          className="bg-cyan-500 text-black px-8 py-4 rounded-full font-black text-xl hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          CREATE MY OWN HIDE
        </a>
      </div>
    );
  }

  if (!hideData) {
    return <div className="text-cyan-400 font-bold text-2xl animate-pulse flex h-screen items-center justify-center">Loading Challenge...</div>;
  }

  const bgUrl = BACKGROUNDS.find(b => b.id === hideData.bgId)?.url || BACKGROUNDS[0].url;
  const posePath = POSES.find(p => p.id === hideData.poseId)?.path || POSES[0].path;
  const rotation = hideData.rotation || 0;
  const rotationX = hideData.rotationX || 0;
  const rotationY = hideData.rotationY || 0;
  const scale = hideData.scale || 1;
  
  // Default to old fixed position if these are missing (for backward compatibility)
  const posLeft = hideData.posLeft !== undefined ? hideData.posLeft : 80; // approximate right-[20%]
  const posTop = hideData.posTop !== undefined ? hideData.posTop : 90; // approximate bottom-[10%]

  return (
    <div className="w-full max-w-4xl flex flex-col mx-auto bg-[#0a0a0a] rounded-2xl shadow-2xl border border-cyan-400/20 backdrop-blur-xl relative overflow-hidden">
      
      {/* Top Scene Area - Acts as the miss detection zone. Exactly aspect ratio matched with Create. */}
      <div 
        className={`w-full aspect-[4/3] shrink-0 relative overflow-hidden bg-cover bg-center transition-transform duration-75 ${isStunned ? 'translate-x-1 -translate-y-1 bg-red-900/20' : ''}`}
        style={{ backgroundImage: `url("${bgUrl}")` }}
        onClick={handleBackgroundClick}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none" />
        
        {/* HUD */}
        <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 bg-black/80 px-4 md:px-8 py-2 md:py-3 rounded-full border border-cyan-400/30 backdrop-blur-md flex items-center gap-4 md:gap-6 z-20">
          <div className="flex items-center gap-2">
            <span className="text-fuchsia-400 text-xs md:text-sm font-black tracking-widest">TIME</span>
            <span className="font-mono text-xl md:text-2xl font-bold text-white w-20">
              {(timeMs / 1000).toFixed(2)}s
            </span>
          </div>
        </div>

        {/* Character Container - Fluidly positioned */}
        <div 
          className={`absolute z-10 transition-all duration-500 ${isStunned ? 'pointer-events-none' : 'cursor-crosshair'}`}
          style={{ 
            left: `${posLeft}%`, 
            top: `${posTop}%`,
            width: '25%',
            aspectRatio: '1 / 1',
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            filter: found ? 'drop-shadow(0 0 20px rgba(34,211,238,0.8))' : 'none'
          }}
          onClick={handleCatClick}
        >
          {isPlaying || found ? (
            <div className="relative">
              <PaintCanvas 
                brushColor="#000"
                brushSize={1}
                isDrawingEnabled={false}
                activeTool="paint"
                initialImageData={hideData.paintData}
                showDecorations={found}
                showShadow={false}
                posePath={posePath}
                rotation={rotation}
              />
              
              {/* Knock Hit Feedback Effects */}
              {!found && knockFeedback.map(knock => (
                <div 
                  key={knock.id}
                  className="absolute pointer-events-none animate-ping opacity-70"
                  style={{ 
                    left: knock.x - 15, 
                    top: knock.y - 15, 
                    width: 30, 
                    height: 30, 
                    borderRadius: '50%', 
                    border: '3px solid #d946ef',
                    boxShadow: '0 0 10px #d946ef'
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Start Overlay */}
        {!isPlaying && !found && (
          <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-black text-white mb-6 tracking-widest">SEEKER CHALLENGE</h2>
            <p className="text-fuchsia-400 mb-8 font-bold text-lg border border-fuchsia-400/20 px-6 py-2 rounded-full bg-fuchsia-400/10">
              Avg Seek Time: {(hideData.averageSeekTime / 1000).toFixed(2)}s | Foiled {hideData.timesPlayed} seekers
            </p>
            <p className="text-slate-400 mb-8 text-center max-w-md">
              Tap the hidden object <strong className="text-cyan-400">3 times rapidly</strong> to break the disguise.<br/>
              Missing adds a <strong className="text-red-400">0.5s stun penalty</strong>!
            </p>
            <button 
              onClick={startGame}
              className="bg-cyan-500 text-black px-12 py-4 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              START SEEKING
            </button>
          </div>
        )}

        {/* Success Overlay */}
        {found && (
          <div className="absolute inset-0 bg-cyan-900/40 z-30 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-8xl font-black text-white drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]">
              SHATTERED!
            </h1>
            <div className="mt-8 text-2xl font-bold bg-black/80 px-8 py-4 rounded-2xl backdrop-blur-md pointer-events-auto text-center border border-cyan-400/30">
              Your Time: <span className="text-fuchsia-400">{(timeMs / 1000).toFixed(2)}s</span>
              <br/>
              <a href="/create" className="inline-block mt-6 px-8 py-3 bg-fuchsia-600 rounded-full text-sm text-white hover:bg-fuchsia-500 transition-all font-bold shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                CREATE MY OWN HIDE
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
