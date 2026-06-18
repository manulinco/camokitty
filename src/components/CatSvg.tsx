"use client";

import React from 'react';

type CatSvgProps = {
  activePart: string;
  colors: Record<string, { h: number; s: number; b: number }>;
  onPartClick: (part: string) => void;
  isHidden: boolean;
};

// HSB to HSL string helper for CSS
export const hsbToHslStr = (h: number, s: number, b: number) => {
  const l = (2 - s / 100) * (b / 2);
  let sl = s * b / (l < 50 ? l * 2 : 200 - l * 2);
  if (isNaN(sl)) sl = 0;
  return `hsl(${h}, ${sl}%, ${l}%)`;
};

export default function CatSvg({ activePart, colors, onPartClick, isHidden }: CatSvgProps) {
  const getStyle = (part: string) => {
    const isActive = activePart === part;
    return {
      fill: hsbToHslStr(colors[part].h, colors[part].s, colors[part].b),
      stroke: isActive && !isHidden ? '#ffffff' : 'rgba(0,0,0,0.2)',
      strokeWidth: isActive && !isHidden ? '4' : '2',
      filter: isActive && !isHidden ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none',
      cursor: isHidden ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      opacity: isHidden ? 0 : 1
    };
  };

  return (
    <div className={`relative w-[250px] h-[250px] transition-all duration-700 ${isHidden ? 'opacity-0 scale-95' : 'opacity-100 scale-100 drop-shadow-2xl'}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
        {/* Tail */}
        <path 
          id="part-tail" 
          onClick={() => !isHidden && onPartClick('tail')}
          style={getStyle('tail')}
          d="M 80 70 Q 95 60 90 40 Q 85 20 75 35 Q 70 45 75 60 Z" 
        />
        {/* Body */}
        <path 
          id="part-body" 
          onClick={() => !isHidden && onPartClick('body')}
          style={getStyle('body')}
          d="M 30 80 Q 50 85 70 80 L 75 50 Q 50 40 25 50 Z" 
        />
        {/* Head */}
        <circle 
          id="part-head" 
          onClick={() => !isHidden && onPartClick('head')}
          style={getStyle('head')}
          cx="30" cy="35" r="20" 
        />
        
        {/* Decorative elements (Ears, eyes) - unpainted */}
        <g style={{ opacity: isHidden ? 0 : 0.6, transition: 'opacity 0.3s' }}>
          <path d="M 15 25 L 20 10 L 30 20 M 45 25 L 40 10 L 30 20" fill="none" stroke="#000" strokeWidth="2" />
          <circle cx="22" cy="35" r="2" fill="#000" />
          <circle cx="38" cy="35" r="2" fill="#000" />
        </g>
      </svg>
    </div>
  );
}
