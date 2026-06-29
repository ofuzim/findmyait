import React, { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { JobsPage } from "./components/JobsPage";
import { QuizPage } from "./components/QuizPage";
import { DedicatedQuizInterface } from "./components/DedicatedQuizInterface";
import { QuizPreloader } from "./components/QuizPreloader";
import { UserDashboard } from "./components/UserDashboard";
import { ResourcesPage } from "./components/ResourcesPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { CookiePage } from "./components/CookiePage";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { ProfileCompletionPage } from "./components/ProfileCompletionPage";
import { AccountSettingsPage } from "./components/AccountSettingsPage";
import { JobActivityPage } from "./components/JobActivityPage";
import { ViewMatchesPage } from "./components/ViewMatchesPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { DevToolsPanel } from "./components/DevToolsPanel";
import SupabaseTestPage from "./components/SupabaseTestPage";
import { LocalStorageAuth, LocalStorageHealthCheck } from "./utils/localStorage";
import { Toaster } from "./components/ui/sonner";
import { getCurrentPage, navigateToPage } from "./utils/router";

export default function App() {
  // Initialize currentPage from URL
  const [currentPage, setCurrentPage] = useState<string>(() => getCurrentPage());
  const [showQuizPreloader, setShowQuizPreloader] = useState<boolean>(false);
  
  // Authentication state - PLACEHOLDER using LocalStorage
  // ⚠️ In production: This would use a proper auth context/provider
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingJobApplication, setPendingJobApplication] = useState<any>(null);
  
  // Application tracking - PLACEHOLDER using LocalStorage
  // ⚠️ In production: This would be managed by backend API
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  
  // Saved jobs tracking - PLACEHOLDER using LocalStorage
  // ⚠️ In production: This would be managed by backend API
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  
  // 🛠️ DEVELOPMENT TOOLS - DevToolsPanel for localStorage management
  // Only available in development mode for testing localStorage functionality
  const [showDevTools, setShowDevTools] = useState<boolean>(false);
  
  // Storage state tracking
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  
  // Mock user profile data - simplified initial state for performance
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    education: '',
    currentPosition: '',
    yearsExperience: '',
    hasLicense: false,
    licenseNumber: '',
    availableStartDate: '',
    salaryExpectation: '',
    relocateWilling: '',
    referralSource: '',
    resumeFile: undefined,
    profilePhoto: undefined
  });

  // 🛠️ DEVELOPMENT TOOLS - Keyboard shortcut to open DevToolsPanel
  // Press Ctrl+Shift+D (or Cmd+Shift+D on Mac) to open dev tools
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setShowDevTools(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🔄 URL ROUTING - Listen for browser navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const newPage = getCurrentPage();
      setCurrentPage(newPage);
      // Scroll to top when navigating via browser back/forward
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 📄 UPDATE PAGE TITLE - Set browser tab title based on current page
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      'home': 'FindMyAIT - Find Your Administrator in Training Position',
      'jobs': 'Find AIT Jobs - FindMyAIT',
      'quiz': 'NAB Exam Prep - FindMyAIT',
      'quiz-practice': 'Practice Quiz - FindMyAIT',
      'dashboard': 'My Dashboard - FindMyAIT',
      'job-activity': 'Job Activity - FindMyAIT',
      'view-matches': 'Job Matches - FindMyAIT',
      'resources': 'Resources - FindMyAIT',
      'about': 'About Us - FindMyAIT',
      'contact': 'Contact Us - FindMyAIT',
      'privacy': 'Privacy Policy - FindMyAIT',
      'terms': 'Terms of Service - FindMyAIT',
      'cookie': 'Cookie Policy - FindMyAIT',
      'login': 'Login - FindMyAIT',
      'signup': 'Sign Up - FindMyAIT',
      'profile-completion': 'Complete Your Profile - FindMyAIT',
      'account-settings': 'Account Settings - FindMyAIT',
      'test-supabase': 'Supabase Test - FindMyAIT',
    };

    const basePageName = currentPage.split('?')[0];
    document.title = pageTitles[basePageName] || 'FindMyAIT';
  }, [currentPage]);

  // 🔄 SIMPLIFIED AUTH CHECK - Fast initialization
  useEffect(() => {
    // Initialize with logged-out state immediately
    setIsLoggedIn(false);
    setCurrentUser(null);
    
    // Simple localStorage test
    try {
      localStorage.setItem('__test__', 'test');
      localStorage.removeItem('__test__');
      setStorageAvailable(true);
      
      // Immediate auth check - no complex scheduling
      const existingUser = LocalStorageAuth.getCurrentUser();
      const isUserLoggedIn = LocalStorageAuth.isLoggedIn();
      
      if (existingUser && isUserLoggedIn) {
        console.log('✅ Restored user session:', existingUser.email);
        setIsLoggedIn(true);
        setCurrentUser(existingUser);
        setUserProfile(prev => ({
          ...prev,
          firstName: existingUser.firstName || '',
          lastName: existingUser.lastName || '',
          email: existingUser.email || ''
        }));
        
        // Load user data in simple background
        setTimeout(() => loadUserDataBackground(existingUser.id), 50);
      }
      
    } catch (error) {
      console.warn('⚠️ localStorage not available, app will work in memory-only mode');
      setStorageAvailable(false);
    }
  }, []);

  // Simplified background user data loading
  const loadUserDataBackground = (userId: string) => {
    if (!storageAvailable) return;
    
    try {
      // Load all data at once - no staggered timing
      const userAppliedJobs = LocalStorageAuth.getUserApplications(userId);
      const userSavedJobs = LocalStorageAuth.getUserSavedJobs(userId);
      const userProfileData = LocalStorageAuth.getUserProfile(userId);
      
      setAppliedJobs(new Set(userAppliedJobs));
      setSavedJobs(new Set(userSavedJobs));
      
      if (userProfileData) {
        setUserProfile(prev => ({ ...prev, ...userProfileData }));
      }
      
      console.log('✅ Loaded user data');
    } catch (error) {
      console.warn('⚠️ Failed to load user data:', error);
    }
  };

  const handleNavigation = (page: string) => {
    console.log('🎯 Navigating to:', page);
    
    if (page === 'quiz-practice') {
      setShowQuizPreloader(true);
      return;
    }
    
    // Scroll to top of page on navigation
    window.scrollTo(0, 0);
    
    // Direct state update without complex routing
    setCurrentPage(page);
    
    // Update URL in background
    try {
      const path = page.includes('?') ? `/${page.split('?')[0]}?${page.split('?')[1]}` : `/${page}`;
      window.history.pushState({ page }, '', path);
    } catch (error) {
      console.error('❌ URL update error:', error);
    }
  };

  const handleLogin = (user: any) => {
    // Immediate UI updates
    setIsLoggedIn(true);
    setCurrentUser(user);
    setUserProfile(prev => ({
      ...prev,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || ''
    }));
    
    // Navigate immediately with URL update
    if (pendingJobApplication) {
      navigateToPage('jobs');
      setCurrentPage('jobs');
    } else {
      navigateToPage('dashboard');
      setCurrentPage('dashboard');
    }
    
    // Simple background localStorage
    if (storageAvailable) {
      try {
        LocalStorageAuth.setLoggedInStatus(true);
        setTimeout(() => loadUserDataBackground(user.id), 10);
      } catch (error) {
        console.warn('⚠️ Login save failed:', error);
      }
    }
  };

  const handleLogout = () => {
    // Immediate state clear
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPendingJobApplication(null);
    setAppliedJobs(new Set());
    setSavedJobs(new Set());
    setUserProfile({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      education: '',
      currentPosition: '',
      yearsExperience: '',
      hasLicense: false,
      licenseNumber: '',
      availableStartDate: '',
      salaryExpectation: '',
      relocateWilling: '',
      referralSource: '',
      resumeFile: undefined,
      profilePhoto: undefined
    });
    
    // Navigate to home with URL update
    navigateToPage('home');
    setCurrentPage('home');
    
    // Simple localStorage clear
    if (storageAvailable) {
      try {
        LocalStorageAuth.logoutUser();
      } catch (error) {
        console.warn('⚠️ Logout cleanup failed:', error);
      }
    }
  };

  const handleSignupSuccess = (user: any) => {
    console.log('✅ Signup successful for user:', user.email);
    
    // Simple quiz reminder
    if (storageAvailable && user?.id) {
      try {
        const reminderSent = LocalStorageAuth.sendQuizReminder(user.id);
        if (reminderSent) {
          console.log('✅ Quiz reminder sent');
        }
      } catch (error) {
        console.warn('⚠️ Quiz reminder failed:', error);
      }
    }
  };

  const handleJobApplicationSubmit = (jobId: string, jobTitle?: string, companyName?: string) => {
    if (currentUser) {
      // Update UI immediately
      setAppliedJobs(prev => new Set([...prev, jobId]));
      
      // Simple localStorage save
      if (storageAvailable) {
        try {
          LocalStorageAuth.addJobApplication(currentUser.id, jobId);
          console.log('✅ Job application saved:', jobId);
        } catch (error) {
          console.warn('⚠️ Failed to save job application:', error);
        }
      }
    }
  };

  const handleJobApplicationAttempt = (job: any) => {
    if (!isLoggedIn) {
      // Store the job they want to apply for and redirect to login
      setPendingJobApplication(job);
      navigateToPage('login');
      setCurrentPage('login');
      return false; // Indicates login required
    }
    return true; // User is logged in, can proceed
  };

  const handleSaveJobAttempt = (jobId: string) => {
    if (!isLoggedIn || !currentUser) {
      return false;
    }
    
    // Update UI immediately
    setSavedJobs(prev => {
      const newSavedJobs = new Set(prev);
      if (newSavedJobs.has(jobId)) {
        newSavedJobs.delete(jobId);
      } else {
        newSavedJobs.add(jobId);
      }
      return newSavedJobs;
    });
    
    // Simple localStorage save
    if (storageAvailable) {
      try {
        LocalStorageAuth.toggleSavedJob(currentUser.id, jobId);
        console.log('✅ Saved job toggled:', jobId);
      } catch (error) {
        console.warn('⚠️ Failed to toggle saved job:', error);
      }
    }
    
    return true;
  };

  const handleQuizPreloaderComplete = () => {
    setShowQuizPreloader(false);
    navigateToPage('quiz-practice');
    setCurrentPage('quiz-practice');
  };

  const handleProfileUpdate = () => {
    // Reload user profile data from localStorage after updates
    if (currentUser?.id && storageAvailable) {
      try {
        const userProfileData = LocalStorageAuth.getUserProfile(currentUser.id);
        if (userProfileData) {
          setUserProfile(prev => ({ ...prev, ...userProfileData }));
          console.log('✅ Profile data refreshed');
        }
      } catch (error) {
        console.warn('⚠️ Failed to refresh profile data:', error);
      }
    }
  };

  // No loading screen needed - app starts immediately

  // Show quiz preloader when transitioning to quiz practice
  if (showQuizPreloader) {
    return <QuizPreloader onComplete={handleQuizPreloaderComplete} />;
  }

  if (currentPage.startsWith('jobs')) {
    try {
      return (
        <>
          <JobsPage 
            onNavigate={handleNavigation} 
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onLogout={handleLogout}
            userProfile={userProfile}
            pendingJobApplication={pendingJobApplication}
            onJobApplicationAttempt={handleJobApplicationAttempt}
            onClearPendingApplication={() => setPendingJobApplication(null)}
            onJobApplicationSubmit={handleJobApplicationSubmit}
            onSaveJobAttempt={handleSaveJobAttempt}
            appliedJobs={appliedJobs}
            savedJobs={savedJobs}
          />
          <Toaster />
        </>
      );
    } catch (error) {
      console.error('Error rendering JobsPage:', error);
      return <div>Error loading jobs page. Please refresh.</div>;
    }
  }

  if (currentPage === 'quiz') {
    return (
      <>
        <QuizPage onNavigate={handleNavigation} isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'quiz-practice') {
    return (
      <>
        <DedicatedQuizInterface onNavigate={handleNavigation} isLoggedIn={isLoggedIn} currentUser={currentUser} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'dashboard') {
    try {
      return (
        <>
          <UserDashboard 
            onNavigate={handleNavigation} 
            onLogout={handleLogout}
            userProfile={userProfile}
            currentUser={currentUser} 
            onJobApplicationSubmit={handleJobApplicationSubmit}
            appliedJobs={appliedJobs}
            savedJobs={savedJobs}
          />
          <Toaster />
        </>
      );
    } catch (error) {
      console.error('Error rendering UserDashboard:', error);
      return <div>Error loading dashboard. Please refresh.</div>;
    }
  }

  if (currentPage.startsWith('job-activity')) {
    try {
      // Parse query parameter for initial view
      const urlParams = new URLSearchParams(currentPage.split('?')[1] || '');
      const initialView = urlParams.get('view') as 'applications' | 'saved' | 'recommendations' | 'alerts' || 'applications';
      
      return (
        <>
          <JobActivityPage 
            onNavigate={handleNavigation} 
            onLogout={handleLogout}
            userProfile={userProfile}
            currentUser={currentUser}
            initialView={initialView}
            onJobApplicationSubmit={handleJobApplicationSubmit}
            isLoggedIn={isLoggedIn}
            pendingJobApplication={pendingJobApplication}
            onJobApplicationAttempt={handleJobApplicationAttempt}
            onClearPendingApplication={() => setPendingJobApplication(null)}
            onSaveJobAttempt={handleSaveJobAttempt}
            appliedJobs={appliedJobs}
            savedJobs={savedJobs}
          />
          <Toaster />
        </>
      );
    } catch (error) {
      console.error('Error rendering JobActivityPage:', error);
      return <div>Error loading job activity page. Please refresh.</div>;
    }
  }

  if (currentPage.startsWith('view-matches')) {
    // Parse alert data from URL parameters
    const urlParams = new URLSearchParams(currentPage.split('?')[1] || '');
    const alertName = urlParams.get('name') || '';
    const alertCriteria = urlParams.get('criteria') || '';
    const alertLocation = urlParams.get('location') || '';
    const alertState = urlParams.get('state') || '';
    const alertCity = urlParams.get('city') || '';
    const matchCount = parseInt(urlParams.get('matches') || '0');
    
    // Reconstruct alert object from URL parameters
    const alert = {
      name: alertName,
      criteria: alertCriteria,
      location: alertLocation,
      state: alertState,
      city: alertCity,
      matchCount: matchCount,
      id: urlParams.get('id') || 'unknown'
    };
    
    return (
      <>
        <ViewMatchesPage
          onNavigate={handleNavigation}
          onLogout={handleLogout}
          alert={alert}
          onJobApplicationSubmit={handleJobApplicationSubmit}
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          currentUser={currentUser}
          pendingJobApplication={pendingJobApplication}
          onJobApplicationAttempt={handleJobApplicationAttempt}
          onClearPendingApplication={() => setPendingJobApplication(null)}
          onSaveJobAttempt={handleSaveJobAttempt}
          appliedJobs={appliedJobs}
          savedJobs={savedJobs}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'resources') {
    return (
      <>
        <ResourcesPage onNavigate={handleNavigation} isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'about') {
    return (
      <>
        <AboutPage onNavigate={handleNavigation} isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'contact') {
    return (
      <>
        <ContactPage onNavigate={handleNavigation} isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'privacy') {
    return (
      <>
        <PrivacyPage onNavigate={handleNavigation} isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'terms') {
    return (
      <>
        <TermsPage onNavigate={handleNavigation} isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'cookie') {
    return (
      <>
        <CookiePage onNavigate={handleNavigation} isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  if (currentPage.startsWith('login')) {
    // Parse query parameters for signup success
    const urlParams = new URLSearchParams(currentPage.split('?')[1] || '');
    const signupSuccess = urlParams.get('signup') === 'success';
    const signupEmail = urlParams.get('email') || '';
    
    return (
      <>
        <LoginPage 
          onNavigate={handleNavigation} 
          onLogin={handleLogin}
          pendingJobApplication={pendingJobApplication}
          signupSuccess={signupSuccess}
          signupEmail={signupEmail}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'signup') {
    return (
      <>
        <SignUpPage 
          onNavigate={handleNavigation} 
          onSignupSuccess={handleSignupSuccess}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'profile-completion') {
    return (
      <>
        <ProfileCompletionPage onNavigate={handleNavigation} onLogout={handleLogout} currentUser={currentUser} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'account-settings') {
    return (
      <>
        <AccountSettingsPage onNavigate={handleNavigation} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} currentUser={currentUser} userProfile={userProfile} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'test-supabase') {
    return (
      <>
        <SupabaseTestPage />
        <Toaster />
      </>
    );
  }

  // Handle unknown routes - show 404 page
  const validPages = [
    'home', 'jobs', 'quiz', 'quiz-practice', 'dashboard', 'job-activity', 
    'view-matches', 'resources', 'about', 'contact', 'privacy', 'terms', 
    'cookie', 'login', 'signup', 'profile-completion', 'account-settings', 'test-supabase'
  ];
  
  const basePageName = currentPage.split('?')[0];
  
  if (!validPages.includes(basePageName)) {
    return (
      <>
        <NotFoundPage 
          onNavigate={handleNavigation} 
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <LandingPage 
        onNavigate={handleNavigation} 
        onLogout={handleLogout}
        currentUser={currentUser}
        userProfile={userProfile}
      />
      <Toaster />
      
      {/* 🛠️ DEVELOPMENT TOOLS - DevToolsPanel for localStorage management */}
      {/* Only render when actually open to save resources */}
      {showDevTools && (
        <DevToolsPanel
          currentUser={currentUser}
          isOpen={showDevTools}
          onClose={() => setShowDevTools(false)}
        />
      )}
    </>
  );
}