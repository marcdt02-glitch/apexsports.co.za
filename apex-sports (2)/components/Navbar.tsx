import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LINKS } from '../constants';
import { Menu, X, Calendar, UserPlus, LogIn, MessageCircle, Mail } from 'lucide-react';
import { ApexLogo } from './ApexLogo';


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  /* Split links for layout balance */
  const leftLinks = [
    { name: 'Home', path: '/' },
    { name: 'Strength & Conditioning', path: '/strength' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Coaching', path: '/goalkeeper' },
  ];

  const rightLinks = [
    { name: 'Athlete Hub', path: '/services' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 relative">

          {/* Desktop Navigation (Left) */}
          <div className="hidden xl:flex items-center gap-4 flex-1 justify-start pl-4">
            {leftLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(link.path)
                  ? 'text-white bg-gray-800'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logo Section (Center - Absolute) */}
          <div className="flex-shrink-0 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-10">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/images/logo.png" alt="Apex Sports Logo" className="w-16 h-16 object-contain" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden absolute left-4">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Actions (Right) */}
          <div className="flex items-center gap-4 flex-1 justify-end">

            {/* Desktop Navigation (Right Split) */}
            <div className="hidden xl:flex items-center gap-4 mr-4 border-r border-gray-800 pr-4">
              {rightLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(link.path)
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden xl:flex items-center gap-3">
              {/* Contact Icons */}
              <div className="flex items-center gap-4 mr-4 border-r border-gray-800 pr-6">
                <a href="https://wa.me/27823788258" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="mailto:marcdt02@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              {/* Book Button (Desktop) */}
              <div className="hidden xl:block">
                <a href={LINKS.CALENDAR} target="_blank" rel="noreferrer" className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <MessageCircle className="w-4 h-4" />
                  <span>Request a Session</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="xl:hidden bg-black border-b border-gray-800 absolute w-full top-24 left-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[...leftLinks, ...rightLinks].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                  ? 'text-white bg-gray-800'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">

              <a href={LINKS.CALENDAR} target="_blank" rel="noreferrer" className="w-full bg-white text-black hover:bg-gray-200 px-4 py-3 rounded-md font-bold flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Request a Session</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;