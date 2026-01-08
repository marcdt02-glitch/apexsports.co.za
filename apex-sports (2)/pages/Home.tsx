import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApexLogo } from '../components/ApexLogo';
import { ArrowRight, Quote, Award, GraduationCap, Briefcase, ChevronRight, ChevronLeft, Mail, Trophy, Brain, Target, Zap, Users } from 'lucide-react';
import { ApplicationModal } from '../components/ApplicationModal';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Founder images for rotation
  const founderImages = [
    "/images/Marc du Toit 1.JPG",
    "/images/Marc du Toit 2.jpg"
  ];

  const [currentFounderIndex, setCurrentFounderIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    {
      name: "Daniella Marinus-Richards",
      role: "Parent",
      image: "/images/kiran-action.jpg",
      text: "Marc has not only been a coach but a mentor for Kiran this past year, on and off the field. He has helped Kiran achieve so much on the field physically, and off the field emotionally. He is a coach that goes the extra mile for his players and always take the time to give individual attention, feedback and ‘homework’. Working with Marc has taken Kiran’s game to the next level, as he focuses on the long term aspects and perfecting what has already been taught. Goalkeeping is not just about standing in a box, making sure the ball doesn’t pass you. It’s a mental game, with technicalities involved and Marc strives to help his keepers achieve their very best! He really is THAT crazy coach on a Sunday morning who you’ve booked an hour with, that turns into 2 hours. Because he’s passionate, and loves the game as much as your kid does!"
    },
    {
      name: "Jana-Mari Botha",
      role: "SA Ladies Outdoor Goalkeeper",
      image: "/images/jana-mari-botha.jpg",
      text: "Working with Marc du Toit was a great experience. His attention to detail and critical feedback stood out immediately, and within one session I saw clear improvements in areas I wanted to work on. He gave valuable insight into playing to my strengths and what to focus on going forward. Marc is extremely passionate about coaching, pushes you to be better, and makes the session both productive and enjoyable. I would highly recommend him to any goalkeeper wanting to train with purpose and precision."
    },
    {
      name: "Jacques Le Roux",
      role: "National GK Coach & Founder of JLR Hockey",
      image: "/images/jacques-le-roux.jpg",
      text: "Having worked alongside Marc for quite some time, I can confidently say that his passion for helping athletes excel, combined with his attention to detail and sport-specific conditioning expertise, make him a phenomenal coach. I have no doubt that any athlete who crosses paths with Apex Sports will see meaningful improvement in their performance."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFounderIndex((prev) => (prev + 1) % founderImages.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const nextFounderImage = () => setCurrentFounderIndex((prev) => (prev + 1) % founderImages.length);
  const prevFounderImage = () => setCurrentFounderIndex((prev) => (prev - 1 + founderImages.length) % founderImages.length);

  const nextTestimonial = () => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-black">

      {/* Hero Section (Video Header) */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black pt-20 pb-20">
        <div className="z-20 w-full max-w-6xl mx-auto space-y-12 px-4">
          {/* Video Container */}
          <div className="w-full aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-neutral-800 relative group">
            <iframe
              className="w-full h-full object-cover"
              src="https://www.youtube.com/embed/Q8YfGJwoTD8?rel=0&modestbranding=1"
              title="Deion Sanders Inspiration"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Text & CTAs */}
          <div className="text-center space-y-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              THE JOURNEY TO ELITE <span className="text-red-600">STARTS HERE.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium">
              Raising the floor. Smashing the ceiling. Welcome to the APEX Lab.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link
                to="/services"
                className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-gray-200 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-white/10"
              >
                Start Signup <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-transparent border border-neutral-700 text-white px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-neutral-800 transition-all hover:scale-105 flex items-center gap-2 ml-0 md:ml-4"
              >
                <Trophy className="w-5 h-5 text-yellow-500" />
                Apply for Elite
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 z-20 animate-bounce hidden md:block">
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll to Explore</span>
        </div>
      </section>
      {/* 5 Pillars Section */}
      <section className="py-24 px-4 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
              The 5 Pillars of <span className="text-red-600">High Performance</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              The APEX System. A holistic framework designed to build the complete athlete.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              {
                icon: Brain,
                title: 'Psychological',
                sub: 'Focus & Resilience',
                desc: 'Mental toughness for the game and the boardroom.'
              },
              {
                icon: Target,
                title: 'Tactical',
                sub: 'Decision Making',
                desc: "Strategy on the field and in life's challenges."
              },
              {
                icon: Zap,
                title: 'Physical',
                sub: 'Energy & Vitality',
                desc: 'Building a body that fuels your ambition.'
              },
              {
                icon: Award,
                title: 'Technical',
                sub: 'Mastery of Craft',
                desc: 'Perfecting the mechanics of movement and skill.'
              },
              {
                icon: Users,
                title: 'Support',
                sub: 'The Foundation',
                desc: 'Managing your environment, nutrition, and team.'
              }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-black/50 p-6 rounded-2xl border border-neutral-800 hover:border-white/30 transition-all hover:-translate-y-2 group">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                  <pillar.icon className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white uppercase mb-1">{pillar.title}</h3>
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-4">{pillar.sub}</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Holistic CTA */}
          <div className="mt-16 text-center border-t border-neutral-800 pt-16">
            <p className="text-xl md:text-2xl text-white font-medium italic max-w-4xl mx-auto leading-relaxed">
              "At APEX, we don't just train athletes; we develop high-performers. Our holistic approach ensures that the discipline you build in the lab translates to success in every sector of your life."
            </p>
          </div>
        </div>
      </section>
      {/* Services Section - Interactive Images */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">

          {/* S&C Card */}
          <Link to="/strength" className="group relative overflow-hidden rounded-xl h-[400px] md:h-full border border-neutral-800 hover:border-white/30 transition-all duration-300">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-all duration-500 z-10"></div>
            {/* Image: Weights/Gym - specific Gym ID */}
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80"
              alt="Strength and Conditioning Gym"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2 translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300 uppercase tracking-wider">
                Strength & Conditioning
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Gym-based training focused on power, speed, and physiological adaptation.
              </p>
              <div className="flex items-center gap-2 text-sm text-white font-semibold opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Mentorship Card */}
          <Link to="/mentorship" className="group relative overflow-hidden rounded-xl h-[400px] md:h-full border border-neutral-800 hover:border-white/30 transition-all duration-300">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-all duration-500 z-10"></div>
            {/* Image: Laptop/Analysis - specific Film Study ID */}
            <img
              src="/images/mentorship-header.png"
              alt="Mentorship Analysis Film Study"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2 translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300 uppercase tracking-wider">
                Mentorship
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Film study, goal setting, and psychological skills training.
              </p>
              <div className="flex items-center gap-2 text-sm text-white font-semibold opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Psychological Skills</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Coaching Card (formerly Goalkeeper) */}
          <Link to="/goalkeeper" className="group relative overflow-hidden rounded-xl h-[400px] md:h-full border border-neutral-800 hover:border-white/30 transition-all duration-300">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-all duration-500 z-10"></div>
            {/* Image: Goalkeeper Training - specific training ID */}
            <img
              src="/images/coaching-homepage.png"
              alt="Coaching Training"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2 translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300 uppercase tracking-wider">
                Coaching
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Specialized field hockey goalkeeper training and biomechanical analysis.
              </p>
              <div className="flex items-center gap-2 text-sm text-white font-semibold opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Form & Biomechanics</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-neutral-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex flex-col justify-center">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-white"></span>
                Our Mission
              </h2>
              <p className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
                To provide world-class support to individuals and teams who are looking to achieve their goals.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-white pl-4">What sets us apart?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-gray-300 text-lg">
                      <div className="w-2 h-2 bg-white rotate-45"></div> Scientific Rigor
                    </li>
                    <li className="flex items-center gap-3 text-gray-300 text-lg">
                      <div className="w-2 h-2 bg-white rotate-45"></div> Technological Innovation
                    </li>
                    <li className="flex items-center gap-3 text-gray-300 text-lg">
                      <div className="w-2 h-2 bg-white rotate-45"></div> Adaptive Innovation
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-black p-10 rounded-2xl border border-neutral-800 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Our Core Values</h2>
                <div className="space-y-10">
                  <div className="group cursor-default">
                    <h3 className="text-4xl font-extrabold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all duration-300">Passion</h3>
                    <p className="text-gray-500 mt-2 pl-1 border-l-2 border-transparent group-hover:border-white transition-all duration-300">The fuel that drives us to exceed expectations every single day.</p>
                  </div>
                  <div className="group cursor-default">
                    <h3 className="text-4xl font-extrabold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all duration-300">Persistence</h3>
                    <p className="text-gray-500 mt-2 pl-1 border-l-2 border-transparent group-hover:border-white transition-all duration-300">The unwavering commitment to the process, regardless of obstacles.</p>
                  </div>
                  <div className="group cursor-default">
                    <h3 className="text-4xl font-extrabold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all duration-300">Precision</h3>
                    <p className="text-gray-500 mt-2 pl-1 border-l-2 border-transparent group-hover:border-white transition-all duration-300">The attention to detail in measurement, analysis, and execution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Partners Section */}
      <section className="py-20 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white uppercase tracking-wider">
            Our Partners
          </h2>
          <div className="flex justify-center items-center">
            <p className="text-xl md:text-2xl text-gray-500 italic font-light tracking-wide">
              Coming Soon...
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-4 bg-black relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Image Side - Revolving Photo Frame */}
            <div className="lg:w-2/5 relative">
              <div className="absolute top-0 -left-4 w-full h-full border-2 border-white rounded-2xl transform -translate-x-4 -translate-y-4"></div>
              <div className="relative z-10 w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 group">
                <img
                  src={founderImages[currentFounderIndex]}
                  alt="Marc du Toit"
                  className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                />

                {/* Carousel Controls */}
                <button
                  onClick={prevFounderImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white/20 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextFounderImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white/20 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {founderImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentFounderIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:w-3/5">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-2">About the Founder</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Marc du Toit</h3>

              <div className="space-y-8 text-gray-300 leading-relaxed">
                <p>
                  Marc du Toit is a Sports Scientist dedicated to bridging the gap between scientific theory and on-field performance. Holding a <strong className="text-white">BSc in Sports Science</strong> and <strong className="text-white">Honours in Performance Sport (Cum Laude)</strong>, he is currently pursuing his <strong className="text-white">Masters in Biomechanics</strong>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <GraduationCap className="w-5 h-5 text-white" />
                      <h4 className="font-bold text-white text-sm uppercase">Education</h4>
                    </div>
                    <ul className="text-sm space-y-2 text-gray-400">
                      <li>• BSc Sports Science</li>
                      <li>• Hons. Performance Sport (Cum Laude)</li>
                      <li>• Masters Candidate (Biomechanics)</li>
                    </ul>
                  </div>

                  <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-5 h-5 text-white" />
                      <h4 className="font-bold text-white text-sm uppercase">Athlete History</h4>
                    </div>
                    <ul className="text-sm space-y-2 text-gray-400">
                      <li>• Junior National Squad Selection</li>
                      <li>• Stellenbosch University 1st Team</li>
                      <li>• Maties High Performance Unit</li>
                    </ul>
                  </div>

                  <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Briefcase className="w-5 h-5 text-white" />
                      <h4 className="font-bold text-white text-sm uppercase">Professional Experience</h4>
                    </div>
                    <ul className="text-sm text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      <li>• <strong className="text-gray-300">SA Indoor Hockey Team</strong> (GK Trainer)</li>
                      <li>• <strong className="text-gray-300">Maties High Performance</strong> (GK Trainer)</li>
                      <li>• <strong className="text-gray-300">Western Province Schools HP</strong> (Trainer)</li>
                      <li>• <strong className="text-gray-300">Boland Schools HP</strong> (Trainer & Selector)</li>
                      <li>• <strong className="text-gray-300">Paul Roos & Bloemhof</strong> (Coach)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="py-20 px-4 bg-neutral-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-16">Testimonials</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-black p-8 md:p-12 rounded-3xl border border-neutral-800 relative min-h-[400px] flex flex-col justify-center">
              <Quote className="absolute top-8 left-8 text-white/10 w-16 h-16" />

              <div className="relative z-10">
                <p className="text-gray-300 italic text-lg md:text-xl leading-relaxed mb-10 text-center">
                  "{testimonials[currentTestimonialIndex].text}"
                </p>

                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden border-2 border-white/20">
                    <img src={testimonials[currentTestimonialIndex].image} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-white font-bold text-lg">{testimonials[currentTestimonialIndex].name}</h4>
                    <span className="text-sm text-gray-500">{testimonials[currentTestimonialIndex].role}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {testimonials.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentTestimonialIndex ? 'bg-white w-4' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specific Solutions / Contact Section */}
      <section className="py-24 px-4 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6 tracking-wide uppercase">Contact & Service</h2>
          <div id="contact" className="space-y-6 text-gray-300">
            <p className="text-lg">
              Serving the <strong>Greater Stellenbosch Region</strong> and surrounding areas.
            </p>
            <p className="text-lg">
              <strong className="text-white block mb-2">Service Area:</strong>
              Proudly serving <span className="text-white">Somerset West, Stellenbosch & Cape Town</span>
            </p>

            <p className="text-lg">
              <strong className="text-white block mb-2">Contact:</strong>
              <a href="tel:+27823788258" className="hover:text-white transition-colors block">+27 82 378 8258</a>
              <a href="mailto:marc@apexsports.co.za" className="hover:text-white transition-colors block">marc@apexsports.co.za</a>
            </p>

            <p className="text-sm text-gray-500 italic mt-8 border-t border-gray-800 pt-4 max-w-lg mx-auto">
              Note: Apex Sports is a mobile service business. No physical gear is shipped; all sessions are delivered on-site in the Stellenbosch region.
            </p>
          </div>
          <div className="mt-8">
            <a href="https://wa.me/27823788258" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
              <Mail className="w-5 h-5" />
              Request a Consultation
            </a>
          </div>
        </div>
      </section>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tierName="Apex Membership (Application)"
      />
    </div>
  );
};

export default Home;