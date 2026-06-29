import { Header } from "./Header";
import { Footer } from "./Footer";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Shield, Cookie, Settings, Eye, Globe, FileText } from "lucide-react";

interface CookiePageProps {
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
  onLogout?: () => void;
}

export function CookiePage({ onNavigate, isLoggedIn, currentUser, onLogout }: CookiePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigate={onNavigate} 
        currentPage="cookie" 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 border-brand-primary/30 text-brand-primary bg-brand-primary/5">
            <Cookie className="w-4 h-4 mr-2" />
            Last Updated: October 1, 2025
          </Badge>
          <h1 className="text-5xl lg:text-6xl text-neutral-900 mb-6 tracking-tight">
            Cookie Policy
          </h1>
          <div className="w-24 h-1 bg-brand-secondary mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            How FindMyAIT uses cookies and similar technologies to improve your experience
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-brand-primary/20">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl text-neutral-900 mb-4">What Are Cookies?</h2>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, understanding how you use our platform, and improving our services.
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  This Cookie Policy explains what cookies are, how we use them, the types of cookies we use, and how you can control them.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <section className="mb-12">
          <h2 className="text-3xl text-neutral-900 mb-8">Types of Cookies We Use</h2>
          
          <div className="space-y-6">
            {/* Essential Cookies */}
            <Card className="border-l-4 border-l-brand-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-neutral-900 mb-3">Essential Cookies</h3>
                    <p className="text-neutral-600 leading-relaxed mb-3">
                      These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and accessibility features.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-700">
                        <strong>Examples:</strong> Session management, login authentication, security tokens, user preferences
                      </p>
                      <p className="text-sm text-neutral-700 mt-2">
                        <strong>Can be disabled:</strong> No - These are required for the site to work
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Functional Cookies */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-neutral-900 mb-3">Functional Cookies</h3>
                    <p className="text-neutral-600 leading-relaxed mb-3">
                      These cookies allow us to remember your preferences and choices to provide you with a more personalized experience.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-700">
                        <strong>Examples:</strong> Language preferences, saved searches, job filters, notification settings
                      </p>
                      <p className="text-sm text-neutral-700 mt-2">
                        <strong>Can be disabled:</strong> Yes - But some features may not work as expected
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Cookies */}
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-neutral-900 mb-3">Analytics & Performance Cookies</h3>
                    <p className="text-neutral-600 leading-relaxed mb-3">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-700">
                        <strong>Examples:</strong> Page views, time on site, navigation paths, search terms used
                      </p>
                      <p className="text-sm text-neutral-700 mt-2">
                        <strong>Can be disabled:</strong> Yes - Your data won't be tracked
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Cookies */}
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-neutral-900 mb-3">Marketing & Advertising Cookies</h3>
                    <p className="text-neutral-600 leading-relaxed mb-3">
                      These cookies are used to deliver relevant advertisements and track advertising campaign performance.
                    </p>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-700">
                        <strong>Examples:</strong> Ad targeting, campaign tracking, social media integration
                      </p>
                      <p className="text-sm text-neutral-700 mt-2">
                        <strong>Can be disabled:</strong> Yes - You'll still see ads but they won't be personalized
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section className="mb-12">
          <h2 className="text-3xl text-neutral-900 mb-6">Third-Party Cookies</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-neutral-600 leading-relaxed mb-6">
                We may use third-party services that place cookies on your device. These services help us provide better functionality and analyze our website's performance.
              </p>
              
              <div className="space-y-4">
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h4 className="text-neutral-900 mb-2">Google Analytics</h4>
                  <p className="text-sm text-neutral-600 mb-2">
                    Helps us understand how users interact with our website through anonymous data collection.
                  </p>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-brand-primary hover:text-brand-primary-hover"
                  >
                    Learn more about Google's privacy policy →
                  </a>
                </div>

                <div className="bg-neutral-50 rounded-lg p-6">
                  <h4 className="text-neutral-900 mb-2">Social Media Platforms</h4>
                  <p className="text-sm text-neutral-600">
                    When you share content or interact with our social media integrations, those platforms may set their own cookies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Managing Cookies */}
        <section className="mb-12">
          <h2 className="text-3xl text-neutral-900 mb-6">How to Manage Cookies</h2>
          <Card className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20">
            <CardContent className="p-8">
              <p className="text-neutral-600 leading-relaxed mb-6">
                You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-neutral-900 mb-2">Browser Settings</h4>
                  <p className="text-sm text-neutral-600 mb-3">
                    You can control and/or delete cookies through your browser settings. Here's how:
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      <span><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      <span><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      <span><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      <span><strong>Edge:</strong> Settings → Cookies and site permissions</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Important:</strong> Disabling certain cookies may affect your experience and prevent you from accessing some features of our website.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Local Storage */}
        <section className="mb-12">
          <h2 className="text-3xl text-neutral-900 mb-6">Local Storage</h2>
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    In addition to cookies, we may use browser local storage to enhance your experience. This is similar to cookies but allows us to store more data locally on your device.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mb-4">
                    <strong>We use local storage for:</strong>
                  </p>
                  <ul className="space-y-2 text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      <span>Temporary authentication during your session</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      <span>Saved job searches and filters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      <span>Quiz progress and study streak tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary mt-1">•</span>
                      <span>User preferences and settings</span>
                    </li>
                  </ul>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> This is a prototype platform using local storage for demonstration purposes. In a production environment, this data would be securely stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Updates */}
        <section className="mb-12">
          <h2 className="text-3xl text-neutral-900 mb-6">Updates to This Policy</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-neutral-600 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                We encourage you to review this policy periodically to stay informed about how we use cookies. The "Last Updated" date at the top of this page indicates when this policy was last revised.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-brand-primary to-blue-900 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl mb-4">Questions About Cookies?</h2>
              <p className="text-white/90 leading-relaxed mb-6 max-w-2xl mx-auto">
                If you have any questions about how we use cookies or this Cookie Policy, please don't hesitate to reach out to us.
              </p>
              <button
                onClick={() => onNavigate?.('contact')}
                className="bg-brand-secondary hover:bg-brand-secondary-hover text-neutral-900 px-8 py-3 rounded-lg transition-colors duration-200"
              >
                Contact Us
              </button>
            </CardContent>
          </Card>
        </section>

        {/* Related Links */}
        <div className="bg-neutral-50 rounded-xl p-8 text-center">
          <p className="text-neutral-600 mb-4">Related Policies</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate?.('privacy')}
              className="text-brand-primary hover:text-brand-primary-hover underline"
            >
              Privacy Policy
            </button>
            <span className="text-neutral-300">•</span>
            <button
              onClick={() => onNavigate?.('terms')}
              className="text-brand-primary hover:text-brand-primary-hover underline"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
