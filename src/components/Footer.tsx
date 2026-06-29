import logoFull from 'figma:asset/bbd761c92a4e06f7ed0913518297cce9dea25034.png';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Mission */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img 
                src={logoFull} 
                alt="FindMyAIT" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md text-lg leading-relaxed">
              Streamline your journey into healthcare leadership. The bridge between where you are and where you want to be.
            </p>
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 rounded-2xl border border-gray-700">
              <p className="text-green-400 font-medium italic">
                "We're operators, not outsiders."
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => onNavigate?.('jobs')} 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Find Jobs</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('quiz')} 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Career Quiz</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('resources')} 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Resources</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('about')} 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">About Us</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('contact')} 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Contact</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <a href="mailto:support@findmyait.com" className="hover:text-white transition-colors duration-200">
                  support@findmyait.com
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <a href="tel:+1-555-0123" className="hover:text-white transition-colors duration-200">
                  (555) 012-3456
                </a>
              </li>
              <li className="flex items-start text-gray-400">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3 mt-1">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span>Healthcare Leadership<br />United States</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-white font-medium mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 FindMyAIT. All rights reserved. Empowering healthcare leadership nationwide.
            </p>
            <div className="flex space-x-8 mt-4 lg:mt-0">
              <button 
                onClick={() => onNavigate?.('privacy')} 
                className="text-gray-500 hover:text-white text-sm transition-colors duration-200 text-[12px] bg-transparent border-none p-0 cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => onNavigate?.('terms')} 
                className="text-gray-500 hover:text-white text-sm transition-colors duration-200 text-[12px] bg-transparent border-none p-0 cursor-pointer"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => onNavigate?.('cookie')} 
                className="text-gray-500 hover:text-white text-sm transition-colors duration-200 text-[12px] bg-transparent border-none p-0 cursor-pointer"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}