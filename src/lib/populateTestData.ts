// Script to populate Supabase with test data from JSearch API
import { jsearchApi } from './jsearchApi.ts'
import { supabase } from './supabase.ts'
import { mapJSearchJobToJob } from './jobMapper.ts'

export async function populateTestData() {
  console.log('🚀 Starting to populate Supabase with test data...')
  
  try {
    // Fetch jobs from different states and types
    const searchQueries = [
      { query: 'Administrator in Training', state: 'Texas', jobType: 'ait' as const },
      { query: 'Administrator in Training', state: 'California', jobType: 'ait' as const },
      { query: 'Administrator in Training', state: 'Florida', jobType: 'ait' as const },
      { query: 'Executive Director', state: 'Texas', jobType: 'edt' as const },
      { query: 'Executive Director', state: 'New York', jobType: 'edt' as const },
      { query: 'healthcare administrator', state: 'Illinois', jobType: 'ait' as const },
    ]
    
    const allJobs = []
    
    // Fetch jobs from each query
    for (const search of searchQueries) {
      console.log(`🔍 Searching for: ${search.query} in ${search.state}`)
      
      try {
        let jobs
        if (search.jobType === 'ait') {
          jobs = await jsearchApi.searchAITJobs(search.state, undefined, 'entry')
        } else {
          jobs = await jsearchApi.searchEDTJobs(search.state, undefined, 'entry')
        }
        
        if (jobs.length > 0) {
          console.log(`✅ Found ${jobs.length} ${search.jobType} jobs in ${search.state}`)
          allJobs.push(...jobs)
        } else {
          console.log(`⚠️ No ${search.jobType} jobs found in ${search.state}`)
        }
        
        // Add delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.error(`❌ Failed to search ${search.state}:`, error)
      }
    }
    
    console.log(`📊 Total jobs collected: ${allJobs.length}`)
    
    if (allJobs.length === 0) {
      console.log('❌ No jobs found to insert')
      return { success: false, inserted: 0, errors: [] }
    }
    
    // Insert jobs into Supabase
    const insertedJobs = []
    const errors = []
    
    for (const job of allJobs) {
      try {
        console.log(`📝 Inserting: ${job.title} at ${job.company}`)
        
        const { data, error } = await supabase
          .from('jobs')
          .insert({
            job_id: job.id,
            job_title: job.title,
            employer_name: job.company,
            job_location: job.location,
            job_state: job.state,
            job_city: job.location.split(',')[0] || '',
            job_type: job.jobType,
            facility_type: job.facilityType,
            experience_level: job.experienceLevel,
            job_is_remote: job.isRemote,
            job_description: job.description,
            job_salary: job.salary,
            job_highlights: { highlights: job.highlights },
            training_details: job.trainingDetails,
            facility_info: job.facilityInfo,
            contact: job.contact,
            source: 'jsearch',
            is_active: true
          })
          .select()
        
        if (error) {
          console.error(`❌ Failed to insert ${job.title}:`, error)
          console.error(`❌ Error details:`, JSON.stringify(error, null, 2))
          errors.push({ job: job.title, error: error.message || JSON.stringify(error) })
        } else {
          console.log(`✅ Inserted: ${job.title} (ID: ${data[0].id})`)
          insertedJobs.push(data[0])
        }
        
        // Small delay between inserts
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`❌ Error inserting ${job.title}:`, error)
        errors.push({ job: job.title, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }
    
    console.log(`\n📋 Summary:`)
    console.log(`✅ Successfully inserted: ${insertedJobs.length} jobs`)
    console.log(`❌ Failed to insert: ${errors.length} jobs`)
    
    if (errors.length > 0) {
      console.log(`\n❌ Errors:`)
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.job}: ${error.error}`)
      })
    }
    
    return {
      success: insertedJobs.length > 0,
      inserted: insertedJobs.length,
      errors: errors.length,
      jobs: insertedJobs
    }
    
  } catch (error) {
    console.error('❌ Populate test data failed:', error)
    return { success: false, inserted: 0, errors: [error] }
  }
}

// Function to clear existing test data
export async function clearTestData() {
  console.log('🧹 Clearing existing test data...')
  
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('source', 'jsearch')
    
    if (error) {
      console.error('❌ Failed to clear test data:', error)
      return false
    }
    
    console.log('✅ Test data cleared')
    return true
  } catch (error) {
    console.error('❌ Clear test data failed:', error)
    return false
  }
}

// Function to check current data count
export async function checkDataCount() {
  try {
    const { count, error } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Failed to check data count:', error)
      return 0
    }
    
    console.log(`📊 Current jobs in database: ${count}`)
    return count
  } catch (error) {
    console.error('❌ Check data count failed:', error)
    return 0
  }
}

// Function to show sample data
export async function showSampleData(limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('job_title, employer_name, job_location, job_type, facility_type')
      .limit(limit)
    
    if (error) {
      console.error('❌ Failed to fetch sample data:', error)
      return
    }
    
    console.log(`\n📋 Sample data (${data.length} jobs):`)
    data.forEach((job, index) => {
      console.log(`${index + 1}. ${job.job_title} at ${job.employer_name}`)
      console.log(`   Location: ${job.job_location}`)
      console.log(`   Type: ${job.job_type} | Facility: ${job.facility_type}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Show sample data failed:', error)
  }
}
