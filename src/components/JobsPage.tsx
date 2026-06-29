import React, { useState, useEffect, useRef, useMemo } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { JobFilters, FilterState } from "./JobFilters";
import { JobListings } from "./JobListings";
import { JobDetailsPanel } from "./JobDetailsPanel";
import { ApplyNowModal } from "./ApplyNowModal";
import { MobileFilterModal } from "./MobileFilterModal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin, Briefcase, ChevronDown, Loader2, X } from "lucide-react";
import { Badge } from "./ui/badge";

interface JobsPageProps {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  currentUser: any;
  onLogout: () => void;
  userProfile: any;
  pendingJobApplication: any;
  onJobApplicationAttempt: (job: any) => boolean;
  onClearPendingApplication: () => void;
  appliedJobs?: Set<string>;
  onJobApplicationSubmit: (jobId: string) => void;
  savedJobs?: Set<string>;
  onSaveJobAttempt: (jobId: string) => boolean;
}



export function JobsPage({ 
  onNavigate, 
  isLoggedIn,
  currentUser,
  onLogout,
  userProfile, 
  pendingJobApplication, 
  onJobApplicationAttempt, 
  onClearPendingApplication,
  appliedJobs,
  onJobApplicationSubmit,
  savedJobs,
  onSaveJobAttempt
}: JobsPageProps) {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(-1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null); // For highlighting
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Search animation state
  const [isSearching, setIsSearching] = useState(false);

  // Applied filter state (what's actually filtering the jobs)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    location: { state: "", remote: false },
    jobTypes: ["ait"], // Default AIT selected
    experienceLevels: ["entry", "1-2years", "3plus"], // Default all experience levels selected
    facilityTypes: []
  });

  // Filter loading state
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  // Search dropdown states
  const [locationQuery, setLocationQuery] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  
  const [positionQuery, setPositionQuery] = useState('');
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  
  // Active search terms (applied keyword searches)
  const [activeSearchKeyword, setActiveSearchKeyword] = useState('');
  const [activeSearchLocation, setActiveSearchLocation] = useState('');
  
  // Apply modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyModalJob, setApplyModalJob] = useState<any>(null);
  
  // Mobile filter modal state
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  
  // Refs for dropdowns
  const locationRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);
  
  // Ref for job listings section (for scrolling from home page search)
  const jobListingsRef = useRef<HTMLDivElement>(null);

  // US States list
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // Position suggestions
  const positionSuggestions = [
    'Administrator in Training',
    'AIT Program',
    'Executive Director Training',
    'Healthcare Administrator',
    'Nursing Home Administrator',
    'Long-term Care Administrator',
    'Assisted Living Administrator',
    'Healthcare Management Trainee',
    'Director of Operations Training',
    'Facility Administrator Training',
    'Senior Living Administrator',
    'Healthcare Leadership Program',
    'Administrator Apprenticeship',
    'Management Training Program',
    'Healthcare Executive Training'
  ];

  // Track the current rendered/ordered jobs coming from JobListings (Supabase)
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);

  // Filter functions with robust error handling using useMemo
  const filteredStates = useMemo(() => {
    try {
      const query = typeof locationQuery === 'string' ? locationQuery : '';
      return states.filter(state => {
        if (typeof state !== 'string') return false;
        return state.toLowerCase().includes(query.toLowerCase());
      });
    } catch (error) {
      console.warn('Error filtering states:', error);
      return states; // Return all states if filtering fails
    }
  }, [locationQuery]);

  const filteredPositions = useMemo(() => {
    try {
      const query = typeof positionQuery === 'string' ? positionQuery : '';
      return positionSuggestions.filter(position => {
        if (typeof position !== 'string') return false;
        return position.toLowerCase().includes(query.toLowerCase());
      });
    } catch (error) {
      console.warn('Error filtering positions:', error);
      return positionSuggestions; // Return all positions if filtering fails
    }
  }, [positionQuery]);

  // Handle dropdown selections
  const handleLocationSelect = (state: string) => {
    const safeState = String(state || '');
    setSelectedLocation(safeState);
    setLocationQuery(safeState);
    setIsLocationOpen(false);
  };

  const handlePositionSelect = (position: string) => {
    const safePosition = String(position || '');
    setSelectedPosition(safePosition);
    setPositionQuery(safePosition);
    setIsPositionOpen(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    // Close any open dropdowns
    setIsLocationOpen(false);
    setIsPositionOpen(false);
    
    // Apply the search terms
    setTimeout(() => {
      // Helper function to safely get string value
      const safeString = (val: any): string => {
        if (val === null || val === undefined || val === '') return '';
        if (typeof val === 'object') return ''; // Don't convert objects
        return String(val).trim();
      };
      
      // Try each source and use first valid result
      let keyword = safeString(positionQuery);
      if (!keyword) keyword = safeString(selectedPosition);
      
      let location = safeString(locationQuery);
      if (!location) location = safeString(selectedLocation);
      
      setActiveSearchKeyword(keyword);
      setActiveSearchLocation(location);
      setIsSearching(false);
      
      // Scroll to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const handleClearKeywordSearch = () => {
    setActiveSearchKeyword('');
    setPositionQuery('');
    setSelectedPosition('');
  };

  const handleClearLocationSearch = () => {
    setActiveSearchLocation('');
    setLocationQuery('');
    setSelectedLocation('');
  };

  const handleClearAllSearches = () => {
    setActiveSearchKeyword('');
    setActiveSearchLocation('');
    setPositionQuery('');
    setSelectedPosition('');
    setLocationQuery('');
    setSelectedLocation('');
  };

  const handleFiltersApply = (filters: FilterState) => {
    setIsApplyingFilters(true);
    
    // Temporarily restore scrolling capability
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocumentOverflow = document.documentElement.style.overflow;
    
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // Use requestAnimationFrame to ensure DOM is ready for scroll
    requestAnimationFrame(() => {
      // Try multiple scroll methods for maximum compatibility
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      
      // Fallback for browsers that don't support smooth behavior
      setTimeout(() => {
        if (window.pageYOffset > 100) {
          // If smooth scroll didn't work, use immediate scroll
          window.scrollTo(0, 0);
        }
      }, 100);
    });
    
    // Restore original overflow after a short delay
    setTimeout(() => {
      if (originalBodyOverflow) document.body.style.overflow = originalBodyOverflow;
      if (originalDocumentOverflow) document.documentElement.style.overflow = originalDocumentOverflow;
    }, 200);
    
    // Simulate loading delay and apply filters
    setTimeout(() => {
      setAppliedFilters(filters);
      setIsApplyingFilters(false);
    }, 1200);
  };

  // Ensure state is properly initialized - check on every relevant state change
  useEffect(() => {
    // Force re-render with safe state if needed
    if (typeof locationQuery !== 'string') {
      console.warn('⚠️ locationQuery is not a string, resetting to empty string');
      setLocationQuery('');
    }
    if (typeof positionQuery !== 'string') {
      console.warn('⚠️ positionQuery is not a string, resetting to empty string');
      setPositionQuery('');
    }
    if (typeof selectedLocation !== 'string') {
      console.warn('⚠️ selectedLocation is not a string, resetting to empty string');
      setSelectedLocation('');
    }
    if (typeof selectedPosition !== 'string') {
      console.warn('⚠️ selectedPosition is not a string, resetting to empty string');
      setSelectedPosition('');
    }
    if (typeof activeSearchKeyword !== 'string') {
      console.warn('⚠️ activeSearchKeyword is not a string, resetting to empty string');
      setActiveSearchKeyword('');
    }
    if (typeof activeSearchLocation !== 'string') {
      console.warn('⚠️ activeSearchLocation is not a string, resetting to empty string');
      setActiveSearchLocation('');
    }
    // Also check for [object Object] strings
    if (String(locationQuery).includes('[object')) {
      console.warn('⚠️ locationQuery contains [object], resetting');
      setLocationQuery('');
    }
    if (String(positionQuery).includes('[object')) {
      console.warn('⚠️ positionQuery contains [object], resetting');
      setPositionQuery('');
    }
    if (String(activeSearchKeyword).includes('[object')) {
      console.warn('⚠️ activeSearchKeyword contains [object], resetting');
      setActiveSearchKeyword('');
    }
    if (String(activeSearchLocation).includes('[object')) {
      console.warn('⚠️ activeSearchLocation contains [object], resetting');
      setActiveSearchLocation('');
    }
  }, [locationQuery, positionQuery, selectedLocation, selectedPosition, activeSearchKeyword, activeSearchLocation]); // Monitor state changes

  // Parse URL search parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const positionParam = urlParams.get('position');
    const locationParam = urlParams.get('location');
    const scrollToResults = urlParams.get('scrollToResults') === 'true';
    
    // Helper to validate string params
    const isValidParam = (param: string | null): boolean => {
      if (!param) return false;
      if (param === 'null' || param === 'undefined') return false;
      if (param.includes('[object')) return false;
      return param.trim().length > 0;
    };
    
    if (isValidParam(positionParam)) {
      const safePosition = positionParam!.trim();
      setPositionQuery(safePosition);
      setSelectedPosition(safePosition);
      setActiveSearchKeyword(safePosition);
    }
    
    if (isValidParam(locationParam)) {
      const safeLocation = locationParam!.trim();
      setLocationQuery(safeLocation);
      setSelectedLocation(safeLocation);
      setActiveSearchLocation(safeLocation);
    }
    
    // Scroll to job listings if coming from home page search
    if (scrollToResults && jobListingsRef.current) {
      // Use a small delay to ensure the page is fully rendered
      setTimeout(() => {
        const element = jobListingsRef.current;
        if (element) {
          // Get the element's position
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          // Scroll with offset to account for header (adjust 100px as needed)
          const offsetPosition = elementPosition - 100;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, []); // Only run on mount

  // Handle pending job application when user returns from login (use Supabase-rendered list)
  useEffect(() => {
    if (pendingJobApplication && isLoggedIn && filteredJobs.length > 0) {
      const job = filteredJobs.find(job => job.id === pendingJobApplication.id);
      if (job) {
        const filteredIndex = filteredJobs.findIndex(filteredJob => filteredJob.id === job.id);
        setSelectedJob(job);
        setSelectedJobIndex(filteredIndex !== -1 ? filteredIndex : 0);
        setSelectedJobId(job.id);
        setIsPanelOpen(true);
      }
    }
  }, [pendingJobApplication, isLoggedIn, filteredJobs]);

  // Handle job click
  const handleJobClick = (job: any, index: number) => {
    // Find the job's index within the filtered jobs array
    const filteredIndex = filteredJobs.findIndex(filteredJob => filteredJob.id === job.id);
    
    setSelectedJob(job);
    setSelectedJobIndex(filteredIndex !== -1 ? filteredIndex : 0); // Use filtered index
    setSelectedJobId(job.id); // Set for highlighting
    // Small delay to ensure panel renders off-screen first, then slides in
    setTimeout(() => {
      setIsPanelOpen(true);
    }, 10);
  };

  // Handle panel close
  const handlePanelClose = () => {
    setIsPanelOpen(false);
    // Delay clearing the job to allow animation to complete
    // Note: We keep selectedJobId for highlighting purposes
    setTimeout(() => {
      setSelectedJob(null);
      setSelectedJobIndex(-1);
      setIsLoading(false);
    }, 300);
  };

  // Handle next job
  const handleNextJob = () => {
    if (selectedJobIndex < filteredJobs.length - 1) {
      setIsLoading(true);
      setTimeout(() => {
        const nextIndex = selectedJobIndex + 1;
        const nextJob = filteredJobs[nextIndex];
        setSelectedJob(nextJob);
        setSelectedJobIndex(nextIndex);
        setSelectedJobId(nextJob.id); // Update highlighted job
        setIsLoading(false);
      }, 400);
    }
  };

  // Handle previous job
  const handlePreviousJob = () => {
    if (selectedJobIndex > 0) {
      setIsLoading(true);
      setTimeout(() => {
        const prevIndex = selectedJobIndex - 1;
        const prevJob = filteredJobs[prevIndex];
        setSelectedJob(prevJob);
        setSelectedJobIndex(prevIndex);
        setSelectedJobId(prevJob.id); // Update highlighted job
        setIsLoading(false);
      }, 400);
    }
  };

  // Handle job application from job cards
  const handleJobApplicationAttemptFromCard = (job: any) => {
    const canProceed = onJobApplicationAttempt(job);
    if (canProceed) {
      // User is logged in, show apply modal
      setApplyModalJob(job);
      setShowApplyModal(true);
    }
    // If canProceed is false, the user will be redirected to login by onJobApplicationAttempt
    return canProceed;
  };

  // Handle apply modal submission
  const handleApplyModalSubmit = (jobId: string) => {
    onJobApplicationSubmit(jobId);
    setShowApplyModal(false);
    setApplyModalJob(null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPanelOpen) {
        handlePanelClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPanelOpen]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (positionRef.current && !positionRef.current.contains(event.target as Node)) {
        setIsPositionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPanelOpen]);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        activeTab="jobs" 
        currentPage="jobs"
        onNavigate={onNavigate} 
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        userProfile={userProfile}
      />
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl text-neutral-900 mb-4 font-semibold">
              AIT Job <span className="brand-highlight-underline relative inline-block">Opportunities</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Administrator in Training positions across all 50 states
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Job search input with dropdown */}
              <div className="md:col-span-6 relative" ref={positionRef}>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Position or Keywords</label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-neutral-400 z-10" />
                  <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-neutral-400 z-10" />
                  <Input
                    type="text"
                    value={typeof positionQuery === 'string' ? positionQuery : String(positionQuery || '')}
                    onChange={(e) => {
                      const value = typeof e.target.value === 'string' ? e.target.value : '';
                      setPositionQuery(value);
                      setIsPositionOpen(true);
                    }}
                    onFocus={() => setIsPositionOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    placeholder="Administrator in Training, AIT, Executive Director..."
                    className="pl-12 pr-12 h-14 border-neutral-200 rounded-xl text-base"
                    style={{
                      '--tw-ring-color': 'var(--brand-primary)'
                    }}
                  />
                  
                  {/* Position Dropdown */}
                  {isPositionOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-light">
                      {filteredPositions.length > 0 ? (
                        filteredPositions.map((position, index) => (
                          <button
                            key={index}
                            onClick={() => handlePositionSelect(position)}
                            className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 text-sm"
                          >
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 text-neutral-400 mr-3 flex-shrink-0" />
                              <span className="text-neutral-700">{position}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-neutral-500">
                          No matching positions found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Location input with state dropdown */}
              <div className="md:col-span-4 relative" ref={locationRef}>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-neutral-400 z-10" />
                  <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-neutral-400 z-10" />
                  <Input
                    type="text"
                    value={typeof locationQuery === 'string' ? locationQuery : String(locationQuery || '')}
                    onChange={(e) => {
                      const value = typeof e.target.value === 'string' ? e.target.value : '';
                      setLocationQuery(value);
                      setIsLocationOpen(true);
                    }}
                    onFocus={() => setIsLocationOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    placeholder="Select state or enter city"
                    className="pl-12 pr-12 h-14 border-neutral-200 rounded-xl text-base"
                    style={{
                      '--tw-ring-color': 'var(--brand-primary)'
                    }}
                  />
                  
                  {/* States Dropdown */}
                  {isLocationOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-light">
                      {filteredStates.length > 0 ? (
                        filteredStates.map((state, index) => (
                          <button
                            key={index}
                            onClick={() => handleLocationSelect(state)}
                            className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 text-sm"
                          >
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-neutral-400 mr-3 flex-shrink-0" />
                              <span className="text-neutral-700">{state}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-neutral-500">
                          No matching states found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Search button */}
              <div className="md:col-span-2 flex items-end">
                <Button 
                  size="lg"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className={`font-medium h-14 w-full rounded-xl transition-all duration-300 ${
                    isSearching 
                      ? 'scale-95 shadow-2xl' 
                      : 'hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                  style={{
                    backgroundColor: isSearching ? 'var(--brand-secondary)' : 'var(--brand-primary)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSearching) {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSearching) {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                    }
                  }}
                >
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <span>Search Jobs</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters (Hidden on mobile) */}
            <div className="hidden lg:block lg:col-span-1">
              <JobFilters 
                onFiltersApply={handleFiltersApply} 
                appliedFilters={appliedFilters}
                isApplying={isApplyingFilters}
              />
            </div>
            
            {/* Right Content - Job Listings */}
            <div className="lg:col-span-3" ref={jobListingsRef}>
              {/* Active Search Terms */}
              {(activeSearchKeyword || activeSearchLocation) && (
                <div className="mb-6 bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-neutral-700">Active searches:</span>
                    
                    {activeSearchKeyword && (
                      <Badge 
                        variant="secondary" 
                        className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 pl-3 pr-2 py-1.5 flex items-center gap-2"
                      >
                        <Briefcase className="h-3 w-3" />
                        <span className="font-medium">{typeof activeSearchKeyword === 'string' ? activeSearchKeyword : String(activeSearchKeyword)}</span>
                        <button
                          onClick={handleClearKeywordSearch}
                          className="ml-1 hover:bg-brand-primary/20 rounded-full p-0.5 transition-colors"
                          aria-label="Clear keyword search"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    )}
                    
                    {activeSearchLocation && (
                      <Badge 
                        variant="secondary" 
                        className="bg-brand-secondary/10 text-brand-primary border-brand-secondary/20 pl-3 pr-2 py-1.5 flex items-center gap-2"
                      >
                        <MapPin className="h-3 w-3" />
                        <span className="font-medium">{typeof activeSearchLocation === 'string' ? activeSearchLocation : String(activeSearchLocation)}</span>
                        <button
                          onClick={handleClearLocationSearch}
                          className="ml-1 hover:bg-brand-secondary/20 rounded-full p-0.5 transition-colors"
                          aria-label="Clear location search"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    )}
                    
                    {(activeSearchKeyword && activeSearchLocation) && (
                      <button
                        onClick={handleClearAllSearches}
                        className="text-sm text-neutral-500 hover:text-neutral-700 underline ml-auto transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600">
                      Showing <span className="font-semibold text-brand-primary">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'result' : 'results'}
                    </p>
                  </div>
                </div>
              )}
              
              <JobListings 
                onJobClick={handleJobClick} 
                selectedJobId={selectedJobId}
                isLoggedIn={isLoggedIn}
                appliedJobs={appliedJobs || new Set<string>()}
                onJobApplicationAttempt={handleJobApplicationAttemptFromCard}
                onNavigate={onNavigate}
                savedJobs={savedJobs || new Set<string>()}
                onSaveJobAttempt={onSaveJobAttempt}
                filters={appliedFilters}
                isLoading={isApplyingFilters}
                onOpenMobileFilters={() => setShowMobileFilterModal(true)}
                searchKeyword={activeSearchKeyword}
                searchLocation={activeSearchLocation}
                onJobsComputed={(rendered) => setFilteredJobs(rendered)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Job Details Panel - Always render when job is selected to ensure proper animation */}
      {selectedJob && (
        <JobDetailsPanel
          job={selectedJob}
          isOpen={isPanelOpen}
          isLoading={isLoading}
          onClose={handlePanelClose}
          onPrevious={selectedJobIndex > 0 ? handlePreviousJob : undefined}
          onNext={selectedJobIndex < filteredJobs.length - 1 ? handleNextJob : undefined}
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          pendingJobApplication={pendingJobApplication}
          onJobApplicationAttempt={onJobApplicationAttempt}
          onClearPendingApplication={onClearPendingApplication}
          appliedJobs={appliedJobs || new Set<string>()}
          onJobApplicationSubmit={onJobApplicationSubmit}
          savedJobs={savedJobs || new Set<string>()}
          onSaveJobAttempt={onSaveJobAttempt}
        />
      )}

      {/* Apply Modal */}
      {applyModalJob && (
        <ApplyNowModal
          isOpen={showApplyModal}
          onClose={() => {
            setShowApplyModal(false);
            setApplyModalJob(null);
          }}
          job={applyModalJob}
          userProfile={userProfile}
          currentUser={currentUser}
          onApplicationSubmit={handleApplyModalSubmit}
        />
      )}

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={showMobileFilterModal}
        onClose={() => setShowMobileFilterModal(false)}
        onFiltersApply={handleFiltersApply}
        appliedFilters={appliedFilters}
        isApplying={isApplyingFilters}
      />

      <Footer onNavigate={onNavigate} />
    </div>
  );
}