import React, { useState } from 'react';
import { Shield, RotateCcw } from 'lucide-react';
import { QuestionCaptcha } from './components/QuestionCaptcha';
import { DrawingCaptcha } from './components/DrawingCaptcha';
import { CaptchaResults } from './components/CaptchaResults';
import { TimingAnalysis, MouseAnalysis, CaptchaResult } from './types/captcha';
import { generateHumanScore } from './utils/humanDetection';

type CaptchaStep = 'question' | 'drawing' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<CaptchaStep>('question');
  const [timingAnalysis, setTimingAnalysis] = useState<TimingAnalysis | null>(null);
  const [mouseAnalysis, setMouseAnalysis] = useState<MouseAnalysis | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<CaptchaResult | null>(null);

  const handleQuestionComplete = (analysis: TimingAnalysis, isCorrect: boolean) => {
    setTimingAnalysis(analysis);
    setIsCorrectAnswer(isCorrect);
    setCurrentStep('drawing');
  };

  const handleDrawingComplete = (analysis: MouseAnalysis) => {
    setMouseAnalysis(analysis);
    
    // Generate final human score
    if (timingAnalysis) {
      const result = generateHumanScore(timingAnalysis, analysis);
      
      // Factor in correct answer
      if (isCorrectAnswer) {
        result.confidence += 10;
        result.reasons.push("Answered question correctly");
      } else {
        result.confidence = Math.max(0, result.confidence - 20);
        result.reasons.push("Incorrect answer provided");
      }

      // Ensure confidence doesn't exceed 100
      result.confidence = Math.min(100, result.confidence);
      result.isHuman = result.confidence >= 70;

      setFinalResult(result);
      setCurrentStep('results');
    }
  };

  const resetCaptcha = () => {
    setCurrentStep('question');
    setTimingAnalysis(null);
    setMouseAnalysis(null);
    setIsCorrectAnswer(false);
    setFinalResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Advanced Human Detection CAPTCHA
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This intelligent system analyzes response timing, mouse movement patterns, and behavior to distinguish between humans and bots.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'question' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'question' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Question</span>
            </div>
            
            <div className={`w-16 h-1 ${currentStep !== 'question' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'drawing' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'drawing' ? 'bg-blue-600 text-white' : 
                currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Drawing</span>
            </div>
            
            <div className={`w-16 h-1 ${currentStep === 'results' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Results</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {currentStep === 'question' && (
            <div>
              <QuestionCaptcha onComplete={handleQuestionComplete} />
            </div>
          )}

          {currentStep === 'drawing' && (
            <div>
              <DrawingCaptcha onComplete={handleDrawingComplete} />
            </div>
          )}

          {currentStep === 'results' && finalResult && (
            <div>
              <CaptchaResults 
                result={finalResult}
                timingAnalysis={timingAnalysis || undefined}
                mouseAnalysis={mouseAnalysis || undefined}
                isCorrectAnswer={isCorrectAnswer}
              />
              
              <div className="text-center mt-6">
                <button
                  onClick={resetCaptcha}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Question Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Analyzes response time and typing patterns to detect human-like behavior
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Mouse Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Monitors mouse movement patterns, drawing smoothness, and speed variations
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Scoring</h3>
                <p className="text-gray-600 text-sm">
                  Combines all data points to generate a confidence score for human detection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;