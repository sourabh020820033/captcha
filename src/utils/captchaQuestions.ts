import { QuestionData } from '../types/captcha';

export const generateRandomQuestion = (): QuestionData => {
  const questionTypes = [
    // Math questions
    {
      question: "What is 7 + 3?",
      answer: "10",
      type: 'math' as const
    },
    {
      question: "What is 12 - 5?",
      answer: "7",
      type: 'math' as const
    },
    {
      question: "What is 4 × 3?",
      answer: "12",
      type: 'math' as const
    },
    
    // Logic questions
    {
      question: "What color do you get when you mix red and yellow?",
      answer: "orange",
      type: 'logic' as const
    },
    {
      question: "How many days are in a week?",
      answer: "7",
      type: 'logic' as const
    },
    {
      question: "What comes after Tuesday?",
      answer: "wednesday",
      type: 'logic' as const
    },
    
    // Visual questions
    {
      question: "Type the word: HELLO",
      answer: "hello",
      type: 'visual' as const
    },
    {
      question: "What is the first letter of the alphabet?",
      answer: "a",
      type: 'visual' as const
    }
  ];

  return questionTypes[Math.floor(Math.random() * questionTypes.length)];
};