"use client";

import React, { useState, useRef, useEffect } from 'react';
import PaintCanvas, { PaintCanvasRef } from './PaintCanvas';
import PaintToolbar from './PaintToolbar';
import { getRandomLevel } from '@/lib/levels';

export default function GameContainer({ initialBgId }: { initialBgId?: string }) {
  const [isHidden, setIsHidden] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [level, setLevel] = useState<{ bg: any, pose: any, rotation: number } | null>(null);
  
  // Paint & Tool State
  const [activeTool, setActiveTool] = useState<'paint' | 'move' | 'eraser'>('paint');
  const [brushColor, setBrushColor] = useState('#ff00ff');
  const [brushSize, setBrushSize] = useState(15);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [isShapeLocked, setIsShapeLocked] = useState(true);
  
  // Cat Position State (percentages)
  const [pos, setPos] = useState({ left: 50, top: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [scale, setScale] = useState(1);

  // Toolbar drag state
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const toolbarDragOffset = useRef({ x: 0, y: 0 });
  
  const canvasRef = useRef<PaintCanvasRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newLevel = getRandomLevel(initialBgId);
    setLevel(newLevel);
    setRotation(newLevel.rotation);
  }, [initialBgId]);

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
        left: Math.max(10, Math.min(90, leftPct)),
        top: Math.max(10, Math.min(90, topPct))
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleToolbarPointerDown = (e: React.PointerEvent) => {
    setIsDraggingToolbar(true);
    toolbarDragOffset.current = {
      x: e.clientX - toolbarPos.x,
      y: e.clientY - toolbarPos.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleToolbarPointerMove = (e: React.PointerEvent) => {
    if (isDraggingToolbar) {
      setToolbarPos({
        x: e.clientX - toolbarDragOffset.current.x,
        y: e.clientY - toolbarDragOffset.current.y
      });
    }
  };

  const handleToolbarPointerUp = (e: React.PointerEvent) => {
    setIsDraggingToolbar(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const checkSimilarity = async (): Promise<number> => {
    if (!canvasRef.current || !containerRef.current || !level) return 0;
    
    const paintCanvasDataUrl = canvasRef.current.getBase64();
    const paintImg = new Image();
    paintImg.src = paintCanvasDataUrl;
    await new Promise(resolve => { paintImg.onload = resolve; });

    const cWidth = 800;
    const cHeight = 600;
    
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = cWidth;
    bgCanvas.height = cHeight;
    const bgCtx = bgCanvas.getContext('2d');
    if (!bgCtx) return 0;
    
    const bgImg = new Image();
    bgImg.src = level.bg.url;
    await new Promise(resolve => { bgImg.onload = resolve; });
    
    // Draw background cover
    const imgRatio = bgImg.width / bgImg.height;
    const canvasRatio = cWidth / cHeight;
    let sWidth = bgImg.width, sHeight = bgImg.height, sx = 0, sy = 0;
    if (imgRatio > canvasRatio) {
      sWidth = bgImg.height * canvasRatio;
      sx = (bgImg.width - sWidth) / 2;
    } else {
      sHeight = bgImg.width / canvasRatio;
      sy = (bgImg.height - sHeight) / 2;
    }
    bgCtx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, cWidth, cHeight); 
    
    const targetWidth = cWidth * 0.25 * scale;
    const targetHeight = cWidth * 0.25 * scale;
    const centerX = cWidth * (pos.left / 100);
    const centerY = cHeight * (pos.top / 100);
    
    const catCanvas = document.createElement('canvas');
    catCanvas.width = cWidth;
    catCanvas.height = cHeight;
    const catCtx = catCanvas.getContext('2d')!;
    
    catCtx.translate(centerX, centerY);
    catCtx.rotate(rotation * Math.PI / 180);
    catCtx.drawImage(paintImg, -targetWidth/2, -targetHeight/2, targetWidth, targetHeight);
    
    const bgData = bgCtx.getImageData(0, 0, cWidth, cHeight).data;
    const catData = catCtx.getImageData(0, 0, cWidth, cHeight).data;
    
    let totalPaintedPixels = 0;
    let totalSimilarity = 0;
    
    for (let i = 0; i < catData.length; i += 4) {
      const alpha = catData[i + 3];
      if (alpha > 50) { 
        totalPaintedPixels++;
        const r1 = catData[i], g1 = catData[i+1], b1 = catData[i+2];
        const r2 = bgData[i], g2 = bgData[i+1], b2 = bgData[i+2];
        
        const diff = Math.sqrt(Math.pow(r1-r2, 2) + Math.pow(g1-g2, 2) + Math.pow(b1-b2, 2));
        const similarity = 1 - (diff / 441.67);
        totalSimilarity += similarity;
      }
    }
    
    if (totalPaintedPixels < 100) return 0;
    
    return (totalSimilarity / totalPaintedPixels) * 100; 
  };

  const submitHide = async () => {
    if (!canvasRef.current || !level) return;
    
    const simScore = await checkSimilarity();
    if (simScore < 30) {
      alert(`Your camouflage similarity is ${simScore.toFixed(1)}% (below 30%). You can still deploy, but it won't be featured in the global challenge pool until you improve it!`);
    }

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
          rotation,
          rotationX,
          rotationY,
          scale,
          posLeft: pos.left,
          posTop: pos.top,
          simScore
        })
      });
      const data = await res.json() as any;
      if (data.success) {
        setShareId(data.id);
      } else {
        alert(`Failed to save hide: ${data.error || 'Unknown error'}`);
        setIsHidden(false); // Let them try again
      }
    } catch (err: any) {
      console.error("Failed to save hide", err);
      alert(`Network or Server error: ${err.message || 'Check your R2 Bucket or D1 Database'}`);
      setIsHidden(false);
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
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
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
            brushOpacity={brushOpacity}
            activeTool={activeTool}
            isDrawingEnabled={activeTool === 'paint' || activeTool === 'eraser'}
            isShapeLocked={isShapeLocked}
            posePath={level.pose.path}
            rotation={rotation}
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
                {typeof window !== 'undefined' ? `${window.location.origin}/seeker/${level.bg.id}?id=${shareId}` : ''}
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
        <div 
          className={`fixed bottom-0 left-0 w-full md:w-auto md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none flex justify-end transition-transform duration-75 ${isDraggingToolbar ? 'opacity-90' : ''}`}
          style={{ transform: `translate(${toolbarPos.x}px, ${toolbarPos.y}px)` }}
        >
          <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-xl md:rounded-2xl border-t md:border border-fuchsia-500/30 shadow-2xl shadow-fuchsia-900/20 w-full md:w-[320px] max-h-[50vh] md:max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Drag Handle */}
            <div 
              className="w-full flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors touch-none"
              onPointerDown={handleToolbarPointerDown}
              onPointerMove={handleToolbarPointerMove}
              onPointerUp={handleToolbarPointerUp}
              onPointerCancel={handleToolbarPointerUp}
            >
              <div className="w-12 h-1.5 rounded-full bg-slate-600" />
            </div>

            <PaintToolbar 
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              brushOpacity={brushOpacity}
              setBrushOpacity={setBrushOpacity}
              isShapeLocked={isShapeLocked}
              setIsShapeLocked={setIsShapeLocked}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              rotation={rotation}
              setRotation={setRotation}
              rotationX={rotationX}
              setRotationX={setRotationX}
              rotationY={rotationY}
              setRotationY={setRotationY}
              scale={scale}
              setScale={setScale}
              onSubmit={submitHide}
              onRandomizeLevel={() => {
                const newLevel = getRandomLevel();
                setLevel(newLevel);
                setRotation(newLevel.rotation);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
