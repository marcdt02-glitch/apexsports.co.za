import React from 'react';

interface ApexLogoProps {
  className?: string;
}

export const ApexLogo: React.FC<ApexLogoProps> = ({ className = "w-32 h-32" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="currentColor"
      className={className}
      aria-label="Apex Sports Logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 
        A bold Triangle shape (The Apex) with a lightning bolt cutting through the negative space.
      */}
      <path 
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 0L100 100H0L50 0ZM52 35L40 60H55L48 85L70 50H55L65 35H52Z" 
        fill="currentColor"
      />
    </svg>
  );
};