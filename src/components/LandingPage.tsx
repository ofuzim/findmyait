import { Header } from "./Header";
import { SearchSection } from "./SearchSection";
import { HeroSection } from "./HeroSection";
import { ValuePreviewSection } from "./ValuePreviewSection";
import { FAQSection } from "./FAQSection";
import { Footer } from "./Footer";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void; // Added logout handler prop
  // ⚠️ PLACEHOLDER - Current user from LocalStorage auth
  currentUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    lastLogin?: string;
  };
  userProfile?: any;
}

export function LandingPage({ onNavigate, onLogout, currentUser, userProfile }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header 
        activeTab="home" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        currentUser={currentUser}
        userProfile={userProfile}
      />
      <SearchSection onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />
      <ValuePreviewSection onNavigate={onNavigate} />
      <FAQSection onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}