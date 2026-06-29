import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Building
} from "lucide-react";
import { JobApplicationDetail } from "../utils/localStorage";

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplicationDetail | null;
}

export function ViewApplicationModal({ isOpen, onClose, application }: ViewApplicationModalProps) {
  if (!application) return null;

  const { formData, jobTitle, companyName, appliedDate, status, statusText } = application;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'interview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
              <DialogTitle className="text-lg sm:text-xl mb-1.5 sm:mb-2 pr-2 break-words text-center sm:text-left w-full">{jobTitle}</DialogTitle>
              <DialogDescription className="sr-only">
                View your application details for {jobTitle} at {companyName}
              </DialogDescription>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-600 mb-1 sm:mb-0 w-full">
                <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{companyName}</span>
              </div>
              <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1 sm:mt-3 w-full">
                <div className="flex items-center gap-1 text-xs sm:text-sm text-neutral-500">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Applied {formatDate(appliedDate)}</span>
                </div>
                <Badge className={`${getStatusColor(status)} text-xs sm:text-sm w-fit`}>
                  {statusText || 'Application Submitted'}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6 scrollbar-light">
          <div className="space-y-6 pb-6">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-base text-neutral-900">
                <User className="h-5 w-5 text-brand-primary" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="text-xs text-neutral-500">Full Name</label>
                  <p className="text-sm text-neutral-900">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">Email</label>
                  <p className="text-sm text-neutral-900">{formData.email}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">Phone</label>
                  <p className="text-sm text-neutral-900">{formData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">Location</label>
                  <p className="text-sm text-neutral-900">
                    {formData.city && formData.state 
                      ? `${formData.city}, ${formData.state}` 
                      : formData.address || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Professional Information */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-base text-neutral-900">
                <Briefcase className="h-5 w-5 text-brand-primary" />
                Professional Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="text-xs text-neutral-500">Education Level</label>
                  <p className="text-sm text-neutral-900">
                    {formData.education 
                      ? formData.education
                          .replace('high-school', 'High School Diploma/GED')
                          .replace('associates', "Associate's Degree")
                          .replace('bachelors', "Bachelor's Degree")
                          .replace('masters', "Master's Degree")
                          .replace('doctorate', 'Doctorate/PhD')
                      : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">Current Position</label>
                  <p className="text-sm text-neutral-900">{formData.currentPosition || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">Years of Experience</label>
                  <p className="text-sm text-neutral-900">{formData.yearsExperience || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">License Information</label>
                  <p className="text-sm text-neutral-900">
                    {formData.hasLicense 
                      ? `Yes - ${formData.licenseNumber || 'No number provided'}` 
                      : 'No license'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Application Details */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-base text-neutral-900">
                <FileText className="h-5 w-5 text-brand-primary" />
                Application Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="text-xs text-neutral-500">Available Start Date</label>
                  <p className="text-sm text-neutral-900">{formData.availableStartDate || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">Salary Expectation</label>
                  <p className="text-sm text-neutral-900">{formData.salaryExpectation || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">Willing to Relocate</label>
                  <p className="text-sm text-neutral-900">
                    {formData.relocateWilling
                      ? formData.relocateWilling.charAt(0).toUpperCase() + formData.relocateWilling.slice(1)
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-500">How did you hear about us?</label>
                  <p className="text-sm text-neutral-900">{formData.referralSource || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            {formData.coverLetter && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-base text-neutral-900">
                    <FileText className="h-5 w-5 text-brand-primary" />
                    Cover Letter
                  </h3>
                  <div className="pl-7 bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">{formData.coverLetter}</p>
                  </div>
                </div>
              </>
            )}

            {/* Motivation */}
            {formData.motivation && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-base text-neutral-900">
                    <CheckCircle className="h-5 w-5 text-brand-primary" />
                    Why This Position
                  </h3>
                  <div className="pl-7 bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">{formData.motivation}</p>
                  </div>
                </div>
              </>
            )}

            {/* Questions */}
            {formData.questions && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-base text-neutral-900">
                    <FileText className="h-5 w-5 text-brand-primary" />
                    Additional Questions/Comments
                  </h3>
                  <div className="pl-7 bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-900 whitespace-pre-wrap">{formData.questions}</p>
                  </div>
                </div>
              </>
            )}

            {/* Resume */}
            {formData.resumeFile && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-base text-neutral-900">
                    <FileText className="h-5 w-5 text-brand-primary" />
                    Resume
                  </h3>
                  <div className="pl-7">
                    <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                      <FileText className="h-5 w-5 text-neutral-400" />
                      <div className="flex-1">
                        <p className="text-sm text-neutral-900">{formData.resumeFile.name}</p>
                        <p className="text-xs text-neutral-500">
                          {(formData.resumeFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}