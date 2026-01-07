import React, { useState } from 'react';
import { Check, Star, Zap, Shield, Trophy, Activity, ArrowRight, ExternalLink, ChevronRight, Users, Brain, Dumbbell } from 'lucide-react';
import { ApplicationModal } from '../components/ApplicationModal';

const Services: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTier, setModalTier] = useState('');

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 text-center border-b border-neutral-900">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6">
                        The Service <span className="text-red-600">Hub</span>
                    </h1>
                    <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
                        Select your pathway to elite performance. Direct access to our premium mentorship, programming, and coaching tiers.
                    </p>
                </div>
            </div>

            {/* SECTION 1: THE APEX MEMBERSHIP (Black) */}
            <div className="py-24 px-4 bg-black border-b border-neutral-900">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-black" />
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-wide mb-2">
                                The Apex Membership
                            </h2>
                            <span className="inline-block bg-neutral-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-neutral-700">The Elite Tier</span>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            The ultimate all-in-one elite performance program. This is for the athlete who wants fully comprehensive support, leaving no stone unturned. We combine S&C, Mentorship, and Technical Coaching into one seamless ecosystem.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span><strong className="text-white">Full S&C Programming:</strong> Customized blocks based on your season.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span><strong className="text-white">Performance Testing:</strong> Regular data capture via VALD technology.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span><strong className="text-white">Mentorship Access:</strong> "CEO of You" curriculum and psych skills.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span><strong className="text-white">25 Hours Coaching:</strong> 1-on-1 technical work (Field or Keeper).</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-neutral-900/50 p-8 rounded-3xl border border-neutral-800 space-y-6 relative overflow-hidden">
                        {/* Value Badge */}
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest shadow-lg z-10">
                            Only 5 Spots Available
                        </div>

                        <div className="space-y-4">
                            {/* Monthly Option - VETTING PATH */}
                            <button
                                onClick={() => { setModalTier("Apex Membership (Monthly)"); setIsModalOpen(true); }}
                                className="w-full flex items-center justify-between bg-white text-black font-black text-lg py-6 px-8 rounded-xl hover:bg-gray-200 transition-all hover:scale-[1.02] group shadow-xl shadow-white/5"
                            >
                                <span>Monthly Subscription</span>
                                <div className="text-right">
                                    <span className="block text-2xl font-black">R2,500</span>
                                    <span className="text-xs text-gray-500 font-normal">Per Month</span>
                                </div>
                            </button>

                            {/* Annual Option (High Value Anchor) - VETTING PATH */}
                            <button
                                onClick={() => { setModalTier("Apex Membership (Annual)"); setIsModalOpen(true); }}
                                className="w-full block bg-neutral-800 text-white p-6 rounded-xl hover:bg-neutral-700 transition-all hover:scale-[1.02] group border border-neutral-700 relative overflow-hidden text-left"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-2xl font-black text-white">Upfront Payment</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-gray-500 line-through text-sm font-bold">R29,000</span>
                                            <span className="text-green-400 text-sm font-bold animate-pulse">Save R2,000</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-3xl font-black text-white">R27,000</span>
                                        <span className="text-xs text-gray-400">Once-off</span>
                                    </div>
                                </div>

                                {/* Value Stack Table (New) */}
                                <div className="bg-black/40 rounded-lg p-3 mb-4 text-xs space-y-1">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Yearly S&C + Testing</span>
                                        <span className="line-through">R15,000</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Mentorship Curriculum</span>
                                        <span className="line-through">R5,000</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>25 Hours Technical</span>
                                        <span className="line-through">R9,000</span>
                                    </div>
                                    <div className="border-t border-gray-700 pt-1 flex justify-between font-bold text-white mt-1">
                                        <span>Total Value</span>
                                        <span>R29,000</span>
                                    </div>
                                </div>

                                {/* Savings Bar Visual */}
                                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden flex mb-2">
                                    <div className="bg-white w-[93%] h-full"></div>
                                    <div className="bg-green-500 w-[7%] h-full"></div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Instant R2,000 Savings Applied</span>
                                    <span className="text-white font-bold bg-white/20 px-3 py-1 rounded text-xs uppercase">Apply Now</span>
                                </div>
                            </button>
                        </div>
                        <p className="text-center text-gray-500 text-xs mt-4">Includes priority support, full kit package, and 24/7 access.</p>
                    </div>
                </div>
            </div>

            {/* SECTION 2: S&C & TESTING (Dark Charcoal) */}
            <div className="py-24 px-4 bg-[#0a0a0a] border-b border-neutral-900">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
                    <div className="order-2 lg:order-1 bg-black/50 p-8 rounded-3xl border border-neutral-800 space-y-6">
                        <div className="space-y-6">
                            {/* Option A */}
                            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                                    <Zap className="text-yellow-500" /> 12-Week General Program
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <a href="https://paystack.shop/pay/12weekgeneralprogram-onceoff" target="_blank" rel="noreferrer" className="bg-black hover:bg-neutral-800 text-center py-3 rounded-lg text-sm text-gray-300 transition-colors border border-neutral-700">
                                        Once-off: <strong className="text-white block text-lg">R1,500</strong>
                                    </a>
                                    <a href="https://paystack.shop/pay/12WeekGeneralProgram-Monthly" target="_blank" rel="noreferrer" className="bg-black hover:bg-neutral-800 text-center py-3 rounded-lg text-sm text-gray-300 transition-colors border border-neutral-700">
                                        Monthly: <strong className="text-white block text-lg">R500</strong>
                                    </a>
                                </div>
                            </div>

                            {/* Option B - VETTING PATH */}
                            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                                    <Shield className="text-blue-500" /> 12-Week Specific Program
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => { setModalTier("12-Week Specific (Annual)"); setIsModalOpen(true); }} className="bg-black hover:bg-neutral-800 text-center py-3 rounded-lg text-sm text-gray-300 transition-colors border border-neutral-700">
                                        Annual: <strong className="text-white block text-lg">R15,000</strong>
                                    </button>
                                    <button onClick={() => { setModalTier("12-Week Specific (Monthly)"); setIsModalOpen(true); }} className="bg-black hover:bg-neutral-800 text-center py-3 rounded-lg text-sm text-gray-300 transition-colors border border-neutral-700">
                                        Monthly: <strong className="text-white block text-lg">R1,500</strong>
                                    </button>
                                </div>
                            </div>

                            {/* Option C - VETTING PATH (TESTING) */}
                            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                                    <Activity className="text-red-500" /> VALD Performance Testing
                                </h3>
                                <button onClick={() => { setModalTier("VALD Performance Testing"); setIsModalOpen(true); }} className="block w-full bg-white hover:bg-gray-200 text-black text-center py-3 rounded-lg font-bold transition-colors">
                                    Book Dynamo Protocol: R1,000
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-3 font-medium">
                                    Subject to availability—Application required.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800">
                            <Dumbbell className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-wide mb-2">
                                S&C + Testing
                            </h2>
                            <span className="inline-block bg-neutral-800 text-gray-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-neutral-700">Data-Driven Training</span>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Stop guessing. Targeted 12-week blocks designed to increase force output, durability, and match readiness. All programs are validated by objective data measurement through our VALD performance systems.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-4">
                                <ChevronRight className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                <span><strong className="text-white">General Program:</strong> Solid foundation for developing athletes.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <ChevronRight className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                <span><strong className="text-white">Specific Program:</strong> Tailored to position and injury history.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <ChevronRight className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                <span><strong className="text-white">Dynamo Testing:</strong> Force plates & dynamometry profiling.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* SECTION 3: TECHNICAL COACHING (Black) */}
            <div className="py-24 px-4 bg-black border-b border-neutral-900">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center">
                            <Star className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-wide mb-2">
                                Technical Coaching
                            </h2>
                            <span className="inline-block bg-neutral-800 text-gray-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-neutral-700">Elite Skill Acquisition</span>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Professional guidance and technical refinement for goalkeepers and field athletes. This is about the details—game intelligence, tactical understanding, and specific skill execution.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                                <span><strong className="text-white">1-on-1 Sessions:</strong> Personalized attention on the pitch.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                                <span><strong className="text-white">Video Analysis:</strong> Technical breakdown of your mechanics.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-neutral-900/50 p-8 rounded-3xl border border-neutral-800 space-y-4">
                        <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-neutral-800">
                            <span className="text-white font-bold">5-Hour Coaching Pack</span>
                            <button onClick={() => { setModalTier("5-Hour Coaching Pack"); setIsModalOpen(true); }} className="text-white underline text-sm hover:text-gray-300">
                                Apply for R2,500
                            </button>
                        </div>

                        {/* 10 HOUR PACK (NEW) */}
                        <div className="flex items-center justify-between bg-black p-4 rounded-xl border border-neutral-800">
                            <span className="text-white font-bold">10-Hour Coaching Pack</span>
                            <button onClick={() => { setModalTier("10-Hour Coaching Pack"); setIsModalOpen(true); }} className="text-white underline text-sm hover:text-gray-300">
                                Apply for R4,500
                            </button>
                        </div>

                        {/* 25-Hour Pack with Savings Logic */}
                        <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-lg animate-pulse">
                                BEST VALUE
                            </div>
                            <h3 className="text-white font-bold mb-2">25-Hour Elite Pack</h3>
                            <p className="text-gray-400 text-xs mb-4">Serious technical development for committed athletes.</p>

                            <div className="flex items-end justify-between mb-4">
                                <div>
                                    <p className="text-gray-500 line-through text-xs font-bold">Standard: R12,500</p>
                                    <p className="text-2xl font-black text-white">R9,000</p>
                                </div>
                                <span className="text-xs bg-white text-black font-bold px-2 py-1 rounded">Save R3,500</span>
                            </div>

                            <button onClick={() => { setModalTier("25-Hour Elite Pack (Once-off)"); setIsModalOpen(true); }} className="block w-full bg-white hover:bg-gray-200 text-black text-center py-3 rounded-lg font-bold transition-colors mb-2">
                                Apply for Offer
                            </button>
                            <div className="text-center">
                                <button onClick={() => { setModalTier("25-Hour Elite Pack (Monthly)"); setIsModalOpen(true); }} className="text-xs text-gray-400 hover:text-white underline">
                                    Or apply for R833/mo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: MENTORSHIP (Charcoal) */}
            <div className="py-24 px-4 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
                    <div className="order-2 lg:order-1 bg-black/50 p-8 rounded-3xl border border-neutral-800 space-y-6">
                        {/* Goal Setting Access (New) */}
                        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-neutral-800 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                STARTER
                            </div>
                            <h3 className="text-white font-bold mb-2 text-xl">Goal Setting Access</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Includes <strong>Psychological Skills Assessment</strong>.
                            </p>
                            <a href="https://paystack.shop/pay/GoalSettingAccess-Monthly" target="_blank" rel="noreferrer" className="block w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-700">
                                Subscribe: R150/pm
                            </a>
                        </div>

                        {/* Full Mentorship */}
                        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 text-center">
                            <h3 className="text-white font-bold mb-2 text-xl">The Mentorship</h3>
                            <p className="text-gray-400 text-sm mb-6">Full access to our psychological curriculum, weekly seminars, and resource library.</p>
                            <div className="space-y-4">
                                <a href="https://paystack.shop/pay/mentorship-Onceoff" target="_blank" rel="noreferrer" className="block w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors">
                                    Once-off: R5,000
                                </a>
                                <a href="https://paystack.shop/pay/Mentorship-Monthly" target="_blank" rel="noreferrer" className="block w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-700">
                                    Monthly: R500
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-wide mb-2">
                                The Mentorship
                            </h2>
                            <span className="inline-block bg-neutral-800 text-gray-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-neutral-700">Psychological Edge</span>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            "The CEO of You." This is our flagship curriculum designed to build antifragile athletes. We develop the person behind the player through structured modules on leadership, resilience, and emotional control.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                <span><strong className="text-white">Goal Setting:</strong> Strategic planning for your career.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <Check className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                <span><strong className="text-white">Mental Skills:</strong> Visualization, breathwork, and focus.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* SECTION 4: TEAM PACKAGES (New) */}
            <div className="py-24 px-4 bg-neutral-900 border-t border-neutral-800">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6">Coming Soon</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-wide mb-8">
                        Team Packages
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-black p-8 rounded-2xl border border-neutral-800">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Tier 1</h3>
                            <h4 className="text-xl font-bold text-white mb-4">Performance & Wellness Monitoring Package</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                <strong className="text-white">Focus:</strong> Data-driven physical readiness and psychological wellness tracking to optimize team load management.
                            </p>
                        </div>
                        <div className="bg-black p-8 rounded-2xl border border-neutral-800">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Tier 2</h3>
                            <h4 className="text-xl font-bold text-white mb-4">Elite Team Performance Package</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                <strong className="text-white">Focus:</strong> Comprehensive S&C integration, advanced mental skills training (PST), and high-performance laboratory testing.
                            </p>
                        </div>
                    </div>
                    <a href="mailto:performance@apexsports.co.za?subject=Team Package Inquiry" className="inline-flex items-center gap-2 bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                        <Users className="w-5 h-5" />
                        Inquire for Team Rates
                    </a>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 px-4 text-center bg-[#0a0a0a] border-t border-neutral-900">
                <h2 className="text-3xl font-bold text-white mb-6">Unsure which pathway fits?</h2>
                <a href="https://wa.me/27721234567" className="inline-flex items-center gap-2 bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-gray-200 transition-colors">
                    Chat with Marc <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </div>
            {/* Modal */ }
    <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tierName={modalTier}
    />
        </div >
    );
};

export default Services;
