import React, { useState, useEffect } from "react";
import { CheckCircle, Brain, BookOpen, Target, Zap, Sparkles } from "lucide-react";
import logoFull from 'figma:asset/28624db62fac154e722120f8f8afb7f175668f82.png';

interface QuizPreloaderProps {
  onComplete: () => void;
}

export function QuizPreloader({ onComplete }: QuizPreloaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: Brain,
      title: "Analyzing Knowledge Base",
      description: "Evaluating your preparation level and learning patterns",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: BookOpen,
      title: "Loading NAB Content",
      description: "Accessing 2000+ curated practice questions and materials",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Target,
      title: "Personalizing Experience",
      description: "Customizing difficulty levels and focus areas for you",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Finalizing Setup",
      description: "Preparing your interactive quiz environment",
      color: "from-amber-500 to-orange-600"
    }
  ];

  useEffect(() => {
    const totalDuration = 4000; // 4 seconds total for better UX
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (totalDuration / 60)); // Update every 60ms
        
        // Update current step based on progress
        const newStep = Math.min(Math.floor((newProgress / 100) * steps.length), steps.length - 1);
        setCurrentStep(newStep);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800); // Longer delay for better transition
          return 100;
        }
        
        return newProgress;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Logo at the top */}
      <div className="pt-12 pb-8 text-center">
        <img 
          src={logoFull} 
          alt="FindMyAIT" 
          className="h-10 w-auto mx-auto"
        />
      </div>

      {/* Loader elements in the middle */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center">
          {/* Current Step Display */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              {React.createElement(steps[currentStep].icon, {
                className: "h-8 w-8 text-white"
              })}
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-neutral-600">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-secondary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-neutral-500">
              <span>Setting up...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Animation at the bottom */}
      <div className="pb-12 flex justify-center">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}