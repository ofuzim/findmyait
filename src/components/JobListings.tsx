import React, { useMemo, useState, useEffect, useRef } from "react";
import { JobCard } from "./JobCard";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { FilterState } from "./JobFilters";
import { supabase } from "../lib/supabase";
import { transformJobForDisplay } from "../lib/jobDataTransformers";
import { Database } from "../lib/supabase";

type JobRow = Database['public']['Tables']['jobs']['Row'];

interface JobListingsProps {
  onJobClick: (job: any, index: number) => void;
  selectedJobId?: string | null;
  isLoggedIn: boolean;
  appliedJobs: Set<string>;
  onJobApplicationAttempt: (job: any) => boolean;
  onNavigate: (page: string) => void;
  savedJobs: Set<string>;
  onSaveJobAttempt: (jobId: string) => boolean;
  filters?: FilterState;
  isLoading?: boolean;
  onOpenMobileFilters?: () => void;
  searchKeyword?: string;
  searchLocation?: string;
  onJobsComputed?: (jobs: any[]) => void; // callback to bubble up rendered/ordered jobs
}

export function JobListings({ 
  onJobClick, 
  selectedJobId, 
  isLoggedIn, 
  appliedJobs, 
  onJobApplicationAttempt, 
  onNavigate,
  savedJobs,
  onSaveJobAttempt,
  filters,
  isLoading = false,
  onOpenMobileFilters,
  searchKeyword = '',
  searchLocation = '',
  onJobsComputed
}: JobListingsProps) {
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Cache for transformed jobs to avoid re-transforming repeatedly
  const transformCacheRef = useRef<Map<string, any>>(new Map());
  // Ref to top of list for precise scroll alignment
  const listTopRef = useRef<HTMLDivElement>(null);
  const scrollListIntoView = () => {
    const el = listTopRef.current;
    if (!el) return;
    const stickyOffset = 90; // adjust for sticky header height
    const y = el.getBoundingClientRect().top + window.pageYOffset - stickyOffset;
    window.scrollTo({ top: y, left: 0, behavior: 'smooth' });
  };

  // Server-side fetch with pagination, filters, sorting, search
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);

        const from = (currentPage - 1) * jobsPerPage;
        const to = from + jobsPerPage - 1;

        let query = supabase
          .from('jobs')
          .select(`
            id,
            job_id,
            job_title,
            employer_name,
            employer_logo,
            job_city,
            job_state,
            job_location,
            job_min_salary,
            job_max_salary,
            job_salary_period,
            job_benefits,
            experience_level,
            job_employment_type,
            job_employment_types,
            job_posted_at,
            job_posted_at_datetime_utc,
            created_at,
            job_type,
            job_is_remote,
            facility_type_id,
            job_highlights
          `, { count: 'exact' })
          .eq('is_active', true);

        // Translate searchKeyword to ilike across key columns
        if (searchKeyword && searchKeyword.trim()) {
          const term = `%${searchKeyword.trim()}%`;
          query = query.or(`job_title.ilike.${term},employer_name.ilike.${term},job_description.ilike.${term},job_type.ilike.${term}`);
        }

        // Translate searchLocation
        if (searchLocation && searchLocation.trim()) {
          const loc = `%${searchLocation.trim()}%`;
          query = query.or(`job_state.ilike.${loc},job_location.ilike.${loc},job_city.ilike.${loc}`);
        }

        // Sidebar filters
        if (filters) {
          if (filters.location.state) {
            query = query.eq('job_state', filters.location.state);
          }
          if (filters.location.remote) {
            query = query.eq('job_is_remote', true);
          }
          if (filters.jobTypes && filters.jobTypes.length > 0) {
            query = query.in('job_type', filters.jobTypes);
          }
          if (filters.experienceLevels && filters.experienceLevels.length > 0) {
            query = query.in('experience_level', filters.experienceLevels);
          }
          if (filters.facilityTypes && filters.facilityTypes.length > 0) {
            query = query.in('facility_type_id', filters.facilityTypes);
          }
        }

        // Sorting
        if (sortBy === 'date' || sortBy === 'relevance') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'location') {
          query = query.order('job_location', { ascending: true }).order('job_city', { ascending: true });
        } else if (sortBy === 'salary') {
          query = query.order('job_max_salary', { ascending: false });
        }

        // Pagination
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;

        setJobs(data || []);
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobsError(error instanceof Error ? error.message : 'Failed to fetch jobs');
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, jobsPerPage, filters, sortBy, searchKeyword, searchLocation]);

  // With server-side filtering/sorting, the jobs are already the page slice
  const filteredAndSortedJobs = jobs;

  // Transform filtered list with caching
  const transformedJobs = useMemo(() => {
    const cache = transformCacheRef.current;
    const out: any[] = [];
    for (const job of filteredAndSortedJobs) {
      const key = String(job.id);
      if (cache.has(key)) {
        out.push(cache.get(key));
      } else {
        const transformed = transformJobForDisplay(job);
        cache.set(key, transformed);
        out.push(transformed);
      }
    }
    return out;
    // We intentionally do not include cache in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAndSortedJobs]);

  // Notify parent whenever the rendered/ordered list changes
  useEffect(() => {
    if (onJobsComputed) {
      onJobsComputed(transformedJobs);
    }
  }, [transformedJobs, onJobsComputed]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Calculate pagination values
  const totalJobs = totalCount;
  const totalPages = Math.ceil((totalCount || 0) / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = transformedJobs; // already server-paged

  // Pagination loading state
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  // Pagination handlers with loading and scroll (same logic as Apply Filters)
  const handlePreviousPage = () => {
    if (isPaginationLoading) return;
    
    setIsPaginationLoading(true);
    
    // Smooth scroll to top of list
    requestAnimationFrame(scrollListIntoView);
    
    // Update page after brief delay for shimmer effect
    setTimeout(() => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
      setIsPaginationLoading(false);
    }, 800);
  };

  const handleNextPage = () => {
    if (isPaginationLoading) return;
    
    setIsPaginationLoading(true);
    
    // Smooth scroll to top of list
    requestAnimationFrame(scrollListIntoView);
    
    // Update page after brief delay for shimmer effect
    setTimeout(() => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
      setIsPaginationLoading(false);
    }, 800);
  };

  const handlePageClick = (page: number) => {
    if (isPaginationLoading || page === currentPage) return;
    
    setIsPaginationLoading(true);
    
    // Smooth scroll to top of list
    requestAnimationFrame(scrollListIntoView);
    
    // Update page after brief delay for shimmer effect
    setTimeout(() => {
      setCurrentPage(page);
      setIsPaginationLoading(false);
    }, 800);
  };

  // Generate page numbers for pagination display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  return (
    <div>
      {/* Results Header */}
      <div ref={listTopRef} className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Showing {startIndex + 1}-{Math.min(endIndex, totalJobs)} of {totalJobs} AIT opportunities
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            {totalJobs === totalCount 
              ? "Administrator in Training positions nationwide"
              : `Filtered from ${totalCount} total positions`
            }
          </p>
        </div>
        
        {/* Sort - Only show on desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-sm text-neutral-600">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 border border-neutral-300 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Date Posted</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Filter and Sort - Only show on mobile */}
      {onOpenMobileFilters && (
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onOpenMobileFilters}
            className="flex items-center gap-2 text-neutral-700 border-neutral-300 hover:bg-neutral-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 border border-neutral-300 shadow-sm h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date Posted</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Job Cards Grid */}
      <div className="space-y-4 mb-8">
        {(isLoading || isPaginationLoading || jobsLoading) ? (
          // Show shimmer skeletons while loading
          Array.from({ length: jobsPerPage }).map((_, index) => (
            <JobCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : jobsError ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-600 mb-2">Error loading jobs</p>
            <p className="text-sm text-red-500">{jobsError}</p>
          </div>
        ) : currentJobs.length > 0 ? (
          currentJobs.map((transformedJob, index) => {
            const jobId = transformedJob.id;
            return (
          <JobCard
                title={transformedJob.title}
                company={transformedJob.company}
                location={transformedJob.location}
                salary={transformedJob.salary}
                highlights={transformedJob.highlights}
                postedDate={transformedJob.postedDate}
                facilityType={transformedJob.facilityType}
                employmentType={transformedJob.employmentType}
                chips={transformedJob.chips}
                isSelected={selectedJobId === jobId}
                onClick={() => onJobClick(transformedJob, startIndex + index)}
                jobId={jobId}
            isLoggedIn={isLoggedIn}
                isApplied={appliedJobs.has(jobId)}
                onApplyClick={() => onJobApplicationAttempt(transformedJob)}
            onNavigate={onNavigate}
                isSaved={savedJobs.has(jobId)}
                onSaveClick={() => onSaveJobAttempt(jobId)}
          />
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex justify-center mb-4">
              <Filter className="h-10 w-10 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No jobs match your filters</h3>
            <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto">
              Try adjusting your filters or keywords to see more results.
            </p>
            <ul className="text-sm text-neutral-700 text-left max-w-lg mx-auto space-y-2 mb-6">
              <li>• Remove one or more filters like facility type or experience level</li>
              <li>• Expand your location or toggle the Remote option</li>
              <li>• Try broader keywords like "AIT" or "Administrator in Training"</li>
            </ul>
            {onOpenMobileFilters && (
              <Button 
                variant="outline" 
                onClick={onOpenMobileFilters}
                className="border-neutral-300"
              >
                Open Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1 || isPaginationLoading}
            onClick={handlePreviousPage}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="text-neutral-500 px-1">...</span>
              ) : (
                <Button 
                  key={page}
                  size="sm" 
                  variant={currentPage === page ? "default" : "outline"}
                  className="w-8 h-8"
                  onClick={() => handlePageClick(page as number)}
                  disabled={isPaginationLoading}
                  style={{
                    backgroundColor: currentPage === page ? 'var(--brand-primary)' : undefined,
                    color: currentPage === page ? 'white' : undefined
                  }}
                >
                  {page}
                </Button>
              )
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage === totalPages || isPaginationLoading}
            onClick={handleNextPage}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}