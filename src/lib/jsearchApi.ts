// JSearch API service for fetching job data
import { JSearchResponse, SearchParams, mapJSearchResponseToJobs } from './jobMapper.ts'
import { Job } from '../data/mockJobs.ts'

export const JSEARCH_API_KEY = import.meta.env.VITE_JSEARCH_API_KEY || ''
export const JSEARCH_API_URL = import.meta.env.VITE_JSEARCH_API_URL || 'https://api.openwebninja.com/jsearch/search'
export const JSEARCH_API_HOST = import.meta.env.VITE_JSEARCH_API_HOST || ''

export function getJSearchHeaders(apiKey: string = JSEARCH_API_KEY): HeadersInit {
  const usesRapidApi = Boolean(JSEARCH_API_HOST) || JSEARCH_API_URL.includes('rapidapi.com')

  return usesRapidApi
    ? {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': JSEARCH_API_HOST || 'jsearch.p.rapidapi.com',
        'Content-Type': 'application/json',
      }
    : {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      }
}

export class JSearchAPI {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string = JSEARCH_API_KEY, baseUrl: string = JSEARCH_API_URL) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  private async makeRequest(params: SearchParams): Promise<JSearchResponse> {
    if (!this.apiKey) {
      throw new Error('Missing VITE_JSEARCH_API_KEY')
    }

    const url = new URL(this.baseUrl)
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v))
        } else {
          url.searchParams.append(key, String(value))
        }
      }
    })

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: getJSearchHeaders(this.apiKey),
      })

      if (!response.ok) {
        throw new Error(`JSearch API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data as JSearchResponse
    } catch (error) {
      console.error('JSearch API request failed:', error)
      throw new Error(`Failed to fetch jobs: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async searchJobs(params: SearchParams): Promise<Job[]> {
    try {
      const response = await this.makeRequest(params)
      return mapJSearchResponseToJobs(response)
    } catch (error) {
      console.error('Job search failed:', error)
      throw error
    }
  }

  async searchAITJobs(
    state?: string,
    facilityType?: string,
    experienceLevel?: 'entry' | '1-2years' | '3-5years'
  ): Promise<Job[]> {
    const params: SearchParams = {
      query: 'Administrator in Training',
      page: 1,
      num_pages: 1,
      country: 'us',
      language: 'en',
      employment_types: ['FULLTIME']
    }

    if (state) {
      params.query += ` ${state}`
    }

    if (facilityType) {
      params.query += ` ${facilityType}`
    }

    if (experienceLevel === 'entry') {
      params.job_requirements = ['no_experience']
    }

    return this.searchJobs(params)
  }

  async searchEDTJobs(
    state?: string,
    facilityType?: string,
    experienceLevel?: 'entry' | '1-2years' | '3-5years'
  ): Promise<Job[]> {
    const params: SearchParams = {
      query: 'Executive Director Training',
      page: 1,
      num_pages: 1,
      country: 'us',
      language: 'en',
      employment_types: ['FULLTIME']
    }

    if (state) {
      params.query += ` ${state}`
    }

    if (facilityType) {
      params.query += ` ${facilityType}`
    }

    if (experienceLevel === 'entry') {
      params.job_requirements = ['no_experience']
    }

    return this.searchJobs(params)
  }

  async searchHealthcareJobs(
    query: string,
    state?: string,
    facilityType?: string,
    jobType?: 'ait' | 'edt',
    experienceLevel?: 'entry' | '1-2years' | '3-5years'
  ): Promise<Job[]> {
    let searchQuery = query

    if (jobType === 'ait') {
      searchQuery += ' "Administrator in Training" OR "AIT"'
    } else if (jobType === 'edt') {
      searchQuery += ' "Executive Director" OR "EDT"'
    }

    const params: SearchParams = {
      query: searchQuery,
      page: 1,
      num_pages: 1,
      country: 'us',
      language: 'en',
      employment_types: ['FULLTIME']
    }

    if (state) {
      params.query += ` ${state}`
    }

    if (facilityType) {
      params.query += ` ${facilityType}`
    }

    if (experienceLevel === 'entry') {
      params.job_requirements = ['no_experience']
    }

    return this.searchJobs(params)
  }

  // Method to get multiple pages of results
  async searchJobsMultiplePages(
    params: SearchParams,
    maxPages: number = 3
  ): Promise<Job[]> {
    const allJobs: Job[] = []
    
    for (let page = 1; page <= maxPages; page++) {
      try {
        const pageParams = { ...params, page, num_pages: 1 }
        const jobs = await this.searchJobs(pageParams)
        
        if (jobs.length === 0) {
          break // No more results
        }
        
        allJobs.push(...jobs)
        
        // Add a small delay between requests to be respectful to the API
        if (page < maxPages) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error(`Failed to fetch page ${page}:`, error)
        break
      }
    }
    
    return allJobs
  }
}

// Create a default instance
export const jsearchApi = new JSearchAPI()

// Utility functions for common searches
export async function searchAITJobsInState(state: string): Promise<Job[]> {
  return jsearchApi.searchAITJobs(state)
}

export async function searchEDTJobsInState(state: string): Promise<Job[]> {
  return jsearchApi.searchEDTJobs(state)
}

export async function searchHealthcareJobsInState(
  query: string,
  state: string,
  jobType?: 'ait' | 'edt'
): Promise<Job[]> {
  return jsearchApi.searchHealthcareJobs(query, state, undefined, jobType)
}
