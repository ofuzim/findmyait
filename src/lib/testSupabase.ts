// Test Supabase connection and data operations
import { supabase } from './supabase.ts'
import { jsearchApi } from './jsearchApi.ts'
import { mapJSearchJobToJob } from './jobMapper.ts'

// Test 1: Check Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test basic connection by fetching from jobs table
    const { data, error } = await supabase
      .from('jobs')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return false
    }
    
    console.log('✅ Supabase connected successfully!')
    return true
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return false
  }
}

// Test 2: Insert a test job from JSearch API
export async function testInsertJobFromAPI() {
  try {
    console.log('🔍 Testing job insertion from JSearch API...')
    
    // First, test the API connection
    const jobs = await jsearchApi.searchAITJobs('Texas', undefined, 'entry')
    
    if (jobs.length === 0) {
      console.log('⚠️ No jobs found from API, trying a broader search...')
      const broaderJobs = await jsearchApi.searchHealthcareJobs('healthcare administrator', 'Texas')
      
      if (broaderJobs.length === 0) {
        console.log('❌ No jobs found from API')
        return false
      }
      
      jobs.push(...broaderJobs.slice(0, 3)) // Take first 3 jobs
    }
    
    console.log(`📊 Found ${jobs.length} jobs from API`)
    
    // Insert the first job into Supabase
    const testJob = jobs[0]
    console.log('📝 Inserting job:', testJob.title, 'at', testJob.company)
    
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        job_id: testJob.id,
        job_title: testJob.title,
        employer_name: testJob.company,
        job_location: testJob.location,
        job_state: testJob.state,
        job_type: testJob.jobType,
        facility_type: testJob.facilityType,
        experience_level: testJob.experienceLevel,
        job_is_remote: testJob.isRemote,
        job_description: testJob.description,
        job_salary: testJob.salary,
        job_highlights: { highlights: testJob.highlights },
        training_details: testJob.trainingDetails,
        facility_info: testJob.facilityInfo,
        contact: testJob.contact,
        source: 'jsearch'
      })
      .select()
    
    if (error) {
      console.error('❌ Failed to insert job:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      return false
    }
    
    console.log('✅ Job inserted successfully:', data[0].id)
    return true
  } catch (error) {
    console.error('❌ Job insertion error:', error)
    return false
  }
}

// Test 3: Fetch jobs from Supabase
export async function testFetchJobsFromSupabase() {
  try {
    console.log('🔍 Testing job fetching from Supabase...')
    
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Failed to fetch jobs:', error)
      return false
    }
    
    console.log(`✅ Fetched ${data.length} jobs from Supabase:`)
    data.forEach((job, index) => {
      console.log(`${index + 1}. ${job.job_title} at ${job.employer_name} (${job.job_location})`)
    })
    
    return true
  } catch (error) {
    console.error('❌ Job fetching error:', error)
    return false
  }
}

// Test 4: Search jobs in Supabase
export async function testSearchJobsInSupabase() {
  try {
    console.log('🔍 Testing job search in Supabase...')
    
    // Search for AIT jobs
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', 'ait')
      .limit(3)
    
    if (error) {
      console.error('❌ Failed to search jobs:', error)
      return false
    }
    
    console.log(`✅ Found ${data.length} AIT jobs:`)
    data.forEach((job, index) => {
      console.log(`${index + 1}. ${job.job_title} at ${job.employer_name}`)
    })
    
    return true
  } catch (error) {
    console.error('❌ Job search error:', error)
    return false
  }
}

// Test 5: Full workflow test
export async function testFullWorkflow() {
  console.log('🚀 Starting full workflow test...\n')
  
  const results = {
    connection: false,
    apiFetch: false,
    insert: false,
    fetch: false,
    search: false
  }
  
  // Test 1: Connection
  results.connection = await testSupabaseConnection()
  console.log('')
  
  if (!results.connection) {
    console.log('❌ Cannot proceed - Supabase connection failed')
    return results
  }
  
  // Test 2: API Fetch
  try {
    const jobs = await jsearchApi.searchAITJobs('Texas')
    results.apiFetch = jobs.length > 0
    console.log(`📊 API fetch: ${jobs.length} jobs found`)
  } catch (error) {
    console.log('❌ API fetch failed:', error)
  }
  console.log('')
  
  // Test 3: Insert
  results.insert = await testInsertJobFromAPI()
  console.log('')
  
  // Test 4: Fetch
  results.fetch = await testFetchJobsFromSupabase()
  console.log('')
  
  // Test 5: Search
  results.search = await testSearchJobsInSupabase()
  console.log('')
  
  // Summary
  console.log('📋 Test Results Summary:')
  console.log(`✅ Supabase Connection: ${results.connection ? 'PASS' : 'FAIL'}`)
  console.log(`✅ API Fetch: ${results.apiFetch ? 'PASS' : 'FAIL'}`)
  console.log(`✅ Data Insert: ${results.insert ? 'PASS' : 'FAIL'}`)
  console.log(`✅ Data Fetch: ${results.fetch ? 'PASS' : 'FAIL'}`)
  console.log(`✅ Data Search: ${results.search ? 'PASS' : 'FAIL'}`)
  
  const allPassed = Object.values(results).every(Boolean)
  console.log(`\n🎯 Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`)
  
  return results
}

// Quick test function you can call from browser console
export async function quickTest() {
  console.log('🧪 Running quick Supabase test...')
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase error:', error)
      return false
    }
    
    console.log('✅ Supabase is connected!')
    
    // Try to fetch some jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('job_title, employer_name, job_location')
      .limit(3)
    
    if (jobsError) {
      console.error('❌ Jobs fetch error:', jobsError)
      return false
    }
    
    console.log(`📊 Found ${jobs.length} jobs in database:`)
    jobs.forEach((job, i) => {
      console.log(`${i + 1}. ${job.job_title} at ${job.employer_name}`)
    })
    
    return true
  } catch (error) {
    console.error('❌ Test failed:', error)
    return false
  }
}
