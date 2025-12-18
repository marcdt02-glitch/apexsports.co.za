import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { items, removeFromCart, total } = useCart();

  const handleCheckout = () => {
    alert("This would proceed to a payment gateway.");
  };

  return (
    <div className="min-h-screen bg-black pt-28 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-russo text-4xl text-white mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-xl">
            <p className="text-gray-400 mb-6">Your cart is currently empty.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Continue Browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-center justify-between group">
                  <div>
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                    <p className="text-white font-mono mt-2">R {item.price.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="md:col-span-1">
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl sticky top-28">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>R {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (Included)</span>
                    <span>R 0</span>
                  </div>
                </div>
                
                <div className="h-px bg-gray-800 mb-6"></div>
                
                <div className="flex justify-between text-white font-bold text-xl mb-8">
                  <span>Total</span>
                  <span>R {total.toLocaleString()}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-white text-black py-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;