"use client";

import React, { useState, useRef, useEffect } from 'react';
import PaintCanvas, { PaintCanvasRef } from './PaintCanvas';
import PaintToolbar from './PaintToolbar';
import { getRandomLevel } from '@/lib/levels';

export default function GameContainer() {
  const [isHidden, setIsHidden] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [level, setLevel] = useState<{ bg: any, pose: any, rotation: number } | null>(null);
  
  // Paint & Tool State
  const [activeTool, setActiveTool] = useState<'paint' | 'move' | 'eraser'>('paint');
  const [brushColor, setBrushColor] = useState('#ff00ff');
  const [brushSize, setBrushSize] = useState(15);
  
  // Cat Position State (percentages)
  const [pos, setPos] = useState({ left: 50, top: 50 });
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef = useRef<PaintCanvasRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLevel(getRandomLevel());
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'move' && !isHidden) {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const leftPct = (x / rect.width) * 100;
      const topPct = (y / rect.height) * 100;
      
      setPos({
        left: Math.max(0, Math.min(100, leftPct)),
        top: Math.max(0, Math.min(100, topPct))
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const submitHide = async () => {
    if (!canvasRef.current || !level) return;
    
    // Get the base64 painted image
    const paintData = canvasRef.current.getBase64();
    
    setIsHidden(true);

    try {
      const res = await fetch('/api/hides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paintData, 
          bgId: level.bg.id, 
          poseId: level.pose.id, 
          rotation: level.rotation,
          posLeft: pos.left,
          posTop: pos.top
        })
      });
      const data = await res.json();
      if (data.success) {
        setShareId(data.id);
      }
    } catch (err) {
      console.error("Failed to save hide", err);
    }
  };

  const resetGame = () => {
    setIsHidden(false);
    setShareId(null);
    window.location.reload(); 
  };

  if (!level) return null;

  return (
    <>
      <div className="w-full max-w-4xl flex flex-col mx-auto bg-[#0a0a0a] rounded-2xl shadow-2xl border border-fuchsia-500/20 backdrop-blur-xl relative overflow-hidden">
        
        {/* Scene Area - Fixed aspect ratio relative to width */}
      <div 
        ref={containerRef}
        className="w-full md:flex-1 aspect-[4/3] shrink-0 relative overflow-hidden bg-cover bg-center touch-none"
        style={{ backgroundImage: `url("${level.bg.url}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none" />
        
        {/* Task Prompt */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-2 rounded-full border border-cyan-400/30 backdrop-blur-md z-20 pointer-events-none">
          <span className="font-bold text-white tracking-wide flex gap-2 items-center text-xs md:text-sm whitespace-nowrap">
            <span>Blend into the <span className="text-cyan-400">{level.bg.name}</span></span>
            <span className="text-slate-400">|</span>
            <span className="text-fuchsia-400">Pose: {level.pose.name}</span>
          </span>
        </div>

        {/* Character Container - Draggable */}
        <div 
          className={`absolute z-10 transition-opacity duration-1000 ${isHidden ? 'opacity-0' : 'opacity-100'} ${activeTool === 'move' ? 'cursor-move' : ''}`}
          style={{ 
            left: `${pos.left}%`, 
            top: `${pos.top}%`,
            width: '25%',
            aspectRatio: '1 / 1',
            transform: 'translate(-50%, -50%)',
            touchAction: 'none'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <PaintCanvas 
            ref={canvasRef}
            brushColor={brushColor}
            brushSize={brushSize}
            isDrawingEnabled={activeTool === 'paint' || activeTool === 'eraser'}
            posePath={level.pose.path}
            rotation={level.rotation}
          />
        </div>
      </div>

      {/* Result Overlay */}
      {isHidden && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <h1 className="text-6xl font-black uppercase text-fuchsia-500 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)] mb-4">
            CAMOUFLAGE DEPLOYED!
          </h1>
          <p className="text-cyan-100 text-xl mb-8">
            Your true score is decided by how long humans take to find it!
          </p>
          
          {shareId && (
            <div className="bg-white/10 p-6 rounded-2xl border border-cyan-400/30 mb-8 text-center max-w-md">
              <p className="text-cyan-400 font-bold mb-3 text-xl">Dare Seekers to find you!</p>
              <p className="text-slate-400 text-sm mb-4">Copy this link and send it to your friends:</p>
              <code className="bg-black/50 px-4 py-3 rounded-lg text-fuchsia-300 select-all block text-lg font-mono border border-fuchsia-500/30">
                {typeof window !== 'undefined' ? `${window.location.origin}/challenge/${shareId}` : ''}
              </code>
            </div>
          )}

          <div className="flex gap-4">
            <button 
              onClick={resetGame}
              className="bg-cyan-500 text-black px-8 py-3 rounded-full font-black hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              CREATE ANOTHER
            </button>
            <a 
              href="/"
              className="bg-fuchsia-600 text-white px-8 py-3 rounded-full font-black hover:bg-fuchsia-500 transition-colors shadow-[0_0_15px_rgba(217,70,239,0.5)]"
            >
              BACK TO LOBBY
            </a>
          </div>
        </div>
      )}

      </div>

      {/* Independent Floating Toolbar */}
      {!isHidden && (
        <div className="fixed bottom-0 left-0 w-full md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none flex justify-end">
          <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-xl md:rounded-2xl border-t md:border border-fuchsia-500/30 shadow-2xl shadow-fuchsia-900/20 w-full md:w-[320px] max-h-[50vh] md:max-h-[90vh] overflow-y-auto">
            <PaintToolbar 
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              onSubmit={submitHide}
            />
          </div>
        </div>
      )}
    </>
  );
}
