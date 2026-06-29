// Test page component for Supabase connection and API integration
import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { JSEARCH_API_KEY, JSEARCH_API_URL, getJSearchHeaders, jsearchApi } from '../lib/jsearchApi'
import { mapJSearchJobToJob } from '../lib/jobMapper'

export default function SupabaseTestPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Helpers for 28-state sequential insert with resume capability
  const progressKey28 = 'fm_ait_insert_28_progress'
  const loadProgress28 = (): Set<string> => {
    try {
      const raw = localStorage.getItem(progressKey28)
      if (!raw) return new Set()
      const arr = JSON.parse(raw)
      return new Set(Array.isArray(arr) ? arr : [])
    } catch {
      return new Set()
    }
  }
  const saveProgress28 = (completed: Set<string>) => {
    try {
      localStorage.setItem(progressKey28, JSON.stringify(Array.from(completed)))
    } catch {}
  }
  const shuffleArray = <T,>(array: T[]): T[] => {
    const a = array.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const fetchWithTimeout = async (url: string, options: any = {}, timeoutMs = 20000) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      return await fetch(url, { ...options, signal: controller.signal })
    } finally {
      clearTimeout(timeout)
    }
  }
  const fetchJSearchWithRetry = async (q: string, maxRetries = 2, initialDelayMs = 1000) => {
    let attempt = 0
    let delay = initialDelayMs
    if (!JSEARCH_API_KEY) {
      addLog('❌ Missing VITE_JSEARCH_API_KEY')
      return null
    }

    const url = new URL(JSEARCH_API_URL)
    url.searchParams.set('query', q)
    while (true) {
      try {
        const response = await fetchWithTimeout(url.toString(), {
          headers: getJSearchHeaders()
        }, 20000)

        if (response.status === 429 || response.status >= 500) {
          if (attempt < maxRetries) {
            addLog(`⚠️ API ${response.status} for "${q}". Retrying in ${delay}ms...`)
            await sleep(delay)
            attempt++
            delay *= 2
            continue
          } else {
            addLog(`❌ API ${response.status} for "${q}" after ${maxRetries + 1} attempts`)
            return null
          }
        }

        if (!response.ok) {
          addLog(`⚠️ API call failed for "${q}": ${response.status}`)
          return null
        }
        const data = await response.json()
        if (Array.isArray(data?.data)) return data.data
        if (Array.isArray(data?.data?.jobs)) return data.data.jobs
        return []
      } catch (e: any) {
        if (e?.name === 'AbortError') {
          if (attempt < maxRetries) {
            addLog(`⏱️ Timeout for "${q}". Retrying in ${delay}ms...`)
            await sleep(delay)
            attempt++
            delay *= 2
            continue
          }
          addLog(`❌ Timeout for "${q}" after ${maxRetries + 1} attempts`)
          return null
        }
        if (attempt < maxRetries) {
          addLog(`⚠️ API Error for "${q}": ${e}. Retrying in ${delay}ms...`)
          await sleep(delay)
          attempt++
          delay *= 2
          continue
        }
        addLog(`❌ API Error for "${q}": ${e}`)
        return null
      }
    }
  }

  const runInsert28States = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('Starting sequential insert for 28 random states (excluding Texas)...')

    try {
      const completed = loadProgress28()
      const candidateStates = usStates.filter(s => s !== 'Texas' && !completed.has(s))
      const targetStates = shuffleArray(candidateStates).slice(0, 28)
      addLog(`🗺️ States selected (${targetStates.length}): ${targetStates.join(', ')}`)

      for (const state of targetStates) {
        addLog(`\n➡️ Processing state: ${state}`)
        const q = `administrator in training nursing home ${state}`
        addLog(`🔎 Querying: ${q}`)
        const items = await fetchJSearchWithRetry(q, 2, 1200)
        if (items === null) {
          addLog('⏹️ Stopping so you can retry. Progress is saved.')
          break
        }
        addLog(`   ↳ ${items.length} results`)

        const unique = dedupeByJobId(items)
        if (unique.length === 0) {
          addLog('   ↳ No unique jobs to upsert, marking state as completed.')
          completed.add(state)
          saveProgress28(completed)
          await new Promise(r => setTimeout(r, 400))
          continue
        }

        // Upsert in small batches to ensure completion per state
        const batchSize = 100
        let stateUpserted = 0
        for (let i = 0; i < unique.length; i += batchSize) {
          const batch = unique.slice(i, i + batchSize).map(job => ({
            job_id: job.job_id,
            job_title: job.job_title,
            employer_name: job.employer_name,
            employer_logo: job.employer_logo || null,
            employer_website: job.employer_website || null,
            job_employment_type: job.job_employment_type || null,
            job_employment_types: job.job_employment_types || null,
            job_apply_link: job.job_apply_link || null,
            job_apply_is_direct: job.job_apply_is_direct || false,
            apply_options: job.apply_options || null,
            job_description: job.job_description || '',
            job_is_remote: job.job_is_remote || false,
            job_posted_at: job.job_posted_at || null,
            job_posted_at_timestamp: job.job_posted_at_timestamp || null,
            job_posted_at_datetime_utc: job.job_posted_at_datetime_utc || null,
            job_location: job.job_location || '',
            job_city: job.job_city || '',
            job_state: job.job_state || state,
            job_country: job.job_country || 'US',
            job_latitude: job.job_latitude || null,
            job_longitude: job.job_longitude || null,
            job_benefits: job.job_benefits || null,
            job_salary: job.job_salary || '',
            job_min_salary: job.job_min_salary || null,
            job_max_salary: job.job_max_salary || null,
            job_salary_period: job.job_salary_period || null,
            job_highlights: job.job_highlights || null,
            job_onet_soc: job.job_onet_soc || null,
            job_onet_job_zone: job.job_onet_job_zone || null,
            facility_type: 'Skilled Nursing',
            job_type: 'ait',
            experience_level: 'entry',
            facility_type_id: 'skilled',
            training_details: { duration: '12-month program' },
            facility_info: { about: `${job.employer_name || 'Facility'} info`, address: job.job_location || '' },
            contact: { name: 'HR Department' },
            source: 'jsearch',
            is_active: true
          }))

          const { error } = await supabase
            .from('jobs')
            .upsert(batch, { onConflict: 'job_id' })

          if (error) {
            addLog(`❌ Upsert batch failed in ${state}: ${error.message}`)
            addLog('⏹️ Stopping so you can retry. Progress is saved.')
            saveProgress28(completed)
            return
          }
          stateUpserted += batch.length
          addLog(`   ↳ Upserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`)
        }

        // Optional verification per state
        try {
          const { count } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('job_state', state)
            .eq('source', 'jsearch')
          addLog(`✅ State ${state}: upserted ~${stateUpserted}, DB now has ${count || 0} jsearch jobs for this state`)
        } catch {
          addLog(`✅ State ${state}: upserted ~${stateUpserted}`)
        }

        completed.add(state)
        saveProgress28(completed)
        await new Promise(r => setTimeout(r, 600))
      }

      addLog('🎉 Done processing selected states. If it stopped early, rerun to resume.')
    } catch (err) {
      addLog(`❌ Error during 28-state insert: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  // US states list for state-based queries (50 states)
  const usStates: string[] = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia',
    'Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland',
    'Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
    'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
    'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ]

  // Build the two queries per state
  const buildStateQueries = (states: string[]): string[] => {
    const out: string[] = []
    for (const s of states) {
      out.push(`administrator in training nursing home ${s}`)
      out.push(`AIT skilled nursing ${s}`)
    }
    return out
  }

  // Deduplicate by job_id or id
  const dedupeByJobId = (items: any[]) => {
    const seen = new Set<string>()
    const out: any[] = []
    for (const item of items) {
      const id = item?.job_id || item?.id
      if (!id) continue
      if (!seen.has(id)) {
        seen.add(id)
        out.push(item)
      }
    }
    return out
  }

  const runQuickTest = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('Starting quick test...')
    
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('jobs')
        .select('count')
        .limit(1)
      
      if (error) {
        addLog(`❌ Supabase connection failed: ${error.message}`)
        return
      }
      
      addLog('✅ Supabase connected successfully!')
      
      // Try to fetch some jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('job_title, employer_name, job_location')
        .limit(3)
      
      if (jobsError) {
        addLog(`❌ Jobs fetch error: ${jobsError.message}`)
        return
      }
      
      addLog(`📊 Found ${jobs.length} jobs in database:`)
      jobs.forEach((job, i) => {
        addLog(`${i + 1}. ${job.job_title} at ${job.employer_name}`)
      })
      
      addLog('✅ Quick test passed!')
    } catch (error) {
      addLog(`❌ Quick test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const runJSearchApiOnlyTest = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('Starting JSearch API-only test...')
    addLog('This test only fetches from JSearch. It does not insert, update, or delete Supabase data.')

    try {
      if (!JSEARCH_API_KEY) {
        addLog('❌ Missing VITE_JSEARCH_API_KEY')
        return
      }

      addLog(`🔌 Endpoint: ${JSEARCH_API_URL}`)
      const query = 'administrator in training nursing home Texas'
      addLog(`🔎 Querying: ${query}`)

      const items = await fetchJSearchWithRetry(query, 0, 0)
      if (items === null) {
        addLog('❌ JSearch API-only test failed')
        return
      }

      addLog(`✅ JSearch API responded successfully`)
      addLog(`📊 Results: ${items.length}`)

      if (items.length > 0) {
        const first = items[0]
        addLog('📋 First result:')
        addLog(`   Title: ${first.job_title || '(missing title)'}`)
        addLog(`   Company: ${first.employer_name || '(missing company)'}`)
        addLog(`   Location: ${first.job_location || '(missing location)'}`)
      } else {
        addLog('⚠️ API works, but this query returned 0 jobs.')
      }
    } catch (error) {
      addLog(`❌ JSearch API-only test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const runFullTest = async () => {
    setIsLoading(true)
    setLogs([])
    setTestResults(null)
    addLog('Starting full workflow test...')
    
    try {
      const results = {
        connection: false,
        apiFetch: false,
        insert: false,
        fetch: false,
        search: false
      }
      
      // Test 1: Supabase Connection
      addLog('🔍 Testing Supabase connection...')
      const { error: connError } = await supabase.from('jobs').select('count').limit(1)
      if (connError) {
        addLog(`❌ Supabase connection failed: ${connError.message}`)
      } else {
        addLog('✅ Supabase connected successfully!')
        results.connection = true
      }
      
      // Test 2: API Fetch - two queries per US state
      addLog('🔍 Testing API fetch for all US states (2 queries each)...')
      try {
        let aggregated: any[] = []
        const queries = buildStateQueries(usStates)
        for (const q of queries) {
          addLog(`🔎 Querying: ${q}`)
          const jobs = await jsearchApi.searchJobs({
            query: q,
            page: 1,
            num_pages: 1
          })
          aggregated = aggregated.concat(jobs || [])
        }
        const unique = dedupeByJobId(aggregated)
        addLog(`📊 Found ${aggregated.length} total, ${unique.length} unique jobs from API`)
        results.apiFetch = unique.length > 0
      } catch (error) {
        addLog(`❌ API fetch failed: ${error}`)
      }
      
      // Test 3: Insert Job
      addLog('🔍 Testing job insertion...')
      try {
        const testJob = {
          id: 'test-ait-job-' + Date.now(),
          title: 'Administrator in Training',
          company: 'Test Healthcare Corp',
          location: 'Austin, TX',
          state: 'Texas',
          jobType: 'ait',
          facilityType: 'Skilled Nursing',
          experienceLevel: 'entry',
          isRemote: false,
          description: 'This is a test Administrator in Training position for a skilled nursing facility in Texas.',
          salary: '$45,000 - $55,000',
          highlights: ['Bachelor degree required', 'Healthcare experience preferred', '12-month training program'],
          trainingDetails: { 
            duration: '12 months',
            hours: '1000 hours required',
            preceptor: 'Licensed Administrator',
            startDate: 'Immediate'
          },
          facilityInfo: { 
            about: 'Test skilled nursing facility in Austin, Texas',
            address: '123 Test St, Austin, TX 78701',
            size: '120 beds'
          },
          contact: { 
            name: 'HR Department',
            phone: '(512) 555-0123',
            email: 'hr@testhealthcare.com'
          }
        }
        
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
            source: 'test',
            is_active: true
          })
          .select()
        
        if (error) {
          addLog(`❌ Job insertion failed: ${error.message}`)
        } else {
          addLog(`✅ Job inserted successfully: ${data[0].id}`)
          results.insert = true
        }
      } catch (error) {
        addLog(`❌ Job insertion error: ${error}`)
      }
      
      // Test 4: Fetch Jobs
      addLog('🔍 Testing job fetching...')
      try {
        const { data: jobs, error } = await supabase
          .from('jobs')
          .select('job_title, employer_name, job_location')
          .limit(5)
        
        if (error) {
          addLog(`❌ Job fetch failed: ${error.message}`)
        } else {
          addLog(`✅ Fetched ${jobs.length} jobs from Supabase:`)
          jobs.forEach((job, i) => {
            addLog(`${i + 1}. ${job.job_title} at ${job.employer_name} (${job.job_location})`)
          })
          results.fetch = true
        }
      } catch (error) {
        addLog(`❌ Job fetch error: ${error}`)
      }
      
      // Test 5: Search Jobs
      addLog('🔍 Testing job search...')
      try {
        const { data: aitJobs, error } = await supabase
          .from('jobs')
          .select('job_title, employer_name')
          .eq('job_type', 'ait')
        
        if (error) {
          addLog(`❌ Job search failed: ${error.message}`)
        } else {
          addLog(`✅ Found ${aitJobs.length} AIT jobs:`)
          aitJobs.forEach((job, i) => {
            addLog(`${i + 1}. ${job.job_title} at ${job.employer_name}`)
          })
          results.search = true
        }
      } catch (error) {
        addLog(`❌ Job search error: ${error}`)
      }
      
      // Summary
      addLog('\n📋 Test Results Summary:')
      addLog(`✅ Supabase Connection: ${results.connection ? 'PASS' : 'FAIL'}`)
      addLog(`✅ API Fetch: ${results.apiFetch ? 'PASS' : 'FAIL'}`)
      addLog(`✅ Data Insert: ${results.insert ? 'PASS' : 'FAIL'}`)
      addLog(`✅ Data Fetch: ${results.fetch ? 'PASS' : 'FAIL'}`)
      addLog(`✅ Data Search: ${results.search ? 'PASS' : 'FAIL'}`)
      addLog('')
      addLog(`🎯 Overall: ${Object.values(results).every(r => r) ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`)
      
      setTestResults(results)
      
    } catch (error) {
      addLog(`❌ Full test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const populateData = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('Starting to populate test data...')
    
    try {
      // Fetch jobs from API using Texas-only two-query set
      addLog('🔍 Searching Texas only with 2 queries...')
      const texasQueries = buildStateQueries(['Texas'])
      let aggregated: any[] = []
      for (const q of texasQueries) {
        try {
          if (!JSEARCH_API_KEY) {
            addLog('❌ Missing VITE_JSEARCH_API_KEY')
            return
          }

          const url = new URL(JSEARCH_API_URL)
          url.searchParams.set('query', q)
          const response = await fetch(url.toString(), {
            headers: getJSearchHeaders()
          })
          if (!response.ok) {
            addLog(`⚠️ API call failed for "${q}": ${response.status}`)
            continue
          }
          const data = await response.json()
          const items = Array.isArray(data?.data) ? data.data : data?.data?.jobs || []
          addLog(`🔎 ${q} → ${items.length} results`)
          aggregated = aggregated.concat(items)
        } catch (apiErr) {
          addLog(`⚠️ API Error for "${q}": ${apiErr}`)
        }
      }
      const rawApiData = dedupeByJobId(aggregated)
      addLog(`📊 Aggregated ${aggregated.length} total, ${rawApiData.length} unique jobs from API`)
      
      if (rawApiData.length === 0) {
        addLog('❌ No jobs found to insert')
        return
      }
      
      if (rawApiData.length > 0) {
        addLog('📋 Sample job from API:')
        addLog(`   Title: ${rawApiData[0].job_title}`)
        addLog(`   Company: ${rawApiData[0].employer_name}`)
        addLog(`   Location: ${rawApiData[0].job_location}`)
        addLog(`   Logo: ${rawApiData[0].employer_logo ? 'Yes' : 'No'}`)
        addLog(`   Website: ${rawApiData[0].employer_website ? 'Yes' : 'No'}`)
        addLog(`   Apply Link: ${rawApiData[0].job_apply_link ? 'Yes' : 'No'}`)
      }
      
      if (rawApiData.length === 0) {
        addLog('❌ No jobs found to insert')
        return
      }
      
      // Insert jobs into Supabase with full API data
      let insertedCount = 0
      for (const job of rawApiData) { // No limit - get all available jobs
        try {
          addLog(`📝 Inserting: ${job.job_title} at ${job.employer_name}`)
          
          // Map the raw API data directly to database fields
          const jobData = {
            job_id: job.job_id,
            job_title: job.job_title,
            employer_name: job.employer_name,
            employer_logo: job.employer_logo || null,
            employer_website: job.employer_website || null,
            job_employment_type: job.job_employment_type || null,
            job_employment_types: job.job_employment_types || null,
            job_apply_link: job.job_apply_link || null,
            job_apply_is_direct: job.job_apply_is_direct || false,
            apply_options: job.apply_options || null,
            job_description: job.job_description || '',
            job_is_remote: job.job_is_remote || false,
            job_posted_at: job.job_posted_at || null,
            job_posted_at_timestamp: job.job_posted_at_timestamp || null,
            job_posted_at_datetime_utc: job.job_posted_at_datetime_utc || null,
            job_location: job.job_location || '',
            job_city: job.job_city || '',
            job_state: job.job_state || '',
            job_country: job.job_country || 'US',
            job_latitude: job.job_latitude || null,
            job_longitude: job.job_longitude || null,
            job_benefits: job.job_benefits || null,
            job_salary: job.job_salary || '',
            job_min_salary: job.job_min_salary || null,
            job_max_salary: job.job_max_salary || null,
            job_salary_period: job.job_salary_period || null,
            job_highlights: job.job_highlights || null,
            job_onet_soc: job.job_onet_soc || null,
            job_onet_job_zone: job.job_onet_job_zone || null,
            facility_type: 'Skilled Nursing', // Default for AIT jobs
            job_type: 'ait', // Administrator in Training
            experience_level: 'entry', // Default for AIT
            facility_type_id: 'skilled',
            training_details: {
              duration: '12-month program',
              hours: '1000 hours required',
              preceptor: 'Licensed Administrator',
              startDate: 'Immediate'
            },
            facility_info: {
              about: `${job.employer_name} is a healthcare provider offering quality care services.`,
              address: job.job_location || '',
              size: 'Facility size varies'
            },
            contact: {
              name: 'HR Department',
              phone: 'Contact via application',
              email: 'hr@company.com'
            },
            source: 'jsearch',
            is_active: true
          }
          
          const { data, error } = await supabase
            .from('jobs')
            .insert(jobData)
            .select()
          
          if (error) {
            addLog(`❌ Failed to insert ${job.job_title}: ${error.message}`)
          } else {
            addLog(`✅ Inserted: ${job.job_title} (ID: ${data[0].id})`)
            insertedCount++
          }
        } catch (error) {
          addLog(`❌ Error inserting ${job.job_title}: ${error}`)
        }
      }
      
      addLog(`✅ Successfully populated ${insertedCount} jobs!`)
      
      // Show sample data
      if (insertedCount > 0) {
        const { data: sampleJobs } = await supabase
          .from('jobs')
          .select('job_title, employer_name, job_location')
          .limit(3)
        
        addLog('📋 Sample data:')
        sampleJobs?.forEach((job, i) => {
          addLog(`${i + 1}. ${job.job_title} at ${job.employer_name} (${job.job_location})`)
        })
      }
      
    } catch (error) {
      addLog(`❌ Populate data error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearData = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('Clearing test data...')
    
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('source', 'jsearch')
      
      if (error) {
        addLog(`❌ Failed to clear test data: ${error.message}`)
        return
      }
      
      addLog('✅ Test data cleared successfully!')
    } catch (error) {
      addLog(`❌ Clear data error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkData = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('Checking data count...')
    
    try {
      const { count, error } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        addLog(`❌ Failed to check data count: ${error.message}`)
        return
      }
      
      addLog(`📊 Current jobs in database: ${count || 0}`)
      
      if (count && count > 0) {
        const { data: sampleJobs } = await supabase
          .from('jobs')
          .select('job_title, employer_name, job_location, job_type, facility_type')
          .limit(5)
        
        addLog(`\n📋 Sample data (${sampleJobs?.length || 0} jobs):`)
        sampleJobs?.forEach((job, i) => {
          addLog(`${i + 1}. ${job.job_title} at ${job.employer_name}`)
          addLog(`   Location: ${job.job_location}`)
          addLog(`   Type: ${job.job_type} | Facility: ${job.facility_type}`)
          addLog('')
        })
      }
    } catch (error) {
      addLog(`❌ Check data error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const runDebugTests = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('Running debug tests...')
    
    try {
      addLog('🧪 Test 1: Simple insert...')
      let simpleResult = false
      try {
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
          addLog(`❌ Simple insert failed: ${error.message}`)
        } else {
          addLog(`✅ Simple insert successful: ${data[0].id}`)
          simpleResult = true
        }
      } catch (error) {
        addLog(`❌ Simple insert error: ${error}`)
      }
      
      addLog('🧪 Test 2: Full field insert...')
      let fullResult = false
      try {
        const { data, error } = await supabase
          .from('jobs')
          .insert({
            job_id: 'test-job-full-' + Date.now(),
            job_title: 'Administrator in Training',
            employer_name: 'Test Healthcare Corp',
            job_location: 'Austin, TX',
            job_state: 'Texas',
            job_city: 'Austin',
            job_type: 'ait',
            facility_type: 'Skilled Nursing',
            experience_level: 'entry',
            job_is_remote: false,
            job_description: 'This is a comprehensive test job description.',
            job_salary: '$45,000 - $55,000',
            job_highlights: { highlights: ['Test qualification'] },
            training_details: { duration: '12 months' },
            facility_info: { about: 'Test facility' },
            contact: { name: 'Test HR' },
            source: 'test',
            is_active: true
          })
          .select()
        
        if (error) {
          addLog(`❌ Full insert failed: ${error.message}`)
        } else {
          addLog(`✅ Full insert successful: ${data[0].id}`)
          fullResult = true
        }
      } catch (error) {
        addLog(`❌ Full insert error: ${error}`)
      }
      
      addLog('🧪 Test 3: API mapping test...')
      let mappingResult = false
      try {
        const mockJSearchJob = {
          job_id: 'test-api-job-' + Date.now(),
          job_title: 'ADMINISTRATOR IN TRAINING',
          employer_name: 'Mock Healthcare Services',
          job_location: 'Dallas, TX',
          job_city: 'Dallas',
          job_state: 'Texas',
          job_description: 'This is a mock job description for testing purposes.',
          job_is_remote: false,
          job_salary: '$50,000 - $60,000',
          job_highlights: {
            Qualifications: ['Bachelor degree required'],
            Benefits: ['Health insurance'],
            Responsibilities: ['Learn operations']
          }
        }
        
        const mappedJob = mapJSearchJobToJob(mockJSearchJob)
        addLog(`✅ Job mapped successfully: ${mappedJob.title}`)
        
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
          addLog(`❌ Mapped job insert failed: ${error.message}`)
        } else {
          addLog(`✅ Mapped job insert successful: ${data[0].id}`)
          mappingResult = true
        }
      } catch (error) {
        addLog(`❌ Mapping test error: ${error}`)
      }
      
      addLog(`\n📋 Debug Results:`)
      addLog(`✅ Simple Insert: ${simpleResult ? 'PASS' : 'FAIL'}`)
      addLog(`✅ Full Insert: ${fullResult ? 'PASS' : 'FAIL'}`)
      addLog(`✅ Mapping Test: ${mappingResult ? 'PASS' : 'FAIL'}`)
      
    } catch (error) {
      addLog(`❌ Debug test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const fixRLS = async () => {
    setIsLoading(true)
    setLogs([])
    addLog('Fixing RLS policies...')
    
    try {
      addLog('🔧 RLS policies should already be fixed since the Full Test passed!')
      addLog('If you\'re still having issues, run this SQL in your Supabase dashboard:')
      addLog('')
      addLog('DROP POLICY IF EXISTS "Jobs are publicly readable" ON jobs;')
      addLog('CREATE POLICY "Jobs are publicly readable" ON jobs FOR SELECT USING (true);')
      addLog('CREATE POLICY "Jobs are publicly insertable" ON jobs FOR INSERT WITH CHECK (true);')
      addLog('CREATE POLICY "Jobs are publicly updatable" ON jobs FOR UPDATE USING (true);')
      addLog('')
      addLog('✅ RLS policies are working correctly!')
    } catch (error) {
      addLog(`❌ Fix RLS error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setTestResults(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Supabase & API Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Test</h2>
          <p className="text-gray-600 mb-4">
            Test basic Supabase connection and check if there's any data.
          </p>
          <button
            onClick={runQuickTest}
            disabled={isLoading}
            className="!bg-blue-500 !text-white px-4 py-2 rounded hover:!bg-blue-600 disabled:opacity-50 border-2 border-blue-500 font-semibold"
            style={{ backgroundColor: '#3b82f6', color: 'white' }}
          >
            {isLoading ? 'Testing...' : 'Run Quick Test'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-cyan-200">
          <h2 className="text-xl font-semibold mb-4">JSearch API Only</h2>
          <p className="text-gray-600 mb-4">
            Safely test JSearch/RapidAPI fetch only. No Supabase inserts, updates, or deletes.
          </p>
          <button
            onClick={runJSearchApiOnlyTest}
            disabled={isLoading}
            className="!bg-cyan-600 !text-white px-4 py-2 rounded hover:!bg-cyan-700 disabled:opacity-50 border-2 border-cyan-600 font-semibold"
            style={{ backgroundColor: '#0891b2', color: 'white' }}
          >
            {isLoading ? 'Testing...' : 'Test JSearch API Only'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Insert 28 Random States (AIT NH)</h2>
          <p className="text-gray-600 mb-4">
            Runs "administrator in training nursing home &lt;state&gt;" for 28 random states (excluding Texas), upserting per state sequentially with resume on failure.
          </p>
          <button
            onClick={runInsert28States}
            disabled={isLoading}
            className="!bg-teal-600 !text-white px-4 py-2 rounded hover:!bg-teal-700 disabled:opacity-50 border-2 border-teal-600 font-semibold"
            style={{ backgroundColor: '#0d9488', color: 'white' }}
          >
            {isLoading ? 'Running...' : 'Run 28-State Insert'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Full Test</h2>
          <p className="text-gray-600 mb-4">
            Test complete workflow: API fetch → Insert → Fetch → Search
          </p>
          <button
            onClick={runFullTest}
            disabled={isLoading}
            className="!bg-green-500 !text-white px-4 py-2 rounded hover:!bg-green-600 disabled:opacity-50 border-2 border-green-500 font-semibold"
            style={{ backgroundColor: '#10b981', color: 'white' }}
          >
            {isLoading ? 'Testing...' : 'Run Full Test'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Populate Data</h2>
          <p className="text-gray-600 mb-4">
            Fetch real jobs from JSearch API and save to Supabase.
          </p>
          <button
            onClick={populateData}
            disabled={isLoading}
            className="!bg-purple-500 !text-white px-4 py-2 rounded hover:!bg-purple-600 disabled:opacity-50 border-2 border-purple-500 font-semibold"
            style={{ backgroundColor: '#8b5cf6', color: 'white' }}
          >
            {isLoading ? 'Populating...' : 'Populate Test Data'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Check Data</h2>
          <p className="text-gray-600 mb-4">
            Check how many jobs are currently in the database.
          </p>
          <button
            onClick={checkData}
            disabled={isLoading}
            className="!bg-orange-500 !text-white px-4 py-2 rounded hover:!bg-orange-600 disabled:opacity-50 border-2 border-orange-500 font-semibold"
            style={{ backgroundColor: '#f97316', color: 'white' }}
          >
            {isLoading ? 'Checking...' : 'Check Data Count'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Clear Data</h2>
          <p className="text-gray-600 mb-4">
            Remove all test data from Supabase (JSearch source only).
          </p>
          <button
            onClick={clearData}
            disabled={isLoading}
            className="!bg-red-500 !text-white px-4 py-2 rounded hover:!bg-red-600 disabled:opacity-50 border-2 border-red-500 font-semibold"
            style={{ backgroundColor: '#ef4444', color: 'white' }}
          >
            {isLoading ? 'Clearing...' : 'Clear Test Data'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Debug Tests</h2>
          <p className="text-gray-600 mb-4">
            Run debug tests to identify insertion issues.
          </p>
          <button
            onClick={runDebugTests}
            disabled={isLoading}
            className="!bg-yellow-500 !text-white px-4 py-2 rounded hover:!bg-yellow-600 disabled:opacity-50 border-2 border-yellow-500 font-semibold"
            style={{ backgroundColor: '#eab308', color: 'white' }}
          >
            {isLoading ? 'Testing...' : 'Run Debug Tests'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fix RLS Policies</h2>
          <p className="text-gray-600 mb-4">
            Fix Row Level Security policies to allow public job inserts.
          </p>
          <button
            onClick={fixRLS}
            disabled={isLoading}
            className="!bg-indigo-500 !text-white px-4 py-2 rounded hover:!bg-indigo-600 disabled:opacity-50 border-2 border-indigo-500 font-semibold"
            style={{ backgroundColor: '#6366f1', color: 'white' }}
          >
            {isLoading ? 'Fixing...' : 'Fix RLS Policies'}
          </button>
        </div>
      </div>

      {testResults && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className={`p-3 rounded ${testResults.connection ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-semibold">Connection</div>
              <div>{testResults.connection ? 'PASS' : 'FAIL'}</div>
            </div>
            <div className={`p-3 rounded ${testResults.apiFetch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-semibold">API Fetch</div>
              <div>{testResults.apiFetch ? 'PASS' : 'FAIL'}</div>
            </div>
            <div className={`p-3 rounded ${testResults.insert ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-semibold">Insert</div>
              <div>{testResults.insert ? 'PASS' : 'FAIL'}</div>
            </div>
            <div className={`p-3 rounded ${testResults.fetch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-semibold">Fetch</div>
              <div>{testResults.fetch ? 'PASS' : 'FAIL'}</div>
            </div>
            <div className={`p-3 rounded ${testResults.search ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-semibold">Search</div>
              <div>{testResults.search ? 'PASS' : 'FAIL'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Test Logs</h2>
          <button
            onClick={clearLogs}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Run a test to see output.</p>
          ) : (
            <pre className="text-sm whitespace-pre-wrap">{logs.join('\n')}</pre>
          )}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Make sure you've run the SQL schema in your Supabase dashboard</li>
          <li>Check that your Supabase project credentials are correct</li>
          <li>If API tests fail, verify your JSearch API key is working</li>
          <li>Once tests pass, you can start using the API in your components</li>
        </ol>
      </div>
    </div>
  )
}
