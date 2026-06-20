"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

export interface PaintCanvasRef {
  getBase64: () => string;
}

interface PaintCanvasProps {
  brushColor: string;
  brushSize: number;
  brushOpacity?: number; // 0 to 1
  activeTool: 'paint' | 'move' | 'eraser';
  isDrawingEnabled: boolean;
  isShapeLocked?: boolean;
  initialImageData?: string; // For Seeker mode
  showDecorations?: boolean;
  showShadow?: boolean;
  posePath?: string;
  rotation?: number;
}

const PaintCanvas = forwardRef<PaintCanvasRef, PaintCanvasProps>(({ 
  brushColor, 
  brushSize, 
  brushOpacity = 1,
  activeTool,
  isDrawingEnabled,
  isShapeLocked = true,
  initialImageData,
  showDecorations = false, // disabled by default for dynamic poses
  showShadow = true,
  posePath,
  rotation = 0
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // SVG Mask data URL for the cat silhouette
  const activePosePath = posePath || 'M 80 70 Q 95 60 90 40 Q 85 20 75 35 Q 70 45 75 60 Z M 30 80 Q 50 85 70 80 L 75 50 Q 50 40 25 50 Z';
  const catSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g transform="rotate(0, 50, 50)"><path d="${activePosePath}" /></g></svg>`;
  const catMaskUrl = `data:image/svg+xml,${encodeURIComponent(catSvgString)}`;

  useImperativeHandle(ref, () => ({
    getBase64: () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL('image/png');
      }
      return '';
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual canvas size (internal resolution)
    canvas.width = 250;
    canvas.height = 250;

    // Draw initial state
    if (!initialImageData) {
      // Clear the canvas to be fully transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the base cat silhouette as the starting stencil
      const p = new Path2D(activePosePath);
      ctx.fillStyle = '#ffffff';
      // Scale from 100x100 viewBox to 250x250 canvas
      ctx.scale(2.5, 2.5);
      ctx.fill(p);
      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      // Draw initial image data if in Seeker mode
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = initialImageData;
    }
  }, [initialImageData]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    // offsetX/offsetY perfectly handles CSS 3D transforms because they are computed relative to the element's layout box!
    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;
    
    // Map CSS layout pixels to internal canvas rendering resolution
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    
    return {
      x: offsetX * scaleX,
      y: offsetY * scaleY
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Prevent default pointer behavior like scrolling while drawing
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    const { x, y } = getCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath(); // Reset path so next line doesn't connect
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled || !isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.globalAlpha = brushOpacity;
      ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
      
      ctx.lineTo(x, y);
      ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Reset after stroke
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  return (
    <div 
      className={`relative w-full h-full ${showShadow ? 'drop-shadow-2xl' : ''}`}
      style={isShapeLocked ? {
        maskImage: `url('${catMaskUrl}')`,
        WebkitMaskImage: `url('${catMaskUrl}')`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat'
      } : {}}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerUp={stopDrawing}
        onPointerOut={stopDrawing}
        onPointerMove={draw}
        className={`w-full h-full touch-none ${isDrawingEnabled ? 'cursor-crosshair' : 'cursor-pointer'}`}
      />
      
      {/* Decorative lines (eyes, ears) drawn OVER the canvas */}
      {showDecorations && (
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
          <g style={{ opacity: 0.6 }}>
            <path d="M 15 25 L 20 10 L 30 20 M 45 25 L 40 10 L 30 20" fill="none" stroke="#000" strokeWidth="2" />
            <circle cx="22" cy="35" r="2" fill="#000" />
            <circle cx="38" cy="35" r="2" fill="#000" />
          </g>
        </svg>
      )}
    </div>
  );
});

PaintCanvas.displayName = 'PaintCanvas';

export default PaintCanvas;
