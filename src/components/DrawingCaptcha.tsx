import React, { useRef, useState, useEffect } from 'react';
import { Palette, RotateCcw, CheckCircle } from 'lucide-react';
import { MousePoint, MouseAnalysis } from '../types/captcha';
import { analyzeMouseMovement } from '../utils/humanDetection';

interface DrawingCaptchaProps {
  onComplete: (analysis: MouseAnalysis) => void;
}

const shapes = ['circle', 'square', 'triangle'] as const;

export const DrawingCaptcha: React.FC<DrawingCaptchaProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePoints, setMousePoints] = useState<MousePoint[]>([]);
  const [currentShape, setCurrentShape] = useState<typeof shapes[number]>(
    shapes[Math.floor(Math.random() * shapes.length)]
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;

    // Draw guidelines
    drawGuidelines(ctx);
  }, [currentShape]);

  const drawGuidelines = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 400, 300);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const centerX = 200;
    const centerY = 150;
    const size = 80;

    switch (currentShape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'square':
        ctx.strokeRect(centerX - size, centerY - size, size * 2, size * 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX - size, centerY + size);
        ctx.lineTo(centerX + size, centerY + size);
        ctx.closePath();
        ctx.stroke();
        break;
    }

    ctx.setLineDash([]);
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isCompleted) return;
    
    setIsDrawing(true);
    const pos = getMousePos(e);
    const point: MousePoint = {
      x: pos.x,
      y: pos.y,
      timestamp: Date.now()
    };
    setMousePoints([point]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isCompleted) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);
    const point: MousePoint = {
      x: pos.x,
      y: pos.y,
      timestamp: Date.now()
    };

    setMousePoints(prev => {
      const newPoints = [...prev, point];
      
      // Draw the line
      if (prev.length > 0) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prev[prev.length - 1].x, prev[prev.length - 1].y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      return newPoints;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    setMousePoints([]);
    setIsCompleted(false);
    setStartTime(Date.now());
    drawGuidelines(ctx);
  };

  const submitDrawing = () => {
    if (mousePoints.length < 10) return;

    const analysis = analyzeMouseMovement(mousePoints, currentShape);
    setIsCompleted(true);
    onComplete(analysis);
  };

  const getNewShape = () => {
    const newShape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentShape(newShape);
    clearCanvas();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Drawing Verification</h3>
        <div className="flex items-center text-sm text-gray-600">
          <Palette className="w-4 h-4 mr-1" />
          Draw a {currentShape}
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-center font-medium">
          Please draw a <span className="font-bold capitalize">{currentShape}</span> following the dotted guideline
        </p>
      </div>

      <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair block"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearCanvas}
          className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          title="Clear canvas"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <button
          onClick={getNewShape}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          title="Get new shape"
        >
          ↻
        </button>
        
        <button
          onClick={submitDrawing}
          disabled={mousePoints.length < 10 || isCompleted}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center"
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </>
          ) : (
            'Submit Drawing'
          )}
        </button>
      </div>

      {isCompleted && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Drawing submitted for analysis
          </div>
        </div>
      )}
    </div>
  );
};