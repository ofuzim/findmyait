import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ApplyNowModal } from "./ApplyNowModal";
import { CreateAlertModal } from "./CreateAlertModal";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LocalStorageAuth } from "../utils/localStorage";
import { mockJobs, Job } from "../data/mockJobs";
import findMyAITLogo from 'figma:asset/28624db62fac154e722120f8f8afb7f175668f82.png';
import { 
  BookOpen,
  Briefcase,
  MapPin,
  Building,
  Eye,
  Heart,
  Flame,
  CheckCircle,
  Play,
  TrendingUp,
  Download,
  FileText,
  Star,
  User,
  Edit,
  Bell,
  Settings,
  Target,
  Users,
  Award,
  Calendar
} from "lucide-react";

interface UserDashboardProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void; // Added logout handler prop
  userProfile?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    education: string;
    currentPosition: string;
    yearsExperience: string;
    hasLicense: boolean;
    licenseNumber: string;
    availableStartDate: string;
    salaryExpectation: string;
    relocateWilling: string;
    referralSource: string;
    resumeFile?: {
      name: string;
      size: number;
      type: string;
      url: string;
    };
  };
  // ⚠️ PLACEHOLDER - Current user from LocalStorage auth
  currentUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    lastLogin?: string;
  };
  appliedJobs?: Set<string>;
  savedJobs?: Set<string>;
  onJobApplicationSubmit?: (jobId: string) => void;
}

export function UserDashboard({ onNavigate, onLogout, userProfile, currentUser, appliedJobs, savedJobs, onJobApplicationSubmit }: UserDashboardProps) {
  // 🔄 PLACEHOLDER - Calculate real profile completion from localStorage
  // In production: This would come from backend API
  const profileCompletion = currentUser?.id 
    ? LocalStorageAuth.getProfileCompletionPercentage(currentUser.id)
    : 0;
  
  const isProfileCompleted = currentUser?.id 
    ? LocalStorageAuth.isProfileCompleted(currentUser.id)
    : false;

  // Get extended profile data for one-pager modal
  const extendedProfile = currentUser?.id 
    ? LocalStorageAuth.getUserProfile(currentUser.id)
    : null;

  // 🔄 DYNAMIC QUIZ STATS - Get real data from localStorage (calculated on each render)
  const getUserStats = () => {
    if (!currentUser?.id) {
      return {
        streak: 0,
        todayQuestions: 0,
        dailyTarget: 50,
        currentAverage: 0,
        profileCompletion: profileCompletion,
        newJobsCount: 3
      };
    }

    // Get overall quiz progress for streak and average
    const overallProgress = LocalStorageAuth.getUserQuizProgress(currentUser.id);
    
    // Get today's daily quiz stats
    const dailyStats = LocalStorageAuth.getDailyQuizStats(currentUser.id);
    
    return {
      streak: overallProgress?.currentStreak || 0,
      todayQuestions: dailyStats.questionsAnswered,
      dailyTarget: 50, // This remains constant
      currentAverage: overallProgress?.averageScore || 0,
      profileCompletion: profileCompletion,
      newJobsCount: 3 // This could be made dynamic too if needed
    };
  };

  const user = getUserStats();

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<any>(null);
  
  // Alert modal state
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);

  // Alert handlers
  const handleEditAlert = (alert: any) => {
    setEditingAlert(alert);
    setShowCreateAlertModal(true);
  };

  const handleCreateAlertSubmit = (alertData: any) => {
    // In a real app, this would update the alerts in your database
    console.log('Alert saved:', alertData);
    setShowCreateAlertModal(false);
    setEditingAlert(null);
  };

  const [currentDateTime] = useState(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  });

  // 🔄 DYNAMIC QUICK STATS - Get real data from localStorage (calculated on each render)
  const getQuickStats = () => {
    if (!currentUser?.id) {
      return {
        applicationsSent: 0,
        jobsSaved: 0,
        quizProgress: 0,
        weeklyGoal: 0
      };
    }

    // Get real applied and saved jobs count
    const userAppliedJobs = LocalStorageAuth.getUserApplications(currentUser.id);
    const userSavedJobs = LocalStorageAuth.getUserSavedJobs(currentUser.id);
    
    // Get overall quiz progress for average score
    const overallProgress = LocalStorageAuth.getUserQuizProgress(currentUser.id);
    
    return {
      applicationsSent: userAppliedJobs.length,
      jobsSaved: userSavedJobs.length,
      quizProgress: overallProgress?.averageScore || 0,
      weeklyGoal: 85 // This could be made dynamic if there's a goal tracking system
    };
  };

  const quickStats = getQuickStats();

  const [myApplications] = useState([
    { id: 1, company: "Sunrise Senior Living", position: "Administrator in Training", status: "Under Review", appliedDate: "3 days ago", statusColor: "bg-yellow-100 text-yellow-800" },
    { id: 2, company: "Golden Years Care", position: "AIT Program Trainee", status: "Interview Scheduled", appliedDate: "1 week ago", statusColor: "bg-blue-100 text-blue-800" },
    { id: 3, company: "Heritage Manor", position: "Management Trainee", status: "Application Sent", appliedDate: "2 weeks ago", statusColor: "bg-neutral-100 text-neutral-600" }
  ]);

  // 🔄 DYNAMIC SAVED JOBS - Get actual saved jobs from localStorage  
  const getSavedJobsData = () => {
    if (!currentUser?.id || !savedJobs || savedJobs.size === 0) {
      return [];
    }

    // Get saved job IDs from localStorage and find matching jobs
    const savedJobIds = Array.from(savedJobs);
    const savedJobsData = savedJobIds
      .map(jobId => mockJobs.find(job => job.id === jobId))
      .filter(Boolean) // Remove any undefined jobs
      .slice(0, 3) // Show only first 3 in dashboard
      .map((job: Job) => ({
        id: job.id,
        company: job.company,
        title: job.title,
        position: job.title,
        location: job.location,
        matchPercentage: Math.floor(Math.random() * 20) + 80, // Mock match percentage 80-99%
        newActivity: Math.random() > 0.7, // Random new activity indicator
        salary: job.salary
      }));

    return savedJobsData;
  };

  const displaySavedJobs = getSavedJobsData();

  const [recommendedJobs] = useState([
    { id: "rec-1", company: "Aspen Ridge Senior Living", title: "Administrator in Training", location: "Lakewood, CO", matchPercentage: 95, postedDate: "2 days ago", salary: "$48,000 - $58,000" },
    { id: "rec-2", company: "Evergreen Senior Care", title: "Management Trainee", location: "Boulder, CO", matchPercentage: 89, postedDate: "1 week ago", salary: "$44,000 - $54,000" }
  ]);

  const [jobAlerts] = useState([
    {
      id: "alert-1",
      name: "Denver Metro Area",
      criteria: "Administrator in Training",
      keywords: "Administrator in Training, AIT",
      location: "Denver, CO",
      frequency: "Daily",
      created: "2024-01-15",
      matchCount: 2,
      active: true,
      salaryMin: "45",
      salaryMax: "65",
      jobType: "Full-time",
      experienceLevel: "Entry Level"
    },
    {
      id: "alert-2", 
      name: "Colorado Springs",
      criteria: "AIT Program, Management Trainee",
      keywords: "AIT Program, Management Trainee",
      location: "Colorado Springs, CO",
      frequency: "Weekly",
      created: "2024-01-10",
      matchCount: 1,
      active: true,
      salaryMin: "40",
      salaryMax: "60",
      jobType: "Full-time",
      experienceLevel: "1-2 years"
    }
  ]);



  const progressPercentage = Math.round((user.todayQuestions / user.dailyTarget) * 100);
  const remainingQuestions = user.dailyTarget - user.todayQuestions;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        onNavigate={onNavigate} 
        onLogout={onLogout || (() => {})} 
        currentPage="dashboard" 
        currentUser={currentUser} 
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        
        {/* Clean Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold text-neutral-900 mb-3">
            Welcome back, {currentUser?.firstName || userProfile?.firstName || 'User'}! 👋
          </h1>
          <p className="text-lg text-neutral-600 mb-2">{currentDateTime}</p>
          <p className="text-brand-primary font-medium">Ready to continue your AIT journey?</p>
        </div>

        {/* Hero Section - Primary Action */}
        <div className="mb-16 pb-16 border-b border-neutral-200">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-brand-primary to-blue-800 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-12 text-center">
              
              {/* Study Streak Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Flame className="h-5 w-5 text-orange-300" />
                <span className="font-medium">
                  {user.streak > 0 ? `${user.streak} day streak!` : 'Start your streak today!'}
                </span>
              </div>

              <h2 className="text-3xl font-semibold mb-4">Today's Practice Session</h2>
              <p className="text-lg text-white/90 mb-8">
                {user.todayQuestions > 0 
                  ? `Keep your momentum going with ${remainingQuestions} questions remaining`
                  : `Start your daily practice with ${user.dailyTarget} questions to ace the NAB exam`
                }
              </p>

              {/* Progress Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>{user.todayQuestions}/{user.dailyTarget} completed</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3 bg-white/20" />
              </div>

              {/* Primary CTA */}
              <Button 
                size="lg"
                onClick={() => onNavigate('quiz-practice')}
                className="bg-white text-brand-primary hover:bg-neutral-100 text-lg px-8 py-6 h-auto"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Practice Session
              </Button>

              <p className="text-sm text-white/80 mt-4">
                {user.currentAverage > 0 
                  ? `Average score: ${user.currentAverage}% • ${user.streak > 0 ? "Don't break your streak!" : "Build your streak!"}`
                  : "Track your progress and build your study streak!"
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mb-16 pb-16 border-b border-neutral-200">
          <h3 className="text-2xl font-semibold text-neutral-900 mb-8">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-neutral-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-brand-primary" />
                </div>
                <h4 className="text-2xl font-semibold text-neutral-900 mb-1 text-[32px]">{quickStats.applicationsSent}</h4>
                <p className="text-sm text-neutral-600">Applications Sent</p>
              </CardContent>
            </Card>
            
            <Card className="border-neutral-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-brand-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-brand-secondary" />
                </div>
                <h4 className="text-2xl font-semibold text-neutral-900 mb-1 text-[32px]">{quickStats.jobsSaved}</h4>
                <p className="text-sm text-neutral-600">Jobs Saved</p>
              </CardContent>
            </Card>
            
            <Card className="border-neutral-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-2xl font-semibold text-neutral-900 mb-1 text-[32px]">{quickStats.quizProgress}%</h4>
                <p className="text-sm text-neutral-600">Avg. Quiz Score</p>
              </CardContent>
            </Card>
            
            <Card className="border-neutral-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-2xl font-semibold text-neutral-900 mb-1 text-[32px]">{quickStats.weeklyGoal}</h4>
                <p className="text-sm text-neutral-600">Job Matches</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Overview - Restructured */}
        <div className="mb-16 pb-16 border-b border-neutral-200">
          <h3 className="text-2xl font-semibold text-neutral-900 mb-8">Profile Overview</h3>
          <Card className="border-neutral-200">
            <CardContent className="p-8">
              <div className="flex gap-8">
                
                {/* Completion Status - 2/3 width */}
                <div className="flex-1 flex-grow-[2]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        isProfileCompleted 
                          ? 'bg-green-500' 
                          : profileCompletion > 50 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}></div>
                      <h4 className="font-semibold text-neutral-900">Completion Status</h4>
                      <Badge variant="outline" className={
                        isProfileCompleted 
                          ? 'border-green-200 text-green-700 bg-green-50'
                          : profileCompletion > 50 
                            ? 'border-yellow-200 text-yellow-700 bg-yellow-50'
                            : 'border-red-200 text-red-700 bg-red-50'
                      }>
                        {isProfileCompleted 
                          ? 'Complete' 
                          : profileCompletion > 50 
                            ? 'In Progress' 
                            : 'Needs Work'
                        }
                      </Badge>
                    </div>
                    <Button 
                      className="bg-brand-primary hover:bg-brand-primary-hover text-white"
                      onClick={() => onNavigate('profile-completion')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {isProfileCompleted ? 'View Profile' : profileCompletion > 0 ? 'Continue Profile' : 'Complete Profile'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">{profileCompletion}% complete</span>
                      <span className="text-neutral-500">Goal: 100%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-3" />
                  </div>
                  
                  <div className="space-y-3 text-sm mb-6">
                    {/* Step 1: Leadership Development */}
                    <div className="flex items-center justify-between">
                      <span className={`${
                        profileCompletion >= 20 
                          ? 'text-green-600 font-medium' 
                          : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 1
                            ? 'text-yellow-600 font-medium' 
                            : 'text-neutral-400'
                      }`}>
                        Leadership Development
                      </span>
                      {profileCompletion >= 20 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 1 ? (
                        <div className="w-4 h-4 border-2 border-yellow-500 rounded-full"></div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-neutral-300 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Step 2: Flexibility & Fit */}
                    <div className="flex items-center justify-between">
                      <span className={`${
                        profileCompletion >= 40 
                          ? 'text-green-600 font-medium' 
                          : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 2
                            ? 'text-yellow-600 font-medium' 
                            : 'text-neutral-400'
                      }`}>
                        Flexibility & Fit
                      </span>
                      {profileCompletion >= 40 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 2 ? (
                        <div className="w-4 h-4 border-2 border-yellow-500 rounded-full"></div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-neutral-300 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Step 3: Professional Background */}
                    <div className="flex items-center justify-between">
                      <span className={`${
                        profileCompletion >= 60 
                          ? 'text-green-600 font-medium' 
                          : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 3
                            ? 'text-yellow-600 font-medium' 
                            : 'text-neutral-400'
                      }`}>
                        Professional Background
                      </span>
                      {profileCompletion >= 60 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 3 ? (
                        <div className="w-4 h-4 border-2 border-yellow-500 rounded-full"></div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-neutral-300 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Step 4: Soft Signals */}
                    <div className="flex items-center justify-between">
                      <span className={`${
                        profileCompletion >= 80 
                          ? 'text-green-600 font-medium' 
                          : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 4
                            ? 'text-yellow-600 font-medium' 
                            : 'text-neutral-400'
                      }`}>
                        Soft Signals
                      </span>
                      {profileCompletion >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 4 ? (
                        <div className="w-4 h-4 border-2 border-yellow-500 rounded-full"></div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-neutral-300 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Step 5: Final Details */}
                    <div className="flex items-center justify-between">
                      <span className={`${
                        profileCompletion >= 100 
                          ? 'text-green-600 font-medium' 
                          : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 5
                            ? 'text-yellow-600 font-medium' 
                            : 'text-neutral-400'
                      }`}>
                        Final Details
                      </span>
                      {profileCompletion >= 100 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : profileCompletion > 0 && (currentUser?.id ? LocalStorageAuth.getUserProfile(currentUser.id)?.profileCompletionStep || 0 : 0) >= 5 ? (
                        <div className="w-4 h-4 border-2 border-yellow-500 rounded-full"></div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-neutral-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Completion Incentives */}
                  {!isProfileCompleted && (
                    <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4">
                      <h5 className="font-medium text-neutral-900 mb-2">🎯 Complete Profile to Unlock Premium</h5>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        <li>• Premium job matches (up to 35% better)</li>
                        <li>• Priority application status</li>
                        <li>• Advanced AIT tools & resources</li>
                        <li>• Recruiter visibility</li>
                      </ul>
                    </div>
                  )}
                  
                  {/* Profile Completed Message */}
                  {isProfileCompleted && (
                    <div className="bg-brand-secondary/5 border border-brand-secondary/20 rounded-lg p-4">
                      <h5 className="font-medium text-neutral-900 mb-2">✅ Profile Complete!</h5>
                      <p className="text-sm text-neutral-600">
                        Your professional one-pager is ready and you have access to all premium features.
                      </p>
                    </div>
                  )}
                </div>

                {/* One-Pager Section - 1/3 width */}
                <div className="flex-1 flex-grow-[1] space-y-4">
                  
                  {/* One-Pager Header */}
                  <div className="flex items-center justify-between py-[10px] py-[5px] px-[0px]">
                    <span className="text-sm font-medium text-neutral-900 text-[16px] font-bold">Professional Profile</span>
                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs">
                      Ready
                    </Badge>
                  </div>

                  {/* Last Updated */}
                  <p className="text-xs text-neutral-500">
                    Last Updated: {extendedProfile?.updatedAt 
                      ? new Date(extendedProfile.updatedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })
                      : 'Not available'}
                  </p>

                  {/* One-Pager Explainer */}
                  <p className="text-sm text-neutral-600">
                    Your professional one-pager that showcases your leadership potential, motivation for long-term care, and unique qualifications beyond your resume. Perfect for quick submissions and networking.
                  </p>

                  {/* Preview Thumbnail - Clickable */}
                  <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                    <DialogTrigger asChild>
                      <div className="bg-neutral-50 border border-neutral-200 rounded p-3 mb-4 cursor-pointer hover:bg-neutral-100 transition-colors">
                        <div className="bg-white border border-neutral-200 rounded-sm p-3 space-y-2">
                          <div className="h-2 bg-brand-primary rounded w-2/3"></div>
                          <div className="h-1.5 bg-neutral-200 rounded"></div>
                          <div className="h-1.5 bg-neutral-100 rounded w-4/5"></div>
                          <div className="h-1.5 bg-neutral-100 rounded w-3/4"></div>
                          <div className="h-1 bg-neutral-100 rounded w-1/2 mt-3"></div>
                          <div className="h-1 bg-neutral-100 rounded w-2/3"></div>
                        </div>
                        <p className="text-xs text-neutral-500 text-center mt-2">Click to preview</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-light">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          One-Pager Preview
                        </DialogTitle>
                        <DialogDescription>
                          Preview your professional one-pager document before downloading. This document highlights your experience, certifications, and key qualifications for AIT positions.
                        </DialogDescription>
                      </DialogHeader>
                      
                      {/* Detailed One-Pager Preview */}
                      <div className="bg-white border-2 border-neutral-200 rounded-lg p-8 space-y-6 min-h-[600px]">
                        {/* Header with Logo */}
                        <div className="border-b-2 border-brand-primary pb-6">
                          {/* Logo */}
                          <div className="flex justify-center mb-4">
                            <img 
                              src={findMyAITLogo} 
                              alt="FindMyAIT" 
                              className="h-10 w-auto"
                            />
                          </div>
                          
                          {/* User Info */}
                          <div className="text-center">
                            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
                              {currentUser?.firstName || userProfile?.firstName || 'First'} {currentUser?.lastName || userProfile?.lastName || 'Last'}
                            </h1>
                            <p className="text-brand-primary font-medium mb-2">
                              {extendedProfile?.currentTitle || userProfile?.currentPosition || 'Healthcare Professional'}
                            </p>
                            <div className="flex justify-center gap-6 text-sm text-neutral-600">
                              <span>{currentUser?.email || userProfile?.email || 'email@example.com'}</span>
                              <span>{userProfile?.phone || '(555) 123-4567'}</span>
                              <span>{userProfile?.city || 'City'}, {userProfile?.state || 'State'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Professional Summary */}
                        <div className="space-y-3">
                          <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                            <User className="h-5 w-5" />
                            <span>Professional Summary</span>
                          </h3>
                          <p className="text-neutral-700 leading-relaxed">
                            {extendedProfile?.professionalSummary || 
                             `Dedicated healthcare professional with ${userProfile?.yearsExperience?.replace('-', ' to ')} years of experience, seeking to leverage leadership skills and passion for quality care in an Administrator in Training position. Committed to advancing long-term care standards and improving resident outcomes through innovative management approaches.`}
                          </p>
                        </div>

                        {/* Education & Certifications */}
                        <div className="space-y-3">
                          <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                            <BookOpen className="h-5 w-5" />
                            <span>Education & Certifications</span>
                          </h3>
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                              <p className="font-medium text-neutral-700">Education:</p>
                              <p className="text-neutral-600">
                                {userProfile?.education === 'bachelor' ? 'Bachelor\'s Degree' :
                                 userProfile?.education === 'master' ? 'Master\'s Degree' :
                                 userProfile?.education === 'associate' ? 'Associate Degree' :
                                 userProfile?.education === 'high-school' ? 'High School Diploma' :
                                 'Education information not specified'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-700">University:</p>
                              <p className="text-neutral-600">{extendedProfile?.university || 'Not specified'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700">Certifications:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {extendedProfile?.certifications?.length > 0 ? (
                                extendedProfile.certifications.map((cert, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {cert === 'Other' ? extendedProfile.otherCertification : cert}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-neutral-600 text-xs">No certifications listed</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Availability & Preferences */}
                        <div className="space-y-3">
                          <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                            <MapPin className="h-5 w-5" />
                            <span>Availability & Preferences</span>
                          </h3>
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                              <p className="font-medium text-neutral-700">Available Start Date:</p>
                              <p className="text-neutral-600">
                                {extendedProfile?.earliestStart?.month && extendedProfile?.earliestStart?.year 
                                  ? `${extendedProfile.earliestStart.month} ${extendedProfile.earliestStart.year}`
                                  : userProfile?.availableStartDate || 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-700">Relocation for AIT:</p>
                              <p className="text-neutral-600">
                                {extendedProfile?.relocateForAIT === 'yes-anywhere' ? 'Yes, anywhere in the US' :
                                 extendedProfile?.relocateForAIT === 'yes-limited' ? 'Yes, within specific states/regions' :
                                 extendedProfile?.relocateForAIT === 'no' ? 'No, prefer current area' : 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-700">Salary Expectation:</p>
                              <p className="text-neutral-600">{userProfile?.salaryExpectation || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Working Style & Skills */}
                        <div className="space-y-3">
                          <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                            <Users className="h-5 w-5" />
                            <span>Working Style & Skills</span>
                          </h3>
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                              <p className="font-medium text-neutral-700">Leadership Style:</p>
                              <p className="text-neutral-600">
                                {extendedProfile?.leadershipStyle 
                                  ? extendedProfile.leadershipStyle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                                  : 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-700">Learning Approach:</p>
                              <p className="text-neutral-600">
                                {extendedProfile?.learningApproach 
                                  ? extendedProfile.learningApproach.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                                  : 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-700">Transferable Skills:</p>
                              <p className="text-neutral-600">{extendedProfile?.nonHealthcareSkill || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-3">
                          <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                            <Calendar className="h-5 w-5" />
                            <span>Additional Information</span>
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-neutral-700">Virtual Interviews:</p>
                              <p className="text-neutral-600">
                                {extendedProfile?.virtualInterviews !== undefined 
                                  ? (extendedProfile.virtualInterviews ? 'Comfortable with virtual interviews' : 'Prefer in-person interviews')
                                  : 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-700">Additional Information:</p>
                              <p className="text-neutral-600">
                                {extendedProfile?.additionalInfo || 'No additional information provided.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-neutral-200 pt-4 text-center">
                          <p className="text-xs text-neutral-500">
                            Generated via FindMyAIT Professional Profile Builder
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                    
                  <div className="space-y-2">
                    <Button size="sm" className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full">
                      <Download className="h-3 w-3 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm" className="text-brand-primary border-brand-primary w-full">
                      <Edit className="h-3 w-3 mr-2" />
                      Update Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Activity */}
        <div className="mb-16 pb-16 border-b border-neutral-200">
          <h3 className="text-2xl font-semibold text-neutral-900 mb-8">Job Activity</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* My Applications */}
            <Card className="border-neutral-200 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand-primary" />
                  My Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {myApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-neutral-900">{app.position}</h5>
                        <p className="text-sm text-neutral-600">{app.company}</p>
                        <p className="text-xs text-neutral-500">{app.appliedDate}</p>
                      </div>
                      <Badge className={app.statusColor}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => onNavigate('job-activity?view=applications')}
                >
                  View All Applications
                </Button>
              </CardContent>
            </Card>

            {/* Saved Jobs */}
            <Card className="border-neutral-200 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-brand-secondary" />
                  Saved Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {displaySavedJobs.length > 0 ? displaySavedJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-neutral-900">{job.position}</h5>
                          {job.newActivity && <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>}
                        </div>
                        <p className="text-sm text-neutral-600">{job.company}</p>
                        <p className="text-xs text-neutral-500">{job.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 mb-2">
                          {job.matchPercentage}% match
                        </Badge>
                        <Button 
                          size="sm" 
                          className="block w-full text-center"
                          onClick={() => setSelectedJobForApplication({
                            id: job.id,
                            title: job.title,
                            company: job.company,
                            location: job.location,
                            salary: job.salary
                          })}
                          disabled={appliedJobs?.has(job.id)}
                        >
                          {appliedJobs?.has(job.id) ? 'Applied' : 'Apply'}
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-neutral-500">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                      <p className="font-medium mb-1">No saved jobs yet</p>
                      <p className="text-sm">Save jobs from search results to see them here</p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => onNavigate('job-activity?view=saved')}
                >
                  View All Saved Jobs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Job Alerts & Recommended Jobs */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            
            {/* Job Alerts */}
            <Card className="border-neutral-200 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Job Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {jobAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-neutral-900">{alert.name}</h5>
                        <p className="text-sm text-neutral-600">{alert.criteria}</p>
                        <p className="text-xs text-neutral-500">{alert.matchCount} new job{alert.matchCount !== 1 ? 's' : ''} this week</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditAlert(alert)}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => onNavigate('job-activity?view=alerts')}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Create New Alert
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card className="border-neutral-200 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Recommended Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-neutral-900">{job.title}</h5>
                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                            {job.matchPercentage}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600">{job.company}</p>
                        <p className="text-xs text-neutral-500">{job.location} • {job.postedDate}</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedJobForApplication({
                          id: job.id,
                          title: job.title,
                          company: job.company,
                          location: job.location,
                          salary: job.salary
                        })}
                        disabled={appliedJobs?.has(job.id)}
                      >
                        {appliedJobs?.has(job.id) ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => onNavigate('job-activity?view=recommendations')}
                >
                  View All Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Apply Now Modal */}
        {selectedJobForApplication && (
          <ApplyNowModal
            job={selectedJobForApplication}
            onClose={() => setSelectedJobForApplication(null)}
            onSubmit={onJobApplicationSubmit}
            userProfile={userProfile}
            currentUser={currentUser}
          />
        )}

        {/* Create Alert Modal */}
        {showCreateAlertModal && (
          <CreateAlertModal
            onClose={() => {
              setShowCreateAlertModal(false);
              setEditingAlert(null);
            }}
            onSubmit={handleCreateAlertSubmit}
            editingAlert={editingAlert}
          />
        )}

      </div>
    </div>
  );
}