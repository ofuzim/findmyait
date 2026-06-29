// Job mapping utilities to transform JSearch API data to match existing mock structure
import { Job } from '../data/mockJobs.ts'

// JSearch API response types
export interface JSearchJob {
  job_id: string
  job_title: string
  employer_name: string
  employer_logo?: string
  employer_website?: string
  job_employment_type?: string
  job_employment_types?: string[]
  job_apply_link?: string
  job_apply_is_direct?: boolean
  apply_options?: Array<{
    publisher: string
    apply_link: string
    is_direct: boolean
  }>
  job_description?: string
  job_is_remote?: boolean
  job_posted_at?: string
  job_posted_at_timestamp?: number
  job_posted_at_datetime_utc?: string
  job_location?: string
  job_city?: string
  job_state?: string
  job_country?: string
  job_latitude?: number
  job_longitude?: number
  job_benefits?: string[]
  job_salary?: string
  job_min_salary?: number
  job_max_salary?: number
  job_salary_period?: string
  job_highlights?: {
    Qualifications?: string[]
    Benefits?: string[]
    Responsibilities?: string[]
  }
  job_onet_soc?: string
  job_onet_job_zone?: number
}

export interface JSearchResponse {
  status: string
  request_id: string
  parameters: {
    query: string
    page: number
    num_pages: number
    employment_types?: string[]
    job_requirements?: string[]
    country: string
    language: string
  }
  data: JSearchJob[] | {
    jobs?: JSearchJob[]
    [key: string]: unknown
  }
}

// Helper function to determine job type from title and description
function determineJobType(title: string, description?: string): 'ait' | 'edt' | null {
  const titleLower = title.toLowerCase()
  const descLower = (description || '').toLowerCase()
  
  if (titleLower.includes('administrator in training') || titleLower.includes('ait')) {
    return 'ait'
  }
  if (titleLower.includes('executive director') || titleLower.includes('edt')) {
    return 'edt'
  }
  if (descLower.includes('administrator in training') || descLower.includes('ait program')) {
    return 'ait'
  }
  if (descLower.includes('executive director') || descLower.includes('edt program')) {
    return 'edt'
  }
  
  return null
}

// Helper function to determine facility type from title and description
function determineFacilityType(title: string, description?: string): string | null {
  const titleLower = title.toLowerCase()
  const descLower = (description || '').toLowerCase()
  const combined = `${titleLower} ${descLower}`
  
  if (combined.includes('memory care') || combined.includes('dementia')) {
    return 'Memory Care'
  }
  if (combined.includes('skilled nursing') || combined.includes('snf')) {
    return 'Skilled Nursing'
  }
  if (combined.includes('assisted living')) {
    return 'Assisted Living'
  }
  if (combined.includes('ccrc') || combined.includes('continuing care')) {
    return 'CCRC'
  }
  if (combined.includes('rehabilitation') || combined.includes('rehab')) {
    return 'Rehabilitation'
  }
  if (combined.includes('long term care') || combined.includes('ltc')) {
    return 'Long Term Care'
  }
  
  return null
}

// Helper function to determine facility type ID
function determineFacilityTypeId(facilityType: string | null): 'memory' | 'skilled' | 'assisted' | 'ccrc' | 'rehab' | 'longterm' | null {
  if (!facilityType) return null
  
  const type = facilityType.toLowerCase()
  if (type.includes('memory')) return 'memory'
  if (type.includes('skilled')) return 'skilled'
  if (type.includes('assisted')) return 'assisted'
  if (type.includes('ccrc')) return 'ccrc'
  if (type.includes('rehab')) return 'rehab'
  if (type.includes('long term') || type.includes('ltc')) return 'longterm'
  
  return null
}

// Helper function to determine experience level
function determineExperienceLevel(description?: string): 'entry' | '1-2years' | '3-5years' | null {
  if (!description) return null
  
  const descLower = description.toLowerCase()
  
  if (descLower.includes('entry level') || descLower.includes('no experience') || descLower.includes('recent graduate')) {
    return 'entry'
  }
  if (descLower.includes('1-2 years') || descLower.includes('1+ years') || descLower.includes('2+ years')) {
    return '1-2years'
  }
  if (descLower.includes('3-5 years') || descLower.includes('3+ years') || descLower.includes('5+ years')) {
    return '3-5years'
  }
  
  return null
}

// Helper function to format salary
function formatSalary(minSalary?: number, maxSalary?: number, salaryPeriod?: string): string {
  if (!minSalary && !maxSalary) return ''
  
  const period = salaryPeriod?.toLowerCase() === 'hour' ? '/hour' : salaryPeriod?.toLowerCase() === 'year' ? '/year' : ''
  
  if (minSalary && maxSalary) {
    return `$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}${period}`
  }
  if (minSalary) {
    return `$${minSalary.toLocaleString()}+${period}`
  }
  if (maxSalary) {
    return `Up to $${maxSalary.toLocaleString()}${period}`
  }
  
  return ''
}

// Helper function to format posted date
function formatPostedDate(postedAt?: string, timestamp?: number): string {
  if (timestamp) {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }
  
  if (postedAt) {
    return postedAt
  }
  
  return 'Recently posted'
}

// Helper function to extract highlights
function extractHighlights(highlights?: JSearchJob['job_highlights']): string[] {
  if (!highlights) return []
  
  const result: string[] = []
  
  if (highlights.Qualifications) {
    result.push(...highlights.Qualifications)
  }
  if (highlights.Benefits) {
    result.push(...highlights.Benefits)
  }
  if (highlights.Responsibilities) {
    result.push(...highlights.Responsibilities)
  }
  
  return result
}

// Main mapping function
export function mapJSearchJobToJob(jsearchJob: JSearchJob): Job {
  const jobType = determineJobType(jsearchJob.job_title, jsearchJob.job_description)
  const facilityType = determineFacilityType(jsearchJob.job_title, jsearchJob.job_description)
  const facilityTypeId = determineFacilityTypeId(facilityType)
  const experienceLevel = determineExperienceLevel(jsearchJob.job_description)
  
  return {
    id: jsearchJob.job_id,
    title: jsearchJob.job_title,
    company: jsearchJob.employer_name,
    location: jsearchJob.job_location || `${jsearchJob.job_city}, ${jsearchJob.job_state}`,
    salary: formatSalary(jsearchJob.job_min_salary, jsearchJob.job_max_salary, jsearchJob.job_salary_period),
    highlights: extractHighlights(jsearchJob.job_highlights),
    postedDate: formatPostedDate(jsearchJob.job_posted_at, jsearchJob.job_posted_at_timestamp),
    facilityType: facilityType || 'Healthcare',
    jobType: jobType || 'ait', // Default to AIT if we can't determine
    experienceLevel: experienceLevel || 'entry', // Default to entry level
    isRemote: jsearchJob.job_is_remote || false,
    state: jsearchJob.job_state || '',
    facilityTypeId: facilityTypeId || 'skilled', // Default to skilled nursing
    description: jsearchJob.job_description || '',
    trainingDetails: {
      duration: '12-month program', // Default values - could be enhanced with AI extraction
      hours: '1000 hours required',
      preceptor: 'Licensed Administrator',
      startDate: 'Immediate'
    },
    facilityInfo: {
      about: `${jsearchJob.employer_name} is a healthcare provider offering quality care services.`,
      address: jsearchJob.job_location || '',
      size: 'Facility size varies'
    },
    contact: {
      name: 'HR Department',
      phone: 'Contact via application',
      email: 'hr@company.com'
    }
  }
}

// Function to map entire JSearch response
export function mapJSearchResponseToJobs(response: JSearchResponse): Job[] {
  const jobs = Array.isArray(response.data) ? response.data : response.data?.jobs || []
  return jobs.map(mapJSearchJobToJob)
}

// Function to create search parameters for JSearch API
export interface SearchParams {
  query: string
  page?: number
  num_pages?: number
  country?: string
  language?: string
  employment_types?: string[]
  job_requirements?: string[]
}

export function createSearchParams(
  searchQuery: string,
  state?: string,
  facilityType?: string,
  jobType?: 'ait' | 'edt',
  experienceLevel?: 'entry' | '1-2years' | '3-5years'
): SearchParams {
  let query = searchQuery
  
  if (state) {
    query += ` ${state}`
  }
  
  if (facilityType) {
    query += ` ${facilityType}`
  }
  
  if (jobType === 'ait') {
    query += ' "Administrator in Training" OR "AIT"'
  } else if (jobType === 'edt') {
    query += ' "Executive Director" OR "EDT"'
  }
  
  const params: SearchParams = {
    query,
    page: 1,
    num_pages: 1,
    country: 'us',
    language: 'en',
    employment_types: ['FULLTIME']
  }
  
  if (experienceLevel === 'entry') {
    params.job_requirements = ['no_experience']
  }
  
  return params
}
