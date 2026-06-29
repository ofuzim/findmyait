import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronUp, X, Loader2 } from "lucide-react";
import { FilterState } from "./JobFilters";

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersApply: (filters: FilterState) => void;
  appliedFilters: FilterState;
  isApplying?: boolean;
}

export function MobileFilterModal({ 
  isOpen, 
  onClose, 
  onFiltersApply, 
  appliedFilters, 
  isApplying = false 
}: MobileFilterModalProps) {
  const [openSections, setOpenSections] = useState({
    location: true,
    jobType: true,
    experience: true,
    facility: true
  });

  // Pending filter state (what user is currently selecting)
  const [pendingFilters, setPendingFilters] = useState<FilterState>(appliedFilters);

  // Active filters display (based on applied filters, not pending)
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Update active filters display based on applied filters
  const updateActiveFiltersDisplay = (filters: FilterState) => {
    const active: string[] = [];
    
    if (filters.location.state) {
      active.push(filters.location.state);
    }
    if (filters.location.remote) {
      active.push("Remote");
    }
    
    // Job types
    if (filters.jobTypes.includes("ait")) active.push("Administrator in Training");
    if (filters.jobTypes.includes("edt")) active.push("Executive Director in Training");
    if (filters.jobTypes.includes("assistant")) active.push("Assistant Administrator");
    if (filters.jobTypes.includes("management")) active.push("Healthcare Management Trainee");
    
    // Experience levels
    if (filters.experienceLevels.includes("entry")) active.push("Entry Level");
    if (filters.experienceLevels.includes("1-2years")) active.push("Mid Level");
    if (filters.experienceLevels.includes("3plus")) active.push("Experienced");
    
    // Facility types
    if (filters.facilityTypes.includes("skilled")) active.push("Skilled Nursing");
    if (filters.facilityTypes.includes("assisted")) active.push("Assisted Living");
    if (filters.facilityTypes.includes("memory")) active.push("Memory Care");
    if (filters.facilityTypes.includes("ccrc")) active.push("CCRC");
    if (filters.facilityTypes.includes("rehab")) active.push("Rehabilitation");
    if (filters.facilityTypes.includes("hospice")) active.push("Hospice");
    
    setActiveFilters(active);
  };

  // Update active filters display when applied filters change
  useEffect(() => {
    if (appliedFilters) {
      updateActiveFiltersDisplay(appliedFilters);
      setPendingFilters(appliedFilters); // Sync pending with applied
    }
  }, [appliedFilters]);

  // Reset pending filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setPendingFilters(appliedFilters);
      updateActiveFiltersDisplay(appliedFilters);
    }
  }, [isOpen, appliedFilters]);

  const handleApplyFilters = () => {
    onFiltersApply(pendingFilters);
    updateActiveFiltersDisplay(pendingFilters);
    onClose();
  };

  const removeFilter = (filter: string) => {
    let newFilters = { ...pendingFilters };
    
    // Handle location filters
    if (filter === "Remote") {
      newFilters.location.remote = false;
    } else if (["Texas", "Florida", "California", "New York", "Arizona", "North Carolina", "Georgia", "Ohio"].includes(filter)) {
      newFilters.location.state = "";
    }
    
    // Handle job type filters
    else if (filter === "Administrator in Training") {
      newFilters.jobTypes = newFilters.jobTypes.filter(type => type !== "ait");
    } else if (filter === "Executive Director in Training") {
      newFilters.jobTypes = newFilters.jobTypes.filter(type => type !== "edt");
    } else if (filter === "Assistant Administrator") {
      newFilters.jobTypes = newFilters.jobTypes.filter(type => type !== "assistant");
    } else if (filter === "Healthcare Management Trainee") {
      newFilters.jobTypes = newFilters.jobTypes.filter(type => type !== "management");
    }
    
    // Handle experience filters
    else if (filter === "Entry Level") {
      newFilters.experienceLevels = newFilters.experienceLevels.filter(level => level !== "entry");
    } else if (filter === "Mid Level") {
      newFilters.experienceLevels = newFilters.experienceLevels.filter(level => level !== "1-2years");
    } else if (filter === "Experienced") {
      newFilters.experienceLevels = newFilters.experienceLevels.filter(level => level !== "3plus");
    }
    
    // Handle facility type filters
    else if (filter === "Skilled Nursing") {
      newFilters.facilityTypes = newFilters.facilityTypes.filter(type => type !== "skilled");
    } else if (filter === "Assisted Living") {
      newFilters.facilityTypes = newFilters.facilityTypes.filter(type => type !== "assisted");
    } else if (filter === "Memory Care") {
      newFilters.facilityTypes = newFilters.facilityTypes.filter(type => type !== "memory");
    } else if (filter === "CCRC") {
      newFilters.facilityTypes = newFilters.facilityTypes.filter(type => type !== "ccrc");
    } else if (filter === "Rehabilitation") {
      newFilters.facilityTypes = newFilters.facilityTypes.filter(type => type !== "rehab");
    } else if (filter === "Hospice") {
      newFilters.facilityTypes = newFilters.facilityTypes.filter(type => type !== "hospice");
    }
    
    setPendingFilters(newFilters);
    updateActiveFiltersDisplay(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      location: { state: "", remote: false },
      jobTypes: [],
      experienceLevels: [],
      facilityTypes: []
    };
    setPendingFilters(clearedFilters);
    updateActiveFiltersDisplay(clearedFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Filter Jobs
          </DialogTitle>
          <DialogDescription>
            Refine your job search by location, job type, experience level, and facility type.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-700">
                  Active Filters ({activeFilters.length})
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-neutral-500 hover:text-neutral-700 h-auto p-1"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <Badge 
                    key={filter} 
                    variant="secondary" 
                    className="text-xs bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="ml-1 hover:text-neutral-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Location Filters */}
          <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
            <CollapsibleTrigger asChild>
              <button className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors rounded-lg border border-neutral-200">
                <h4 className="font-medium text-neutral-900">Location</h4>
                {openSections.location ? (
                  <ChevronUp className="h-4 w-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-4 border border-t-0 border-neutral-200 rounded-b-lg">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">State</label>
                  <Select value={pendingFilters.location.state} onValueChange={(value) => {
                    const newFilters = {
                      ...pendingFilters,
                      location: { ...pendingFilters.location, state: value === "all" ? "" : value }
                    };
                    setPendingFilters(newFilters);
                  }}>
                    <SelectTrigger className="w-full border-neutral-200 focus:border-brand-primary">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="Texas">Texas</SelectItem>
                      <SelectItem value="Florida">Florida</SelectItem>
                      <SelectItem value="California">California</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="Arizona">Arizona</SelectItem>
                      <SelectItem value="North Carolina">North Carolina</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Ohio">Ohio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <label htmlFor="remote" className="text-sm font-medium text-neutral-700">
                      Remote positions
                    </label>
                    <p className="text-xs text-neutral-500">Include remote and hybrid roles</p>
                  </div>
                  <Switch 
                    id="remote" 
                    checked={pendingFilters.location.remote}
                    onCheckedChange={(checked) => {
                      const newFilters = {
                        ...pendingFilters,
                        location: { ...pendingFilters.location, remote: checked }
                      };
                      setPendingFilters(newFilters);
                    }}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Job Type Filters */}
          <Collapsible open={openSections.jobType} onOpenChange={() => toggleSection('jobType')}>
            <CollapsibleTrigger asChild>
              <button className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors rounded-lg border border-neutral-200">
                <h4 className="font-medium text-neutral-900">Job Type</h4>
                {openSections.jobType ? (
                  <ChevronUp className="h-4 w-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 border border-t-0 border-neutral-200 rounded-b-lg">
                {[
                  { id: "ait", label: "Administrator in Training" },
                  { id: "edt", label: "Executive Director in Training" },
                  { id: "assistant", label: "Assistant Administrator" },
                  { id: "management", label: "Healthcare Management Trainee" }
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                    <Checkbox 
                      id={item.id} 
                      checked={pendingFilters.jobTypes.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const newJobTypes = checked 
                          ? [...pendingFilters.jobTypes, item.id]
                          : pendingFilters.jobTypes.filter(type => type !== item.id);
                        const newFilters = { ...pendingFilters, jobTypes: newJobTypes };
                        setPendingFilters(newFilters);
                      }}
                      className="data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                    />
                    <label htmlFor={item.id} className="text-sm text-neutral-700 cursor-pointer flex-1">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Experience Level */}
          <Collapsible open={openSections.experience} onOpenChange={() => toggleSection('experience')}>
            <CollapsibleTrigger asChild>
              <button className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors rounded-lg border border-neutral-200">
                <h4 className="font-medium text-neutral-900">Experience Level</h4>
                {openSections.experience ? (
                  <ChevronUp className="h-4 w-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 border border-t-0 border-neutral-200 rounded-b-lg">
                {[
                  { id: "entry", label: "Entry Level", sublabel: "0-1 years" },
                  { id: "1-2years", label: "Mid Level", sublabel: "1-2 years" },
                  { id: "3plus", label: "Experienced", sublabel: "3+ years" }
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                    <Checkbox 
                      id={item.id} 
                      checked={pendingFilters.experienceLevels.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const newExperienceLevels = checked 
                          ? [...pendingFilters.experienceLevels, item.id]
                          : pendingFilters.experienceLevels.filter(level => level !== item.id);
                        const newFilters = { ...pendingFilters, experienceLevels: newExperienceLevels };
                        setPendingFilters(newFilters);
                      }}
                      className="data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                    />
                    <div className="flex-1 cursor-pointer" onClick={() => document.getElementById(item.id)?.click()}>
                      <label htmlFor={item.id} className="text-sm font-medium text-neutral-700 cursor-pointer block">
                        {item.label}
                      </label>
                      <p className="text-xs text-neutral-500">{item.sublabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Facility Type */}
          <Collapsible open={openSections.facility} onOpenChange={() => toggleSection('facility')}>
            <CollapsibleTrigger asChild>
              <button className="w-full p-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors rounded-lg border border-neutral-200">
                <h4 className="font-medium text-neutral-900">Facility Type</h4>
                {openSections.facility ? (
                  <ChevronUp className="h-4 w-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 border border-t-0 border-neutral-200 rounded-b-lg">
                {[
                  { id: "skilled", label: "Skilled Nursing", sublabel: "Long-term care facilities" },
                  { id: "assisted", label: "Assisted Living", sublabel: "Independent living support" },
                  { id: "memory", label: "Memory Care", sublabel: "Specialized dementia care" },
                  { id: "ccrc", label: "CCRC", sublabel: "Continuing care retirement" },
                  { id: "rehab", label: "Rehabilitation", sublabel: "Post-acute care" },
                  { id: "hospice", label: "Hospice", sublabel: "End-of-life care" }
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                    <Checkbox 
                      id={item.id}
                      checked={pendingFilters.facilityTypes.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const newFacilityTypes = checked 
                          ? [...pendingFilters.facilityTypes, item.id]
                          : pendingFilters.facilityTypes.filter(type => type !== item.id);
                        const newFilters = { ...pendingFilters, facilityTypes: newFacilityTypes };
                        setPendingFilters(newFilters);
                      }}
                      className="data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                    />
                    <div className="flex-1 cursor-pointer" onClick={() => document.getElementById(item.id)?.click()}>
                      <label htmlFor={item.id} className="text-sm font-medium text-neutral-700 cursor-pointer block">
                        {item.label}
                      </label>
                      <p className="text-xs text-neutral-500">{item.sublabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Apply Filters Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApplyFilters}
              disabled={isApplying}
              className="flex-1 font-medium"
              style={{
                backgroundColor: isApplying ? 'var(--brand-secondary)' : 'var(--brand-primary)',
                color: 'white'
              }}
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Filters'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}