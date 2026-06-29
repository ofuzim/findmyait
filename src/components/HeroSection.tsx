import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle, ArrowRight, Users, TrendingUp, Shield, Briefcase } from "lucide-react";

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="bg-white py-20 lg:py-28 pt-[80px] pr-[0px] pb-[60px] pl-[0px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mx-[8px] my-[0px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content (second on mobile, first on desktop) */}
          <div className="max-w-2xl order-2 lg:order-1">
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-8">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Trusted by Healthcare Professionals</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl text-neutral-900 mb-8 font-bold leading-tight">
              Welcome to <span 
                className="bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--brand-primary), var(--brand-accent))`
                }}
              >FindMyAIT</span>
            </h1>
            
            <h2 className="text-2xl lg:text-3xl text-neutral-700 mb-8 font-medium leading-relaxed">
              Streamline your journey into healthcare leadership
            </h2>
            
            <div 
              className="p-6 rounded-2xl mb-8"
              style={{
                background: `linear-gradient(to right, 
                  color-mix(in srgb, var(--brand-secondary) 8%, white), 
                  color-mix(in srgb, var(--brand-primary) 8%, white)
                )`
              }}
            >
              <p className="text-xl text-neutral-800 font-medium italic">
                "The bridge between where you are and where you want to be"
              </p>
            </div>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-start">
                <CheckCircle 
                  className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" 
                  style={{ color: 'var(--brand-secondary)' }}
                />
                <p className="text-neutral-600 text-lg">
                  Comprehensive platform with real-time AIT opportunities nationwide
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle 
                  className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" 
                  style={{ color: 'var(--brand-secondary)' }}
                />
                <p className="text-neutral-600 text-lg">
                  State-specific guidance and professional development tools
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle 
                  className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" 
                  style={{ color: 'var(--brand-secondary)' }}
                />
                <p className="text-neutral-600 text-lg">
                  Built by operators who understand the healthcare industry
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => onNavigate?.('signup')}
                className="font-semibold px-8 py-4 text-base rounded-xl transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 group"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                }}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                onClick={() => onNavigate?.('about')}
                className="border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold px-8 py-4 text-base rounded-xl transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-neutral-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>1000+ professionals</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>95% success rate</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Image (first on mobile, second on desktop) */}
          <div className="relative lg:pl-8 order-1 lg:order-2 mx-2 lg:mx-0">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-3xl transform rotate-3"
                style={{
                  background: `linear-gradient(135deg, 
                    color-mix(in srgb, var(--brand-primary) 15%, white), 
                    color-mix(in srgb, var(--brand-secondary) 15%, white)
                  )`
                }}
              ></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1643061754933-82a75ce41f1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFscyUyMHRlYW0lMjBkaXZlcnNlfGVufDF8fHx8MTc1ODkyNDYxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Diverse team of healthcare professionals working together"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-neutral-100">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--brand-primary) 10%, white)'
                  }}
                >
                  <Briefcase 
                    className="h-6 w-6" 
                    style={{ color: 'var(--brand-primary)' }}
                  />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Active Jobs</p>
                  <p className="text-xl font-semibold text-neutral-900">247</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-neutral-100">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--brand-secondary) 10%, white)'
                  }}
                >
                  <TrendingUp 
                    className="h-6 w-6" 
                    style={{ color: 'var(--brand-secondary)' }}
                  />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Success Rate</p>
                  <p className="text-xl font-semibold text-neutral-900">95%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}