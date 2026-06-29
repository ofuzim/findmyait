import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  BookOpen, 
  MapPin, 
  User, 
  Briefcase, 
  ArrowRight,
  Target,
  GraduationCap,
  FileText,
  CheckCircle,
  Award,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";

interface ValuePreviewSectionProps {
  onNavigate?: (page: string) => void;
}

export function ValuePreviewSection({ onNavigate }: ValuePreviewSectionProps) {

  return (
    <section className="bg-gradient-to-br from-neutral-50 to-blue-50 py-20 pt-[80px] pr-[0px] pb-[30px] pl-[0px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">NAB Exam Preparation</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl text-neutral-900 mb-4 font-semibold">
            Master Your Knowledge
          </h1>
          
          <h2 className="text-2xl lg:text-3xl text-neutral-700 mb-6">
            Comprehensive Learning Resources
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto text-[18px]">
            Prepare for NAB exam success with our comprehensive study materials, practice questions, and expert guidance.
          </p>
        </div>

        {/* Learning Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-[30px] mt-[0px] mr-[0px] ml-[0px]">
          {/* Practice Questions Card */}
          <Card className="p-8 bg-white border-0 rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Desktop layout: side-by-side */}
            <div className="hidden lg:flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 15%, white)' }}>
                <BookOpen className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  2,000+ Practice Questions
                </h3>
                <p className="text-neutral-600">
                  Real exam-style questions covering all domains of healthcare administration
                </p>
              </div>
            </div>
            
            {/* Mobile layout: icon above title, both left-aligned */}
            <div className="lg:hidden mb-6">
              <div className="flex justify-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{ backgroundColor: 'color-mix(in srgb, var(--brand-primary) 15%, white)' }}>
                  <BookOpen className="h-6 w-6" style={{ color: 'var(--brand-primary)' }} />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  2,000+ Practice Questions
                </h3>
                <p className="text-neutral-600">
                  Real exam-style questions covering all domains of healthcare administration
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-neutral-700">
                <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span>Domain-specific question categories</span>
              </div>
              <div className="flex items-center text-neutral-700">
                <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span>Detailed explanations for each answer</span>
              </div>
              <div className="flex items-center text-neutral-700">
                <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span>Progress tracking and performance analytics</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onNavigate?.('quiz')}
              className="mt-auto text-white font-medium px-6 py-3 rounded-xl group w-full"
              style={{
                backgroundColor: 'var(--brand-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
              }}
            >
              Start Practice Session
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Study Materials Card */}
          <Card className="p-8 bg-white border-0 rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Desktop layout: side-by-side */}
            <div className="hidden lg:flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ backgroundColor: 'color-mix(in srgb, var(--brand-secondary) 15%, white)' }}>
                <FileText className="h-6 w-6" style={{ color: 'var(--brand-secondary)' }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Comprehensive Study Guides
                </h3>
                <p className="text-neutral-600">
                  In-depth materials covering all NAB exam domains and topics
                </p>
              </div>
            </div>
            
            {/* Mobile layout: icon above title, both left-aligned */}
            <div className="lg:hidden mb-6">
              <div className="flex justify-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{ backgroundColor: 'color-mix(in srgb, var(--brand-secondary) 15%, white)' }}>
                  <FileText className="h-6 w-6" style={{ color: 'var(--brand-secondary)' }} />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Comprehensive Study Guides
                </h3>
                <p className="text-neutral-600">
                  In-depth materials covering all NAB exam domains and topics
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-neutral-700">
                <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span>Regulatory compliance guides</span>
              </div>
              <div className="flex items-center text-neutral-700">
                <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span>Financial management resources</span>
              </div>
              <div className="flex items-center text-neutral-700">
                <CheckCircle className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span>Leadership and staff development</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onNavigate?.('resources')}
              className="mt-auto text-white font-medium px-6 py-3 rounded-xl group w-full"
              style={{
                backgroundColor: 'var(--brand-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-secondary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-secondary)';
              }}
            >
              Access Study Materials
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>

        {/* Secondary Features - Always show */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {/* State-by-State Guidance */}
            <Card className="p-6 bg-white hover:shadow-lg transition-all duration-200 border-0 rounded-2xl group cursor-pointer">
              <div className="text-center">
                <div className="hidden md:flex w-16 h-16 rounded-2xl items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-all"
                     style={{ backgroundColor: '#e8eef9' }}>
                  <MapPin className="h-8 w-8" style={{ color: '#5a6bb3' }} />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  State-by-State Guidance
                </h3>
                <p className="text-neutral-600 mb-4">
                  Know your state's AIT requirements, licensing, and specific regulations.
                </p>
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate?.('resources')}
                  className="group-hover:bg-opacity-10"
                  style={{ 
                    color: '#5a6bb3',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f2f8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Explore Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Professional Profiles */}
            <Card className="p-6 bg-white hover:shadow-lg transition-all duration-200 border-0 rounded-2xl group cursor-pointer">
              <div className="text-center">
                <div className="hidden md:flex w-16 h-16 rounded-2xl items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-all"
                     style={{ backgroundColor: 'color-mix(in srgb, var(--brand-accent) 15%, white)' }}>
                  <User className="h-8 w-8" style={{ color: 'var(--brand-accent)' }} />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Professional Profiles
                </h3>
                <p className="text-neutral-600 mb-4">
                  Stand out beyond your resume with comprehensive professional profiles.
                </p>
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate?.('signup')}
                  className="group-hover:bg-opacity-10"
                  style={{ 
                    color: 'var(--brand-accent)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--brand-accent) 8%, white)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Create Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Verified Opportunities */}
            <Card className="p-6 bg-white hover:shadow-lg transition-all duration-200 border-0 rounded-2xl group cursor-pointer">
              <div className="text-center">
                <div className="hidden md:flex w-16 h-16 rounded-2xl items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-all"
                     style={{ backgroundColor: '#e6f7f5' }}>
                  <Briefcase className="h-8 w-8" style={{ color: '#0f5b52' }} />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Verified Opportunities
                </h3>
                <p className="text-neutral-600 mb-4">
                  Real-time AIT job postings from verified healthcare facilities nationwide.
                </p>
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate?.('jobs')}
                  className="group-hover:bg-opacity-10"
                  style={{ 
                    color: '#0f5b52',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e6f7f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Browse Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>


      </div>
    </section>
  );
}