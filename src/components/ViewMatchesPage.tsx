import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { JobCard } from "./JobCard";
import { JobDetailsPanel } from "./JobDetailsPanel";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { ApplyNowModal } from "./ApplyNowModal";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { mockJobs } from "../data/mockJobs";
import { 
  Search,
  MapPin,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  Filter
} from "lucide-react";

interface ViewMatchesPageProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void; // Added logout handler prop
  alert: any;
  appliedJobs?: Set<string>;
  savedJobs?: Set<string>;
  onSaveJobAttempt?: (jobId: string) => boolean;
  onJobApplicationAttempt?: (job: any) => boolean;
  onJobApplicationSubmit?: (jobId: string) => void;
  isLoggedIn?: boolean;
  userProfile?: any;
  // ⚠️ PLACEHOLDER - Current user from LocalStorage auth
  currentUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    lastLogin?: string;
  };
  pendingJobApplication?: any;
  onClearPendingApplication?: () => void;
}

export function ViewMatchesPage({
  onNavigate,
  onLogout,
  alert,
  appliedJobs = new Set(),
  savedJobs = new Set(),
  onSaveJobAttempt,
  onJobApplicationAttempt,
  onJobApplicationSubmit,
  isLoggedIn = false,
  userProfile,
  currentUser,
  pendingJobApplication,
  onClearPendingApplication
}: ViewMatchesPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [matchingJobs, setMatchingJobs] = useState<any[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingJob, setApplyingJob] = useState<any>(null);
  
  // Calculate how well a job matches the alert criteria
  const calculateMatchScore = (job: any, keywords: string[], alertState: string, alertCity: string): number => {
    let score = 0;
    const searchText = `${job.title} ${job.company} ${job.description} ${job.facilityType}`.toLowerCase();
    const jobLocation = job.location.toLowerCase(); // "Austin, TX"
    const jobState = job.state.toLowerCase(); // "Texas"
    
    // Score for keyword matches in title (highest weight)
    keywords.forEach(keyword => {
      if (job.title.toLowerCase().includes(keyword)) {
        score += 30;
      } else if (job.description.toLowerCase().includes(keyword)) {
        score += 15;
      } else if (searchText.includes(keyword)) {
        score += 10;
      }
    });
    
    // Score for location match
    if (alertState || alertCity) {
      const stateLower = alertState.toLowerCase();
      const cityLower = alertCity.toLowerCase();
      
      if (alertState && alertCity) {
        // Both state and city specified - check for exact match
        if (jobState === stateLower && jobLocation.includes(cityLower)) {
          score += 25; // Exact city + state match
        } else if (jobState === stateLower) {
          score += 15; // State match only
        }
      } else if (alertState) {
        // Only state specified
        if (jobState === stateLower) {
          score += 20; // State match
        }
      } else if (alertCity) {
        // Only city specified
        if (jobLocation.includes(cityLower)) {
          score += 20; // City match
        }
      }
    }
    
    // Bonus for featured/urgent jobs
    if (job.featured) score += 5;
    if (job.urgentHiring) score += 5;
    
    // Cap at 100
    return Math.min(score, 100);
  };
  
  // Filter jobs based on alert criteria - memoized to avoid recalculation
  const getMatchingJobs = useMemo(() => {
    if (!alert) return [];
    
    const criteriaLower = (alert.criteria || '').toLowerCase();
    let alertState = (alert.state || '').toLowerCase();
    let alertCity = (alert.city || '').toLowerCase();
    
    // Backward compatibility: If state/city not present but location is, try to parse it
    if (!alertState && !alertCity && alert.location) {
      const locationLower = alert.location.toLowerCase();
      // For old alerts with combined location, use as fallback for partial matching
      alertState = locationLower;
    }
    
    // Extract keywords from criteria
    const keywords = criteriaLower.split(/[\s,]+/).filter(k => k.length > 2);
    
    return mockJobs
      .filter(job => {
        // Location match - if alert has location filter
        if (alertState || alertCity) {
          const jobLocation = job.location.toLowerCase(); // "Austin, TX"
          const jobState = job.state.toLowerCase(); // "Texas"
          
          let locationMatches = false;
          
          if (alertState && alertCity) {
            // Both state and city - must match both
            locationMatches = jobState === alertState && jobLocation.includes(alertCity);
          } else if (alertState) {
            // Only state - match state
            locationMatches = jobState === alertState;
          } else if (alertCity) {
            // Only city - match city
            locationMatches = jobLocation.includes(alertCity);
          }
          
          if (!locationMatches) return false;
        }
        
        // Criteria match - search in title, company, description, facility type
        if (keywords.length > 0) {
          const searchText = `${job.title} ${job.company} ${job.description} ${job.facilityType}`.toLowerCase();
          
          // Job must match at least one keyword
          const hasMatch = keywords.some(keyword => searchText.includes(keyword));
          if (!hasMatch) return false;
        }
        
        return true;
      })
      .map((job, index) => ({
        ...job,
        // Calculate match score based on keyword matches
        matchScore: calculateMatchScore(job, keywords, alertState, alertCity)
      }))
      // Sort by match score descending
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [alert]);

  useEffect(() => {
    if (alert) {
      setIsLoading(true);
      // Simulate API call to fetch matching jobs
      setTimeout(() => {
        setMatchingJobs(getMatchingJobs);
        setIsLoading(false);
      }, 800);
    }
  }, [alert, getMatchingJobs]);

  const filteredJobs = matchingJobs.filter(job => {
    if (!searchFilter) return true;
    const searchLower = searchFilter.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower)
    );
  });

  const handleJobClick = (job: any) => {
    // Transform job object to match JobDetailsPanel expectations
    const transformedJob = {
      ...job,
      highlights: job.requirements || job.highlights || [],
      postedDate: job.posted || job.postedDate,
      facilityType: job.type || job.facilityType
    };
    setSelectedJob(transformedJob);
    setShowJobDetails(true);
  };

  const handleApplyClick = (job: any) => {
    if (!onJobApplicationAttempt) return;
    
    const canProceed = onJobApplicationAttempt(job);
    if (canProceed) {
      setApplyingJob(job);
      setShowApplyModal(true);
    }
    // If canProceed is false, the user will be redirected to login
  };

  const handleBackToActivity = () => {
    onNavigate('job-activity?view=alerts');
  };

  const handleViewAllJobs = () => {
    // In a real app, this would navigate to the main jobs page with filters applied
    onNavigate('jobs');
  };

  if (!alert) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header 
          onNavigate={onNavigate} 
          onLogout={onLogout || (() => {})} 
          currentPage="view-matches" 
          currentUser={currentUser} 
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl text-neutral-800 mb-4">Alert Not Found</h1>
            <p className="text-neutral-600 mb-6">The job alert you're looking for could not be found.</p>
            <Button onClick={handleBackToActivity} className="bg-brand-primary hover:bg-brand-primary-hover">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Job Activity
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        onNavigate={onNavigate} 
        onLogout={onLogout || (() => {})} 
        currentPage="view-matches"
        currentUser={currentUser}
      />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToActivity}
              className="text-neutral-600 hover:text-neutral-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Alerts
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h1 className="text-2xl text-neutral-800 mb-4">
              Job Matches for "{alert?.name}"
            </h1>
            <div className="flex flex-col items-start gap-3 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Criteria: {alert?.criteria}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {alert?.city && alert?.state 
                    ? `${alert.city}, ${alert.state}`
                    : alert?.state 
                    ? alert.state
                    : alert?.city
                    ? alert.city
                    : 'All locations'}
                </span>
              </div>
              <Badge variant="secondary" className="bg-brand-secondary/10 text-brand-primary">
                {isLoading ? '...' : matchingJobs.length} matches found
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="lg:col-span-2">
            {/* Search Filter */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Filter these matches..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeletons
                <>
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                </>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    highlights={job.highlights || []}
                    postedDate={job.postedDate}
                    facilityType={job.facilityType}
                    jobId={job.id}
                    isLoggedIn={isLoggedIn}
                    isApplied={appliedJobs.has(job.id)}
                    onApplyClick={() => handleApplyClick(job)}
                    isSaved={savedJobs.has(job.id)}
                    onSaveClick={() => onSaveJobAttempt?.(job.id) || false}
                    onClick={() => handleJobClick(job)}
                    matchScore={job.matchScore}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
                  <Briefcase className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg text-neutral-600 mb-2">No matches found</h3>
                  <p className="text-neutral-500 mb-6">
                    {searchFilter 
                      ? 'Try adjusting your filter to see more results.'
                      : 'No jobs currently match this alert criteria.'
                    }
                  </p>
                  {searchFilter && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchFilter("")}
                      className="mr-3"
                    >
                      Clear Filter
                    </Button>
                  )}
                  <Button onClick={handleViewAllJobs} className="bg-brand-primary hover:bg-brand-primary-hover">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Browse All Jobs
                  </Button>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {!isLoading && filteredJobs.length > 0 && (
              <div className="mt-8 p-6 bg-white rounded-lg border border-neutral-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-neutral-600">
                    Showing {filteredJobs.length} of {matchingJobs.length} matches
                  </p>
                  <Button 
                    onClick={handleViewAllJobs}
                    className="bg-brand-primary hover:bg-brand-primary-hover"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Jobs
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Job Details Panel */}
          <div className="lg:col-span-1">
            {selectedJob ? (
              <div className="sticky top-8">
                <JobDetailsPanel
                  job={selectedJob}
                  isOpen={showJobDetails}
                  onClose={() => {
                    setShowJobDetails(false);
                    setSelectedJob(null);
                  }}
                  isLoggedIn={isLoggedIn}
                  appliedJobs={appliedJobs}
                  savedJobs={savedJobs}
                  onJobApplicationAttempt={onJobApplicationAttempt || (() => false)}
                  onSaveJobAttempt={onSaveJobAttempt || (() => false)}
                  onJobApplicationSubmit={onJobApplicationSubmit || (() => {})}
                  userProfile={userProfile}
                  pendingJobApplication={pendingJobApplication}
                  onClearPendingApplication={onClearPendingApplication || (() => {})}
                />
              </div>
            ) : (
              <div className="sticky top-8 bg-white rounded-lg border border-neutral-200 p-6 text-center">
                <Briefcase className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-lg text-neutral-600 mb-2">Select a Job</h3>
                <p className="text-sm text-neutral-500">
                  Click on any job card to view its details here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
      
      {/* Apply Now Modal */}
      {applyingJob && (
        <ApplyNowModal
          job={applyingJob}
          isOpen={showApplyModal}
          onClose={() => {
            setShowApplyModal(false);
            setApplyingJob(null);
            if (onClearPendingApplication) {
              onClearPendingApplication();
            }
          }}
          userProfile={userProfile}
          currentUser={currentUser}
          isApplied={appliedJobs.has(applyingJob.id)}
          onApplicationSubmit={(jobId) => {
            if (onJobApplicationSubmit) {
              onJobApplicationSubmit(jobId);
            }
          }}
        />
      )}
    </div>
  );
}