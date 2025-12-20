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
                    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl shadow-green-900/10 hover:border-green-500/50 transition-colors duration-300">
                        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-green-600 to-green-400"></div>
                        <div className="p-8 pb-0">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                                <Trophy className="w-6 h-6 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-wide">The Apex Membership <span className="block text-sm not-italic font-normal text-gray-400 normal-case mt-1">(The Elite Tier)</span></h2>
                            <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                                The ultimate all-in-one elite performance program. Fully comprehensive support.
                            </p>
                        </div>

                        <div className="px-8 flex-grow">
                            <ul className="space-y-4 mb-8 text-gray-300 text-sm">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Full Strength & Conditioning Program</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Regular Performance Testing</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Mentorship & Psych Skills</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="font-bold text-white">25 Hours of 1-on-1 Coaching</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 pt-0 space-y-4 mt-auto">
                            <a
                                href="https://paystack.shop/pay/ApexMembership-Monthly"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-between bg-white text-black font-bold py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors group"
                            >
                                <span>Monthly Subscription</span>
                                <span className="flex items-center gap-2">
                                    R2,000 <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-black" />
                                </span>
                            </a>
                            <a
                                href="https://paystack.shop/pay/apexmembership-once-off"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-between bg-neutral-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-600 group"
                            >
                                <span>Annual Once-off <span className="block text-xs font-normal text-green-400">Save R3,000</span></span>
                                <span className="flex items-center gap-2">
                                    R21,000 <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* BUCKET 2: PERFORMANCE PROGRAMS & TESTING */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative hover:border-neutral-600 transition-colors duration-300">
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
                                    <Zap className="w-4 h-4 text-yellow-500" /> 12-Week General Program
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <a href="https://paystack.shop/pay/12weekgeneralprogram-onceoff" target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors">
                                        Once-off: <strong className="text-white">R1,050</strong>
                                    </a>
                                    <a href="https://paystack.shop/pay/12WeekGeneralProgram-Monthly" target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors">
                                        Monthly: <strong className="text-white">R350</strong>
                                    </a>
                                </div>
                            </div>

                            {/* Specific 12-Week */}
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-400" /> 12-Week Specific Program
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <a href="https://paystack.shop/pay/12weekspecifcprogram-onceoff" target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors">
                                        Once-off: <strong className="text-white">R1,500</strong>
                                    </a>
                                    <a href="https://paystack.shop/pay/12WeekSpecifcProgram-Monthly" target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors">
                                        Monthly: <strong className="text-white">R500</strong>
                                    </a>
                                </div>
                            </div>

                            {/* Testing */}
                            <div>
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-purple-500" /> Individual Testing
                                </h3>
                                <a href="https://paystack.shop/pay/testingdynamo" target="_blank" rel="noreferrer" className="block w-full bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-sm text-white transition-colors">
                                    Book Dynamo Set: <strong>R1,000</strong>
                                </a>
                            </div>

                        </div>
                        <div className="p-8 mt-auto"></div>
                    </div>

                    {/* BUCKET 3: MENTORSHIP & COACHING PACKS */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative hover:border-red-500/50 transition-colors duration-300">
                        <div className="absolute top-0 w-full h-1 bg-red-600"></div>
                        <div className="p-8 pb-0">
                            <div className="w-12 h-12 bg-red-900/20 rounded-xl flex items-center justify-center mb-6">
                                <Star className="w-6 h-6 text-red-500" />
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
                                <div className="grid grid-cols-2 gap-2">
                                    <a href="https://paystack.shop/pay/mentorship-Onceoff" target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors">
                                        Once-off: <strong className="text-white">R5,000</strong>
                                    </a>
                                    <a href="https://paystack.shop/pay/Mentorship-Monthly" target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors">
                                        Monthly: <strong className="text-white">R500</strong>
                                    </a>
                                </div>
                            </div>

                            {/* 5-Hour Pack */}
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-white font-bold mb-2">5-Hour Coaching Pack</h3>
                                <a href="https://paystack.shop/pay/5hourcoachingpack" target="_blank" rel="noreferrer" className="block w-full bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-sm text-white transition-colors">
                                    Buy Pack: <strong>R2,500</strong>
                                </a>
                            </div>

                            {/* 25-Hour Pack */}
                            <div>
                                <h3 className="text-white font-bold mb-2">25-Hour Coaching Pack</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <a href="https://paystack.shop/pay/25hourcoachingpack-onceoff" target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors">
                                        Once-off: <strong className="text-white">R9,000</strong>
                                    </a>
                                    <a href="https://paystack.shop/pay/25HourCoachingPack-Monthly" target="_blank" rel="noreferrer" className="bg-neutral-800 hover:bg-neutral-700 text-center py-2 rounded text-xs text-gray-300 transition-colors">
                                        Monthly: <strong className="text-white">R833.33</strong>
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
