# FindMyAIT Routing System

## Overview

FindMyAIT uses a custom client-side routing system built with the browser's History API. Each page has its own unique URL path, enabling proper browser navigation, bookmarking, and direct URL access.

## URL Structure

All pages are accessible via clean URL paths:

### Public Pages
- **Home/Landing**: `/`
- **Find Jobs**: `/jobs`
- **NAB Exam Prep**: `/quiz`
- **Practice Quiz**: `/quiz-practice`
- **Resources**: `/resources`
- **About Us**: `/about`
- **Contact**: `/contact`
- **Privacy Policy**: `/privacy`
- **Terms of Service**: `/terms`
- **Cookie Policy**: `/cookie`
- **Login**: `/login`
- **Sign Up**: `/signup`

### Protected Pages (Require Authentication)
- **Dashboard**: `/dashboard`
- **Job Activity**: `/job-activity`
- **View Matches**: `/view-matches`
- **Profile Completion**: `/profile-completion`
- **Account Settings**: `/account-settings`

## Features

### ✅ Browser Navigation
- Back/forward buttons work correctly
- Browser history is maintained
- Page refreshes preserve current page

### ✅ Direct URL Access
- Users can navigate directly to any page via URL
- Bookmarks work properly
- URLs can be shared

### ✅ Dynamic Page Titles
- Each page has a unique browser tab title
- Helps with SEO and user orientation

### ✅ Query Parameters
- Supported for complex navigation flows
- Example: `/login?signup=success&email=user@example.com`
- Example: `/job-activity?view=saved`

### ✅ 404 Handling
- Unknown routes show a friendly 404 page
- Provides navigation options to get users back on track

## Usage

### Navigating Between Pages

```typescript
// In any component that receives onNavigate prop
onNavigate?.('jobs');  // Navigate to jobs page
onNavigate?.('about'); // Navigate to about page
```

### Programmatic Navigation

```typescript
import { navigateToPage } from './utils/router';

// Navigate with history push
navigateToPage('dashboard');

// Navigate with history replace (no history entry)
navigateToPage('login', true);
```

### Building URLs with Query Parameters

```typescript
import { buildUrlWithParams } from './utils/router';

const url = buildUrlWithParams('job-activity', { view: 'saved' });
// Result: /job-activity?view=saved
```

### Getting Current Page

```typescript
import { getCurrentPage } from './utils/router';

const currentPage = getCurrentPage();
// Returns: 'jobs' or 'about' or 'home' etc.
```

### Converting Between Pages and Paths

```typescript
import { getPathFromPage, getPageFromPath } from './utils/router';

// Page name to URL path
const path = getPathFromPage('jobs'); // Returns: '/jobs'

// URL path to page name
const page = getPageFromPath('/about', ''); // Returns: 'about'
```

## Route Configuration

Routes are defined in `/utils/router.ts`:

```typescript
export const ROUTES: Record<string, RouteConfig> = {
  HOME: { path: '/', pageName: 'home' },
  JOBS: { path: '/jobs', pageName: 'jobs' },
  DASHBOARD: { path: '/dashboard', pageName: 'dashboard', requiresAuth: true },
  // ... more routes
};
```

## Implementation Details

### How It Works

1. **URL Initialization**: On app load, `getCurrentPage()` reads `window.location.pathname` to determine which page to show

2. **Navigation**: When `handleNavigation(page)` is called:
   - URL is updated via `navigateToPage()`
   - History state is pushed/replaced
   - Page title is updated
   - React state triggers re-render

3. **Browser Events**: The app listens to:
   - `popstate`: Handles back/forward button clicks
   - Custom `navigation` event: Internal navigation coordination

4. **State Management**: `currentPage` state determines which component to render

### Key Files

- **`/utils/router.ts`**: Core routing logic and configuration
- **`/App.tsx`**: Route handling and page rendering
- **`/components/NotFoundPage.tsx`**: 404 error page

## Adding New Routes

To add a new route:

1. **Define the route** in `/utils/router.ts`:
   ```typescript
   export const ROUTES = {
     // ... existing routes
     NEW_PAGE: { path: '/new-page', pageName: 'new-page' },
   };
   ```

2. **Add page title** in `updatePageTitle()` function:
   ```typescript
   const titles: Record<string, string> = {
     // ... existing titles
     'new-page': 'New Page - FindMyAIT',
   };
   ```

3. **Import component** in `/App.tsx`:
   ```typescript
   import { NewPage } from "./components/NewPage";
   ```

4. **Add route handler** in `/App.tsx`:
   ```typescript
   if (currentPage === 'new-page') {
     return (
       <>
         <NewPage 
           onNavigate={handleNavigation}
           isLoggedIn={isLoggedIn}
           currentUser={currentUser}
           onLogout={handleLogout}
         />
         <Toaster />
       </>
     );
   }
   ```

5. **Update valid pages array** in `/App.tsx` (for 404 handling):
   ```typescript
   const validPages = [
     // ... existing pages
     'new-page'
   ];
   ```

## Best Practices

### ✅ DO:
- Use semantic, kebab-case URLs (e.g., `/job-activity`, not `/JobActivity`)
- Keep URLs short and descriptive
- Use query parameters for filtering/state (e.g., `/jobs?location=CA`)
- Update page titles to reflect current page
- Handle authentication on protected routes

### ❌ DON'T:
- Use special characters in URLs
- Create deeply nested routes without good reason
- Forget to add new pages to the valid pages list
- Hardcode URLs - use the router utilities instead

## SEO Considerations

The routing system is ready for SEO improvements:

1. **Meta Tags**: Add page-specific meta tags in each component
2. **Server-Side Rendering**: Can be added later for better SEO
3. **Sitemap**: Generate based on ROUTES configuration
4. **Canonical URLs**: Set canonical tags per page

## Testing URLs

You can test the routing system by:

1. **Direct URL access**: Type URLs directly in the browser
2. **Back/forward buttons**: Navigate and test browser buttons
3. **Bookmarks**: Bookmark pages and return to them
4. **Refresh**: Refresh pages to ensure state is preserved
5. **Share URLs**: Copy and paste URLs in new tabs

## Troubleshooting

### Page shows 404 after refresh
- Ensure the page name is in the `validPages` array in App.tsx
- Check that ROUTES configuration includes the page

### Browser back button doesn't work
- Verify `popstate` event listener is attached
- Check console for navigation logs

### Wrong page title shows
- Update the `pageTitles` object in App.tsx
- Ensure page name matches exactly

### URL doesn't update
- Confirm `navigateToPage()` is being called
- Check that the page name exists in ROUTES

## Future Enhancements

Potential improvements to the routing system:

- [ ] Lazy loading for code splitting per route
- [ ] Route guards for authentication
- [ ] Nested routes for complex pages
- [ ] Route transitions/animations
- [ ] Server-side rendering (SSR)
- [ ] Static site generation (SSG)
- [ ] Route-based analytics tracking
- [ ] Breadcrumb navigation
- [ ] Route preloading

---

**Last Updated**: October 1, 2025  
**Version**: 1.0.0