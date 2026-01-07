import React from 'react';
import { BookOpen, Calendar, UserPlus } from 'lucide-react';
import { LINKS } from '../constants';
import PricingCard from '../components/PricingCard';

const Mentorship: React.FC = () => {
  const packages = [
    {
      title: "Goal-Setting Access",
      price: "R100 / month",
      description: "Self-guided growth.",
      actions: [
        { label: "Subscribe", link: LINKS.SIGN_UP, priceLabel: "R100/mo", primary: true }
      ],
      features: [
        "Access to Goal Setting Portal",
        "Quarterly Review",
        "Progress Tracking",
        "Self-Reflection Tools",
        "Basic Support"
      ]
    },
    {
      title: "Full Mentorship",
      price: "R500 / month",
      description: <><strong>Monthly:</strong> R500 | <strong>Annual:</strong> R5,000 (Save R1,000).</>,
      actions: [
        { label: "Subscribe", link: "https://paystack.shop/pay/Mentorship-Monthly", priceLabel: "R500/mo", primary: true },
        { label: "Pay Annual", link: "https://paystack.shop/pay/mentorship-Onceoff", priceLabel: "R5,000/yr", primary: false }
      ],
      features: [
        "Monthly 1-on-1 Strategy Call",
        "Season Planning & Goal Setting",
        "Film Analysis & Review",
        "Career Guidance",
        "Psychological Skills Assessment"
      ],
      isHighlighted: true
    },
    {
      title: "Apex Membership",
      price: "R2,500 / month",
      description: <><strong>Monthly:</strong> R2,500 | <strong>Annual:</strong> R27,000 (Save R3,000).</>,
      actions: [
        { label: "Subscribe", link: "https://paystack.shop/pay/ApexMembership-Monthly", priceLabel: "R2,500/mo", primary: true },
        { label: "Pay Annual", link: "https://paystack.shop/pay/apexmembership-once-off", priceLabel: "R27,000/yr", primary: false }
      ],
      features: [
        "Mentorship Program",
        "Full S&C Program Design",
        "25 Coaching Sessions",
        "4 Testing Sessions",
        "Training Load Monitoring"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Header */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        {/* Image: Coach/Analysis vibe with sports field context */}
        <img
          src="/images/mentorship-header.png"
          alt="Sports Analysis"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-4">
            Mentorship Portal
          </h1>
          <p className="text-3xl md:text-5xl font-extrabold text-white italic tracking-widest uppercase drop-shadow-lg">
            UNLOCK YOUR MIND
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-white mb-6">The Mental Edge</h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Elite performance isn't just physical. Through our mentorship program, we unlock the psychological skills necessary to perform under pressure.
            </p>
            <p className="text-gray-400">
              Our approach involves consistent, individual meetings designed to align your daily habits with your ultimate ambitions through rigorous film study and analysis.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80"
              alt="Game Film Analysis"
              className="rounded-lg shadow-2xl shadow-white/10 border border-gray-800 w-full"
            />
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-gray-800 rounded-2xl p-8 mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-white p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white">The Science of Performance</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Goal Setting Theory</h3>
              <p className="text-gray-400 leading-relaxed">
                Research shows that setting specific, challenging goals drives motivation. We utilize Locke and Latham's framework to shift your focus to the <strong>Process</strong>—the small, immediate steps you take every day.
              </p>
            </div>

            <div className="h-px bg-gray-800"></div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Visualization (Mental Imagery)</h3>
              <p className="text-gray-400 leading-relaxed">
                Systematic mental rehearsal enhances neural connectivity, allowing for sharper decision-making and technical execution under pressure.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-24">
          <a
            href={LINKS.CALENDAR}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 shadow-lg shadow-white/10"
          >
            <Calendar className="w-5 h-5" />
            Book Discovery Call
          </a>
          <a
            href={LINKS.SIGN_UP}
            target="_blank"
            rel="noreferrer"
            className="bg-neutral-900 border border-neutral-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3"
          >
            Join Waiting List
          </a>
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-800 pt-16 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mentorship Packages</h2>
            <p className="text-gray-400">Invest in your mind and your future.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {packages.map((pkg, idx) => (
              <PricingCard
                key={idx}
                title={pkg.title}
                price={pkg.price}
                description={pkg.description}
                features={pkg.features}
                actions={pkg.actions}
                isHighlighted={pkg.isHighlighted}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;