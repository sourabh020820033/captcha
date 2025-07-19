import React from 'react';
import { Shield, User, Bot, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { CaptchaResult, TimingAnalysis, MouseAnalysis } from '../types/captcha';

interface CaptchaResultsProps {
  result: CaptchaResult;
  timingAnalysis?: TimingAnalysis;
  mouseAnalysis?: MouseAnalysis;
  isCorrectAnswer?: boolean;
}

export const CaptchaResults: React.FC<CaptchaResultsProps> = ({
  result,
  timingAnalysis,
  mouseAnalysis,
  isCorrectAnswer
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBackground = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100';
    if (confidence >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getConfidenceBackground(result.confidence)} mb-4`}>
          {result.isHuman ? (
            <User className={`w-8 h-8 ${getConfidenceColor(result.confidence)}`} />
          ) : (
            <Bot className={`w-8 h-8 ${getConfidenceColor(result.confidence)}`} />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {result.isHuman ? 'Human Detected' : 'Bot Suspected'}
        </h2>
        
        <div className={`text-3xl font-bold ${getConfidenceColor(result.confidence)}`}>
          {result.confidence}% Confidence
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {timingAnalysis && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Timing Analysis
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Response Time:</span>
                <span className="font-medium">{(timingAnalysis.responseTime / 1000).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span>Natural Timing:</span>
                <span className={timingAnalysis.isNaturalTiming ? 'text-green-600' : 'text-red-600'}>
                  {timingAnalysis.isNaturalTiming ? 'Yes' : 'No'}
                </span>
              </div>
              {isCorrectAnswer !== undefined && (
                <div className="flex justify-between">
                  <span>Correct Answer:</span>
                  <span className={isCorrectAnswer ? 'text-green-600' : 'text-red-600'}>
                    {isCorrectAnswer ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {mouseAnalysis && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Mouse Analysis
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Smoothness:</span>
                <span className="font-medium">{mouseAnalysis.smoothness.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Natural Movement:</span>
                <span className={mouseAnalysis.naturalMovement ? 'text-green-600' : 'text-red-600'}>
                  {mouseAnalysis.naturalMovement ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Drawing Accuracy:</span>
                <span className="font-medium">{mouseAnalysis.drawingAccuracy.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Analysis Details</h3>
        <div className="space-y-2">
          {result.reasons.map((reason, index) => (
            <div key={index} className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-gray-700">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-6 p-4 rounded-lg border-l-4 ${
        result.isHuman 
          ? 'bg-green-50 border-green-400' 
          : 'bg-red-50 border-red-400'
      }`}>
        <div className="flex items-center">
          {result.isHuman ? (
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          )}
          <div>
            <p className={`font-medium ${result.isHuman ? 'text-green-800' : 'text-red-800'}`}>
              {result.isHuman 
                ? 'Verification Successful' 
                : 'Verification Failed'
              }
            </p>
            <p className={`text-sm ${result.isHuman ? 'text-green-700' : 'text-red-700'}`}>
              {result.isHuman 
                ? 'Human behavior patterns detected successfully.' 
                : 'Suspicious bot-like behavior detected.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};