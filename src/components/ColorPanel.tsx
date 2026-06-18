"use client";

import React from 'react';
import { hsbToHslStr } from './CatSvg';

type ColorPanelProps = {
  activePart: string;
  colors: Record<string, { h: number; s: number; b: number }>;
  onPartSelect: (part: string) => void;
  onColorChange: (part: string, color: { h: number; s: number; b: number }) => void;
  onSubmit: () => void;
};

export default function ColorPanel({ activePart, colors, onPartSelect, onColorChange, onSubmit }: ColorPanelProps) {
  const parts = [
    { id: 'head', label: 'Head' },
    { id: 'body', label: 'Body' },
    { id: 'tail', label: 'Tail' }
  ];

  const currentHsb = colors[activePart];

  // Derive pure hue background for saturation/brightness sliders
  const pureHueStr = hsbToHslStr(currentHsb.h, 100, 100);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onColorChange(activePart, { ...currentHsb, [name]: parseInt(value) });
  };

  return (
    <div className="h-[220px] bg-slate-900/95 backdrop-blur-xl rounded-b-2xl p-6 flex flex-col md:flex-row gap-8 border-t border-white/10">
      
      {/* Zone Selector */}
      <div className="flex-1 flex flex-col gap-3">
        {parts.map((p) => {
          const isActive = activePart === p.id;
          const bgHsl = hsbToHslStr(colors[p.id].h, colors[p.id].s, colors[p.id].b);
          
          return (
            <button 
              key={p.id}
              onClick={() => onPartSelect(p.id)}
              className={`p-3 rounded-xl flex justify-between items-center transition-all ${
                isActive ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
              } border`}
            >
              <span className="font-semibold">{p.label}</span>
              <div 
                className="w-6 h-6 rounded-full border-2 border-white/50 shadow-sm"
                style={{ backgroundColor: bgHsl }}
              />
            </button>
          );
        })}
      </div>

      {/* HSB Sliders */}
      <div className="flex-[2] flex flex-col justify-center gap-5">
        
        {/* Hue Slider */}
        <div className="flex items-center gap-4">
          <label className="w-5 font-black text-slate-500">H</label>
          <input 
            type="range" name="h" min="0" max="360" 
            value={currentHsb.h} onChange={handleSliderChange}
            className="flex-1 h-2 rounded-full appearance-none outline-none slider-thumb cursor-pointer"
            style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
          />
        </div>

        {/* Saturation Slider */}
        <div className="flex items-center gap-4">
          <label className="w-5 font-black text-slate-500">S</label>
          <input 
            type="range" name="s" min="0" max="100" 
            value={currentHsb.s} onChange={handleSliderChange}
            className="flex-1 h-2 rounded-full appearance-none outline-none slider-thumb cursor-pointer"
            style={{ background: `linear-gradient(to right, #888, ${pureHueStr})` }}
          />
        </div>

        {/* Brightness Slider */}
        <div className="flex items-center gap-4">
          <label className="w-5 font-black text-slate-500">B</label>
          <input 
            type="range" name="b" min="0" max="100" 
            value={currentHsb.b} onChange={handleSliderChange}
            className="flex-1 h-2 rounded-full appearance-none outline-none slider-thumb cursor-pointer"
            style={{ background: `linear-gradient(to right, #000, ${pureHueStr})` }}
          />
        </div>

      </div>

      {/* Actions */}
      <div className="flex-1 flex items-center justify-end">
        <button 
          onClick={onSubmit}
          className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 px-8 py-4 rounded-full font-black text-lg hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(52,211,153,0.3)] transition-all"
        >
          Check Camo
        </button>
      </div>
      
    </div>
  );
}
