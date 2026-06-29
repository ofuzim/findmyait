import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin, Briefcase, ChevronDown, Loader2 } from "lucide-react";

interface SearchSectionProps {
  onNavigate?: (page: string) => void;
}

export function SearchSection({ onNavigate }: SearchSectionProps) {
  // State for location dropdown
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  // State for position dropdown
  const [positionQuery, setPositionQuery] = useState<string>('');
  const [isPositionOpen, setIsPositionOpen] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  
  // Refs for dropdowns
  const locationRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);

  // Search animation state
  const [isSearching, setIsSearching] = useState(false);

  // US States list
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // Position suggestions
  const positionSuggestions = [
    'Administrator in Training',
    'AIT Program',
    'Executive Director Training',
    'Healthcare Administrator',
    'Nursing Home Administrator',
    'Long-term Care Administrator',
    'Assisted Living Administrator',
    'Healthcare Management Trainee',
    'Director of Operations Training',
    'Facility Administrator Training',
    'Senior Living Administrator',
    'Healthcare Leadership Program',
    'Administrator Apprenticeship',
    'Management Training Program',
    'Healthcare Executive Training'
  ];

  // Filter functions with robust error handling using useMemo
  const filteredStates = useMemo(() => {
    try {
      const query = typeof locationQuery === 'string' ? locationQuery : '';
      return states.filter(state => {
        if (typeof state !== 'string') return false;
        return state.toLowerCase().includes(query.toLowerCase());
      });
    } catch (error) {
      console.warn('Error filtering states:', error);
      return states; // Return all states if filtering fails
    }
  }, [locationQuery]);

  const filteredPositions = useMemo(() => {
    try {
      const query = typeof positionQuery === 'string' ? positionQuery : '';
      return positionSuggestions.filter(position => {
        if (typeof position !== 'string') return false;
        return position.toLowerCase().includes(query.toLowerCase());
      });
    } catch (error) {
      console.warn('Error filtering positions:', error);
      return positionSuggestions; // Return all positions if filtering fails
    }
  }, [positionQuery]);

  // Ensure state is properly initialized - check continuously
  useEffect(() => {
    // Force re-render with safe state if needed
    if (typeof locationQuery !== 'string') {
      console.warn('⚠️ SearchSection: locationQuery is not a string');
      setLocationQuery('');
    }
    if (typeof positionQuery !== 'string') {
      console.warn('⚠️ SearchSection: positionQuery is not a string');
      setPositionQuery('');
    }
    if (typeof selectedLocation !== 'string') {
      console.warn('⚠️ SearchSection: selectedLocation is not a string');
      setSelectedLocation('');
    }
    if (typeof selectedPosition !== 'string') {
      console.warn('⚠️ SearchSection: selectedPosition is not a string');
      setSelectedPosition('');
    }
    // Also check for [object Object] strings
    if (String(locationQuery).includes('[object')) {
      console.warn('⚠️ SearchSection: locationQuery contains [object]');
      setLocationQuery('');
    }
    if (String(positionQuery).includes('[object')) {
      console.warn('⚠️ SearchSection: positionQuery contains [object]');
      setPositionQuery('');
    }
  }, [locationQuery, positionQuery, selectedLocation, selectedPosition]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (positionRef.current && !positionRef.current.contains(event.target as Node)) {
        setIsPositionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (state: string) => {
    const safeState = typeof state === 'string' ? state : '';
    setSelectedLocation(safeState);
    setLocationQuery(safeState);
    setIsLocationOpen(false);
  };

  const handlePositionSelect = (position: string) => {
    const safePosition = typeof position === 'string' ? position : '';
    setSelectedPosition(safePosition);
    setPositionQuery(safePosition);
    setIsPositionOpen(false);
  };

  const handleSearch = (searchTerm?: string) => {
    if (!onNavigate) {
      console.error('❌ onNavigate is not defined');
      return;
    }
    
    setIsSearching(true);
    
    // Close dropdowns immediately
    setIsLocationOpen(false);
    setIsPositionOpen(false);
    
    // Simple navigation with minimal processing
    setTimeout(() => {
      try {
        // Helper function to safely get string value
        const safeString = (val: any): string => {
          if (val === null || val === undefined || val === '') return '';
          if (typeof val === 'object') return ''; // Don't convert objects
          return String(val).trim();
        };
        
        // Get search values - try each source and use first valid result
        let position = safeString(searchTerm);
        if (!position) position = safeString(positionQuery);
        if (!position) position = safeString(selectedPosition);
        
        let location = safeString(locationQuery);
        if (!location) location = safeString(selectedLocation);
        
        // Build simple URL - only add if valid strings
        const params = [];
        if (position) {
          params.push(`position=${encodeURIComponent(position)}`);
        }
        if (location) {
          params.push(`location=${encodeURIComponent(location)}`);
        }
        
        // Add scroll parameter to anchor to results when coming from home page
        params.push('scrollToResults=true');
        
        const url = params.length > 0 ? `jobs?${params.join('&')}` : 'jobs';
        
        onNavigate(url);
      } catch (error) {
        console.error('❌ Navigation error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 800);
  };

  return (
    <section
      className="relative overflow-hidden py-20"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(6, 21, 45, 0.82), rgba(24, 65, 109, 0.72)), url('https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=85&w=2200')",
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/35 to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'var(--brand-primary)'
            }}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Specialized Healthcare Opportunities</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-white mb-6 font-semibold drop-shadow-sm">
            Find Your AIT <span className="brand-highlight-underline relative inline-block">Opportunity</span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-sm">
            Discover Administrator in Training positions that match your career goals and location preferences.
          </p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/70 p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Job search input with dropdown */}
            <div className="md:col-span-6 relative" ref={positionRef}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Position or Keywords</label>
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-neutral-400 z-10" />
                <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-neutral-400 z-10" />
                <Input
                  type="text"
                  value={typeof positionQuery === 'string' ? positionQuery : String(positionQuery || '')}
                  onChange={(e) => {
                    const value = typeof e.target.value === 'string' ? e.target.value : '';
                    setPositionQuery(value);
                    setIsPositionOpen(true);
                  }}
                  onFocus={() => setIsPositionOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Administrator in Training, AIT, Executive Director..."
                  className="pl-12 pr-12 h-14 border-neutral-200 rounded-xl text-base"
                  style={{
                    '--tw-ring-color': 'var(--brand-primary)'
                  }}
                />
                
                {/* Position Dropdown */}
                {isPositionOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-light">
                    {filteredPositions.length > 0 ? (
                      filteredPositions.map((position, index) => (
                        <button
                          key={index}
                          onClick={() => handlePositionSelect(position)}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 text-sm"
                        >
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-neutral-400 mr-3 flex-shrink-0" />
                            <span className="text-neutral-700">{position}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-neutral-500">
                        No matching positions found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Location input with state dropdown */}
            <div className="md:col-span-4 relative" ref={locationRef}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-neutral-400 z-10" />
                <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-neutral-400 z-10" />
                <Input
                  type="text"
                  value={typeof locationQuery === 'string' ? locationQuery : String(locationQuery || '')}
                  onChange={(e) => {
                    const value = typeof e.target.value === 'string' ? e.target.value : '';
                    setLocationQuery(value);
                    setIsLocationOpen(true);
                  }}
                  onFocus={() => setIsLocationOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Select state or enter city"
                  className="pl-12 pr-12 h-14 border-neutral-200 rounded-xl text-base"
                  style={{
                    '--tw-ring-color': 'var(--brand-primary)'
                  }}
                />
                
                {/* States Dropdown */}
                {isLocationOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-light">
                    {filteredStates.length > 0 ? (
                      filteredStates.map((state, index) => (
                        <button
                          key={index}
                          onClick={() => handleLocationSelect(state)}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 text-sm"
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-neutral-400 mr-3 flex-shrink-0" />
                            <span className="text-neutral-700">{state}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-neutral-500">
                        No matching states found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Search button */}
            <div className="md:col-span-2 flex items-end">
              <Button 
                size="lg"
                onClick={handleSearch}
                disabled={isSearching}
                className={`font-medium h-14 w-full rounded-xl transition-all duration-300 ${
                  isSearching 
                    ? 'scale-95 shadow-2xl' 
                    : 'hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
                style={{
                  backgroundColor: isSearching ? 'var(--brand-secondary)' : 'var(--brand-primary)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (!isSearching) {
                    e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSearching) {
                    e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                  }
                }}
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <span>Search Jobs</span>
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-neutral-500">Popular searches:</span>
            <button 
              onClick={() => handleSearch('AIT Programs')}
              disabled={isSearching}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                isSearching ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                color: 'var(--brand-primary)',
                backgroundColor: 'color-mix(in srgb, var(--brand-primary) 8%, white)'
              }}
              onMouseEnter={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--brand-primary) 15%, white)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--brand-primary) 8%, white)';
                }
              }}
            >
              AIT Programs
            </button>
            <button 
              onClick={() => handleSearch('Executive Director Training')}
              disabled={isSearching}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                isSearching ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                color: 'var(--brand-primary)',
                backgroundColor: 'color-mix(in srgb, var(--brand-primary) 8%, white)'
              }}
              onMouseEnter={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--brand-primary) 15%, white)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--brand-primary) 8%, white)';
                }
              }}
            >
              Executive Director Training
            </button>
            <button 
              onClick={() => handleSearch('Healthcare Administration')}
              disabled={isSearching}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                isSearching ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                color: 'var(--brand-primary)',
                backgroundColor: 'color-mix(in srgb, var(--brand-primary) 8%, white)'
              }}
              onMouseEnter={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--brand-primary) 15%, white)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--brand-primary) 8%, white)';
                }
              }}
            >
              Healthcare Administration
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
