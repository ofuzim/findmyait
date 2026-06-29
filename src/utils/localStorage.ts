/**
 * LOCAL STORAGE UTILITY - PLACEHOLDER/TEST IMPLEMENTATION
 * 
 * ⚠️  IMPORTANT: This is a temporary local storage implementation for testing purposes.
 * In a production application, this would be replaced with:
 * - Backend authentication system (Auth0, Firebase Auth, custom JWT, etc.)
 * - Database storage (PostgreSQL, MongoDB, etc.)
 * - Secure API endpoints for user management
 * 
 * This utility handles:
 * - User registration and authentication
 * - User profile data
 * - Job applications and saved jobs
 * - User preferences and settings
 * 
 * All data is stored in browser localStorage and will persist across sessions
 * but will be lost if the user clears their browser data.
 */

// Storage keys for different data types
const STORAGE_KEYS = {
  USERS: 'findmyait_users',
  CURRENT_USER: 'findmyait_current_user',
  IS_LOGGED_IN: 'findmyait_is_logged_in',
  USER_PROFILES: 'findmyait_user_profiles',
  USER_APPLICATIONS: 'findmyait_user_applications',
  USER_APPLICATION_DETAILS: 'findmyait_user_application_details', // Detailed application submissions
  USER_SAVED_JOBS: 'findmyait_user_saved_jobs',
  USER_PREFERENCES: 'findmyait_user_preferences',
  USER_QUIZ_PROGRESS: 'findmyait_user_quiz_progress',
  USER_QUIZ_SESSIONS: 'findmyait_user_quiz_sessions',
  USER_DAILY_QUIZ_PROGRESS: 'findmyait_user_daily_quiz_progress',
  USER_JOB_ALERTS: 'findmyait_user_job_alerts',
  USER_NOTIFICATION_PREFERENCES: 'findmyait_user_notification_preferences',
  USER_NOTIFICATIONS: 'findmyait_user_notifications',
  USER_EMAIL_TEMPLATES: 'findmyait_user_email_templates',
  GUEST_QUIZ_ATTEMPTS: 'findmyait_guest_quiz_attempts', // Guest user quiz restrictions
} as const;

// Types for our local storage data
export interface StoredUser {
  id: string;
  email: string;
  password: string; // ⚠️ In real app, this would be hashed server-side
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserProfile {
  userId: string;
  // Basic profile fields
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  education?: string;
  currentPosition?: string;
  yearsExperience?: string;
  hasLicense?: boolean;
  licenseNumber?: string;
  availableStartDate?: string;
  salaryExpectation?: string;
  relocateWilling?: string;
  referralSource?: string;
  resumeFile?: {
    name: string;
    size: number;
    type: string;
    url?: string; // For legacy compatibility or when using external URLs
    data?: string; // Base64 data for localStorage storage (PLACEHOLDER for testing)
    uploadedAt?: string;
  };
  
  // Profile photo support for signup
  profilePhoto?: {
    name: string;
    size: number;
    type: string;
    url?: string; // For legacy compatibility or when using external URLs  
    data?: string; // Base64 data for localStorage storage (PLACEHOLDER for testing)
    uploadedAt?: string;
  };
  
  // Extended profile fields from ProfileCompletionPage
  // Section 1: Leadership Development
  leadershipGrowth?: string;
  leadershipLesson?: string;
  ltcMotivation?: string;
  
  // Section 2: Flexibility & Fit
  relocateForAIT?: string;
  relocateForWork?: string;
  availableStates?: string[];
  earliestStart?: { month: string; year: string };
  
  // Section 3: Professional Background
  employmentStatus?: string;
  educationLevel?: string;
  degreeField?: string;
  university?: string;
  graduationDate?: string;
  gpa?: string;
  additionalEducation?: string;
  certifications?: string[];
  otherCertification?: string;
  
  // Section 4: Soft Signals
  leadershipStyle?: string;
  learningApproach?: string;
  nonHealthcareSkill?: string;
  
  // Section 5: Additional Info
  profileChanges?: string;
  expectedChanges?: string;
  virtualInterviews?: boolean;
  additionalInfo?: string;
  
  // Profile completion tracking
  profileCompleted?: boolean;
  profileCompletionStep?: number;
  
  updatedAt: string;
}

export interface UserApplications {
  userId: string;
  appliedJobs: string[];
  updatedAt: string;
}

export interface UserSavedJobs {
  userId: string;
  savedJobs: string[];
  updatedAt: string;
}

export interface JobApplicationDetail {
  id: string; // Unique application ID
  userId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  // Form data from ApplyNowModal
  formData: {
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    // Professional Information
    education: string;
    currentPosition: string;
    yearsExperience: string;
    licenseNumber: string;
    hasLicense: boolean;
    // Application Details
    availableStartDate: string;
    salaryExpectation: string;
    relocateWilling: string;
    referralSource: string;
    // Cover Letter & Motivation
    coverLetter: string;
    motivation: string;
    questions: string;
    // Resume file metadata (actual file would be uploaded to server in production)
    // ⚠️ Only storing metadata to avoid localStorage quota issues
    resumeFile?: {
      name: string;
      size: number;
      type: string;
      // Note: url and data are not stored in localStorage
    };
  };
  // Application status (for future enhancements)
  status?: 'pending' | 'under_review' | 'interview' | 'rejected' | 'accepted';
  statusText?: string;
  updatedAt: string;
}

export interface UserApplicationDetails {
  userId: string;
  applications: JobApplicationDetail[];
  updatedAt: string;
}

export interface QuizSession {
  id: string;
  userId: string;
  questionIds: number[]; // Randomized order of question IDs
  currentQuestionIndex: number;
  answers: { [questionId: number]: string };
  correctAnswers: number;
  startTime: string;
  endTime?: string;
  completed: boolean;
  score?: number;
  timeSpent?: number; // in minutes
}

export interface UserQuizProgress {
  userId: string;
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageScore: number;
  bestScore: number;
  timeSpentTotal: number; // in minutes
  lastQuizDate: string;
  currentStreak: number;
  longestStreak: number;
  categoryStats: {
    [category: string]: {
      questionsAnswered: number;
      correctAnswers: number;
      averageScore: number;
    };
  };
  sessions: QuizSession[];
  updatedAt: string;
}

export interface DailyQuizProgress {
  userId: string;
  date: string; // YYYY-MM-DD format
  questionIds: number[]; // Randomized order for this day
  currentQuestionIndex: number; // Where user left off
  answers: { [questionId: number]: string }; // Answers given today
  correctAnswers: number; // Correct answers for today
  questionsAnswered: number; // Total questions answered today
  sessionStartTime: string;
  lastActivityTime: string;
  completed: boolean; // Whether daily limit reached
  dailyScore: number; // Score for today's session
  timeSpentToday: number; // Time spent today in minutes
  skippedQuestions: number[]; // Questions skipped today
}

export interface GuestQuizAttempt {
  timestamp: string; // ISO timestamp of when quiz was taken
  completed: boolean;
  score: number;
  questionsAnswered: number;
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  criteria: string;
  frequency: string;
  created: string;
  updated: string;
  matchCount: number;
  active: boolean;
  // Detailed criteria fields
  keywords?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  jobType?: string;
  experienceLevel?: string;
}

export interface UserJobAlerts {
  userId: string;
  alerts: JobAlert[];
  updatedAt: string;
}

export interface NotificationPreferences {
  userId: string;
  // Email notification settings
  emailNotifications: {
    jobAlerts: boolean;
    newJobMatches: boolean;
    applicationUpdates: boolean;
    quizReminders: boolean;
    weeklyDigest: boolean;
    monthlyReport: boolean;
  };
  // Frequency settings
  alertFrequency: 'immediate' | 'daily' | 'weekly';
  digestFrequency: 'daily' | 'weekly' | 'monthly';
  // Communication preferences
  preferredEmailTime: string; // HH:MM format
  preferredDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  // Mobile/Push notifications (for future implementation)
  pushNotifications: {
    enabled: boolean;
    jobAlerts: boolean;
    quizReminders: boolean;
    applicationUpdates: boolean;
  };
  // Marketing preferences
  marketingEmails: boolean;
  productUpdates: boolean;
  partnerOffers: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  type: 'job_alert' | 'application_update' | 'quiz_reminder' | 'system' | 'achievement' | 'new_feature';
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  archived: boolean;
  relatedJobId?: string;
  relatedAlertId?: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
}

export interface UserNotifications {
  userId: string;
  notifications: InAppNotification[];
  unreadCount: number;
  lastReadAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  type: 'job_alert' | 'weekly_digest' | 'application_confirmation' | 'quiz_reminder' | 'welcome';
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[]; // List of template variables like {{firstName}}, {{jobTitle}}
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationHistory {
  id: string;
  userId: string;
  type: 'email' | 'push' | 'sms';
  templateId: string;
  subject: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  metadata?: {
    [key: string]: any;
  };
}

/**
 * localStorage health check utility
 */
export class LocalStorageHealthCheck {
  static testLocalStoragePerformance(): { isHealthy: boolean; responseTime: number } {
    try {
      const startTime = Date.now();
      const testKey = '__findmyait_health_check__';
      const testValue = 'health_check_' + Date.now();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      const responseTime = Date.now() - startTime;
      const isHealthy = retrieved === testValue && responseTime < 100;
      
      return { isHealthy, responseTime };
    } catch (error) {
      return { isHealthy: false, responseTime: -1 };
    }
  }
}

/**
 * PLACEHOLDER AUTH UTILITY CLASS
 * Handles all localStorage operations for user management
 */
export class LocalStorageAuth {
  /**
   * Register a new user - PLACEHOLDER IMPLEMENTATION
   * In production: Would send to /api/auth/register endpoint
   */
  static registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): { success: boolean; message: string; user?: StoredUser } {
    try {
      const users = this.getAllUsers();
      
      // Check if user already exists
      if (users.find(user => user.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists' };
      }

      // Create new user
      const newUser: StoredUser = {
        id: this.generateUserId(),
        email: userData.email.toLowerCase(),
        password: userData.password, // ⚠️ PLACEHOLDER - would be hashed in real app
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString()
      };

      // Save user
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Initialize user data structures
      this.initializeUserData(newUser.id);

      return { success: true, message: 'Account created successfully', user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Failed to create account' };
    }
  }

  /**
   * Authenticate user login - PLACEHOLDER IMPLEMENTATION
   * In production: Would send to /api/auth/login endpoint
   */
  static loginUser(email: string, password: string): { success: boolean; message: string; user?: StoredUser } {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password // ⚠️ PLACEHOLDER - would verify hash in real app
      );

      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = user;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Set current user and logged-in flag
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

      return { success: true, message: 'Login successful', user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  /**
   * Get current logged-in user with timeout protection
   */
  static getCurrentUser(): StoredUser | null {
    try {
      // Add timeout protection for localStorage access
      const startTime = Date.now();
      const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const elapsed = Date.now() - startTime;
      
      if (elapsed > 1000) { // Log if localStorage is slow
        console.warn('⚠️ Slow localStorage access detected:', elapsed + 'ms');
      }
      
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is currently logged in with timeout protection
   */
  static isLoggedIn(): boolean {
    try {
      const startTime = Date.now();
      const loggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      const elapsed = Date.now() - startTime;
      
      if (elapsed > 500) {
        console.warn('⚠️ Slow localStorage login check:', elapsed + 'ms');
        return false; // Assume not logged in if localStorage is too slow
      }
      
      // Quick check without calling getCurrentUser to avoid double localStorage access
      return loggedIn === 'true';
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  /**
   * Set logged-in status
   */
  static setLoggedInStatus(status: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, status.toString());
    } catch (error) {
      console.error('Error setting login status:', error);
    }
  }

  /**
   * Logout current user
   */
  static logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
  }

  /**
   * Get user profile data
   */
  static getUserProfile(userId: string): UserProfile | null {
    try {
      const profiles = this.getAllUserProfiles();
      return profiles.find(profile => profile.userId === userId) || null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile - PLACEHOLDER IMPLEMENTATION
   */
  static updateUserProfile(userId: string, profileData: Partial<UserProfile>): boolean {
    try {
      const profiles = this.getAllUserProfiles();
      const profileIndex = profiles.findIndex(profile => profile.userId === userId);

      if (profileIndex >= 0) {
        profiles[profileIndex] = {
          ...profiles[profileIndex],
          ...profileData,
          userId,
          updatedAt: new Date().toISOString()
        };
      } else {
        profiles.push({
          userId,
          ...profileData,
          updatedAt: new Date().toISOString()
        } as UserProfile);
      }

      localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  /**
   * Get user's applied jobs
   */
  static getUserApplications(userId: string): string[] {
    try {
      const applications = this.getAllUserApplications();
      const userApps = applications.find(app => app.userId === userId);
      return userApps?.appliedJobs || [];
    } catch (error) {
      console.error('Error getting user applications:', error);
      return [];
    }
  }

  /**
   * Add job application for user
   */
  static addJobApplication(userId: string, jobId: string, applicationData?: Partial<JobApplicationDetail>): boolean {
    try {
      const applications = this.getAllUserApplications();
      const appIndex = applications.findIndex(app => app.userId === userId);

      if (appIndex >= 0) {
        if (!applications[appIndex].appliedJobs.includes(jobId)) {
          applications[appIndex].appliedJobs.push(jobId);
          applications[appIndex].updatedAt = new Date().toISOString();
        }
      } else {
        applications.push({
          userId,
          appliedJobs: [jobId],
          updatedAt: new Date().toISOString()
        });
      }

      localStorage.setItem(STORAGE_KEYS.USER_APPLICATIONS, JSON.stringify(applications));
      
      // If detailed application data is provided, save it separately
      if (applicationData) {
        this.saveApplicationDetail(userId, jobId, applicationData);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding job application:', error);
      return false;
    }
  }

  /**
   * Save detailed application data
   */
  static saveApplicationDetail(userId: string, jobId: string, applicationData: Partial<JobApplicationDetail>): boolean {
    try {
      const allDetails = this.getAllApplicationDetails();
      const userDetailsIndex = allDetails.findIndex(d => d.userId === userId);
      
      const newApplication: JobApplicationDetail = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        jobId,
        jobTitle: applicationData.jobTitle || '',
        companyName: applicationData.companyName || '',
        appliedDate: new Date().toISOString(),
        formData: applicationData.formData || {} as any,
        status: 'pending',
        statusText: 'Application Submitted',
        updatedAt: new Date().toISOString()
      };

      if (userDetailsIndex >= 0) {
        // Check if application already exists for this job
        const existingAppIndex = allDetails[userDetailsIndex].applications.findIndex(
          app => app.jobId === jobId
        );
        
        if (existingAppIndex >= 0) {
          // Update existing application
          allDetails[userDetailsIndex].applications[existingAppIndex] = newApplication;
        } else {
          // Add new application
          allDetails[userDetailsIndex].applications.push(newApplication);
        }
        allDetails[userDetailsIndex].updatedAt = new Date().toISOString();
      } else {
        // Create new user application details entry
        allDetails.push({
          userId,
          applications: [newApplication],
          updatedAt: new Date().toISOString()
        });
      }

      localStorage.setItem(STORAGE_KEYS.USER_APPLICATION_DETAILS, JSON.stringify(allDetails));
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('Error saving application detail: localStorage quota exceeded');
        console.warn('💾 Attempting to free up space by keeping only recent applications...');
        
        // Try to keep only the last 10 applications per user to free up space
        try {
          const allDetails = this.getAllApplicationDetails();
          const cleanedDetails = allDetails.map(userDetail => ({
            ...userDetail,
            applications: userDetail.applications
              .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
              .slice(0, 10) // Keep only 10 most recent applications
          }));
          
          localStorage.setItem(STORAGE_KEYS.USER_APPLICATION_DETAILS, JSON.stringify(cleanedDetails));
          console.log('✅ Cleaned up old application data. Please try again.');
        } catch (cleanupError) {
          console.error('Failed to clean up application data:', cleanupError);
        }
      } else {
        console.error('Error saving application detail:', error);
      }
      return false;
    }
  }

  /**
   * Get detailed application data for a specific job
   */
  static getApplicationDetail(userId: string, jobId: string): JobApplicationDetail | null {
    try {
      const allDetails = this.getAllApplicationDetails();
      const userDetails = allDetails.find(d => d.userId === userId);
      
      if (!userDetails) return null;
      
      const application = userDetails.applications.find(app => app.jobId === jobId);
      return application || null;
    } catch (error) {
      console.error('Error getting application detail:', error);
      return null;
    }
  }

  /**
   * Get all detailed applications for a user
   */
  static getAllUserApplicationDetails(userId: string): JobApplicationDetail[] {
    try {
      const allDetails = this.getAllApplicationDetails();
      const userDetails = allDetails.find(d => d.userId === userId);
      return userDetails?.applications || [];
    } catch (error) {
      console.error('Error getting user application details:', error);
      return [];
    }
  }

  /**
   * Get user's saved jobs
   */
  static getUserSavedJobs(userId: string): string[] {
    try {
      const savedJobs = this.getAllUserSavedJobs();
      const userSaved = savedJobs.find(saved => saved.userId === userId);
      return userSaved?.savedJobs || [];
    } catch (error) {
      console.error('Error getting user saved jobs:', error);
      return [];
    }
  }

  /**
   * Toggle saved job for user
   */
  static toggleSavedJob(userId: string, jobId: string): boolean {
    try {
      const savedJobs = this.getAllUserSavedJobs();
      const savedIndex = savedJobs.findIndex(saved => saved.userId === userId);

      if (savedIndex >= 0) {
        const jobIndex = savedJobs[savedIndex].savedJobs.indexOf(jobId);
        if (jobIndex >= 0) {
          savedJobs[savedIndex].savedJobs.splice(jobIndex, 1);
        } else {
          savedJobs[savedIndex].savedJobs.push(jobId);
        }
        savedJobs[savedIndex].updatedAt = new Date().toISOString();
      } else {
        savedJobs.push({
          userId,
          savedJobs: [jobId],
          updatedAt: new Date().toISOString()
        });
      }

      localStorage.setItem(STORAGE_KEYS.USER_SAVED_JOBS, JSON.stringify(savedJobs));
      return true;
    } catch (error) {
      console.error('Error toggling saved job:', error);
      return false;
    }
  }

  // Private helper methods
  private static getAllUsers(): StoredUser[] {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  private static getAllUserProfiles(): UserProfile[] {
    try {
      const profiles = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
      return profiles ? JSON.parse(profiles) : [];
    } catch (error) {
      console.error('Error getting user profiles:', error);
      return [];
    }
  }

  private static getAllUserApplications(): UserApplications[] {
    try {
      const applications = localStorage.getItem(STORAGE_KEYS.USER_APPLICATIONS);
      return applications ? JSON.parse(applications) : [];
    } catch (error) {
      console.error('Error getting user applications:', error);
      return [];
    }
  }

  private static getAllApplicationDetails(): UserApplicationDetails[] {
    try {
      const details = localStorage.getItem(STORAGE_KEYS.USER_APPLICATION_DETAILS);
      return details ? JSON.parse(details) : [];
    } catch (error) {
      console.error('Error getting application details:', error);
      return [];
    }
  }

  private static getAllUserSavedJobs(): UserSavedJobs[] {
    try {
      const savedJobs = localStorage.getItem(STORAGE_KEYS.USER_SAVED_JOBS);
      return savedJobs ? JSON.parse(savedJobs) : [];
    } catch (error) {
      console.error('Error getting user saved jobs:', error);
      return [];
    }
  }

  private static generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Check if email already exists - PLACEHOLDER IMPLEMENTATION
   * In production: Would check via /api/auth/check-email endpoint
   */
  static checkEmailExists(email: string): boolean {
    try {
      const users = this.getAllUsers();
      return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  // 🎯 ENHANCED JOB RECOMMENDATIONS - Generate recommendations based on user preferences
  // In production: This would be an AI/ML recommendation API call
  static generateJobRecommendations(
    mockJobs: any[], 
    userProfile: any, 
    maxResults: number = 6,
    recommendationType: 'dashboard' | 'activity' = 'activity'
  ) {
    const userAvailableStates = userProfile?.availableStates || [];
    
    // If user hasn't set available states, show default recommendations from all states
    if (userAvailableStates.length === 0) {
      return mockJobs.slice(0, maxResults).map((job, index) => ({
        id: job.id,
        company: job.company,
        position: recommendationType === 'dashboard' ? job.title : job.title,
        title: job.title, // For dashboard compatibility
        location: job.location,
        salary: job.salary,
        matchPercentage: 85 + (index * 2), // Simulate match percentage
        jobType: "Full-time",
        remote: job.isRemote || false,
        postedDate: this.getRandomPostedDate(index),
        reason: `Matches your ${job.facilityType?.toLowerCase() || 'healthcare'} experience preferences`
      }));
    }
    
    // Filter jobs by user's available states and score them higher
    const stateFilteredJobs = mockJobs.filter(job => 
      userAvailableStates.includes(job.state)
    );
    
    // If we have state-filtered jobs, use them; otherwise fall back to all jobs
    const jobsToUse = stateFilteredJobs.length > 0 ? stateFilteredJobs : mockJobs;
    
    return jobsToUse.slice(0, maxResults).map((job, index) => ({
      id: job.id,
      company: job.company,
      position: recommendationType === 'dashboard' ? job.title : job.title,
      title: job.title, // For dashboard compatibility
      location: job.location,
      salary: job.salary,
      matchPercentage: stateFilteredJobs.length > 0 ? 90 + (maxResults - index) : 85 + (index * 2),
      jobType: "Full-time",
      remote: job.isRemote || false,
      postedDate: this.getRandomPostedDate(index),
      reason: stateFilteredJobs.length > 0 
        ? `Perfect location match in ${job.state} - one of your preferred states`
        : `Matches your ${job.facilityType?.toLowerCase() || 'healthcare'} experience preferences`
    }));
  }

  private static getRandomPostedDate(index: number): string {
    const dates = ["1 day ago", "2 days ago", "3 days ago", "1 week ago", "5 days ago", "4 days ago"];
    return dates[index % dates.length];
  }

  private static initializeUserData(userId: string): void {
    // Initialize empty profile
    this.updateUserProfile(userId, {});
    
    // Initialize empty applications
    const applications = this.getAllUserApplications();
    applications.push({
      userId,
      appliedJobs: [],
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.USER_APPLICATIONS, JSON.stringify(applications));

    // Initialize empty saved jobs
    const savedJobs = this.getAllUserSavedJobs();
    savedJobs.push({
      userId,
      savedJobs: [],
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.USER_SAVED_JOBS, JSON.stringify(savedJobs));


    
    // Initialize job alerts
    this.initializeUserJobAlerts(userId);
    
    // Initialize notification preferences
    this.initializeNotificationPreferences(userId);
    
    // Initialize notifications
    this.initializeUserNotifications(userId);
  }

  /**
   * Complete user profile - PLACEHOLDER IMPLEMENTATION
   * Called when user finishes the ProfileCompletionPage
   */
  static completeUserProfile(userId: string, profileData: Partial<UserProfile>): boolean {
    try {
      const updatedProfile = {
        ...profileData,
        userId,
        profileCompleted: true,
        profileCompletionStep: 5, // Completed
        updatedAt: new Date().toISOString()
      };
      
      const success = this.updateUserProfile(userId, updatedProfile);
      
      if (success) {
        // Clear any temporary profile completion data
        localStorage.removeItem('profileFormData');
        localStorage.removeItem('profileCurrentStep');
      }
      
      return success;
    } catch (error) {
      console.error('Error completing user profile:', error);
      return false;
    }
  }

  /**
   * Save profile completion progress - PLACEHOLDER IMPLEMENTATION
   * For auto-saving during profile completion
   */
  static saveProfileProgress(userId: string, formData: any, currentStep: number): boolean {
    try {
      // Save to user profile
      this.updateUserProfile(userId, {
        ...formData,
        profileCompletionStep: currentStep,
        updatedAt: new Date().toISOString()
      });

      // Also save temporary data for form recovery
      localStorage.setItem('profileFormData', JSON.stringify(formData));
      localStorage.setItem('profileCurrentStep', currentStep.toString());
      localStorage.setItem('profileUserId', userId);

      return true;
    } catch (error) {
      console.error('Error saving profile progress:', error);
      return false;
    }
  }

  /**
   * Load profile completion progress - PLACEHOLDER IMPLEMENTATION
   */
  static loadProfileProgress(userId: string): { formData: any; currentStep: number } | null {
    try {
      const savedUserId = localStorage.getItem('profileUserId');
      
      // Only load if it's for the same user
      if (savedUserId !== userId) {
        return null;
      }

      const formData = localStorage.getItem('profileFormData');
      const currentStep = localStorage.getItem('profileCurrentStep');

      if (formData && currentStep) {
        return {
          formData: JSON.parse(formData),
          currentStep: parseInt(currentStep, 10)
        };
      }

      // If no temporary data, try to load from user profile
      const userProfile = this.getUserProfile(userId);
      if (userProfile && userProfile.profileCompletionStep) {
        return {
          formData: userProfile,
          currentStep: userProfile.profileCompletionStep
        };
      }

      return null;
    } catch (error) {
      console.error('Error loading profile progress:', error);
      return null;
    }
  }

  /**
   * Check if user profile is completed
   */
  static isProfileCompleted(userId: string): boolean {
    try {
      const userProfile = this.getUserProfile(userId);
      return userProfile?.profileCompleted === true;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }

  /**
   * Get profile completion percentage - PLACEHOLDER IMPLEMENTATION
   */
  static getProfileCompletionPercentage(userId: string): number {
    try {
      const userProfile = this.getUserProfile(userId);
      if (!userProfile) return 0;
      
      if (userProfile.profileCompleted) return 100;
      
      // Calculate based on completed step (1-5)
      const step = userProfile.profileCompletionStep || 0;
      return Math.min((step / 5) * 100, 95); // Max 95% if not fully completed
    } catch (error) {
      console.error('Error calculating profile completion:', error);
      return 0;
    }
  }

  /**
   * QUIZ PROGRESS METHODS - PLACEHOLDER IMPLEMENTATION
   */

  /**
   * Start a new quiz session with randomized questions
   */
  static startQuizSession(userId: string, availableQuestionIds: number[], maxQuestions: number = 50): QuizSession {
    try {
      // Shuffle questions using Fisher-Yates algorithm
      const shuffledIds = [...availableQuestionIds];
      for (let i = shuffledIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
      }

      // Take only the maximum number of questions needed
      const selectedQuestionIds = shuffledIds.slice(0, Math.min(maxQuestions, shuffledIds.length));

      const session: QuizSession = {
        id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        userId,
        questionIds: selectedQuestionIds,
        currentQuestionIndex: 0,
        answers: {},
        correctAnswers: 0,
        startTime: new Date().toISOString(),
        completed: false
      };

      return session;
    } catch (error) {
      console.error('Error starting quiz session:', error);
      throw error;
    }
  }

  /**
   * Update quiz session progress
   */
  static updateQuizSession(session: QuizSession): boolean {
    try {
      const progress = this.getUserQuizProgress(session.userId);
      if (progress) {
        const sessionIndex = progress.sessions.findIndex(s => s.id === session.id);
        if (sessionIndex >= 0) {
          progress.sessions[sessionIndex] = session;
        } else {
          progress.sessions.push(session);
        }
        progress.updatedAt = new Date().toISOString();
        return this.saveUserQuizProgress(progress);
      }
      return false;
    } catch (error) {
      console.error('Error updating quiz session:', error);
      return false;
    }
  }

  /**
   * Complete a quiz session and update overall progress
   */
  static completeQuizSession(session: QuizSession): boolean {
    try {
      // Mark session as completed
      session.completed = true;
      session.endTime = new Date().toISOString();
      
      // Calculate final metrics
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);
      session.timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 60000); // minutes
      session.score = Math.round((session.correctAnswers / Object.keys(session.answers).length) * 100);

      // Update user's overall progress
      let progress = this.getUserQuizProgress(session.userId);
      if (!progress) {
        progress = this.initializeUserQuizProgress(session.userId);
      }

      // Update session in progress
      const sessionIndex = progress.sessions.findIndex(s => s.id === session.id);
      if (sessionIndex >= 0) {
        progress.sessions[sessionIndex] = session;
      } else {
        progress.sessions.push(session);
      }

      // Update overall stats
      progress.totalQuizzesTaken += 1;
      progress.totalQuestionsAnswered += Object.keys(session.answers).length;
      progress.totalCorrectAnswers += session.correctAnswers;
      progress.averageScore = Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100);
      progress.bestScore = Math.max(progress.bestScore, session.score || 0);
      progress.timeSpentTotal += session.timeSpent || 0;
      progress.lastQuizDate = session.endTime || new Date().toISOString();
      
      // Update streak (simplified - consecutive days)
      const today = new Date().toDateString();
      const lastQuizDate = new Date(progress.lastQuizDate).toDateString();
      if (today === lastQuizDate) {
        // Same day, maintain streak
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (yesterday.toDateString() === lastQuizDate) {
          progress.currentStreak += 1;
        } else {
          progress.currentStreak = 1; // Reset streak
        }
      }
      progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);

      progress.updatedAt = new Date().toISOString();

      return this.saveUserQuizProgress(progress);
    } catch (error) {
      console.error('Error completing quiz session:', error);
      return false;
    }
  }

  /**
   * Get user's quiz progress
   */
  static getUserQuizProgress(userId: string): UserQuizProgress | null {
    try {
      const allProgress = this.getAllUserQuizProgress();
      return allProgress.find(progress => progress.userId === userId) || null;
    } catch (error) {
      console.error('Error getting user quiz progress:', error);
      return null;
    }
  }

  /**
   * Get user's active quiz session
   */
  static getUserActiveQuizSession(userId: string): QuizSession | null {
    try {
      const progress = this.getUserQuizProgress(userId);
      if (progress) {
        return progress.sessions.find(session => !session.completed) || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting active quiz session:', error);
      return null;
    }
  }

  /**
   * Initialize user quiz progress
   */
  static initializeUserQuizProgress(userId: string): UserQuizProgress {
    const progress: UserQuizProgress = {
      userId,
      totalQuizzesTaken: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      averageScore: 0,
      bestScore: 0,
      timeSpentTotal: 0,
      lastQuizDate: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
      categoryStats: {},
      sessions: [],
      updatedAt: new Date().toISOString()
    };

    this.saveUserQuizProgress(progress);
    return progress;
  }

  /**
   * Save user quiz progress
   */
  private static saveUserQuizProgress(progress: UserQuizProgress): boolean {
    try {
      const allProgress = this.getAllUserQuizProgress();
      const progressIndex = allProgress.findIndex(p => p.userId === progress.userId);

      if (progressIndex >= 0) {
        allProgress[progressIndex] = progress;
      } else {
        allProgress.push(progress);
      }

      localStorage.setItem(STORAGE_KEYS.USER_QUIZ_PROGRESS, JSON.stringify(allProgress));
      return true;
    } catch (error) {
      console.error('Error saving user quiz progress:', error);
      return false;
    }
  }

  /**
   * Get all user quiz progress data
   */
  private static getAllUserQuizProgress(): UserQuizProgress[] {
    try {
      const progress = localStorage.getItem(STORAGE_KEYS.USER_QUIZ_PROGRESS);
      return progress ? JSON.parse(progress) : [];
    } catch (error) {
      console.error('Error getting all user quiz progress:', error);
      return [];
    }
  }

  /**
   * DAILY QUIZ PROGRESS METHODS - Enhanced tracking for logged-in users
   */

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private static getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get user's daily quiz progress for a specific date
   */
  static getDailyQuizProgress(userId: string, date?: string): DailyQuizProgress | null {
    try {
      const targetDate = date || this.getTodayDate();
      const allDailyProgress = this.getAllDailyQuizProgress();
      return allDailyProgress.find(progress => 
        progress.userId === userId && progress.date === targetDate
      ) || null;
    } catch (error) {
      console.error('Error getting daily quiz progress:', error);
      return null;
    }
  }

  /**
   * Get user's today's daily quiz progress
   */
  static getTodayQuizProgress(userId: string): DailyQuizProgress | null {
    return this.getDailyQuizProgress(userId, this.getTodayDate());
  }

  /**
   * Initialize daily quiz progress for a user
   */
  static initializeDailyQuizProgress(userId: string): DailyQuizProgress {
    const today = this.getTodayDate();
    const dailyProgress: DailyQuizProgress = {
      userId,
      date: today,
      questionIds: [],
      currentQuestionIndex: 0,
      answers: {},
      correctAnswers: 0,
      questionsAnswered: 0,
      sessionStartTime: new Date().toISOString(),
      lastActivityTime: new Date().toISOString(),
      completed: false,
      dailyScore: 0,
      timeSpentToday: 0,
      skippedQuestions: []
    };

    this.saveDailyQuizProgress(dailyProgress);
    return dailyProgress;
  }

  /**
   * Start or continue daily quiz session
   */
  static startDailyQuizSession(userId: string, availableQuestionIds: number[], maxQuestions: number = 50): DailyQuizProgress {
    try {
      const today = this.getTodayDate();
      let dailyProgress = this.getDailyQuizProgress(userId, today);

      if (!dailyProgress) {
        // Create new daily progress
        dailyProgress = {
          userId,
          date: today,
          questionIds: this.shuffleQuestions(availableQuestionIds).slice(0, maxQuestions),
          currentQuestionIndex: 0,
          answers: {},
          correctAnswers: 0,
          questionsAnswered: 0,
          sessionStartTime: new Date().toISOString(),
          lastActivityTime: new Date().toISOString(),
          completed: false,
          dailyScore: 0,
          timeSpentToday: 0,
          skippedQuestions: []
        };
      } else if (dailyProgress.questionIds.length === 0) {
        // Re-initialize questions if they were somehow lost
        dailyProgress.questionIds = this.shuffleQuestions(availableQuestionIds).slice(0, maxQuestions);
      }

      // Update last activity time
      dailyProgress.lastActivityTime = new Date().toISOString();

      this.saveDailyQuizProgress(dailyProgress);
      return dailyProgress;
    } catch (error) {
      console.error('Error starting daily quiz session:', error);
      throw error;
    }
  }

  /**
   * Update daily quiz progress with answer
   */
  static updateDailyQuizProgress(
    userId: string, 
    questionId: number, 
    selectedAnswer: string, 
    isCorrect: boolean,
    isSkipped: boolean = false
  ): DailyQuizProgress | null {
    try {
      const today = this.getTodayDate();
      const dailyProgress = this.getDailyQuizProgress(userId, today);
      
      if (!dailyProgress) {
        console.error('No daily progress found for user');
        return null;
      }

      // Update answers
      dailyProgress.answers[questionId] = selectedAnswer;
      dailyProgress.lastActivityTime = new Date().toISOString();

      // Update counters
      if (!isSkipped) {
        dailyProgress.questionsAnswered += 1;
        if (isCorrect) {
          dailyProgress.correctAnswers += 1;
        }
      } else {
        // Track skipped questions
        if (!dailyProgress.skippedQuestions.includes(questionId)) {
          dailyProgress.skippedQuestions.push(questionId);
        }
        dailyProgress.questionsAnswered += 1; // Count skips as answered for progress
      }

      // Calculate daily score
      if (dailyProgress.questionsAnswered > 0) {
        dailyProgress.dailyScore = Math.round((dailyProgress.correctAnswers / dailyProgress.questionsAnswered) * 100);
      }

      // Calculate time spent today
      const sessionStart = new Date(dailyProgress.sessionStartTime);
      const now = new Date();
      dailyProgress.timeSpentToday = Math.floor((now.getTime() - sessionStart.getTime()) / 60000);

      this.saveDailyQuizProgress(dailyProgress);
      return dailyProgress;
    } catch (error) {
      console.error('Error updating daily quiz progress:', error);
      return null;
    }
  }

  /**
   * Move to next question in daily progress
   */
  static nextDailyQuestion(userId: string): DailyQuizProgress | null {
    try {
      const today = this.getTodayDate();
      const dailyProgress = this.getDailyQuizProgress(userId, today);
      
      if (!dailyProgress) {
        return null;
      }

      // Move to next question
      dailyProgress.currentQuestionIndex += 1;
      dailyProgress.lastActivityTime = new Date().toISOString();

      // Check if daily limit reached
      const maxQuestions = 50; // Could be configurable
      if (dailyProgress.currentQuestionIndex >= maxQuestions || 
          dailyProgress.currentQuestionIndex >= dailyProgress.questionIds.length) {
        dailyProgress.completed = true;
      }

      this.saveDailyQuizProgress(dailyProgress);
      return dailyProgress;
    } catch (error) {
      console.error('Error moving to next daily question:', error);
      return null;
    }
  }

  /**
   * Complete daily quiz session
   */
  static completeDailyQuizSession(userId: string): boolean {
    try {
      const today = this.getTodayDate();
      const dailyProgress = this.getDailyQuizProgress(userId, today);
      
      if (!dailyProgress) {
        return false;
      }

      dailyProgress.completed = true;
      dailyProgress.lastActivityTime = new Date().toISOString();

      // Calculate final metrics
      const sessionStart = new Date(dailyProgress.sessionStartTime);
      const now = new Date();
      dailyProgress.timeSpentToday = Math.floor((now.getTime() - sessionStart.getTime()) / 60000);

      if (dailyProgress.questionsAnswered > 0) {
        dailyProgress.dailyScore = Math.round((dailyProgress.correctAnswers / dailyProgress.questionsAnswered) * 100);
      }

      this.saveDailyQuizProgress(dailyProgress);

      // Update overall user quiz progress
      this.updateOverallProgressFromDaily(userId, dailyProgress);

      return true;
    } catch (error) {
      console.error('Error completing daily quiz session:', error);
      return false;
    }
  }

  /**
   * Check if user has reached daily question limit
   */
  static hasReachedDailyLimit(userId: string, maxQuestions: number = 50): boolean {
    try {
      const dailyProgress = this.getTodayQuizProgress(userId);
      if (!dailyProgress) {
        return false;
      }
      
      return dailyProgress.completed || 
             dailyProgress.currentQuestionIndex >= maxQuestions ||
             dailyProgress.currentQuestionIndex >= dailyProgress.questionIds.length;
    } catch (error) {
      console.error('Error checking daily limit:', error);
      return false;
    }
  }

  /**
   * Get daily quiz statistics for user
   */
  static getDailyQuizStats(userId: string): {
    questionsAnswered: number;
    correctAnswers: number;
    currentStep: number;
    dailyScore: number;
    timeSpentToday: number;
    completed: boolean;
    skippedQuestions: number;
  } {
    try {
      const dailyProgress = this.getTodayQuizProgress(userId);
      
      if (!dailyProgress) {
        return {
          questionsAnswered: 0,
          correctAnswers: 0,
          currentStep: 0,
          dailyScore: 0,
          timeSpentToday: 0,
          completed: false,
          skippedQuestions: 0
        };
      }

      return {
        questionsAnswered: dailyProgress.questionsAnswered,
        correctAnswers: dailyProgress.correctAnswers,
        currentStep: dailyProgress.currentQuestionIndex,
        dailyScore: dailyProgress.dailyScore,
        timeSpentToday: dailyProgress.timeSpentToday,
        completed: dailyProgress.completed,
        skippedQuestions: dailyProgress.skippedQuestions.length
      };
    } catch (error) {
      console.error('Error getting daily quiz stats:', error);
      return {
        questionsAnswered: 0,
        correctAnswers: 0,
        currentStep: 0,
        dailyScore: 0,
        timeSpentToday: 0,
        completed: false,
        skippedQuestions: 0
      };
    }
  }

  /**
   * Get user's quiz history for past days
   */
  static getUserQuizHistory(userId: string, days: number = 30): DailyQuizProgress[] {
    try {
      const allDailyProgress = this.getAllDailyQuizProgress();
      const userProgress = allDailyProgress.filter(progress => progress.userId === userId);
      
      // Sort by date (newest first) and limit to requested days
      return userProgress
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, days);
    } catch (error) {
      console.error('Error getting user quiz history:', error);
      return [];
    }
  }

  /**
   * Private helper methods for daily quiz progress
   */
  private static shuffleQuestions(questionIds: number[]): number[] {
    const shuffled = [...questionIds];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private static saveDailyQuizProgress(dailyProgress: DailyQuizProgress): boolean {
    try {
      const allDailyProgress = this.getAllDailyQuizProgress();
      const progressIndex = allDailyProgress.findIndex(p => 
        p.userId === dailyProgress.userId && p.date === dailyProgress.date
      );

      if (progressIndex >= 0) {
        allDailyProgress[progressIndex] = dailyProgress;
      } else {
        allDailyProgress.push(dailyProgress);
      }

      localStorage.setItem(STORAGE_KEYS.USER_DAILY_QUIZ_PROGRESS, JSON.stringify(allDailyProgress));
      return true;
    } catch (error) {
      console.error('Error saving daily quiz progress:', error);
      return false;
    }
  }

  private static getAllDailyQuizProgress(): DailyQuizProgress[] {
    try {
      const progress = localStorage.getItem(STORAGE_KEYS.USER_DAILY_QUIZ_PROGRESS);
      return progress ? JSON.parse(progress) : [];
    } catch (error) {
      console.error('Error getting all daily quiz progress:', error);
      return [];
    }
  }

  private static updateOverallProgressFromDaily(userId: string, dailyProgress: DailyQuizProgress): void {
    try {
      let overallProgress = this.getUserQuizProgress(userId);
      if (!overallProgress) {
        overallProgress = this.initializeUserQuizProgress(userId);
      }

      // Update overall statistics
      overallProgress.totalQuestionsAnswered += dailyProgress.questionsAnswered;
      overallProgress.totalCorrectAnswers += dailyProgress.correctAnswers;
      overallProgress.timeSpentTotal += dailyProgress.timeSpentToday;
      overallProgress.lastQuizDate = dailyProgress.lastActivityTime;

      // Update averages
      if (overallProgress.totalQuestionsAnswered > 0) {
        overallProgress.averageScore = Math.round(
          (overallProgress.totalCorrectAnswers / overallProgress.totalQuestionsAnswered) * 100
        );
      }

      // Update best score
      overallProgress.bestScore = Math.max(overallProgress.bestScore, dailyProgress.dailyScore);

      // Update streak logic
      const today = new Date().toDateString();
      const lastQuizDate = new Date(overallProgress.lastQuizDate).toDateString();
      
      if (today !== lastQuizDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (yesterday.toDateString() === lastQuizDate) {
          overallProgress.currentStreak += 1;
        } else {
          overallProgress.currentStreak = 1;
        }
        
        overallProgress.longestStreak = Math.max(
          overallProgress.longestStreak, 
          overallProgress.currentStreak
        );
      }

      if (dailyProgress.completed) {
        overallProgress.totalQuizzesTaken += 1;
      }

      overallProgress.updatedAt = new Date().toISOString();
      this.saveUserQuizProgress(overallProgress);
    } catch (error) {
      console.error('Error updating overall progress from daily:', error);
    }
  }

  /**
   * JOB ALERTS METHODS - PLACEHOLDER IMPLEMENTATION
   * In production: These would be API calls to backend services
   */

  /**
   * Initialize user job alerts
   */
  static initializeUserJobAlerts(userId: string): UserJobAlerts {
    const userAlerts: UserJobAlerts = {
      userId,
      alerts: [],
      updatedAt: new Date().toISOString()
    };

    this.saveUserJobAlerts(userAlerts);
    return userAlerts;
  }

  /**
   * Get all job alerts for a user
   */
  static getUserJobAlerts(userId: string): JobAlert[] {
    try {
      const allAlerts = this.getAllUserJobAlerts();
      const userAlerts = allAlerts.find(alerts => alerts.userId === userId);
      return userAlerts?.alerts || [];
    } catch (error) {
      console.error('Error getting user job alerts:', error);
      return [];
    }
  }

  /**
   * Create a new job alert
   */
  static createJobAlert(userId: string, alertData: Omit<JobAlert, 'id' | 'userId' | 'created' | 'updated'>): JobAlert | null {
    try {
      const newAlert: JobAlert = {
        id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        userId,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        ...alertData
      };

      const allAlerts = this.getAllUserJobAlerts();
      const userAlertsIndex = allAlerts.findIndex(alerts => alerts.userId === userId);

      if (userAlertsIndex >= 0) {
        allAlerts[userAlertsIndex].alerts.push(newAlert);
        allAlerts[userAlertsIndex].updatedAt = new Date().toISOString();
      } else {
        allAlerts.push({
          userId,
          alerts: [newAlert],
          updatedAt: new Date().toISOString()
        });
      }

      localStorage.setItem(STORAGE_KEYS.USER_JOB_ALERTS, JSON.stringify(allAlerts));
      return newAlert;
    } catch (error) {
      console.error('Error creating job alert:', error);
      return null;
    }
  }

  /**
   * Update an existing job alert
   */
  static updateJobAlert(userId: string, alertId: string, updateData: Partial<Omit<JobAlert, 'id' | 'userId' | 'created'>>): boolean {
    try {
      const allAlerts = this.getAllUserJobAlerts();
      const userAlertsIndex = allAlerts.findIndex(alerts => alerts.userId === userId);

      if (userAlertsIndex >= 0) {
        const alertIndex = allAlerts[userAlertsIndex].alerts.findIndex(alert => alert.id === alertId);
        
        if (alertIndex >= 0) {
          allAlerts[userAlertsIndex].alerts[alertIndex] = {
            ...allAlerts[userAlertsIndex].alerts[alertIndex],
            ...updateData,
            updated: new Date().toISOString()
          };
          allAlerts[userAlertsIndex].updatedAt = new Date().toISOString();
          
          localStorage.setItem(STORAGE_KEYS.USER_JOB_ALERTS, JSON.stringify(allAlerts));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error updating job alert:', error);
      return false;
    }
  }

  /**
   * Delete a job alert
   */
  static deleteJobAlert(userId: string, alertId: string): boolean {
    try {
      const allAlerts = this.getAllUserJobAlerts();
      const userAlertsIndex = allAlerts.findIndex(alerts => alerts.userId === userId);

      if (userAlertsIndex >= 0) {
        const alertIndex = allAlerts[userAlertsIndex].alerts.findIndex(alert => alert.id === alertId);
        
        if (alertIndex >= 0) {
          allAlerts[userAlertsIndex].alerts.splice(alertIndex, 1);
          allAlerts[userAlertsIndex].updatedAt = new Date().toISOString();
          
          localStorage.setItem(STORAGE_KEYS.USER_JOB_ALERTS, JSON.stringify(allAlerts));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting job alert:', error);
      return false;
    }
  }

  /**
   * Toggle job alert active status
   */
  static toggleJobAlert(userId: string, alertId: string): boolean {
    try {
      const allAlerts = this.getAllUserJobAlerts();
      const userAlertsIndex = allAlerts.findIndex(alerts => alerts.userId === userId);

      if (userAlertsIndex >= 0) {
        const alertIndex = allAlerts[userAlertsIndex].alerts.findIndex(alert => alert.id === alertId);
        
        if (alertIndex >= 0) {
          allAlerts[userAlertsIndex].alerts[alertIndex].active = !allAlerts[userAlertsIndex].alerts[alertIndex].active;
          allAlerts[userAlertsIndex].alerts[alertIndex].updated = new Date().toISOString();
          allAlerts[userAlertsIndex].updatedAt = new Date().toISOString();
          
          localStorage.setItem(STORAGE_KEYS.USER_JOB_ALERTS, JSON.stringify(allAlerts));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error toggling job alert:', error);
      return false;
    }
  }

  /**
   * Calculate match count for alerts (simulated)
   * In production: This would be a backend service that periodically checks for new job matches
   * Uses the same matching logic as ViewMatchesPage for consistency
   */
  static updateAlertMatchCounts(userId: string, mockJobs: any[]): boolean {
    try {
      const alerts = this.getUserJobAlerts(userId);
      
      alerts.forEach(alert => {
        // Use same filtering logic as ViewMatchesPage
        const criteriaLower = (alert.criteria || '').toLowerCase();
        let alertState = (alert.state || '').toLowerCase();
        let alertCity = (alert.city || '').toLowerCase();
        
        // Backward compatibility: If state/city not present but location is, try to parse it
        if (!alertState && !alertCity && alert.location) {
          const locationLower = alert.location.toLowerCase();
          // For old alerts with combined location, use as fallback for partial matching
          alertState = locationLower;
        }
        
        // Extract keywords from criteria
        const keywords = criteriaLower.split(/[\s,]+/).filter(k => k.length > 2);
        
        // Count matching jobs
        const matchCount = mockJobs.filter(job => {
          // Location match - if alert has location filter
          if (alertState || alertCity) {
            const jobLocation = job.location.toLowerCase(); // "Austin, TX"
            const jobState = job.state.toLowerCase(); // "Texas"
            
            let locationMatches = false;
            
            if (alertState && alertCity) {
              // Both state and city - must match both
              locationMatches = jobState === alertState && jobLocation.includes(alertCity);
            } else if (alertState) {
              // Only state - match state
              locationMatches = jobState === alertState;
            } else if (alertCity) {
              // Only city - match city
              locationMatches = jobLocation.includes(alertCity);
            }
            
            if (!locationMatches) return false;
          }
          
          // Criteria match - search in title, company, description, facility type
          if (keywords.length > 0) {
            const searchText = `${job.title} ${job.company} ${job.description} ${job.facilityType}`.toLowerCase();
            
            // Job must match at least one keyword
            const hasMatch = keywords.some(keyword => searchText.includes(keyword));
            if (!hasMatch) return false;
          }
          
          return true;
        }).length;
        
        // Update match count for this alert
        this.updateJobAlert(userId, alert.id, { matchCount });
      });
      
      return true;
    } catch (error) {
      console.error('Error updating alert match counts:', error);
      return false;
    }
  }

  /**
   * Private helper methods for job alerts
   */
  private static getAllUserJobAlerts(): UserJobAlerts[] {
    try {
      const alerts = localStorage.getItem(STORAGE_KEYS.USER_JOB_ALERTS);
      return alerts ? JSON.parse(alerts) : [];
    } catch (error) {
      console.error('Error getting all user job alerts:', error);
      return [];
    }
  }

  private static saveUserJobAlerts(userAlerts: UserJobAlerts): boolean {
    try {
      const allAlerts = this.getAllUserJobAlerts();
      const alertsIndex = allAlerts.findIndex(alerts => alerts.userId === userAlerts.userId);

      if (alertsIndex >= 0) {
        allAlerts[alertsIndex] = userAlerts;
      } else {
        allAlerts.push(userAlerts);
      }

      localStorage.setItem(STORAGE_KEYS.USER_JOB_ALERTS, JSON.stringify(allAlerts));
      return true;
    } catch (error) {
      console.error('Error saving user job alerts:', error);
      return false;
    }
  }

  /**
   * NOTIFICATION SYSTEM METHODS - PLACEHOLDER IMPLEMENTATION
   * In production: These would be API calls to notification/email services
   */

  /**
   * Initialize default notification preferences for a user
   */
  static initializeNotificationPreferences(userId: string): NotificationPreferences {
    const defaultPreferences: NotificationPreferences = {
      userId,
      emailNotifications: {
        jobAlerts: true,
        newJobMatches: true,
        applicationUpdates: true,
        quizReminders: true,
        weeklyDigest: true,
        monthlyReport: false
      },
      alertFrequency: 'daily',
      digestFrequency: 'weekly',
      preferredEmailTime: '09:00',
      preferredDay: 'monday',
      pushNotifications: {
        enabled: false,
        jobAlerts: false,
        quizReminders: false,
        applicationUpdates: false
      },
      marketingEmails: false,
      productUpdates: true,
      partnerOffers: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveNotificationPreferences(defaultPreferences);
    return defaultPreferences;
  }

  /**
   * Get user's notification preferences
   */
  static getNotificationPreferences(userId: string): NotificationPreferences | null {
    try {
      const allPreferences = this.getAllNotificationPreferences();
      return allPreferences.find(pref => pref.userId === userId) || null;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  /**
   * Update user's notification preferences
   */
  static updateNotificationPreferences(userId: string, updates: Partial<NotificationPreferences>): boolean {
    try {
      const allPreferences = this.getAllNotificationPreferences();
      const prefIndex = allPreferences.findIndex(pref => pref.userId === userId);

      if (prefIndex >= 0) {
        allPreferences[prefIndex] = {
          ...allPreferences[prefIndex],
          ...updates,
          userId,
          updatedAt: new Date().toISOString()
        };
      } else {
        const newPreferences = this.initializeNotificationPreferences(userId);
        allPreferences.push({
          ...newPreferences,
          ...updates,
          updatedAt: new Date().toISOString()
        });
      }

      localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATION_PREFERENCES, JSON.stringify(allPreferences));
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  /**
   * Initialize user notifications
   */
  static initializeUserNotifications(userId: string): UserNotifications {
    const userNotifications: UserNotifications = {
      userId,
      notifications: [],
      unreadCount: 0,
      lastReadAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveUserNotifications(userNotifications);
    
    // Create welcome notification
    this.createInAppNotification(userId, {
      type: 'system',
      title: 'Welcome to FindMyAIT!',
      message: 'Complete your profile to get personalized job recommendations and unlock all features.',
      actionUrl: 'profile-completion',
      actionText: 'Complete Profile',
      priority: 'medium'
    });

    return userNotifications;
  }

  /**
   * Create a new in-app notification
   */
  static createInAppNotification(userId: string, notificationData: {
    type: InAppNotification['type'];
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
    priority?: InAppNotification['priority'];
    relatedJobId?: string;
    relatedAlertId?: string;
    metadata?: { [key: string]: any };
  }): InAppNotification | null {
    try {
      const notification: InAppNotification = {
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
        actionText: notificationData.actionText,
        priority: notificationData.priority || 'medium',
        read: false,
        archived: false,
        relatedJobId: notificationData.relatedJobId,
        relatedAlertId: notificationData.relatedAlertId,
        metadata: notificationData.metadata,
        createdAt: new Date().toISOString()
      };

      const allUserNotifications = this.getAllUserNotifications();
      const userNotifIndex = allUserNotifications.findIndex(notifs => notifs.userId === userId);

      if (userNotifIndex >= 0) {
        allUserNotifications[userNotifIndex].notifications.unshift(notification); // Add to beginning
        allUserNotifications[userNotifIndex].unreadCount += 1;
        allUserNotifications[userNotifIndex].updatedAt = new Date().toISOString();
      } else {
        allUserNotifications.push({
          userId,
          notifications: [notification],
          unreadCount: 1,
          lastReadAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(allUserNotifications));
      return notification;
    } catch (error) {
      console.error('Error creating in-app notification:', error);
      return null;
    }
  }

  /**
   * Get user's in-app notifications
   */
  static getUserNotifications(userId: string, limit?: number, onlyUnread?: boolean): InAppNotification[] {
    try {
      const allUserNotifications = this.getAllUserNotifications();
      const userNotifications = allUserNotifications.find(notifs => notifs.userId === userId);
      
      if (!userNotifications) {
        return [];
      }

      let notifications = userNotifications.notifications;
      
      if (onlyUnread) {
        notifications = notifications.filter(n => !n.read);
      }

      if (limit) {
        notifications = notifications.slice(0, limit);
      }

      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static markNotificationAsRead(userId: string, notificationId: string): boolean {
    try {
      const allUserNotifications = this.getAllUserNotifications();
      const userNotifIndex = allUserNotifications.findIndex(notifs => notifs.userId === userId);

      if (userNotifIndex >= 0) {
        const notifIndex = allUserNotifications[userNotifIndex].notifications.findIndex(n => n.id === notificationId);
        
        if (notifIndex >= 0 && !allUserNotifications[userNotifIndex].notifications[notifIndex].read) {
          allUserNotifications[userNotifIndex].notifications[notifIndex].read = true;
          allUserNotifications[userNotifIndex].notifications[notifIndex].readAt = new Date().toISOString();
          allUserNotifications[userNotifIndex].unreadCount = Math.max(0, allUserNotifications[userNotifIndex].unreadCount - 1);
          allUserNotifications[userNotifIndex].updatedAt = new Date().toISOString();
          
          localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(allUserNotifications));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static markAllNotificationsAsRead(userId: string): boolean {
    try {
      const allUserNotifications = this.getAllUserNotifications();
      const userNotifIndex = allUserNotifications.findIndex(notifs => notifs.userId === userId);

      if (userNotifIndex >= 0) {
        const now = new Date().toISOString();
        allUserNotifications[userNotifIndex].notifications.forEach(notification => {
          if (!notification.read) {
            notification.read = true;
            notification.readAt = now;
          }
        });
        
        allUserNotifications[userNotifIndex].unreadCount = 0;
        allUserNotifications[userNotifIndex].lastReadAt = now;
        allUserNotifications[userNotifIndex].updatedAt = now;
        
        localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(allUserNotifications));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Archive a notification
   */
  static archiveNotification(userId: string, notificationId: string): boolean {
    try {
      const allUserNotifications = this.getAllUserNotifications();
      const userNotifIndex = allUserNotifications.findIndex(notifs => notifs.userId === userId);

      if (userNotifIndex >= 0) {
        const notifIndex = allUserNotifications[userNotifIndex].notifications.findIndex(n => n.id === notificationId);
        
        if (notifIndex >= 0) {
          allUserNotifications[userNotifIndex].notifications[notifIndex].archived = true;
          allUserNotifications[userNotifIndex].notifications[notifIndex].archivedAt = new Date().toISOString();
          
          // If it was unread, decrease unread count
          if (!allUserNotifications[userNotifIndex].notifications[notifIndex].read) {
            allUserNotifications[userNotifIndex].unreadCount = Math.max(0, allUserNotifications[userNotifIndex].unreadCount - 1);
          }
          
          allUserNotifications[userNotifIndex].updatedAt = new Date().toISOString();
          
          localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(allUserNotifications));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error archiving notification:', error);
      return false;
    }
  }

  /**
   * Get unread notification count for a user
   */
  static getUnreadNotificationCount(userId: string): number {
    try {
      const allUserNotifications = this.getAllUserNotifications();
      const userNotifications = allUserNotifications.find(notifs => notifs.userId === userId);
      return userNotifications?.unreadCount || 0;
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return 0;
    }
  }

  /**
   * Send job alert notification (simulated)
   * In production: This would trigger an actual email via SendGrid, AWS SES, etc.
   */
  static sendJobAlertNotification(userId: string, alert: JobAlert, matchingJobs: any[]): boolean {
    try {
      const preferences = this.getNotificationPreferences(userId);
      const user = this.getCurrentUser();
      
      if (!preferences?.emailNotifications.jobAlerts || !user) {
        return false;
      }

      // Create in-app notification
      this.createInAppNotification(userId, {
        type: 'job_alert',
        title: `New jobs matching "${alert.name}"`,
        message: `${matchingJobs.length} new job${matchingJobs.length !== 1 ? 's' : ''} found matching your alert criteria.`,
        actionUrl: `view-matches?id=${alert.id}&name=${encodeURIComponent(alert.name)}&criteria=${encodeURIComponent(alert.criteria)}&location=${encodeURIComponent(alert.location || '')}&matches=${matchingJobs.length}`,
        actionText: 'View Jobs',
        priority: 'medium',
        relatedAlertId: alert.id,
        metadata: {
          alertName: alert.name,
          matchCount: matchingJobs.length,
          jobIds: matchingJobs.map(job => job.id)
        }
      });

      // Simulate email notification logging
      console.log(`📧 SIMULATED EMAIL: Job alert notification sent to ${user.email}`);
      console.log(`Subject: New jobs matching "${alert.name}"`);
      console.log(`Found ${matchingJobs.length} matching jobs`);
      
      return true;
    } catch (error) {
      console.error('Error sending job alert notification:', error);
      return false;
    }
  }

  /**
   * Send application confirmation notification
   */
  static sendApplicationConfirmation(userId: string, jobId: string, jobTitle: string, companyName: string): boolean {
    try {
      const preferences = this.getNotificationPreferences(userId);
      
      if (!preferences?.emailNotifications.applicationUpdates) {
        return false;
      }

      // Create in-app notification
      this.createInAppNotification(userId, {
        type: 'application_update',
        title: 'Application Submitted',
        message: `Your application for ${jobTitle} at ${companyName} has been submitted successfully.`,
        actionUrl: 'job-activity?view=applications',
        actionText: 'View Applications',
        priority: 'medium',
        relatedJobId: jobId,
        metadata: {
          jobTitle,
          companyName,
          status: 'submitted'
        }
      });

      return true;
    } catch (error) {
      console.error('Error sending application confirmation:', error);
      return false;
    }
  }

  /**
   * Send quiz reminder notification
   */
  static sendQuizReminder(userId: string): boolean {
    try {
      const preferences = this.getNotificationPreferences(userId);
      
      if (!preferences?.emailNotifications.quizReminders) {
        return false;
      }

      const dailyProgress = this.getTodayQuizProgress(userId);
      const hasCompletedToday = dailyProgress?.completed || false;
      
      if (hasCompletedToday) {
        return false; // Don't send reminder if already completed today
      }

      // Create in-app notification
      this.createInAppNotification(userId, {
        type: 'quiz_reminder',
        title: 'Daily Quiz Practice',
        message: 'Keep your NAB exam prep on track! Take today\'s quiz to maintain your learning streak.',
        actionUrl: 'quiz-practice',
        actionText: 'Start Quiz',
        priority: 'low',
        metadata: {
          reminderType: 'daily',
          hasStartedToday: dailyProgress !== null
        }
      });

      return true;
    } catch (error) {
      console.error('Error sending quiz reminder:', error);
      return false;
    }
  }

  /**
   * Create achievement notification
   */
  static createAchievementNotification(userId: string, achievementType: string, details: any): boolean {
    try {
      let title = '';
      let message = '';
      
      switch (achievementType) {
        case 'quiz_streak':
          title = `🔥 ${details.streakDays} Day Streak!`;
          message = `Congratulations! You've maintained your quiz practice for ${details.streakDays} consecutive days.`;
          break;
        case 'quiz_milestone':
          title = `🎯 Quiz Milestone Reached!`;
          message = `You've completed ${details.totalQuizzes} practice quizzes. Keep up the excellent work!`;
          break;
        case 'profile_complete':
          title = `✅ Profile Complete!`;
          message = 'Your profile is now 100% complete. You\'ll receive better job recommendations!';
          break;
        case 'first_application':
          title = `🚀 First Application Submitted!`;
          message = 'You\'ve submitted your first job application. Good luck!';
          break;
        default:
          return false;
      }

      this.createInAppNotification(userId, {
        type: 'achievement',
        title,
        message,
        priority: 'low',
        metadata: {
          achievementType,
          ...details
        }
      });

      return true;
    } catch (error) {
      console.error('Error creating achievement notification:', error);
      return false;
    }
  }

  /**
   * Private helper methods for notifications
   */
  private static getAllNotificationPreferences(): NotificationPreferences[] {
    try {
      const preferences = localStorage.getItem(STORAGE_KEYS.USER_NOTIFICATION_PREFERENCES);
      return preferences ? JSON.parse(preferences) : [];
    } catch (error) {
      console.error('Error getting all notification preferences:', error);
      return [];
    }
  }

  private static saveNotificationPreferences(preferences: NotificationPreferences): boolean {
    try {
      const allPreferences = this.getAllNotificationPreferences();
      const prefIndex = allPreferences.findIndex(pref => pref.userId === preferences.userId);

      if (prefIndex >= 0) {
        allPreferences[prefIndex] = preferences;
      } else {
        allPreferences.push(preferences);
      }

      localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATION_PREFERENCES, JSON.stringify(allPreferences));
      return true;
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      return false;
    }
  }

  private static getAllUserNotifications(): UserNotifications[] {
    try {
      const notifications = localStorage.getItem(STORAGE_KEYS.USER_NOTIFICATIONS);
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Error getting all user notifications:', error);
      return [];
    }
  }

  private static saveUserNotifications(userNotifications: UserNotifications): boolean {
    try {
      const allUserNotifications = this.getAllUserNotifications();
      const notifIndex = allUserNotifications.findIndex(notifs => notifs.userId === userNotifications.userId);

      if (notifIndex >= 0) {
        allUserNotifications[notifIndex] = userNotifications;
      } else {
        allUserNotifications.push(userNotifications);
      }

      localStorage.setItem(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(allUserNotifications));
      return true;
    } catch (error) {
      console.error('Error saving user notifications:', error);
      return false;
    }
  }

  /**
   * Clean up old application details to free up localStorage space
   * Keeps only the most recent N applications per user
   */
  static cleanupOldApplications(maxApplicationsPerUser: number = 10): boolean {
    try {
      const allDetails = this.getAllApplicationDetails();
      let totalRemoved = 0;
      
      const cleanedDetails = allDetails.map(userDetail => {
        const originalCount = userDetail.applications.length;
        const sortedApplications = userDetail.applications
          .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
          .slice(0, maxApplicationsPerUser);
        
        totalRemoved += originalCount - sortedApplications.length;
        
        return {
          ...userDetail,
          applications: sortedApplications,
          updatedAt: new Date().toISOString()
        };
      });
      
      localStorage.setItem(STORAGE_KEYS.USER_APPLICATION_DETAILS, JSON.stringify(cleanedDetails));
      console.log(`✅ Cleaned up ${totalRemoved} old application(s), kept ${maxApplicationsPerUser} most recent per user`);
      return true;
    } catch (error) {
      console.error('Error cleaning up applications:', error);
      return false;
    }
  }

  /**
   * Clear all user data - for testing/development only
   */
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear temporary profile completion data
    localStorage.removeItem('profileFormData');
    localStorage.removeItem('profileCurrentStep');
    localStorage.removeItem('profileUserId');
  }

  /**
   * Get all localStorage data for debugging/export - for development only
   */
  static getAllData(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      try {
        const value = localStorage.getItem(key);
        data[name] = value ? JSON.parse(value) : null;
      } catch (error) {
        data[name] = localStorage.getItem(key); // If it's not JSON, store as string
      }
    });
    
    return data;
  }

  /**
   * Get storage usage statistics - for development only
   */
  static getStorageStats(): {
    totalKeys: number;
    totalSize: number;
    sizeByKey: { [key: string]: number };
    percentUsed: number;
  } {
    const sizeByKey: { [key: string]: number } = {};
    let totalSize = 0;
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const value = localStorage.getItem(key);
      const size = value ? new Blob([value]).size : 0;
      sizeByKey[name] = size;
      totalSize += size;
    });
    
    // Estimate localStorage limit (usually 5-10MB, we'll assume 5MB)
    const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
    const percentUsed = (totalSize / estimatedLimit) * 100;
    
    return {
      totalKeys: Object.keys(STORAGE_KEYS).length,
      totalSize,
      sizeByKey,
      percentUsed: Math.min(percentUsed, 100)
    };
  }

  /**
   * Validate data integrity - for development only
   */
  static validateDataIntegrity(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      // Check if current user exists in users list
      const currentUser = this.getCurrentUser();
      const allUsers = this.getAllUsers();
      
      if (currentUser && !allUsers.find(u => u.id === currentUser.id)) {
        errors.push('Current user not found in users list');
      }
      
      // Check if logged in status is consistent
      const isLoggedIn = this.isLoggedIn();
      if (isLoggedIn && !currentUser) {
        errors.push('Logged in status is true but no current user found');
      }
      
      // Check for orphaned data
      const allProfiles = this.getAllUserProfiles();
      const allApplications = this.getAllUserApplications();
      const allSavedJobs = this.getAllUserSavedJobs();
      
      const userIds = allUsers.map(u => u.id);
      
      allProfiles.forEach(profile => {
        if (!userIds.includes(profile.userId)) {
          warnings.push(`Orphaned profile found for user ${profile.userId}`);
        }
      });
      
      allApplications.forEach(apps => {
        if (!userIds.includes(apps.userId)) {
          warnings.push(`Orphaned applications found for user ${apps.userId}`);
        }
      });
      
      allSavedJobs.forEach(saved => {
        if (!userIds.includes(saved.userId)) {
          warnings.push(`Orphaned saved jobs found for user ${saved.userId}`);
        }
      });
      
    } catch (error) {
      errors.push(`Data validation error: ${error}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * ============================================
   * GUEST QUIZ ATTEMPT TRACKING
   * ============================================
   * Restricts guest (non-logged in) users to one quiz attempt per day
   * to encourage sign-ups while still providing value
   */

  /**
   * Check if guest user can take a quiz today
   * Returns true if they can take the quiz, false if they've already taken it today
   */
  static canGuestTakeQuiz(): boolean {
    try {
      const lastAttempt = this.getGuestLastQuizAttempt();
      
      if (!lastAttempt) {
        return true; // Never taken the quiz before
      }

      const lastAttemptDate = new Date(lastAttempt.timestamp);
      const now = new Date();
      
      // Check if it's a new day (using local timezone)
      const isSameDay = 
        lastAttemptDate.getFullYear() === now.getFullYear() &&
        lastAttemptDate.getMonth() === now.getMonth() &&
        lastAttemptDate.getDate() === now.getDate();
      
      return !isSameDay; // Can take quiz if it's a different day
    } catch (error) {
      console.error('Error checking guest quiz eligibility:', error);
      return true; // Allow quiz on error to not block users
    }
  }

  /**
   * Record that a guest user has taken the quiz
   */
  static recordGuestQuizAttempt(score?: number, questionsAnswered?: number): boolean {
    try {
      const attempt: GuestQuizAttempt = {
        timestamp: new Date().toISOString(),
        completed: true,
        score: score || 0,
        questionsAnswered: questionsAnswered || 5
      };

      localStorage.setItem(STORAGE_KEYS.GUEST_QUIZ_ATTEMPTS, JSON.stringify(attempt));
      console.log('✅ Guest quiz attempt recorded for today');
      return true;
    } catch (error) {
      console.error('Error recording guest quiz attempt:', error);
      return false;
    }
  }

  /**
   * Get guest user's last quiz attempt
   */
  static getGuestLastQuizAttempt(): GuestQuizAttempt | null {
    try {
      const attempt = localStorage.getItem(STORAGE_KEYS.GUEST_QUIZ_ATTEMPTS);
      return attempt ? JSON.parse(attempt) : null;
    } catch (error) {
      console.error('Error getting guest quiz attempt:', error);
      return null;
    }
  }

  /**
   * Get time remaining until guest can take quiz again
   * Returns null if they can take it now, or a time object if they must wait
   */
  static getGuestQuizTimeRemaining(): { hours: number; minutes: number; seconds: number } | null {
    try {
      const lastAttempt = this.getGuestLastQuizAttempt();
      
      if (!lastAttempt || this.canGuestTakeQuiz()) {
        return null; // Can take quiz now
      }

      const lastAttemptDate = new Date(lastAttempt.timestamp);
      const nextAvailableDate = new Date(lastAttemptDate);
      
      // Set to midnight of next day
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
      nextAvailableDate.setHours(0, 0, 0, 0);
      
      const now = new Date();
      const diffMs = nextAvailableDate.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        return null; // Can take quiz now
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    } catch (error) {
      console.error('Error calculating guest quiz time remaining:', error);
      return null;
    }
  }

  /**
   * Clear guest quiz attempt (for testing or if user signs up)
   */
  static clearGuestQuizAttempt(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GUEST_QUIZ_ATTEMPTS);
      console.log('✅ Guest quiz attempt cleared');
    } catch (error) {
      console.error('Error clearing guest quiz attempt:', error);
    }
  }

  /**
   * Get guest quiz statistics (how many times they've tried, etc.)
   */
  static getGuestQuizStats(): {
    hasAttempted: boolean;
    canTakeToday: boolean;
    lastAttemptDate: string | null;
    timeUntilNext: { hours: number; minutes: number; seconds: number } | null;
  } {
    const lastAttempt = this.getGuestLastQuizAttempt();
    const canTake = this.canGuestTakeQuiz();
    const timeRemaining = this.getGuestQuizTimeRemaining();

    return {
      hasAttempted: lastAttempt !== null,
      canTakeToday: canTake,
      lastAttemptDate: lastAttempt?.timestamp || null,
      timeUntilNext: timeRemaining
    };
  }
}