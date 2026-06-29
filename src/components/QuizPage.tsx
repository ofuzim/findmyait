import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, BookOpen, BarChart3, Users, Smartphone, Trophy, Star, ArrowRight, Clock, Target, Brain, Shield, CheckCircle2, XCircle } from "lucide-react";
import { LocalStorageAuth } from "../utils/localStorage";

interface QuizPageProps {
  onNavigate: (page: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
  onLogout?: () => void;
}

export function QuizPage({ onNavigate, isLoggedIn, currentUser, onLogout }: QuizPageProps) {
  // Show only 1 question with correct answer pre-selected
  const [selectedAnswer, setSelectedAnswer] = useState<string>('D'); // Pre-select correct answer
  const [showFeedback, setShowFeedback] = useState(true); // Show feedback immediately
  
  // Check guest quiz eligibility
  const guestQuizStats = !isLoggedIn ? LocalStorageAuth.getGuestQuizStats() : null;

  // Single demonstration question with correct answer pre-selected
  const demonstrationQuestion = {
    question: "You've just started managing a facility and want to ensure residents' care plans are updated regularly. What's the minimum frequency you must ensure each care plan is reviewed?",
    options: [
      { id: 'A', text: 'Every 6 months', correct: false },
      { id: 'B', text: 'Annually', correct: false },
      { id: 'C', text: 'Quarterly', correct: false },
      { id: 'D', text: 'Every 90 days', correct: true }
    ],
    explanation: "Federal regulations require care plan reviews every 90 days, with more frequent reviews as needed based on resident condition changes."
  };

  const scrollToQuiz = () => {
    const quizSection = document.getElementById('quiz-practice-section');
    if (quizSection) {
      // Get the element's position and account for sticky header
      const elementPosition = quizSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for sticky header
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToAboutNAB = () => {
    const aboutSection = document.getElementById('about-nab-section');
    if (aboutSection) {
      // Get the element's position and account for sticky header
      const elementPosition = aboutSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for sticky header
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigate={onNavigate} 
        currentPage="quiz" 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      
      <main className="p-[0px]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-6xl mb-6 text-neutral-900">
                Master Your <span className="brand-highlight-underline">NAB Exam</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
                Prepare for your nursing home administrator license with confidence
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-neutral-200/50">
                <p className="text-lg mb-4" style={{ color: 'var(--brand-primary)' }}>
                  <strong>Join 500+ aspiring administrators</strong> who are mastering their NAB exam preparation
                </p>
                
                {/* Guest Quiz Status Warning */}
                {!isLoggedIn && guestQuizStats && !guestQuizStats.canTakeToday && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center gap-2 text-amber-800 mb-2">
                      <Clock className="h-5 w-5" />
                      <p className="font-semibold">Daily Quiz Completed</p>
                    </div>
                    <p className="text-sm text-amber-700 mb-2">
                      You've already taken today's practice quiz. Come back tomorrow or sign up for unlimited access!
                    </p>
                    {guestQuizStats.timeUntilNext && (
                      <p className="text-xs text-amber-600">
                        Next quiz available in: {guestQuizStats.timeUntilNext.hours}h {guestQuizStats.timeUntilNext.minutes}m
                      </p>
                    )}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                  <Button 
                    size="lg"
                    className="text-base px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                    }}
                    onClick={() => onNavigate('quiz-practice')}
                  >
                    {!isLoggedIn && guestQuizStats && !guestQuizStats.canTakeToday ? 'View Results' : 'Try Questions'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    className="text-base px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg border-2"
                    style={{
                      borderColor: 'var(--brand-primary)',
                      color: 'var(--brand-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--brand-primary)';
                    }}
                    onClick={scrollToAboutNAB}
                  >
                    Learn More
                  </Button>
                </div>
                
                <p className="text-sm text-neutral-500">
                  {!isLoggedIn && guestQuizStats && !guestQuizStats.canTakeToday 
                    ? 'Sign up for unlimited daily practice questions'
                    : 'No signup required • Experience our quality questions'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is NAB Exam Section */}
        <section id="about-nab-section" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image - Left Side */}
              <div className="relative h-full">
                <img 
                  src="https://images.unsplash.com/photo-1711343777918-6d395c16e37f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBudXJzaW5nJTIwaG9tZSUyMGhlYWx0aGNhcmUlMjBhZG1pbmlzdHJhdG9yJTIwb2ZmaWNlfGVufDF8fHx8MTc1ODk2MDY1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional healthcare administrator in nursing home office environment"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
              
              {/* Text Content - Right Side */}
              <div>
                <h2 className="text-4xl mb-6 text-neutral-900">About the NAB Exam</h2>
                <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                  The National Association of Long Term Care Administrator Boards (NAB) exam is required for nursing home administrator licensure in all 50 states.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, white)' }}>
                      <BookOpen className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <div>
                      <h3 className="text-xl mb-2 text-neutral-900">2000+ Questions</h3>
                      <p className="text-neutral-600">Multiple choice questions covering 6 core domains of nursing home administration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: 'color-mix(in srgb, var(--brand-secondary) 10%, white)' }}>
                      <Target className="h-6 w-6" style={{ color: 'var(--brand-secondary)' }} />
                    </div>
                    <div>
                      <h3 className="text-xl mb-2 text-neutral-900">Passing Score</h3>
                      <p className="text-neutral-600">Varies by state but typically requires 70-75% to pass and obtain licensure</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, white)' }}>
                      <Shield className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <div>
                      <h3 className="text-xl mb-2 text-neutral-900">Required for AIT</h3>
                      <p className="text-neutral-600">Essential for completing Administrator in Training programs and obtaining your license</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: 'color-mix(in srgb, var(--brand-secondary) 10%, white)' }}>
                      <CheckCircle className="h-6 w-6" style={{ color: 'var(--brand-secondary)' }} />
                    </div>
                    <div>
                      <h3 className="text-xl mb-2 text-neutral-900">Real Format</h3>
                      <p className="text-neutral-600">Our practice questions mirror the actual exam format and difficulty level</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Quiz Section */}
        <section id="quiz-practice-section" className="py-20 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl mb-6 text-neutral-900">NAB Practice Question Sample</h2>
              <p className="text-lg text-neutral-600 mb-6">
                Experience the quality of our practice questions with this sample
              </p>
            </div>
            
            <Card className="p-8 bg-white border border-neutral-200 shadow-lg">
              <div className="mb-6">
                <Badge variant="secondary" className="mb-4" style={{
                  backgroundColor: 'color-mix(in srgb, var(--brand-secondary) 15%, white)',
                  color: 'var(--brand-primary)'
                }}>
                  Sample Question
                </Badge>
                
                <h3 className="text-xl mb-6 text-neutral-900 leading-relaxed">
                  {demonstrationQuestion.question}
                </h3>
                
                <div className="space-y-3">
                  {demonstrationQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`w-full p-4 text-left rounded-lg border-2 cursor-default ${
                        selectedAnswer === option.id && option.correct
                          ? 'border-green-500 bg-green-50'
                          : option.correct && showFeedback
                          ? 'border-green-500 bg-green-50'
                          : 'border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-neutral-700 mr-3">{option.id}.</span>
                        <span className="text-neutral-900 flex-1">{option.text}</span>
                        {option.correct && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Correct Answer: {demonstrationQuestion.options.find(opt => opt.correct)?.id}</strong> - {demonstrationQuestion.explanation}
                  </p>
                </div>
              </div>
              
              <div className="text-center border-t border-neutral-200 pt-6">
                <p className="text-sm text-neutral-500 mb-4">This is 1 question of 2000+ in our database</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="text-base px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                    }}
                    onClick={() => onNavigate('quiz-practice')}
                  >
                    Try Quiz Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    className="text-base px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg border-2"
                    style={{
                      borderColor: 'var(--brand-primary)',
                      color: 'var(--brand-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--brand-primary)';
                    }}
                    onClick={() => onNavigate('signup')}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Exam Categories Section */}
        <section className="py-20 bg-white pt-[80px] pr-[0px] pb-[50px] pl-[0px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl mb-6 text-neutral-900">Master All NAB Exam Domains</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Resident Care Management",
                  description: "Care planning and coordination, Quality assurance programs",
                  topics: "Care plan updates, resident assessments",
                  color: "bg-blue-50 border-blue-200",
                  icon: <Users className="h-6 w-6 text-blue-600" />
                },
                {
                  title: "Human Resources Management",
                  description: "Staffing and supervision, Training and development",
                  topics: "Staff ratios, training requirements",
                  color: "bg-green-50 border-green-200",
                  icon: <Users className="h-6 w-6 text-green-600" />
                },
                {
                  title: "Financial Management",
                  description: "Budget development and monitoring, Revenue and expense management",
                  topics: "Cost controls, financial reporting",
                  color: "bg-purple-50 border-purple-200",
                  icon: <BarChart3 className="h-6 w-6 text-purple-600" />
                },
                {
                  title: "Environmental Management",
                  description: "Safety and emergency preparedness, Infection control protocols",
                  topics: "Fire safety, disaster planning",
                  color: "bg-yellow-50 border-yellow-200",
                  icon: <Shield className="h-6 w-6 text-yellow-600" />
                },
                {
                  title: "Governance and Management",
                  description: "Regulatory compliance, Policies and procedures",
                  topics: "Survey preparation, documentation",
                  color: "bg-red-50 border-red-200",
                  icon: <BookOpen className="h-6 w-6 text-red-600" />
                },
                {
                  title: "Leadership",
                  description: "Communication and ethics, Quality improvement",
                  topics: "Team building, conflict resolution",
                  color: "bg-indigo-50 border-indigo-200",
                  icon: <Brain className="h-6 w-6 text-indigo-600" />
                }
              ].map((category, index) => (
                <Card key={index} className={`p-6 hover:shadow-lg transition-all duration-200 ${category.color}`}>
                  <div className="flex items-center mb-4">
                    {category.icon}
                    <h3 className="text-lg ml-3 text-neutral-900">{category.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-700 mb-3">{category.description}</p>
                  <p className="text-xs text-neutral-600">
                    <strong>Sample topics:</strong> {category.topics}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose FindMyAIT Section */}
        <section className="bg-white px-[0px] py-[20px] pt-[20px] pr-[0px] pb-[80px] pl-[0px]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Join 500+ successful administrators who mastered their NAB exam with our proven platform
              </p>
            </div>
            
            {/* Platform Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[
                {
                  icon: <Target className="h-8 w-8" style={{ color: 'var(--brand-primary)' }} />,
                  title: <>2000+ Real<br />Questions</>,
                  description: "Practice with questions based on actual NAB exam content, updated regularly to match current standards"
                },
                {
                  icon: <BarChart3 className="h-8 w-8" style={{ color: 'var(--brand-secondary)' }} />,
                  title: <>Progress<br />Tracking</>,
                  description: "Identify your strengths and weak areas with detailed analytics and personalized study recommendations"
                },
                {
                  icon: <Clock className="h-8 w-8" style={{ color: 'var(--brand-primary)' }} />,
                  title: <>50 Questions<br />Daily</>,
                  description: "Build confidence with consistent daily practice and spaced repetition learning methodology"
                },
                {
                  icon: <Brain className="h-8 w-8" style={{ color: 'var(--brand-secondary)' }} />,
                  title: <>Expert<br />Explanations</>,
                  description: "Understand the 'why' behind every answer with detailed explanations from licensed administrators"
                },
                {
                  icon: <Trophy className="h-8 w-8" style={{ color: 'var(--brand-primary)' }} />,
                  title: <>Improve<br />Performance</>,
                  description: "Feel confident with our money-back guarantee if you don't pass your NAB exam on the first try"
                }
              ].map((benefit, index) => (
                <div key={index} className="group text-center rounded-xl hover:bg-neutral-50 transition-all duration-300 px-[10px] bg-[rgba(203,203,203,0.07)] px-[5px] py-[32px]">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                       style={{ backgroundColor: 'color-mix(in srgb, var(--brand-secondary) 8%, white)' }}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-neutral-900 leading-tight text-[18px]">{benefit.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ready to Master Your NAB Exam - with Pricing Plans */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl mb-6 text-neutral-900">
                Ready to Master Your NAB Exam?
              </h2>
              <p className="text-xl text-neutral-600 m-[0px]">
                Join thousands of successful administrators who passed their NAB exam with confidence
              </p>
            </div>

            {/* Free Tier Options */}
            <div className="mt-16">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-sm md:max-w-4xl mx-auto px-4 md:px-0">
                {/* Free Plan */}
                <Card className="relative p-4 md:p-8 bg-white border-2 border-neutral-200 hover:border-neutral-300 transition-all duration-200 flex flex-col h-full">
                  <div className="text-center flex-grow flex flex-col">
                    <h3 className="text-2xl mb-2 text-neutral-900">Free Tier</h3>
                    <div className="mb-6">
                      <span className="text-4xl text-neutral-900">$0</span>
                      <span className="text-neutral-600">/forever</span>
                    </div>
                    <ul className="space-y-4 mb-8 text-left flex-grow">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">5 questions daily</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">Basic feedback</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">No credit card required</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">Instant access to explanations</span>
                      </li>
                    </ul>
                    <Button 
                      className="w-full py-3 mt-auto border-2 rounded-xl text-base"
                      variant="outline"
                      style={{
                        borderColor: 'var(--brand-primary)',
                        color: 'var(--brand-primary)'
                      }}
                      onClick={() => onNavigate('quiz-practice')}
                    >
                      Start Practice Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                {/* Full Access Plan - Most Popular */}
                <Card className="relative p-4 md:p-8 bg-white border-2 hover:shadow-xl transition-all duration-200 flex flex-col h-full"
                      style={{ borderColor: 'var(--brand-primary)' }}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-4 py-2"
                           style={{
                             backgroundColor: 'var(--brand-primary)',
                             color: 'white'
                           }}>
                      Recommended
                    </Badge>
                  </div>
                  <div className="text-center flex-grow flex flex-col">
                    <h3 className="text-2xl my-[8px] text-neutral-900 mx-[0px]">Full Access</h3>
                    <div className="mb-6">
                      <span className="text-4xl text-neutral-900">$0</span>
                      <span className="text-neutral-600">/forever</span>
                    </div>
                    <ul className="space-y-4 mb-8 text-left flex-grow">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">50 questions daily</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">Progress tracking</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">Weak area analysis</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">Study recommendations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">Detailed explanations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-neutral-700">No credit card required</span>
                      </li>
                    </ul>
                    <Button 
                      className="w-full py-3 mt-auto rounded-xl text-base"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                      }}
                      onClick={() => onNavigate('signup')}
                    >
                      Create Account for Full Access
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Additional info below pricing */}
              <div className="text-center mt-8">
                <p className="text-sm text-neutral-500 mb-2">
                  Both tiers are completely free • No hidden fees
                </p>
                <p className="text-xs text-neutral-400">
                  Start practicing immediately with no commitment required
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}