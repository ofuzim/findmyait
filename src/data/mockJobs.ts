// FindMyAIT Mock Jobs Data
// 🔄 PLACEHOLDER - Mock job listings for testing and development
// In production: This would be fetched from backend API

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  highlights: string[];
  postedDate: string;
  facilityType: string;
  jobType: "ait" | "edt";
  experienceLevel: "entry" | "1-2years" | "3-5years";
  isRemote: boolean;
  state: string;
  facilityTypeId: "memory" | "skilled" | "assisted" | "ccrc" | "rehab" | "longterm";
  description: string;
  trainingDetails: {
    duration: string;
    hours: string;
    preceptor: string;
    startDate: string;
  };
  facilityInfo?: {
    about: string;
    address: string;
    size: string;
  };
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
}

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Administrator in Training - Memory Care",
    company: "Sunrise Senior Living",
    location: "Austin, TX",
    salary: "$48,000 - $55,000",
    highlights: ["Preceptor Provided", "1000-hour program", "Health Benefits", "Career Path"],
    postedDate: "3 days ago",
    facilityType: "Memory Care",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Texas",
    facilityTypeId: "memory",
    description: "Join our comprehensive Administrator in Training program at our state-of-the-art Memory Care facility. This role offers hands-on experience in specialized dementia care while preparing you for leadership in healthcare administration.",
    trainingDetails: {
      duration: "12-month program",
      hours: "1000 hours required",
      preceptor: "Licensed Administrator with 10+ years experience",
      startDate: "Immediate"
    },
    facilityInfo: {
      about: "Sunrise Senior Living is a leading provider of senior care services, specializing in memory care for individuals with Alzheimer's and dementia.",
      address: "2500 S Lamar Blvd, Austin, TX 78704",
      size: "64 residents"
    },
    contact: {
      name: "Sarah Johnson",
      phone: "(512) 555-0123",
      email: "sarah.johnson@sunriseseniorliving.com"
    }
  },
  {
    id: "2",
    title: "Executive Director Trainee",
    company: "Genesis Healthcare",
    location: "Remote + Travel",
    salary: "$50,000 - $60,000",
    highlights: ["Housing Assistance", "Mentorship Program", "Full Benefits", "Immediate Start"],
    postedDate: "1 week ago",
    facilityType: "Multi-site",
    jobType: "edt",
    experienceLevel: "1-2years",
    isRemote: true,
    state: "",
    facilityTypeId: "skilled",
    description: "Accelerate your career with our Executive Director Trainee program, offering exposure to multiple facilities and comprehensive leadership training.",
    trainingDetails: {
      duration: "18-month program",
      hours: "1200 hours required",
      preceptor: "Regional Director mentorship",
      startDate: "Next Monday"
    },
    facilityInfo: {
      about: "Genesis Healthcare is a leading post-acute care provider with facilities nationwide.",
      address: "Multiple locations nationwide",
      size: "Network of 300+ facilities"
    },
    contact: {
      name: "Michael Chen",
      phone: "(800) 555-0234",
      email: "michael.chen@genesishcc.com"
    }
  },
  {
    id: "3",
    title: "AIT Program - Skilled Nursing",
    company: "Life Care Centers",
    location: "Phoenix, AZ",
    salary: "$45,000 - $52,000",
    highlights: ["Immediate Start", "Competitive Pay", "Training Program", "Growth Opportunities"],
    postedDate: "2 days ago",
    facilityType: "Skilled Nursing",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Arizona",
    facilityTypeId: "skilled",
    description: "Develop your leadership skills in our comprehensive AIT program while gaining hands-on experience in skilled nursing operations and patient care coordination.",
    trainingDetails: {
      duration: "15-month program",
      hours: "1100 hours required",
      preceptor: "Certified Administrator with 8+ years experience",
      startDate: "Within 2 weeks"
    },
    facilityInfo: {
      about: "Life Care Centers operates skilled nursing and rehabilitation centers across the Southwest.",
      address: "4250 N 32nd St, Phoenix, AZ 85018",
      size: "120 beds"
    },
    contact: {
      name: "Jennifer Martinez",
      phone: "(602) 555-0345",
      email: "jennifer.martinez@lifecarecenters.com"
    }
  },
  {
    id: "4",
    title: "Healthcare Administrator in Training",
    company: "Brookdale Senior Living",
    location: "Dallas, TX",
    salary: "$47,000 - $54,000",
    highlights: ["Structured Program", "Mentorship", "Benefits Package", "Relocation Assistance"],
    postedDate: "5 days ago",
    facilityType: "Assisted Living",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Texas",
    facilityTypeId: "assisted",
    description: "Launch your healthcare administration career with our structured AIT program in a vibrant assisted living community focused on resident engagement and quality care.",
    trainingDetails: {
      duration: "14-month program",
      hours: "1050 hours required",
      preceptor: "Executive Director with 12+ years experience",
      startDate: "Next month"
    },
    facilityInfo: {
      about: "Brookdale Senior Living is one of the nation's largest operators of senior living communities.",
      address: "6800 Preston Rd, Dallas, TX 75205",
      size: "98 apartments"
    },
    contact: {
      name: "Robert Williams",
      phone: "(214) 555-0456",
      email: "robert.williams@brookdale.com"
    }
  },
  {
    id: "5",
    title: "Administrator in Training - CCRC",
    company: "Atria Senior Living",
    location: "Miami, FL",
    salary: "$52,000 - $58,000",
    highlights: ["CCRC Experience", "Leadership Development", "Premium Benefits", "Career Growth"],
    postedDate: "1 week ago",
    facilityType: "CCRC",
    jobType: "ait",
    experienceLevel: "1-2years",
    isRemote: false,
    state: "Florida",
    facilityTypeId: "ccrc",
    description: "Gain comprehensive experience across all levels of care in our premier Continuing Care Retirement Community while developing advanced leadership capabilities.",
    trainingDetails: {
      duration: "16-month program",
      hours: "1200 hours required",
      preceptor: "Campus Executive Director with 15+ years experience",
      startDate: "Flexible"
    },
    facilityInfo: {
      about: "Atria Senior Living operates luxury senior living communities with a focus on vibrant lifestyle programming.",
      address: "1250 Biscayne Blvd, Miami, FL 33132",
      size: "250 units across all care levels"
    },
    contact: {
      name: "Maria Rodriguez",
      phone: "(305) 555-0567",
      email: "maria.rodriguez@atriaseniorliving.com"
    }
  },
  {
    id: "6",
    title: "AIT - Long Term Care",
    company: "Kindred Healthcare",
    location: "Chicago, IL",
    salary: "$46,000 - $53,000",
    highlights: ["Preceptor Support", "NAB Prep", "Health Insurance", "PTO"],
    postedDate: "4 days ago",
    facilityType: "Long Term Care",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Illinois",
    facilityTypeId: "longterm",
    description: "Build expertise in long-term care administration while receiving comprehensive support for NAB exam preparation and professional development.",
    trainingDetails: {
      duration: "13-month program",
      hours: "1000 hours required",
      preceptor: "Licensed Administrator with specialized LTC experience",
      startDate: "Immediate"
    },
    facilityInfo: {
      about: "Kindred Healthcare specializes in long-term acute care and post-acute services.",
      address: "1500 W Madison St, Chicago, IL 60607",
      size: "180 beds"
    },
    contact: {
      name: "David Thompson",
      phone: "(312) 555-0678",
      email: "david.thompson@kindredhealthcare.com"
    }
  },
  {
    id: "7",
    title: "Executive Director in Training",
    company: "HCR ManorCare",
    location: "Denver, CO",
    salary: "$49,000 - $56,000",
    highlights: ["Leadership Track", "Comprehensive Training", "Bonus Eligible", "401k Match"],
    postedDate: "6 days ago",
    facilityType: "Skilled Nursing",
    jobType: "edt",
    experienceLevel: "1-2years",
    isRemote: false,
    state: "Colorado",
    facilityTypeId: "skilled",
    description: "Fast-track your career progression through our Executive Director Training program with emphasis on operational excellence and team leadership.",
    trainingDetails: {
      duration: "18-month program",
      hours: "1300 hours required",
      preceptor: "Regional Operations Director",
      startDate: "End of month"
    },
    facilityInfo: {
      about: "HCR ManorCare provides skilled nursing, rehabilitation, and assisted living services.",
      address: "2900 S Colorado Blvd, Denver, CO 80222",
      size: "156 beds"
    },
    contact: {
      name: "Lisa Anderson",
      phone: "(303) 555-0789",
      email: "lisa.anderson@hcr-manorcare.com"
    }
  },
  {
    id: "8",
    title: "Administrator in Training Position",
    company: "Ensign Services",
    location: "San Antonio, TX",
    salary: "$45,000 - $51,000",
    highlights: ["Fast Track Program", "Mentorship", "Growth Potential", "Flexible Schedule"],
    postedDate: "1 week ago",
    facilityType: "Post-Acute Care",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Texas",
    facilityTypeId: "rehab",
    description: "Join our dynamic team in post-acute care and rehabilitation services while developing comprehensive healthcare administration skills.",
    trainingDetails: {
      duration: "12-month program",
      hours: "1000 hours required",
      preceptor: "Administrator with post-acute specialty",
      startDate: "Immediate"
    },
    facilityInfo: {
      about: "Ensign Services operates skilled nursing and rehabilitation facilities across Texas.",
      address: "15500 San Pedro Ave, San Antonio, TX 78232",
      size: "140 beds"
    },
    contact: {
      name: "Carlos Hernandez",
      phone: "(210) 555-0890",
      email: "carlos.hernandez@ensignservices.net"
    }
  },
  {
    id: "9",
    title: "Memory Care AIT Program",
    company: "Brightview Senior Living",
    location: "Atlanta, GA",
    salary: "$49,000 - $55,000",
    highlights: ["Specialized Training", "Memory Care Focus", "Comprehensive Benefits", "Professional Development"],
    postedDate: "2 days ago",
    facilityType: "Memory Care",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Georgia",
    facilityTypeId: "memory",
    description: "Specialize in memory care administration through our focused AIT program, gaining expertise in dementia care, family engagement, and specialized programming.",
    trainingDetails: {
      duration: "14-month program",
      hours: "1100 hours required",
      preceptor: "Memory Care Specialist Administrator",
      startDate: "Within 3 weeks"
    },
    facilityInfo: {
      about: "Brightview Senior Living specializes in vibrant senior living with dedicated memory care neighborhoods.",
      address: "3400 Peachtree Rd NE, Atlanta, GA 30326",
      size: "48 memory care residents"
    },
    contact: {
      name: "Amanda Foster",
      phone: "(404) 555-0123",
      email: "amanda.foster@brightviewseniorliving.com"
    }
  },
  {
    id: "10",
    title: "AIT - Rehabilitation Hospital",
    company: "Select Medical",
    location: "Pittsburgh, PA",
    salary: "$47,000 - $54,000",
    highlights: ["Hospital Setting", "Acute Rehab", "Clinical Exposure", "Leadership Development"],
    postedDate: "5 days ago",
    facilityType: "Rehabilitation Hospital",
    jobType: "ait",
    experienceLevel: "1-2years",
    isRemote: false,
    state: "Pennsylvania",
    facilityTypeId: "rehab",
    description: "Gain unique experience in inpatient rehabilitation hospital administration, working closely with interdisciplinary teams and complex medical cases.",
    trainingDetails: {
      duration: "15-month program",
      hours: "1150 hours required",
      preceptor: "Hospital Administrator with acute care background",
      startDate: "Next quarter"
    },
    facilityInfo: {
      about: "Select Medical operates specialized rehabilitation hospitals nationwide.",
      address: "2400 Ardmore Blvd, Pittsburgh, PA 15221",
      size: "96 beds"
    },
    contact: {
      name: "Dr. Patricia Lee",
      phone: "(412) 555-0234",
      email: "patricia.lee@selectmedical.com"
    }
  },
  {
    id: "11",
    title: "Senior Living AIT",
    company: "Assisted Living Concepts",
    location: "Nashville, TN",
    salary: "$46,000 - $52,000",
    highlights: ["Music City Location", "Assisted Living Focus", "Team Environment", "Growth Track"],
    postedDate: "3 days ago",
    facilityType: "Assisted Living",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Tennessee",
    facilityTypeId: "assisted",
    description: "Develop your administrative skills in a welcoming assisted living environment that emphasizes resident independence and community engagement.",
    trainingDetails: {
      duration: "13-month program",
      hours: "1050 hours required",
      preceptor: "Executive Director with 10+ years in assisted living",
      startDate: "Immediate"
    },
    facilityInfo: {
      about: "Assisted Living Concepts focuses on creating home-like environments for seniors.",
      address: "1800 West End Ave, Nashville, TN 37203",
      size: "85 apartments"
    },
    contact: {
      name: "Jessica Walker",
      phone: "(615) 555-0345",
      email: "jessica.walker@alcco.com"
    }
  },
  {
    id: "12",
    title: "Healthcare Administration Trainee",
    company: "Covenant Care",
    location: "Salt Lake City, UT",
    salary: "$44,000 - $50,000",
    highlights: ["Mountain West", "Faith-Based Care", "Comprehensive Training", "Supportive Culture"],
    postedDate: "1 week ago",
    facilityType: "Skilled Nursing",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Utah",
    facilityTypeId: "skilled",
    description: "Join our mission-driven organization providing skilled nursing care with emphasis on compassionate service and family-centered care approaches.",
    trainingDetails: {
      duration: "12-month program",
      hours: "1000 hours required",
      preceptor: "Administrator with faith-based care experience",
      startDate: "Next month"
    },
    facilityInfo: {
      about: "Covenant Care provides skilled nursing and rehabilitation with a focus on spiritual care.",
      address: "1100 E 3300 S, Salt Lake City, UT 84106",
      size: "128 beds"
    },
    contact: {
      name: "Mark Stevens",
      phone: "(801) 555-0456",
      email: "mark.stevens@covenantcare.com"
    }
  },
  {
    id: "13",
    title: "Executive Director Track",
    company: "Senior Lifestyle Corporation",
    location: "Milwaukee, WI",
    salary: "$51,000 - $58,000",
    highlights: ["Executive Track", "Multiple Communities", "Leadership Focus", "Bonus Structure"],
    postedDate: "4 days ago",
    facilityType: "Senior Living",
    jobType: "edt",
    experienceLevel: "1-2years",
    isRemote: false,
    state: "Wisconsin",
    facilityTypeId: "assisted",
    description: "Accelerate your path to executive leadership through rotational assignments across our portfolio of premier senior living communities.",
    trainingDetails: {
      duration: "20-month program",
      hours: "1400 hours required",
      preceptor: "Regional Vice President",
      startDate: "Quarterly start dates"
    },
    facilityInfo: {
      about: "Senior Lifestyle Corporation operates upscale senior living communities in the Midwest.",
      address: "8900 W North Ave, Milwaukee, WI 53226",
      size: "165 apartments"
    },
    contact: {
      name: "Sarah Mitchell",
      phone: "(414) 555-0567",
      email: "sarah.mitchell@seniorlifestyle.com"
    }
  },
  {
    id: "14",
    title: "AIT - Independent Living Focus",
    company: "Del Webb Communities",
    location: "Las Vegas, NV",
    salary: "$48,000 - $54,000",
    highlights: ["Active Adult", "Resort-Style", "Lifestyle Programming", "Nevada License"],
    postedDate: "6 days ago",
    facilityType: "Independent Living",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Nevada",
    facilityTypeId: "assisted",
    description: "Learn administration in an active adult community setting with focus on lifestyle programming, amenities management, and resident engagement.",
    trainingDetails: {
      duration: "14-month program",
      hours: "1100 hours required",
      preceptor: "Community Manager with active adult expertise",
      startDate: "Flexible"
    },
    facilityInfo: {
      about: "Del Webb creates active adult communities with resort-style amenities and programming.",
      address: "9750 Peace Way, Las Vegas, NV 89147",
      size: "485 homes"
    },
    contact: {
      name: "Linda Garcia",
      phone: "(702) 555-0678",
      email: "linda.garcia@delwebb.com"
    }
  },
  {
    id: "15",
    title: "Rural Healthcare AIT",
    company: "Prairie Health Systems",
    location: "Omaha, NE",
    salary: "$43,000 - $49,000",
    highlights: ["Rural Experience", "Close-Knit Team", "Community Impact", "Broad Exposure"],
    postedDate: "3 days ago",
    facilityType: "Critical Access",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Nebraska",
    facilityTypeId: "skilled",
    description: "Gain unique experience in rural healthcare administration, working in a critical access facility serving the surrounding agricultural community.",
    trainingDetails: {
      duration: "12-month program",
      hours: "1000 hours required",
      preceptor: "Administrator with rural healthcare background",
      startDate: "Immediate"
    },
    facilityInfo: {
      about: "Prairie Health Systems serves rural communities across Nebraska with comprehensive care.",
      address: "4950 Dodge St, Omaha, NE 68132",
      size: "25 beds"
    },
    contact: {
      name: "Thomas Johnson",
      phone: "(402) 555-0789",
      email: "thomas.johnson@prairiehealthne.com"
    }
  },
  {
    id: "16",
    title: "Transitional Care AIT",
    company: "Encompass Health",
    location: "Birmingham, AL",
    salary: "$45,000 - $52,000",
    highlights: ["Transitional Care", "Clinical Integration", "Outcome Focus", "Technology Forward"],
    postedDate: "2 days ago",
    facilityType: "Transitional Care",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Alabama",
    facilityTypeId: "rehab",
    description: "Specialize in transitional care unit administration, focusing on patient outcomes, discharge planning, and interdisciplinary care coordination.",
    trainingDetails: {
      duration: "13-month program",
      hours: "1050 hours required",
      preceptor: "TCU Administrator with clinical background",
      startDate: "Within 2 weeks"
    },
    facilityInfo: {
      about: "Encompass Health operates transitional care units focused on successful community discharge.",
      address: "3201 4th Ave S, Birmingham, AL 35222",
      size: "40 transitional care beds"
    },
    contact: {
      name: "Dr. Michelle Brown",
      phone: "(205) 555-0890",
      email: "michelle.brown@encompasshealth.com"
    }
  },
  {
    id: "17",
    title: "Behavioral Health AIT",
    company: "Acadia Healthcare",
    location: "Portland, OR",
    salary: "$47,000 - $53,000",
    highlights: ["Behavioral Health", "Specialized Care", "Interdisciplinary Team", "Mental Health Focus"],
    postedDate: "5 days ago",
    facilityType: "Behavioral Health",
    jobType: "ait",
    experienceLevel: "1-2years",
    isRemote: false,
    state: "Oregon",
    facilityTypeId: "skilled",
    description: "Develop expertise in behavioral health administration, working with specialized populations and interdisciplinary treatment teams.",
    trainingDetails: {
      duration: "15-month program",
      hours: "1150 hours required",
      preceptor: "Administrator with behavioral health specialty",
      startDate: "Next quarter"
    },
    facilityInfo: {
      about: "Acadia Healthcare provides behavioral health services for seniors with specialized needs.",
      address: "1040 NW 22nd Ave, Portland, OR 97210",
      size: "60 behavioral health beds"
    },
    contact: {
      name: "Dr. Kevin Wong",
      phone: "(503) 555-0123",
      email: "kevin.wong@acadiahealthcare.com"
    }
  },
  {
    id: "18",
    title: "Pediatric Long-Term Care AIT",
    company: "Specialized Care Partners",
    location: "Boston, MA",
    salary: "$50,000 - $56,000",
    highlights: ["Pediatric Focus", "Specialized Population", "Family-Centered Care", "Unique Experience"],
    postedDate: "1 week ago",
    facilityType: "Pediatric LTC",
    jobType: "ait",
    experienceLevel: "1-2years",
    isRemote: false,
    state: "Massachusetts",
    facilityTypeId: "longterm",
    description: "Gain specialized experience in pediatric long-term care administration, working with medically complex children and their families.",
    trainingDetails: {
      duration: "16-month program",
      hours: "1200 hours required",
      preceptor: "Administrator with pediatric LTC expertise",
      startDate: "Flexible"
    },
    facilityInfo: {
      about: "Specialized Care Partners provides long-term care for medically complex children.",
      address: "300 Longwood Ave, Boston, MA 02115",
      size: "32 pediatric beds"
    },
    contact: {
      name: "Dr. Rachel Green",
      phone: "(617) 555-0234",
      email: "rachel.green@specializedcarepartners.com"
    }
  },
  {
    id: "19",
    title: "Hospice Administration AIT",
    company: "Compassus",
    location: "Richmond, VA",
    salary: "$46,000 - $52,000",
    highlights: ["Hospice Care", "End-of-Life Focus", "Compassionate Care", "Community Outreach"],
    postedDate: "4 days ago",
    facilityType: "Hospice",
    jobType: "ait",
    experienceLevel: "entry",
    isRemote: false,
    state: "Virginia",
    facilityTypeId: "skilled",
    description: "Learn hospice administration with focus on end-of-life care, family support, and interdisciplinary team coordination in home and facility settings.",
    trainingDetails: {
      duration: "14-month program",
      hours: "1100 hours required",
      preceptor: "Administrator with hospice certification",
      startDate: "Next month"
    },
    facilityInfo: {
      about: "Compassus provides hospice and palliative care services across Virginia.",
      address: "1001 E Cary St, Richmond, VA 23219",
      size: "16-bed inpatient unit + home services"
    },
    contact: {
      name: "Mary Elizabeth Davis",
      phone: "(804) 555-0345",
      email: "mary.davis@compassus.com"
    }
  },
  {
    id: "20",
    title: "Corporate AIT Program",
    company: "Brookdale Senior Living",
    location: "Brentwood, TN",
    salary: "$52,000 - $59,000",
    highlights: ["Corporate Track", "Multi-Site Exposure", "Executive Development", "Rotation Program"],
    postedDate: "2 days ago",
    facilityType: "Corporate",
    jobType: "ait",
    experienceLevel: "1-2years",
    isRemote: false,
    state: "Tennessee",
    facilityTypeId: "assisted",
    description: "Fast-track corporate development program with rotations across multiple facility types, preparing you for regional and corporate leadership roles.",
    trainingDetails: {
      duration: "24-month program",
      hours: "1500 hours required",
      preceptor: "Regional Director and Corporate Executives",
      startDate: "Annual cohort - January start"
    },
    facilityInfo: {
      about: "Brookdale Senior Living corporate headquarters with oversight of 700+ communities nationwide.",
      address: "111 Westwood Pl, Brentwood, TN 37027",
      size: "Corporate program - multiple sites"
    },
    contact: {
      name: "James Patterson",
      phone: "(615) 555-0456",
      email: "james.patterson@brookdale.com"
    }
  }
];