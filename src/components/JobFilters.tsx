import React, { useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronUp, Filter, X, Loader2 } from "lucide-react";

export interface FilterState {
  location: {
    state: string;
    remote: boolean;
  };
  jobTypes: string[];
  experienceLevels: string[];
  facilityTypes: string[];
}

interface JobFiltersProps {
  onFiltersApply?: (filters: FilterState) => void;
  appliedFilters?: FilterState;
  isApplying?: boolean;
}

export function JobFilters({ onFiltersApply, appliedFilters, isApplying = false }: JobFiltersProps) {
  const [openSections, setOpenSections] = useState({
    location: true,
    jobType: true,
    experience: true,
    facility: true
  });

  // Pending filter state (what user is currently selecting)
  const [pendingFilters, setPendingFilters] = useState<FilterState>({
    location: {
      state: "",
      remote: false
    },
    jobTypes: ["ait"], // Supabase: job_type ('ait' | 'edt')
    experienceLevels: ["entry", "1-2years", "3-5years"], // Supabase: experience_level
    facilityTypes: [] // Supabase: facility_type_id ('skilled' | 'assisted' | 'memory' | 'ccrc' | 'rehab' | 'longterm')
  });

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
    if (filters.jobTypes.includes("ait")) active.push("Administrator in Training (AIT)");
    if (filters.jobTypes.includes("edt")) active.push("Executive Director in Training (EDT)");
    if (filters.jobTypes.includes("assistant")) active.push("Assistant Administrator");
    if (filters.jobTypes.includes("management")) active.push("Healthcare Management Trainee");
    
    // Experience levels
    if (filters.experienceLevels.includes("entry")) active.push("Entry Level");
    if (filters.experienceLevels.includes("1-2years")) active.push("1-2 Years");
    if (filters.experienceLevels.includes("3-5years")) active.push("3-5 Years");
    
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

  const handleApplyFilters = () => {
    onFiltersApply?.(pendingFilters);
    updateActiveFiltersDisplay(pendingFilters);
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
    } else if (filter === "1-2 Years") {
      newFilters.experienceLevels = newFilters.experienceLevels.filter(level => level !== "1-2years");
    } else if (filter === "3-5 Years") {
      newFilters.experienceLevels = newFilters.experienceLevels.filter(level => level !== "3-5years");
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
    // Apply immediately when removing from active filters
    onFiltersApply?.(newFilters);
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
    // Apply immediately when clearing all
    onFiltersApply?.(clearedFilters);
    updateActiveFiltersDisplay(clearedFilters);
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <Card className="p-4 bg-white border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-neutral-600" />
            <h3 className="font-semibold text-neutral-900">Filters</h3>
          </div>
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-neutral-500 hover:text-neutral-700 h-auto p-1"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Active Filters ({activeFilters.length})
            </p>
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
      </Card>

      {/* Location Filters */}
      <Card className="bg-white border border-neutral-200">
        <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors">
              <h4 className="font-medium text-neutral-900">Location</h4>
              {openSections.location ? (
                <ChevronUp className="h-4 w-4 text-neutral-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4">
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
                    <SelectItem value="Alabama">Alabama</SelectItem>
                    <SelectItem value="Alaska">Alaska</SelectItem>
                    <SelectItem value="Arizona">Arizona</SelectItem>
                    <SelectItem value="Arkansas">Arkansas</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="Colorado">Colorado</SelectItem>
                    <SelectItem value="Connecticut">Connecticut</SelectItem>
                    <SelectItem value="Delaware">Delaware</SelectItem>
                    <SelectItem value="Florida">Florida</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Hawaii">Hawaii</SelectItem>
                    <SelectItem value="Idaho">Idaho</SelectItem>
                    <SelectItem value="Illinois">Illinois</SelectItem>
                    <SelectItem value="Indiana">Indiana</SelectItem>
                    <SelectItem value="Iowa">Iowa</SelectItem>
                    <SelectItem value="Kansas">Kansas</SelectItem>
                    <SelectItem value="Kentucky">Kentucky</SelectItem>
                    <SelectItem value="Louisiana">Louisiana</SelectItem>
                    <SelectItem value="Maine">Maine</SelectItem>
                    <SelectItem value="Maryland">Maryland</SelectItem>
                    <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                    <SelectItem value="Michigan">Michigan</SelectItem>
                    <SelectItem value="Minnesota">Minnesota</SelectItem>
                    <SelectItem value="Mississippi">Mississippi</SelectItem>
                    <SelectItem value="Missouri">Missouri</SelectItem>
                    <SelectItem value="Montana">Montana</SelectItem>
                    <SelectItem value="Nebraska">Nebraska</SelectItem>
                    <SelectItem value="Nevada">Nevada</SelectItem>
                    <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                    <SelectItem value="New Jersey">New Jersey</SelectItem>
                    <SelectItem value="New Mexico">New Mexico</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="North Carolina">North Carolina</SelectItem>
                    <SelectItem value="North Dakota">North Dakota</SelectItem>
                    <SelectItem value="Ohio">Ohio</SelectItem>
                    <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                    <SelectItem value="Oregon">Oregon</SelectItem>
                    <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                    <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                    <SelectItem value="South Carolina">South Carolina</SelectItem>
                    <SelectItem value="South Dakota">South Dakota</SelectItem>
                    <SelectItem value="Tennessee">Tennessee</SelectItem>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="Utah">Utah</SelectItem>
                    <SelectItem value="Vermont">Vermont</SelectItem>
                    <SelectItem value="Virginia">Virginia</SelectItem>
                    <SelectItem value="Washington">Washington</SelectItem>
                    <SelectItem value="West Virginia">West Virginia</SelectItem>
                    <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                    <SelectItem value="Wyoming">Wyoming</SelectItem>
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
      </Card>

      {/* Job Type Filters */}
      <Card className="bg-white border border-neutral-200">
        <Collapsible open={openSections.jobType} onOpenChange={() => toggleSection('jobType')}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors">
              <h4 className="font-medium text-neutral-900">Job Type</h4>
              {openSections.jobType ? (
                <ChevronUp className="h-4 w-4 text-neutral-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-3">
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
      </Card>

      {/* Experience Level */}
      <Card className="bg-white border border-neutral-200">
        <Collapsible open={openSections.experience} onOpenChange={() => toggleSection('experience')}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors">
              <h4 className="font-medium text-neutral-900">Experience Level</h4>
              {openSections.experience ? (
                <ChevronUp className="h-4 w-4 text-neutral-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-3">
              {[
                { id: "entry", label: "Entry Level", sublabel: "0-1 years" },
                { id: "1-2years", label: "1-2 Years", sublabel: "1-2 years" },
                { id: "3-5years", label: "3-5 Years", sublabel: "3-5 years" }
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
      </Card>

      {/* Facility Type */}
      <Card className="bg-white border border-neutral-200">
        <Collapsible open={openSections.facility} onOpenChange={() => toggleSection('facility')}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors">
              <h4 className="font-medium text-neutral-900">Facility Type</h4>
              {openSections.facility ? (
                <ChevronUp className="h-4 w-4 text-neutral-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-3">
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
      </Card>

      {/* Apply Filters Button */}
      <Button 
        size="lg"
        onClick={handleApplyFilters}
        disabled={isApplying}
        className="w-full font-medium rounded-xl transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundColor: isApplying ? 'var(--brand-secondary)' : 'var(--brand-primary)',
          color: 'white',
          transform: isApplying ? 'scale(1.02)' : 'scale(1)'
        }}
        onMouseEnter={(e) => {
          if (!isApplying) {
            e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isApplying) {
            e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
          }
        }}
      >
        {isApplying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Applying Filters...
          </>
        ) : (
          'Apply Filters'
        )}
      </Button>

      {/* People Also Searched */}
      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
        <p className="text-sm font-medium text-neutral-700 mb-3">People also searched</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Nursing Home Jobs",
            "Remote AIT",
            "Texas Administrator", 
            "Memory Care Director",
            "Healthcare Leadership",
            "Executive Trainee"
          ].map((search) => (
            <button
              key={search}
              className="px-3 py-1 text-sm bg-white border border-neutral-200 rounded-full hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}