import React from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface PricingCardProps {
  title: string;
  price?: string;
  priceValue?: number; // Numeric value for calculation
  description: React.ReactNode;
  features: string[];
  isHighlighted?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, priceValue, description, features, isHighlighted = false }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (priceValue) {
      // If description is complex (ReactNode), we convert it to string for cart or just use a generic desc
      const descText = typeof description === 'string' ? description : "Membership Package";
      
      addToCart({
        id: title.toLowerCase().replace(/\s/g, '-'),
        title,
        price: priceValue,
        description: descText
      });
      alert(`${title} added to cart!`);
    }
  };

  return (
    <div className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 h-full ${
      isHighlighted 
        ? 'bg-neutral-900 border-white shadow-[0_0_30px_rgba(255,255,255,0.15)] md:pb-12 z-10' 
        : 'bg-black border-gray-800 hover:border-gray-600'
    }`}>
      {/* Badge */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
        isHighlighted 
          ? 'bg-white text-black shadow-lg shadow-white/20' 
          : 'bg-gray-800 text-gray-300 border border-gray-700'
      }`}>
        {isHighlighted ? 'Best Value' : 'Available Now'}
      </div>
      
      <div className="mb-6 mt-4">
        <h3 className={`font-bold text-white mb-2 ${isHighlighted ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
        {price && (
           <p className="text-3xl font-extrabold text-white mb-2 tracking-tight">{price}</p>
        )}
        <div className="text-gray-400 text-sm min-h-[40px] leading-relaxed">{description}</div>
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
      
      <button 
        onClick={handleAddToCart}
        className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
        isHighlighted 
          ? 'bg-white text-black hover:bg-gray-200 shadow-lg' 
          : 'bg-transparent border border-gray-700 text-white hover:border-white hover:bg-white/5'
      }`}>
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
};

export default PricingCard;