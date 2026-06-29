import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, CheckCircle, XCircle, Clock, Trophy, Target, Mail, MessageSquare, ThumbsUp, ThumbsDown, Lock, Calendar, SkipForward } from "lucide-react";
import logoFull from 'figma:asset/28624db62fac154e722120f8f8afb7f175668f82.png';
import { mockQuizQuestions, QuizQuestion } from "../data/mockQuiz";
import { LocalStorageAuth, QuizSession, DailyQuizProgress } from "../utils/localStorage";
import { toast } from "sonner@2.0.3";

interface DedicatedQuizInterfaceProps {
  onNavigate: (page: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
}

export function DedicatedQuizInterface({ onNavigate, isLoggedIn = false, currentUser }: DedicatedQuizInterfaceProps) {
  // Quiz session state
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyQuizProgress | null>(null);
  const [randomizedQuestions, setRandomizedQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'helpful' | 'not-helpful' | ''>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // All available questions
  const allQuestions: QuizQuestion[] = mockQuizQuestions;
  const maxQuestions = isLoggedIn ? 50 : 5;
  
  // Current question based on session (use daily progress for logged-in users)
  const currentQuestionIndex = isLoggedIn && dailyProgress 
    ? dailyProgress.currentQuestionIndex 
    : (quizSession?.currentQuestionIndex || 0);
  const currentQuestion = randomizedQuestions[currentQuestionIndex];
  const progress = isLoggedIn && dailyProgress
    ? ((dailyProgress.currentQuestionIndex + 1) / maxQuestions) * 100
    : quizSession ? ((quizSession.currentQuestionIndex + 1) / maxQuestions) * 100 : 0;

  // Initialize quiz session on component mount
  useEffect(() => {
    const initializeQuiz = () => {
      try {
        setIsInitializing(true);
        
        // Check guest quiz restrictions FIRST
        if (!isLoggedIn) {
          const canTakeQuiz = LocalStorageAuth.canGuestTakeQuiz();
          if (!canTakeQuiz) {
            console.log('🔒 Guest user has already taken quiz today');
            setShowLockScreen(true);
            setIsInitializing(false);
            return;
          }
        }
        
        // Get all question IDs
        const allQuestionIds = allQuestions.map(q => q.id);
        
        if (isLoggedIn && currentUser) {
          // For logged-in users, use daily progress tracking
          
          // Check if user has reached daily limit
          if (LocalStorageAuth.hasReachedDailyLimit(currentUser.id, maxQuestions)) {
            // Get the latest daily progress with completed data
            const completedProgress = LocalStorageAuth.getTodayQuizProgress(currentUser.id);
            if (completedProgress) {
              setDailyProgress(completedProgress);
              console.log('🔄 Loaded completed quiz data:', {
                correctAnswers: completedProgress.correctAnswers,
                questionsAnswered: completedProgress.questionsAnswered,
                dailyScore: completedProgress.dailyScore,
                timeSpentToday: completedProgress.timeSpentToday
              });
            }
            setQuizComplete(true);
            setIsInitializing(false);
            return;
          }

          // Start or continue daily session
          const dailyProgressData = LocalStorageAuth.startDailyQuizSession(currentUser.id, allQuestionIds, maxQuestions);
          
          // Check if this session is already completed or at the limit
          if (dailyProgressData.completed || dailyProgressData.currentQuestionIndex >= maxQuestions) {
            // If already completed, ensure we have the final calculated scores
            if (dailyProgressData.completed && (dailyProgressData.dailyScore === 0 || !dailyProgressData.timeSpentToday)) {
              // Force refresh the completed data
              const refreshedProgress = LocalStorageAuth.getTodayQuizProgress(currentUser.id);
              if (refreshedProgress) {
                setDailyProgress(refreshedProgress);
                console.log('🔄 Refreshed completed quiz data:', {
                  correctAnswers: refreshedProgress.correctAnswers,
                  questionsAnswered: refreshedProgress.questionsAnswered,
                  dailyScore: refreshedProgress.dailyScore,
                  timeSpentToday: refreshedProgress.timeSpentToday
                });
              } else {
                setDailyProgress(dailyProgressData);
              }
            } else {
              setDailyProgress(dailyProgressData);
            }
            setQuizComplete(true);
            setIsInitializing(false);
            return;
          }
          
          setDailyProgress(dailyProgressData);

          // Create questions array based on daily progress
          const sessionQuestions = dailyProgressData.questionIds.map(id => 
            allQuestions.find(q => q.id === id)
          ).filter(Boolean) as QuizQuestion[];

          // Check if user has already answered the current question
          const currentQuestionId = dailyProgressData.questionIds[dailyProgressData.currentQuestionIndex];
          if (currentQuestionId && dailyProgressData.answers[currentQuestionId]) {
            // User has already answered this question, show the feedback
            setSelectedAnswer(dailyProgressData.answers[currentQuestionId]);
            setSubmittedAnswer(dailyProgressData.answers[currentQuestionId]);
            setShowFeedback(true);
          }

          setRandomizedQuestions(sessionQuestions);

          // Debug logging for daily progress
          console.log('Daily Quiz Progress Initialized:', {
            userId: currentUser.id,
            date: dailyProgressData.date,
            currentStep: dailyProgressData.currentQuestionIndex,
            questionsAnswered: dailyProgressData.questionsAnswered,
            correctAnswers: dailyProgressData.correctAnswers,
            dailyScore: dailyProgressData.dailyScore,
            totalQuestions: sessionQuestions.length
          });

        } else {
          // For non-logged-in users, use traditional session system
          const shuffledIds = [...allQuestionIds];
          for (let i = shuffledIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
          }

          const session: QuizSession = {
            id: 'temp_' + Date.now(),
            userId: 'anonymous',
            questionIds: shuffledIds.slice(0, maxQuestions),
            currentQuestionIndex: 0,
            answers: {},
            correctAnswers: 0,
            startTime: new Date().toISOString(),
            completed: false
          };

          const sessionQuestions = session.questionIds.map(id => 
            allQuestions.find(q => q.id === id)
          ).filter(Boolean) as QuizQuestion[];

          setQuizSession(session);
          setRandomizedQuestions(sessionQuestions);
        }

        setIsInitializing(false);
      } catch (error) {
        console.error('Error initializing quiz:', error);
        setIsInitializing(false);
      }
    };

    initializeQuiz();
  }, [isLoggedIn, currentUser, maxQuestions]);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    setIsLoading(true);
    setSubmittedAnswer(selectedAnswer);
    
    // Check if answer is correct
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isLoggedIn && currentUser && dailyProgress) {
      // Update daily progress for logged-in users
      const updatedProgress = LocalStorageAuth.updateDailyQuizProgress(
        currentUser.id,
        currentQuestion.id,
        selectedAnswer,
        isCorrect,
        false // not skipped
      );
      
      if (updatedProgress) {
        setDailyProgress(updatedProgress);
      }
    } else if (quizSession) {
      // Update session for non-logged-in users
      const updatedSession = {
        ...quizSession,
        answers: {
          ...quizSession.answers,
          [currentQuestion.id]: selectedAnswer
        },
        correctAnswers: isCorrect ? quizSession.correctAnswers + 1 : quizSession.correctAnswers
      };
      setQuizSession(updatedSession);
    }
    
    // Simulate API call delay
    setTimeout(() => {
      setShowFeedback(true);
      setIsLoading(false);
      
      // Auto-scroll to feedback section smoothly after a short delay
      setTimeout(() => {
        const feedbackElement = document.getElementById('quiz-feedback-section');
        if (feedbackElement) {
          feedbackElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }, 500);
  };

  const handleNextQuestion = () => {
    // Scroll to top when moving to next question (smooth scroll)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (isLoggedIn && currentUser && dailyProgress) {
      // Handle next question for logged-in users with daily progress
      const currentIndex = dailyProgress.currentQuestionIndex;
      
      // Check if we're about to complete the quiz (at question 50, index 49)
      if (currentIndex >= maxQuestions - 1) {
        // Complete the quiz and get updated data
        const completed = LocalStorageAuth.completeDailyQuizSession(currentUser.id);
        
        if (completed) {
          // Get the updated progress data with final scores
          const finalProgress = LocalStorageAuth.getTodayQuizProgress(currentUser.id);
          if (finalProgress) {
            setDailyProgress(finalProgress);
          }
        }
        
        setQuizComplete(true);
        return;
      }
      
      const updatedProgress = LocalStorageAuth.nextDailyQuestion(currentUser.id);
      
      if (updatedProgress) {
        setDailyProgress(updatedProgress);
        
        if (updatedProgress.completed || updatedProgress.currentQuestionIndex >= maxQuestions) {
          // Daily session completed
          const completed = LocalStorageAuth.completeDailyQuizSession(currentUser.id);
          
          if (completed) {
            // Get the updated progress data with final scores
            const finalProgress = LocalStorageAuth.getTodayQuizProgress(currentUser.id);
            if (finalProgress) {
              setDailyProgress(finalProgress);
            }
          }
          
          setQuizComplete(true);
        } else {
          // Move to next question
          setSelectedAnswer("");
          setSubmittedAnswer("");
          setShowFeedback(false);
          
          // Check if user has already answered the next question
          const nextQuestionId = updatedProgress.questionIds[updatedProgress.currentQuestionIndex];
          if (nextQuestionId && updatedProgress.answers[nextQuestionId]) {
            setSelectedAnswer(updatedProgress.answers[nextQuestionId]);
            setSubmittedAnswer(updatedProgress.answers[nextQuestionId]);
            setShowFeedback(true);
          }
        }
      }
    } else if (quizSession) {
      // Handle next question for non-logged-in users
      const nextIndex = quizSession.currentQuestionIndex + 1;
      
      if (nextIndex < Math.min(randomizedQuestions.length, maxQuestions)) {
        // Move to next question
        const updatedSession = {
          ...quizSession,
          currentQuestionIndex: nextIndex
        };
        
        setQuizSession(updatedSession);
        setSelectedAnswer("");
        setSubmittedAnswer("");
        setShowFeedback(false);
      } else {
        // Quiz completed or limit reached
        if (!isLoggedIn && quizSession.currentQuestionIndex >= 4) { // 5th question (index 4) completed
          // Record guest quiz attempt
          const score = Math.round((quizSession.correctAnswers / (quizSession.currentQuestionIndex + 1)) * 100);
          LocalStorageAuth.recordGuestQuizAttempt(score, quizSession.currentQuestionIndex + 1);
          console.log('✅ Guest quiz attempt recorded');
          setShowLockScreen(true);
        } else {
          setQuizComplete(true);
        }
      }
    }
  };

  const handleSkipQuestion = () => {
    if (!currentQuestion) return;

    if (isLoggedIn && currentUser && dailyProgress) {
      // Update daily progress for logged-in users (skipped question)
      LocalStorageAuth.updateDailyQuizProgress(
        currentUser.id,
        currentQuestion.id,
        '', // Empty string indicates skipped
        false, // not correct
        true // is skipped
      );
    } else if (quizSession) {
      // Record skip for non-logged-in users
      const updatedSession = {
        ...quizSession,
        answers: {
          ...quizSession.answers,
          [currentQuestion.id]: '' // Empty string indicates skipped
        }
      };
      setQuizSession(updatedSession);
    }

    handleNextQuestion();
  };

  const getTimeTaken = () => {
    if (isLoggedIn && dailyProgress) {
      return dailyProgress.timeSpentToday || 0;
    }
    if (!quizSession) return 0;
    const endTime = new Date();
    const startTime = new Date(quizSession.startTime);
    const diffInMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
    return diffInMinutes;
  };

  const handleEmailReminder = () => {
    if (isLoggedIn && currentUser?.id) {
      // Send quiz reminder through localStorage system
      const reminderSent = LocalStorageAuth.sendQuizReminder(currentUser.id);
      
      if (reminderSent) {
        toast.success('Email reminder set!', {
          description: 'We\'ll remind you to continue your NAB exam preparation tomorrow.',
          duration: 4000,
        });
        console.log('✅ Quiz reminder sent for user:', currentUser.id);
      } else {
        toast.info('Already completed today!', {
          description: 'You\'ve already completed today\'s quiz. We\'ll remind you tomorrow!',
          duration: 4000,
        });
      }
    } else {
      // User not logged in - show info toast
      toast.info('Sign in to set reminders', {
        description: 'Create an account to receive quiz reminders and track your progress.',
        duration: 4000,
      });
    }
  };

  const handleFeedbackSubmit = () => {
    // Validate that a rating was selected
    if (!feedbackRating) {
      toast.error('Please select a rating', {
        description: 'Let us know if the quiz was helpful or needs improvement.',
        duration: 3000,
      });
      return;
    }

    // In a real app, this would send feedback to analytics service
    console.log('Feedback submitted:', { rating: feedbackRating, text: feedbackText });
    
    // Mark feedback as submitted (permanently for this session)
    setFeedbackSubmitted(true);
    
    // Show success toast
    toast.success('Feedback received!', {
      description: 'Thank you for helping us improve the quiz experience.',
      duration: 4000,
    });
  };

  const getScorePercentage = () => {
    if (isLoggedIn && dailyProgress) {
      return dailyProgress.dailyScore || 0;
    }
    if (!quizSession) return 0;
    const totalAnswered = Object.keys(quizSession.answers).length;
    return totalAnswered > 0 ? Math.round((quizSession.correctAnswers / totalAnswered) * 100) : 0;
  };

  const getTotalQuestionsAnswered = () => {
    if (isLoggedIn && dailyProgress) {
      return dailyProgress.questionsAnswered || 0;
    }
    if (!quizSession) return 0;
    return Object.keys(quizSession.answers).length;
  };

  const getCorrectAnswers = () => {
    if (isLoggedIn && dailyProgress) {
      return dailyProgress.correctAnswers || 0;
    }
    if (!quizSession) return 0;
    return quizSession.correctAnswers;
  };

  const getCategoryBadgeColor = (category: string | any[]) => {
    // Extract category name if it's an array of category objects
    const categoryName = Array.isArray(category) 
      ? category.find(cat => cat.primary)?.name || category[0]?.name 
      : category;

    const colors: { [key: string]: string } = {
      "Regulatory Compliance": "bg-blue-100 text-blue-800",
      "Customer Relations": "bg-green-100 text-green-800", 
      "Human Resources": "bg-purple-100 text-purple-800",
      "Financial Management": "bg-yellow-100 text-yellow-800",
      "Operations": "bg-orange-100 text-orange-800",
      "Resident Care": "bg-emerald-100 text-emerald-800",
      "Regulatory": "bg-blue-100 text-blue-800",
      "Staff Management": "bg-purple-100 text-purple-800",
      "Administrative Practices": "bg-indigo-100 text-indigo-800",
      "Quality Assurance": "bg-teal-100 text-teal-800"
    };
    return colors[categoryName] || "bg-gray-100 text-gray-800";
  };

  // Show loading screen while initializing (but not if quiz is already complete or showing lock screen)
  if (!quizComplete && !showLockScreen && (isInitializing || !currentQuestion || (!isLoggedIn && !quizSession) || (isLoggedIn && !dailyProgress))) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Preparing your quiz questions...</p>
        </div>
      </div>
    );
  }

  // Show lock screen for non-logged-in users who reached question limit
  if (showLockScreen) {
    // Get guest quiz stats to determine which message to show
    const guestStats = LocalStorageAuth.getGuestQuizStats();
    const timeRemaining = guestStats.timeUntilNext;
    const hasCompletedQuiz = quizSession && quizSession.currentQuestionIndex >= 4;
    
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Minimal Header */}
        <header className="bg-white border-b border-neutral-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate('home')}
            >
              <img 
                src={logoFull} 
                alt="FindMyAIT" 
                className="h-8 w-auto"
              />
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('quiz')}
              className="text-neutral-600 hover:text-neutral-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quiz Hub
            </Button>
          </div>
        </header>

        {/* Lock Screen Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center">
                {hasCompletedQuiz ? (
                  <Trophy className="h-10 w-10 text-brand-secondary" />
                ) : (
                  <Lock className="h-10 w-10 text-neutral-400" />
                )}
              </div>
            </div>

            {/* Lock Message */}
            <div className="mb-8">
              {hasCompletedQuiz ? (
                <>
                  <h1 className="text-3xl font-semibold text-neutral-900 mb-4">Great Job! Come Back Tomorrow</h1>
                  <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
                    You've completed your daily quiz practice! Your score: <span className="font-semibold text-brand-primary">{getCorrectAnswers()}/5 questions correct ({getScorePercentage()}%)</span>
                  </p>
                  
                  {timeRemaining && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-md mx-auto border border-blue-200">
                      <div className="flex items-center justify-center gap-2 text-blue-800">
                        <Clock className="h-5 w-5" />
                        <p className="font-medium">Next quiz available in:</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 mt-2">
                        {timeRemaining.hours}h {timeRemaining.minutes}m
                      </p>
                    </div>
                  )}
                  
                  <p className="text-neutral-600 mb-4">
                    Want unlimited practice? Create a free account to:
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold text-neutral-900 mb-4">Daily Limit Reached</h1>
                  <p className="text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
                    You've completed today's practice quiz! Come back tomorrow for more questions, or create a free account for unlimited access.
                  </p>
                </>
              )}
              
              <div className="bg-neutral-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <h3 className="font-semibold text-neutral-900 mb-3">With a free account, you get:</h3>
                <ul className="text-left space-y-2 text-neutral-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-brand-secondary mr-2 flex-shrink-0" />
                    Unlimited practice questions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-brand-secondary mr-2 flex-shrink-0" />
                    Progress tracking & analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-brand-secondary mr-2 flex-shrink-0" />
                    Detailed explanations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-brand-secondary mr-2 flex-shrink-0" />
                    Personalized study plans
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3"
              >
                Log In to Continue
              </Button>
              <Button 
                onClick={() => onNavigate('signup')}
                variant="outline" 
                className="w-full sm:w-auto border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-3"
              >
                Create Free Account
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                Your progress: <span className="font-semibold text-brand-primary">{getCorrectAnswers()}/5 questions correct ({getScorePercentage()}%)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete && isLoggedIn) {
    const scorePercentage = getScorePercentage();
    const timeTaken = getTimeTaken();
    
    // Debug logging for completion screen
    console.log('🏁 Quiz Completion Debug:', {
      currentUser: currentUser?.id,
      dailyProgress,
      scorePercentage,
      timeTaken,
      correctAnswers: getCorrectAnswers(),
      totalAnswered: getTotalQuestionsAnswered(),
      dailyProgressValues: dailyProgress ? {
        correctAnswers: dailyProgress.correctAnswers,
        questionsAnswered: dailyProgress.questionsAnswered,
        dailyScore: dailyProgress.dailyScore,
        timeSpentToday: dailyProgress.timeSpentToday,
        completed: dailyProgress.completed
      } : 'No daily progress'
    });
    
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Minimal Header */}
        <header className="bg-white border-b border-neutral-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate('home')}
            >
              <img 
                src={logoFull} 
                alt="FindMyAIT" 
                className="h-8 w-auto"
              />
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('quiz')}
              className="text-neutral-600 hover:text-neutral-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quiz Hub
            </Button>
          </div>
        </header>

        {/* Quiz Completion Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 text-center px-[24px] py-[32px]">
            {/* Completion Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                <Trophy className="h-10 w-10 text-brand-secondary" />
              </div>
            </div>

            {/* Session Summary */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-neutral-900 mb-4">Quiz Complete!</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-brand-primary mb-1 text-[32px]">
                    {getCorrectAnswers()}/{getTotalQuestionsAnswered()}
                  </div>
                  <div className="text-neutral-600 text-sm md:text-base">Questions Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-brand-primary mb-1 text-[32px]">
                    {scorePercentage}%
                  </div>
                  <div className="text-neutral-600 text-sm md:text-base">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-brand-primary mb-1 text-[32px]">
                    {timeTaken}m
                  </div>
                  <div className="text-neutral-600 text-sm md:text-base">Time Taken</div>
                </div>
              </div>
              
              {scorePercentage >= 80 ? (
                <div className="text-lg text-brand-secondary font-medium">Excellent performance! 🎉</div>
              ) : scorePercentage >= 60 ? (
                <div className="text-lg text-blue-600 font-medium">Good job! Keep practicing 📚</div>
              ) : (
                <div className="text-lg text-yellow-600 font-medium">More study needed. You've got this! 💪</div>
              )}
            </div>

            {/* Next Steps - For Logged In Users */}
            <div className="border border-brand-primary/20 rounded-lg mb-6 bg-brand-primary/5 p-[24px]">
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                You've reached your 50 daily questions limit
              </h3>
              <p className="text-neutral-600 mb-4">
                Return tomorrow for a fresh set of practice questions to continue your NAB exam preparation
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2"
                  onClick={handleEmailReminder}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Set Email Reminder
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate('dashboard')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
              </div>
            </div>

            <Button 
              variant="ghost"
              onClick={() => onNavigate('quiz')}
              className="text-neutral-500 hover:text-neutral-700"
            >
              Back to Quiz Hub
            </Button>
          </div>

          {/* Feedback Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-5 w-5 text-brand-primary" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Was this helpful in preparing for your NHA exam?
              </h3>
            </div>
            
            {!feedbackSubmitted ? (
              <div className="space-y-4">
                {/* Rating Selection */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant={feedbackRating === 'helpful' ? 'default' : 'outline'}
                    onClick={() => setFeedbackRating('helpful')}
                    className={`flex items-center justify-center gap-2 w-full sm:w-auto ${
                      feedbackRating === 'helpful' 
                        ? 'bg-brand-secondary hover:bg-brand-secondary-hover text-white' 
                        : 'border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Yes, very helpful
                  </Button>
                  <Button
                    variant={feedbackRating === 'not-helpful' ? 'default' : 'outline'}
                    onClick={() => setFeedbackRating('not-helpful')}
                    className={`flex items-center justify-center gap-2 w-full sm:w-auto ${
                      feedbackRating === 'not-helpful' 
                        ? 'bg-neutral-600 hover:bg-neutral-700 text-white' 
                        : 'border-neutral-300 text-neutral-600 hover:bg-neutral-600 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Could be improved
                  </Button>
                </div>

                {/* Optional Text Feedback */}
                {feedbackRating && (
                  <div className="space-y-3">
                    <Label htmlFor="feedback-text" className="text-sm font-medium text-neutral-700">
                      Any additional feedback? (Optional)
                    </Label>
                    <Textarea
                      id="feedback-text"
                      placeholder={
                        feedbackRating === 'helpful' 
                          ? "What was most helpful about this quiz session?" 
                          : "How could we improve this quiz experience?"
                      }
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                    <Button
                      onClick={handleFeedbackSubmit}
                      disabled={feedbackSubmitted}
                      className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {feedbackSubmitted ? 'Feedback Submitted' : 'Submit Feedback'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-brand-secondary">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Thank you for your feedback! It helps us improve the experience.</span>
              </div>
            )}
          </div>

          {/* Quiz Completion Disclaimer - Outside card */}
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500 leading-relaxed mb-3 max-w-2xl mx-auto">
              This practice quiz is designed for educational purposes and preparation assistance. 
              Questions are based on NAB exam guidelines but are not official exam questions. 
              Results do not guarantee performance on the actual NAB examination.
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <button className="text-brand-primary hover:text-brand-primary-hover transition-colors text-[14px]">
                Terms of Use
              </button>
              <span className="text-neutral-300">•</span>
              <button className="text-brand-primary hover:text-brand-primary-hover transition-colors">
                Privacy Policy
              </button>
              <span className="text-neutral-300">•</span>
              <button className="text-brand-primary hover:text-brand-primary-hover transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Minimal Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            <img 
              src={logoFull} 
              alt="FindMyAIT" 
              className="h-6 lg:h-8 w-auto"
            />
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('quiz')}
            className="text-neutral-600 hover:text-neutral-800 text-sm lg:text-base px-2 lg:px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Exit Quiz</span>
            <span className="sm:hidden">Exit</span>
          </Button>
        </div>
      </header>

      {/* Quiz Progress Section */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0 mb-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
              <div className="text-sm font-medium text-neutral-700">
                Question {currentQuestionIndex + 1} of {maxQuestions}
              </div>
              <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                {isLoggedIn ? (
                  <Badge variant="secondary" className="bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20 text-xs">
                    Daily Practice
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 border-neutral-200 text-xs">
                    Guest Session
                  </Badge>
                )}
                {isLoggedIn && dailyProgress && dailyProgress.questionsAnswered > 0 && (
                  <div className="text-xs text-neutral-500 lg:block">
                    <span className="lg:hidden">Today: </span>
                    <span className="hidden lg:inline">Today: </span>
                    {dailyProgress.correctAnswers}/{dailyProgress.questionsAnswered} ({dailyProgress.dailyScore}%)
                  </div>
                )}
                {/* Time spent moved here - mobile only */}
                {isLoggedIn && dailyProgress && (
                  <div className="flex items-center gap-1 text-xs text-neutral-500 lg:hidden ml-auto">
                    <Clock className="h-3 w-3" />
                    {dailyProgress.timeSpentToday}m
                  </div>
                )}
                {!isLoggedIn && quizSession && (
                  <div className="flex items-center gap-1 text-xs text-neutral-500 lg:hidden ml-auto">
                    <Clock className="h-3 w-3" />
                    {Math.floor((new Date().getTime() - new Date(quizSession.startTime).getTime()) / 60000)}m
                  </div>
                )}
              </div>
            </div>
            {/* Time spent for desktop only */}
            <div className="hidden lg:flex items-center gap-2 text-xs lg:text-sm text-neutral-500">
              <Clock className="h-4 w-4" />
              {isLoggedIn && dailyProgress ? (
                <>{dailyProgress.timeSpentToday}m</>
              ) : (
                <>{quizSession ? Math.floor((new Date().getTime() - new Date(quizSession.startTime).getTime()) / 60000) : 0}m</>
              )}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          {/* Daily Progress Summary for Logged-in Users */}
          {isLoggedIn && dailyProgress && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-0 text-xs text-neutral-500 mt-2">
              <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="lg:hidden">{new Date(dailyProgress.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="hidden lg:inline">{new Date(dailyProgress.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </span>
                {/* Skipped beside date on mobile, in normal position on desktop */}
                {dailyProgress.skippedQuestions.length > 0 && (
                  <span className="flex items-center gap-1"><SkipForward className="h-3 lg:h-4 w-3 lg:w-4" /> {dailyProgress.skippedQuestions.length} skipped</span>
                )}
                {/* Time remaining moved here - mobile only */}
                <span className="font-medium text-brand-primary lg:hidden ml-auto">{maxQuestions - dailyProgress.questionsAnswered} remaining</span>
              </div>
              {/* Time remaining for desktop only */}
              <div className="hidden lg:block text-right">
                <span className="font-medium text-brand-primary">{maxQuestions - dailyProgress.questionsAnswered} remaining</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-8">
          {/* Question Header */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-6">
            <div className="text-lg font-semibold text-neutral-900">
              Question {currentQuestionIndex + 1}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getCategoryBadgeColor(currentQuestion.category) + " text-xs"}>
                {Array.isArray(currentQuestion.category) ? currentQuestion.category.find(cat => cat.primary)?.name || currentQuestion.category[0]?.name : currentQuestion.category}
              </Badge>
              {currentQuestion.difficulty && (
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.difficulty}
                </Badge>
              )}
            </div>
          </div>

          {/* Question Content */}
          <div className="mb-6 lg:mb-8">
            <h2 className="text-lg lg:text-xl leading-relaxed text-neutral-900 max-w-3xl">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="mb-6 lg:mb-8">
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={showFeedback}
              className="space-y-3 lg:space-y-4"
            >
              {currentQuestion.options.map((option) => {
                let optionClass = "flex items-center space-x-3 p-3 lg:p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[60px] lg:min-h-[auto]";
                
                if (showFeedback) {
                  if (option.id === currentQuestion.correctAnswer) {
                    optionClass += " border-green-500 bg-green-50 text-green-900";
                  } else if (option.id === submittedAnswer && option.id !== currentQuestion.correctAnswer) {
                    optionClass += " border-red-500 bg-red-50 text-red-900";
                  } else {
                    optionClass += " border-neutral-200 bg-neutral-50 text-neutral-500";
                  }
                } else {
                  if (selectedAnswer === option.id) {
                    optionClass += " border-brand-primary bg-brand-primary/5 text-brand-primary";
                  } else {
                    optionClass += " border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100";
                  }
                }

                return (
                  <div key={option.id} className={optionClass}>
                    <RadioGroupItem 
                      value={option.id} 
                      id={option.id}
                      disabled={showFeedback}
                      className="flex-shrink-0"
                    />
                    <Label 
                      htmlFor={option.id} 
                      className="flex-1 cursor-pointer text-sm lg:text-base leading-relaxed"
                    >
                      <span className="font-medium mr-2">{option.id}.</span>
                      {option.text}
                    </Label>
                    {showFeedback && option.id === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                    {showFeedback && option.id === submittedAnswer && option.id !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <div id="quiz-feedback-section" className="mb-6 lg:mb-8 p-4 lg:p-6 rounded-lg border border-neutral-200 bg-neutral-50">
              <div className="flex items-start gap-3 mb-4">
                {submittedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="h-5 lg:h-6 w-5 lg:w-6 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 lg:h-6 w-5 lg:w-6 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-2 text-sm lg:text-base">
                    {submittedAnswer === currentQuestion.correctAnswer ? (
                      <span className="text-green-700">Correct!</span>
                    ) : (
                      <span className="text-red-700">Incorrect</span>
                    )}
                  </div>
                  <p className="text-neutral-700 leading-relaxed text-sm lg:text-base">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
              
              {/* Progress Update */}
              <div className="text-xs lg:text-sm text-neutral-600 pt-3 border-t border-neutral-200">
                You've answered {getCorrectAnswers()} out of {getTotalQuestionsAnswered()} correctly ({getScorePercentage()}%)
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
            <div className="flex flex-col sm:flex-row gap-3 order-2 lg:order-1">
              {!showFeedback ? (
                <>
                  <Button 
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer || isLoading}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 lg:py-2 w-full sm:w-auto"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleSkipQuestion}
                    className="px-6 py-3 lg:py-2 w-full sm:w-auto"
                  >
                    Skip Question
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleNextQuestion}
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 lg:py-2 w-full sm:w-auto"
                >
                  {currentQuestionIndex < maxQuestions - 1 ? 'Next Question' : 'Complete Quiz'}
                </Button>
              )}
            </div>
            
            {/* Score Indicator */}
            <div className="flex items-center justify-center lg:justify-end gap-2 text-sm text-neutral-600 order-1 lg:order-2">
              <Target className="h-4 w-4" />
              <span className="font-medium">Score: {getCorrectAnswers()}/{getTotalQuestionsAnswered()}</span>
            </div>
          </div>
        </div>

        {/* Quiz Disclaimer Footer - Outside question box */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500 leading-relaxed mb-3 max-w-2xl mx-auto">
            This practice quiz is designed for educational purposes and preparation assistance. 
            Questions are based on NAB exam guidelines but are not official exam questions. 
            Results do not guarantee performance on the actual NAB examination.
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <button className="text-brand-primary hover:text-brand-primary-hover transition-colors text-[13px]">
              Terms of Use
            </button>
            <span className="text-neutral-300">•</span>
            <button className="text-brand-primary hover:text-brand-primary-hover transition-colors">
              Privacy Policy
            </button>
            <span className="text-neutral-300">•</span>
            <button className="text-brand-primary hover:text-brand-primary-hover transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}