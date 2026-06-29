import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { LocalStorageAuth } from "../utils/localStorage";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Upload, 
  CheckCircle, 
  Building,
  MapPin,
  Calendar,
  GraduationCap,
  Target,
  AlertCircle
} from "lucide-react";
import logoFull from 'figma:asset/28624db62fac154e722120f8f8afb7f175668f82.png';

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  education: string;
  educationLevel?: string; // Extended field from ProfileCompletionPage (takes priority)
  currentPosition: string;
  yearsExperience: string;
  hasLicense: boolean;
  licenseNumber: string;
  availableStartDate: string;
  salaryExpectation: string;
  relocateWilling: string;
  referralSource: string;
}

interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLogin?: string;
}

interface ApplyNowModalProps {
  job: JobData;
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  currentUser?: CurrentUser;
  isApplied?: boolean;
  onApplicationSubmit?: (jobId: string) => void;
}

/**
 * ApplyNowModal Component
 * 
 * A multi-step application modal that intelligently pre-fills form fields:
 * - Personal info (firstName, lastName, email, phone, address, city, state, zipCode) 
 *   is pre-filled from userProfile or currentUser (as fallback)
 * - Professional info is pre-filled from userProfile:
 *   - education: Uses educationLevel (from ProfileCompletion) with fallback to education
 *   - currentPosition, yearsExperience, license info
 * - Application specifics (availableStartDate, salaryExpectation, relocateWilling, referralSource)
 *   is pre-filled from userProfile
 * - Documents (resumeFile) is pre-filled from userProfile if available
 * - Other fields (coverLetter, motivation, questions, agreements) require manual input
 * 
 * Empty fields are left for manual completion by the user.
 */
export function ApplyNowModal({ job, isOpen, onClose, userProfile, currentUser, isApplied = false, onApplicationSubmit }: ApplyNowModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Scroll to top when step changes
  useEffect(() => {
    const modalContent = document.querySelector('.apply-modal-content');
    if (modalContent) {
      modalContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);
  
  // Initialize form data with user profile if available, with currentUser as fallback
  const [formData, setFormData] = useState({
    // Personal Information - prefilled from profile or currentUser
    firstName: userProfile?.firstName || currentUser?.firstName || '',
    lastName: userProfile?.lastName || currentUser?.lastName || '',
    email: userProfile?.email || currentUser?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
    zipCode: userProfile?.zipCode || '',
    
    // Professional Information - prefilled from profile
    // Priority: educationLevel (from ProfileCompletion) > education (basic field)
    education: userProfile?.educationLevel || userProfile?.education || '',
    currentPosition: userProfile?.currentPosition || '',
    yearsExperience: userProfile?.yearsExperience || '',
    licenseNumber: userProfile?.licenseNumber || '',
    hasLicense: userProfile?.hasLicense || false,
    
    // Application Specifics - some prefilled from profile
    availableStartDate: userProfile?.availableStartDate || '',
    salaryExpectation: userProfile?.salaryExpectation || '',
    relocateWilling: userProfile?.relocateWilling || '',
    referralSource: userProfile?.referralSource || '',
    
    // Documents - auto-attach resume from profile
    resumeFile: userProfile?.resumeFile || null,
    coverLetterFile: null as File | null,
    
    // Additional Information
    motivation: '',
    questions: '',
    
    // Agreements
    agreeTerms: false,
    agreeBackground: false,
    subscribeUpdates: false
  });

  // Update form data when userProfile or currentUser changes (e.g., when loaded from localStorage)
  useEffect(() => {
    if (userProfile || currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: userProfile?.firstName || currentUser?.firstName || prev.firstName,
        lastName: userProfile?.lastName || currentUser?.lastName || prev.lastName,
        email: userProfile?.email || currentUser?.email || prev.email,
        phone: userProfile?.phone || prev.phone,
        address: userProfile?.address || prev.address,
        city: userProfile?.city || prev.city,
        state: userProfile?.state || prev.state,
        zipCode: userProfile?.zipCode || prev.zipCode,
        // Priority: educationLevel (from ProfileCompletion) > education (basic field)
        education: userProfile?.educationLevel || userProfile?.education || prev.education,
        currentPosition: userProfile?.currentPosition || prev.currentPosition,
        yearsExperience: userProfile?.yearsExperience || prev.yearsExperience,
        licenseNumber: userProfile?.licenseNumber || prev.licenseNumber,
        hasLicense: userProfile?.hasLicense || prev.hasLicense,
        availableStartDate: userProfile?.availableStartDate || prev.availableStartDate,
        salaryExpectation: userProfile?.salaryExpectation || prev.salaryExpectation,
        relocateWilling: userProfile?.relocateWilling || prev.relocateWilling,
        referralSource: userProfile?.referralSource || prev.referralSource,
        resumeFile: userProfile?.resumeFile || prev.resumeFile,
      }));
    }
  }, [userProfile, currentUser]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // 🔄 PLACEHOLDER - Save detailed application data to localStorage
      // In production: This would be an API call to POST /api/job-applications
      if (currentUser) {
        try {
          // Extract only file metadata (not the actual file data) to avoid localStorage quota
          const resumeMetadata = formData.resumeFile ? {
            name: formData.resumeFile.name || 'resume.pdf',
            size: formData.resumeFile.size || 0,
            type: formData.resumeFile.type || 'application/pdf'
            // Note: In production, file would be uploaded to server/S3, not stored in localStorage
          } : undefined;

          LocalStorageAuth.addJobApplication(currentUser.id, job.id, {
            jobTitle: job.title,
            companyName: job.company,
            formData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              education: formData.education,
              currentPosition: formData.currentPosition,
              yearsExperience: formData.yearsExperience,
              licenseNumber: formData.licenseNumber,
              hasLicense: formData.hasLicense,
              availableStartDate: formData.availableStartDate,
              salaryExpectation: formData.salaryExpectation,
              relocateWilling: formData.relocateWilling,
              referralSource: formData.referralSource,
              coverLetter: formData.coverLetter,
              motivation: formData.motivation,
              questions: formData.questions,
              resumeFile: resumeMetadata
            }
          });
        } catch (error) {
          console.warn('⚠️ Failed to save application details (localStorage quota exceeded):', error);
          // Still allow the application to succeed even if we can't save details
        }
      }
      
      // Call the callback to update the parent component's state
      if (onApplicationSubmit) {
        onApplicationSubmit(job.id);
      }
      
      // Close the modal immediately after submission
      onClose();
    }, 2000);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.education && formData.availableStartDate;
      case 3:
        return formData.resumeFile && formData.agreeTerms && formData.agreeBackground;
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  if (applicationSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-brand-secondary" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Application Submitted!
          </h2>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            Thank you for your interest in the <strong>{job.title}</strong> position at {job.company}. 
            We've received your application and will review it within 2-3 business days.
          </p>
          
          <div className="bg-brand-primary/5 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-brand-primary mb-2">What's Next?</h3>
            <ul className="text-sm text-neutral-700 space-y-1">
              <li>• You'll receive a confirmation email within 24 hours</li>
              <li>• Initial screening call within 2-3 business days</li>
              <li>• Interview scheduling if you're a good fit</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={onClose}
              className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white"
            >
              Continue Browsing Jobs
            </Button>
            <Button 
              variant="outline"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              View Application Status
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-neutral-900">Apply for Position</h2>
            <p className="text-sm text-neutral-600">{job.title} at {job.company}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>



        {/* Progress Indicator */}
        <div className="px-6 py-6 bg-neutral-50 border-b border-neutral-200">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start justify-between relative">
              {[
                { number: 1, label: "Personal Information" },
                { number: 2, label: "Professional Background" },
                { number: 3, label: "Documents & Review" }
              ].map((step, index) => (
                <div key={step.number} className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mb-3 border-2 ${
                    currentStep >= step.number 
                      ? 'border-brand-primary bg-brand-primary text-white' 
                      : 'border-neutral-300 bg-white text-neutral-500'
                  }`}>
                    {step.number}
                  </div>
                  <p className={`text-xs text-center font-medium max-w-24 leading-tight ${
                    currentStep === step.number 
                      ? 'text-brand-primary' 
                      : 'text-neutral-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
              ))}
              
              {/* Connecting lines behind the steps */}
              <div className="absolute top-5 left-0 right-0 flex items-center justify-between z-0">
                <div className={`h-0.5 ${
                  currentStep > 1 ? 'bg-brand-primary' : 'bg-neutral-300'
                }`} style={{ width: 'calc(50% - 20px)', marginLeft: '20px' }} />
                <div className={`h-0.5 ${
                  currentStep > 2 ? 'bg-brand-primary' : 'bg-neutral-300'
                }`} style={{ width: 'calc(50% - 20px)', marginRight: '20px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-light apply-modal-content">
          <div className="p-6 pb-24">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Pre-filled Profile Banner */}
                {(userProfile || currentUser) && (
                  <div className="bg-brand-secondary/10 border border-brand-secondary/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                      <p className="text-sm text-brand-primary font-medium">
                        Pre-filled from your profile
                      </p>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 ml-5">
                      Your saved information has been automatically filled in the form below. Any empty fields can be completed manually.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <User className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-lg font-semibold text-neutral-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-neutral-700 mb-2 block">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="border-neutral-300"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="border-neutral-300"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-neutral-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border-neutral-300"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-neutral-700 mb-2 block">
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="border-neutral-300"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-neutral-700 mb-2 block">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="border-neutral-300"
                      placeholder="Austin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-neutral-700 mb-2 block">
                      State
                    </Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="border-neutral-300">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-medium text-neutral-700 mb-2 block">
                      ZIP Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="border-neutral-300"
                      placeholder="78704"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Background */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-lg font-semibold text-neutral-900">Professional Background</h3>
                  {userProfile && (
                    <div className="bg-brand-secondary/10 px-2 py-1 rounded text-xs text-brand-primary">
                      From Profile
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="education" className="text-sm font-medium text-neutral-700 mb-2 block">
                    Highest Education Level *
                  </Label>
                  {/* Options must match ProfileCompletionPage educationLevel values for pre-fill to work */}
                  <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                    <SelectTrigger className="border-neutral-300">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School Diploma/GED</SelectItem>
                      <SelectItem value="associates">Associate's Degree</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentPosition" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Current/Most Recent Position
                    </Label>
                    <Input
                      id="currentPosition"
                      value={formData.currentPosition}
                      onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                      className="border-neutral-300"
                      placeholder="Healthcare Coordinator"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearsExperience" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Years of Healthcare Experience
                    </Label>
                    <Select value={formData.yearsExperience} onValueChange={(value) => handleInputChange('yearsExperience', value)}>
                      <SelectTrigger className="border-neutral-300">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasLicense"
                      checked={formData.hasLicense}
                      onCheckedChange={(checked) => handleInputChange('hasLicense', checked)}
                    />
                    <Label htmlFor="hasLicense" className="text-sm text-neutral-700">
                      I currently hold a healthcare administration license
                    </Label>
                  </div>
                  
                  {formData.hasLicense && (
                    <div>
                      <Label htmlFor="licenseNumber" className="text-sm font-medium text-neutral-700 mb-2 block">
                        License Number
                      </Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className="border-neutral-300"
                        placeholder="Enter license number"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="availableStartDate" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Available Start Date *
                    </Label>
                    <Input
                      id="availableStartDate"
                      type="date"
                      value={formData.availableStartDate}
                      onChange={(e) => handleInputChange('availableStartDate', e.target.value)}
                      className="border-neutral-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryExpectation" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Salary Expectation
                    </Label>
                    <Input
                      id="salaryExpectation"
                      value={formData.salaryExpectation}
                      onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
                      className="border-neutral-300"
                      placeholder="$50,000 - $60,000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="relocateWilling" className="text-sm font-medium text-neutral-700 mb-2 block">
                    Willingness to Relocate
                  </Label>
                  <Select value={formData.relocateWilling} onValueChange={(value) => handleInputChange('relocateWilling', value)}>
                    <SelectTrigger className="border-neutral-300">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, willing to relocate</SelectItem>
                      <SelectItem value="no">No, prefer local positions</SelectItem>
                      <SelectItem value="maybe">Open to discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="referralSource" className="text-sm font-medium text-neutral-700 mb-2 block">
                    How did you hear about this position?
                  </Label>
                  <Select value={formData.referralSource} onValueChange={(value) => handleInputChange('referralSource', value)}>
                    <SelectTrigger className="border-neutral-300">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="findmyait">FindMyAIT Platform</SelectItem>
                      <SelectItem value="company-website">Company Website</SelectItem>
                      <SelectItem value="referral">Employee Referral</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="indeed">Indeed</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Documents & Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-lg font-semibold text-neutral-900">Documents & Final Review</h3>
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-neutral-700 mb-2 block">
                      Resume/CV * 
                      <span className="text-xs text-neutral-500 ml-2">(PDF, DOC, DOCX - Max 5MB)</span>
                    </Label>
                    
                    {formData.resumeFile ? (
                      <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-brand-primary" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                {formData.resumeFile.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {userProfile?.resumeFile ? 'From your profile' : 'Uploaded file'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileUpload('resumeFile', null)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('resume-upload')?.click()}
                            >
                              Replace
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="resume-upload" className="cursor-pointer block">
                        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                          <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                          <p className="text-sm text-neutral-600 mb-2">
                            Click to upload your resume
                          </p>
                          <p className="text-xs text-neutral-500">
                            PDF, DOC, DOCX up to 5MB
                          </p>
                        </div>
                      </label>
                    )}
                    
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload('resumeFile', e.target.files?.[0] || null)}
                      className="hidden"
                      id="resume-upload"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-neutral-700 mb-2 block">
                      Cover Letter (Optional)
                      <span className="text-xs text-neutral-500 ml-2">(PDF, DOC, DOCX - Max 5MB)</span>
                    </Label>
                    
                    {formData.coverLetterFile ? (
                      <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-brand-primary" />
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                {formData.coverLetterFile.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                Uploaded file
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileUpload('coverLetterFile', null)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('cover-letter-upload')?.click()}
                            >
                              Replace
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="cover-letter-upload" className="cursor-pointer block">
                        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                          <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                          <p className="text-sm text-neutral-600 mb-2">
                            Click to upload your cover letter
                          </p>
                          <p className="text-xs text-neutral-500">
                            PDF, DOC, DOCX up to 5MB
                          </p>
                        </div>
                      </label>
                    )}
                    
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload('coverLetterFile', e.target.files?.[0] || null)}
                      className="hidden"
                      id="cover-letter-upload"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="motivation" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Why are you interested in this AIT position? (Optional)
                    </Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      className="border-neutral-300 resize-none"
                      rows={3}
                      placeholder="Share what motivates you to pursue a career in healthcare administration..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="questions" className="text-sm font-medium text-neutral-700 mb-2 block">
                      Questions or Additional Information (Optional)
                    </Label>
                    <Textarea
                      id="questions"
                      value={formData.questions}
                      onChange={(e) => handleInputChange('questions', e.target.value)}
                      className="border-neutral-300 resize-none"
                      rows={3}
                      placeholder="Any questions about the position or additional information you'd like to share..."
                    />
                  </div>
                </div>

                <Separator />

                {/* Agreements */}
                <div className="space-y-4">
                  <h4 className="font-medium text-neutral-900">Required Agreements</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeTerms" className="text-sm text-neutral-700 leading-relaxed">
                        I agree to the Terms of Service and Privacy Policy. I understand that my application 
                        will be shared with the hiring company.
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeBackground"
                        checked={formData.agreeBackground}
                        onCheckedChange={(checked) => handleInputChange('agreeBackground', checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeBackground" className="text-sm text-neutral-700 leading-relaxed">
                        I authorize background checks and verification of the information provided in this application.
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="subscribeUpdates"
                        checked={formData.subscribeUpdates}
                        onCheckedChange={(checked) => handleInputChange('subscribeUpdates', checked)}
                        className="mt-1"
                      />
                      <Label htmlFor="subscribeUpdates" className="text-sm text-neutral-700 leading-relaxed">
                        Keep me updated on similar job opportunities and FindMyAIT news. (Optional)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Application Summary */}
                <div className="bg-brand-primary/5 rounded-lg p-4">
                  <h4 className="font-medium text-brand-primary mb-3">Application Summary</h4>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <div className="flex justify-between">
                      <span>Position:</span>
                      <span className="font-medium">{job.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Company:</span>
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applicant:</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-200 bg-neutral-50 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                onClose();
              }
            }}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="flex gap-3">
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className="bg-brand-primary hover:bg-brand-primary-hover text-white"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSubmitting || isApplied}
                className={isApplied 
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" 
                  : "bg-brand-secondary hover:bg-brand-secondary-hover text-white"
                }
              >
                {isApplied ? 'Applied' : (isSubmitting ? 'Submitting...' : 'Submit Application')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}