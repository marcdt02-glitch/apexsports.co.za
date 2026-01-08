import React from 'react';
import { Brain, Target, Compass, BookOpen, Calendar, UserPlus } from 'lucide-react';
import { LINKS } from '../constants';

import PricingCard from '../components/PricingCard';

const Mentorship: React.FC = () => {
  const packages = [
    {
      title: "Goal-Setting Access",
      price: "R100 / month",
      description: "Self-guided growth.",
      actions: [
        { label: "Subscribe", link: "#", priceLabel: "R100/mo", primary: true }
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

  const references = [
    "Locke, E. A., & Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation. American Psychologist, 57(9), 705.",
    "Cumming, J., & Williams, S. E. (2012). The role of imagery in performance. The Oxford Handbook of Sport and Performance Psychology, 213-232.",
    "Yerkes, R. M., & Dodson, J. D. (1908). The relation of strength of stimulus to rapidity of habit-formation. Journal of Comparative Neurology and Psychology, 18(5), 459-482.",
    "Weinberg, R. S., & Gould, D. (2019). Foundations of Sport and Exercise Psychology. Human Kinetics.",
    "Vealey, R. S. (2007). Mental skills training in sport. In G. Tennebaum & R. C. Eklund (Eds.), Handbook of sport psychology (pp. 287-309). Wiley."
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
            Mentorship
          </h1>
          <p className="text-3xl md:text-5xl font-extrabold text-white italic tracking-widest uppercase drop-shadow-lg">
            WHAT'S NEXT?
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-8">

        <a href="https://forms.gle/1m9V69VLPQEkrbcB7" target="_blank" rel="noreferrer" className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all transform hover:scale-105">
          <UserPlus className="w-4 h-4" />
          <span>Sign Up</span>
        </a>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

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
            {/* Image: Laptop with sports/turf visible or implied game analysis */}
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80"
              alt="Game Film Analysis"
              className="rounded-lg shadow-2xl shadow-white/10 border border-gray-800 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

          <div className="bg-neutral-900 p-8 rounded-xl border-l-4 border-white hover:bg-neutral-800 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <Target className="w-8 h-8 text-white" />
              <h3 className="text-xl font-bold text-white">Goal Setting</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We help you build a clear roadmap to success. By focusing on <strong>Process Goals</strong> (daily habits) rather than just <strong>Outcome Goals</strong> (winnning), we keep you focused on what you can control right now. This approach builds confidence and ensures consistent improvement week after week.
            </p>
          </div>

          <div className="bg-neutral-900 p-8 rounded-xl border-l-4 border-white hover:bg-neutral-800 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <Brain className="w-8 h-8 text-white" />
              <h3 className="text-xl font-bold text-white">Psychological Skills</h3>
            </div>
            <p className="text-gray-400">
              Just like physical skills, mental skills can be trained. We work on <strong>Visualization</strong>, <strong>Self-Talk</strong>, and <strong>Concentration</strong> strategies to help you handle pressure. Our comprehensive assessment identifies your mental profile, allowing us to tailor tools that build resilience and mental toughness.
            </p>
          </div>

          <div className="bg-neutral-900 p-8 rounded-xl border-l-4 border-white md:col-span-2 hover:bg-neutral-800 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <Compass className="w-8 h-8 text-white" />
              <h3 className="text-xl font-bold text-white">Monthly Strategy Sessions</h3>
            </div>
            <p className="text-gray-400">
              Individual meetings held once a month to review game footage, analyze form, and recalibrate goals. This ensures you remain on the path to peak performance throughout the season.
            </p>
          </div>

        </div>

        {/* Scientific Backing Section */}
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
                Research shows that setting specific, challenging goals drives motivation. However, focusing too much on the finish line can be overwhelming. We utilize Locke and Latham's framework to shift your focus to the <strong>Process</strong>—the small, immediate steps you take every day. This creates a feedback loop of success, keeping you motivated and on track.
              </p>
            </div>

            <div className="h-px bg-gray-800"></div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Visualization (Mental Imagery)</h3>
              <p className="text-gray-400 leading-relaxed">
                Visualization is not just "thinking about the game." Research confirms that functional magnetic resonance imaging (fMRI) studies show that visualizing an action recruits the same motor and premotor neural pathways as actually performing the action. Systematic mental rehearsal enhances neural connectivity, allowing for sharper decision-making and technical execution under pressure.
              </p>
            </div>

            <div className="h-px bg-gray-800"></div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Activation Control</h3>
              <p className="text-gray-400 leading-relaxed">
                Ideally, you need to be "in the zone"—alert enough to react instantly, but calm enough to make the right choice. We teach you to master your internal volume knob, balancing excitement with composure. This regulation ensures your energy fuels your performance rather than overwhelming it, keeping you in a state of flow when it matters most.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-800 pt-16 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mentorship Packages</h2>
            <p className="text-gray-400">Invest in your mind and your future.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

        {/* References Section */}
        <div className="border-t border-gray-800 pt-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">References</h3>
          </div>
          <ul className="space-y-3">
            {references.map((ref, idx) => (
              <li key={idx} className="text-xs text-gray-500 font-mono pl-4 border-l border-gray-800">
                {ref}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Mentorship;