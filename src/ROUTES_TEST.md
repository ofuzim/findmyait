# Route Testing Guide

## All Available Routes

Test each route by entering the URL directly in your browser:

### Public Routes ✅
- [ ] `/` - Home/Landing Page
- [ ] `/jobs` - Find Jobs Page
- [ ] `/quiz` - NAB Exam Prep
- [ ] `/quiz-practice` - Practice Quiz Interface
- [ ] `/resources` - Resources & State Requirements
- [ ] `/about` - About FindMyAIT
- [ ] `/contact` - Contact Us
- [ ] `/privacy` - Privacy Policy
- [ ] `/terms` - Terms of Service
- [ ] `/cookie` - Cookie Policy
- [ ] `/login` - Login Page
- [ ] `/signup` - Sign Up Page

### Protected Routes 🔒
These require authentication:
- [ ] `/dashboard` - User Dashboard
- [ ] `/job-activity` - Job Applications & Saved Jobs
- [ ] `/view-matches` - Job Alert Matches
- [ ] `/profile-completion` - Complete Your Profile
- [ ] `/account-settings` - Account Settings

### Routes with Query Parameters 🔗
- [ ] `/login?signup=success&email=test@example.com` - Login after signup
- [ ] `/job-activity?view=applications` - Job Activity (Applications tab)
- [ ] `/job-activity?view=saved` - Job Activity (Saved Jobs tab)
- [ ] `/job-activity?view=recommendations` - Job Activity (Recommendations tab)
- [ ] `/job-activity?view=alerts` - Job Activity (Job Alerts tab)
- [ ] `/view-matches?name=Alert&criteria=AIT&location=CA` - View Matches with alert data

### Error Routes ❌
- [ ] `/non-existent-page` - Should show 404 page
- [ ] `/random-route` - Should show 404 page

## Test Checklist

For each route, verify:

### Basic Functionality
- [ ] Direct URL access works
- [ ] Page renders correctly
- [ ] Browser tab title is correct
- [ ] Header shows correct active page
- [ ] Page is responsive on mobile

### Navigation
- [ ] Can navigate to other pages
- [ ] Back button works
- [ ] Forward button works
- [ ] Page refresh preserves state
- [ ] URL updates when navigating

### Authentication (Protected Routes)
- [ ] Redirects to login when not authenticated
- [ ] Allows access when authenticated
- [ ] Preserves return URL after login

### Special Cases
- [ ] Quiz preloader shows when navigating to quiz-practice
- [ ] Login shows success message after signup
- [ ] Job application modal works from jobs page
- [ ] Dashboard loads user data correctly

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Quick Test Script

Open browser console and run:

```javascript
// Test navigation
window.location.href = '/jobs';
// Wait for page load, then:
window.location.href = '/about';
// Test back button:
window.history.back();
// Test forward button:
window.history.forward();
```

## Expected Behavior

### Successful Route
1. URL updates in address bar
2. Page content changes
3. Browser tab title updates
4. Header highlights correct nav item
5. Scroll position resets to top

### Protected Route (Not Logged In)
1. Redirects to `/login`
2. Original URL may be preserved for redirect after login

### 404 Route
1. Shows custom 404 page
2. Provides navigation options
3. Allows going back to previous page

## Common Issues & Solutions

### Issue: Page shows 404 after refresh
**Solution**: Check that page name is in validPages array in App.tsx

### Issue: URL doesn't update
**Solution**: Verify navigateToPage() is being called

### Issue: Wrong page title
**Solution**: Check pageTitles object matches route names

### Issue: Browser back button doesn't work
**Solution**: Confirm popstate listener is attached

### Issue: Authentication redirect loops
**Solution**: Check requiresAuth flag in route config

## Performance Metrics

Track these metrics for each route:
- [ ] Initial load time < 2 seconds
- [ ] Navigation time < 500ms
- [ ] No console errors
- [ ] No 404 network requests
- [ ] Images load correctly

## Accessibility Testing

For each route:
- [ ] Keyboard navigation works
- [ ] Screen reader announces page changes
- [ ] Focus management on navigation
- [ ] Skip links work correctly
- [ ] Proper heading hierarchy

---

**Test Date**: _____________
**Tester**: _____________
**Browser**: _____________
**Device**: _____________
**Pass/Fail**: _____________