import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import findMyAITLogo from 'figma:asset/28624db62fac154e722120f8f8afb7f175668f82.png';
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { CustomRadio } from "./CustomRadio";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LocalStorageAuth } from "../utils/localStorage";
import { toast } from "sonner@2.0.3";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Save,
  Eye,
  Target,
  Users,
  MapPin,
  Briefcase,
  Award,
  Heart,
  Calendar,
  Upload,
  Camera,
  X,
  FileText
} from "lucide-react";

interface ProfileCompletionPageProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void; // Added logout handler prop
  // ⚠️ PLACEHOLDER - Current user from LocalStorage auth
  currentUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    lastLogin?: string;
  };
}

interface FormData {
  // Section 1: Leadership Development
  leadershipGrowth: string;
  leadershipLesson: string;
  ltcMotivation: string;
  
  // Section 2: Flexibility & Fit
  city: string;
  state: string;
  relocateForAIT: string;
  relocateForWork: string;
  availableStates: string[];
  earliestStart: { month: string; year: string };
  
  // Section 3: Professional Background
  profilePhoto: File | null;
  profilePhotoPreview: string | null;
  resumeFile: File | null;
  employmentStatus: string;
  yearsExperience: string;
  educationLevel: string;
  degreeField: string;
  university: string;
  graduationDate: string;
  gpa: string;
  additionalEducation: string;
  certifications: string[];
  otherCertification: string;
  
  // Section 4: Soft Signals
  leadershipStyle: string;
  learningApproach: string;
  nonHealthcareSkill: string;
  
  // Section 5: Additional Info
  profileChanges: string;
  expectedChanges: string;
  virtualInterviews: boolean;
  additionalInfo: string;
}

export function ProfileCompletionPage({ onNavigate, onLogout, currentUser }: ProfileCompletionPageProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    // Section 1: Leadership Development
    leadershipGrowth: '',
    leadershipLesson: '',
    ltcMotivation: '',
    
    // Section 2: Flexibility & Fit
    city: '',
    state: '',
    relocateForAIT: '',
    relocateForWork: '',
    availableStates: [],
    earliestStart: { month: '', year: '' },
    
    // Section 3: Professional Background
    profilePhoto: null,
    profilePhotoPreview: null,
    resumeFile: null,
    employmentStatus: '',
    yearsExperience: '',
    educationLevel: '',
    degreeField: '',
    university: '',
    graduationDate: '',
    gpa: '',
    additionalEducation: '',
    certifications: [],
    otherCertification: '',
    
    // Section 4: Soft Signals
    leadershipStyle: '',
    learningApproach: '',
    nonHealthcareSkill: '',
    
    // Section 5: Additional Info
    profileChanges: '',
    expectedChanges: '',
    virtualInterviews: false,
    additionalInfo: ''
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Auto-save functionality - PLACEHOLDER using LocalStorage
  // ⚠️ In production: This would auto-save to backend API
  useEffect(() => {
    const autoSave = () => {
      if (currentUser?.id) {
        // Use our centralized localStorage system
        LocalStorageAuth.saveProfileProgress(currentUser.id, formData, currentStep);
        setLastSaved(new Date());
      } else {
        // Fallback to temporary storage if no user
        localStorage.setItem('profileFormData', JSON.stringify(formData));
        localStorage.setItem('profileCurrentStep', currentStep.toString());
        setLastSaved(new Date());
      }
    };

    const timer = setTimeout(autoSave, 3000); // Auto-save after 3 seconds of inactivity
    return () => clearTimeout(timer);
  }, [formData, currentStep, currentUser]);

  // Load saved data on mount - PLACEHOLDER using LocalStorage
  // ⚠️ In production: This would load from backend API
  useEffect(() => {
    if (currentUser?.id) {
      // Try to load from our centralized localStorage system
      const savedProgress = LocalStorageAuth.loadProfileProgress(currentUser.id);
      
      if (savedProgress) {
        // Merge saved data with default state to ensure all properties exist
        setFormData(prev => ({
          ...prev,
          ...savedProgress.formData
        }));
        
        if (savedProgress.currentStep >= 1 && savedProgress.currentStep <= totalSteps) {
          setCurrentStep(savedProgress.currentStep);
        }
      } else {
        // If no saved progress, try to load existing profile data
        const existingProfile = LocalStorageAuth.getUserProfile(currentUser.id);
        if (existingProfile) {
          // Load profile photo preview if it exists
          if (existingProfile.profilePhoto?.data) {
            updateFormData('profilePhotoPreview', existingProfile.profilePhoto.data);
          }
          
          setFormData(prev => ({
            ...prev,
            ...existingProfile,
            // Don't overwrite File objects with localStorage data
            profilePhoto: prev.profilePhoto,
            resumeFile: prev.resumeFile
          }));
        }
      }
    } else {
      // Fallback to temporary storage if no user
      const savedData = localStorage.getItem('profileFormData');
      const savedStepData = localStorage.getItem('profileCurrentStep');
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(prev => ({
            ...prev,
            ...parsedData
          }));
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
      
      if (savedStepData) {
        const step = parseInt(savedStepData, 10);
        if (step >= 1 && step <= totalSteps) {
          setCurrentStep(step);
        }
      }
    }
  }, [currentUser]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="h-5 w-5 text-brand-secondary" />;
    if (step === currentStep) return <div className="h-5 w-5 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm">{step}</div>;
    return <div className="h-5 w-5 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 text-sm">{step}</div>;
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'upcoming';
  };

  const nextStep = () => {
    if (currentStep < totalSteps && validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top when moving to next step
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Scroll to top when moving to previous step
      window.scrollTo(0, 0);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.leadershipGrowth.length >= 50 && 
               formData.leadershipLesson.length >= 50 && 
               formData.ltcMotivation.length >= 50;
      case 2:
        return formData.city &&
               formData.state &&
               formData.relocateForAIT && 
               formData.relocateForWork && 
               formData.availableStates.length > 0 && 
               formData.earliestStart.month && 
               formData.earliestStart.year;
      case 3:
        // Basic fields required for everyone
        const basicValid = formData.employmentStatus && 
                          formData.yearsExperience && 
                          formData.educationLevel;
        
        // Additional validation for college degree holders
        if (formData.educationLevel && !['high-school'].includes(formData.educationLevel)) {
          return basicValid && 
                 formData.degreeField && 
                 formData.university;
        }
        
        return basicValid;
      case 4:
        return formData.leadershipStyle && 
               formData.learningApproach && 
               formData.nonHealthcareSkill.length >= 30;
      case 5:
        return formData.profileChanges && 
               formData.expectedChanges;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
                <Target className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl text-neutral-900 mb-2">Tell Us About Your Leadership Journey</h2>
              <p className="text-neutral-600">Help employers understand your growth mindset and leadership potential</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="leadership-growth">What are you currently doing to grow as a future leader? *</Label>
                <Textarea
                  id="leadership-growth"
                  placeholder="Examples: Reading books, attending webinars, completing certifications, volunteering in elder care settings, etc."
                  value={formData.leadershipGrowth}
                  onChange={(e) => updateFormData('leadershipGrowth', e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Share specific examples of your professional development</span>
                  <span>{formData.leadershipGrowth.length}/500</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="leadership-lesson">What recent leadership lesson have you learned that's impacted your approach to teamwork? *</Label>
                <Textarea
                  id="leadership-lesson"
                  placeholder="Describe a specific lesson and how it changed your perspective..."
                  value={formData.leadershipLesson}
                  onChange={(e) => updateFormData('leadershipLesson', e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={400}
                />
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Be specific about the lesson and its impact</span>
                  <span>{formData.leadershipLesson.length}/400</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="ltc-motivation">What motivates you to lead in long-term care or aging services? *</Label>
                <Textarea
                  id="ltc-motivation"
                  placeholder="Share your personal connection to elder care and what drives your passion..."
                  value={formData.ltcMotivation}
                  onChange={(e) => updateFormData('ltcMotivation', e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={400}
                />
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Employers value genuine passion for elder care</span>
                  <span>{formData.ltcMotivation.length}/400</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl text-neutral-900 mb-2">Flexibility & Location Preferences</h2>
              <p className="text-neutral-600">Help us match you with opportunities that fit your lifestyle</p>
            </div>

            <div className="space-y-6">
              {/* Current Location */}
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-lg text-neutral-900">Current Location</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Chicago"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      className="border border-neutral-300 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => updateFormData('state', value)}>
                      <SelectTrigger id="state" className="border border-neutral-300 bg-white">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <Label>Are you open to relocating for an AIT opportunity? *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CustomRadio
                    value="yes-anywhere"
                    checked={formData.relocateForAIT === 'yes-anywhere'}
                    onChange={(value) => updateFormData('relocateForAIT', value)}
                    id="yes-anywhere"
                  >
                    Yes, anywhere in the US
                  </CustomRadio>
                  <CustomRadio
                    value="yes-limited"
                    checked={formData.relocateForAIT === 'yes-limited'}
                    onChange={(value) => updateFormData('relocateForAIT', value)}
                    id="yes-limited"
                  >
                    Yes, but only within specific states/regions
                  </CustomRadio>
                  <CustomRadio
                    value="no"
                    checked={formData.relocateForAIT === 'no'}
                    onChange={(value) => updateFormData('relocateForAIT', value)}
                    id="relocate-no"
                    className="md:col-span-2"
                  >
                    No, I prefer to stay in my current area
                  </CustomRadio>
                </div>
              </div>

              <div className="space-y-3">
                <Label>After completing AIT, would you be willing to work anywhere for the right opportunity? *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <CustomRadio
                    value="yes"
                    checked={formData.relocateForWork === 'yes'}
                    onChange={(value) => updateFormData('relocateForWork', value)}
                    id="work-yes"
                  >
                    Yes, I'm open to working anywhere
                  </CustomRadio>
                  <CustomRadio
                    value="regional"
                    checked={formData.relocateForWork === 'regional'}
                    onChange={(value) => updateFormData('relocateForWork', value)}
                    id="work-regional"
                  >
                    Yes, but within specific regions
                  </CustomRadio>
                  <CustomRadio
                    value="no"
                    checked={formData.relocateForWork === 'no'}
                    onChange={(value) => updateFormData('relocateForWork', value)}
                    id="work-no"
                  >
                    No, I prefer to stay local
                  </CustomRadio>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Which states are you available to work in? (Select all that apply) *</Label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto scrollbar-light p-4 border border-neutral-200 rounded-lg">
                  {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map((state) => (
                    <div key={state} className="flex items-center space-x-2">
                      <Checkbox
                        id={state}
                        checked={formData.availableStates.includes(state)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('availableStates', [...formData.availableStates, state]);
                          } else {
                            updateFormData('availableStates', formData.availableStates.filter(s => s !== state));
                          }
                        }}
                      />
                      <Label htmlFor={state} className="text-sm">{state}</Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-neutral-500">Selected: {formData.availableStates.length} states</p>
              </div>

              <div className="space-y-3">
                <Label>What's the earliest you could start an AIT program? *</Label>
                <div className="flex space-x-4">
                  <Select value={formData.earliestStart.month} onValueChange={(value) => updateFormData('earliestStart', { ...formData.earliestStart, month: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={formData.earliestStart.year} onValueChange={(value) => updateFormData('earliestStart', { ...formData.earliestStart, year: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {['2024', '2025', '2026'].map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
                <Briefcase className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl text-neutral-900 mb-2">Professional Background</h2>
              <p className="text-neutral-600">Tell us about your experience and education</p>
            </div>

            <div className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-lg text-neutral-900">Professional Profile Photo</h3>
                </div>
                <p className="text-sm text-neutral-600">Upload a professional headshot to help employers recognize you</p>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  {formData.profilePhotoPreview ? (
                    <div className="relative">
                      <img
                        src={formData.profilePhotoPreview}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-brand-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateFormData('profilePhoto', null);
                          updateFormData('profilePhotoPreview', null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-neutral-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="profile-photo"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('File size must be less than 5MB');
                            return;
                          }
                          updateFormData('profilePhoto', file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateFormData('profilePhotoPreview', reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('profile-photo')?.click()}
                      className="w-full md:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {formData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                    {formData.profilePhoto && (
                      <p className="text-sm text-neutral-600 mt-2">{formData.profilePhoto.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-brand-primary" />
                  <h3 className="text-lg text-neutral-900">Resume / CV</h3>
                </div>
                <p className="text-sm text-neutral-600">Upload your most recent resume to help employers understand your background</p>
                <div className="space-y-3">
                  {formData.resumeFile && (
                    <div className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-brand-primary" />
                        <div>
                          <p className="text-sm text-neutral-900">{formData.resumeFile.name}</p>
                          <p className="text-xs text-neutral-500">{(formData.resumeFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateFormData('resumeFile', null)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    id="resume-file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error('File size must be less than 10MB');
                          return;
                        }
                        updateFormData('resumeFile', file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('resume-file')?.click()}
                    className="w-full md:w-auto"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.resumeFile ? 'Change Resume' : 'Upload Resume'}
                  </Button>
                  <p className="text-xs text-neutral-500">Accepted formats: PDF, DOC, DOCX (Max 10MB)</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <Label>Current employment status *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CustomRadio
                    value="employed-healthcare"
                    checked={formData.employmentStatus === 'employed-healthcare'}
                    onChange={(value) => updateFormData('employmentStatus', value)}
                    id="employed-healthcare"
                  >
                    Currently employed in healthcare
                  </CustomRadio>
                  <CustomRadio
                    value="employed-other"
                    checked={formData.employmentStatus === 'employed-other'}
                    onChange={(value) => updateFormData('employmentStatus', value)}
                    id="employed-other"
                  >
                    Currently employed outside healthcare
                  </CustomRadio>
                  <CustomRadio
                    value="unemployed"
                    checked={formData.employmentStatus === 'unemployed'}
                    onChange={(value) => updateFormData('employmentStatus', value)}
                    id="unemployed"
                  >
                    Currently unemployed/seeking opportunities
                  </CustomRadio>
                  <CustomRadio
                    value="student"
                    checked={formData.employmentStatus === 'student'}
                    onChange={(value) => updateFormData('employmentStatus', value)}
                    id="student"
                  >
                    Full-time student
                  </CustomRadio>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Years of healthcare experience *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <CustomRadio
                    value="0-1"
                    checked={formData.yearsExperience === '0-1'}
                    onChange={(value) => updateFormData('yearsExperience', value)}
                    id="exp-0-1"
                  >
                    0-1 years
                  </CustomRadio>
                  <CustomRadio
                    value="2-5"
                    checked={formData.yearsExperience === '2-5'}
                    onChange={(value) => updateFormData('yearsExperience', value)}
                    id="exp-2-5"
                  >
                    2-5 years
                  </CustomRadio>
                  <CustomRadio
                    value="6-10"
                    checked={formData.yearsExperience === '6-10'}
                    onChange={(value) => updateFormData('yearsExperience', value)}
                    id="exp-6-10"
                  >
                    6-10 years
                  </CustomRadio>
                  <CustomRadio
                    value="10+"
                    checked={formData.yearsExperience === '10+'}
                    onChange={(value) => updateFormData('yearsExperience', value)}
                    id="exp-10-plus"
                  >
                    10+ years
                  </CustomRadio>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Highest level of education completed *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CustomRadio
                    value="high-school"
                    checked={formData.educationLevel === 'high-school'}
                    onChange={(value) => updateFormData('educationLevel', value)}
                    id="high-school"
                  >
                    High School Diploma/GED
                  </CustomRadio>
                  <CustomRadio
                    value="associates"
                    checked={formData.educationLevel === 'associates'}
                    onChange={(value) => updateFormData('educationLevel', value)}
                    id="associates"
                  >
                    Associate's Degree
                  </CustomRadio>
                  <CustomRadio
                    value="bachelors"
                    checked={formData.educationLevel === 'bachelors'}
                    onChange={(value) => updateFormData('educationLevel', value)}
                    id="bachelors"
                  >
                    Bachelor's Degree
                  </CustomRadio>
                  <CustomRadio
                    value="masters"
                    checked={formData.educationLevel === 'masters'}
                    onChange={(value) => updateFormData('educationLevel', value)}
                    id="masters"
                  >
                    Master's Degree
                  </CustomRadio>
                  <CustomRadio
                    value="doctorate"
                    checked={formData.educationLevel === 'doctorate'}
                    onChange={(value) => updateFormData('educationLevel', value)}
                    id="doctorate"
                    className="md:col-span-2"
                  >
                    Doctorate/PhD
                  </CustomRadio>
                </div>
              </div>

              {/* Show degree-specific fields only if they have post-secondary education */}
              {formData.educationLevel && !['high-school'].includes(formData.educationLevel) && (
                <div className="space-y-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <h4 className="font-medium text-neutral-800 flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>Degree Details</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree-field">Field of Study *</Label>
                      <Select value={formData.degreeField} onValueChange={(value) => updateFormData('degreeField', value)}>
                        <SelectTrigger className="border border-neutral-300 bg-white">
                          <SelectValue placeholder="Select your field of study" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthcare-administration">Healthcare Administration</SelectItem>
                          <SelectItem value="business-administration">Business Administration</SelectItem>
                          <SelectItem value="nursing">Nursing</SelectItem>
                          <SelectItem value="public-health">Public Health</SelectItem>
                          <SelectItem value="social-work">Social Work</SelectItem>
                          <SelectItem value="psychology">Psychology</SelectItem>
                          <SelectItem value="gerontology">Gerontology</SelectItem>
                          <SelectItem value="health-sciences">Health Sciences</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="university">University/Institution *</Label>
                      <Input
                        id="university"
                        type="text"
                        placeholder="e.g., University of Michigan"
                        value={formData.university}
                        onChange={(e) => updateFormData('university', e.target.value)}
                        maxLength={100}
                        className="border border-neutral-300 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graduation-date">Graduation Date</Label>
                      <Input
                        id="graduation-date"
                        type="month"
                        value={formData.graduationDate}
                        onChange={(e) => updateFormData('graduationDate', e.target.value)}
                        className="border border-neutral-300 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gpa">GPA (Optional)</Label>
                      <Input
                        id="gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        placeholder="e.g., 3.75"
                        value={formData.gpa}
                        onChange={(e) => updateFormData('gpa', e.target.value)}
                        className="border border-neutral-300 bg-white"
                      />
                      <p className="text-xs text-neutral-500">On a 4.0 scale</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="additional-education">Additional education or training (optional)</Label>
                <Textarea
                  id="additional-education"
                  placeholder="Any additional certifications, courses, or specialized training..."
                  value={formData.additionalEducation}
                  onChange={(e) => updateFormData('additionalEducation', e.target.value)}
                  className="min-h-[80px] resize-none"
                  maxLength={300}
                />
                <div className="text-right text-sm text-neutral-500">
                  {formData.additionalEducation.length}/300
                </div>
              </div>

              <div className="space-y-3">
                <Label>Healthcare certifications (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['CNA', 'LPN/LVN', 'RN', 'CMA', 'HHA', 'STNA', 'Other'].map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={cert}
                        checked={formData.certifications.includes(cert)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('certifications', [...formData.certifications, cert]);
                          } else {
                            updateFormData('certifications', formData.certifications.filter(c => c !== cert));
                          }
                        }}
                      />
                      <Label htmlFor={cert}>{cert}</Label>
                    </div>
                  ))}
                </div>
                {formData.certifications.includes('Other') && (
                  <Input
                    placeholder="Please specify other certification"
                    value={formData.otherCertification}
                    onChange={(e) => updateFormData('otherCertification', e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl text-neutral-900 mb-2">Personality & Working Style</h2>
              <p className="text-neutral-600">Help employers understand how you work and learn best</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Which leadership style best describes your approach? *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CustomRadio
                    value="collaborative"
                    checked={formData.leadershipStyle === 'collaborative'}
                    onChange={(value) => updateFormData('leadershipStyle', value)}
                    id="collaborative"
                  >
                    Collaborative - I prefer building consensus and teamwork
                  </CustomRadio>
                  <CustomRadio
                    value="directive"
                    checked={formData.leadershipStyle === 'directive'}
                    onChange={(value) => updateFormData('leadershipStyle', value)}
                    id="directive"
                  >
                    Directive - I'm comfortable making decisions and providing clear guidance
                  </CustomRadio>
                  <CustomRadio
                    value="supportive"
                    checked={formData.leadershipStyle === 'supportive'}
                    onChange={(value) => updateFormData('leadershipStyle', value)}
                    id="supportive"
                  >
                    Supportive - I focus on empowering others and providing encouragement
                  </CustomRadio>
                  <CustomRadio
                    value="adaptive"
                    checked={formData.leadershipStyle === 'adaptive'}
                    onChange={(value) => updateFormData('leadershipStyle', value)}
                    id="adaptive"
                  >
                    Adaptive - I adjust my style based on the situation and team needs
                  </CustomRadio>
                </div>
              </div>

              <div className="space-y-3">
                <Label>How do you prefer to learn new skills and processes? *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CustomRadio
                    value="hands-on"
                    checked={formData.learningApproach === 'hands-on'}
                    onChange={(value) => updateFormData('learningApproach', value)}
                    id="hands-on"
                  >
                    Hands-on practice - I learn best by doing
                  </CustomRadio>
                  <CustomRadio
                    value="observation"
                    checked={formData.learningApproach === 'observation'}
                    onChange={(value) => updateFormData('learningApproach', value)}
                    id="observation"
                  >
                    Observation - I prefer watching others first, then practicing
                  </CustomRadio>
                  <CustomRadio
                    value="structured"
                    checked={formData.learningApproach === 'structured'}
                    onChange={(value) => updateFormData('learningApproach', value)}
                    id="structured"
                  >
                    Structured learning - I like formal training programs and manuals
                  </CustomRadio>
                  <CustomRadio
                    value="mentorship"
                    checked={formData.learningApproach === 'mentorship'}
                    onChange={(value) => updateFormData('learningApproach', value)}
                    id="mentorship"
                  >
                    Mentorship - I thrive with one-on-one guidance from experienced leaders
                  </CustomRadio>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="non-healthcare-skill">What's a skill you've developed outside of healthcare that would benefit a long-term care facility? *</Label>
                <Textarea
                  id="non-healthcare-skill"
                  placeholder="Examples: Project management, customer service, team coordination, problem-solving, technology skills, etc."
                  value={formData.nonHealthcareSkill}
                  onChange={(e) => updateFormData('nonHealthcareSkill', e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={350}
                />
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Think about transferable skills from any experience</span>
                  <span>{formData.nonHealthcareSkill.length}/350</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="text-2xl text-neutral-900 mb-2">Final Details</h2>
              <p className="text-neutral-600">Just a few more questions to complete your profile</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>How often would you like us to update your profile with new opportunities? *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CustomRadio
                    value="daily"
                    checked={formData.profileChanges === 'daily'}
                    onChange={(value) => updateFormData('profileChanges', value)}
                    id="daily"
                  >
                    Daily - I want to see new opportunities as soon as they're posted
                  </CustomRadio>
                  <CustomRadio
                    value="weekly"
                    checked={formData.profileChanges === 'weekly'}
                    onChange={(value) => updateFormData('profileChanges', value)}
                    id="weekly"
                  >
                    Weekly - A weekly summary of new opportunities works for me
                  </CustomRadio>
                  <CustomRadio
                    value="monthly"
                    checked={formData.profileChanges === 'monthly'}
                    onChange={(value) => updateFormData('profileChanges', value)}
                    id="monthly"
                  >
                    Monthly - I prefer less frequent updates
                  </CustomRadio>
                  <CustomRadio
                    value="as-needed"
                    checked={formData.profileChanges === 'as-needed'}
                    onChange={(value) => updateFormData('profileChanges', value)}
                    id="as-needed"
                  >
                    As needed - I'll check the platform when I'm actively looking
                  </CustomRadio>
                </div>
              </div>

              <div className="space-y-3">
                <Label>What changes do you expect in your availability over the next 12 months? *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CustomRadio
                    value="no-changes"
                    checked={formData.expectedChanges === 'no-changes'}
                    onChange={(value) => updateFormData('expectedChanges', value)}
                    id="no-changes"
                  >
                    No major changes expected
                  </CustomRadio>
                  <CustomRadio
                    value="more-available"
                    checked={formData.expectedChanges === 'more-available'}
                    onChange={(value) => updateFormData('expectedChanges', value)}
                    id="more-available"
                  >
                    I'll become more available (finishing school, current job ending, etc.)
                  </CustomRadio>
                  <CustomRadio
                    value="less-available"
                    checked={formData.expectedChanges === 'less-available'}
                    onChange={(value) => updateFormData('expectedChanges', value)}
                    id="less-available"
                  >
                    I may become less available (family commitments, other priorities)
                  </CustomRadio>
                  <CustomRadio
                    value="unsure"
                    checked={formData.expectedChanges === 'unsure'}
                    onChange={(value) => updateFormData('expectedChanges', value)}
                    id="unsure"
                  >
                    I'm not sure what changes to expect
                  </CustomRadio>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="virtual-interviews">Are you comfortable with virtual interviews?</Label>
                  <Switch
                    id="virtual-interviews"
                    checked={formData.virtualInterviews}
                    onCheckedChange={(checked) => updateFormData('virtualInterviews', checked)}
                  />
                </div>
                <p className="text-sm text-neutral-500">Many employers now conduct initial interviews virtually</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="additional-info">Anything else you'd like employers to know? (optional)</Label>
                <Textarea
                  id="additional-info"
                  placeholder="Share any additional information that might be relevant to your AIT candidacy..."
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={400}
                />
                <div className="text-right text-sm text-neutral-500">
                  {formData.additionalInfo.length}/400
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSaveAndContinueLater = async () => {
    // 🔄 PLACEHOLDER - Save current progress to LocalStorage
    // In production: This would be an API call to save progress
    setIsSaving(true);
    
    if (currentUser?.id) {
      // Prepare profile data with files
      const profileData: any = { ...formData };
      
      // Convert profile photo to base64 if present and is a File object
      if (formData.profilePhoto && formData.profilePhoto instanceof File) {
        try {
          const photoBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(formData.profilePhoto!);
          });
          
          profileData.profilePhoto = {
            name: formData.profilePhoto.name,
            size: formData.profilePhoto.size,
            type: formData.profilePhoto.type,
            data: photoBase64,
            uploadedAt: new Date().toISOString()
          };
        } catch (error) {
          console.error('Error processing profile photo:', error);
        }
      } else if (formData.profilePhoto) {
        // Already processed, keep as is
        profileData.profilePhoto = formData.profilePhoto;
      }
      
      // Convert resume to base64 if present and is a File object
      if (formData.resumeFile && formData.resumeFile instanceof File) {
        try {
          const resumeBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(formData.resumeFile!);
          });
          
          profileData.resumeFile = {
            name: formData.resumeFile.name,
            size: formData.resumeFile.size,
            type: formData.resumeFile.type,
            data: resumeBase64,
            uploadedAt: new Date().toISOString()
          };
        } catch (error) {
          console.error('Error processing resume file:', error);
        }
      } else if (formData.resumeFile) {
        // Already processed, keep as is
        profileData.resumeFile = formData.resumeFile;
      }
      
      const success = LocalStorageAuth.saveProfileProgress(currentUser.id, profileData, currentStep);
      
      if (success) {
        setLastSaved(new Date());
        toast.success('Progress saved successfully! You can continue anytime from your dashboard.');
        setTimeout(() => onNavigate('dashboard'), 1000); // Small delay to show the toast
      } else {
        toast.error('Failed to save progress. Please try again.');
      }
    } else {
      // Fallback: Save to temporary storage
      localStorage.setItem('profileFormData', JSON.stringify(formData));
      localStorage.setItem('profileCurrentStep', currentStep.toString());
      setLastSaved(new Date());
      toast.success('Progress saved! You can continue anytime.');
      setTimeout(() => onNavigate('dashboard'), 1000); // Small delay to show the toast
    }
    
    setIsSaving(false);
  };

  const handleSubmit = async () => {
    // 🔄 PLACEHOLDER - Save completed profile to LocalStorage
    // In production: This would be an API call to save completed profile
    if (currentUser?.id) {
      // Prepare profile data with files
      const profileData: any = { ...formData };
      
      // Convert profile photo to base64 if present and is a File object
      if (formData.profilePhoto && formData.profilePhoto instanceof File) {
        try {
          const photoBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(formData.profilePhoto!);
          });
          
          profileData.profilePhoto = {
            name: formData.profilePhoto.name,
            size: formData.profilePhoto.size,
            type: formData.profilePhoto.type,
            data: photoBase64,
            uploadedAt: new Date().toISOString()
          };
        } catch (error) {
          console.error('Error processing profile photo:', error);
          toast.error('Failed to save profile photo. Please try again.');
          return;
        }
      } else if (formData.profilePhoto) {
        // Already processed, keep as is
        profileData.profilePhoto = formData.profilePhoto;
      }
      
      // Convert resume to base64 if present and is a File object
      if (formData.resumeFile && formData.resumeFile instanceof File) {
        try {
          const resumeBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(formData.resumeFile!);
          });
          
          profileData.resumeFile = {
            name: formData.resumeFile.name,
            size: formData.resumeFile.size,
            type: formData.resumeFile.type,
            data: resumeBase64,
            uploadedAt: new Date().toISOString()
          };
        } catch (error) {
          console.error('Error processing resume file:', error);
          toast.error('Failed to save resume file. Please try again.');
          return;
        }
      } else if (formData.resumeFile) {
        // Already processed, keep as is
        profileData.resumeFile = formData.resumeFile;
      }
      
      const success = LocalStorageAuth.completeUserProfile(currentUser.id, profileData);
      
      if (success) {
        toast.success('Profile completed successfully! Your professional one-pager is now ready.');
        // Navigate to dashboard with success message
        onNavigate('dashboard');
      } else {
        toast.error('Failed to save profile. Please try again.');
      }
    } else {
      // Fallback: Clear temporary data and navigate
      localStorage.removeItem('profileFormData');
      localStorage.removeItem('profileCurrentStep');
      toast.success('Profile completed successfully!');
      onNavigate('dashboard');
    }
  };

  const renderPreviewModal = () => {
    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src={findMyAITLogo} 
                alt="FindMyAIT" 
                className="h-8 w-auto"
              />
            </div>
            <DialogTitle className="text-center text-2xl text-neutral-900">
              Professional Profile Preview
            </DialogTitle>
            <DialogDescription className="text-center text-neutral-600">
              Your one-page professional summary for AIT opportunities
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {/* Leadership Development */}
            <div className="space-y-3">
              <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                <Target className="h-5 w-5" />
                <span>Leadership Development</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-neutral-700">Current Leadership Growth:</p>
                  <p className="text-neutral-600">{formData.leadershipGrowth || 'Not provided'}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Recent Leadership Lesson:</p>
                  <p className="text-neutral-600">{formData.leadershipLesson || 'Not provided'}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Motivation for Long-term Care:</p>
                  <p className="text-neutral-600">{formData.ltcMotivation || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Professional Background */}
            <div className="space-y-3">
              <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                <Briefcase className="h-5 w-5" />
                <span>Professional Background</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-neutral-700">Employment Status:</p>
                  <p className="text-neutral-600">{formData.employmentStatus?.replace('-', ' ') || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Healthcare Experience:</p>
                  <p className="text-neutral-600">{formData.yearsExperience || 'Not specified'} years</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Education Level:</p>
                  <p className="text-neutral-600">{formData.educationLevel?.replace('-', ' ') || 'Not specified'}</p>
                </div>
                {formData.degreeField && (
                  <div>
                    <p className="font-medium text-neutral-700">Field of Study:</p>
                    <p className="text-neutral-600">{formData.degreeField.replace('-', ' ')}</p>
                  </div>
                )}
                {formData.university && (
                  <div>
                    <p className="font-medium text-neutral-700">University:</p>
                    <p className="text-neutral-600">{formData.university}</p>
                  </div>
                )}
                {formData.gpa && (
                  <div>
                    <p className="font-medium text-neutral-700">GPA:</p>
                    <p className="text-neutral-600">{formData.gpa}/4.0</p>
                  </div>
                )}
              </div>
              {formData.certifications.length > 0 && (
                <div>
                  <p className="font-medium text-neutral-700">Certifications:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cert === 'Other' ? formData.otherCertification : cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Availability & Preferences */}
            <div className="space-y-3">
              <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                <MapPin className="h-5 w-5" />
                <span>Availability & Preferences</span>
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <p className="font-medium text-neutral-700">Available Start Date:</p>
                  <p className="text-neutral-600">{formData.earliestStart.month} {formData.earliestStart.year}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Relocation for AIT:</p>
                  <p className="text-neutral-600">{formData.relocateForAIT?.replace('-', ' ') || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Available States:</p>
                  <p className="text-neutral-600">{formData.availableStates.length} states selected</p>
                </div>
              </div>
            </div>

            {/* Working Style */}
            <div className="space-y-3">
              <h3 className="flex items-center space-x-2 text-lg text-brand-primary border-b border-neutral-200 pb-2">
                <Users className="h-5 w-5" />
                <span>Working Style</span>
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <p className="font-medium text-neutral-700">Leadership Style:</p>
                  <p className="text-neutral-600">{formData.leadershipStyle || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-700">Learning Approach:</p>
                  <p className="text-neutral-600">{formData.learningApproach?.replace('-', ' ') || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-6 border-t border-neutral-200">
            <Button 
              onClick={() => setShowPreview(false)}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white"
            >
              Continue Editing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        onNavigate={onNavigate} 
        onLogout={onLogout || (() => {})} 
        currentPage="profile-completion" 
        currentUser={currentUser} 
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('dashboard')}
          className="mb-6 -ml-2 text-neutral-600 hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-neutral-900 mb-2">Complete Your Professional Profile</h1>
          <p className="text-neutral-600 mb-6">Help employers discover your unique qualifications and create your professional one-pager</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
            <div 
              className="bg-brand-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-neutral-500">Step {currentStep} of {totalSteps} • {Math.round(progressPercentage)}% Complete</p>
          
          {/* Auto-save indicator */}
          {lastSaved && (
            <div className="flex items-center justify-center space-x-2 mt-2 text-xs text-neutral-400">
              <Clock className="h-3 w-3" />
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* Step Progress Indicators */}
        <div className="flex justify-between items-center mb-8 px-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center">
              {getStepIcon(step)}
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium ${step === currentStep ? 'text-brand-primary' : step < currentStep ? 'text-brand-secondary' : 'text-neutral-400'}`}>
                  {step === 1 && 'Leadership'}
                  {step === 2 && 'Flexibility'}
                  {step === 3 && 'Experience'}
                  {step === 4 && 'Style'}
                  {step === 5 && 'Details'}
                </div>
                <div className={`text-xs ${step === currentStep ? 'text-brand-primary' : step < currentStep ? 'text-brand-secondary' : 'text-neutral-400'}`}>
                  {getStepStatus(step) === 'completed' && 'Complete'}
                  {getStepStatus(step) === 'active' && 'Current'}
                  {getStepStatus(step) === 'upcoming' && 'Upcoming'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {/* Form Card */}
          <Card className="border-neutral-200">
            <CardContent className="pt-8 force-radio-visibility">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 lg:gap-0">
            {/* Navigation buttons - Primary actions on mobile */}
            <div className="flex items-center gap-3 order-2 lg:order-1">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex-1 lg:flex-none flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateCurrentStep()}
                  className="flex-1 lg:flex-none flex items-center justify-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateCurrentStep()}
                  className="flex-1 lg:flex-none flex items-center justify-center space-x-2 bg-brand-secondary text-white hover:bg-brand-secondary-hover"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Profile</span>
                </Button>
              )}
            </div>

            {/* Secondary actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 lg:gap-4 order-1 lg:order-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Profile</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveAndContinueLater}
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center space-x-2"
              >
                <Save className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span>{isSaving ? 'Saving...' : 'Save & Continue Later'}</span>
              </Button>
            </div>
          </div>

        
        </div>
      </div>

      {/* Preview Modal */}
      {renderPreviewModal()}

      <Footer onNavigate={onNavigate} />
    </div>
  );
}