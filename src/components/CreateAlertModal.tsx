import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { X, Bell, MapPin, DollarSign, Briefcase } from "lucide-react";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAlert: (alertData: any) => void;
  editingAlert?: any; // Optional alert data for editing
}

// US States for dropdown
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

export function CreateAlertModal({ isOpen, onClose, onCreateAlert, editingAlert }: CreateAlertModalProps) {
  const [alertName, setAlertName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [frequency, setFrequency] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  // Determine if we're in edit mode
  const isEditMode = !!editingAlert;

  // Populate form fields when editing an alert
  useEffect(() => {
    if (editingAlert) {
      setAlertName(editingAlert.name || "");
      setKeywords(editingAlert.keywords || "");
      setState(editingAlert.state || "");
      setCity(editingAlert.city || "");
      setSalaryMin(editingAlert.salaryMin || "");
      setSalaryMax(editingAlert.salaryMax || "");
      setFrequency(editingAlert.frequency || "");
      setJobType(editingAlert.jobType || "");
      setExperienceLevel(editingAlert.experienceLevel || "");
    }
  }, [editingAlert]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build location string from city and state
    const location = [city, state].filter(Boolean).join(", ");
    
    // Create criteria string
    const criteriaArray = [];
    if (keywords) criteriaArray.push(keywords);
    if (location) criteriaArray.push(location);
    if (salaryMin && salaryMax) criteriaArray.push(`${salaryMin}k-${salaryMax}k`);
    else if (salaryMin) criteriaArray.push(`${salaryMin}k+`);
    if (jobType) criteriaArray.push(jobType);
    if (experienceLevel) criteriaArray.push(experienceLevel);

    const alertData = {
      id: isEditMode ? editingAlert.id : `alert_${Date.now()}`,
      name: alertName || (isEditMode ? editingAlert.name : "New Job Alert"),
      criteria: criteriaArray.join(", "),
      frequency: frequency || "Daily",
      created: isEditMode ? editingAlert.created : new Date().toISOString().split('T')[0],
      matchCount: isEditMode ? editingAlert.matchCount : 0,
      active: isEditMode ? editingAlert.active : true,
      keywords,
      location,
      state,
      city,
      salaryMin,
      salaryMax,
      jobType,
      experienceLevel
    };

    onCreateAlert(alertData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setAlertName("");
    setKeywords("");
    setState("");
    setCity("");
    setSalaryMin("");
    setSalaryMax("");
    setFrequency("");
    setJobType("");
    setExperienceLevel("");
    onClose();
  };

  const isFormValid = alertName.trim() && keywords.trim() && frequency;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-light">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit Job Alert" : "Create Job Alert"}
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-600 mt-1">
                {isEditMode 
                  ? "Update your job alert criteria and notification settings" 
                  : "Get notified when new jobs match your criteria"
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alert Name */}
          <div className="space-y-2">
            <Label htmlFor="alertName">Alert Name *</Label>
            <Input
              id="alertName"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              placeholder="e.g., Senior Administrator Positions"
              className="w-full"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Keywords *
              </div>
            </Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., Administrator in Training, AIT, Healthcare"
              className="w-full"
            />
            <p className="text-xs text-neutral-500">
              Separate multiple keywords with commas
            </p>
          </div>

          {/* Location - State & City */}
          <div className="space-y-2">
            <Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </div>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="state" className="text-xs text-neutral-600">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {US_STATES.map((stateName) => (
                      <SelectItem key={stateName} value={stateName}>
                        {stateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="city" className="text-xs text-neutral-600">City (Optional)</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Denver"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Salary Range (in thousands)
              </div>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="Min"
                type="number"
                className="flex-1"
              />
              <span className="text-neutral-500">to</span>
              <Input
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="Max"
                type="number"
                className="flex-1"
              />
            </div>
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="1-2 years">1-2 years</SelectItem>
                <SelectItem value="3-5 years">3-5 years</SelectItem>
                <SelectItem value="5+ years">5+ years</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notification Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Notification Frequency *</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="How often do you want to be notified?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Immediately">Immediately</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {(alertName || keywords || state || city) && (
            <div className="p-4 bg-neutral-50 rounded-lg border">
              <h4 className="font-medium text-neutral-900 mb-2">Alert Preview</h4>
              <div className="space-y-2">
                {alertName && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-brand-primary border-brand-primary/20">
                      {alertName}
                    </Badge>
                  </div>
                )}
                <p className="text-sm text-neutral-600">
                  You'll receive {frequency?.toLowerCase() || 'daily'} notifications for jobs matching: {[keywords, [city, state].filter(Boolean).join(', '), salaryMin && salaryMax ? `${salaryMin}k-${salaryMax}k` : salaryMin ? `${salaryMin}k+` : '', jobType, experienceLevel].filter(Boolean).join(', ') || 'your criteria'}
                </p>
              </div>
            </div>
          )}
        </form>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            {isEditMode ? "Update Alert" : "Create Alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}