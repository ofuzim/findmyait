import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQSectionProps {
  onNavigate?: (page: string) => void;
}

export function FAQSection({ onNavigate }: FAQSectionProps) {
  const faqs = [
    {
      question: "What is the NAB exam and who needs to take it?",
      answer: "The NAB (National Association of Long Term Care Administrator Boards) exam is a nationally standardized licensing examination required for nursing home administrators in most U.S. states. Anyone seeking to become a licensed nursing home administrator must pass this exam as part of their licensure requirements."
    },
    {
      question: "How does the Administrator in Training (AIT) program work?",
      answer: "The AIT program is a structured training period where aspiring nursing home administrators work under the supervision of a licensed administrator. The program typically lasts 12-24 months depending on your state's requirements, during which you'll gain hands-on experience in all aspects of nursing home administration while preparing for your licensing exam."
    },
    {
      question: "How can FindMyAIT help me find AIT opportunities?",
      answer: "FindMyAIT connects you directly with nursing homes and healthcare facilities offering AIT positions. Our platform features verified opportunities, detailed job descriptions, facility information, and direct contact with hiring managers. We also provide state-specific guidance on requirements and application processes."
    },
    {
      question: "How many practice questions do I get with a free account?",
      answer: "With a free FindMyAIT account, you get access to 5 practice questions daily, plus comprehensive study resources, state requirement guides, and job search tools. Upgrade to premium for unlimited practice questions, detailed explanations, and personalized study plans."
    },
    {
      question: "Are the practice questions similar to the actual NAB exam?",
      answer: "Yes, our practice questions are developed by licensed nursing home administrators and healthcare education experts. They mirror the format, difficulty level, and content areas of the actual NAB exam, covering domains like resident care, human resources, finance, and regulatory compliance."
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-stretch">
          {/* Left Column - Header and Description */}
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <HelpCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Frequently Asked Questions</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl text-neutral-900 mb-6 font-semibold">
                Got Questions?
              </h2>
              
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Everything you need to know about AIT programs, NAB exam preparation, and finding your path to healthcare leadership.
              </p>
            </div>

            {/* Contact CTA - Aligned to Bottom */}
            <div className="space-y-4 mt-auto hidden lg:block">
              <p className="text-lg text-neutral-600 text-[18px]">
                Still have questions? We're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="group inline-flex items-center text-lg font-medium transition-all duration-200 bg-transparent border-none p-0 cursor-pointer"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  <span className="relative text-[14px]">
                    Contact Support
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-current transition-all duration-200"
                          style={{ backgroundColor: 'var(--brand-primary)' }}></span>
                  </span>
                  <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('resources')}
                  className="group inline-flex items-center text-lg font-medium text-neutral-600 hover:text-neutral-900 transition-all duration-200 bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="relative text-[14px]">
                    Browse Help Center
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-current transition-all duration-200"></span>
                  </span>
                  <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - FAQ Accordion */}
          <div className="flex flex-col h-full">
            <Accordion type="single" collapsible className="w-full space-y-4 flex-1">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-neutral-50 rounded-2xl border-0 px-6 data-[state=open]:bg-blue-50"
                >
                  <AccordionTrigger className="hover:no-underline py-6 text-left">
                    <span className="text-lg font-semibold text-neutral-900 pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
                    <p className="text-neutral-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        
        {/* Mobile Contact CTA - Only visible on mobile, appears below FAQs */}
        <div className="lg:hidden mt-8 px-4 sm:px-6">
          <div className="space-y-4 text-center">
            <p className="text-lg text-neutral-600 text-[18px]">
              Still have questions? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => onNavigate?.('contact')}
                className="group inline-flex items-center justify-center text-lg font-medium transition-all duration-200 bg-transparent border-none p-0 cursor-pointer"
                style={{ color: 'var(--brand-primary)' }}
              >
                <span className="relative text-[14px]">
                  Contact Support
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-current transition-all duration-200"
                        style={{ backgroundColor: 'var(--brand-primary)' }}></span>
                </span>
              </button>
              
              <button 
                onClick={() => onNavigate?.('resources')}
                className="group inline-flex items-center justify-center text-lg font-medium text-neutral-600 hover:text-neutral-900 transition-all duration-200 bg-transparent border-none p-0 cursor-pointer"
              >
                <span className="relative text-[14px]">
                  Browse Help Center
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-current transition-all duration-200"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}