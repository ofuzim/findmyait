import { Database } from './supabase';

type JobRow = Database['public']['Tables']['jobs']['Row'];

// Configuration for title case conversion
const TITLE_CASE_CONFIG = {
  // Words that should always be uppercase
  alwaysUpper: new Set([
    'ait', 'edt', 'ceo', 'cfo', 'cto', 'hr', 'it', 'rn', 'lpn', 'cna', 'pt', 'ot', 'st',
    'usa', 'us', 'uk', 'ca', 'ny', 'ca', 'tx', 'fl', 'il', 'pa', 'oh', 'ga', 'nc', 'mi',
    'api', 'ui', 'ux', 'sql', 'html', 'css', 'js', 'ts', 'ai', 'ml', 'ar', 'vr'
  ]),
  
  // Words that should always be lowercase (except at start of sentence)
  alwaysLower: new Set([
    'and', 'or', 'of', 'in', 'at', 'to', 'for', 'with', 'by', 'from', 'into', 'onto',
    'upon', 'over', 'under', 'through', 'during', 'before', 'after', 'above', 'below',
    'a', 'an', 'the', 'but', 'nor', 'so', 'yet', 'as', 'if', 'than', 'because', 'unless',
    'until', 'while', 'where', 'when', 'why', 'how', 'what', 'which', 'who', 'whom'
  ]),
  
  // Special patterns that should be preserved
  patterns: [
    { pattern: /\(([a-z]+)\)/gi, replacement: (match: string, p1: string) => `(${p1.toUpperCase()})` },
    { pattern: /\b([a-z]{2,4})\b/gi, replacement: (match: string, p1: string) => 
      TITLE_CASE_CONFIG.alwaysUpper.has(p1.toLowerCase()) ? p1.toUpperCase() : match
    }
  ]
};

// Convert string to title case with smart handling
function toTitleCase(str: string): string {
  if (!str || typeof str !== 'string') return str;
  
  // First, apply special patterns
  let result = str;
  TITLE_CASE_CONFIG.patterns.forEach(({ pattern, replacement }) => {
    result = result.replace(pattern, replacement);
  });
  
  // Then apply standard title case rules
  return result
    .toLowerCase()
    .split(/(\s+|[^\w\s])/) // Split on whitespace and non-word characters, keeping delimiters
    .map((word, index, array) => {
      // Skip empty strings and whitespace
      if (!word.trim()) return word;
      
      // Check if it's a delimiter (non-word character)
      if (!/^\w+$/.test(word)) return word;
      
      const lowerWord = word.toLowerCase();
      
      // Always uppercase words
      if (TITLE_CASE_CONFIG.alwaysUpper.has(lowerWord)) {
        return word.toUpperCase();
      }
      
      // Always lowercase words (except at start of sentence)
      if (TITLE_CASE_CONFIG.alwaysLower.has(lowerWord)) {
        // Check if this is the first word or after a sentence-ending punctuation
        const isFirstWord = index === 0;
        const prevWord = array[index - 1];
        const isAfterSentenceEnd = prevWord && /[.!?]$/.test(prevWord);
        
        if (isFirstWord || isAfterSentenceEnd) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word.toLowerCase();
      }
      
      // Default: capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

// Transform job data from Supabase to display format
export function transformJobForDisplay(job: JobRow) {
  return {
    id: job.id,
    title: getJobTitle(job),
    company: getCompany(job),
    location: getLocation(job),
    salary: getSalary(job),
    highlights: getHighlights(job),
    postedDate: getPostedDate(job),
    facilityType: getFacilityType(job),
    employmentType: getEmploymentType(job),
    chips: getChips(job),
    isRemote: job.job_is_remote || false,
    jobType: job.job_type || 'ait',
    experienceLevel: job.experience_level || 'entry',
    facilityTypeId: job.facility_type_id || 'skilled',
    state: job.job_state || '',
    description: job.job_description || '',
    applyLink: job.job_apply_link,
    employerLogo: job.employer_logo,
    employerWebsite: job.employer_website,
    // Keep original job data for any additional processing
    originalJob: job
  };
}

// Job title with fallback
function getJobTitle(job: JobRow): string {
  if (job.job_title && job.job_title.trim()) {
    return toTitleCase(job.job_title);
  }
  return "Administrator in Training (AIT)";
}

// Company name with conditional display
function getCompany(job: JobRow): string | null {
  return job.employer_name && job.employer_name.trim() ? toTitleCase(job.employer_name) : null;
}

// Location with fallbacks
function getLocation(job: JobRow): string | null {
  // Try city, state combination first
  if (job.job_city && job.job_state) {
    return `${toTitleCase(job.job_city)}, ${job.job_state}`;
  }
  
  // Fallback to job_location
  if (job.job_location && job.job_location.trim()) {
    return toTitleCase(job.job_location);
  }
  
  return null;
}

// Salary with multiple fallbacks
function getSalary(job: JobRow): string | null {
  // First try: min-max salary with period
  if (job.job_min_salary && job.job_max_salary && job.job_salary_period) {
    const min = formatSalary(job.job_min_salary);
    const max = formatSalary(job.job_max_salary);
    const period = job.job_salary_period.toLowerCase();
    return `${min} - ${max} per ${period}`;
  }
  
  // Second try: single salary with period
  if (job.job_salary && job.job_salary_period) {
    const period = job.job_salary_period.toLowerCase();
    return `${job.job_salary} per ${period}`;
  }
  
  // Third try: parse from job_highlights.Benefits
  if (job.job_highlights && typeof job.job_highlights === 'object') {
    const highlights = job.job_highlights as any;
    if (highlights.Benefits && Array.isArray(highlights.Benefits)) {
      const payInfo = highlights.Benefits.find((benefit: string) => 
        benefit.toLowerCase().includes('pay:') || 
        /\$\d{1,3}(,\d{3})*/.test(benefit)
      );
      if (payInfo) {
        // Extract only the salary range from the text
        const salaryMatch = payInfo.match(/\$[\d,]+(?: - \$[\d,]+)?/);
        if (salaryMatch) {
          return salaryMatch[0];
        }
        return payInfo;
      }
    }
  }
  
  return "Pay: not listed";
}

// Format salary number to currency string
function formatSalary(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Employment type with fallbacks
function getEmploymentType(job: JobRow): string | null {
  if (job.job_employment_type && job.job_employment_type.trim()) {
    return toTitleCase(job.job_employment_type);
  }
  
  if (job.job_employment_types && Array.isArray(job.job_employment_types) && job.job_employment_types.length > 0) {
    return job.job_employment_types.map(type => toTitleCase(type)).join(', ');
  }
  
  return null;
}

// Extract highlights for display
function getHighlights(job: JobRow): string[] {
  const highlights: string[] = [];
  
  if (job.job_highlights && typeof job.job_highlights === 'object') {
    const highlightsObj = job.job_highlights as any;
    
    // Extract from different highlight categories
    if (highlightsObj.Qualifications && Array.isArray(highlightsObj.Qualifications)) {
      highlights.push(...highlightsObj.Qualifications.slice(0, 3));
    }
    
    if (highlightsObj.Responsibilities && Array.isArray(highlightsObj.Responsibilities)) {
      highlights.push(...highlightsObj.Responsibilities.slice(0, 2));
    }
    
    if (highlightsObj.Benefits && Array.isArray(highlightsObj.Benefits)) {
      highlights.push(...highlightsObj.Benefits.slice(0, 2));
    }
  }
  
  // Fallback to job description if no highlights
  if (highlights.length === 0 && job.job_description) {
    const sentences = job.job_description.split('.').slice(0, 3);
    highlights.push(...sentences.filter(s => s.trim().length > 10));
  }
  
  return highlights.slice(0, 4); // Limit to 4 highlights
}

// Get chips/tags for display
function getChips(job: JobRow): string[] {
  const chips: string[] = [];
  
  // Experience level chip
  if (job.experience_level) {
    const levelMap: Record<string, string> = {
      'entry': 'Entry Level',
      '1-2years': '1-2 Years',
      '3-5years': '3-5 Years'
    };
    chips.push(levelMap[job.experience_level] || job.experience_level);
  }
  
  // Job benefits chips
  if (job.job_benefits && Array.isArray(job.job_benefits)) {
    const benefitMap: Record<string, string> = {
      'health_insurance': 'Health Benefits',
      'paid_time_off': 'PTO',
      'retirement': 'Retirement',
      'dental': 'Dental',
      'dental_coverage': 'Dental Coverage',
      'vision': 'Vision',
      'vision_coverage': 'Vision Coverage',
      'life_insurance': 'Life Insurance',
      'disability': 'Disability',
      'disability_insurance': 'Disability Insurance',
      'tuition_reimbursement': 'Tuition Reimbursement',
      'flexible_schedule': 'Flexible Schedule',
      'remote_work': 'Remote Work',
      '401k': '401(k)',
      'pension': 'Pension',
      'vacation': 'Vacation',
      'sick_leave': 'Sick Leave',
      'maternity_leave': 'Maternity Leave',
      'paternity_leave': 'Paternity Leave',
      'professional_development': 'Professional Development',
      'gym_membership': 'Gym Membership',
      'parking': 'Parking',
      'transportation': 'Transportation',
      'meal_allowance': 'Meal Allowance',
      'uniform_allowance': 'Uniform Allowance'
    };
    
    job.job_benefits.forEach(benefit => {
      // First try exact match
      let mappedBenefit = benefitMap[benefit];
      
      // If no exact match, try to convert snake_case to Title Case
      if (!mappedBenefit) {
        mappedBenefit = toTitleCase(benefit.replace(/_/g, ' '));
      }
      
      if (!chips.includes(mappedBenefit)) {
        chips.push(mappedBenefit);
      }
    });
  }
  
  // Facility type chip
  if (job.facility_type) {
    chips.push(job.facility_type);
  }
  
  // Job type chip
  if (job.job_type) {
    const typeMap: Record<string, string> = {
      'ait': 'AIT Program',
      'edt': 'EDT Program'
    };
    chips.push(typeMap[job.job_type] || job.job_type.toUpperCase());
  }
  
  return chips.slice(0, 4); // Limit to 4 chips
}

// Posted date with fallbacks
function getPostedDate(job: JobRow): string | null {
  // Try job_posted_at first
  if (job.job_posted_at) {
    return formatRelativeTime(job.job_posted_at);
  }
  
  // Try job_posted_at_datetime_utc
  if (job.job_posted_at_datetime_utc) {
    return formatRelativeTime(job.job_posted_at_datetime_utc);
  }
  
  // Fallback to created_at
  if (job.created_at) {
    return formatRelativeTime(job.created_at);
  }
  
  return null;
}

// Format date to relative time (e.g., "3 days ago")
function formatRelativeTime(dateString: string): string {
  if (!dateString || typeof dateString !== 'string') {
    return "Recently";
  }
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Recently";
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  // Check if date is in the future (shouldn't happen but just in case)
  if (diffInMs < 0) {
    return "Recently";
  }
  
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // Check if diffInDays is valid
  if (isNaN(diffInDays) || diffInDays < 0) {
    return "Recently";
  }
  
  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 14) {
    return "1 week ago";
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} weeks ago`;
  } else if (diffInDays < 60) {
    return "1 month ago";
  } else {
    const months = Math.floor(diffInDays / 30);
    // Ensure months is a valid number
    if (isNaN(months) || months < 1) {
      return "Recently";
    }
    return `${months} months ago`;
  }
}

// Facility type display
function getFacilityType(job: JobRow): string | null {
  return job.facility_type ? toTitleCase(job.facility_type) : null;
}
