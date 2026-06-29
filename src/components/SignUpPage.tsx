import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User, MapPin, Upload, FileText, Check, AlertCircle, Camera, ArrowRight, ChevronLeft, UserPlus, X, Loader2 } from "lucide-react";
import aitLogo from 'figma:asset/bbd761c92a4e06f7ed0913518297cce9dea25034.png';
import { LocalStorageAuth } from "../utils/localStorage";
import { toast } from "sonner@2.0.3";

interface SignUpPageProps {
  onNavigate?: (page: string) => void;
  onSignupSuccess?: (user: any) => void;
}

// US States for dropdown
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export function SignUpPage({ onNavigate, onSignupSuccess }: SignUpPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: '',
    desiredStates: [] as string[],
    profilePhoto: null as File | null,
    resume: null as File | null,
    submitForReview: false,
    agreeToTerms: false,
    agreeToPrivacy: false,
    emailCommunications: true
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState({
    photo: '',
    resume: ''
  });
  const [uploadProgress, setUploadProgress] = useState({
    photo: 0,
    resume: 0
  });
  const [isUploading, setIsUploading] = useState({
    photo: false,
    resume: false
  });

  const totalSteps = 4;

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        return;
      }
      if (!isValidEmail(formData.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      // 🔄 PLACEHOLDER EMAIL CHECK - Check if email already exists
      // In production: This would be an API call to /api/auth/check-email
      if (LocalStorageAuth.checkEmailExists(formData.email)) {
        setEmailError('An account with this email already exists. Please sign in instead.');
        toast.error('An account with this email already exists');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      if (passwordStrength < 50) {
        setPasswordError('Please choose a stronger password');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.city || !formData.state || formData.desiredStates.length === 0) {
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of form when moving to next step
      setTimeout(() => {
        const container = document.getElementById('signup-container');
        const formElement = document.getElementById('signup-form');
        if (container && formElement) {
          const containerRect = container.getBoundingClientRect();
          const formRect = formElement.getBoundingClientRect();
          const yOffset = -60; // Offset to show some space above the form
          const scrollPosition = container.scrollTop + (formRect.top - containerRect.top) + yOffset;
          container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        } else if (container) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of form when moving to previous step
      setTimeout(() => {
        const container = document.getElementById('signup-container');
        const formElement = document.getElementById('signup-form');
        if (container && formElement) {
          const containerRect = container.getBoundingClientRect();
          const formRect = formElement.getBoundingClientRect();
          const yOffset = -60; // Offset to show some space above the form
          const scrollPosition = container.scrollTop + (formRect.top - containerRect.top) + yOffset;
          container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        } else if (container) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 🔄 PLACEHOLDER REGISTRATION - Using LocalStorage instead of real backend
      // In production: This would be an API call to /api/auth/register
      
      // Simulate network delay to show loading animation (remove in production)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = LocalStorageAuth.registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      if (result.success && result.user) {
        // 🔄 ENHANCED PROFILE STORAGE - Save complete signup profile data to localStorage
        // In production: This would be saved to database via API
        const profileData: any = {
          userId: result.user.id,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          availableStates: formData.desiredStates, // Store desired states for AIT opportunities
          updatedAt: new Date().toISOString()
        };

        // Helper function to convert file to base64 and save profile
        const saveProfileWithFiles = async () => {
          // Store profile photo data if uploaded
          if (formData.profilePhoto) {
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
                data: photoBase64, // Base64 data for localStorage
                uploadedAt: new Date().toISOString()
              };
            } catch (error) {
              console.error('Error processing profile photo:', error);
            }
          }

          // Store resume/CV data if uploaded
          if (formData.resume) {
            try {
              const resumeBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(formData.resume!);
              });

              profileData.resumeFile = {
                name: formData.resume.name,
                size: formData.resume.size,
                type: formData.resume.type,
                data: resumeBase64, // Base64 data for localStorage
                uploadedAt: new Date().toISOString()
              };
            } catch (error) {
              console.error('Error processing resume file:', error);
            }
          }

          // Save all profile data to localStorage
          LocalStorageAuth.updateUserProfile(result.user.id, profileData);
        };

        // Execute async file processing
        await saveProfileWithFiles();

        // Clear guest quiz attempt if they were previously blocked
        // This gives them a fresh start with unlimited access
        LocalStorageAuth.clearGuestQuizAttempt();
        console.log('✅ Guest quiz restrictions cleared for new user');

        // Enhanced success message with file storage info
        let successMessage = 'Account created successfully! Welcome to FindMyAIT.';
        if (formData.profilePhoto || formData.resume) {
          const fileCount = (formData.profilePhoto ? 1 : 0) + (formData.resume ? 1 : 0);
          successMessage += ` Your profile${fileCount > 1 ? ' and files' : fileCount === 1 ? ' and file' : ''} have been saved.`;
        }
        toast.success(successMessage);
        
        // Call success callback if provided
        onSignupSuccess?.(result.user);
        
        // Small delay to let user see the success message before redirect
        setTimeout(() => {
          // Navigate to login with signup success indicator and email
          onNavigate?.(`login?signup=success&email=${encodeURIComponent(formData.email)}`);
        }, 1200);
      } else {
        toast.error(result.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user types
    if (field === 'email') setEmailError('');
    if (field === 'password' || field === 'confirmPassword') setPasswordError('');
    
    // Update password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const simulateUploadProgress = async (field: 'profilePhoto' | 'resume', file: File) => {
    const fieldKey = field === 'profilePhoto' ? 'photo' : 'resume';
    
    // Set uploading state
    setIsUploading(prev => ({ ...prev, [fieldKey]: true }));
    setUploadProgress(prev => ({ ...prev, [fieldKey]: 0 }));

    // Simulate realistic upload progress
    const fileSize = file.size;
    const uploadDuration = Math.min(Math.max(fileSize / (1024 * 1024) * 500, 800), 3000); // 500ms per MB, min 800ms, max 3s
    const steps = 20;
    const stepDuration = uploadDuration / steps;

    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      const progress = Math.min((i / steps) * 100, 100);
      setUploadProgress(prev => ({ ...prev, [fieldKey]: progress }));
    }

    // Complete upload
    setIsUploading(prev => ({ ...prev, [fieldKey]: false }));
  };

  const handleFileUpload = async (field: 'profilePhoto' | 'resume', file: File | null) => {
    const fieldKey = field === 'profilePhoto' ? 'photo' : 'resume';
    
    // Clear previous errors
    setUploadErrors(prev => ({
      ...prev,
      [fieldKey]: ''
    }));

    if (!file) {
      setFormData(prev => ({
        ...prev,
        [field]: null
      }));
      if (field === 'profilePhoto') {
        setPhotoPreview(null);
      }
      // Reset upload states
      setIsUploading(prev => ({ ...prev, [fieldKey]: false }));
      setUploadProgress(prev => ({ ...prev, [fieldKey]: 0 }));
      return;
    }

    // File validation
    const maxSize = field === 'profilePhoto' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for photos, 10MB for resumes
    const allowedTypes = field === 'profilePhoto' 
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      setUploadErrors(prev => ({
        ...prev,
        [fieldKey]: `File size must be less than ${maxSizeMB}MB`
      }));
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const typeError = field === 'profilePhoto' 
        ? 'Please upload a JPG or PNG image'
        : 'Please upload a PDF or Word document';
      setUploadErrors(prev => ({
        ...prev,
        [fieldKey]: typeError
      }));
      return;
    }

    // Start upload simulation
    await simulateUploadProgress(field, file);

    // Set the file after upload completes
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));

    // Create preview for profile photo
    if (field === 'profilePhoto' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileRemove = (field: 'profilePhoto' | 'resume') => {
    const fieldKey = field === 'profilePhoto' ? 'photo' : 'resume';
    
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
    
    if (field === 'profilePhoto') {
      setPhotoPreview(null);
    }
    
    // Clear any errors and reset upload states
    setUploadErrors(prev => ({
      ...prev,
      [fieldKey]: ''
    }));
    setIsUploading(prev => ({ ...prev, [fieldKey]: false }));
    setUploadProgress(prev => ({ ...prev, [fieldKey]: 0 }));
  };

  const handleStateSelection = (state: string) => {
    if (state === 'any-state') {
      setFormData(prev => ({
        ...prev,
        desiredStates: US_STATES
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        desiredStates: prev.desiredStates.includes(state)
          ? prev.desiredStates.filter(s => s !== state)
          : [...prev.desiredStates, state]
      }));
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'rgba(0, 229, 204, 0.4)'; // 40% opacity
    if (passwordStrength < 50) return 'rgba(0, 229, 204, 0.6)'; // 60% opacity
    if (passwordStrength < 75) return 'rgba(0, 229, 204, 0.8)'; // 80% opacity
    return 'var(--brand-secondary)'; // Full opacity
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Create Your Account';
      case 2: return 'Location & Preferences';
      case 3: return 'Profile Enhancement';
      case 4: return 'Review & Complete';
      default: return 'Sign Up';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Enter your contact information to get started';
      case 2: return 'Tell us where you are and where you\'d like to work';
      case 3: return 'Add your photo and resume (optional)';
      case 4: return 'Review your information and finish registration';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-neutral-700">First Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="pl-10 h-12 border-neutral-200 rounded-lg force-light-theme"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-neutral-700">Last Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="pl-10 h-12 border-neutral-200 rounded-lg force-light-theme"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm text-neutral-700">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 h-12 border-neutral-200 rounded-lg force-light-theme"
                  placeholder="Enter your email address"
                  required
                />
                {emailError && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {emailError}
                  </div>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm text-neutral-700">Phone Number (Optional)</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="h-12 border-neutral-200 rounded-lg force-light-theme"
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-neutral-500">
                We'll use this to contact you about opportunities
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm text-neutral-700">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 h-12 border-neutral-200 rounded-lg force-light-theme"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-2">
                  {/* Custom Password Strength Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-600 font-medium">Password strength:</span>
                    <div className="flex gap-1 flex-1">
                      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= 25 ? 'bg-brand-secondary/40' : 'bg-neutral-200'
                      }`} />
                      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= 50 ? 'bg-brand-secondary/60' : 'bg-neutral-200'
                      }`} />
                      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= 75 ? 'bg-brand-secondary/80' : 'bg-neutral-200'
                      }`} />
                      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= 100 ? 'bg-brand-secondary' : 'bg-neutral-200'
                      }`} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Include 8+ characters, uppercase, lowercase, and numbers/symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm text-neutral-700">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 h-12 border-neutral-200 rounded-lg force-light-theme"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordError && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {passwordError}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Current Location */}
            <div className="space-y-4">
              <h3 className="text-lg text-neutral-800">Current Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-neutral-700">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="pl-10 h-12 border-neutral-200 rounded-lg force-light-theme"
                      placeholder="e.g., Denver"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-neutral-700">State *</label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger className="border-neutral-200 rounded-lg force-light-theme" style={{ height: '48px', minHeight: '48px' }}>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent className="scrollbar-light">
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* AIT Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg text-neutral-800">AIT Opportunities</h3>
              <div className="space-y-2">
                <label className="block text-sm text-neutral-700">
                  States you'd consider for AIT positions *
                </label>
                <p className="text-xs text-neutral-500 mb-2">
                  Select all states where you'd be willing to work
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-3 border border-neutral-200 rounded-lg bg-white scrollbar-light">
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.desiredStates.length === US_STATES.length}
                      onCheckedChange={() => handleStateSelection('any-state')}
                      className="force-light-theme"
                    />
                    <span className="text-sm font-medium text-brand-primary">Any state</span>
                  </label>
                  {US_STATES.map((state) => (
                    <label key={state} className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.desiredStates.includes(state)}
                        onCheckedChange={() => handleStateSelection(state)}
                        className="force-light-theme"
                      />
                      <span className="text-sm text-neutral-700">{state}</span>
                    </label>
                  ))}
                </div>
                {formData.desiredStates.length > 0 && (
                  <p className="text-xs text-green-600">
                    {formData.desiredStates.length} state{formData.desiredStates.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="space-y-3">
              <h3 className="text-lg text-neutral-800">Professional Profile</h3>
              <div className="space-y-2">
                <label className="block text-sm text-neutral-700">Profile Photo (Optional)</label>
                
                {!formData.profilePhoto && !photoPreview && !isUploading.photo && (
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                    <Camera className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600 mb-2">Add your professional photo</p>
                    <p className="text-xs text-neutral-500 mb-3">Helps employers recognize you • JPG/PNG, max 5MB</p>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => handleFileUpload('profilePhoto', e.target.files?.[0] || null)}
                      className="hidden"
                      id="profile-photo"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('profile-photo')?.click()}
                    >
                      Choose Photo
                    </Button>
                  </div>
                )}

                {isUploading.photo && (
                  <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                        <Upload className="h-6 w-6 text-blue-600 animate-pulse" />
                      </div>
                      <p className="text-sm text-blue-900 mb-2 font-medium">Uploading photo...</p>
                      <div className="w-full max-w-xs mx-auto">
                        <Progress 
                          value={uploadProgress.photo} 
                          className="h-2 mb-2" 
                        />
                        <p className="text-xs text-blue-700">{Math.round(uploadProgress.photo)}% complete</p>
                      </div>
                    </div>
                  </div>
                )}

                {photoPreview && (
                  <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img 
                          src={photoPreview} 
                          alt="Profile preview" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileRemove('profilePhoto')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center text-sm text-green-600 mb-1">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="font-medium">Photo uploaded successfully</span>
                        </div>
                        <p className="text-xs text-neutral-600 truncate">{formData.profilePhoto?.name}</p>
                        <p className="text-xs text-neutral-500">
                          {formData.profilePhoto && `${(formData.profilePhoto.size / 1024 / 1024).toFixed(1)} MB`}
                        </p>
                        <div className="mt-2">
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) => handleFileUpload('profilePhoto', e.target.files?.[0] || null)}
                            className="hidden"
                            id="profile-photo-replace"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('profile-photo-replace')?.click()}
                            disabled={isUploading.photo}
                          >
                            {isUploading.photo ? 'Uploading...' : 'Replace Photo'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {uploadErrors.photo && (
                  <div className="flex items-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {uploadErrors.photo}
                  </div>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-4">
              <label className="block text-sm text-neutral-700">Resume (Optional)</label>
              {!isUploading.resume && !formData.resume && (
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                  <FileText className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 mb-2">Upload your resume</p>
                  <p className="text-xs text-neutral-500 mb-3">PDF or DOC format preferred</p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('resume', e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              )}

              {isUploading.resume && (
                <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                      <Upload className="h-6 w-6 text-green-600 animate-pulse" />
                    </div>
                    <p className="text-sm text-green-900 mb-2 font-medium">Uploading resume...</p>
                    <div className="w-full max-w-xs mx-auto">
                      <Progress 
                        value={uploadProgress.resume} 
                        className="h-2 mb-2" 
                      />
                      <p className="text-xs text-green-700">{Math.round(uploadProgress.resume)}% complete</p>
                    </div>
                  </div>
                </div>
              )}


              {formData.resume && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="bg-green-100 rounded-lg p-2">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center text-sm text-green-600 mb-1">
                          <Check className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="font-medium">Resume uploaded successfully</span>
                        </div>
                        <p className="text-sm text-neutral-800 truncate">{formData.resume.name}</p>
                        <p className="text-xs text-neutral-500">
                          {(formData.resume.size / 1024 / 1024).toFixed(1)} MB • {formData.resume.type === 'application/pdf' ? 'PDF' : 'Word Document'}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload('resume', e.target.files?.[0] || null)}
                            className="hidden"
                            id="resume-replace"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('resume-replace')?.click()}
                            disabled={isUploading.resume}
                          >
                            {isUploading.resume ? 'Uploading...' : 'Replace'}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleFileRemove('resume')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isUploading.resume}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Resume Review - Only show when resume is uploaded */}
              {formData.resume && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Professional Resume Review
                      </span>
                    </div>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <Checkbox
                        checked={formData.submitForReview}
                        onCheckedChange={(checked) => handleInputChange('submitForReview', checked)}
                        className="force-light-theme mt-0.5"
                      />
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-900">
                          Submit for expert review (Optional)
                        </span>
                        <p className="text-xs text-blue-700">
                          Get professional feedback from healthcare industry experts on your resume. 
                          Reviews typically completed within 3-5 business days to help optimize your profile for AIT opportunities.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {uploadErrors.resume && (
                <div className="flex items-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {uploadErrors.resume}
                </div>
              )}
            </div>

            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600">
                You can always add or update these files later in your profile
              </p>
            </div>


          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Review Information */}
            <div className="space-y-4">
              <h3 className="text-lg text-neutral-800">Review Your Information</h3>
              
              <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm text-neutral-500">Name:</span>
                  <p className="text-neutral-800">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">Email:</span>
                  <p className="text-neutral-800">{formData.email}</p>
                </div>
                {formData.phone && (
                  <div>
                    <span className="text-sm text-neutral-500">Phone:</span>
                    <p className="text-neutral-800">{formData.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-neutral-500">Location:</span>
                  <p className="text-neutral-800">{formData.city}, {formData.state}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">Interested in:</span>
                  <p className="text-neutral-800">
                    {formData.desiredStates.length === US_STATES.length 
                      ? 'Any state' 
                      : `${formData.desiredStates.length} selected states`}
                  </p>
                </div>
                {formData.profilePhoto && (
                  <div>
                    <span className="text-sm text-neutral-500">Profile Photo:</span>
                    <p className="text-neutral-800 text-sm">✓ Uploaded</p>
                  </div>
                )}
                {formData.resume && (
                  <div>
                    <span className="text-sm text-neutral-500">Resume:</span>
                    <p className="text-neutral-800 text-sm">
                      ✓ Uploaded
                      {formData.submitForReview && (
                        <span className="ml-2 text-blue-600 font-medium">
                          • Professional review requested
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Terms & Privacy */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="space-y-3">
                <label className="flex items-start space-x-2">
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                    className="mt-0.5 force-light-theme"
                    required
                  />
                  <span className="text-sm text-neutral-700">
                    I agree to the <a href="#" className="text-brand-primary hover:underline">Terms of Service</a> *
                  </span>
                </label>

                <label className="flex items-start space-x-2">
                  <Checkbox
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) => handleInputChange('agreeToPrivacy', checked)}
                    className="mt-0.5 force-light-theme"
                    required
                  />
                  <span className="text-sm text-neutral-700">
                    I agree to the <a href="#" className="text-brand-primary hover:underline">Privacy Policy</a> *
                  </span>
                </label>

                <label className="flex items-start space-x-2">
                  <Checkbox
                    checked={formData.emailCommunications}
                    onCheckedChange={(checked) => handleInputChange('emailCommunications', checked)}
                    className="mt-0.5 force-light-theme"
                  />
                  <span className="text-sm text-neutral-700">
                    Send me job alerts, daily quiz reminders, and AIT updates
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="signup-container" className="fixed inset-0 bg-gradient-to-br from-brand-primary to-blue-900 overflow-y-auto">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--brand-secondary) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, var(--brand-secondary) 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative z-10 min-h-full flex items-center justify-center p-6">
        <div className="w-full max-w-2xl my-8">
        {/* Logo - Matching Login Page Style */}
        <div className="flex justify-center mb-6">
          <img 
            src={aitLogo} 
            alt="FindMyAIT" 
            className="h-8 w-auto opacity-90"
          />
        </div>

        <Card id="signup-form" className="border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl" 
              style={{ backgroundColor: '#f5f6f9' }}>
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <Badge variant="outline" className="border-brand-primary/20 text-brand-primary bg-brand-primary/10 backdrop-blur-sm text-xs">
                <UserPlus className="w-3 h-3 mr-1" />
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            <CardTitle className="text-2xl text-neutral-800 mb-2">
              {getStepTitle()}
            </CardTitle>
            {currentStep === 1 && (
              <CardDescription className="text-base">
                <span className="text-neutral-600">Join 500+ aspiring administrators preparing for AIT success</span>
                <br />
                <span className="text-sm text-neutral-500 mt-1 block">
                  Get access to verified AIT opportunities, daily NAB practice, and state-by-state guidance
                </span>
              </CardDescription>
            )}
            {currentStep > 1 && (
              <CardDescription className="text-neutral-600">
                {getStepDescription()}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-8 pt-0">
            {/* Progress Bar */}
            <div className="mb-8">
              <Progress 
                value={(currentStep / totalSteps) * 100} 
                className="h-2 mb-2"
                style={{ backgroundColor: '#e2e8f0' }}
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Account Info</span>
                <span>Location</span>
                <span>Profile</span>
                <span>Complete</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1 h-12"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 h-12 text-white"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.agreeToTerms || !formData.agreeToPrivacy}
                    className="flex-1 h-12 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                )}
              </div>

              {/* Sign In Link */}
              {currentStep === 1 && (
                <div className="text-center pt-[10px] pr-[0px] pb-[0px] pl-[0px]">
                  <button
                    type="button"
                    onClick={() => onNavigate?.('login')}
                    className="text-brand-primary hover:underline"
                  >
                    Already have an account? Sign In Instead
                  </button>
                </div>
              )}

              {/* Social Sign Up - Only on first step */}
              {currentStep === 1 && (
                <div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 text-neutral-500" style={{ backgroundColor: '#f5f6f9' }}>Or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-neutral-300 text-neutral-700 hover:bg-neutral-50 mt-4"
                  >
                    Sign up with Google
                  </Button>
                  
                  <p className="text-xs text-center text-neutral-500 mt-2">
                    We'll still need the information above to match you with opportunities
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate?.('home')}
            className="inline-flex items-center text-white/80 hover:text-white transition-colors text-[15px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}