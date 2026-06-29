/**
 * Router Debug Utilities
 * Helper functions for debugging and testing the routing system
 * 
 * Usage in browser console:
 * import * as RouterDebug from './utils/routerDebug'
 * RouterDebug.showAllRoutes()
 */

import { ROUTES, getCurrentPage, getPathFromPage, getPageFromPath, navigateToPage, isValidPage } from './router';

/**
 * Display all available routes in console
 */
export function showAllRoutes(): void {
  console.group('📍 All Available Routes');
  
  const publicRoutes = Object.values(ROUTES).filter(r => !r.requiresAuth);
  const protectedRoutes = Object.values(ROUTES).filter(r => r.requiresAuth);
  
  console.group('✅ Public Routes');
  publicRoutes.forEach(route => {
    console.log(`${route.path.padEnd(25)} → ${route.pageName}`);
  });
  console.groupEnd();
  
  console.group('🔒 Protected Routes (Require Auth)');
  protectedRoutes.forEach(route => {
    console.log(`${route.path.padEnd(25)} → ${route.pageName}`);
  });
  console.groupEnd();
  
  console.groupEnd();
}

/**
 * Show current routing state
 */
export function showCurrentState(): void {
  console.group('🔍 Current Routing State');
  console.log('Current URL:', window.location.href);
  console.log('Path:', window.location.pathname);
  console.log('Search:', window.location.search);
  console.log('Page Name:', getCurrentPage());
  console.log('Document Title:', document.title);
  console.log('History Length:', window.history.length);
  console.groupEnd();
}

/**
 * Test navigation to all routes
 */
export function testAllRoutes(delayMs: number = 1000): void {
  console.log('🧪 Testing all routes with', delayMs, 'ms delay...');
  
  const routes = Object.values(ROUTES);
  let index = 0;
  
  const testNext = () => {
    if (index >= routes.length) {
      console.log('✅ Route testing complete!');
      return;
    }
    
    const route = routes[index];
    console.log(`Testing route ${index + 1}/${routes.length}: ${route.path}`);
    navigateToPage(route.pageName);
    
    index++;
    setTimeout(testNext, delayMs);
  };
  
  testNext();
}

/**
 * Validate all routes
 */
export function validateRoutes(): void {
  console.group('✅ Route Validation');
  
  const routes = Object.values(ROUTES);
  let valid = 0;
  let invalid = 0;
  
  routes.forEach(route => {
    if (isValidPage(route.pageName)) {
      valid++;
    } else {
      console.warn('❌ Invalid route:', route);
      invalid++;
    }
  });
  
  console.log(`Valid routes: ${valid}`);
  console.log(`Invalid routes: ${invalid}`);
  console.log(`Total routes: ${routes.length}`);
  
  console.groupEnd();
}

/**
 * Test path/page conversions
 */
export function testConversions(): void {
  console.group('🔄 Path ↔ Page Conversions');
  
  const testCases = [
    { page: 'home', expectedPath: '/' },
    { page: 'jobs', expectedPath: '/jobs' },
    { page: 'dashboard', expectedPath: '/dashboard' },
    { page: 'login?signup=success', expectedPath: '/login?signup=success' },
  ];
  
  testCases.forEach(test => {
    const path = getPathFromPage(test.page);
    const pathMatch = path === test.expectedPath;
    
    const recoveredPage = getPageFromPath(path.split('?')[0], path.includes('?') ? '?' + path.split('?')[1] : '');
    const pageMatch = recoveredPage === test.page;
    
    console.log(
      `${pathMatch && pageMatch ? '✅' : '❌'}`,
      `"${test.page}" → "${path}" → "${recoveredPage}"`
    );
  });
  
  console.groupEnd();
}

/**
 * Monitor navigation events
 */
export function monitorNavigation(duration: number = 60000): void {
  console.log('👀 Monitoring navigation events for', duration / 1000, 'seconds...');
  
  const startTime = Date.now();
  let navCount = 0;
  
  const handlePopState = () => {
    navCount++;
    console.log(`📍 Navigation #${navCount} (popstate):`, getCurrentPage());
  };
  
  const handleNavigationEvent = (event: CustomEvent) => {
    navCount++;
    console.log(`📍 Navigation #${navCount} (custom):`, event.detail.page);
  };
  
  window.addEventListener('popstate', handlePopState);
  window.addEventListener('navigation', handleNavigationEvent as EventListener);
  
  setTimeout(() => {
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('navigation', handleNavigationEvent as EventListener);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Navigation monitoring complete: ${navCount} navigations in ${elapsed}s`);
  }, duration);
}

/**
 * Quick navigation helpers
 */
export const nav = {
  home: () => navigateToPage('home'),
  jobs: () => navigateToPage('jobs'),
  quiz: () => navigateToPage('quiz'),
  dashboard: () => navigateToPage('dashboard'),
  about: () => navigateToPage('about'),
  contact: () => navigateToPage('contact'),
  login: () => navigateToPage('login'),
  signup: () => navigateToPage('signup'),
};

/**
 * Print helpful debug info
 */
export function help(): void {
  console.log(`
📚 Router Debug Utilities Help

Available functions:
  showAllRoutes()       - Display all available routes
  showCurrentState()    - Show current routing state
  testAllRoutes()       - Test navigation to all routes
  validateRoutes()      - Validate all routes
  testConversions()     - Test path/page conversions
  monitorNavigation()   - Monitor navigation events
  nav.{page}()          - Quick navigation shortcuts
  help()                - Show this help message

Examples:
  showAllRoutes()
  nav.jobs()
  monitorNavigation(30000)  // Monitor for 30 seconds
  testAllRoutes(2000)       // Test all routes with 2s delay
  `);
}

// Auto-print help on import in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('🛠️ Router Debug Utilities loaded. Type RouterDebug.help() for more info.');
}