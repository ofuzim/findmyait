import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { ApplyNowModal } from "./ApplyNowModal";
import { 
  X, 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building,
  Calendar,
  GraduationCap,
  Users,
  Award,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  highlights: string[];
  postedDate: string;
  facilityType?: string;
  // Extended data for panel
  description?: string;
  requirements?: string[];
  benefits?: string[];
  originalJob?: any; // Raw job data from Supabase
  employerLogo?: string | null;
  trainingDetails?: {
    duration: string;
    hours: string;
    preceptor: string;
    startDate: string;
  };
  facilityInfo?: {
    about: string;
    address: string;
    size: string;
  };
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface JobDetailsPanelProps {
  job: JobData | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isLoggedIn: boolean;
  userProfile: any;
  pendingJobApplication: any;
  onJobApplicationAttempt: (job: any) => boolean;
  onClearPendingApplication: () => void;
  appliedJobs: Set<string>;
  onJobApplicationSubmit: (jobId: string) => void;
  savedJobs: Set<string>;
  onSaveJobAttempt: (jobId: string) => boolean;
}

// Shimmer Skeleton Component
function ShimmerBox({ className }: { className?: string }) {
  return (
    <div 
      className={`bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 bg-[length:200%_100%] animate-shimmer rounded ${className}`}
    />
  );
}

// Enhanced shimmer loading component that matches the panel design
function ShimmerContent() {
  return (
    <div className="p-6">
      {/* Title & Company Section */}
      <div className="mb-6">
        <ShimmerBox className="h-8 mb-3 w-4/5" />
        <ShimmerBox className="h-6 mb-4 w-2/3" />
        
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <ShimmerBox className="h-4 w-28" />
          <ShimmerBox className="h-4 w-36" />
          <ShimmerBox className="h-4 w-32" />
        </div>
        
        <ShimmerBox className="h-6 w-24" />
      </div>

      <div className="h-px bg-neutral-200 my-6"></div>

      {/* Cards Section */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div className="border border-neutral-200 rounded-lg p-4" key={`shimmer-card-${i}`}>
            <ShimmerBox className="h-6 mb-3 w-2/5" />
            <div className="space-y-3">
              <ShimmerBox className="h-4 w-full" />
              <ShimmerBox className="h-4 w-5/6" />
              <ShimmerBox className="h-4 w-4/5" />
              <ShimmerBox className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-neutral-200 my-6"></div>

      {/* Highlights Section */}
      <div className="mb-6">
        <ShimmerBox className="h-6 mb-3 w-1/3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={`shimmer-pill-${i}`}>
              <ShimmerBox className="h-7 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <ShimmerBox className="h-6 mb-3 w-2/5" />
        <div className="space-y-3">
          <ShimmerBox className="h-4 w-full" />
          <ShimmerBox className="h-4 w-11/12" />
          <ShimmerBox className="h-4 w-5/6" />
          <ShimmerBox className="h-4 w-4/5" />
        </div>
      </div>

      {/* Additional Content Sections */}
      <div className="space-y-6">
        <div>
          <ShimmerBox className="h-6 mb-3 w-1/3" />
          <div className="space-y-2">
            <ShimmerBox className="h-4 w-full" />
            <ShimmerBox className="h-4 w-3/4" />
          </div>
        </div>
        
        <div>
          <ShimmerBox className="h-6 mb-3 w-2/5" />
          <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
            <ShimmerBox className="h-4 w-3/5" />
            <ShimmerBox className="h-4 w-2/3" />
            <ShimmerBox className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobDetailsPanel({ 
  job, 
  isOpen, 
  isLoading = false, 
  onClose, 
  onPrevious, 
  onNext,
  isLoggedIn,
  userProfile,
  pendingJobApplication,
  onJobApplicationAttempt,
  onClearPendingApplication,
  appliedJobs,
  onJobApplicationSubmit,
  savedJobs,
  onSaveJobAttempt
}: JobDetailsPanelProps) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  
  // Handle pending job application (when user returns from login)
  useEffect(() => {
    if (pendingJobApplication && job && pendingJobApplication.id === job.id && isLoggedIn) {
      setShowApplyModal(true);
      onClearPendingApplication();
    }
  }, [pendingJobApplication, job, isLoggedIn, onClearPendingApplication]);

  const handleApplyClick = () => {
    if (!job) return;
    
    const canProceed = onJobApplicationAttempt(job);
    if (canProceed) {
      setShowApplyModal(true);
    }
    // If canProceed is false, the user will be redirected to login
  };
  
  if (!job) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />
      
      {/* Panel - Below header (z-40) and with proper positioning */}
      <div 
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-40 w-full sm:max-w-[750px] sm:min-w-[500px] sm:w-3/5 md:w-1/2 lg:w-2/5 transform transition-transform duration-300 ease-out pt-4 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-labelledby="job-panel-title"
        aria-describedby="job-panel-description"
        aria-modal="true"
      >
        {/* Panel Header - Sticky at top */}
        <div className="flex-shrink-0 bg-white border-b border-neutral-200 z-10">
          {/* Top Navigation Bar */}
          <div className="px-6 py-4 border-b border-neutral-100 pt-[0px] pr-[24px] pb-[16px] pl-[24px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-neutral-600 hover:text-neutral-900 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to jobs
                </Button>
                
                {/* Additional prominent close button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-neutral-600 hover:text-neutral-900 border-neutral-200 hover:border-neutral-400 px-3"
                  title="Close panel"
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-red-500">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900">
                  <Share2 className="h-4 w-4" />
                </Button>
                {/* Main close button - large and prominent */}
                <Button 
                  variant="ghost" 
                  size="lg" 
                  onClick={onClose} 
                  className="text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 p-3 ml-2"
                  title="Close panel"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Company Logo and Navigation Bar */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {isLoading ? (
                <ShimmerBox className="w-16 h-16 rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {job.employerLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={job.employerLogo}
                      alt={job.company}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '';
                          const icon = document.createElement('div');
                          icon.innerHTML = '';
                          parent.appendChild(icon);
                        }
                      }}
                    />
                  ) : (
                    <Building className="h-8 w-8 text-neutral-400" />
                  )}
                </div>
              )}
              
              {/* Next/Previous Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (onPrevious) {
                      // Scroll to top of panel content when navigating
                      if (scrollableContentRef.current) {
                        scrollableContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      onPrevious();
                    }
                  }}
                  disabled={!onPrevious}
                  className="h-9 px-3 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (onNext) {
                      // Scroll to top of panel content when navigating
                      if (scrollableContentRef.current) {
                        scrollableContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      onNext();
                    }
                  }}
                  disabled={!onNext}
                  className="h-9 px-3 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                
                {/* Close button in navigation area */}
                <div className="w-px h-6 bg-neutral-300 mx-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-9 w-9 p-0 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-all duration-200"
                  title="Close panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollableContentRef} className="flex-1 overflow-y-auto scrollbar-light">
          {isLoading ? (
            <ShimmerContent />
          ) : (
            <div className="p-6">
              {/* Job Title & Company */}
              <div className="mb-6">
              <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
                {job.title}
              </h1>
              <h2 className="text-lg text-neutral-700 mb-4">
                <a href="#" className="hover:underline" style={{ color: 'var(--brand-primary)' }}>
                  {job.company}
                </a>
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 text-neutral-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{job.location}</span>
                </div>
                
                {job.salary && (
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm">{job.salary}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Posted {job.postedDate}</span>
                </div>
              </div>

              {job.facilityType && (
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-neutral-100 text-neutral-700">
                    {job.facilityType}
                  </Badge>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* About the Role */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-3">About the Role</h3>
              <div className="text-sm text-neutral-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {job.description || job.originalJob?.job_description || 
                  `Join our Administrator in Training program and begin your journey to becoming a healthcare leader. This comprehensive program provides hands-on experience in all aspects of facility operations while working under the guidance of experienced administrators.`
                }
              </div>
            </div>

            <Separator className="my-6" />

            {/* Job Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Job Details</h3>
              {job.originalJob?.job_highlights && typeof job.originalJob.job_highlights === 'object' ? (
                <div className="space-y-4">
                  {Object.entries(job.originalJob.job_highlights as Record<string, any>).map(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                      return (
                        <div key={key} className="border border-neutral-200 rounded-lg p-4">
                          <h4 className="font-medium text-neutral-900 mb-3 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <ul className="space-y-3">
                            {value.map((item: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="text-brand-primary mr-3 text-lg font-bold leading-none flex-shrink-0">•</span>
                                <span className="text-sm text-neutral-700 leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
              ) : (
                <div className="space-y-4">
                  {/* Fallback: Show highlights as individual sections */}
                  {job.highlights && job.highlights.length > 0 && (
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h4 className="font-medium text-neutral-900 mb-3">Key Information</h4>
                      <ul className="space-y-3">
                        {job.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-brand-primary mr-3 text-lg font-bold leading-none flex-shrink-0">•</span>
                            <span className="text-sm text-neutral-700 leading-relaxed">{highlight}</span>
                          </li>
                        ))}
                      </ul>
            </div>
                  )}
                  
                  {/* Show requirements and benefits if available */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h4 className="font-medium text-neutral-900 mb-3">Requirements</h4>
                      <ul className="space-y-3">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-brand-primary mr-3 text-lg font-bold leading-none flex-shrink-0">•</span>
                            <span className="text-sm text-neutral-700 leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h4 className="font-medium text-neutral-900 mb-3">Benefits</h4>
                      <ul className="space-y-3">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-brand-primary mr-3 text-lg font-bold leading-none flex-shrink-0">•</span>
                            <span className="text-sm text-neutral-700 leading-relaxed">{benefit}</span>
                          </li>
                        ))}
              </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* About the Facility */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-3">About the Facility</h3>
              <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                {job.originalJob?.facility_info?.about || job.facilityInfo?.about || 
                  `Our facility is committed to providing exceptional care to residents while maintaining the highest standards of quality and compliance. We offer a supportive environment for professional growth and development.`
                }
              </p>
              <div className="text-sm text-neutral-600 space-y-1">
                <p><strong>Address:</strong> {job.originalJob?.facility_info?.address || job.facilityInfo?.address || job.location}</p>
                <p><strong>Facility Size:</strong> {job.originalJob?.facility_info?.size || job.facilityInfo?.size || job.originalJob?.facility_type || "120 beds"}</p>
                {job.originalJob?.facility_type && (
                  <p><strong>Facility Type:</strong> {job.originalJob.facility_type}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            {job.contact && (
              <div className="mb-6">
                <h3 className="font-semibold text-neutral-900 mb-3">Contact Information</h3>
                <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><strong>Questions about this position?</strong></p>
                  <div className="flex items-center text-sm text-neutral-700">
                    <Users className="h-4 w-4 mr-2" />
                    Contact {job.contact.name}
                  </div>
                  {job.contact.phone && (
                    <div className="flex items-center text-sm text-neutral-700">
                      <Phone className="h-4 w-4 mr-2" />
                      {job.contact.phone}
                    </div>
                  )}
                  {job.contact.email && (
                    <div className="flex items-center text-sm text-neutral-700">
                      <Mail className="h-4 w-4 mr-2" />
                      {job.contact.email}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Sticky Bottom Actions */}
        <div className="flex-shrink-0 bg-white border-t border-neutral-200 p-6">
          <div className="flex gap-3">
            <Button 
              size="lg"
              onClick={handleApplyClick}
              disabled={appliedJobs.has(job.id)}
              className={`flex-1 font-medium rounded-xl transition-all duration-200 ${
                appliedJobs.has(job.id) 
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' 
                  : 'hover:shadow-lg'
              }`}
              style={appliedJobs.has(job.id) ? {} : {
                backgroundColor: 'var(--brand-primary)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                if (!appliedJobs.has(job.id)) {
                  e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!appliedJobs.has(job.id)) {
                  e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                }
              }}
            >
              {appliedJobs.has(job.id) 
                ? 'Applied' 
                : (isLoggedIn ? 'Apply Now' : 'Sign In to Apply')
              }
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className={`font-medium rounded-xl transition-all duration-200 ${
                !isLoggedIn 
                  ? 'cursor-not-allowed opacity-50 border-neutral-200 text-neutral-400' 
                  : savedJobs.has(job.id)
                    ? 'border-red-300 text-red-600 bg-red-50 hover:border-red-400 hover:bg-red-100'
                    : 'border-neutral-300 hover:border-neutral-400'
              }`}
              disabled={!isLoggedIn}
              onClick={() => {
                if (isLoggedIn && onSaveJobAttempt) {
                  onSaveJobAttempt(job.id);
                }
              }}
              title={
                !isLoggedIn 
                  ? 'Sign in to save jobs' 
                  : savedJobs.has(job.id) 
                    ? 'Remove from saved jobs' 
                    : 'Save job for later'
              }
            >
              <Heart className={`h-4 w-4 mr-2 transition-all duration-200 ${
                !isLoggedIn
                  ? 'text-neutral-300'
                  : savedJobs.has(job.id) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-neutral-500'
              }`} />
              {!isLoggedIn 
                ? 'Sign In to Save' 
                : savedJobs.has(job.id) 
                  ? 'Saved' 
                  : 'Save for Later'
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Apply Now Modal */}
      <ApplyNowModal
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        userProfile={userProfile}
        isApplied={job ? appliedJobs.has(job.id) : false}
        onApplicationSubmit={onJobApplicationSubmit}
      />
    </>
  );
}