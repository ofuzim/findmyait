-- Fix RLS policies to allow public inserts for jobs table
-- This allows the API to insert jobs without authentication

-- Update the jobs table RLS policy to allow public inserts
DROP POLICY IF EXISTS "Jobs are publicly readable" ON jobs;

-- Create new policies that allow both reading and writing jobs publicly
CREATE POLICY "Jobs are publicly readable" ON jobs
    FOR SELECT USING (true);

CREATE POLICY "Jobs are publicly insertable" ON jobs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Jobs are publicly updatable" ON jobs
    FOR UPDATE USING (true);

-- Keep the other tables with user-specific policies
-- (users, job_applications, saved_jobs, user_preferences, job_alerts)
-- These should remain protected by authentication
