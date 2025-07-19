export interface MousePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface QuestionData {
  question: string;
  answer: string;
  type: 'math' | 'logic' | 'visual';
}

export interface DrawingData {
  points: MousePoint[];
  startTime: number;
  endTime: number;
  shape: 'circle' | 'square' | 'triangle';
}

export interface CaptchaResult {
  isHuman: boolean;
  confidence: number;
  reasons: string[];
}

export interface TimingAnalysis {
  responseTime: number;
  thinkingTime: number;
  typingSpeed: number;
  isNaturalTiming: boolean;
}

export interface MouseAnalysis {
  smoothness: number;
  naturalMovement: boolean;
  drawingAccuracy: number;
  speedVariation: number;
}