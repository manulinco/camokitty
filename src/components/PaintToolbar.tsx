"use client";

import React from 'react';
import { Pipette, Brush, Eraser, Check, Move } from 'lucide-react';

interface PaintToolbarProps {
  brushColor: string;
  setBrushColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  activeTool: 'paint' | 'move' | 'eraser';
  setActiveTool: (tool: 'paint' | 'move' | 'eraser') => void;
  rotation: number;
  setRotation: (r: number) => void;
  onSubmit: () => void;
}

export default function PaintToolbar({ brushColor, setBrushColor, brushSize, setBrushSize, activeTool, setActiveTool, rotation, setRotation, onSubmit }: PaintToolbarProps) {
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
          <div className="relative group">
            <input 
              type="color" 
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <button className="p-3 bg-white/5 text-slate-400 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <Pipette size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Brush Size Section */}
      <div className="flex flex-col gap-3">
        <div className="text-slate-400 font-semibold text-xs tracking-wider">BRUSH SIZE: {brushSize}px</div>
        <input 
          type="range" 
          min="2" 
          max="50" 
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none outline-none slider-thumb bg-slate-700 cursor-pointer mt-1"
        />
      </div>

      {/* Rotation Section */}
      <div className="flex flex-col gap-3">
        <div className="text-slate-400 font-semibold text-xs tracking-wider flex justify-between">
          <span>ROTATION</span>
          <span>{rotation}°</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="360" 
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none outline-none slider-thumb bg-slate-700 cursor-pointer mt-1"
        />
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
