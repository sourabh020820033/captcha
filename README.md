# Advanced Human vs Bot Detection CAPTCHA

A sophisticated CAPTCHA system that combines question-based verification with mouse movement analysis to detect human vs bot behavior.

## Features

- **Question-based CAPTCHA**: Analyzes response timing and typing patterns
- **Drawing Verification**: Tracks mouse movement smoothness and drawing accuracy
- **Real-time Analysis**: Monitors timing, speed variations, and behavioral patterns
- **AI Scoring**: Combines multiple factors for accurate human detection
- **Modern UI**: Beautiful, responsive design with step-by-step progress

## How It Works

1. **Question Analysis**: Users answer simple questions while the system analyzes response timing
2. **Mouse Tracking**: Users draw shapes while the system monitors movement patterns
3. **AI Scoring**: Combines all data points to generate a confidence score

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
```

## Technologies Used

- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Lucide React for icons
- Canvas API for drawing functionality

## Project Structure

```
src/
├── components/          # React components
│   ├── QuestionCaptcha.tsx
│   ├── DrawingCaptcha.tsx
│   └── CaptchaResults.tsx
├── types/              # TypeScript type definitions
│   └── captcha.ts
├── utils/              # Utility functions
│   ├── captchaQuestions.ts
│   └── humanDetection.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Detection Algorithms

The system uses multiple algorithms to detect human behavior:

- **Timing Analysis**: Measures response time and typing patterns
- **Mouse Movement**: Analyzes smoothness, speed variations, and drawing accuracy
- **Behavioral Patterns**: Combines multiple factors for comprehensive scoring

## License

This project is open source and available under the MIT License.