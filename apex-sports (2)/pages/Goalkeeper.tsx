import React, { useState } from 'react';
import { Video, Shield, Zap, Award, BookOpen, TrendingUp, PlayCircle, UploadCloud, MonitorPlay, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import PricingCard from '../components/PricingCard';

const Goalkeeper: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const galleryMedia = [
    { type: 'video', src: '/videos/Training Footage 1.mov' }, // Existing
    { type: 'video', src: '/videos/Training Footage 2.mov' }, // New
    { type: 'image', src: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&q=80&w=400&h=400&random=2' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&q=80&w=400&h=400&random=3' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&q=80&w=400&h=400&random=4' }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryMedia.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryMedia.length) % galleryMedia.length);

  const packages = [
    {
      title: "5-Session Pack",
      price: "R2,500",
      description: "Flexible development block (R500/session).",
      actions: [
        { label: "Buy Pack", link: "mailto:performance@apexsports.co.za?subject=5-Session Pack Inquiry", priceLabel: "R2,500", primary: true }
      ],
      features: [
        "5 Hours of Technical Training",
        "Video Analysis of Every Session",
        "Basic Game Footage Review",
        "Training Load Monitoring",
        "Progress Tracking"
      ]
    },
    {
      title: "10-Session Pack",
      price: "R4,000",
      description: <><strong>Upfront:</strong> R4,000 | <strong>Split:</strong> R2,250 x 2 months (Total R4,500).</>,
      actions: [
        { label: "Buy Upfront", link: "mailto:performance@apexsports.co.za?subject=10-Session Pack Upfront Inquiry", priceLabel: "R4,000", primary: true }, // Placeholder link
        { label: "Split Payment", link: "mailto:performance@apexsports.co.za?subject=10-Session Pack Split Inquiry", priceLabel: "R2,250/m", primary: false } // Placeholder link
      ],
      features: [
        "10 Hours of Technical Training",
        "Detailed Video Breakdown",
        "Match Performance Review",
        "Training Load Monitoring",
        "Priority Scheduling"
      ]
    },
    {
      title: "25-Session Pack",
      price: "R9,000",
      description: <><strong>Upfront:</strong> R9,000 | <strong>Monthly:</strong> R833 (Total R10,000).</>,
      actions: [
        { label: "Buy Upfront", link: "mailto:performance@apexsports.co.za?subject=25-Session Pack Upfront Inquiry", priceLabel: "R9,000", primary: true },
        { label: "Sub Weekly", link: "mailto:performance@apexsports.co.za?subject=25-Session Pack Monthly Inquiry", priceLabel: "R833/mo", primary: false }
      ],
      features: [
        "25 Hours of Technical Training",
        "Full Season Video Breakdown",
        "Advanced Biomechanical Analysis",
        "Training Load Monitoring",
        "Priority Scheduling"
      ]
    },
    {
      title: "Apex Membership",
      price: "R2,500 / month",
      description: <><strong>Monthly:</strong> R2,500 | <strong>Annual:</strong> R27,000 (Save R3,000).</>,
      actions: [
        { label: "Subscribe", link: "mailto:performance@apexsports.co.za?subject=Apex Membership Inquiry", priceLabel: "R2,500/mo", primary: true },
        { label: "Pay Annual", link: "mailto:performance@apexsports.co.za?subject=Apex Membership Annual Inquiry", priceLabel: "R27,000/yr", primary: false }
      ],
      features: [
        "25 Coaching Sessions",
        "Full S&C Program Design",
        "Mentorship & Psych Skills",
        "Training Load Monitoring",
        "National Level Expertise"
      ],
      isHighlighted: true
    }
  ];

  const references = [
    "Navia, J. A., et al. (2013). Anticipation in sport: the influence of viewing perspective and expertise. Journal of Sports Sciences, 31(16), 1806-1814.",
    "Zawi, K., & Spinks, W. (2008). Biomechanical analysis of goalkeeping performance. International Journal of Performance Analysis in Sport.",
    "Savelsbergh, G. J. P., et al. (2002). Visual search, anticipation and expertise in soccer goalkeepers. Journal of Sports Sciences, 20(3), 279-287.",
    "Franks, I. M., & Miller, G. (1986). Eyewitness testimony in sport. Journal of Sport Behavior, 9(1), 38-45."
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Header */}
      <div className="relative h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        {/* Field Hockey Goalkeeper Image */}
        <img
          src="/images/Marc du Toit 3.png"
          alt="Field Hockey Goalkeeper"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-4">
              Coaching
            </h1>
            <p className="text-3xl md:text-5xl font-extrabold text-white italic tracking-widest uppercase mb-4 drop-shadow-lg">
              WHAT'S NEXT?
            </p>
            <span className="inline-block bg-white text-black font-bold px-4 py-1 text-sm tracking-widest uppercase">
              Field Hockey Specialist
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Bio / Experience + Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Bio */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white">Elite Coaching Experience</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Benefit from years of university-level experience, including two years working with the <strong className="text-white">South African Men's National Indoor Team</strong> as a goalkeeper coach and trainer. We bring international standards to your personal development.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Marc’s professional background is anchored by his tenure at Stellenbosch University, where he trained Senior National Goalkeepers. His extensive experience in developing Junior National athletes and PSI All Stars stems from high-performance roles at Paul Roos Gimnasium, alongside various elite programs and sporting events across the Western Cape.
            </p>
          </div>

          {/* Right: Training Gallery */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Training Gallery
            </h2>
            <div className="relative aspect-square bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden group">
              {/* Active Slide */}
              {galleryMedia[currentSlide].type === 'video' ? (
                <video
                  src={galleryMedia[currentSlide].src}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  muted
                />
              ) : (
                <img
                  src={galleryMedia[currentSlide].src}
                  alt="Training Moment"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white/20 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white/20 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {galleryMedia.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid: Biomechanics & Tech Refinement (Refactored into blocks) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-white/30 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Shield className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Biomechanical Analysis</h2>
            <p className="text-gray-300 leading-relaxed">
              We don't just teach you to stop the ball; we teach you how to move. By focusing on biomechanics, we create efficiency of movement. This allows goalkeepers to cover more goal area with less effort, ensuring they are always in the optimal position to make the best possible save.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-white/30 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Zap className="w-7 h-7 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Technical Refinement</h2>
            <p className="text-gray-300 leading-relaxed">
              Through rigorous video analysis, we show goalkeepers exactly what they need to improve on. Visual feedback is critical for correcting form errors that aren't felt in the moment. We break down footwork, hand positioning, and decision-making processes.
            </p>
          </div>

        </div>

        {/* Analysis Workflow Section */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row gap-12 items-center">

            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-6">Professional Video Analysis</h2>
              <p className="text-gray-300 mb-8">
                We utilize the <strong>CoachNow Analysis App</strong> to provide frame-by-frame breakdowns, telestration, and voiceover feedback. Every session is an opportunity for deep learning.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-neutral-800 p-3 rounded-lg">
                    <MonitorPlay className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">CoachNow Markup</h3>
                    <p className="text-sm text-gray-400">Detailed annotations on your save technique, showing angles and timing adjustments visually.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-neutral-800 p-3 rounded-lg">
                    <UploadCloud className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Cloud Storage</h3>
                    <p className="text-sm text-gray-400">All footage (Raw and Edited) is uploaded to a dedicated Google Drive folder for you to access, download, and review anytime.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 w-full">
              {/* Fake Video Player UI */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-700 bg-neutral-900 aspect-video group">
                <video
                  src="/videos/Coach Now Video.mp4"
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  muted
                  loop
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2 uppercase tracking-widest">Example Analysis Interface</p>
            </div>

          </div>
        </div>

        {/* CNS & Fatigue Section (Moved Lower) */}
        <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 mb-20">
          <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-white mb-2">CNS & Fatigue Management</h2>
              <p className="text-gray-400 mb-3">
                Peak performance requires optimal recovery. We monitor the Central Nervous System (CNS) on a weekly basis to gauge fatigue accumulation.
              </p>
              <p className="text-gray-400 text-sm">
                This allows us to customize training sessions in real-time—pushing when you are ready, and pulling back to facilitate supercompensation when needed, ensuring you are always training at the edge of your capability without breaking.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-800 pt-16 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Coaching Packages</h2>
            <p className="text-gray-400">Flexible options for every stage of your development.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export default Goalkeeper;