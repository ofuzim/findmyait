import { useState, useRef, useEffect, useMemo, memo, useCallback } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
  Download,
  Clock,
  DollarSign,
  GraduationCap,
  FileText,
  Users,
  Calendar,
  ArrowLeftRight
} from "lucide-react";
import { USMapComponent } from "./USMapComponent";

interface ResourcesPageProps {
  onNavigate: (page: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
  onLogout?: () => void;
}

interface StateRequirement {
  id: string;
  name: string;
  abbreviation: string;
  education: string;
  trainingHours: number;
  duration: string;
  preceptor: string;
  exam: string;
  passingScore: string;
  applicationFee: number;
  licenseFee: number;
  renewalFee: number;
  processingTime: string;
  reciprocity: string[];
  continuingEducation: string;
  renewal: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  address: string;
  lastUpdated: string;
  isHighDemand?: boolean;
  hasReciprocity?: boolean;
  recentlyUpdated?: boolean;
  recentUpdates?: string;
}

export function ResourcesPage({ onNavigate, isLoggedIn, currentUser, onLogout }: ResourcesPageProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedStateData, setSelectedStateData] = useState<StateRequirement | null>(null);
  const [showStateDialog, setShowStateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonStates, setComparisonStates] = useState<StateRequirement[]>([]);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Sample state data - in a real app, this would come from an API
  const stateRequirements: StateRequirement[] = [
    {
      id: "TX",
      name: "Texas",
      abbreviation: "TX",
      education: "Bachelor's degree from accredited institution",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 200,
      licenseFee: 150,
      renewalFee: 100,
      processingTime: "4-6 weeks",
      reciprocity: ["OK", "LA", "AR"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(512) 834-6700",
      contactEmail: "hcf.licensing@dshs.texas.gov",
      website: "dshs.texas.gov",
      address: "1100 W 49th St, Austin, TX 78756",
      lastUpdated: "January 2025",
      isHighDemand: true,
      hasReciprocity: true
    },
    {
      id: "CA",
      name: "California",
      abbreviation: "CA",
      education: "Bachelor's degree required, Master's preferred",
      trainingHours: 1200,
      duration: "18-24 months typical",
      preceptor: "Licensed NHA with 3+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 250,
      licenseFee: 200,
      renewalFee: 150,
      processingTime: "6-8 weeks",
      reciprocity: ["AZ", "NV"],
      continuingEducation: "40 hours annually",
      renewal: "Biennial renewal",
      contactPhone: "(916) 324-6630",
      contactEmail: "cdph.licensing@ca.gov",
      website: "cdph.ca.gov",
      address: "1616 Capitol Ave, Sacramento, CA 95814",
      lastUpdated: "December 2024",
      isHighDemand: true,
      hasReciprocity: true,
      recentlyUpdated: true,
      recentUpdates: "Updated training hour requirements from 1000 to 1200 hours effective January 2025"
    },
    {
      id: "FL",
      name: "Florida",
      abbreviation: "FL",
      education: "Bachelor's degree from accredited institution",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "70%",
      applicationFee: 175,
      licenseFee: 125,
      renewalFee: 75,
      processingTime: "3-5 weeks",
      reciprocity: ["GA", "AL"],
      continuingEducation: "30 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(850) 245-4444",
      contactEmail: "ltc.licensing@flhealth.gov",
      website: "floridahealth.gov",
      address: "4052 Bald Cypress Way, Tallahassee, FL 32399",
      lastUpdated: "January 2025",
      isHighDemand: true,
      hasReciprocity: true
    },
    {
      id: "NY",
      name: "New York",
      abbreviation: "NY",
      education: "Bachelor's degree required, healthcare administration preferred",
      trainingHours: 1200,
      duration: "18-24 months typical",
      preceptor: "Licensed NHA with 3+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 300,
      licenseFee: 250,
      renewalFee: 200,
      processingTime: "8-10 weeks",
      reciprocity: ["NJ", "CT"],
      continuingEducation: "50 hours annually",
      renewal: "Triennial renewal",
      contactPhone: "(518) 474-2121",
      contactEmail: "ltc@health.ny.gov",
      website: "health.ny.gov",
      address: "Empire State Plaza, Albany, NY 12237",
      lastUpdated: "November 2024",
      isHighDemand: true,
      hasReciprocity: true
    },
    {
      id: "PA",
      name: "Pennsylvania",
      abbreviation: "PA",
      education: "Bachelor's degree from accredited institution",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 225,
      licenseFee: 175,
      renewalFee: 125,
      processingTime: "5-7 weeks",
      reciprocity: ["OH", "WV", "MD"],
      continuingEducation: "40 hours annually",
      renewal: "Biennial renewal",
      contactPhone: "(717) 783-8980",
      contactEmail: "ltc@pa.gov",
      website: "health.pa.gov",
      address: "625 Forster St, Harrisburg, PA 17120",
      lastUpdated: "January 2025",
      hasReciprocity: true
    },
    {
      id: "IL",
      name: "Illinois",
      abbreviation: "IL",
      education: "Bachelor's degree required",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 180,
      licenseFee: 140,
      renewalFee: 90,
      processingTime: "4-6 weeks",
      reciprocity: ["IN", "WI"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(217) 782-4977",
      contactEmail: "dph.nursing@illinois.gov",
      website: "dph.illinois.gov",
      address: "525 W Jefferson St, Springfield, IL 62761",
      lastUpdated: "January 2025",
      isHighDemand: true,
      hasReciprocity: true
    },
    {
      id: "OH",
      name: "Ohio",
      abbreviation: "OH",
      education: "Bachelor's degree from accredited institution",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 195,
      licenseFee: 155,
      renewalFee: 105,
      processingTime: "5-7 weeks",
      reciprocity: ["PA", "WV", "IN"],
      continuingEducation: "40 hours annually",
      renewal: "Biennial renewal",
      contactPhone: "(614) 466-7857",
      contactEmail: "info@odh.ohio.gov",
      website: "odh.ohio.gov",
      address: "246 N High St, Columbus, OH 43215",
      lastUpdated: "December 2024",
      hasReciprocity: true
    },
    {
      id: "MI",
      name: "Michigan",
      abbreviation: "MI",
      education: "Bachelor's degree required",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 210,
      licenseFee: 165,
      renewalFee: 115,
      processingTime: "6-8 weeks",
      reciprocity: ["IN", "OH"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(517) 241-2626",
      contactEmail: "info@michigan.gov",
      website: "michigan.gov",
      address: "201 Townsend St, Lansing, MI 48913",
      lastUpdated: "January 2025",
      isHighDemand: true,
      hasReciprocity: true
    },
    {
      id: "GA",
      name: "Georgia",
      abbreviation: "GA",
      education: "Bachelor's degree from accredited institution",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 185,
      licenseFee: 145,
      renewalFee: 95,
      processingTime: "4-6 weeks",
      reciprocity: ["FL", "SC", "AL"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(404) 657-5700",
      contactEmail: "dch.ga.gov",
      website: "dch.georgia.gov",
      address: "2 Peachtree St NW, Atlanta, GA 30303",
      lastUpdated: "January 2025",
      isHighDemand: true,
      hasReciprocity: true
    },
    {
      id: "NC",
      name: "North Carolina",
      abbreviation: "NC",
      education: "Bachelor's degree required",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 190,
      licenseFee: 150,
      renewalFee: 100,
      processingTime: "5-7 weeks",
      reciprocity: ["SC", "VA"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(919) 707-5000",
      contactEmail: "dhhs.nc.gov",
      website: "dhhs.nc.gov",
      address: "101 Blair Dr, Raleigh, NC 27603",
      lastUpdated: "December 2024",
      hasReciprocity: true
    },
    {
      id: "WA",
      name: "Washington",
      abbreviation: "WA",
      education: "Bachelor's degree required",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 200,
      licenseFee: 160,
      renewalFee: 110,
      processingTime: "5-7 weeks",
      reciprocity: ["OR", "ID"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(360) 236-4700",
      contactEmail: "hpqa.csc@doh.wa.gov",
      website: "doh.wa.gov",
      address: "1112 SE Quince St, Olympia, WA 98504",
      lastUpdated: "January 2025",
      hasReciprocity: true
    },
    {
      id: "OR",
      name: "Oregon",
      abbreviation: "OR",
      education: "Bachelor's degree from accredited institution",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 180,
      licenseFee: 140,
      renewalFee: 90,
      processingTime: "4-6 weeks",
      reciprocity: ["WA", "CA"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(971) 673-0540",
      contactEmail: "ltc.licensing@dhsoha.state.or.us",
      website: "oregon.gov",
      address: "500 Summer St NE, Salem, OR 97301",
      lastUpdated: "January 2025",
      hasReciprocity: true
    },
    {
      id: "NV",
      name: "Nevada",
      abbreviation: "NV",
      education: "Bachelor's degree required",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 220,
      licenseFee: 170,
      renewalFee: 120,
      processingTime: "6-8 weeks",
      reciprocity: ["CA", "AZ"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(775) 687-4475",
      contactEmail: "hcqp@dhhs.nv.gov",
      website: "dhhs.nv.gov",
      address: "4150 Technology Way, Carson City, NV 89706",
      lastUpdated: "December 2024",
      hasReciprocity: true
    },
    {
      id: "AZ",
      name: "Arizona",
      abbreviation: "AZ",
      education: "Bachelor's degree required",
      trainingHours: 1000,
      duration: "12-18 months typical",
      preceptor: "Licensed NHA with 2+ years experience",
      exam: "NAB examination required",
      passingScore: "75%",
      applicationFee: 175,
      licenseFee: 135,
      renewalFee: 85,
      processingTime: "4-6 weeks",
      reciprocity: ["NV", "NM"],
      continuingEducation: "40 hours annually",
      renewal: "Annual renewal required",
      contactPhone: "(602) 364-2536",
      contactEmail: "azdhs.licensing@azdhs.gov",
      website: "azdhs.gov",
      address: "150 N 18th Ave, Phoenix, AZ 85007",
      lastUpdated: "January 2025",
      hasReciprocity: true
    }
  ];

  const filteredStates = stateRequirements.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         state.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());

    switch (activeFilter) {  
      case 'high-demand':
        return matchesSearch && state.isHighDemand;
      case 'reciprocity':
        return matchesSearch && state.hasReciprocity;
      case 'recently-updated':
        return matchesSearch && state.recentlyUpdated;
      default:
        return matchesSearch;
    }
  });

  const handleStateClick = useCallback((stateId: string) => {
    const state = stateRequirements.find(s => s.id === stateId);
    if (state) {
      setSelectedState(stateId);
      setSelectedStateData(state);
      setShowStateDialog(true);
    } else {
      // Create placeholder data for states without detailed information
      const placeholderState: StateRequirement = {
        id: stateId,
        name: getStateName(stateId),
        abbreviation: stateId,
        education: "Information coming soon",
        trainingHours: 0,
        duration: "Information coming soon",
        preceptor: "Information coming soon",
        exam: "NAB examination typically required",
        passingScore: "Information coming soon",
        applicationFee: 0,
        licenseFee: 0,
        renewalFee: 0,
        processingTime: "Information coming soon",
        reciprocity: [],
        continuingEducation: "Information coming soon",
        renewal: "Information coming soon",
        contactPhone: "Information coming soon",
        contactEmail: "Information coming soon",
        website: "Information coming soon",
        address: "Information coming soon",
        lastUpdated: "Information coming soon",
        hasReciprocity: false
      };
      setSelectedState(stateId);
      setSelectedStateData(placeholderState);
      setShowStateDialog(true);
    }
  }, [stateRequirements]);

  const handleMouseEnter = useCallback((stateId: string) => {
    setHoveredState(stateId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
  }, []);

  // Helper function to get full state names
  const getStateName = (stateId: string): string => {
    const stateNames: { [key: string]: string } = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
      'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
      'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
      'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
      'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
      'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
      'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
      'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
    };
    return stateNames[stateId] || stateId;
  };

  // Helper function to get state abbreviations from full names
  const getStateAbbreviation = (stateName: string): string => {
    const stateAbbreviations: { [key: string]: string } = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
      'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
      'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
      'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
      'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
      'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
      'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
      'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
    };
    return stateAbbreviations[stateName] || stateName;
  };

  const handleAddToComparison = (state: StateRequirement) => {
    if (comparisonStates.length < 3 && !comparisonStates.find(s => s.id === state.id)) {
      setComparisonStates([...comparisonStates, state]);
    }
  };

  const handleRemoveFromComparison = (stateId: string) => {
    setComparisonStates(comparisonStates.filter(s => s.id !== stateId));
  };

  const handleStateHover = useCallback((stateId: string | null) => {
    setHoveredState(stateId);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigate={onNavigate} 
        currentPage="resources" 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-primary-hover text-white pt-[80px] pr-[0px] pb-[60px] pl-[0px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                <FileText className="h-4 w-4 mr-2" />
                State Licensing Requirements & Resources
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-medium mb-6">
                AIT Requirements by State
              </h1>
              
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Navigate licensing requirements, training programs, and resources for Administrator in Training positions across all US states
              </p>
              

            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Map and Controls */}
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl mb-4 text-neutral-900">Interactive Requirements Map</h2>
                  <p className="text-neutral-600 mb-6">
                    Click on any state to view detailed licensing requirements. Use the filters in the "All State Requirements" section below to highlight specific types of states.
                  </p>
                </div>
                
                {/* Map Container */}
                <Card className="p-6 bg-neutral-50">
                  <div className="h-64 md:h-[600px]">
                    <USMapComponent
                      selectedState={selectedState}
                      hoveredState={hoveredState}
                      onStateClick={handleStateClick}
                      onStateHover={handleStateHover}
                      stateRequirements={stateRequirements}
                      activeFilter={activeFilter}
                    />
                  </div>
                  
                  {/* Map Legend */}
                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "#64748b" }}></div>
                      <span className="text-sm text-neutral-600">Standard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "#fbbf24" }}></div>
                      <span className="text-sm text-neutral-600">High-Demand</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "#5a7bc4" }}></div>
                      <span className="text-sm text-neutral-600">Reciprocity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "var(--brand-accent)" }}></div>
                      <span className="text-sm text-neutral-600">Recently Updated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: "var(--brand-primary)" }}></div>
                      <span className="text-sm text-neutral-600">Selected</span>
                    </div>
                    {activeFilter !== 'all' && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: "#e5e7eb" }}></div>
                        <span className="text-sm text-neutral-600">Filtered Out</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
              

            </div>
          </div>
        </section>

        {/* State List Section */}
        <section className="py-12 sm:py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-neutral-900">All State Requirements</h2>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar - Full width on mobile, flexible on desktop */}
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <Input
                    placeholder="Search by state name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-neutral-300 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
                  />
                </div>
                
                {/* Filter Buttons - Stacked on mobile, inline on desktop */}
                <div className="flex flex-wrap gap-2 sm:items-center">
                  <Button
                    variant={activeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("all")}
                    className={activeFilter === "all" ? "bg-brand-primary hover:bg-brand-primary-hover" : ""}
                  >
                    All States
                  </Button>
                  <Button
                    variant={activeFilter === "high-demand" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("high-demand")}
                    className={activeFilter === "high-demand" ? "bg-brand-primary hover:bg-brand-primary-hover" : ""}
                  >
                    High-Demand
                  </Button>
                  <Button
                    variant={activeFilter === "reciprocity" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("reciprocity")}
                    className={activeFilter === "reciprocity" ? "bg-brand-primary hover:bg-brand-primary-hover" : ""}
                  >
                    Reciprocity States
                  </Button>
                  <Button
                    variant={activeFilter === "recently-updated" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("recently-updated")}
                    className={activeFilter === "recently-updated" ? "bg-brand-primary hover:bg-brand-primary-hover" : ""}
                  >
                    Recently Updated
                  </Button>
                </div>
              </div>
              
              {/* Results count */}
              <p className="text-sm sm:text-base text-neutral-600 mt-4">
                {filteredStates.length} of {stateRequirements.length} states shown
                {searchTerm && ` (filtered by "${searchTerm}")`}
                {activeFilter !== "all" && ` (${activeFilter.replace('-', ' ')} only)`}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStates.map((state) => (
                <Card key={state.id} className="p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-neutral-900">{state.name}</h3>
                    <div className="flex gap-1">
                      {state.isHighDemand && (
                        <Badge variant="secondary" className="text-xs">High Demand</Badge>
                      )}
                      {state.hasReciprocity && (
                        <Badge style={{ backgroundColor: 'var(--brand-secondary)', color: 'white' }} className="text-xs">
                          Reciprocity
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-neutral-500" />
                      <span>{state.trainingHours} training hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-neutral-500" />
                      <span>${state.applicationFee + state.licenseFee} total fees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      <span>{state.processingTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white"
                      onClick={() => handleStateClick(state.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAddToComparison(state)}
                      disabled={comparisonStates.length >= 3 || comparisonStates.find(s => s.id === state.id) !== undefined}
                    >
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Compare
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Resources Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl mb-8 text-neutral-900">Additional Resources</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <GraduationCap className="h-12 w-12 text-brand-primary mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Training Programs</h3>
                <p className="text-neutral-600 mb-4">Find accredited AIT training programs in your state</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://www.nabweb.org/the-examination/preparation-materials/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Programs
                </Button>
              </Card>
              
              <Card className="p-6">
                <FileText className="h-12 w-12 text-brand-primary mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">NAB Exam Prep</h3>
                <p className="text-neutral-600 mb-4">Prepare for the National Administrator Board examination</p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => window.open('https://www.nabweb.org/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  NAB Official Site
                </Button>
              </Card>
              
              <Card className="p-6">
                <Users className="h-12 w-12 text-brand-primary mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Professional Associations</h3>
                <p className="text-neutral-600 mb-4">Connect with healthcare administration professional organizations</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://www.achca.org/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join ACHCA
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* State Details Dialog */}
      <Dialog open={showStateDialog} onOpenChange={setShowStateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-light">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-primary" />
              {selectedStateData?.name} AIT Requirements
            </DialogTitle>
            <DialogDescription>
              Complete licensing requirements and contact information for Administrator in Training positions.
            </DialogDescription>
          </DialogHeader>
          
          {selectedStateData && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Education Requirements</h4>
                  <p className="text-neutral-600">{selectedStateData.education}</p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Training Duration</h4>
                  <p className="text-neutral-600">{selectedStateData.duration}</p>
                </div>
              </div>

              {/* Training Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Training Hours</h4>
                  <p className="text-neutral-600">{selectedStateData.trainingHours || 'Information coming soon'} hours</p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Preceptor Requirements</h4>
                  <p className="text-neutral-600">{selectedStateData.preceptor}</p>
                </div>
              </div>

              {/* Exam & Fees */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Examination</h4>
                  <p className="text-neutral-600">{selectedStateData.exam}</p>
                  <p className="text-sm text-neutral-500">Passing Score: {selectedStateData.passingScore}</p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Fees</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Application:</span>
                      <span>${selectedStateData.applicationFee || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>License:</span>
                      <span>${selectedStateData.licenseFee || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Renewal:</span>
                      <span>${selectedStateData.renewalFee || 'TBD'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing & Reciprocity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Processing Time</h4>
                  <p className="text-neutral-600">{selectedStateData.processingTime}</p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Reciprocity States</h4>
                  {selectedStateData.reciprocity && selectedStateData.reciprocity.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selectedStateData.reciprocity.map((state) => (
                        <Badge key={state} variant="secondary" className="text-xs">
                          {state}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-600">No reciprocity agreements</p>
                  )}
                </div>
              </div>

              {/* Continuing Education & Renewal */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Continuing Education</h4>
                  <p className="text-neutral-600">{selectedStateData.continuingEducation}</p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">License Renewal</h4>
                  <p className="text-neutral-600">{selectedStateData.renewal}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-neutral-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-neutral-500" />
                    <span>{selectedStateData.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-neutral-500" />
                    <span>{selectedStateData.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-4 w-4 text-neutral-500" />
                    <span>{selectedStateData.website}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-neutral-500 mt-0.5" />
                    <span>{selectedStateData.address}</span>
                  </div>
                </div>
              </div>

              {/* Recent Updates */}
              {selectedStateData.recentUpdates && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-neutral-900 mb-2">Recent Updates</h4>
                  <p className="text-sm text-neutral-600">{selectedStateData.recentUpdates}</p>
                  <p className="text-xs text-neutral-500 mt-1">Last Updated: {selectedStateData.lastUpdated}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white"
                  onClick={() => handleAddToComparison(selectedStateData)}
                  disabled={comparisonStates.length >= 3 || comparisonStates.find(s => s.id === selectedStateData.id) !== undefined}
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Add to Compare
                </Button>
                <Button variant="outline" onClick={() => setShowStateDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* State Comparison Dialog */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>State Requirements Comparison</DialogTitle>
            <DialogDescription>
              Compare licensing requirements across selected states.
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-x-auto scrollbar-light">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Requirement</th>
                  {comparisonStates.map((state) => (
                    <th key={state.id} className="text-left p-2 font-medium min-w-32">
                      {state.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-2 font-medium">Education</td>
                  {comparisonStates.map((state) => (
                    <td key={state.id} className="p-2 text-neutral-600">{state.education}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium">Training Hours</td>
                  {comparisonStates.map((state) => (
                    <td key={state.id} className="p-2 text-neutral-600">{state.trainingHours} hours</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium">Processing Time</td>
                  {comparisonStates.map((state) => (
                    <td key={state.id} className="p-2 text-neutral-600">{state.processingTime}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium">Total Fees</td>
                  {comparisonStates.map((state) => (
                    <td key={state.id} className="p-2 text-neutral-600">
                      ${state.applicationFee + state.licenseFee}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium">Passing Score</td>
                  {comparisonStates.map((state) => (
                    <td key={state.id} className="p-2 text-neutral-600">{state.passingScore}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium">Continuing Ed</td>
                  {comparisonStates.map((state) => (
                    <td key={state.id} className="p-2 text-neutral-600">{state.continuingEducation}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowComparison(false)}>
              Close Comparison
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating State Comparison Panel - Bottom Right */}
      {comparisonStates.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className={`p-4 bg-white shadow-xl border-2 border-neutral-200 ${comparisonStates.length > 1 ? 'w-80' : 'max-w-sm'}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-neutral-900">Compare States</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setComparisonStates([])}
                className="h-6 w-6 p-0 text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {comparisonStates.map((state) => (
                <div key={state.id} className="flex items-center justify-between bg-neutral-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium">{state.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromComparison(state.id)}
                    className="h-5 w-5 p-0 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="text-xs text-neutral-500 mb-3">
              {comparisonStates.length} of 3 states selected
            </div>
            
            {comparisonStates.length >= 2 && (
              <Button
                className="w-full bg-brand-secondary hover:bg-brand-secondary-hover text-white"
                onClick={() => setShowComparison(true)}
                size="sm"
              >
                Compare States
              </Button>
            )}
            
            {comparisonStates.length === 1 && (
              <p className="text-xs text-neutral-500 text-center">
                Select one or two more states to compare
              </p>
            )}
          </Card>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
}