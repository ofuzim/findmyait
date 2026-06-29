// Simple test to debug Supabase insertion issues
import { supabase } from './supabase.ts'

export async function testSimpleInsert() {
  console.log('🧪 Testing simple job insertion...')
  
  try {
    // Try inserting a minimal job record first
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        job_title: 'Test Administrator in Training',
        employer_name: 'Test Company',
        job_location: 'Test City, TX',
        job_state: 'Texas',
        job_type: 'ait',
        facility_type: 'Skilled Nursing',
        experience_level: 'entry',
        job_is_remote: false,
        job_description: 'This is a test job description',
        source: 'test'
      })
      .select()
    
    if (error) {
      console.error('❌ Simple insert failed:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      return false
    }
    
    console.log('✅ Simple insert successful:', data[0])
    return true
  } catch (error) {
    console.error('❌ Simple insert error:', error)
    return false
  }
}

export async function testJobInsertWithAllFields() {
  console.log('🧪 Testing job insertion with all fields...')
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        job_id: 'test-job-123',
        job_title: 'Administrator in Training',
        employer_name: 'Test Healthcare Corp',
        employer_logo: 'https://example.com/logo.png',
        employer_website: 'https://example.com',
        job_employment_type: 'Full-time',
        job_employment_types: ['FULLTIME'],
        job_apply_link: 'https://example.com/apply',
        job_apply_is_direct: false,
        apply_options: [{ publisher: 'Test', apply_link: 'https://example.com/apply', is_direct: false }],
        job_description: 'This is a comprehensive test job description for an Administrator in Training position.',
        job_is_remote: false,
        job_posted_at: '2 days ago',
        job_posted_at_timestamp: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
        job_posted_at_datetime_utc: new Date(Date.now() - 172800000).toISOString(),
        job_location: 'Austin, TX',
        job_city: 'Austin',
        job_state: 'Texas',
        job_country: 'US',
        job_latitude: 30.2672,
        job_longitude: -97.7431,
        job_benefits: ['health_insurance', 'dental_coverage'],
        job_salary: '$45,000 - $55,000',
        job_min_salary: 45000,
        job_max_salary: 55000,
        job_salary_period: 'YEAR',
        job_highlights: {
          Qualifications: ['Bachelor degree required', 'Healthcare experience preferred'],
          Benefits: ['Health insurance', 'Dental coverage', '401k'],
          Responsibilities: ['Learn facility operations', 'Support department heads']
        },
        job_onet_soc: '15114200',
        job_onet_job_zone: 4,
        facility_type: 'Skilled Nursing',
        job_type: 'ait',
        experience_level: 'entry',
        facility_type_id: 'skilled',
        training_details: {
          duration: '12-month program',
          hours: '1000 hours required',
          preceptor: 'Licensed Administrator',
          startDate: 'Immediate'
        },
        facility_info: {
          about: 'Test Healthcare Corp provides quality skilled nursing care.',
          address: '123 Test St, Austin, TX 78701',
          size: '120 beds'
        },
        contact: {
          name: 'HR Department',
          phone: '(512) 555-0123',
          email: 'hr@testhealthcare.com'
        },
        source: 'test',
        is_active: true
      })
      .select()
    
    if (error) {
      console.error('❌ Full insert failed:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      return false
    }
    
    console.log('✅ Full insert successful:', data[0])
    return true
  } catch (error) {
    console.error('❌ Full insert error:', error)
    return false
  }
}

export async function testApiJobMapping() {
  console.log('🧪 Testing API job mapping...')
  
  try {
    // Create a mock JSearch job
    const mockJSearchJob = {
      job_id: 'test-api-job-456',
      job_title: 'ADMINISTRATOR IN TRAINING',
      employer_name: 'Mock Healthcare Services',
      employer_logo: 'https://example.com/logo.png',
      employer_website: 'https://example.com',
      job_employment_type: 'Full-time',
      job_employment_types: ['FULLTIME'],
      job_apply_link: 'https://example.com/apply',
      job_apply_is_direct: false,
      apply_options: [{ publisher: 'Mock', apply_link: 'https://example.com/apply', is_direct: false }],
      job_description: 'This is a mock job description for testing purposes.',
      job_is_remote: false,
      job_posted_at: '1 day ago',
      job_posted_at_timestamp: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      job_posted_at_datetime_utc: new Date(Date.now() - 86400000).toISOString(),
      job_location: 'Dallas, TX',
      job_city: 'Dallas',
      job_state: 'Texas',
      job_country: 'US',
      job_latitude: 32.7767,
      job_longitude: -96.7970,
      job_benefits: ['health_insurance'],
      job_salary: '$50,000 - $60,000',
      job_min_salary: 50000,
      job_max_salary: 60000,
      job_salary_period: 'YEAR',
      job_highlights: {
        Qualifications: ['Bachelor degree required'],
        Benefits: ['Health insurance'],
        Responsibilities: ['Learn operations']
      },
      job_onet_soc: '15114200',
      job_onet_job_zone: 4
    }
    
    // Import the mapping function
    const { mapJSearchJobToJob } = await import('./jobMapper.ts')
    
    // Map the job
    const mappedJob = mapJSearchJobToJob(mockJSearchJob)
    console.log('✅ Job mapped successfully:', mappedJob)
    
    // Try to insert the mapped job
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        job_id: mappedJob.id,
        job_title: mappedJob.title,
        employer_name: mappedJob.company,
        job_location: mappedJob.location,
        job_state: mappedJob.state,
        job_city: mappedJob.location.split(',')[0] || '',
        job_type: mappedJob.jobType,
        facility_type: mappedJob.facilityType,
        experience_level: mappedJob.experienceLevel,
        job_is_remote: mappedJob.isRemote,
        job_description: mappedJob.description,
        job_salary: mappedJob.salary,
        job_highlights: { highlights: mappedJob.highlights },
        training_details: mappedJob.trainingDetails,
        facility_info: mappedJob.facilityInfo,
        contact: mappedJob.contact,
        source: 'test-mapped',
        is_active: true
      })
      .select()
    
    if (error) {
      console.error('❌ Mapped job insert failed:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      return false
    }
    
    console.log('✅ Mapped job insert successful:', data[0])
    return true
  } catch (error) {
    console.error('❌ Mapping test error:', error)
    return false
  }
}
