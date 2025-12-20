import React from 'react';
import { Check, Star, Zap, Shield, Trophy, Activity, ArrowRight, ExternalLink } from 'lucide-react';

const Services: React.FC = () => {
    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter uppercase mb-6">
                        Athlete Service Hub
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Select your pathway to elite performance. Direct access to our premium mentorship, programming, and coaching tiers.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* BUCKET 1: THE APEX MEMBERSHIP */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl hover:border-white transition-colors duration-300">
                        <div className="absolute top-0 w-full h-1 bg-white"></div>
                        <div className="p-8 pb-0">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-wide">The Apex Membership <span className="block text-sm not-italic font-normal text-gray-400 normal-case mt-1">(The Elite Tier)</span></h2>
                            <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                                The ultimate all-in-one elite performance program. Fully comprehensive support.
                            </p>
                        </div>

                        <div className="px-8 flex-grow">
                            <ul className="space-y-4 mb-8 text-gray-300 text-sm">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-white flex-shrink-0" />
                                    <span>Full Strength & Conditioning Program</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-white flex-shrink-0" />
                                    <span>Regular Performance Testing</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-white flex-shrink-0" />
                                    <span>Mentorship & Psych Skills</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-white flex-shrink-0" />
                                    <span className="font-bold text-white">25 Hours of 1-on-1 Coaching</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 pt-0 space-y-4 mt-auto">
                            <a
                                href="https://paystack.shop/pay/ApexMembership-Monthly"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-neutral-200 text-black hover:bg-white border border-transparent shadow hover:shadow-lg"
                            >
                                <span className="font-bold">Subscribe</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono py-1 px-2 rounded-md bg-black/10 text-black/80">R2,000/mo</span>
                                    <ExternalLink className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
                                </div>
                            </a>
                            <a
                                href="https://paystack.shop/pay/apexmembership-once-off"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-transparent border border-neutral-700 text-neutral-400 hover:text-white hover:border-white hover:bg-white/5"
                            >
                                <span className="font-bold">Pay Annual</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono py-1 px-2 rounded-md bg-white/10 text-white/80">R21,000/yr</span>
                                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* BUCKET 2: PERFORMANCE PROGRAMS & TESTING */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative hover:border-white transition-colors duration-300">
                        <div className="p-8 pb-0">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-wide">Performance S&C & Testing</h2>
                            <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                                Targeted 12-week blocks and objective data measurement through Vald technology.
                            </p>
                        </div>

                        <div className="px-8 flex-grow space-y-6">

                            {/* General 12-Week */}
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-white" /> 12-Week General Program
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <a href="https://paystack.shop/pay/12WeekGeneralProgram-Monthly" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-neutral-200 text-black hover:bg-white border border-transparent shadow hover:shadow-lg">
                                        <span className="font-bold">Subscribe</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono py-1 px-2 rounded-md bg-black/10 text-black/80">R350/mo</span>
                                            <ExternalLink className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>
                                    <a href="https://paystack.shop/pay/12weekgeneralprogram-onceoff" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-transparent border border-neutral-700 text-neutral-400 hover:text-white hover:border-white hover:bg-white/5">
                                        <span className="font-bold">Buy Once-off</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono py-1 px-2 rounded-md bg-white/10 text-white/80">R1,050</span>
                                            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Specific 12-Week */}
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-white" /> 12-Week Specific Program
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <a href="https://paystack.shop/pay/12WeekSpecifcProgram-Monthly" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-neutral-200 text-black hover:bg-white border border-transparent shadow hover:shadow-lg">
                                        <span className="font-bold">Subscribe</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono py-1 px-2 rounded-md bg-black/10 text-black/80">R500/mo</span>
                                            <ExternalLink className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>
                                    <a href="https://paystack.shop/pay/12weekspecifcprogram-onceoff" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-transparent border border-neutral-700 text-neutral-400 hover:text-white hover:border-white hover:bg-white/5">
                                        <span className="font-bold">Buy Once-off</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono py-1 px-2 rounded-md bg-white/10 text-white/80">R1,500</span>
                                            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Testing */}
                            <div>
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-white" /> Individual Testing
                                </h3>
                                <a href="https://paystack.shop/pay/testingdynamo" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-neutral-200 text-black hover:bg-white border border-transparent shadow hover:shadow-lg">
                                    <span className="font-bold">Book Test</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono py-1 px-2 rounded-md bg-black/10 text-black/80">R1,000</span>
                                        <ExternalLink className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
                                    </div>
                                </a>
                            </div>

                        </div>
                        <div className="p-8 mt-auto"></div>
                    </div>

                    {/* BUCKET 3: MENTORSHIP & COACHING PACKS */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative hover:border-white transition-colors duration-300">
                        <div className="absolute top-0 w-full h-1 bg-white"></div>
                        <div className="p-8 pb-0">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-wide">Mentorship & Coaching Packs</h2>
                            <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                                Professional guidance and technical refinement for goalkeepers and field athletes.
                            </p>
                        </div>

                        <div className="px-8 flex-grow space-y-6">

                            {/* Mentorship */}
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-white font-bold mb-2">Yearly Mentorship</h3>
                                <div className="flex flex-col gap-3">
                                    <a href="https://paystack.shop/pay/Mentorship-Monthly" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-neutral-200 text-black hover:bg-white border border-transparent shadow hover:shadow-lg">
                                        <span className="font-bold">Subscribe</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono py-1 px-2 rounded-md bg-black/10 text-black/80">R500/mo</span>
                                            <ExternalLink className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>
                                    <a href="https://paystack.shop/pay/mentorship-Onceoff" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-transparent border border-neutral-700 text-neutral-400 hover:text-white hover:border-white hover:bg-white/5">
                                        <span className="font-bold">Buy Once-off</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono py-1 px-2 rounded-md bg-white/10 text-white/80">R5,000</span>
                                            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* 5-Hour Pack */}
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-white font-bold mb-2">5-Hour Coaching Pack</h3>
                                <a href="https://paystack.shop/pay/5hourcoachingpack" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-neutral-200 text-black hover:bg-white border border-transparent shadow hover:shadow-lg">
                                    <span className="font-bold">Buy Pack</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono py-1 px-2 rounded-md bg-black/10 text-black/80">R2,500</span>
                                        <ExternalLink className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
                                    </div>
                                </a>
                            </div>

                            {/* 25-Hour Pack */}
                            <div>
                                <h3 className="text-white font-bold mb-2">25-Hour Coaching Pack</h3>
                                <div className="flex flex-col gap-3">
                                    <a href="https://paystack.shop/pay/25HourCoachingPack-Monthly" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-neutral-200 text-black hover:bg-white border border-transparent shadow hover:shadow-lg">
                                        <span className="font-bold">Sub Weekly</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono py-1 px-2 rounded-md bg-black/10 text-black/80">R833/mo</span>
                                            <ExternalLink className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>
                                    <a href="https://paystack.shop/pay/25hourcoachingpack-onceoff" target="_blank" rel="noreferrer" className="w-full py-3.5 px-5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group bg-transparent border border-neutral-700 text-neutral-400 hover:text-white hover:border-white hover:bg-white/5">
                                        <span className="font-bold">Buy Once-off</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono py-1 px-2 rounded-md bg-white/10 text-white/80">R9,000</span>
                                            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 mt-auto"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Services;
