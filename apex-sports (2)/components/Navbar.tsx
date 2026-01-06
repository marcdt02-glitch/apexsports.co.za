import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Center Zone Links
  const navLinks = [
    { name: 'Strength & Conditioning', path: '/strength' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Coaching', path: '/goalkeeper' },
    { name: 'Athlete Hub', path: '/portal' },
  ];

  // Helper for active state
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-[70px] flex items-center transition-all duration-300">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* 1. Left Zone: APEX Sports Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/logo.png"
                alt="Apex Sports"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          {/* 2. Center Zone: Main Navigation (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-10 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium uppercase tracking-widest transition-all duration-200 relative group ${isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {link.name}
                {/* Underline Effect */}
                <span className={`absolute -bottom-1 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}
          </div>

          {/* 3. Right Zone: Call to Action (Desktop) */}
          <div className="hidden lg:flex items-center justify-end">
            <a
              href="https://wa.me/27823788258"
              target="_blank"
              rel="noreferrer"
              className="group relative px-6 py-2 border border-white/30 rounded-full overflow-hidden transition-all hover:border-white"
            >
              <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-white group-hover:text-black transition-colors">
                Request a Session
              </span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </a>
          </div>

          {/* Mobile Menu Toggle (Right) */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white p-2 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Menu Overlay (Slide in from Right) */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full pt-24 px-8 pb-10">
          <div className="space-y-6 flex flex-col items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black uppercase tracking-tighter ${isActive(link.path) ? 'text-white' : 'text-gray-500 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="w-12 h-[1px] bg-gray-800 my-4" />

            <a
              href="https://wa.me/27823788258"
              className="text-lg font-bold text-white border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-colors uppercase tracking-widest"
            >
              Request a Session
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;