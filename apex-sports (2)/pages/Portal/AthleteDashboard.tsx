import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { analyzeAthlete } from '../../utils/dataEngine';
import SafetyGuard from '../../components/SafetyGuard';
import {
    RadialBarChart, RadialBar, PolarAngleAxis,
    Radar, RadarChart, PolarGrid, PolarRadiusAxis,
    Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Legend
} from 'recharts';
import {
    AlertTriangle, CheckCircle, UploadCloud, AlertCircle, Zap,
    LayoutDashboard, Target, BookOpen, FileText, Menu, X, Save, ExternalLink,
    Activity, Shield, Battery, TrendingUp, ChevronRight, Lock, User, LogOut, MonitorPlay, Home, CheckSquare, BarChart2, Sliders, Layers, Info, Video
} from 'lucide-react';
import { VideoLab } from '../../components/VideoLab/VideoLab';
import { ApexAgent } from '../../components/ApexAI/ApexAgent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- UI Components ---

const CircleProgress = ({ percentage, color, label, icon: Icon }: { percentage: number, color: string, label: string, icon: any }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#262626" strokeWidth="6" />
                    <circle
                        cx="40" cy="40" r={radius} fill="transparent" stroke={color} strokeWidth="6"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <Icon className="w-5 h-5 mb-1" style={{ color }} />
                    <span className="text-2xl sm:text-3xl font-black text-white">{percentage}</span>
                </div>
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
    );
};

const MetricCard = ({ label, value, subtext }: { label: string, value: string | number, subtext?: string }) => (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:border-neutral-700 transition-colors">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        {subtext && <p className="text-[10px] text-gray-600 mt-1">{subtext}</p>}
    </div>
);

// --- Main Dashboard ---

// Helper Functions for Traffic Light Logic
const getRomColor = (label: string, value: number) => {
    if (label.includes('Hamstring')) { // Target 90
        if (value > 90) return 'text-green-500';
        if (value >= 80) return 'text-yellow-500';
        return 'text-red-500';
    }
    if (label.includes('Ankle')) { // Target 40
        if (value > 40) return 'text-green-500';
        if (value >= 35) return 'text-yellow-500';
        return 'text-red-500';
    }
    // Default High is Good (Hip Ext etc)
    if (value > 15) return 'text-green-500';
    return 'text-white';
};

const getAsymmetryColor = (l: number, r: number) => {
    if (!l || !r) return 'text-gray-500';
    const diff = Math.abs(l - r);
    const max = Math.max(l, r);
    const pct = (diff / max) * 100;

    if (pct <= 10) return 'text-green-500';
    if (pct <= 20) return 'text-yellow-500';
    return 'text-red-500';
};

const getReadinessColor = (recent: number, max: number) => {
    if (!max) return '#3b82f6'; // Default Blue if no baseline
    const pct = (recent / max) * 100;
    if (pct >= 95) return '#22c55e'; // Green
    if (pct >= 90) return '#eab308'; // Yellow
    return '#ef4444'; // Red
};

import Loading from '../../components/Loading';
import GoalSetting from '../../components/GoalSetting';
import PortalMentorship from '../../components/Portal/Mentorship/PortalMentorship';

// ... (Keep existing top level imports if possible, or just ignore this comment and user the view to know what to keep)
// Actually I need to be careful not to delete the OTHER imports.
// The file view shows lines 1-19 are imports.
// I will target the lines from 94 down to where the duplication ends.

const AthleteDashboard: React.FC = () => {
    const { athleteId } = useParams<{ athleteId: string }>();
    const { getAthlete } = useData();
    const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'goals' | 'library' | 'reports' | 'wellness' | 'mentorship' | 'coaching' | 'pillars' | 'videolab'>('home');
    const [clinicalTab, setClinicalTab] = useState<'lower' | 'upper' | 'symmetry'>('lower');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const athlete = athleteId ? getAthlete(athleteId) : undefined;

    // DEBUG: Component Mount Log
    React.useEffect(() => {
        if (athlete) {
            console.log("📊 Dashboard Loaded for:", athlete.name);
            console.log("🔑 Access Object:", athlete.access);
        }
    }, [athlete]);

    // Loading State
    const [searchTimeout, setSearchTimeout] = useState(false);
    const [showDebug, setShowDebug] = useState(false); // Debug Toggle
    React.useEffect(() => {
        if (!athlete && athleteId) {
            const timer = setTimeout(() => setSearchTimeout(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [athlete, athleteId]);

    if (!athlete) {
        if (searchTimeout) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Athlete Not Found</h2>
                    <button onClick={() => window.location.href = '/#/portal'} className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">Return to Login</button>
                </div>
            );
        }
        return <Loading message="Syncing Performance Data..." />;
    }

    // SAFE ANALYSIS
    const analysis = analyzeAthlete(athlete);
    const { flags, recommendation } = analysis;

    // v19.0 Access Logic (Safe Fallback)
    const tier = (athlete.productTier || '').trim().toLowerCase();

    // Legacy Logic (if access object missing)
    let isFullAccess = tier.includes('elite') || tier.includes('testing s&c') || tier.includes('apex membership') || athlete.email === 'admin@apexsports.co.za';
    // Camp User Override (v38.0)
    let isCampUser = tier.includes('camp') || tier.includes('basic');
    let showMentorship = isFullAccess || tier.includes('mentorship');
    let showReports = isFullAccess;

    // New Logic (if access object present)
    if (athlete.access) {
        isFullAccess = athlete.access.isFullAccess;
        isCampUser = athlete.access.isCampUser ?? isCampUser; // Use backend flag if present
        showMentorship = athlete.access.showMentorship;
        showReports = athlete.access.showReports;
    }

    // Toggle Restricted View
    const showAdvancedMetrics = isFullAccess && !isCampUser;

    // Charts
    const radarData = [
        { subject: 'Hamstring', A: athlete.scoreHamstring, fullMark: 100 },
        { subject: 'Quad', A: athlete.scoreQuad, fullMark: 100 },
        { subject: 'Adduction', A: athlete.scoreAdduction, fullMark: 100 },
        { subject: 'Ankle', A: athlete.scoreAnkle, fullMark: 100 },
        { subject: 'Shoulder', A: athlete.scoreShoulder, fullMark: 100 },
        { subject: 'Neck', A: athlete.scoreNeck, fullMark: 100 },
    ];

    // Recent Sessions (Mock Logic reuse)
    const recentSessions = analysis.performance ? analysis.performance.sessions.slice(0, 7).reverse() : [];
    const acwrValue = analysis.performance ? analysis.performance.acwr : 1.1;
    const acwrHighRisk = acwrValue > 1.5 || acwrValue < 0.8;
    const pkg = tier; // Alias

    // Hero Stat Triggers
    const showHeroStat = showAdvancedMetrics; // Only show for Advanced tiers (Clinical)

    // PILLARS STATE
    const [pillarRatings, setPillarRatings] = useState({
        physical: 80,
        technical: 65,
        tactical: 70,
        lifestyle: 70
    });

    // SCIENCE EXPLAINED STATE
    const [showScience, setShowScience] = useState<'physical' | 'pillars' | 'wellness' | null>(null);

    const ScienceOverlay = ({ type, onClose }: { type: string, onClose: () => void }) => {
        const content = {
            physical: {
                title: "The Science: Physical Metrics",
                sections: [
                    { title: "Strength-to-Weight Ratios", text: "Absolute strength matters, but relative strength (Strength/Bodyweight) dominates. We aim for a 3:1 ratio in key lifts (Squat/Deadlift) relative to bodyweight for elite status." },
                    { title: "Asymmetry & Injury Proofing", text: "We measure 'Peak Force Asymmetry' between left and right limbs. A difference >10% significantly increases injury risk. Testing isn't just for ranking; it's for durability." },
                    { title: "Rate of Force Development (RFD)", text: "Explosiveness is how fast you can produce force. Two athletes might jump the same height, but the one with higher RFD moves faster on the pitch." }
                ]
            },
            pillars: {
                title: "The Philosophy: APEX Pillars",
                sections: [
                    { title: "Floor vs. Ceiling Theory", text: "Most athletes obsess over their Ceiling (best day). We focus on raising your Floor (worst day). When your pillars are stable, your 'bad' days are still better than your opponent's 'good' days." },
                    { title: "Translatable Life Skills", text: "The discipline required to track sleep, manage nutrition, and analyze data builds 'Executive Function'. These are the same skills used by CEOs and leaders. We build humans, not just athletes." }
                ]
            },
            wellness: {
                title: "The Why: Wellness & CNS",
                sections: [
                    { title: "Neural Readiness (CNS)", text: "Your Central Nervous System (CNS) runs your body. If your CNS is fatigued (low readiness score), heavy training will only dig a deeper hole. We track this to time your peak performance." },
                    { title: "The 24-Hour Athlete", text: "Training is only 1 hour of your day. The other 23 hours (Sleep, Stress, Nutrition) determine whether that training makes you better or breaks you down." }
                ]
            }
        };

        const data = content[type as keyof typeof content];

        return (
            <div className="fixed inset-0 z-50 flex justify-end">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative z-10 w-full max-w-md bg-[#111] border-l border-neutral-800 h-full p-8 overflow-y-auto animate-fade-in-right shadow-2xl">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-neutral-800 rounded-full text-gray-400 hover:text-white hover:bg-neutral-700">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                            <Info className="w-6 h-6 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{data.title}</h2>
                    </div>

                    <div className="space-y-8">
                        {data.sections.map((bg, idx) => (
                            <div key={idx} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-neutral-800 pb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    {bg.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{bg.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-blue-900/10 border border-blue-900/30 rounded-xl flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-200">
                            <strong>Coach's Tip:</strong> Use this knowledge to interpret your own data. Don't wait for a coach to tell you what's wrong—own your process.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderPillars = () => {
        // Auto-Pull Data
        const scorePhysical = athlete.readinessScore || 75; // Fallback
        const scoreRecovery = athlete.soreness ? (10 - athlete.soreness) * 10 : 80;
        const scoreMental = athlete.motivation ? athlete.motivation * 10 : 70;

        // Combined Data for Radar
        const pillarData = [
            { subject: 'Physical Engine', A: scorePhysical, fullMark: 100 },
            { subject: 'Mental Resilience', A: scoreMental, fullMark: 100 },
            { subject: 'Technical Skill', A: pillarRatings.technical, fullMark: 100 },
            { subject: 'Recovery', A: scoreRecovery, fullMark: 100 },
            { subject: 'Lifestyle Habits', A: pillarRatings.lifestyle, fullMark: 100 },
        ];

        return (
            <div className="space-y-12 animate-fade-in pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-white">The APEX Pillars</h2>
                        <p className="text-gray-400">Holistic Performance Profile</p>
                    </div>
                    <button
                        onClick={() => setShowScience('pillars')}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                    >
                        <Info className="w-4 h-4" />
                        The Science Explained
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* LEFT: Radar & Controls */}
                    <div className="space-y-8">
                        {/* Radar Chart */}
                        <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Target className="w-32 h-32 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                                <Activity className="w-5 h-5 text-purple-500" />
                                Stability Gauge
                            </h3>

                            <div className="h-[300px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={pillarData}>
                                        <PolarGrid stroke="#333" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Score"
                                            dataKey="A"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            fill="#8b5cf6"
                                            fillOpacity={0.4}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Manual Sliders */}
                        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Technical Skill</label>
                                    <span className="text-2xl font-black text-white">{pillarRatings.technical}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={pillarRatings.technical}
                                    onChange={(e) => setPillarRatings({ ...pillarRatings, technical: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-2">
                                    <span>Developing</span>
                                    <span>Elite</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Lifestyle Habits</label>
                                    <span className="text-2xl font-black text-white">{pillarRatings.lifestyle}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={pillarRatings.lifestyle}
                                    onChange={(e) => setPillarRatings({ ...pillarRatings, lifestyle: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-2">
                                    <span>Inconsistent</span>
                                    <span>Disciplined</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Philosophy & Text */}
                    <div className="space-y-8">
                        {/* Floor & Ceiling Theory */}
                        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                <Layers className="w-8 h-8 text-white" />
                                The Floor & Ceiling Theory
                            </h3>

                            <div className="space-y-6 text-gray-300 leading-relaxed">
                                <p>
                                    Most athletes focus only on their <strong className="text-white">Ceiling</strong>—their absolute best performance on a perfect day.
                                    At APEX, we focus on raising your <strong className="text-white">Floor</strong>.
                                </p>
                                <p>
                                    Your "Floor" is how you perform on your worst day. When your pillars (Sleep, Nutrition, Mindset) are stable,
                                    your "bad days" still result in high-level performance. This is the definition of consistency.
                                </p>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 mt-4">
                                    <h4 className="text-sm font-bold text-purple-400 uppercase mb-2">Stability = Sustainability</h4>
                                    <p className="text-sm">
                                        An unbalanced Radar Chart (e.g., High Physical, Low Mental) is unstable.
                                        Under pressure/stress, the structure collapses (injury/burnout). Balance your pillars to build an unbreakable foundation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Blockquote */}
                        <div className="relative p-8 rounded-3xl bg-neutral-900 border border-neutral-800">
                            <div className="absolute top-6 left-6 text-6xl text-neutral-800 font-serif leading-none">"</div>
                            <blockquote className="relative z-10 text-lg font-medium text-gray-300 italic pl-6 border-l-4 border-purple-500">
                                The discipline, data-tracking, and resilience you build here aren't just for the pitch.
                                These are high-performance life skills. Whether you end up in a boardroom or a stadium,
                                the ability to manage your 'pillars' is what creates a sustainable, elite career.
                            </blockquote>
                            <div className="mt-6 flex items-center gap-4 pl-6">
                                <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                                <div>
                                    <p className="text-white font-bold text-sm">Marc Du Toit</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">APEX Performance Director</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderHome = () => (
        <div className="space-y-8 animate-fade-in">
            {/* Header / Instructional Video */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
                <div className="aspect-video w-full bg-black relative flex items-center justify-center group">
                    {/* Placeholder Video */}
                    <video
                        className="w-full h-full object-cover opacity-80"
                        src="/videos/Training Footage 1.mov"
                        controls
                        muted
                        autoPlay
                        loop
                        playsInline
                    />
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-black text-white mb-2">Welcome to Your Portal</h2>
                    <p className="text-gray-400">Watch this short guide to understand how to maximize your APEX Performance journey.</p>
                </div>
            </div>

            {/* APEX Guide */}
            <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-bold text-white">APEX Athlete Guide</h3>
                </div>
                <ul className="space-y-4">
                    <li className="flex items-start gap-4 p-4 bg-black/20 rounded-xl border border-neutral-800/50">
                        <Info className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-white mb-1">Confused by a metric?</strong>
                            <span className="text-gray-400 text-sm">Look for the "The Science Explained" tab in each section to understand the 'Why' behind your data.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-black/20 rounded-xl border border-neutral-800/50">
                        <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-white mb-1">Morning Wellness Check-in</strong>
                            <span className="text-gray-400 text-sm">Complete your scale ratings (1-10) every morning before 08:00 to track fatigue and readiness.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-black/20 rounded-xl border border-neutral-800/50">
                        <Activity className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-white mb-1">Review Physical Results</strong>
                            <span className="text-gray-400 text-sm">Check your "Physical Results" tab after every testing session to see your progress.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-black/20 rounded-xl border border-neutral-800/50">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-white mb-1">Monitor Red Flags</strong>
                            <span className="text-gray-400 text-sm">Pay attention to any alerts or "Growth Areas" highlighted in your reports.</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => setActiveView('wellness')}
                    className="p-8 bg-gradient-to-br from-blue-900/40 to-blue-900/10 border border-blue-500/30 rounded-3xl text-left hover:border-blue-500 transition-all group"
                >
                    <Activity className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-black text-white mb-2">Daily Check-in</h3>
                    <p className="text-blue-200/60 font-medium">Log your physical & mental state &rarr;</p>
                </button>
                <button
                    onClick={() => setActiveView('dashboard')}
                    className="p-8 bg-gradient-to-br from-green-900/40 to-green-900/10 border border-green-500/30 rounded-3xl text-left hover:border-green-500 transition-all group"
                >
                    <BarChart2 className="w-10 h-10 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-black text-white mb-2">View My Progress</h3>
                    <p className="text-green-200/60 font-medium">Analyze your latest physical results &rarr;</p>
                </button>
            </div>
        </div>
    );

    return (
        <SafetyGuard athlete={athlete}>
            <div className="min-h-screen bg-black text-white pb-20 font-sans">

                {/* Fixed Header Removed */}

                {/* SIDEBAR NAVIGATION */}
                {/* Overlay for Mobile */}
                {sidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

                <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-neutral-800 transform transition-transform duration-300 lg:translate-x-0 pt-8 pb-10 flex flex-col top-24 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="px-6 space-y-2">
                        {/* HOME (New Landing) */}
                        <button
                            onClick={() => { setActiveView('home'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'home' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
                        >
                            <Home className="w-5 h-5" />
                            Home
                        </button>

                        {/* PHYSICAL RESULTS (Renamed Dashboard) */}
                        <button
                            onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
                        >
                            <BarChart2 className="w-5 h-5" />
                            Physical Results
                        </button>

                        {/* COACHING LAYER (v18.5) */}
                        <button
                            onClick={() => { setActiveView('coaching'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'coaching' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
                        >
                            <MonitorPlay className="w-5 h-5" />
                            Coaching
                        </button>

                        {/* PERFORMANCE PILLARS (New) */}
                        <button
                            onClick={() => { setActiveView('pillars'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'pillars' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
                        >
                            <Layers className="w-5 h-5" />
                            APEX Pillars
                        </button>

                        {/* MENTORSHIP & GOALS (Internal View) */}
                        {(() => {
                            const isUnlocked = isFullAccess; // v17.4: Now linked to master full access (Apex/Elite/Testing)
                            return (
                                <button
                                    onClick={() => {
                                        if (!isUnlocked) {
                                            alert("Mentorship Access Required. Please upgrade your package.");
                                        } else {
                                            setActiveView('mentorship');
                                            setSidebarOpen(false);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'mentorship' ? 'bg-white text-black font-bold' : isUnlocked ? 'text-gray-400 hover:text-white hover:bg-neutral-800' : 'text-gray-600 cursor-not-allowed opacity-50'}`}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    <span>Mentorship</span>
                                    {!isUnlocked && <Lock className="w-4 h-4 ml-auto" />}
                                </button>
                            );
                        })()}



                        {/* REPORTS */}
                        {(() => {
                            const isUnlocked = isFullAccess; // v17.4: Now linked to master full access
                            return (
                                <button
                                    onClick={() => { if (isUnlocked) { setActiveView('reports'); setSidebarOpen(false); } }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'reports' ? 'bg-white text-black font-bold' : isUnlocked ? 'text-gray-400 hover:text-white hover:bg-neutral-800' : 'text-gray-600 cursor-not-allowed opacity-50'}`}
                                >
                                    <FileText className="w-5 h-5" />
                                    <span>Reports</span>
                                    {!isUnlocked && <Lock className="w-4 h-4 ml-auto" />}
                                </button>
                            );
                        })()}

                        {/* WELLNESS (v11.5) */}
                        <button
                            onClick={() => { setActiveView('wellness'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'wellness' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-neutral-800'}`}
                        >
                            <Activity className="w-5 h-5" />
                            <span>Wellness & CNS</span>
                        </button>
                    </div>

                    <div className="mt-auto px-6">
                        <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-neutral-800 transition-all">
                            <LogOut className="w-5 h-5" />
                            Logout
                        </Link>
                    </div>
                </div>

                {/* Content Area */}
                <div ref={dashboardRef} className="pt-32 px-4 max-w-7xl mx-auto space-y-8 lg:pl-72">

                    {/* Floating Control Bar (The "Shorter Rectangle") */}
                    <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-sm">
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden">
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Portal</span>
                                <ChevronRight className="w-3 h-3 text-gray-700" />
                                <span className="text-white font-bold text-xs uppercase tracking-widest">
                                    {activeView === 'dashboard' ? 'Physical Results' : activeView}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
                            {/* v8.0 Neural Readiness Stats (Desktop) */}
                            {showAdvancedMetrics && (
                                <div className="hidden md:flex items-center gap-8 mr-8 border-r border-neutral-800 pr-8">
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Neural Readiness</p>
                                        <p className={`text-2xl font-black ${athlete.readinessScore < 65 ? 'text-red-500' : 'text-green-500'}`}>
                                            {athlete.readinessScore || '-'}%
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Groin T-Max</p>
                                        <p className={`text-2xl font-black ${athlete.groinTimeToMax > 1.5 ? 'text-yellow-500' : 'text-white'}`}>
                                            {athlete.groinTimeToMax || '-'}s
                                        </p>
                                    </div>

                                    {/* v16.1 Clinical Link Status */}
                                    {athlete.valdProfileId && (
                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Ecosystem</p>
                                            <div className="bg-green-900/20 border border-green-800 px-2 py-1 rounded flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-green-500 uppercase">Active</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="hidden md:block text-right">
                                    <h1 className="text-lg font-bold text-white leading-none">{athlete.name}</h1>
                                    <p className="text-xs text-gray-500 font-mono">{athlete.package} Tier</p>
                                </div>
                                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-700">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* v16.1 Onboarding: Coach Trigger for Missing VALD ID */}
                    {(!athlete.valdProfileId && (pkg.includes('testing') || pkg.includes('elite'))) && (
                        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 p-6 rounded-2xl flex items-center justify-between mb-8 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neutral-700 rounded-full">
                                    <User className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Clinical Profile Missing</h3>
                                    <p className="text-gray-400 text-xs">This athlete is active but missing a VALD Profile ID.</p>
                                </div>
                            </div>
                            <button className="bg-white text-black font-bold py-2 px-6 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <UploadCloud className="w-4 h-4" />
                                Generate VALD Profile
                            </button>
                        </div>
                    )}

                    {/* VIEW: DASHBOARD */}
                    {/* VIEW: HOME */}
                    {activeView === 'home' && renderHome()}

                    {/* SCIENCE OVERLAY */}
                    {showScience && <ScienceOverlay type={showScience} onClose={() => setShowScience(null)} />}

                    {/* VIEW: PILLARS */}
                    {activeView === 'pillars' && renderPillars()}

                    {/* VIEW: DASHBOARD (Physical Results) */}
                    {activeView === 'dashboard' && (
                        <div className="space-y-12 animate-fade-in">

                            {/* v20.0: Navigation & Interpretation Guide */}
                            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <Info className="w-5 h-5 text-blue-500" />
                                        How to Navigate Your Physical Results
                                    </h3>
                                    <Link
                                        to="#"
                                        onClick={() => setActiveView('reports')}
                                        className="text-xs font-bold text-blue-400 hover:text-white flex items-center gap-1"
                                    >
                                        View Full PDF Reports <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
                                    <div className="bg-black/20 p-4 rounded-xl">
                                        <strong className="block text-white mb-1">1. The Radar</strong>
                                        Shows your balance. A full chart means you are well-rounded. Dips indicate areas to focus on (e.g., Hamstring strength).
                                    </div>
                                    <div className="bg-black/20 p-4 rounded-xl">
                                        <strong className="block text-white mb-1">2. Metrics</strong>
                                        Your raw numbers. Compare "Left vs. Right" to see symmetry. 100% Symmetry is the goal.
                                    </div>
                                    <div className="bg-black/20 p-4 rounded-xl">
                                        <strong className="block text-white mb-1">3. Reports</strong>
                                        Need a printed copy? Go to the <strong>Reports</strong> tab to download your standardized Season Report.
                                    </div>
                                </div>
                            </div>

                            {/* Upsell for General Tier */}
                            {!showAdvancedMetrics && (
                                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/20 rounded-full">
                                            <Shield className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">Unlock Clinical Readiness Monitoring</h3>
                                            <p className="text-blue-200 text-xs">Get professional insights to know exactly when to train and when to rest.</p>
                                        </div>
                                    </div>
                                    <button className="bg-white text-black font-bold py-2 px-6 rounded-lg text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
                                        Upgrade to Testing + Program Design
                                    </button>
                                </div>
                            )}

                            {/* v9.5 Last Updated (Master's Efficiency) */}
                            <div className="flex justify-end -mt-6 mb-2">
                                <span className="text-[10px] text-gray-500 font-mono border border-neutral-800 px-3 py-1 rounded-full flex items-center gap-2">
                                    <Activity className="w-3 h-3" />
                                    Last Updated: {athlete.lastUpdated || 'Unknown'}
                                </span>
                            </div>

                            {/* v9.5 Neural Readiness (HERO STAT for Clinical Tiers) */}
                            {/* Trigger Alert if Groin Time > 1.5s */}
                            {showHeroStat && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-down">
                                    <div className={`p-6 rounded-3xl flex items-center gap-6 ${athlete.readinessScore < 65 ? 'bg-red-950/40 border border-red-900/50' : 'bg-green-950/40 border border-green-900/50'}`}>
                                        <div className={`p-4 rounded-full ${athlete.readinessScore < 65 ? 'bg-red-900/20' : 'bg-green-900/20'}`}>
                                            <Battery className={`w-8 h-8 ${athlete.readinessScore < 65 ? 'text-red-500' : 'text-green-500'}`} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${athlete.readinessScore < 65 ? 'text-red-500' : 'text-green-500'}`}>
                                                {athlete.readinessScore < 65 ? 'Recovery Required' : 'Neural State: Prime'}
                                            </h3>
                                            <p className="text-white font-black text-3xl">{athlete.readinessScore}%</p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {athlete.readinessScore < 65 ? 'Reduce intensity. Your CNS is fatigued.' : 'System ready for high load.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Groin T-Max Alert */}
                                    <div className={`p-6 rounded-3xl flex items-center gap-6 ${athlete.groinTimeToMax > 1.5 ? 'bg-yellow-950/40 border border-yellow-900/50' : 'bg-neutral-900/40 border border-neutral-800'}`}>
                                        <div className={`p-4 rounded-full ${athlete.groinTimeToMax > 1.5 ? 'bg-yellow-900/20' : 'bg-neutral-800'}`}>
                                            <Activity className={`w-8 h-8 ${athlete.groinTimeToMax > 1.5 ? 'text-yellow-500' : 'text-gray-400'}`} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-sm uppercase tracking-wider mb-1 ${athlete.groinTimeToMax > 1.5 ? 'text-yellow-500' : 'text-gray-400'}`}>
                                                {athlete.groinTimeToMax > 1.5 ? 'Fatigue Alert' : 'Reaction Speed'}
                                            </h3>
                                            <p className="text-white font-black text-3xl">{athlete.groinTimeToMax}s</p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {athlete.groinTimeToMax > 1.5 ? 'Groin response is slow (>1.5s).' : 'Groin Time to Max Force'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* KPI Dials */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 bg-neutral-900/40 p-8 rounded-3xl border border-neutral-800">
                                <div className="col-span-2 md:col-span-1">
                                    <CircleProgress percentage={analysis.scores?.performance ?? 0} color="#3b82f6" label="Performance" icon={TrendingUp} />
                                </div>
                                {showAdvancedMetrics ? (
                                    <>
                                        <CircleProgress percentage={analysis.scores?.screening ?? 0} color="#a855f7" label="MQS" icon={Shield} />
                                        <CircleProgress percentage={analysis.scores?.powerIndex ?? 0} color="#f59e0b" label="Power Index" icon={Zap} />
                                    </>
                                ) : (
                                    <div className="col-span-2 md:col-span-2 flex items-center justify-center opacity-30 border-l border-neutral-800 bg-neutral-900/50 rounded-r-xl">
                                        <Lock className="w-5 h-5 mr-3 text-gray-500" />
                                        <p className="text-sm font-mono text-gray-500">DYNAMO & POWER LOCKED</p>
                                    </div>
                                )}
                            </div>

                            {/* v17.0 Dynamic Alerts */}
                            {(analysis.flags.isShoulderImbalance || analysis.flags.isLimbAsymmetry) && showAdvancedMetrics && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                    {analysis.flags.isShoulderImbalance && (
                                        <div className="bg-orange-950/40 border border-orange-900/50 p-4 rounded-xl flex items-center gap-3">
                                            <AlertTriangle className="w-6 h-6 text-orange-500" />
                                            <div>
                                                <h4 className="text-orange-400 font-bold text-sm">Shoulder Imbalance</h4>
                                                <p className="text-orange-200/60 text-xs">ER Strength {'<'} 80% of IR. Stability work recommended.</p>
                                            </div>
                                        </div>
                                    )}
                                    {analysis.flags.isLimbAsymmetry && (
                                        <div className="bg-amber-950/40 border border-amber-900/50 p-4 rounded-xl flex items-center gap-3">
                                            <AlertCircle className="w-6 h-6 text-amber-500" />
                                            <div>
                                                <h4 className="text-amber-400 font-bold text-sm">Limb Symmetry Alert</h4>
                                                <p className="text-amber-200/60 text-xs">{'>'}15% Asymmetry detected in Lower Body Key Lifts.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Main Grid: Charts & Performance */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Left Column: Performance Profile (Radar) */}
                                <div className="lg:col-span-2 space-y-8">

                                    {/* Radar Charts Grid */}
                                    {showAdvancedMetrics && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Standard Screening Profile */}
                                            <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl relative">
                                                <div className="flex items-center justify-between mb-8">
                                                    <h2 className="text-lg font-bold flex items-center gap-3">
                                                        <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
                                                        Dynamo Screening
                                                    </h2>
                                                </div>
                                                <div className="h-[250px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                                            <PolarGrid stroke="#333" />
                                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10 }} />
                                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                            <Radar name="Athlete" dataKey="A" stroke="#a855f7" strokeWidth={3} fill="#a855f7" fillOpacity={0.3} />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>

                                            {/* v17.0 Limb Symmetry Radar */}
                                            <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl relative">
                                                <div className="flex items-center justify-between mb-8">
                                                    <h2 className="text-lg font-bold flex items-center gap-3">
                                                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                                        Limb Symmetry
                                                    </h2>
                                                </div>
                                                <div className="h-[250px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                                                            { subject: 'Knee Ext', A: athlete.kneeExtensionLeft, B: athlete.kneeExtensionRight, fullMark: 1000 },
                                                            { subject: 'Hip Abd', A: athlete.hipAbductionLeft, B: athlete.hipAbductionRight, fullMark: 600 },
                                                            { subject: 'Hip Add', A: athlete.adductionStrengthLeft, B: athlete.adductionStrengthRight, fullMark: 600 },
                                                            { subject: 'Shoulder IR', A: athlete.shoulderInternalRotationLeft, B: athlete.shoulderInternalRotationRight, fullMark: 300 },
                                                            { subject: 'Shoulder ER', A: athlete.shoulderRomLeft, B: athlete.shoulderRomRight, fullMark: 300 },
                                                        ]}>
                                                            <PolarGrid stroke="#333" />
                                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10 }} />
                                                            <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
                                                            <Radar name="Left" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                                                            <Radar name="Right" dataKey="B" stroke="#22c55e" strokeWidth={2} fill="#22c55e" fillOpacity={0.3} />
                                                            <RechartsTooltip
                                                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #333' }}
                                                                itemStyle={{ color: '#fff' }}
                                                            />
                                                            <Legend />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* v8.0 Performance Metrics Vault */}
                                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold flex items-center gap-3">
                                                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                                {showAdvancedMetrics ? 'Performance Metrics' : 'Field Test Results'}
                                            </h2>
                                            <button
                                                onClick={() => setShowScience('physical')}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                                            >
                                                <Info className="w-3 h-3" />
                                                The Science
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <MetricCard label="Agility T" value={`${athlete.agilityTime || '-'} s`} />
                                            <MetricCard label="Jump Dist." value={`${athlete.broadJump || '-'} cm`} />

                                            {showAdvancedMetrics && (
                                                <>
                                                    <MetricCard label="IMTP Peak" value={`${athlete.imtpPeakForce} N`} />
                                                    <MetricCard label="IMTP RFD" value={`${athlete.imtpRfd200} N/s`} />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* v8.0 Dynamo Detail Vault (Tabbed - Advanced Only) */}
                                    {showAdvancedMetrics && (
                                        <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                            <div className="flex items-center justify-between mb-8">
                                                <h2 className="text-xl font-bold flex items-center gap-3">
                                                    <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                                    Dynamo Detail
                                                </h2>
                                                <div className="flex bg-black rounded-lg p-1 border border-neutral-800 h-fit">
                                                    {['lower', 'upper', 'symmetry', 'table'].map((tab) => (
                                                        <button
                                                            key={tab}
                                                            onClick={() => setClinicalTab(tab as any)}
                                                            className={`px-4 py-1 text-xs font-bold uppercase rounded-md transition-all ${clinicalTab === tab ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                                        >
                                                            {tab}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
                                                {clinicalTab === 'lower' && (
                                                    <>
                                                        <MetricCard label="H:Q Ratio (L)" value={athlete.hamstringQuadLeft} />
                                                        <MetricCard label="H:Q Ratio (R)" value={athlete.hamstringQuadRight} />
                                                        <MetricCard label="Ankle ROM (L)" value={`${athlete.ankleRomLeft}°`} />
                                                        <MetricCard label="Ankle ROM (R)" value={`${athlete.ankleRomRight}°`} />
                                                    </>
                                                )}
                                                {clinicalTab === 'upper' && (
                                                    <>
                                                        <MetricCard label="Shoulder IR (L)" value={`${athlete.shoulderInternalRotationLeft} N`} />
                                                        <MetricCard label="Shoulder IR (R)" value={`${athlete.shoulderInternalRotationRight} N`} />
                                                        <MetricCard label="Shoulder ER (L)" value={`${athlete.shoulderRomLeft} N`} />
                                                        <MetricCard label="Shoulder ER (R)" value={`${athlete.shoulderRomRight} N`} />
                                                        <MetricCard label="Neck Ext" value={`${athlete.neckExtension} N`} />
                                                    </>
                                                )}
                                                {clinicalTab === 'symmetry' && (
                                                    <>
                                                        <MetricCard label="PF Asymmetry" value={`${athlete.peakForceAsymmetry}%`} />
                                                        <MetricCard label="Adduction Bal" value="-" />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Recommendations & Workload (v15.1) */}
                                <div className="space-y-8">

                                    {/* Recommendations */}
                                    <div className="bg-white text-black p-8 rounded-3xl">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Priority Focus</h3>
                                        <h2 className="text-3xl font-black mb-4 leading-tight">{recommendation.focusArea}</h2>
                                        <p className="text-gray-600 leading-relaxed mb-6">{recommendation.description}</p>
                                    </div>

                                    {/* v16.1 MoveHealth Live Feed */}
                                    <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-purple-500" />
                                                Recent Training
                                            </h3>
                                            <span className="text-[10px] text-gray-600 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">MoveHealth</span>
                                        </div>

                                        {/* RPE Integrity Alert */}
                                        {flags.isRpeDiscrepancy && (
                                            <div className="mb-4 bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-start gap-3">
                                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-red-500 uppercase">Data Discrepancy</p>
                                                    <p className="text-[10px] text-gray-300 leading-tight mt-1">
                                                        Session RPE ({athlete.sRPE}) differs significantly from Exercise RPE. Check compliance.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            {athlete.moveHealth?.lastExercises?.length > 0 ? (
                                                athlete.moveHealth.lastExercises.slice(0, 3).map((ex, i) => (
                                                    <div key={i} className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl flex justify-between items-center group hover:border-neutral-700 transition-colors">
                                                        <div>
                                                            <p className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{ex.name}</p>
                                                            <p className="text-[10px] text-gray-500 font-mono">
                                                                {ex.sets} x {ex.reps} @ {ex.weight}kg
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ex.rpe >= 8 ? 'bg-red-900/30 text-red-500' : 'bg-green-900/30 text-green-500'}`}>
                                                                RPE {ex.rpe}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6">
                                                    <Activity className="w-8 h-8 text-neutral-800 mx-auto mb-2" />
                                                    <p className="text-xs text-gray-600">No recent activity logged.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* v15.1 Workload Management */}
                                    <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Workload (7-Day)</h3>
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${acwrHighRisk ? 'bg-red-900/30 text-red-500 border border-red-900' : 'bg-green-900/30 text-green-500 border border-green-900'}`}>
                                                {acwrHighRisk ? 'Injury Red Zone' : 'Optimal Zone'}
                                            </div>
                                        </div>

                                        {/* Chart */}
                                        <div className="h-32 w-full mb-6">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={recentSessions}>
                                                    <defs>
                                                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="date" hide />
                                                    <RechartsTooltip
                                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        labelStyle={{ display: 'none' }}
                                                    />
                                                    <Area type="monotone" dataKey="load" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">Daily Load</p>
                                                <p className="text-2xl font-black text-white">{athlete.dailyLoad || 0}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">ACWR</p>
                                                <p className={`text-2xl font-black ${acwrHighRisk ? 'text-red-500' : 'text-green-500'}`}>
                                                    {acwrValue.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* VIEW: MENTORSHIP & GOALS */}
                    {/* VIEW: MENTORSHIP & GOALS */}
                    {activeView === 'mentorship' && (
                        <div className="animate-fade-in">
                            <PortalMentorship athleteName={athlete.name} tier={athlete.package} />
                        </div>
                    )}

                    {/* VIEW: REPORTS */}
                    {activeView === 'reports' && (
                        <div className="space-y-8 animate-fade-in">
                            <h2 className="text-3xl font-black text-white">Performance Reports</h2>
                            <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                <p className="text-gray-500">No quarterly reports available yet.</p>
                            </div>
                        </div>
                    )}

                    {/* VIEW: WELLNESS (v11.5) */}
                    {activeView === 'wellness' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Header & CTA */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-white">Wellness & CNS Status</h2>
                                    <p className="text-gray-400 mt-2">Track your recovery trends and neural readiness.</p>
                                </div>
                                <a
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSebjaiFLu2pJS56XPidWAZI74xWQXra4SzbUB22UI9LSyRGbA/viewform?usp=header"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-500 transition-colors flex items-center gap-2"
                                >
                                    <Activity className="w-5 h-5" />
                                    Submit Daily Wellness & Load
                                </a>
                            </div>

                            {/* CNS Readiness (Jump Gap) */}
                            {(() => {
                                const current = athlete.broadJump || 0;
                                const baseline = athlete.baselineJump || current; // Fallback to current if no baseline
                                const gap = baseline - current;
                                const gapPercent = (gap / baseline) * 100;
                                const isNeuralFatigue = gapPercent > 10;

                                return (
                                    <div className={`p-8 rounded-3xl border ${isNeuralFatigue ? 'bg-red-950/20 border-red-900/50' : 'bg-green-950/20 border-green-900/50'}`}>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`p-3 rounded-full ${isNeuralFatigue ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'}`}>
                                                <Battery className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className={`font-bold uppercase tracking-wider ${isNeuralFatigue ? 'text-red-500' : 'text-green-500'}`}>
                                                    CNS Readiness Status
                                                </h3>
                                                {isNeuralFatigue && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-900/50 text-red-200 text-xs font-bold rounded uppercase">
                                                        Neural Recovery Needed
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Current Broad Jump</p>
                                                <p className="text-4xl font-black text-white">{current} cm</p>
                                            </div>
                                            <div className="md:border-x border-white/10">
                                                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Baseline</p>
                                                <p className="text-4xl font-black text-gray-400">{baseline} cm</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Deficit</p>
                                                <p className={`text-4xl font-black ${isNeuralFatigue ? 'text-red-500' : 'text-green-500'}`}>
                                                    {gap > 0 ? `-${Math.round(gapPercent)}%` : '0%'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* WORKLOAD & WELLNESS GRID */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Load & ACWR */}
                                <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-bold text-xl flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-blue-500" />
                                            Training Load
                                        </h3>
                                        {athlete.s2Duration > 0 && (
                                            <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs font-bold rounded-full uppercase border border-purple-900/50">
                                                Double Session
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Daily Load (AU)</p>
                                            <p className="text-5xl font-black text-white">{athlete.dailyLoad || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">ACWR</p>
                                            <div className={`text-5xl font-black ${athlete.acwr > 1.5 || athlete.acwr < 0.8 ? 'text-red-500' : 'text-green-500'}`}>
                                                {athlete.acwr ? athlete.acwr.toFixed(2) : '-'}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-2">Target: 0.8 - 1.3</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subjective Wellness Charts (1-5 Scale) */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Sleep', val: athlete.sleep, color: '#3b82f6' },
                                        { label: 'Stress', val: athlete.stress, color: '#a855f7' },
                                        { label: 'Soreness', val: athlete.soreness, color: '#f59e0b' }
                                    ].map((item) => (
                                        <div key={item.label} className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col items-center justify-center">
                                            <h4 className="text-gray-400 font-bold uppercase text-[10px] mb-3">{item.label}</h4>
                                            <div className="relative w-24 h-24 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#222" strokeWidth="8" />
                                                    <circle
                                                        cx="50" cy="50" r="45" fill="none" stroke={item.color} strokeWidth="8"
                                                        strokeDasharray={`${(item.val || 3) * 20 * 2.82} 282`} // 1-5 Scale: val * 20 = percentage
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <span className="absolute text-2xl font-black text-white">{item.val || '-'}</span>
                                            </div>
                                            <p className="text-gray-600 text-[10px] mt-2">/ 5</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Debug Footer */}
                    <div className="py-8 text-center border-t border-neutral-900 mt-12">
                        <button
                            onClick={() => setShowDebug(!showDebug)}
                            className="text-[10px] text-neutral-800 hover:text-neutral-500 font-mono transition-colors uppercase tracking-widest"
                        >
                            {showDebug ? 'Hide System Data' : 'System Status: Online'}
                        </button>

                        {showDebug && (
                            <div className="mt-4 mx-auto max-w-4xl p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-left overflow-x-auto">
                                <h4 className="text-xs font-bold text-green-500 mb-2 font-mono">RAW DATA INSPECTOR</h4>
                                <p className="text-[10px] text-gray-500 mb-4">
                                    If data is missing here, it is not being read from the Sheet correctly. Check column names.
                                </p>
                                <pre className="text-[10px] text-gray-400 font-mono whitespace-pre-wrap">
                                    {JSON.stringify(athlete, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </SafetyGuard >
    );
};

export default AthleteDashboard;
