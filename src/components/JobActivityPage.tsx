import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./ui/sonner";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { ApplyNowModal } from "./ApplyNowModal";
import { JobDetailsPanel } from "./JobDetailsPanel";
import { CreateAlertModal } from "./CreateAlertModal";
import { ViewApplicationModal } from "./ViewApplicationModal";
import { LocalStorageAuth, JobApplicationDetail } from "../utils/localStorage";
import { mockJobs, Job } from "../data/mockJobs";

import { 
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Building,
  Clock,
  Eye,
  Heart,
  Bell,
  Briefcase,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  FileText
} from "lucide-react";

interface JobActivityPageProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void; // Added logout handler prop
  userProfile?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    education: string;
    educationLevel?: string; // Extended field from ProfileCompletionPage
    currentPosition: string;
    yearsExperience: string;
    hasLicense: boolean;
    licenseNumber: string;
    availableStartDate: string;
    salaryExpectation: string;
    relocateWilling: string;
    referralSource: string;
    resumeFile?: {
      name: string;
      size: number;
      type: string;
      url: string;
    };
  };
  // ⚠️ PLACEHOLDER - Current user from LocalStorage auth
  currentUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    lastLogin?: string;
  };
  initialView?: 'applications' | 'saved' | 'recommendations' | 'alerts';
  appliedJobs?: Set<string>;
  savedJobs?: Set<string>;
  onJobApplicationSubmit?: (jobId: string) => void;
  isLoggedIn?: boolean;
  pendingJobApplication?: any;
  onJobApplicationAttempt?: (job: any) => boolean;
  onClearPendingApplication?: () => void;
  onSaveJobAttempt?: (jobId: string) => boolean;
}

export function JobActivityPage({ 
  onNavigate, 
  onLogout,
  userProfile,
  currentUser, 
  initialView = 'applications',
  appliedJobs,
  savedJobs,
  onJobApplicationSubmit,
  isLoggedIn = true,
  pendingJobApplication,
  onJobApplicationAttempt = () => true,
  onClearPendingApplication = () => {},
  onSaveJobAttempt = () => true
}: JobActivityPageProps) {
  const [activeTab, setActiveTab] = useState(initialView);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // Modal state for job application
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
  // Modal state for view application
  const [showViewApplicationModal, setShowViewApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplicationDetail | null>(null);
  
  // Modal state for create/edit alert
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  // Job details panel state
  const [selectedJobForPanel, setSelectedJobForPanel] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 DYNAMIC APPLICATIONS DATA - Get real data from localStorage based on user's applied jobs
  // In production: This would come from backend API with detailed application data
  const [applications, setApplications] = useState<any[]>([]);
  
  // 🔄 DYNAMIC SAVED JOBS DATA - Get real data from localStorage based on user's saved jobs  
  // In production: This would come from backend API with detailed saved job data
  const [savedJobsData, setSavedJobsData] = useState<any[]>([]);

  // 🎯 ENHANCED STATE-BASED RECOMMENDATIONS - Generate recommendations based on user's availableStates
  // Using centralized utility function for consistency across components
  // Jobs from user's preferred states get 90%+ match scores vs 85%+ for others
  const [recommendations] = useState(
    LocalStorageAuth.generateJobRecommendations(mockJobs, userProfile, 6, 'activity')
  );

  // 🔄 PLACEHOLDER JOB ALERTS - Using LocalStorage for persistence
  // In production: This would fetch from backend API
  const [jobAlerts, setJobAlerts] = useState<any[]>([]);

  // Load user's job alerts, applications, and saved jobs from localStorage on component mount
  useEffect(() => {
    if (currentUser) {
      // Load job alerts
      const userAlerts = LocalStorageAuth.getUserJobAlerts(currentUser.id);
      setJobAlerts(userAlerts);
      
      // Update match counts with current job data (simulated matching)
      LocalStorageAuth.updateAlertMatchCounts(currentUser.id, mockJobs);
      
      // Reload alerts after match count update
      const updatedAlerts = LocalStorageAuth.getUserJobAlerts(currentUser.id);
      setJobAlerts(updatedAlerts);
      
      // 🔄 LOAD APPLICATIONS DATA - Get user's applied job IDs (optimized)
      const userAppliedJobIds = LocalStorageAuth.getUserApplications(currentUser.id);
      if (userAppliedJobIds.length > 0) {
        const applicationsData = userAppliedJobIds.slice(0, 20).map((jobId, index) => {
          // Simple lookup without complex operations
          const job = mockJobs.find(j => j.id === jobId);
          
          return {
            id: jobId,
            company: job?.company || "Healthcare Facility",
            position: job?.title || "Administrator in Training",
            location: job?.location || "Various Locations",
            salary: job?.salary || "$60,000 - $75,000",
            appliedDate: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'applied',
            statusText: 'Application Sent',
            jobType: "Full-time",
            remote: job?.isRemote || false
          };
        });
        setApplications(applicationsData);
      } else {
        setApplications([]);
      }
      
      // 🔄 LOAD SAVED JOBS DATA - Get user's saved job IDs (optimized)
      const userSavedJobIds = LocalStorageAuth.getUserSavedJobs(currentUser.id);
      if (userSavedJobIds.length > 0) {
        const savedJobsDataList = userSavedJobIds.slice(0, 20).map((jobId, index) => {
          const job = mockJobs.find(j => j.id === jobId);
          
          return {
            id: jobId,
            company: job?.company || "Healthcare Facility",
            position: job?.title || "Administrator in Training", 
            location: job?.location || "Various Locations",
            salary: job?.salary || "$60,000 - $75,000",
            savedDate: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            matchPercentage: 85 + (index % 10),
            jobType: "Full-time",
            remote: job?.isRemote || false,
            newActivity: index < 2
          };
        });
        setSavedJobsData(savedJobsDataList);
      } else {
        setSavedJobsData([]);
      }
    }
  }, [currentUser, savedJobs]);

  // Filter and sort functions
  const getFilteredApplications = () => {
    let filtered = applications.filter(app => {
      const matchesSearch = app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !locationFilter || app.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesStatus = !statusFilter || statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesLocation && matchesStatus;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'oldest':
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        case 'company':
          return a.company.localeCompare(b.company);
        case 'position':
          return a.position.localeCompare(b.position);
        default:
          return 0;
      }
    });
  };

  const getFilteredSavedJobs = () => {
    let filtered = savedJobsData.filter(job => {
      const matchesSearch = job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
        case 'oldest':
          return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
        case 'company':
          return a.company.localeCompare(b.company);
        case 'position':
          return a.position.localeCompare(b.position);
        case 'match':
          return (b.matchPercentage || 0) - (a.matchPercentage || 0);
        default:
          return 0;
      }
    });
  };

  const getFilteredRecommendations = () => {
    let filtered = recommendations.filter(job => {
      const matchesSearch = job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // For recommendations, we don't have dates, so maintain original order for "newest"
          return 0;
        case 'oldest':
          // For recommendations, reverse the original order for "oldest"
          return 0;
        case 'company':
          return a.company.localeCompare(b.company);
        case 'position':
          return a.position.localeCompare(b.position);
        case 'match':
          return (b.matchPercentage || 0) - (a.matchPercentage || 0);
        default:
          return (b.matchPercentage || 0) - (a.matchPercentage || 0); // Default to best match
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { color: "bg-neutral-100 text-neutral-600", icon: Clock },
      under_review: { color: "bg-yellow-100 text-yellow-800", icon: Eye },
      interview: { color: "bg-blue-100 text-blue-800", icon: Calendar },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
      offer: { color: "bg-green-100 text-green-800", icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
    const Icon = config.icon;
    
    return { color: config.color, icon: Icon };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleApplyNowClick = (job: any) => {
    // Convert job data to the format expected by ApplyNowModal
    const modalJob = {
      id: job.id,
      title: job.position,
      company: job.company,
      location: job.location,
      salary: job.salary
    };
    setSelectedJob(modalJob);
    setShowApplyModal(true);
  };

  const handleViewJobClick = (job: any) => {
    setIsLoading(true);
    
    // Convert job data to the format expected by JobDetailsPanel
    const panelJob = {
      id: job.id,
      title: job.position,
      company: job.company,
      location: job.location,
      salary: job.salary,
      highlights: job.highlights || ["Entry-level position", "Training provided", "Growth opportunities"],
      postedDate: job.appliedDate || job.savedDate || "2024-01-15",
      facilityType: "Skilled Nursing Facility",
      description: "Join our team as an Administrator in Training and begin your career in healthcare administration. This role offers comprehensive training and mentorship to prepare you for licensure and leadership in nursing home administration.",
      requirements: [
        "Bachelor's degree in Healthcare Administration, Business, or related field",
        "Strong communication and leadership skills",
        "Interest in long-term care administration",
        "Ability to complete state-required AIT program",
        "Pass background checks and health screenings"
      ],
      benefits: [
        "Comprehensive health, dental, and vision insurance",
        "401(k) with company match",
        "Paid time off and holidays",
        "Professional development opportunities",
        "Tuition reimbursement for continued education",
        "Mentorship program with experienced administrators"
      ],
      trainingDetails: {
        duration: "12-24 months",
        hours: "1,000+ hours",
        preceptor: "Licensed Nursing Home Administrator",
        startDate: "Flexible based on availability"
      },
      facilityInfo: {
        about: `${job.company} is a leading provider of long-term care services, committed to delivering exceptional care to our residents. Our facility features state-of-the-art amenities and a dedicated team of healthcare professionals.`,
        address: job.location,
        size: "120 beds"
      },
      contact: {
        name: "Jennifer Smith",
        phone: "(555) 123-4567",
        email: "careers@company.com"
      }
    };

    setSelectedJobForPanel(panelJob);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setIsPanelOpen(true);
    }, 300);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedJobForPanel(null);
    }, 300);
  };

  // Job Alert handlers
  const handleCreateAlert = () => {
    setEditingAlert(null); // Clear any existing editing state
    setShowCreateAlertModal(true);
  };

  const handleCreateAlertSubmit = (alertData: any) => {
    if (!currentUser) return;

    if (editingAlert) {
      // Update existing alert - 🔄 PLACEHOLDER using LocalStorage
      // In production: This would be an API call to PUT /api/job-alerts/:id
      const success = LocalStorageAuth.updateJobAlert(currentUser.id, alertData.id, alertData);
      if (success) {
        // Recalculate match counts immediately after updating the alert
        LocalStorageAuth.updateAlertMatchCounts(currentUser.id, mockJobs);
        
        // Refresh alerts from localStorage with updated match counts
        const updatedAlerts = LocalStorageAuth.getUserJobAlerts(currentUser.id);
        setJobAlerts(updatedAlerts);
        toast.success(`"${alertData.name}" alert updated successfully`);
      } else {
        toast.error("Failed to update alert");
      }
    } else {
      // Create new alert - 🔄 PLACEHOLDER using LocalStorage
      // In production: This would be an API call to POST /api/job-alerts
      const newAlert = LocalStorageAuth.createJobAlert(currentUser.id, alertData);
      if (newAlert) {
        // Recalculate match counts immediately after creating the alert
        LocalStorageAuth.updateAlertMatchCounts(currentUser.id, mockJobs);
        
        // Refresh alerts from localStorage with updated match counts
        const updatedAlerts = LocalStorageAuth.getUserJobAlerts(currentUser.id);
        setJobAlerts(updatedAlerts);
        toast.success(`"${alertData.name}" alert created successfully`, {
          description: "You'll receive notifications when new jobs match your criteria"
        });
      } else {
        toast.error("Failed to create alert");
      }
    }
    setShowCreateAlertModal(false);
    setEditingAlert(null);
  };

  const handleEditAlert = (alert: any) => {
    setEditingAlert(alert);
    setShowCreateAlertModal(true);
  };

  const handleDeleteAlert = (alertId: string) => {
    if (!currentUser) return;

    // 🔄 PLACEHOLDER - Delete alert from LocalStorage
    // In production: This would be an API call to DELETE /api/job-alerts/:id
    const success = LocalStorageAuth.deleteJobAlert(currentUser.id, alertId);
    
    if (success) {
      // Refresh alerts from localStorage
      const updatedAlerts = LocalStorageAuth.getUserJobAlerts(currentUser.id);
      setJobAlerts(updatedAlerts);
      toast.success("Alert deleted successfully");
    } else {
      toast.error("Failed to delete alert");
    }
  };

  const handleViewMatches = (alert: any) => {
    // Navigate to view matches page with alert data in URL parameters
    const params = new URLSearchParams({
      name: alert.name || '',
      criteria: alert.criteria || '',
      location: alert.location || '',
      state: alert.state || '',
      city: alert.city || '',
      matches: alert.matchCount?.toString() || '0',
      id: alert.id || 'unknown'
    });
    onNavigate(`view-matches?${params.toString()}`);
  };

  const handleJobClick = (job: any) => {
    setSelectedJobForPanel(job);
    setIsPanelOpen(true);
  };

  const handleViewApplication = (application: any) => {
    if (!currentUser) return;
    
    // Get detailed application data from localStorage
    const applicationDetail = LocalStorageAuth.getApplicationDetail(currentUser.id, application.id);
    
    if (applicationDetail) {
      setSelectedApplication(applicationDetail);
      setShowViewApplicationModal(true);
    } else {
      toast.error("Unable to load application details");
    }
  };

  const handleSaveJob = (jobId: string, jobTitle: string) => {
    if (!isLoggedIn || !currentUser) {
      toast.error("Please sign in to save jobs");
      return;
    }

    const wasSaved = savedJobs?.has(jobId);
    const success = onSaveJobAttempt(jobId);
    
    if (success) {
      if (wasSaved) {
        toast.success("Job removed from saved jobs");
      } else {
        toast.success(`"${jobTitle}" saved successfully`, {
          description: "View your saved jobs in the Saved tab"
        });
      }
    }
  };

  const handleToggleAlert = (alertId: string) => {
    if (!currentUser) return;

    // 🔄 PLACEHOLDER - Toggle alert status in LocalStorage
    // In production: This would be an API call to PATCH /api/job-alerts/:id/toggle
    const success = LocalStorageAuth.toggleJobAlert(currentUser.id, alertId);
    
    if (success) {
      // Refresh alerts from localStorage to get updated status
      const updatedAlerts = LocalStorageAuth.getUserJobAlerts(currentUser.id);
      setJobAlerts(updatedAlerts);
      
      // Find the alert to show appropriate toast
      const toggledAlert = updatedAlerts.find(alert => alert.id === alertId);
      if (toggledAlert) {
        toast.success(
          toggledAlert.active 
            ? `"${toggledAlert.name}" alert activated` 
            : `"${toggledAlert.name}" alert paused`,
          {
            description: toggledAlert.active 
              ? "You'll receive notifications when new jobs match your criteria"
              : "You won't receive notifications until you reactivate this alert"
          }
        );
      }
    } else {
      toast.error("Failed to update alert status");
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'applications':
        const filteredApplications = getFilteredApplications();
        
        if (filteredApplications.length === 0) {
          return (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {applications.length === 0 ? 'No Applications Yet' : 'No Results Found'}
                </h3>
                <p className="text-sm text-neutral-600 text-center mb-6 max-w-md">
                  {applications.length === 0 
                    ? "You haven't applied to any jobs yet. Start exploring opportunities and apply to your dream AIT position."
                    : "No applications match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {applications.length === 0 && (
                  <Button 
                    onClick={() => onNavigate('jobs')}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        }
        
        return (
          <div className="space-y-4 scrollbar-light">
            {filteredApplications.map((application) => {
              const statusBadge = getStatusBadge(application.status);
              const StatusIcon = statusBadge.icon;
              
              return (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-neutral-900 mb-1">
                          {application.position}
                        </h3>
                        <div className="flex items-center text-neutral-600 text-sm mb-2">
                          <Building className="h-4 w-4 mr-1" />
                          {application.company}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm text-neutral-500 space-y-1 md:space-y-0">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {application.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {application.salary}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied {formatDate(application.appliedDate)}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${statusBadge.color} flex items-center gap-1 self-start md:self-auto`}>
                        <StatusIcon className="h-3 w-3" />
                        {application.statusText}
                      </Badge>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewJobClick(application)}
                        className="w-full md:w-auto"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewApplication(application)}
                        className="w-full md:w-auto"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Application
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      case 'saved':
        const filteredSavedJobs = getFilteredSavedJobs();
        
        if (filteredSavedJobs.length === 0) {
          return (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {savedJobsData.length === 0 ? 'No Saved Jobs' : 'No Results Found'}
                </h3>
                <p className="text-sm text-neutral-600 text-center mb-6 max-w-md">
                  {savedJobsData.length === 0
                    ? "You haven't saved any jobs yet. Save jobs you're interested in to review them later and apply when you're ready."
                    : "No saved jobs match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {savedJobsData.length === 0 && (
                  <Button 
                    onClick={() => onNavigate('jobs')}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Explore Jobs
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        }
        
        return (
          <div className="space-y-4 scrollbar-light">
            {filteredSavedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-3 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-neutral-900">
                          {job.position}
                        </h3>
                        {job.newActivity && (
                          <Badge variant="secondary" className="bg-brand-secondary/10 text-brand-secondary text-xs self-start">
                            New Activity
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-neutral-600 text-sm mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm text-neutral-500 space-y-1 md:space-y-0">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {job.matchPercentage}% match
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        {job.matchPercentage}% match
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewJobClick(job)}
                      className="w-full md:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                    {appliedJobs?.has(job.id) ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full md:w-auto cursor-default font-medium px-6"
                        style={{
                          backgroundColor: '#f8fafc',
                          borderColor: '#cbd5e1',
                          color: '#64748b'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('dashboard');
                        }}
                      >
                        Applied
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full md:w-auto"
                        onClick={() => handleApplyNowClick(job)}
                      >
                        Apply Now
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full md:w-auto"
                      onClick={() => handleSaveJob(job.id, job.position)}
                    >
                      <Heart className="h-4 w-4 mr-2 fill-current text-red-500" />
                      Saved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'recommendations':
        const filteredRecommendations = getFilteredRecommendations();
        
        if (filteredRecommendations.length === 0) {
          return (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {recommendations.length === 0 ? 'No Recommendations Available' : 'No Results Found'}
                </h3>
                <p className="text-sm text-neutral-600 text-center mb-6 max-w-md">
                  {recommendations.length === 0
                    ? "Complete your profile to get personalized job recommendations based on your skills, experience, and preferences."
                    : "No recommendations match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {recommendations.length === 0 && (
                  <Button 
                    onClick={() => onNavigate('profile-completion')}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        }
        
        return (
          <div className="space-y-4 scrollbar-light">
            {filteredRecommendations.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow border-brand-primary/20">
                <CardContent className="md:p-6 pt-[20px] pr-[16px] pb-[24px] pl-[20px]">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-3 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-neutral-900">
                          {job.position}
                        </h3>
                        <Badge className="bg-brand-primary/10 text-brand-primary self-start">
                          Recommended
                        </Badge>
                      </div>
                      <div className="flex items-center text-neutral-600 text-sm mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm text-neutral-500 mb-3 space-y-1 md:space-y-0">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {job.matchPercentage}% match
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 italic">
                        {job.reason}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-200 self-start md:self-auto">
                      {job.matchPercentage}% match
                    </Badge>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    {appliedJobs?.has(job.id) ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full md:w-auto cursor-default font-medium px-6"
                        style={{
                          backgroundColor: '#f8fafc',
                          borderColor: '#cbd5e1',
                          color: '#64748b'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('dashboard');
                        }}
                      >
                        Applied
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full md:w-auto"
                        onClick={() => handleApplyNowClick(job)}
                      >
                        Apply Now
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full md:w-auto"
                      onClick={() => handleSaveJob(job.id, job.position)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${savedJobs?.has(job.id) ? 'fill-current text-red-500' : ''}`} />
                      {savedJobs?.has(job.id) ? 'Saved' : 'Save Job'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewJobClick(job)}
                      className="w-full md:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-4 scrollbar-light">
            <Card className="bg-brand-primary/5 border-brand-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Create New Job Alert</h3>
                    <p className="text-sm text-neutral-600">Get notified when new jobs match your criteria</p>
                  </div>
                </div>
                <Button 
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white"
                  onClick={handleCreateAlert}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </CardContent>
            </Card>

            {jobAlerts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    No Active Alerts
                  </h3>
                  <p className="text-sm text-neutral-600 text-center mb-6 max-w-md">
                    Stay ahead of the competition. Create job alerts to get notified immediately when new AIT positions matching your criteria are posted.
                  </p>
                  <Button 
                    onClick={handleCreateAlert}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Create Your First Alert
                  </Button>
                </CardContent>
              </Card>
            ) : (
              jobAlerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-neutral-900">
                          {alert.name}
                        </h3>
                        <Badge 
                          variant={alert.active ? "default" : "secondary"}
                          className={alert.active ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"}
                        >
                          {alert.active ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{alert.criteria}</p>
                      <div className="flex flex-col items-start gap-2 text-sm text-neutral-500">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-1" />
                          {alert.frequency}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Created {formatDate(alert.created)}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {alert.matchCount} new matches
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditAlert(alert)}
                    >
                      Edit Alert
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewMatches(alert)}
                    >
                      View Matches
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={alert.active ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"}
                      onClick={() => handleToggleAlert(alert.id)}
                    >
                      {alert.active ? "Pause" : "Activate"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 scrollbar-light">
      <Header 
        onNavigate={onNavigate} 
        onLogout={onLogout || (() => {})} 
        currentPage="job-activity" 
        currentUser={currentUser}
        userProfile={userProfile}
      />
      
      <div className="py-8 md:py-16 px-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className="text-neutral-600 hover:text-neutral-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-2">
              Job Activity
            </h1>
            <p className="text-neutral-600 text-sm md:text-base">
              Manage your applications, saved jobs, recommendations, and alerts
            </p>
          </div>

          {/* Custom Enhanced Tabs */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-neutral-200 p-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`
                    relative flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-3 md:py-4 rounded-lg transition-all duration-300 group
                    ${activeTab === 'applications' 
                      ? 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 transform scale-[1.02]' 
                      : 'text-neutral-600 hover:text-brand-primary hover:bg-brand-primary/5'
                    }
                  `}
                >
                  <Briefcase className={`h-4 w-4 transition-transform duration-200 ${activeTab === 'applications' ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="font-medium text-xs md:text-sm">Applications</span>
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className={`
                    relative flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-3 md:py-4 rounded-lg transition-all duration-300 group
                    ${activeTab === 'saved' 
                      ? 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 transform scale-[1.02]' 
                      : 'text-neutral-600 hover:text-brand-primary hover:bg-brand-primary/5'
                    }
                  `}
                >
                  <Heart className={`h-4 w-4 transition-transform duration-200 ${activeTab === 'saved' ? 'scale-110 fill-current' : 'group-hover:scale-105'}`} />
                  <span className="font-medium text-xs md:text-sm">Saved</span>
                </button>

                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`
                    relative flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-3 md:py-4 rounded-lg transition-all duration-300 group
                    ${activeTab === 'recommendations' 
                      ? 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 transform scale-[1.02]' 
                      : 'text-neutral-600 hover:text-brand-primary hover:bg-brand-primary/5'
                    }
                  `}
                >
                  <TrendingUp className={`h-4 w-4 transition-transform duration-200 ${activeTab === 'recommendations' ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="font-medium text-xs md:text-sm">Recommended</span>
                </button>

                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`
                    relative flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-3 md:py-4 rounded-lg transition-all duration-300 group
                    ${activeTab === 'alerts' 
                      ? 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 transform scale-[1.02]' 
                      : 'text-neutral-600 hover:text-brand-primary hover:bg-brand-primary/5'
                    }
                  `}
                >
                  <Bell className={`h-4 w-4 transition-transform duration-200 ${activeTab === 'alerts' ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="font-medium text-xs md:text-sm">Alerts</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            {activeTab !== 'alerts' && (
              <Card className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:gap-4">
                  <div className="w-full md:flex-1 md:min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        placeholder="Search jobs or companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-auto md:min-w-48">
                    <Input
                      placeholder="Filter by location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                  {activeTab === 'applications' && (
                    <div className="w-full md:w-auto md:min-w-48">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="applied">Application Sent</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="interview">Interview Scheduled</SelectItem>
                          <SelectItem value="rejected">Position Filled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="w-full md:w-auto md:min-w-48">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="company">Company A-Z</SelectItem>
                        <SelectItem value="position">Position A-Z</SelectItem>
                        {activeTab !== 'applications' && (
                          <SelectItem value="match">Best Match</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}

            {/* Content */}
            <div className="space-y-6 scrollbar-light">
              {getTabContent()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Apply Now Modal */}
      {selectedJob && (
        <ApplyNowModal
          job={selectedJob}
          isOpen={showApplyModal}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedJob(null);
          }}
          userProfile={userProfile}
          currentUser={currentUser}
          onApplicationSubmit={onJobApplicationSubmit}
        />
      )}

      {/* Job Details Panel */}
      {selectedJobForPanel && (
        <JobDetailsPanel
          job={selectedJobForPanel}
          isOpen={isPanelOpen}
          isLoading={isLoading}
          onClose={handlePanelClose}
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          pendingJobApplication={pendingJobApplication}
          onJobApplicationAttempt={onJobApplicationAttempt}
          onClearPendingApplication={onClearPendingApplication}
          appliedJobs={appliedJobs}
          onJobApplicationSubmit={onJobApplicationSubmit}
          savedJobs={savedJobs}
          onSaveJobAttempt={onSaveJobAttempt}
        />
      )}
      
      {/* Create Alert Modal */}
      <CreateAlertModal
        isOpen={showCreateAlertModal}
        onClose={() => {
          setShowCreateAlertModal(false);
          setEditingAlert(null);
        }}
        onCreateAlert={handleCreateAlertSubmit}
        editingAlert={editingAlert}
      />

      {/* View Application Modal */}
      <ViewApplicationModal
        isOpen={showViewApplicationModal}
        onClose={() => {
          setShowViewApplicationModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
      />

      <Footer onNavigate={onNavigate} />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}