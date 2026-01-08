import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Brain, Activity, Shield, Check, Info, ArrowRight, Zap, PlayCircle, BarChart2, Target } from 'lucide-react';

const ApexLab: React.FC = () => {
    return (
        <div className="min-h-screen bg-black">
            {/* 1. HERO SECTION */}
            <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden px-4">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black z-10"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                </div>

                <div className="relative z-20 text-center max-w-4xl mx-auto space-y-8 animate-fade-in-up mt-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 backdrop-blur-md mb-4">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Now Live</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
                        Inside the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Apex Lab</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Where sports science meets elite execution. <br className="hidden md:block" />
                        Our portal is your <span className="text-white font-bold">24/7 high-performance command center</span>.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                        <Link to="/services" className="px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Start Your Journey
                        </Link>
                        <a href="#features" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-all backdrop-blur-sm">
                            Explore Features
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. THE FEATURE GRID (The Tools) */}
            <section id="features" className="py-24 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

                        {/* Video Lab */}
                        <div className="group relative bg-neutral-900/40 border border-neutral-800 p-10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Film className="w-32 h-32 text-blue-500" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="p-4 bg-blue-500/20 rounded-2xl w-fit">
                                    <Film className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tight">The Video Lab</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Frame-by-frame biomechanical analysis. Upload your movement, annotate with pro tools, and get professional technical feedback directly on your footage.
                                </p>
                                <ul className="space-y-3 pt-4">
                                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-green-500" /> <span>Precision Scrubbing & Zoom</span></li>
                                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-green-500" /> <span>Draw Force Vectors & Angles</span></li>
                                    <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-green-500" /> <span>Side-by-Side Comparison</span></li>
                                </ul>
                            </div>
                        </div>

                        {/* AI Agent */}
                        <div className="group relative bg-neutral-900/40 border border-neutral-800 p-10 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Brain className="w-32 h-32 text-purple-500" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="p-4 bg-purple-500/20 rounded-2xl w-fit">
                                    <Brain className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tight">AI Performance Agent</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Your 24/7 scientific advisor. Trained on your specific physiological data to provide instant recovery tips, training adjustments, and load management advice.
                                </p>
                                <div className="bg-black/50 p-4 rounded-xl border border-white/5 mt-4">
                                    <p className="text-xs text-gray-500 font-mono mb-2">USER: "I feel sore today."</p>
                                    <p className="text-sm text-purple-300 font-mono">AGENT: "Based on your 92% load yesterday, switch today's session to Zone 2 Recovery..."</p>
                                </div>
                            </div>
                        </div>

                        {/* Reporting Hub */}
                        <div className="group relative bg-neutral-900/40 border border-neutral-800 p-10 rounded-3xl overflow-hidden hover:border-green-500/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BarChart2 className="w-32 h-32 text-green-500" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="p-4 bg-green-500/20 rounded-2xl w-fit">
                                    <Activity className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tight">The Reporting Hub</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Dynamic data visualization. Track your 5 Pillars (Physical, Tactical, Technical, Psychological, Support) in real-time with automated PDF report generation.
                                </p>
                            </div>
                        </div>

                        {/* Wellness */}
                        <div className="group relative bg-neutral-900/40 border border-neutral-800 p-10 rounded-3xl overflow-hidden hover:border-yellow-500/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-32 h-32 text-yellow-500" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="p-4 bg-yellow-500/20 rounded-2xl w-fit">
                                    <Shield className="w-8 h-8 text-yellow-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tight">Wellness & Load</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Prevent injury before it happens. We monitor your central nervous system (CNS) and daily readiness to ensure you're always peaking, never breaking.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. ACCESS TABLE (Transparency Layer) */}
            <section className="py-24 px-4 bg-neutral-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white uppercase tracking-tight mb-4">Lab Access Levels</h2>
                        <p className="text-gray-400 text-lg">Choose the level of scientific support your career demands.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 text-left text-gray-500 font-bold uppercase tracking-widest text-sm border-b border-gray-800">Feature</th>
                                    <th className="p-6 text-center border-b border-gray-800 bg-neutral-900/50 rounded-t-2xl">
                                        <span className="block text-white font-black text-xl uppercase">Lab Entry</span>
                                        <span className="block text-gray-400 text-sm mt-1">R150 / mo</span>
                                    </th>
                                    <th className="p-6 text-center border-b border-gray-800">
                                        <span className="block text-white font-black text-xl uppercase">S&C Standard</span>
                                        <span className="block text-gray-400 text-sm mt-1">R500 / mo</span>
                                    </th>
                                    <th className="p-6 text-center border-b border-gray-800 relative overflow-hidden">
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-black text-xl uppercase">Elite / Apex</span>
                                        <span className="block text-gray-400 text-sm mt-1">R1500+ / mo</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-gray-300 font-medium">Video Lab Analysis</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-gray-300 font-medium">Goal Setting & Tracking</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-gray-300 font-medium">Wellness & Load Monitoring</td>
                                    <td className="p-6 text-center text-gray-600">-</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-gray-300 font-medium">Physical Results & Reporting</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-gray-300 font-medium">AI Performance Agent</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-gray-300 font-medium">Advanced Biomechanics (VALD)</td>
                                    <td className="p-6 text-center text-gray-600">-</td>
                                    <td className="p-6 text-center text-gray-600">-</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link to="/services" className="bg-white text-black font-black text-lg py-5 px-12 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform flex items-center gap-3">
                            Apply for Access <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default ApexLab;
