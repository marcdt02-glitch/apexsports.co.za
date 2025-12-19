import React from 'react';
import { Activity, Database, TrendingUp, Scale, Ruler, Cpu, BookOpen, Smartphone, LineChart, FileText, ClipboardCheck } from 'lucide-react';
import PricingCard from '../components/PricingCard';

const Strength: React.FC = () => {
  const packages = [
    {
      title: "Performance Testing",
      price: "R1,000",
      priceValue: 1000,
      description: "Per session. Objective measurement using Vald technology.",
      features: [
        "Vald Dynamometer Strength Testing",
        "Rate of Force Development Testing",
        "Range of Motion Screening",
        "Detailed Performance Report",
        "Benchmark Comparison"
      ]
    },
    {
      title: "General Templates",
      price: "R500",
      priceValue: 500,
      description: "Pre-built 6-week program block.",
      features: [
        "6-Week Training Template",
        "MoveHealth App Access",
        "Video Demonstrations",
        "General Conditioning Focus",
        "Standard Load Management"
      ]
    },
    {
      title: "Specific Program Design",
      price: "R750",
      priceValue: 750,
      description: "Customized 6-week block based on testing.",
      features: [
        "Tailored to Testing Data",
        "MoveHealth App Access",
        "Specific Adaptation Focus",
        "Detailed Video Demonstrations",
        "Advanced Load Management"
      ]
    },
    {
      title: "Apex Membership",
      price: "R2,000 / month",
      priceValue: 24000,
      description: <>Billed <strong>Annually</strong> at <strong>R24,000</strong>. The complete all-inclusive athletic package.</>,
      features: [
        "25 Coaching Sessions",
        "4 Mentorship Packages",
        "4 Testing Sessions",
        "Full Year Program Design",
        "Priority Support"
      ],
      isHighlighted: true
    }
  ];

  const references = [
    "Maffiuletti, N. A., et al. (2016). Rate of force development: physiological and methodological considerations. European Journal of Applied Physiology, 116(6), 1091-1116.",
    "Opar, D. A., Williams, M. D., & Shield, A. J. (2012). Hamstring strain injuries: factors that lead to injury and re-injury. Sports Medicine, 42(3), 209-226.",
    "Green, B., et al. (2020). Recurrence of calf muscle strain injuries in sport: a systematic review. British Journal of Sports Medicine.",
    "Buckthorpe, M., et al. (2019). Recommendations for hamstring injury prevention in elite football: translating research into practice. British Journal of Sports Medicine."
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Header */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        {/* Gym background */}
        {/* Gym background */}
        <img
          src="/images/strength-conditioning-header.png"
          alt="Gym background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-4">
            Strength & Conditioning
          </h1>
          <p className="text-3xl md:text-5xl font-extrabold text-white italic tracking-widest uppercase drop-shadow-lg">
            WHAT'S NEXT?
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert lg:prose-xl mx-auto mb-16 text-center">
          <p className="text-gray-300 leading-relaxed">
            We utilize cutting-edge technology and evidence-based practices to maximize human performance.
            Our approach integrates rigorous testing using the <strong>Vald Performance System</strong>, scientific program design, and comprehensive injury risk screening.
          </p>
        </div>

        {/* The Digital Ecosystem Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">The Ecosystem</h2>
            <p className="text-gray-400">Seamless integration of testing data and training delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Vald Hub Preview */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-white/30 transition-all">
              <div className="h-64 bg-neutral-800 relative overflow-hidden">
                {/* Placeholder for Vald Hub UI */}
                <img
                  src="/images/Vald hub new.png"
                  alt="Vald Hub Dashboard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700 flex items-center gap-3">
                    <LineChart className="w-6 h-6 text-white" />
                    <span className="font-bold text-white">Vald Hub Analytics</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-2">Data-Driven Insights</h3>
                <p className="text-gray-400 text-sm">
                  View your strength metrics, limb asymmetry, and progress over time. The Vald Hub visualizes the data collected from our DynaMo Max testing, giving you objective benchmarks.
                </p>
              </div>
            </div>

            {/* MoveHealth App Preview */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-white/30 transition-all">
              <div className="h-64 bg-neutral-800 relative overflow-hidden">
                {/* Placeholder for MoveHealth App UI */}
                <img
                  src="/images/Move Health app.png"
                  alt="MoveHealth App Interface"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700 flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-white" />
                    <span className="font-bold text-white">MoveHealth App</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-2">Training in Your Pocket</h3>
                <p className="text-gray-400 text-sm">
                  Access your personalized program anywhere. View video demonstrations, log your weights, and track your wellness. Your program evolves as your data improves.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Tech Spotlight: Vald DynaMo Max */}
        <div className="mb-24">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <Cpu className="w-10 h-10 text-white" />
                  <h2 className="text-3xl font-bold text-white">Vald DynaMo Max</h2>
                </div>
                <p className="text-gray-300 mb-8 text-lg">
                  The world's most advanced handheld strength testing device. We use the DynaMo Max to capture high-fidelity data on strength and movement quality, ensuring nothing is left to guesswork.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Sampling Rate</span>
                    <span className="text-2xl font-mono text-white">1,000 Hz</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Force Capacity</span>
                    <span className="text-2xl font-mono text-white">1,000 kg</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Sensors</span>
                    <span className="text-2xl font-mono text-white">9-Axis IMU</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Measurements</span>
                    <span className="text-xl font-mono text-white">Force & Tilt</span>
                  </div>
                </div>
              </div>
              <div className="relative h-64 md:h-auto bg-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                  alt="Vald Data Interface"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-xl mb-2">Precision Testing</h3>
                    <p className="text-gray-400 text-sm">Validating performance through data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">

          {/* Advanced Testing */}
          <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-white/30 transition-all duration-300 group">
            <div className="p-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Scale className="w-7 h-7 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors">Vald Performance Assessment</h2>
              <p className="text-gray-400 mb-6">
                We use the Vald Dynamometer and ForceFrame as our primary assessment tools. This technology allows us to measure critical performance metrics beyond simple "strength."
              </p>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></span>
                  <span>
                    <strong className="text-white">Rate of Force Development (RFD):</strong> How quickly you can produce force. Research suggests RFD is often a better predictor of athletic performance than maximal strength alone.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></span>
                  <span>
                    <strong className="text-white">Isometric Profiling:</strong> We analyze peak force production to identify limb asymmetries, which are significant indicators of injury risk.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Injury Screening */}
          <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-white/30 transition-all duration-300 group">
            <div className="p-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Ruler className="w-7 h-7 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors">Mobility & Injury Screening</h2>
              <p className="text-gray-400 mb-6">
                A robust engine needs a chassis that can handle it. Our comprehensive screening protocol evaluates Range of Motion (ROM) to mitigate injury risk before training begins.
              </p>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></span>
                  <span>
                    <strong className="text-white">Ankle Dorsiflexion:</strong> Restricted ankle mobility is a proven precursor to ACL tears and other knee injuries. We benchmark your ROM against healthy norms.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1.5 w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></span>
                  <span>
                    <strong className="text-white">Hamstring Extensibility:</strong> Asymmetry in hamstring flexibility is a key marker for future soft tissue injury. Our protocols are backed by research emphasizing the necessity of these screens for long-term athletic health.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Program Design */}
          <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-white/30 transition-all duration-300 group">
            <div className="p-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Database className="w-7 h-7 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors">Scientific Program Design</h2>
              <p className="text-gray-400 mb-6">
                All programming is centralized within the MoveHealth App. We design programs specifically according to your individual needs and goals.
              </p>
              <div className="bg-neutral-800 p-4 rounded-lg border-l-2 border-white">
                <p className="text-xs text-gray-500 italic">
                  "Evidence-based programming ensures that every repetition contributes to specific physiological adaptations, optimizing the CNS response."
                </p>
              </div>
            </div>
          </div>

          {/* Training & Monitoring */}
          <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-white/30 transition-all duration-300 group">
            <div className="p-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <TrendingUp className="w-7 h-7 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors">CNS & Fatigue Management</h2>
              <p className="text-gray-400 mb-6">
                We monitor the Central Nervous System (CNS) on a weekly basis to gauge fatigue accumulation.
              </p>
              <p className="text-gray-400 text-sm">
                This allows us to customize training sessions in real-time—pushing when you are ready, and pulling back to facilitate supercompensation when needed.
              </p>
            </div>
          </div>

        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-800 pt-16 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Strength & Conditioning Packages</h2>
            <p className="text-gray-400">Choose the level of support that fits your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {packages.map((pkg, idx) => (
              <PricingCard
                key={idx}
                title={pkg.title}
                price={pkg.price}
                priceValue={pkg.priceValue}
                description={pkg.description}
                features={pkg.features}
                isHighlighted={pkg.isHighlighted}
              />
            ))}
          </div>
        </div>

        {/* Free Trial / Consultation Form Section */}
        <div className="mb-24 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">3-Week Vald Hub Trial</h2>
              <p className="text-gray-300 mb-6 max-w-xl">
                Not sure if you're ready to commit? Experience a 3-week trial on the Vald Hub. You will receive rough training templates linked directly to your performance data to see the difference data-driven training makes.
              </p>
              <div className="flex items-center gap-4">
                <ClipboardCheck className="w-6 h-6 text-white" />
                <span className="text-sm text-gray-400">Limited Availability</span>
              </div>
            </div>
            <a
              href="https://docs.google.com/forms" // Placeholder for Google Form
              target="_blank"
              rel="noreferrer"
              className="bg-white text-black px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              Start Trial
            </a>
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

export default Strength;