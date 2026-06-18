"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

export interface PaintCanvasRef {
  getBase64: () => string;
}

interface PaintCanvasProps {
  brushColor: string;
  brushSize: number;
  isDrawingEnabled: boolean;
  initialImageData?: string; // For Seeker mode
  showDecorations?: boolean;
  showShadow?: boolean;
  posePath?: string;
  rotation?: number;
}

const PaintCanvas = forwardRef<PaintCanvasRef, PaintCanvasProps>(({ 
  brushColor, 
  brushSize, 
  isDrawingEnabled, 
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

    // Fill with white initially if in Hider mode
    if (!initialImageData) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { x, y } = getCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath(); // Reset path so next line doesn't connect
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled || !isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  return (
    <div 
      className={`relative w-full h-full ${showShadow ? 'drop-shadow-2xl' : ''}`}
      style={{
        maskImage: `url('${catMaskUrl}')`,
        WebkitMaskImage: `url('${catMaskUrl}')`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat'
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className={`w-full h-full ${isDrawingEnabled ? 'cursor-crosshair' : 'cursor-pointer'}`}
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
