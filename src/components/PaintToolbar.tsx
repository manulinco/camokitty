"use client";

import React from 'react';
import { Pipette, Brush, Eraser, Check, Move } from 'lucide-react';

interface PaintToolbarProps {
  brushColor: string;
  setBrushColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  brushOpacity?: number;
  setBrushOpacity?: (o: number) => void;
  isShapeLocked?: boolean;
  setIsShapeLocked?: (l: boolean) => void;
  activeTool: 'paint' | 'move' | 'eraser';
  setActiveTool: (tool: 'paint' | 'move' | 'eraser') => void;
  rotation: number;
  setRotation: (r: number) => void;
  rotationX: number;
  setRotationX: (r: number) => void;
  rotationY: number;
  setRotationY: (r: number) => void;
  scale: number;
  setScale: (s: number) => void;
  onSubmit: () => void;
  onRandomizeLevel?: () => void;
}

export default function PaintToolbar({ 
  brushColor, setBrushColor, 
  brushSize, setBrushSize, 
  brushOpacity = 1, setBrushOpacity,
  isShapeLocked = true, setIsShapeLocked,
  activeTool, setActiveTool, 
  rotation, setRotation, 
  rotationX, setRotationX,
  rotationY, setRotationY,
  scale, setScale,
  onSubmit, onRandomizeLevel
}: PaintToolbarProps) {
  const predefinedColors = [
    '#ffffff', '#000000', '#5c3a21', '#8b4513', '#d2691e', 
    '#cd853f', '#f4a460', '#ff8c00', '#228b22', '#006400',
    '#696969', '#a9a9a9', '#c0c0c0', '#4ecca3', '#ff4b4b'
  ];

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6">
      
      {/* Tools Section */}
      <div className="flex flex-col gap-3">
        <div className="text-slate-400 font-semibold text-xs tracking-wider">TOOLS</div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setActiveTool('move')}
            className={`p-3 rounded-xl transition-colors ${activeTool === 'move' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
            title="Move Cat"
          >
            <Move size={24} />
          </button>
          <button 
            onClick={() => setActiveTool('paint')}
            className={`p-3 rounded-xl transition-colors ${activeTool === 'paint' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
            title="Paint Brush"
          >
            <Brush size={24} />
          </button>
          <button 
            onClick={() => {
              setActiveTool('eraser');
              setBrushColor('#ffffff'); 
            }}
            className={`p-3 rounded-xl transition-colors ${activeTool === 'eraser' ? 'bg-white/20 text-white border border-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
            title="Eraser"
          >
            <Eraser size={24} />
          </button>
          <button 
            onClick={() => setIsShapeLocked && setIsShapeLocked(!isShapeLocked)}
            className={`p-3 rounded-xl transition-colors ${isShapeLocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500' : 'bg-green-500/20 text-green-400 border border-green-500'}`}
            title="Toggle Shape Lock"
          >
            {isShapeLocked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
            )}
          </button>
          
          <div className="relative overflow-hidden rounded-xl border border-white/10 w-12 h-12 flex-shrink-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgDwEg1gBGJpeT7QY4BwaECDDXjB2gwQICRYcAoGjCMBgKjAQEAAAAP//4Q7P7QAAAAAElFTkSuQmCC')]">
            <input 
              type="color" 
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <button className="p-3 bg-white/5 text-slate-400 border border-white/10 rounded-xl hover:bg-white/10 transition-colors w-full h-full flex items-center justify-center">
              <Pipette size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Brush Settings Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400 font-semibold tracking-wider"><span>BRUSH SIZE</span><span>{brushSize}px</span></div>
          <input 
            type="range" 
            min="2" 
            max="50" 
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none outline-none slider-thumb bg-slate-700 cursor-pointer mt-1"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400 font-semibold tracking-wider"><span>OPACITY</span><span>{Math.round(brushOpacity * 100)}%</span></div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={brushOpacity}
            onChange={(e) => setBrushOpacity && setBrushOpacity(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none outline-none slider-thumb bg-slate-700 cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* Transform Section */}
      <div className="flex flex-col gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
        <div className="text-fuchsia-400 font-black text-xs tracking-widest">3D TRANSFORM</div>
        
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400"><span>ROTATE Z (SPIN)</span><span>{rotation}°</span></div>
          <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full h-1.5 rounded-full appearance-none outline-none slider-thumb bg-slate-700 cursor-pointer" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400"><span>ROTATE X (PITCH)</span><span>{rotationX}°</span></div>
          <input type="range" min="-80" max="80" value={rotationX} onChange={(e) => setRotationX(parseInt(e.target.value))} className="w-full h-1.5 rounded-full appearance-none outline-none slider-thumb bg-slate-700 cursor-pointer" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400"><span>ROTATE Y (YAW)</span><span>{rotationY}°</span></div>
          <input type="range" min="-180" max="180" value={rotationY} onChange={(e) => setRotationY(parseInt(e.target.value))} className="w-full h-1.5 rounded-full appearance-none outline-none slider-thumb bg-slate-700 cursor-pointer" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400"><span>SCALE (SIZE)</span><span>{scale.toFixed(1)}x</span></div>
          <input type="range" min="0.5" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full h-1.5 rounded-full appearance-none outline-none slider-thumb bg-slate-700 cursor-pointer" />
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="flex flex-col gap-3">
        <div className="text-slate-400 font-semibold text-xs tracking-wider">SWATCHES</div>
        <div className="flex flex-wrap gap-2">
          {predefinedColors.map(color => (
            <button
              key={color}
              onClick={() => setBrushColor(color)}
              className={`w-8 h-8 rounded-full border-2 ${brushColor === color ? 'border-white scale-110' : 'border-black/50'} shadow-sm transition-transform`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Action Row */}
      <div className="mt-auto pt-4 flex flex-col gap-4 border-t border-white/10">
        <p className="text-slate-500 text-xs hidden md:block">
          Tip: Draw patterns that match the background texture to break the silhouette!
        </p>
        <button 
          onClick={onRandomizeLevel}
          className="bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500 px-6 py-2 rounded-xl font-bold hover:bg-fuchsia-500 hover:text-white transition-colors"
        >
          Change Background
        </button>
        <button 
          onClick={onSubmit}
          className="bg-cyan-500 text-black px-6 py-3 rounded-full font-black text-lg hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Submit Hide
        </button>
      </div>
      
    </div>
  );
}
