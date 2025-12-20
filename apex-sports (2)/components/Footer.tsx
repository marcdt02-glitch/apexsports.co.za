import React from 'react';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Triangle, Youtube } from 'lucide-react';
import { ApexLogo } from './ApexLogo';
import { Link } from 'react-router-dom'; // Assuming Link comes from react-router-dom

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-center gap-2">
              <Triangle className="w-8 h-8 fill-white" />
              <span className="text-2xl font-bold tracking-tighter">APEX</span>
            </div>
            <p className="text-gray-400">
              Elite performance coaching for the modern athlete.
              <br />
              <span className="text-sm opacity-60">T/A Apex Sports</span>
            </p>
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
              <div className="flex items-start gap-3 mt-4 text-gray-400">
                <MapPin className="w-5 h-5 mt-1 shrink-0" />
                <p>Stellenbosch, South Africa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Marc du Toit T/A Apex Sports. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;