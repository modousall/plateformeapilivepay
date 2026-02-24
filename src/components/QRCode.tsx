'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 200, className }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code-like pattern generator
    // In production, use a proper QR code library like 'qrcode'
    const cellCount = 25;
    const cellSize = size / cellCount;
    const padding = cellSize * 2;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);

    // Generate pattern based on value hash
    const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinderPattern(1, 1);
    drawFinderPattern(cellCount - 8, 1);
    drawFinderPattern(1, cellCount - 8);

    // Draw random-like pattern based on hash
    for (let row = 0; row < cellCount; row++) {
      for (let col = 0; col < cellCount; col++) {
        // Skip finder pattern areas
        if ((row < 9 && col < 9) || 
            (row < 9 && col > cellCount - 10) || 
            (row > cellCount - 10 && col < 9)) {
          continue;
        }

        const cellHash = (hash * (row + 1) * (col + 1)) % 100;
        if (cellHash > 50) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(
            col * cellSize + padding / 2,
            row * cellSize + padding / 2,
            cellSize - padding,
            cellSize - padding
          );
        }
      }
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
