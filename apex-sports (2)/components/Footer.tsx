import React from 'react';
import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';
import { ApexLogo } from './ApexLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="Apex Sports Logo" className="w-24 h-auto object-contain border-2 border-white" />
              <span className="font-extrabold text-xl tracking-widest uppercase">APEX SPORTS</span>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-left max-w-xs">
              Providing world-class support to individuals and teams looking to achieve their goals through scientific rigor and passion.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#/strength" className="hover:text-white transition-colors">Strength & Conditioning</a></li>
              <li><a href="#/mentorship" className="hover:text-white transition-colors">Mentorship</a></li>
              <li><a href="#/goalkeeper" className="hover:text-white transition-colors">Coaching</a></li>
            </ul>
            <h3 className="text-lg font-semibold mt-6 mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/#/booking-policy" className="hover:text-white transition-colors">Booking & Service Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-4 text-gray-400">
              <a href="tel:+27823788258" className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>+27 82 378 8258</span>
              </a>
              <a href="https://wa.me/27823788258" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-green-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp (+27 82 378 8258)</span>
              </a>
              <a href="mailto:marcdt02@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>marcdt02@gmail.com</span>
              </a>
              <a href="https://instagram.com/apex_sports_ZA" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-pink-400 transition-colors">
                <Instagram className="w-5 h-5" />
                <span>@apex_sports_ZA</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>South Africa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Apex Sports. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;