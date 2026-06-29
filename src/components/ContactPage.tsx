import { Header } from "./Header";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  MessageCircle,
  Building,
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

interface ContactPageProps {
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
  onLogout?: () => void;
}

export function ContactPage({ onNavigate, isLoggedIn, currentUser, onLogout }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'candidate'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        userType: 'candidate'
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigate={onNavigate} 
        currentPage="contact" 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main>
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-blue-900"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
            <Badge variant="outline" className="mb-8 border-white/30 text-white bg-white/10 backdrop-blur-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Get In Touch
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl mb-8 tracking-tight">
              Contact{" "}
              <span style={{ color: 'var(--brand-secondary)' }}>
                FindMyAIT
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-4 font-light leading-relaxed text-white/90">
              Ready to take the next step in your healthcare leadership journey?
            </p>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              We're here to help connect you with the right opportunities and provide the guidance you need to succeed.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-32 px-[0px] py-[68px]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-16 lg:items-start">
              {/* Contact Form */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="mb-8">
                  <h2 className="text-4xl text-neutral-900 mb-4 tracking-tight text-[24px]">Send us a message</h2>
                  <p className="text-xl text-neutral-600">
                    Whether you're a candidate looking for guidance or a facility seeking to connect with future leaders, we'd love to hear from you.
                  </p>
                </div>

                {isSubmitted ? (
                  <Card className="border-green-200 bg-green-50 flex-1">
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                      <h3 className="text-2xl text-green-800 mb-4">Message Sent Successfully!</h3>
                      <p className="text-green-700">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-neutral-200 flex-1 flex flex-col">
                    <CardContent className="pt-[32px] pr-[32px] pb-[24px] pl-[32px] flex-1 flex flex-col">
                      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                        {/* User Type Selection */}
                        <div className="space-y-2">
                          <label className="text-neutral-900">I am a:</label>
                          <div className="flex gap-4">
                            <Button
                              type="button"
                              variant={formData.userType === 'candidate' ? 'default' : 'outline'}
                              onClick={() => handleInputChange('userType', 'candidate')}
                              className={formData.userType === 'candidate' ? 'bg-brand-primary hover:bg-brand-primary-hover' : ''}
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Candidate
                            </Button>
                            <Button
                              type="button"
                              variant={formData.userType === 'facility' ? 'default' : 'outline'}
                              onClick={() => handleInputChange('userType', 'facility')}
                              className={formData.userType === 'facility' ? 'bg-brand-primary hover:bg-brand-primary-hover' : ''}
                            >
                              <Building className="w-4 h-4 mr-2" />
                              Facility
                            </Button>
                          </div>
                        </div>

                        {/* Name and Email */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label htmlFor="name" className="text-neutral-900">Full Name</label>
                            <Input
                              id="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="bg-input-background border-neutral-300 focus:border-brand-primary focus:ring-brand-primary/20"
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="email" className="text-neutral-900">Email Address</label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="bg-input-background border-neutral-300 focus:border-brand-primary focus:ring-brand-primary/20"
                              placeholder="your.email@example.com"
                            />
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-1">
                          <label htmlFor="subject" className="text-neutral-900">Subject</label>
                          <Input
                            id="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            className="bg-input-background border-neutral-300 focus:border-brand-primary focus:ring-brand-primary/20"
                            placeholder={formData.userType === 'candidate' ? 'AIT Opportunity Inquiry' : 'Partnership Inquiry'}
                          />
                        </div>

                        {/* Message */}
                        <div className="space-y-1 flex-1 flex flex-col min-h-0">
                          <label htmlFor="message" className="text-neutral-900">Message</label>
                          <Textarea
                            id="message"
                            required
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            className="bg-input-background border-neutral-300 focus:border-brand-primary focus:ring-brand-primary/20 resize-none flex-1 min-h-[200px]"
                            placeholder={formData.userType === 'candidate' 
                              ? 'Tell us about your background, goals, and what you\'re looking for in an AIT opportunity...'
                              : 'Tell us about your facility and how you\'d like to partner with FindMyAIT...'
                            }
                          />
                        </div>

                        {/* Submit Button */}
                        <Button 
                          type="submit" 
                          className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 text-lg text-[14px]"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h2 className="text-4xl text-neutral-900 mb-4 tracking-tight text-[24px]">Let's connect</h2>
                  <p className="text-lg text-neutral-600 m-[0px]">
                    Multiple ways to reach our team and get the support you need.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <Card className="border border-neutral-200 hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-brand-primary/10 p-2 rounded-lg">
                          <Mail className="h-4 w-4 text-brand-primary" />
                        </div>
                        <div>
                          <h3 className="text-neutral-900 mb-1">Email Us</h3>
                          <p className="text-sm text-neutral-600 mb-1">
                            General inquiries and support
                          </p>
                          <a 
                            href="mailto:contact@findmyait.com" 
                            className="text-sm text-brand-primary hover:text-brand-primary-hover transition-colors"
                          >
                            contact@findmyait.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Response Time */}
                  <Card className="border border-neutral-200 hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-brand-secondary/10 p-2 rounded-lg">
                          <Clock className="h-4 w-4 text-brand-secondary" />
                        </div>
                        <div>
                          <h3 className="text-neutral-900 mb-1">Response Time</h3>
                          <p className="text-sm text-neutral-600">
                            We typically respond within 24 hours during business days
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Office Hours */}
                  <Card className="border border-neutral-200 hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-neutral-100 p-2 rounded-lg">
                          <Building className="h-4 w-4 text-neutral-600" />
                        </div>
                        <div>
                          <h3 className="text-neutral-900 mb-1">Business Hours</h3>
                          <div className="text-sm text-neutral-600 space-y-0.5">
                            <p>Mon-Fri: 9AM-6PM EST</p>
                            <p>Sat: 10AM-2PM EST</p>
                            <p>Sun: Closed</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-neutral-900 mb-4">Looking for something specific?</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between hover:bg-white hover:shadow-sm"
                      onClick={() => onNavigate?.('jobs')}
                    >
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-2" />
                        Browse Opportunities
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between hover:bg-white hover:shadow-sm"
                      onClick={() => onNavigate?.('resources')}
                    >
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2" />
                        State Requirements
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between hover:bg-white hover:shadow-sm"
                      onClick={() => onNavigate?.('about')}
                    >
                      <span className="flex items-center">
                        <Building className="w-3 h-3 mr-2" />
                        Our Mission
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview Section */}
        <section className="py-32 bg-neutral-50 px-[0px] py-[68px]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-8 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-600 mb-12">
              Quick answers to common questions about FindMyAIT
            </p>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <Card className="border border-neutral-200">
                <CardHeader>
                  <CardTitle className="text-lg">How does FindMyAIT work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    We connect aspiring nursing home administrators with verified AIT opportunities across all 50 states, providing comprehensive resources and guidance throughout the process.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-neutral-200">
                <CardHeader>
                  <CardTitle className="text-lg">Is FindMyAIT free to use?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Yes! Our platform is free for candidates. We work directly with healthcare facilities to provide this service at no cost to aspiring administrators.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-neutral-200">
                <CardHeader>
                  <CardTitle className="text-lg">What qualifications do I need?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Requirements vary by state, but typically include a bachelor's degree and completion of specific coursework. Our resources section provides detailed state-by-state requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-neutral-200">
                <CardHeader>
                  <CardTitle className="text-lg">How do I get started?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">
                    Browse our available AIT opportunities, create your profile, and apply directly through our platform. Our team will guide you through the entire process.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}