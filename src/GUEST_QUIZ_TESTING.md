# Guest Quiz Daily Limit - Testing Guide

## Overview
Guest users (non-logged in) can take the 5-question practice quiz **once per day**. After completion, they are shown a lock screen encouraging signup. The restriction resets at midnight (local time).

## Features Implemented

### 1. Daily Limit Tracking
- **Storage**: localStorage key `findmyait_guest_quiz_attempts`
- **Data Stored**: Timestamp, score, questions answered, completion status
- **Reset**: Automatically at midnight (local timezone)

### 2. User Experience Flow

#### First-Time Guest User
1. Visit Quiz page → No restrictions shown
2. Click "Try Questions" → 5 questions available
3. Complete quiz → Lock screen appears with:
   - Trophy icon
   - Score display
   - Countdown timer to next day
   - Sign up CTA

#### Returning Guest (Same Day)
1. Visit Quiz page → Yellow warning banner shows:
   - "Daily Quiz Completed"
   - Time remaining until next quiz
2. Button changes to "View Results"
3. Click button → Lock screen with previous score

#### Returning Guest (Next Day)
1. Visit Quiz page → No restrictions (fresh start)
2. Can take quiz again

### 3. Logged-In Users
- **NOT AFFECTED** by guest restrictions
- Unlimited access (50 questions/day)
- Uses separate `dailyProgress` tracking system
- Guest restrictions automatically cleared on login/signup

## Testing Instructions

### Test 1: Guest Quiz Completion
```
1. Open app in incognito/private window
2. Navigate to /quiz
3. Click "Try Questions"
4. Answer all 5 questions
5. ✅ Verify: Lock screen appears with score and countdown
6. Navigate back to /quiz
7. ✅ Verify: Yellow warning banner appears
8. ✅ Verify: Button says "View Results" instead of "Try Questions"
```

### Test 2: Guest Quiz Restriction
```
1. After completing Test 1, close and reopen incognito window
2. Navigate to /quiz-practice
3. ✅ Verify: Lock screen appears immediately (no loading)
4. ✅ Verify: Shows time remaining until next quiz
```

### Test 3: Logged-In User Not Affected
```
1. Complete Test 1 (quiz as guest)
2. Sign up for account
3. Navigate to /quiz-practice
4. ✅ Verify: Can take full 50-question quiz
5. ✅ Verify: No guest restrictions apply
```

### Test 4: Daily Reset
```
1. Complete quiz as guest
2. Use browser DevTools Console:
   ```javascript
   // Manually set attempt to yesterday
   const attempt = JSON.parse(localStorage.getItem('findmyait_guest_quiz_attempts'));
   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);
   attempt.timestamp = yesterday.toISOString();
   localStorage.setItem('findmyait_guest_quiz_attempts', JSON.stringify(attempt));
   ```
3. Refresh page
4. Navigate to /quiz-practice
5. ✅ Verify: Can take quiz again (restriction reset)
```

### Test 5: Clear on Signup
```
1. Complete quiz as guest (get locked out)
2. Sign up for new account
3. Login with new account
4. Navigate to /quiz-practice
5. ✅ Verify: Full quiz access (guest restriction cleared)
```

### Test 6: Clear on Login
```
1. Complete quiz as guest in incognito
2. Login with existing account
3. Navigate to /quiz-practice
4. ✅ Verify: Full quiz access (guest restriction cleared)
```

## Developer Tools

### Check Guest Quiz Status (Console)
```javascript
// Import the function
import { LocalStorageAuth } from './utils/localStorage';

// Check if guest can take quiz
LocalStorageAuth.canGuestTakeQuiz();

// Get guest quiz stats
LocalStorageAuth.getGuestQuizStats();

// Get time remaining
LocalStorageAuth.getGuestQuizTimeRemaining();

// Manually clear restriction (testing)
LocalStorageAuth.clearGuestQuizAttempt();
```

### View Stored Data (Console)
```javascript
// View guest quiz attempt data
JSON.parse(localStorage.getItem('findmyait_guest_quiz_attempts'));
```

## localStorage Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `canGuestTakeQuiz()` | Check if guest can take quiz today | `boolean` |
| `recordGuestQuizAttempt(score, questions)` | Record quiz completion | `boolean` |
| `getGuestLastQuizAttempt()` | Get last attempt details | `GuestQuizAttempt \| null` |
| `getGuestQuizTimeRemaining()` | Calculate time until next quiz | `{ hours, minutes, seconds } \| null` |
| `getGuestQuizStats()` | Get comprehensive status | `Object` with all stats |
| `clearGuestQuizAttempt()` | Clear guest restriction | `void` |

## Edge Cases Handled

1. ✅ **Browser refresh during quiz**: Restriction persists
2. ✅ **New incognito window**: Restriction persists (same localStorage)
3. ✅ **Different browser**: No restriction (separate localStorage)
4. ✅ **Logged-in user isolation**: Guest restrictions don't affect logged-in users
5. ✅ **Signup after restriction**: Restriction automatically cleared
6. ✅ **Login after restriction**: Restriction automatically cleared
7. ✅ **Timezone handling**: Uses local timezone for reset
8. ✅ **Loading screen bug**: Fixed - lock screen shows immediately, not loading spinner

## Known Limitations

1. **Per-browser restriction**: Users can bypass by using different browsers or clearing localStorage
   - This is acceptable for prototype/MVP
   - Production solution: Backend tracking with device fingerprinting

2. **localStorage dependency**: If user clears browser data, restriction is reset
   - Acceptable for test implementation
   - Production solution: Backend database

## Production Considerations

For production deployment, replace with:
- Backend API tracking guest quiz attempts
- IP address or device fingerprinting
- Rate limiting at API level
- Database storage instead of localStorage
- Email verification for extended access
