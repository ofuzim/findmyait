import { Header } from "./Header";
import { Footer } from "./Footer";

interface TermsPageProps {
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

export function TermsPage({ onNavigate, onLogout, isLoggedIn, currentUser }: TermsPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        activeTab={null}
        currentPage="terms"
        onNavigate={onNavigate}
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-8">Terms of Service</h1>
            
            <div className="text-sm text-neutral-500 mb-8">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Acceptance of Terms</h2>
              <p className="text-neutral-700">
                By accessing and using FindMyAIT, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Description of Service</h2>
              <p className="text-neutral-700 mb-4">
                FindMyAIT is a specialized platform that connects aspiring nursing home administrators 
                with Administrator in Training (AIT) opportunities and provides educational resources 
                for NAB exam preparation.
              </p>
              <p className="text-neutral-700">
                Our services include job matching, application management, quiz practice, state-specific 
                requirements information, and career development resources.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">User Accounts</h2>
              <p className="text-neutral-700 mb-4">
                To access certain features of our service, you must create an account and provide 
                accurate, complete, and current information.
              </p>
              <p className="text-neutral-700">
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Acceptable Use</h2>
              <p className="text-neutral-700 mb-4">You agree to use FindMyAIT only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-6 text-neutral-700 space-y-2">
                <li>Provide false or misleading information</li>
                <li>Impersonate any person or entity</li>
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Use automated systems to scrape or harvest data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Job Applications and Placement</h2>
              <p className="text-neutral-700 mb-4">
                FindMyAIT facilitates connections between job seekers and healthcare facilities but 
                does not guarantee job placement or employment.
              </p>
              <p className="text-neutral-700">
                All employment decisions are made solely by the hiring organizations. We are not 
                responsible for the hiring practices, policies, or decisions of any healthcare facility.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Educational Content</h2>
              <p className="text-neutral-700">
                Our quiz content and educational materials are provided for preparation purposes only. 
                While we strive for accuracy, we do not guarantee that our content reflects the exact 
                format or content of official NAB examinations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Privacy and Data Protection</h2>
              <p className="text-neutral-700">
                Your privacy is important to us. Please review our{' '}
                <button 
                  onClick={() => onNavigate?.('privacy')}
                  className="text-brand-primary hover:text-brand-primary-hover underline"
                >
                  Privacy Policy
                </button>
                , which also governs your use of the service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Limitation of Liability</h2>
              <p className="text-neutral-700">
                FindMyAIT shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, 
                goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Termination</h2>
              <p className="text-neutral-700">
                We may terminate or suspend your account and bar access to the service immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever 
                and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Changes to Terms</h2>
              <p className="text-neutral-700">
                We reserve the right to modify or replace these Terms at any time. If a revision is 
                material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-medium text-neutral-900 mb-4">Contact Information</h2>
              <p className="text-neutral-700">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="text-brand-primary hover:text-brand-primary-hover underline"
                >
                  our contact page
                </button>
                {' '}or email us at legal@findmyait.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}