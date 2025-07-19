import { MousePoint, TimingAnalysis, MouseAnalysis, CaptchaResult } from '../types/captcha';

export const analyzeResponseTiming = (
  startTime: number,
  endTime: number,
  questionComplexity: number
): TimingAnalysis => {
  const responseTime = endTime - startTime;
  const expectedMinTime = questionComplexity * 1000; // minimum expected time
  const expectedMaxTime = questionComplexity * 8000; // maximum reasonable time
  
  // Human typing speed is typically 200-300ms per character
  const typingSpeed = responseTime / 3; // average answer length
  
  return {
    responseTime,
    thinkingTime: responseTime > expectedMinTime ? responseTime - expectedMinTime : 0,
    typingSpeed,
    isNaturalTiming: responseTime >= expectedMinTime && responseTime <= expectedMaxTime
  };
};

export const analyzeMouseMovement = (
  points: MousePoint[],
  targetShape: 'circle' | 'square' | 'triangle'
): MouseAnalysis => {
  if (points.length < 10) {
    return {
      smoothness: 0,
      naturalMovement: false,
      drawingAccuracy: 0,
      speedVariation: 0
    };
  }

  // Calculate smoothness (how jerky the movement is)
  let totalAngleChange = 0;
  let speeds: number[] = [];
  
  for (let i = 2; i < points.length; i++) {
    const p1 = points[i - 2];
    const p2 = points[i - 1];
    const p3 = points[i];
    
    // Calculate angles
    const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    const angleChange = Math.abs(angle2 - angle1);
    totalAngleChange += angleChange;
    
    // Calculate speed
    const distance = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));
    const timeDiff = p3.timestamp - p2.timestamp;
    if (timeDiff > 0) {
      speeds.push(distance / timeDiff);
    }
  }
  
  const smoothness = Math.max(0, 100 - (totalAngleChange / points.length) * 10);
  
  // Calculate speed variation (humans have natural speed variations)
  const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
  const speedVariation = speeds.reduce((sum, speed) => sum + Math.abs(speed - avgSpeed), 0) / speeds.length;
  
  // Simple shape accuracy check
  const drawingAccuracy = calculateShapeAccuracy(points, targetShape);
  
  return {
    smoothness,
    naturalMovement: smoothness > 30 && speedVariation > 0.5,
    drawingAccuracy,
    speedVariation
  };
};

const calculateShapeAccuracy = (points: MousePoint[], shape: string): number => {
  if (points.length < 10) return 0;
  
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  
  switch (shape) {
    case 'circle':
      return calculateCircleAccuracy(points, centerX, centerY);
    case 'square':
      return calculateSquareAccuracy(points, centerX, centerY);
    case 'triangle':
      return calculateTriangleAccuracy(points, centerX, centerY);
    default:
      return 0;
  }
};

const calculateCircleAccuracy = (points: MousePoint[], centerX: number, centerY: number): number => {
  const distances = points.map(p => 
    Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
  );
  const avgRadius = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgRadius, 2), 0) / distances.length;
  
  return Math.max(0, 100 - variance / 10);
};

const calculateSquareAccuracy = (points: MousePoint[], centerX: number, centerY: number): number => {
  // Simplified square detection - check if points form roughly rectangular pattern
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));
  
  const width = maxX - minX;
  const height = maxY - minY;
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  
  return aspectRatio * 100;
};

const calculateTriangleAccuracy = (points: MousePoint[], centerX: number, centerY: number): number => {
  // Simplified triangle detection
  const angles = [];
  for (let i = 0; i < points.length; i += Math.floor(points.length / 3)) {
    if (i + 1 < points.length) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const angle = Math.atan2(p2.y - centerY, p2.x - centerX);
      angles.push(angle);
    }
  }
  
  return angles.length >= 3 ? 70 : 30;
};

export const generateHumanScore = (
  timingAnalysis: TimingAnalysis,
  mouseAnalysis: MouseAnalysis
): CaptchaResult => {
  const reasons: string[] = [];
  let confidence = 0;
  
  // Timing analysis (40% weight)
  if (timingAnalysis.isNaturalTiming) {
    confidence += 40;
    reasons.push("Natural response timing");
  } else if (timingAnalysis.responseTime < 500) {
    reasons.push("Response too fast for human");
  } else if (timingAnalysis.responseTime > 30000) {
    reasons.push("Response too slow");
  }
  
  // Mouse movement analysis (60% weight)
  if (mouseAnalysis.naturalMovement) {
    confidence += 30;
    reasons.push("Natural mouse movement detected");
  }
  
  if (mouseAnalysis.smoothness > 50) {
    confidence += 15;
    reasons.push("Smooth drawing pattern");
  }
  
  if (mouseAnalysis.speedVariation > 0.5) {
    confidence += 10;
    reasons.push("Human-like speed variation");
  }
  
  if (mouseAnalysis.drawingAccuracy > 60) {
    confidence += 5;
    reasons.push("Good shape accuracy");
  }
  
  const isHuman = confidence >= 70;
  
  return {
    isHuman,
    confidence,
    reasons
  };
};