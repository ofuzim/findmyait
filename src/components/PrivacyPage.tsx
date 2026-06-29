import { Header } from "./Header";
import { Footer } from "./Footer";

interface PrivacyPageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  currentUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    lastLogin?: string;
  };
}

export function PrivacyPage({ onNavigate, onLogout, isLoggedIn, currentUser }: PrivacyPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        activeTab={null}
        currentPage="privacy"
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-8">Privacy Policy</h1>
            
            <div className="text-sm text-neutral-500 mb-8">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Information We Collect</h2>
              <p className="text-neutral-700 mb-4">
                FindMyAIT collects information you provide directly to us, such as when you create an account, 
                complete your profile, apply for positions, or contact us for support.
              </p>
              <p className="text-neutral-700">
                This may include your name, email address, phone number, location, education history, 
                work experience, and other professional information relevant to Administrator in Training opportunities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">How We Use Your Information</h2>
              <p className="text-neutral-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-neutral-700 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Match you with relevant AIT opportunities</li>
                <li>Send you job alerts and notifications</li>
                <li>Improve our platform and user experience</li>
                <li>Communicate with you about our services</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Information Sharing</h2>
              <p className="text-neutral-700 mb-4">
                We may share your information with healthcare facilities and nursing home operators 
                when you apply for AIT positions or express interest in specific opportunities.
              </p>
              <p className="text-neutral-700">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Data Security</h2>
              <p className="text-neutral-700">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Your Rights</h2>
              <p className="text-neutral-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-neutral-700 space-y-2">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Lodge a complaint with appropriate authorities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Contact Us</h2>
              <p className="text-neutral-700">
                If you have questions about this Privacy Policy or our data practices, please contact us at{' '}
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="text-brand-primary hover:text-brand-primary-hover underline"
                >
                  our contact page
                </button>
                {' '}or email us at privacy@findmyait.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Changes to This Policy</h2>
              <p className="text-neutral-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}