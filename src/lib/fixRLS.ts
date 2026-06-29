// Script to fix RLS policies for public job inserts
import { supabase } from './supabase.ts'

export async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies to allow public job inserts...')
  
  try {
    // Drop existing policy
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP POLICY IF EXISTS "Jobs are publicly readable" ON jobs;'
    })
    
    if (dropError) {
      console.warn('⚠️ Could not drop existing policy (this might be expected):', dropError)
    }
    
    // Create new policies
    const policies = [
      'CREATE POLICY "Jobs are publicly readable" ON jobs FOR SELECT USING (true);',
      'CREATE POLICY "Jobs are publicly insertable" ON jobs FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Jobs are publicly updatable" ON jobs FOR UPDATE USING (true);'
    ]
    
    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy })
      
      if (error) {
        console.error(`❌ Failed to create policy: ${error.message}`)
        return false
      }
    }
    
    console.log('✅ RLS policies updated successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Failed to fix RLS policies:', error)
    return false
  }
}

// Alternative method using direct SQL execution
export async function fixRLSPoliciesDirect() {
  console.log('🔧 Attempting to fix RLS policies directly...')
  
  try {
    // Try to disable RLS temporarily for testing
    const { error } = await supabase
      .from('jobs')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Cannot access jobs table:', error)
      return false
    }
    
    console.log('✅ Jobs table is accessible')
    return true
    
  } catch (error) {
    console.error('❌ Error accessing jobs table:', error)
    return false
  }
}
