import { useEffect, useRef } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Users, 
  Target, 
  Heart, 
  MapPin, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Quote,
  Linkedin,
  Mail,
  Shield,
  Globe,
  Building
} from "lucide-react";

interface AboutPageProps {
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
  onLogout?: () => void;
}

export function AboutPage({ onNavigate, isLoggedIn, currentUser, onLogout }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigate={onNavigate} 
        currentPage="about" 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main>
        {/* Hero Section - With Fixed Background Parallax */}
        <section className="relative min-h-[600px] sm:min-h-[500px] sm:h-[70vh] flex items-center justify-center overflow-hidden py-16 sm:py-0">
          {/* Fixed Background Image */}
          <div 
            className="absolute inset-0 parallax-bg"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1735448213704-fe52284f2017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFsdGhjYXJlJTIwYXJjaGl0ZWN0dXJlJTIwaW50ZXJpb3IlMjBtaW5pbWFsfGVufDF8fHx8MTc1ODk3MzI4M3ww&ixlib=rb-4.1.0&q=80&w=1080)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
            <Badge variant="outline" className="mb-8 border-white/30 text-white bg-white/10 backdrop-blur-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Our Story
            </Badge>
            <h1 className="text-6xl lg:text-7xl mb-8 tracking-tight">
              About{" "}
              <span style={{ color: 'var(--brand-secondary)' }}>
                FindMyAIT
              </span>
            </h1>
            <p className="text-2xl lg:text-3xl mb-4 font-light leading-relaxed text-white/90">
              Born out of frustration with a broken system
            </p>
            <p className="text-xl mb-12 font-light text-white/80 max-w-2xl mx-auto">
              The bridge between where you are and where you want to be
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={() => {
                  const storySection = document.getElementById('our-story');
                  if (storySection) {
                    storySection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                size="lg"
                className="bg-brand-secondary hover:bg-brand-secondary-hover text-neutral-900 px-10 py-4 text-lg"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => onNavigate?.('contact')}
                size="lg"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-neutral-900 px-10 py-4 text-lg backdrop-blur-sm"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Our Story Section - Full Width */}
        <section id="our-story" className="py-32 px-[0px] py-[68px]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl text-neutral-900 mb-8 tracking-tight">Our Story</h2>
              <div className="w-24 h-1 bg-brand-secondary mx-auto rounded-full"></div>
            </div>

            <div className="prose prose-xl max-w-none text-center">
              <p className="text-2xl text-neutral-600 leading-relaxed mb-16">
                FindMyAIT was born out of frustration—the kind that comes from watching talented people struggle through a broken system.
              </p>
            </div>

            {/* Problem */}
            <div className="space-y-8 mb-16">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="text-3xl text-neutral-900">The Problem</h3>
              </div>
              
              <div className="space-y-6 text-lg text-neutral-600 leading-relaxed text-center max-w-3xl mx-auto">
                <p>
                  For too long, the path to becoming a nursing home administrator has been scattered, outdated, and unnecessarily difficult.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <p className="text-red-700">Digging through generic job boards with little success</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <p className="text-red-700">Cold-calling facilities without proper connections</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <p className="text-red-700">Relying on luck or personal networks just to find opportunities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="space-y-8">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-3 h-3 bg-brand-secondary rounded-full"></div>
                <h3 className="text-3xl text-neutral-900">The Solution</h3>
              </div>
              
              <div className="space-y-6 text-lg text-neutral-600 leading-relaxed text-center max-w-3xl mx-auto">
                <p className="text-xl mb-8">
                  We knew there had to be a better way.
                </p>
                
                <div className="bg-neutral-50 rounded-xl p-8">
                  <p className="text-neutral-700 italic text-lg">
                    This platform has been years in the making—built from real-world experience, countless late-night conversations with industry professionals, and a shared conviction that the next generation of healthcare leaders deserves better.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section - With Fixed Background Parallax */}
        <section className="relative py-16 sm:py-32 overflow-hidden">
          {/* Fixed Background Image */}
          <div 
            className="absolute inset-0 parallax-bg"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1589982952995-d898387c3314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMHN1bnNldCUyMG1pbmltYWwlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc1ODk3NDA1OHww&ixlib=rb-4.1.0&q=80&w=1080)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-white/85"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl lg:text-6xl text-neutral-900 mb-16 tracking-tight">Our Mission</h2>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-neutral-200">
              <Quote className="h-8 w-8 text-brand-primary mx-auto mb-8" />
              <blockquote className="text-xl md:text-3xl text-neutral-800 leading-relaxed mb-8 italic">
                "To streamline the journey into healthcare leadership by connecting aspiring administrators with AIT opportunities, licensure resources, qualified preceptors, and the tools they need to succeed from day one."
              </blockquote>
              <div className="w-16 h-1 bg-brand-secondary mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-neutral-600">
                We're not just another job board. We're the bridge between where you are and where you want to be.
              </p>
            </div>
          </div>
        </section>

        {/* Why This Matters Section - Simplified */}
        <section className="py-32 px-[0px] py-[68px]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl text-neutral-900 mb-8 tracking-tight">Why This Matters</h2>
              <div className="w-24 h-1 bg-brand-secondary mx-auto rounded-full"></div>
            </div>

            <div className="space-y-12">
              <div className="text-center">
                <p className="text-2xl text-neutral-700 leading-relaxed mb-8">
                  The future of long-term care depends on strong, prepared leaders. Yet the current system creates unnecessary barriers that keep good people out and leave facilities struggling to build their leadership pipeline.
                </p>
                
                <p className="text-xl text-neutral-600 leading-relaxed">
                  We believe that passionate, qualified candidates shouldn't have to fight through gatekeeping and guesswork to serve communities that need them. Every day we delay fixing this system is another day that residents, families, and healthcare workers suffer the consequences of leadership shortages.
                </p>
              </div>

              <div className="text-center pt-8">
                <p className="text-3xl font-medium bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                  The time for half-measures is over.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We're Building Section - Grid */}
        <section className="py-32 bg-neutral-50 px-[0px] py-[68px]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl text-neutral-900 mb-8 tracking-tight">What We're Building</h2>
              <div className="w-24 h-1 bg-brand-secondary mx-auto rounded-full mb-8"></div>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                A comprehensive platform designed by industry experts for aspiring healthcare leaders
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Real-Time Opportunities",
                  description: "Live AIT job postings across all 50 states, updated daily and verified by our team."
                },
                {
                  icon: Globe,
                  title: "State-by-State Guidance",
                  description: "Interactive maps showing licensure requirements, preceptor regulations, and key contacts."
                },
                {
                  icon: BookOpen,
                  title: "NAB Exam Preparation",
                  description: "Embedded practice quizzes and study resources to help you pass with confidence."
                },
                {
                  icon: Users,
                  title: "Beyond-the-Resume Profiles",
                  description: "Custom formats that showcase your potential, not just your past."
                },
                {
                  icon: Award,
                  title: "Expert Resources",
                  description: "Resume reviews, guidance documents, and curated advice from successful administrators."
                },
                {
                  icon: Shield,
                  title: "Smart Matching",
                  description: "AI-powered recommendations that connect you with the most relevant opportunities."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                  <feature.icon className="h-8 w-8 text-brand-primary mb-6" />
                  <h3 className="text-xl text-neutral-900 mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team Section - Elegant */}
        <section className="py-32 px-[0px] py-[68px]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl text-neutral-900 mb-8 tracking-tight">Who We Are</h2>
              <div className="w-24 h-1 bg-brand-secondary mx-auto rounded-full mb-8"></div>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                We're operators, not outsiders. We've led teams, managed budgets, navigated state surveys, and felt the weight of responsibility that comes with caring for vulnerable populations.
              </p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-neutral-100">
              <div className="grid lg:grid-cols-2">
                <div className="relative h-96 lg:h-auto">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1589810689909-e88fc917771d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBibGFjayUyMGJ1c2luZXNzbWFuJTIwZXhlY3V0aXZlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4OTc0MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Nigel Williams - Co-Founder & COO"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-12">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl text-neutral-900 mb-2">Nigel Williams</h3>
                      <p className="text-xl text-brand-primary mb-6">Co-Founder & COO</p>
                      
                      <div className="flex gap-3 mb-8">
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                          Licensed Administrator
                        </Badge>
                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                          Multi-State
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-6 text-neutral-700">
                      <p className="text-lg leading-relaxed">
                        The calls for help weren't just frequent — they were familiar. Throughout his career in long-term care leadership, Nigel Williams kept hearing the same thing from aspiring administrators.
                      </p>
                      
                      <div className="bg-neutral-50 rounded-lg p-6">
                        <p className="italic text-neutral-600">
                          "I can't find a preceptor." "No one is calling me back." "I've done everything right, and I still don't know where to start."
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-sm">
                      <div>
                        <h4 className="text-neutral-900 mb-3 flex items-center">
                          <Building className="h-4 w-4 mr-2 text-brand-primary" />
                          Experience
                        </h4>
                        <ul className="space-y-2 text-neutral-600">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            Multi-state healthcare leadership
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            State healthcare association chair
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-neutral-900 mb-3 flex items-center">
                          <Award className="h-4 w-4 mr-2 text-brand-primary" />
                          Education
                        </h4>
                        <ul className="space-y-2 text-neutral-600">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            BS Gerontology - UAPB
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            MHA - University of North Texas
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg p-6">
                      <Quote className="h-5 w-5 text-brand-primary mb-3" />
                      <p className="text-brand-primary italic">
                        "A dedicated healthcare advocate, focused on equity, access, and building a stronger path for the next generation of administrators."
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Linkedin className="h-4 w-4" />
                        Connect
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Elegant */}
        <section className="py-32 bg-gradient-to-br from-brand-primary to-blue-900 px-[0px] py-[68px]">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-5xl lg:text-6xl mb-16 tracking-tight">Our Commitment</h2>
            
            <div className="grid md:grid-cols-3 gap-12 mb-16">
              {[
                {
                  icon: Heart,
                  title: "To Candidates",
                  description: "Connecting motivated candidates with meaningful AIT opportunities through our specialized platform designed for healthcare leadership development."
                },
                {
                  icon: Target,
                  title: "To the Industry",
                  description: "Fixing the broken systems that have hindered healthcare leadership development and creating sustainable pathways for growth."
                },
                {
                  icon: Users,
                  title: "To the Future",
                  description: "Building tomorrow's healthcare leaders today through comprehensive resources, guidance, and professional networking opportunities."
                }
              ].map((commitment, index) => (
                <div key={index} className="space-y-6">
                  <commitment.icon className="h-12 w-12 text-brand-secondary mx-auto" />
                  <h3 className="text-xl">{commitment.title}</h3>
                  <p className="text-white/80 leading-relaxed">{commitment.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <p className="text-2xl leading-relaxed text-white/90 max-w-2xl mx-auto">
                Ready to start your journey? The residents of tomorrow are counting on the leaders we help develop today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  onClick={() => onNavigate?.('jobs')} 
                  size="lg"
                  className="bg-brand-secondary hover:bg-brand-secondary-hover text-neutral-900 px-10 py-4 text-lg"
                >
                  Find AIT Opportunities
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                <Button 
                  onClick={() => onNavigate?.('resources')} 
                  size="lg"
                  className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-neutral-900 px-10 py-4 text-lg"
                >
                  Explore Resources
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}