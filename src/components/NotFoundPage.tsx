import { Header } from "./Header";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

interface NotFoundPageProps {
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
  onLogout?: () => void;
}

export function NotFoundPage({ onNavigate, isLoggedIn, currentUser, onLogout }: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex flex-col">
      <Header 
        onNavigate={onNavigate} 
        currentPage="404" 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-[150px] leading-none tracking-tight bg-gradient-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent animate-pulse">
              404
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl lg:text-5xl text-neutral-900 mb-6 tracking-tight">
            Page Not Found
          </h1>
          
          <p className="text-xl text-neutral-600 mb-12 max-w-lg mx-auto leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => onNavigate?.('home')}
              size="lg"
              className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-6 text-lg min-w-[200px]"
            >
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
            
            <Button
              onClick={() => onNavigate?.('jobs')}
              size="lg"
              variant="outline"
              className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-6 text-lg min-w-[200px]"
            >
              <Search className="mr-2 h-5 w-5" />
              Find Jobs
            </Button>
          </div>

          {/* Back Link */}
          <div className="mt-12">
            <button
              onClick={() => window.history.back()}
              className="text-brand-primary hover:text-brand-primary-hover inline-flex items-center gap-2 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back to previous page
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <p className="text-neutral-600 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => onNavigate?.('quiz')}
                className="text-brand-primary hover:text-brand-primary-hover hover:underline"
              >
                NAB Exam Prep
              </button>
              <button
                onClick={() => onNavigate?.('resources')}
                className="text-brand-primary hover:text-brand-primary-hover hover:underline"
              >
                Resources
              </button>
              <button
                onClick={() => onNavigate?.('about')}
                className="text-brand-primary hover:text-brand-primary-hover hover:underline"
              >
                About Us
              </button>
              <button
                onClick={() => onNavigate?.('contact')}
                className="text-brand-primary hover:text-brand-primary-hover hover:underline"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}