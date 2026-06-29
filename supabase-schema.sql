-- FindMyAIT Supabase Database Schema
-- Based on JSearch API structure with compatibility for existing mock data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jobs table - main table for job listings
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- JSearch API fields
  job_id TEXT UNIQUE, -- JSearch unique identifier
  job_title TEXT NOT NULL,
  employer_name TEXT NOT NULL,
  employer_logo TEXT,
  employer_website TEXT,
  job_employment_type TEXT,
  job_employment_types TEXT[], -- Array of employment types
  job_apply_link TEXT,
  job_apply_is_direct BOOLEAN DEFAULT false,
  apply_options JSONB, -- Store apply options as JSON
  job_description TEXT,
  job_is_remote BOOLEAN DEFAULT false,
  job_posted_at TEXT, -- Original API format
  job_posted_at_timestamp BIGINT,
  job_posted_at_datetime_utc TIMESTAMPTZ,
  job_location TEXT,
  job_city TEXT,
  job_state TEXT,
  job_country TEXT DEFAULT 'US',
  job_latitude DECIMAL(10, 8),
  job_longitude DECIMAL(11, 8),
  job_benefits TEXT[],
  job_salary TEXT,
  job_min_salary DECIMAL(10, 2),
  job_max_salary DECIMAL(10, 2),
  job_salary_period TEXT,
  job_highlights JSONB, -- Store highlights as JSON
  job_onet_soc TEXT,
  job_onet_job_zone INTEGER,
  
  -- Additional fields for FindMyAIT specific data
  facility_type TEXT,
  job_type TEXT CHECK (job_type IN ('ait', 'edt')),
  experience_level TEXT CHECK (experience_level IN ('entry', '1-2years', '3-5years')),
  facility_type_id TEXT CHECK (facility_type_id IN ('memory', 'skilled', 'assisted', 'ccrc', 'rehab', 'longterm')),
  
  -- Training details (for AIT/EDT positions)
  training_details JSONB,
  
  -- Facility information
  facility_info JSONB,
  
  -- Contact information
  contact JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'jsearch' -- 'jsearch', 'manual', 'imported'
);

-- Indexes for better performance
CREATE INDEX idx_jobs_job_id ON jobs(job_id);
CREATE INDEX idx_jobs_job_title ON jobs(job_title);
CREATE INDEX idx_jobs_employer_name ON jobs(employer_name);
CREATE INDEX idx_jobs_job_state ON jobs(job_state);
CREATE INDEX idx_jobs_job_city ON jobs(job_city);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_facility_type ON jobs(facility_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_job_is_remote ON jobs(job_is_remote);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);

-- Full-text search index
CREATE INDEX idx_jobs_search ON jobs USING gin(
  to_tsvector('english', 
    COALESCE(job_title, '') || ' ' ||
    COALESCE(employer_name, '') || ' ' ||
    COALESCE(job_description, '') || ' ' ||
    COALESCE(job_location, '') || ' ' ||
    COALESCE(facility_type, '')
  )
);

-- Users table for authentication and user preferences
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User job applications
CREATE TABLE job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'interviewed', 'rejected', 'accepted')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, job_id)
);

-- User saved jobs
CREATE TABLE saved_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- User search preferences
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  preferred_states TEXT[],
  preferred_facility_types TEXT[],
  preferred_job_types TEXT[],
  preferred_experience_levels TEXT[],
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  remote_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job alerts/notifications
CREATE TABLE job_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL, -- Store search parameters as JSON
  is_active BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('immediate', 'daily', 'weekly')),
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_alerts_updated_at BEFORE UPDATE ON job_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

-- Jobs are publicly readable
CREATE POLICY "Jobs are publicly readable" ON jobs
    FOR SELECT USING (true);

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Job applications are private to the user
CREATE POLICY "Users can view own applications" ON job_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications" ON job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON job_applications
    FOR UPDATE USING (auth.uid() = user_id);

-- Saved jobs are private to the user
CREATE POLICY "Users can view own saved jobs" ON saved_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved jobs" ON saved_jobs
    FOR ALL USING (auth.uid() = user_id);

-- User preferences are private to the user
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Job alerts are private to the user
CREATE POLICY "Users can manage own alerts" ON job_alerts
    FOR ALL USING (auth.uid() = user_id);

