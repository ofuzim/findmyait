# Supabase Setup Guide

## Step 1: Set up Supabase Database

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign in and go to your project

2. **Run the SQL Schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" to execute the schema

3. **Verify Tables Created**
   - Go to the Table Editor
   - You should see these tables:
     - `jobs`
     - `users`
     - `job_applications`
     - `saved_jobs`
     - `user_preferences`
     - `job_alerts`

## Step 2: Test the Connection

1. **Add the Test Page to Your App**
   ```tsx
   // In your main App.tsx or routing file, add:
   import SupabaseTestPage from './components/SupabaseTestPage'
   
   // Add a route for testing:
   <Route path="/test-supabase" element={<SupabaseTestPage />} />
   ```

2. **Visit the Test Page**
   - Go to `http://localhost:3000/test-supabase`
   - Click "Run Quick Test" first
   - If that passes, click "Run Full Test"

## Step 3: Check Your Credentials

Make sure your Supabase credentials are correct in `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_JSEARCH_API_KEY=your_jsearch_key
```

## Step 4: Test the API Integration

The test page will:
1. ✅ Test Supabase connection
2. ✅ Fetch jobs from JSearch API
3. ✅ Insert a job into Supabase
4. ✅ Fetch jobs from Supabase
5. ✅ Search jobs in Supabase

## Troubleshooting

### If Supabase Connection Fails:
- Check your project ID and API key
- Make sure the schema was run successfully
- Check your Supabase project is active

### If API Fetch Fails:
- Verify your JSearch API key is correct
- Check your internet connection
- The API might be rate-limited

### If Insert Fails:
- Check the database schema was created correctly
- Verify RLS policies are set up
- Check the data format matches the schema

## Manual Testing

You can also test manually in the browser console:

```javascript
// Import the test functions
import { quickTest, testFullWorkflow } from './src/lib/testSupabase.ts'

// Run quick test
await quickTest()

// Run full test
await testFullWorkflow()
```

## Next Steps

Once everything is working:
1. Remove the test page from production
2. Start integrating the API into your existing components
3. Add caching to reduce API calls
4. Set up real-time updates if needed
