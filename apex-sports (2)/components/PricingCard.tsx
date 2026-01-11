import React from 'react';
import { Check, ExternalLink } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price?: string;
  description: React.ReactNode;
  features: string[];
  isHighlighted?: boolean;
  actions?: { // Array of buttons
    label: string;
    link?: string;
    onClick?: () => void;
    priceLabel?: string; // Optional small price text inside button e.g. "R350"
    primary?: boolean;
  }[];
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, description, features, isHighlighted = false, actions }) => {
  return (
    <div className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 h-full ${isHighlighted
      ? 'bg-neutral-900 border-white shadow-[0_0_30px_rgba(255,255,255,0.15)] z-10'
      : 'bg-black border-gray-800 hover:border-gray-600'
      }`}>
      {/* Badge */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap ${isHighlighted
        ? 'bg-white text-black shadow-lg shadow-white/20'
        : 'bg-gray-800 text-gray-300 border border-gray-700'
        }`}>
        {isHighlighted ? 'Best Value' : 'Available Now'}
      </div>

      <div className="mb-6 mt-4">
        <h3 className={`font-bold text-white mb-2 flex items-end min-h-[3.5rem] ${isHighlighted ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
        {price && (
          <p className="text-3xl font-extrabold text-white mb-2 tracking-tight">{price}</p>
        )}
        <div className="text-gray-400 text-sm min-h-[64px] leading-relaxed">{description}</div>
      </div>

      <div className={`h-px mb-6 ${isHighlighted ? 'bg-white' : 'bg-gray-800'}`}></div>

      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
            <Check className={`w-5 h-5 flex-shrink-0 ${isHighlighted ? 'text-white' : 'text-gray-500'}`} />
            <span className={isHighlighted ? 'text-white font-medium' : ''}>{feature}</span>
          </li>
        ))}
      </ul>

      <div className={`mt-auto ${actions && actions.length > 1 ? 'grid grid-cols-2 gap-2' : ''}`}>
        {actions && actions.map((action, idx) => (
          action.onClick ? (
            <button
              key={idx}
              onClick={action.onClick}
              className={`block w-full bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors ${!action.priceLabel ? 'font-bold text-white' : ''}`}
            >
              {action.label}
              {action.priceLabel && (
                <>: <strong className="text-white">{action.priceLabel}</strong></>
              )}
            </button>
          ) : (
            <a
              key={idx}
              href={action.link}
              target="_blank"
              rel="noreferrer"
              className={`block w-full bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors ${!action.priceLabel ? 'font-bold text-white' : ''}`}
            >
              {action.label}
              {action.priceLabel && (
                <>: <strong className="text-white">{action.priceLabel}</strong></>
              )}
            </a>
          )
        ))}
      </div>
    </div>
  );
};

export default PricingCard;