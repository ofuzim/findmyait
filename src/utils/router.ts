/**
 * Client-Side Router Utility
 * Manages URL-based navigation for FindMyAIT platform
 */

export interface RouteConfig {
  path: string;
  pageName: string;
  requiresAuth?: boolean;
}

// Define all application routes
export const ROUTES: Record<string, RouteConfig> = {
  HOME: { path: '/', pageName: 'home' },
  JOBS: { path: '/jobs', pageName: 'jobs' },
  QUIZ: { path: '/quiz', pageName: 'quiz' },
  QUIZ_PRACTICE: { path: '/quiz-practice', pageName: 'quiz-practice' },
  DASHBOARD: { path: '/dashboard', pageName: 'dashboard', requiresAuth: true },
  JOB_ACTIVITY: { path: '/job-activity', pageName: 'job-activity', requiresAuth: true },
  VIEW_MATCHES: { path: '/view-matches', pageName: 'view-matches', requiresAuth: true },
  RESOURCES: { path: '/resources', pageName: 'resources' },
  ABOUT: { path: '/about', pageName: 'about' },
  CONTACT: { path: '/contact', pageName: 'contact' },
  PRIVACY: { path: '/privacy', pageName: 'privacy' },
  TERMS: { path: '/terms', pageName: 'terms' },
  COOKIE: { path: '/cookie', pageName: 'cookie' },
  LOGIN: { path: '/login', pageName: 'login' },
  SIGNUP: { path: '/signup', pageName: 'signup' },
  PROFILE_COMPLETION: { path: '/profile-completion', pageName: 'profile-completion', requiresAuth: true },
  ACCOUNT_SETTINGS: { path: '/account-settings', pageName: 'account-settings', requiresAuth: true },
  TEST_SUPABASE: { path: '/test-supabase', pageName: 'test-supabase' },
};

/**
 * Convert page name to URL path
 */
export function getPathFromPage(pageName: string): string {
  // Handle pages with query parameters
  if (pageName.includes('?')) {
    const [page, query] = pageName.split('?');
    const route = Object.values(ROUTES).find(r => r.pageName === page);
    return route ? `${route.path}?${query}` : `/${page}?${query}`;
  }
  
  // Find matching route
  const route = Object.values(ROUTES).find(r => r.pageName === pageName);
  return route ? route.path : `/${pageName}`;
}

/**
 * Convert URL path to page name
 */
export function getPageFromPath(pathname: string, search: string = ''): string {
  // Remove trailing slash
  const cleanPath = pathname.endsWith('/') && pathname.length > 1 
    ? pathname.slice(0, -1) 
    : pathname;
  
  // Find matching route
  const route = Object.values(ROUTES).find(r => r.path === cleanPath);
  
  if (route) {
    // If there are query parameters, append them
    return search ? `${route.pageName}${search}` : route.pageName;
  }
  
  // Default to home if no match
  return 'home';
}

/**
 * Navigate to a page with URL update
 */
export function navigateToPage(pageName: string, replaceState: boolean = false): void {
  const path = getPathFromPage(pageName);
  
  if (replaceState) {
    window.history.replaceState({ page: pageName }, '', path);
  } else {
    window.history.pushState({ page: pageName }, '', path);
  }
  
  // Update page title
  updatePageTitle(pageName);
  
  // Scroll to top on navigation
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

/**
 * Get current page from URL
 */
export function getCurrentPage(): string {
  return getPageFromPath(window.location.pathname, window.location.search);
}

/**
 * Update document title based on page
 */
export function updatePageTitle(pageName: string): void {
  const titles: Record<string, string> = {
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

  const basePageName = pageName.split('?')[0];
  document.title = titles[basePageName] || 'FindMyAIT';
}

/**
 * Navigate to external URL
 */
export function navigateToExternal(url: string): void {
  window.location.href = url;
}

/**
 * Check if a route requires authentication
 */
export function requiresAuth(pageName: string): boolean {
  const route = Object.values(ROUTES).find(r => r.pageName === pageName.split('?')[0]);
  return route?.requiresAuth || false;
}

/**
 * Build URL with query parameters
 */
export function buildUrlWithParams(pageName: string, params: Record<string, string>): string {
  const path = getPathFromPage(pageName);
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Check if currently on a specific page
 */
export function isOnPage(pageName: string): boolean {
  const currentPage = getCurrentPage();
  return currentPage.split('?')[0] === pageName;
}

/**
 * Get all defined routes
 */
export function getAllRoutes(): RouteConfig[] {
  return Object.values(ROUTES);
}

/**
 * Validate if a page name exists
 */
export function isValidPage(pageName: string): boolean {
  const basePageName = pageName.split('?')[0];
  return Object.values(ROUTES).some(route => route.pageName === basePageName);
}