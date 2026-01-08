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

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black z-10"></div>
          {/* Background Removed as per request */}
        </div>

        <div className="relative z-20 max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up pt-20 md:pt-32">
          <h1 className="text-6xl md:text-8xl font-bold font-sans text-white mb-10 tracking-tight drop-shadow-2xl uppercase">
            Apex Sports
          </h1>

          <div className="mb-10 relative group flex justify-center">
            <div className="absolute inset-0 bg-white/5 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <img
              src="/images/logo.png"
              alt="Apex Sports Logo"
              className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-2xl animate-pulse-slow"
            />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold italic font-sans text-white tracking-wide drop-shadow-lg uppercase">
            What's next
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <Link
              to="/services"
              className="group relative bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-wider overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-8 py-4 rounded-full font-bold uppercase tracking-wider text-white border border-white/20 hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
            >
              Apply for Elite
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 z-20 animate-bounce cursor-pointer">
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll to Explore</span>
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