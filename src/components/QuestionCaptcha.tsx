import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { QuestionData, TimingAnalysis } from '../types/captcha';
import { generateRandomQuestion } from '../utils/captchaQuestions';
import { analyzeResponseTiming } from '../utils/humanDetection';

interface QuestionCaptchaProps {
  onComplete: (analysis: TimingAnalysis, isCorrect: boolean) => void;
}

export const QuestionCaptcha: React.FC<QuestionCaptchaProps> = ({ onComplete }) => {
  const [question, setQuestion] = useState<QuestionData>(generateRandomQuestion());
  const [answer, setAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleSubmit = () => {
    if (!answer.trim()) return;

    const endTime = Date.now();
    const isCorrect = answer.toLowerCase().trim() === question.answer.toLowerCase();
    const complexity = question.type === 'math' ? 2 : question.type === 'logic' ? 3 : 1;
    const analysis = analyzeResponseTiming(startTime, endTime, complexity);

    setIsSubmitted(true);
    onComplete(analysis, isCorrect);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getNewQuestion = () => {
    setQuestion(generateRandomQuestion());
    setAnswer('');
    setStartTime(Date.now());
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Question Verification</h3>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {(timeElapsed / 1000).toFixed(1)}s
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 mb-4 text-lg">{question.question}</p>
        
        <div className="relative">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer..."
            disabled={isSubmitted}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || isSubmitted}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {isSubmitted ? 'Submitted' : 'Submit Answer'}
        </button>
        
        <button
          onClick={getNewQuestion}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          title="Get new question"
        >
          ↻
        </button>
      </div>

      {isSubmitted && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Response submitted for analysis
          </div>
        </div>
      )}
    </div>
  );
};