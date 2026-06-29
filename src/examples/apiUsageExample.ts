// Example usage of JSearch API integration
// This file demonstrates how to use the new API service instead of mock data

import { jsearchApi, searchAITJobsInState, searchEDTJobsInState } from '../lib/jsearchApi.ts'
import { Job } from '../data/mockJobs.ts'

// Example 1: Basic job search
export async function searchJobsExample() {
  try {
    // Search for AIT jobs in Texas
    const aitJobs = await jsearchApi.searchAITJobs('Texas', 'Skilled Nursing', 'entry')
    console.log('Found AIT jobs:', aitJobs.length)
    
    // Search for EDT jobs in California
    const edtJobs = await jsearchApi.searchEDTJobs('California', 'Memory Care', '1-2years')
    console.log('Found EDT jobs:', edtJobs.length)
    
    return { aitJobs, edtJobs }
  } catch (error) {
    console.error('Search failed:', error)
    return { aitJobs: [], edtJobs: [] }
  }
}

// Example 2: Custom search with multiple parameters
export async function customSearchExample() {
  try {
    const jobs = await jsearchApi.searchHealthcareJobs(
      'healthcare administrator',
      'Texas',
      'Skilled Nursing',
      'ait',
      'entry'
    )
    
    console.log('Custom search results:', jobs)
    return jobs
  } catch (error) {
    console.error('Custom search failed:', error)
    return []
  }
}

// Example 3: Multiple pages search
export async function multiplePagesExample() {
  try {
    const jobs = await jsearchApi.searchJobsMultiplePages({
      query: 'Administrator in Training Texas',
      page: 1,
      num_pages: 1,
      country: 'us',
      language: 'en',
      employment_types: ['FULLTIME']
    }, 3) // Get up to 3 pages
    
    console.log('Multiple pages results:', jobs.length)
    return jobs
  } catch (error) {
    console.error('Multiple pages search failed:', error)
    return []
  }
}

// Example 4: Using utility functions
export async function utilityFunctionsExample() {
  try {
    // Search AIT jobs in specific states
    const texasAIT = await searchAITJobsInState('Texas')
    const californiaAIT = await searchAITJobsInState('California')
    
    // Search EDT jobs
    const texasEDT = await searchEDTJobsInState('Texas')
    
    console.log('Texas AIT jobs:', texasAIT.length)
    console.log('California AIT jobs:', californiaAIT.length)
    console.log('Texas EDT jobs:', texasEDT.length)
    
    return {
      texasAIT,
      californiaAIT,
      texasEDT
    }
  } catch (error) {
    console.error('Utility functions example failed:', error)
    return {
      texasAIT: [],
      californiaAIT: [],
      texasEDT: []
    }
  }
}

// Example 5: Error handling and fallback
export async function searchWithFallback(query: string, state: string): Promise<Job[]> {
  try {
    // Try to search with the API
    const jobs = await jsearchApi.searchHealthcareJobs(query, state)
    
    if (jobs.length > 0) {
      console.log(`Found ${jobs.length} jobs via API`)
      return jobs
    }
    
    // If no results, you could fall back to mock data or cached data
    console.log('No API results, falling back to mock data')
    // return mockJobs.filter(job => job.state === state)
    return []
    
  } catch (error) {
    console.error('API search failed, using fallback:', error)
    // Fallback to mock data or cached data
    // return mockJobs.filter(job => job.state === state)
    return []
  }
}

// Example 6: Integration with React component (pseudo-code)
export function useJobSearch() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchJobs = async (query: string, state?: string, jobType?: 'ait' | 'edt') => {
    setLoading(true)
    setError(null)
    
    try {
      let results: Job[] = []
      
      if (jobType === 'ait') {
        results = await jsearchApi.searchAITJobs(state, undefined, 'entry')
      } else if (jobType === 'edt') {
        results = await jsearchApi.searchEDTJobs(state, undefined, 'entry')
      } else {
        results = await jsearchApi.searchHealthcareJobs(query, state)
      }
      
      setJobs(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  return { jobs, loading, error, searchJobs }
}

// Example 7: Batch processing for multiple states
export async function searchMultipleStates(states: string[], jobType: 'ait' | 'edt' = 'ait') {
  const results: { [state: string]: Job[] } = {}
  
  for (const state of states) {
    try {
      if (jobType === 'ait') {
        results[state] = await jsearchApi.searchAITJobs(state)
      } else {
        results[state] = await jsearchApi.searchEDTJobs(state)
      }
      
      console.log(`Found ${results[state].length} ${jobType} jobs in ${state}`)
      
      // Add delay between requests to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      console.error(`Failed to search ${state}:`, error)
      results[state] = []
    }
  }
  
  return results
}

// Example usage in a component:
/*
import { useJobSearch } from './apiUsageExample'

function JobSearchComponent() {
  const { jobs, loading, error, searchJobs } = useJobSearch()
  
  const handleSearch = (query: string, state: string) => {
    searchJobs(query, state, 'ait')
  }
  
  return (
    <div>
      {loading && <p>Searching...</p>}
      {error && <p>Error: {error}</p>}
      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.company} - {job.location}</p>
        </div>
      ))}
    </div>
  )
}
*/

