import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { analyzeAthlete } from '../../utils/dataEngine';
import SafetyGuard from '../../components/SafetyGuard';
import {
    RadialBarChart, RadialBar, PolarAngleAxis,
    Radar, RadarChart, PolarGrid, PolarRadiusAxis,
    Area, AreaChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Legend
} from 'recharts';
import {
    AlertTriangle, CheckCircle, UploadCloud, AlertCircle, Zap,
    LayoutDashboard, Target, BookOpen, FileText, Menu, X, Save, ExternalLink,
    Activity, Shield, Battery, TrendingUp, ChevronRight, Lock, User, LogOut, MonitorPlay, Home, CheckSquare, BarChart2, Sliders, Layers, Info, Video, Users, Brain, Award, Triangle, Download,
    Calendar, ChevronLeft, Dumbbell, Settings, Edit3 // Added for lucide-react
} from 'lucide-react';
import { updateAthleteGoals } from '../../utils/googleIntegration';
import { VideoLab } from '../../components/VideoLab/VideoLab';
import { ApexAgent } from '../../components/ApexAI/ApexAgent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generateTechnicalReport, generateDevelopmentReport, generateExecutiveReport, generateQuarterlyReport } from '../../services/ReportService';
import { PortalCoaching } from '../../components/Coaching/PortalCoaching';
import { CoachReviewModal } from '../../components/CoachReviewModal'; // Import Modal
import { updateCoachReview } from '../../utils/googleIntegration'; // Import updateCoachReview


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
import { TacticalWhiteboard } from '../../components/Tactical/TacticalWhiteboard';

// --- Helper Colors ---
const getThemeColors = (membershipType?: string, productTier?: string, pkg?: string) => {
    // Check if user is Apex (override PRG)
    const isApex = (productTier === 'Apex') || (pkg && pkg.includes('Apex'));

    if (membershipType === 'PRG' && !isApex) {
        return {
            primary: '#800000', // Maroon
            secondary: '#ceb888', // Gold (Metallic) instead of pure Navy for secondary text? Or sticking to Gold.
            accent: '#000080', // Navy
            text: '#ffffff',
            bg: 'bg-[#000020]', // Deep Navy Black
            cardBg: 'bg-[#0a0a2a]' // Navy Tinted Card
        };
    }
    return {
        primary: '#3b82f6', // Blue
        secondary: '#ef4444', // Red
        accent: '#22c55e', // Green
        text: '#ffffff',
        bg: 'bg-transparent',
        cardBg: 'bg-neutral-900'
    };
};

const WrappedNavItem = ({ active, onClick, icon: Icon, label, theme }: any) => {
    const isPrg = theme.primary === '#800000';
    const activeClass = isPrg
        ? 'font-bold shadow-lg'
        : 'bg-white text-black font-bold';

    const activeStyle = isPrg && active ? { backgroundColor: theme.accent, color: theme.secondary } : {};

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? activeClass : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
            style={active ? activeStyle : {}}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );
};

const AthleteDashboard: React.FC = () => {
    const { athleteId } = useParams<{ athleteId: string }>();
    const { getAthlete } = useData();

    // Color State
    const [theme, setTheme] = useState(getThemeColors());

    const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'goals' | 'library' | 'reports' | 'wellness' | 'mentorship' | 'coaching' | 'pillars' | 'videolab' | 'tactical'>('home');
    const [clinicalTab, setClinicalTab] = useState<'lower' | 'upper' | 'symmetry'>('lower');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const athlete = athleteId ? getAthlete(athleteId) : undefined;

    // DEBUG: Component Mount Log
    React.useEffect(() => {
        if (athlete) {
            console.log("📊 Dashboard Loaded for:", athlete.name, athlete);
            setTheme(getThemeColors(athlete.membershipType, athlete.productTier, athlete.package));
        }
    }, [athlete]);

    // Loading State
    const [searchTimeout, setSearchTimeout] = useState(false);
    const [showDebug, setShowDebug] = useState(false); // Debug Toggle
    // Coach Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isSavingReview, setIsSavingReview] = useState(false);

    React.useEffect(() => {
        if (!athlete && athleteId) {
            const timer = setTimeout(() => setSearchTimeout(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [athlete, athleteId]);

    if (!athlete) {
        if (searchTimeout) {
            return (
                <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-4 text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Athlete Not Found</h2>
                    <button onClick={() => window.location.href = '/portal'} className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">Return to Login</button>
                </div>
            );
        }
        return <Loading message="Syncing Performance Data..." />;
    }

    // View State
    const [physicalViewMode, setPhysicalViewMode] = useState<'simple' | 'advanced'>('simple');

    // Helper for Traffic Light
    const getTrafficColor = (score: number) => {
        if (score >= 85) return { text: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500/50' };
        if (score >= 70) return { text: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-500/50' };
        return { text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/50' };
    };

    // SAFE ANALYSIS
    const analysis = analyzeAthlete(athlete);
    const { flags, recommendation, scores } = analysis;

    // v19.0 Access Logic (Safe Fallback)
    const tier = (athlete.productTier || '').trim().toLowerCase();

    // Permissions Defaults
    let showGoalSetting = false;
    let showVideoLab = false;
    let showWellness = false;
    let showPhysicalSimple = false;
    let showPhysicalAdvanced = false;
    let showMentorship = false;

    // Tier Detection
    const isApex = tier.includes('apex') || tier.includes('elite') || athlete.email === 'admin@apexsports.co.za';
    const isSpecific = tier.includes('specific');
    const isTesting = tier.includes('testing') || tier.includes('dynamo');
    const isGeneral = tier.includes('general');
    const isGoalSetting = tier.includes('goal setting') || tier.includes('starter');

    // Hierarchy Logic (Cascading Access)
    if (isApex || isSpecific) {
        // R1,500+ (Full Suite)
        showGoalSetting = true;
        showVideoLab = true;
        showWellness = true;
        showPhysicalSimple = true;
        showPhysicalAdvanced = true;
        showMentorship = true;
    } else if (isTesting) {
        // R1,000 (Testing Only - mostly)
        showPhysicalSimple = true;
        showPhysicalAdvanced = true;
        // Assuming Testing also gets basic dash?
        showWellness = true;
    } else if (isGeneral) {
        // R500 (General S&C)
        showWellness = true;
        showPhysicalSimple = true;
    } else if (isGoalSetting) {
        // R150 (Goal Setting)
        showGoalSetting = true;
        showVideoLab = true; // "Access to Goal-Setting Dashboard + Video Lab"
    }

    // Manual Override from Database (if present)
    if (athlete.access) {
        if (athlete.access.isFullAccess) {
            showGoalSetting = true;
            showVideoLab = true;
            showWellness = true;
            showPhysicalSimple = true;
            showPhysicalAdvanced = true;
            showMentorship = true;
        }
        // Could map specific flags if they existed in DB schema
    }

    // Toggle Restricted View
    const isCampUser = tier.includes('camp'); // Legacy flag, keep for safe measure
    const showReports = showPhysicalAdvanced; // Only advanced tiers get reports for now?
    const isFullAccess = isApex || isSpecific; // Restore variable for compatibility
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

    // --- EDITABLE GOALS STATE ---
    const [goals, setGoals] = useState({
        year: '',
        process: '',
        why: ''
    });
    const [isEditingGoals, setIsEditingGoals] = useState(false);

    // Initialize Goals from LocalStorage (or Athlete Data if available in future)
    useEffect(() => {
        if (athlete?.id) {
            const saved = localStorage.getItem(`apex_goals_${athlete.id}`);
            if (saved) {
                setGoals(JSON.parse(saved));
            } else if (athlete.email === 'admin@apexsports.co.za') {
                // Default for Admin/Demo
                setGoals({
                    year: "Win the League Title & Achieve 90% Pass Completion",
                    process: "1. Sleep 8+ Hours\n2. Track Wellness Daily\n3. Visualise before every game",
                    why: "To prove to myself that I can compete at the highest level."
                });
            }
        }
    }, [athlete?.id]);

    const handleSaveGoals = () => {
        setIsEditingGoals(false);
        if (athlete?.id) {
            // Local Save
            localStorage.setItem(`apex_goals_${athlete.id}`, JSON.stringify(goals));
            // Cloud Sync
            updateAthleteGoals(athlete.email, goals);
        }
    };

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
                <div className="absolute inset-0 bg-transparent/80 backdrop-blur-sm" onClick={onClose}></div>
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
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Header / Instructional Video (Deion Sanders) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-video w-full bg-transparent relative flex items-center justify-center group">
                    <iframe
                        className="w-full h-full object-cover"
                        src="https://www.youtube.com/embed/Q8YfGJwoTD8?rel=0&modestbranding=1"
                        title="Deion Sanders Inspiration"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="p-8 text-center bg-transparent">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">THE JOURNEY STARTS HERE</h2>
                    <p className="text-gray-400">Raising the floor. Smashing the ceiling. Welcome to the APEX Lab.</p>
                </div>
            </div>

            {/* --- NEW: EDITABLE GOALS SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Year Goals */}
                <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-3xl relative group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-500" />
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Year Goals</h3>
                        </div>
                        <button onClick={() => isEditingGoals ? handleSaveGoals() : setIsEditingGoals(true)} className="text-gray-500 hover:text-white transition-colors">
                            {isEditingGoals ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Edit3 className="w-4 h-4" />}
                        </button>
                    </div>
                    {isEditingGoals ? (
                        <textarea
                            value={goals.year}
                            onChange={(e) => setGoals({ ...goals, year: e.target.value })}
                            className="w-full bg-transparent/50 text-white text-lg font-bold p-3 rounded-xl border border-neutral-700 focus:border-red-500 outline-none h-32 resize-none"
                            placeholder="What do you want to achieve this year?"
                        />
                    ) : (
                        <p className="text-lg font-bold text-white whitespace-pre-wrap min-h-[3rem]">
                            {goals.year || <span className="text-gray-600 italic">Click edit to set your goals...</span>}
                        </p>
                    )}
                </div>

                {/* The Process */}
                <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-3xl relative group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-500" />
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">The Process</h3>
                        </div>
                        <button onClick={() => isEditingGoals ? handleSaveGoals() : setIsEditingGoals(true)} className="text-gray-500 hover:text-white transition-colors">
                            {isEditingGoals ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Edit3 className="w-4 h-4" />}
                        </button>
                    </div>
                    {isEditingGoals ? (
                        <textarea
                            value={goals.process}
                            onChange={(e) => setGoals({ ...goals, process: e.target.value })}
                            className="w-full bg-transparent/50 text-white text-lg font-bold p-3 rounded-xl border border-neutral-700 focus:border-blue-500 outline-none h-32 resize-none"
                            placeholder="What daily habits will get you there?"
                        />
                    ) : (
                        <p className="text-lg font-bold text-white whitespace-pre-wrap min-h-[3rem]">
                            {goals.process || <span className="text-gray-600 italic">Define your daily habits...</span>}
                        </p>
                    )}
                </div>

                {/* The Why */}
                <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-3xl relative group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your Why</h3>
                        </div>
                        <button onClick={() => isEditingGoals ? handleSaveGoals() : setIsEditingGoals(true)} className="text-gray-500 hover:text-white transition-colors">
                            {isEditingGoals ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Edit3 className="w-4 h-4" />}
                        </button>
                    </div>
                    {isEditingGoals ? (
                        <textarea
                            value={goals.why}
                            onChange={(e) => setGoals({ ...goals, why: e.target.value })}
                            className="w-full bg-transparent/50 text-white text-lg font-bold p-3 rounded-xl border border-neutral-700 focus:border-yellow-500 outline-none h-32 resize-none"
                            placeholder="What drives you?"
                        />
                    ) : (
                        <p className="text-lg font-bold text-white whitespace-pre-wrap min-h-[3rem]">
                            {goals.why || <span className="text-gray-600 italic">State your purpose...</span>}
                        </p>
                    )}
                </div>
            </div>

            {/* 5 Pillars Section */}
            <div className="bg-neutral-900/40 border border-neutral-800 p-4 md:p-8 rounded-3xl">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">
                        The 5 Pillars of <span className="text-red-500 block md:inline">High Performance</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                        A holistic framework designed to build complete athletes.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
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
                        <div key={idx} className="bg-transparent/40 p-5 rounded-2xl border border-neutral-800 hover:border-neutral-600 transition-all hover:-translate-y-1 group flex items-start gap-5">
                            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                <pillar.icon className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-black text-white uppercase mb-0.5">{pillar.title}</h3>
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">{pillar.sub}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Holistic CTA */}
                <div className="mt-8 md:mt-12 text-center border-t border-neutral-800 pt-8">
                    <p className="text-base md:text-lg text-white font-medium italic max-w-3xl mx-auto leading-relaxed">
                        "Our holistic approach ensures that the discipline you build in the lab translates to success in every sector of your life."
                    </p>
                </div>
            </div>

            {/* APEX Guide */}
            <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-bold text-white">APEX Athlete Guide</h3>
                </div>
                <ul className="space-y-4">
                    <li className="flex items-start gap-4 p-4 bg-transparent/20 rounded-xl border border-neutral-800/50">
                        <Info className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-white mb-1">Confused by a metric?</strong>
                            <span className="text-gray-400 text-sm">Look for the "The Science Explained" tab in each section to understand the 'Why' behind your data.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-transparent/20 rounded-xl border border-neutral-800/50">
                        <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-white mb-1">Morning Wellness Check-in</strong>
                            <span className="text-gray-400 text-sm">Complete your scale ratings (1-10) every morning before 08:00 to track fatigue and readiness.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-transparent/20 rounded-xl border border-neutral-800/50">
                        <Activity className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-white mb-1">Review Physical Results</strong>
                            <span className="text-gray-400 text-sm">Check your "Physical Results" tab after every testing session to see your progress.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-transparent/20 rounded-xl border border-neutral-800/50">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="block text-white mb-1">Monitor Red Flags</strong>
                            <span className="text-gray-400 text-sm">Pay attention to any alerts or "Growth Areas" highlighted in your reports.</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <button
                    onClick={() => { setActiveView('mentorship'); setTimeout(() => setClinicalTab('lower'), 100); /* Hack to ensure render */ }}
                    className="p-8 bg-gradient-to-br from-purple-900/40 to-purple-900/10 border border-purple-500/30 rounded-3xl text-left hover:border-purple-500 transition-all group"
                >
                    <Target className="w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-black text-white mb-2">SPAT Assessment</h3>
                    <p className="text-purple-200/60 font-medium">Take your Sport Psych Assessment &rarr;</p>
                </button>
            </div>
        </div>
    );
    // PDF Handlers
    // PDF Handlers
    const handleDownloadTechnical = async () => await generateTechnicalReport(athlete, analysis);
    const handleDownloadDevelopment = async () => await generateDevelopmentReport(athlete, analysis);
    const handleDownloadExecutive = async () => await generateExecutiveReport(athlete, analysis);
    const handleDownloadQuarterly = async () => {
        // Open Modal Flow instead of direct download
        setShowReviewModal(true);
    };

    const handleConfirmReview = async (score: number, notes: string) => {
        setIsSavingReview(true);

        // 1. Write Back to Google Sheet (Fire and Forget or Await?)
        // Let's await to confirm save before generating PDF ensuring data integrity
        // We use a pin '0000' or similar for now, functionality depends on deployed script.
        // Ideally we'd ask user for PIN but let's assume session or bypass.
        await updateCoachReview(athlete.email, "0000", score, notes);

        // 2. Mock Data for the new Quarterly Report Structure
        // In the future, this should be pulled from actual tracking data
        const mockQuarterlyData: any = {
            ...athlete,
            // Include user inputs
            performanceScore: score,
            coachNotes: notes,
            // Fallback content
            executiveSummary: notes.length > 10 ? notes : "Marc has evolved significantly over the last 90 days. We have seen a 12% increase in force output and major improvement in resilience. His commitment to the 'floor vs ceiling' philosophy has stabilized his bad days, making them better than most opponents' good days.",
            physical: {
                imtp: "4200 N",
                agility: "2.3 s",
                broadJump: `${athlete.broadJump || 240} cm`,
                strengths: ["Explosive Power (Vertical)", "Hamstring Strength", "Consistency"],
                weaknesses: ["Left Knee Valgus", "Ankle Mobility", "Aerobic Base"]
            },
            mentorship: {
                goals: ["Win the League Title", "Achieve 90% Pass Completion", "Master Visualization Routine"],
                psychSkills: ["0.2s Mistake Recovery Rule", "Pre-Game Visualization", "Breathwork Reset"],
                spatScores: [8, 7, 9, 6, 8] // Phys, Tech, Tac, Ment, Life
            },
            coaching: {
                blockFocus: "Transition from General Strength to Sport-Specific Power. Emphasis on max velocity sprint mechanics and rapid deceleration.",
                skillsLearnt: ["Linear Acceleration Mechanics", "Scanning under fatigue", "Defensive shape retention"],
                technicalFeedback: [
                    { skill: "9-Yard Acceleration", grade: "A-", note: "Explosive first step. Keep hips lower." },
                    { skill: "Shot Stopping", grade: "B+", note: "Good reaction. Work on parrying to safe zones." },
                    { skill: "Clearing", grade: "A", note: "Excellent distance and accuracy." },
                    { skill: "Penalty Corner Defense", grade: "C+", note: "Reaction time needs improvement." },
                    { skill: "Baseline Entries", grade: "B", note: "Good decision making. execute faster." }
                ]
            }
        };

        await generateQuarterlyReport(mockQuarterlyData);

        setIsSavingReview(false);
        setShowReviewModal(false);
    };

    return (
        <SafetyGuard athlete={athlete}>
            <CoachReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onConfirm={handleConfirmReview}
                isSaving={isSavingReview}
                initialScore={scores?.performance || 75} // Pre-fill with calculated score
            />
            <div className="space-y-8 animate-fade-in">

                <div className="min-h-screen bg-transparent text-white pb-20 font-sans">

                    {/* Fixed Header Removed */}

                    {/* SIDEBAR NAVIGATION */}
                    {/* Overlay for Mobile */}
                    {sidebarOpen && <div className="fixed inset-0 bg-transparent/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

                    <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-neutral-800 transform transition-transform duration-300 lg:translate-x-0 pt-8 pb-10 flex flex-col top-24 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="px-6 space-y-2">
                            {/* HOME */}
                            <WrappedNavItem active={activeView === 'home'} onClick={() => { setActiveView('home'); setSidebarOpen(false); }} icon={Home} label="Home" theme={theme} />

                            {/* PHYSICAL RESULTS (Apex, Mentorship, Standard - Hide for pure PRG) */}
                            {(() => {
                                const isApex = athlete.productTier === 'Apex' || (athlete?.package && athlete.package.includes('Apex'));
                                const isMentorship = athlete.package === 'Mentorship' || athlete.productTier === 'Mentorship';
                                const isPRG = athlete.membershipType === 'PRG';

                                // Show if NOT PRG, OR if specific Apex/Mentorship override exists
                                if (!isPRG || isApex || isMentorship) {
                                    return (
                                        <WrappedNavItem active={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }} icon={BarChart2} label="Physical Results" theme={theme} />
                                    );
                                }
                                return null;
                            })()}

                            {/* TACTICAL (PRG, Apex, Mentorship) */}
                            {(athlete.membershipType === 'PRG' || athlete.productTier === 'Apex' || athlete.package === 'Mentorship' || athlete.productTier === 'Mentorship') && (
                                <WrappedNavItem active={activeView === 'tactical'} onClick={() => { setActiveView('tactical'); setSidebarOpen(false); }} icon={Target} label="Tactical Analysis" theme={theme} />
                            )}

                            {/* COACHING */}
                            <WrappedNavItem active={activeView === 'coaching'} onClick={() => { setActiveView('coaching'); setSidebarOpen(false); }} icon={MonitorPlay} label="Coaching" theme={theme} />

                            {/* VIDEO LAB */}
                            <WrappedNavItem active={activeView === 'videolab'} onClick={() => { setActiveView('videolab'); setSidebarOpen(false); }} icon={Video} label="Video Lab" theme={theme} />

                            {/* MENTORSHIP & GOALS */}
                            {(() => {
                                const isUnlocked = isFullAccess || athlete.membershipType === 'PRG';
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
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'mentorship' ? (theme.primary === '#800000' ? 'font-bold shadow-lg' : 'bg-white text-black font-bold') : isUnlocked ? 'text-gray-400 hover:text-white hover:bg-neutral-800' : 'text-gray-600 cursor-not-allowed opacity-50'}`}
                                        style={activeView === 'mentorship' && theme.primary === '#800000' ? { backgroundColor: theme.accent, color: theme.secondary } : {}}
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        <span>Mentorship</span>
                                        {!isUnlocked && <Lock className="w-4 h-4 ml-auto" />}
                                    </button>
                                );
                            })()}

                            {/* REPORTS */}
                            {(() => {
                                const isApex = athlete.productTier === 'Apex' || (athlete?.package && athlete.package.includes('Apex'));
                                const isMentorship = athlete.package === 'Mentorship' || athlete.productTier === 'Mentorship';
                                const isPRG = athlete.membershipType === 'PRG';

                                if (!isPRG || isApex || isMentorship) {
                                    const isUnlocked = isFullAccess;
                                    return (
                                        <button
                                            onClick={() => { if (isUnlocked) { setActiveView('reports'); setSidebarOpen(false); } }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'reports' ? (theme.primary === '#800000' ? 'font-bold shadow-lg' : 'bg-white text-black font-bold') : isUnlocked ? 'text-gray-400 hover:text-white hover:bg-neutral-800' : 'text-gray-600 cursor-not-allowed opacity-50'}`}
                                            style={activeView === 'reports' && theme.primary === '#800000' ? { backgroundColor: theme.accent, color: theme.secondary } : {}}
                                        >
                                            <FileText className="w-5 h-5" />
                                            <span>Reports</span>
                                            {!isUnlocked && <Lock className="w-4 h-4 ml-auto" />}
                                        </button>
                                    );
                                }
                                return null;
                            })()}

                            {/* WELLNESS (Hide for pure PRG) */}
                            {(() => {
                                const isApex = athlete.productTier === 'Apex' || (athlete?.package && athlete.package.includes('Apex'));
                                const isMentorship = athlete.package === 'Mentorship' || athlete.productTier === 'Mentorship';
                                const isPRG = athlete.membershipType === 'PRG';

                                if (!isPRG || isApex || isMentorship) {
                                    return (
                                        <WrappedNavItem active={activeView === 'wellness'} onClick={() => { setActiveView('wellness'); setSidebarOpen(false); }} icon={Activity} label="Wellness & CNS" theme={theme} />
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        <div className="mt-auto px-6">
                            <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-neutral-800 transition-all">
                                <LogOut className="w-5 h-5" />
                                Logout
                            </Link>
                        </div>
                    </div>

                    {/* BACKGROUND FX */}
                    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
                    </div>

                    {/* Content Area */}
                    <div ref={dashboardRef} className="pt-32 px-4 md:px-8 w-full mx-auto space-y-8 lg:pl-72">

                        {/* Floating Control Bar (The "Shorter Rectangle") */}
                        <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl flex flex-row items-center justify-between gap-4 backdrop-blur-sm w-full">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden">
                                    <Menu className="w-6 h-6" />
                                </button>
                                {/* Breadcrumbs - Hide on Mobile to save space */}
                                <div className="hidden md:flex items-center gap-2">
                                    <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Portal</span>
                                    <ChevronRight className="w-3 h-3 text-gray-700" />
                                    <span className="text-white font-bold text-xs uppercase tracking-widest">
                                        {activeView === 'dashboard' ? 'Physical Results' : activeView}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 justify-end">
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

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end text-right whitespace-nowrap">
                                        <div className="hidden md:flex items-center gap-2 mb-1 justify-end">
                                            <span className="text-white font-black text-xl tracking-tighter italic">APEX LAB</span>
                                            <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">BETA</div>
                                        </div>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="hidden md:inline text-gray-400 text-xs font-bold uppercase">{athlete.package} Tier</span>
                                            <span className="hidden md:inline text-neutral-700 text-xs">|</span>
                                            <h1 className="text-sm font-bold text-white">{athlete.name}</h1>
                                        </div>
                                    </div>
                                    <div className="relative flex-shrink-0">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-blue-600 rounded-full opacity-20 blur-lg animate-pulse"></div>
                                        <div className="relative w-12 h-12 bg-transparent rounded-full flex items-center justify-center border-2 border-white/10 shadow-2xl">
                                            {athlete.membershipType === 'PRG' && athlete.productTier !== 'Apex' && (!athlete.package || !athlete.package.includes('Apex')) ? (
                                                <img src="/images/prg-logo.png" alt="PRG" className="w-10 h-10 object-contain" />
                                            ) : (
                                                <img src="/images/logo.png" alt="Apex" className="w-8 h-8 object-contain" />
                                            )}
                                        </div>
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

                        {/* VIEW: COACHING */}
                        {activeView === 'coaching' && (
                            <div className="animate-fade-in pb-20">
                                <PortalCoaching />
                            </div>
                        )}

                        {/* VIEW: PILLARS */}
                        {activeView === 'pillars' && renderPillars()}

                        {/* VIEW: DASHBOARD (Physical Results) */}
                        {activeView === 'dashboard' && (
                            <div className="space-y-12 animate-fade-in">

                                {/* v21.0: View Toggle & Controls */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-neutral-900/50 p-6 rounded-3xl border border-neutral-800">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Physical Profile</h2>
                                        <p className="text-gray-400 text-sm">
                                            {physicalViewMode === 'simple'
                                                ? "Simplified overview of your athletic development."
                                                : "Detailed biomechanical data and symmetry analysis."}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* View Toggle */}
                                        <div className="bg-transparent p-1 rounded-xl flex items-center border border-neutral-800">
                                            <button
                                                onClick={() => setPhysicalViewMode('simple')}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${physicalViewMode === 'simple' ? 'bg-neutral-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                Simplified
                                            </button>
                                            <button
                                                onClick={() => setPhysicalViewMode('advanced')}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${physicalViewMode === 'advanced' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                Advanced
                                            </button>
                                        </div>

                                        {/* Report Downloads Dropdown (Mini) */}
                                        <div className="flex gap-2">
                                            {(showWellness || showPhysicalSimple) && (
                                                <button disabled className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-gray-600 cursor-not-allowed" title="Report Locked">
                                                    <Lock className="w-4 h-4" />
                                                </button>
                                            )}
                                            {showPhysicalAdvanced && (
                                                <>
                                                    <button disabled className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-gray-600 cursor-not-allowed" title="Report Locked">
                                                        <Lock className="w-4 h-4" />
                                                    </button>
                                                    <button disabled className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-gray-600 cursor-not-allowed" title="Report Locked">
                                                        <Lock className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
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

                                {/* Top Widgets - Advanced Only */}
                                {physicalViewMode === 'advanced' && (
                                    <div className="space-y-6 mb-8">
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
                                    </div>
                                )}



                                {/* 1. KEY TAKEAWAYS (Top) - Full Width */}
                                {physicalViewMode === 'simple' && (
                                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl relative overflow-hidden mb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Users className="w-5 h-5 text-yellow-500" />
                                                Your 3 Key Takeaways
                                            </h3>
                                            <span className="text-xs font-mono text-gray-500 uppercase">Priority Actions</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[
                                                { label: 'Explosiveness', score: athlete.scoreQuad || 70, note: 'Increase plyometric volume + Focus on landing mechanics.' },
                                                { label: 'Speed Endurance', score: athlete.scoreHamstring || 75, note: 'Add 1x specific conditioning session per week.' },
                                                { label: 'Strength Base', score: athlete.scoreAdduction || 85, note: 'Maintain current strength blocks. Good foundation.' }
                                            ].sort((a, b) => a.score - b.score).map((p, i) => (
                                                <div key={i} className="bg-transparent/20 p-4 rounded-2xl border border-white/5 flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-neutral-800 rounded-lg text-white font-black text-sm border border-neutral-700">{i + 1}</span>
                                                        <span className={`text-sm font-black ${getTrafficColor(p.score).text}`}>{p.score}/100</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold text-sm mb-1">{p.label} Priority</h4>
                                                        <p className="text-gray-400 text-xs leading-relaxed">{p.note}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Main Grid: Charts & Performance */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                    {/* Left Column: Toggled Content (Simple vs Advanced) */}
                                    <div className={`space-y-8 ${physicalViewMode === 'simple' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>

                                        {/* VIEW: SIMPLIFIED */}
                                        {physicalViewMode === 'simple' && (
                                            <div className="flex flex-col gap-6 animate-fade-in">



                                                {/* 2. INJURY STATUS (Simple Banner) */}
                                                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 bg-green-500/20 rounded-full">
                                                            <Shield className="w-6 h-6 text-green-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-bold">Injury Status: PROTECTED</h4>
                                                            <p className="text-green-400 text-xs">Cleared for full training intensity.</p>
                                                        </div>
                                                    </div>
                                                    <div className="hidden md:flex items-center gap-4">
                                                        <span className="text-xs text-gray-400 flex items-center gap-2"><CheckCircle className="w-3 h-3" /> Knee Stability</span>
                                                        <span className="text-xs text-gray-400 flex items-center gap-2"><CheckCircle className="w-3 h-3" /> Ankle Mobility</span>
                                                    </div>
                                                </div>

                                                {/* 3. BAR GRAPH + CONSISTENCY */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                                            <Activity className="w-5 h-5 text-blue-500" />
                                                            Performance Summary
                                                        </h3>
                                                        <div className="space-y-6">
                                                            {[
                                                                { label: 'MQS (Movement Quality)', value: 88, color: 'bg-purple-500' },
                                                                { label: 'Power Index', value: 92, color: 'bg-blue-500' },
                                                                { label: 'Overall Performance', value: 85, color: 'bg-green-500' }
                                                            ].map(stat => (
                                                                <div key={stat.label}>
                                                                    <div className="flex justify-between text-sm mb-2">
                                                                        <span className="text-gray-300 font-medium">{stat.label}</span>
                                                                        <span className="text-white font-bold">{stat.value}</span>
                                                                    </div>
                                                                    <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                                                                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.value}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Consistency */}
                                                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl flex flex-col justify-center text-center">
                                                        <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Consistency Score</h4>
                                                        <div className="text-5xl font-black text-white mb-2">9.2<span className="text-lg text-gray-500">/10</span></div>
                                                        <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-4">
                                                            <div className="bg-green-500 h-full rounded-full" style={{ width: '92%' }}></div>
                                                        </div>
                                                        <p className="text-xs text-gray-400 italic">"Discipline is the bridge between goals and accomplishment."</p>
                                                    </div>
                                                </div>

                                                {/* 4. INJURY RISKS & WARNINGS BLOCK */}
                                                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl">
                                                    <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                                                        <AlertTriangle className="w-5 h-5" /> Risks, Warnings & Priorities
                                                    </h3>
                                                    {/* Integrated Priority Focus */}
                                                    <div className="bg-white/10 p-4 rounded-xl mb-4 border border-white/10">
                                                        <h4 className="text-white text-sm font-bold mb-1 flex items-center gap-2">
                                                            <Target className="w-4 h-4 text-red-500" />
                                                            Priority: {recommendation.focusArea}
                                                        </h4>
                                                        <p className="text-gray-300 text-xs">{recommendation.description}</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-red-500/10 p-4 rounded-xl">
                                                            <h4 className="text-white text-sm font-bold mb-1">Hamstring Load</h4>
                                                            <p className="text-red-200 text-xs">Approaching high-volume threshold. Monitor sprint distance next week.</p>
                                                        </div>
                                                        <div className="bg-neutral-800/50 p-4 rounded-xl">
                                                            <h4 className="text-gray-300 text-sm font-bold mb-1">Ankle Stability</h4>
                                                            <p className="text-gray-400 text-xs">Minor asymmetry noted (4%). Continue plyometric stability drills.</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 5. DETAILED SCORES & EXPLANATION */}
                                                <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl space-y-6">
                                                    <h3 className="text-lg font-bold text-white mb-4">Detailed Metric Breakdown</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                        {/* MQS */}
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-purple-400 font-bold text-sm">MQS</span>
                                                                <span className="text-white font-black text-xl">88</span>
                                                            </div>
                                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                                Movement Quality Score reflects biomechanical efficiency. A score of 88 indicates excellent force transfer and minimal energy leak during movement.
                                                            </p>
                                                        </div>
                                                        {/* Power */}
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-blue-400 font-bold text-sm">Power Index</span>
                                                                <span className="text-white font-black text-xl">92</span>
                                                            </div>
                                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                                Composite of vertical jump height and RSI. 92 puts you in the top 5% of your cohort for explosive capability.
                                                            </p>
                                                        </div>
                                                        {/* Performance */}
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-green-400 font-bold text-sm">Performance</span>
                                                                <span className="text-white font-black text-xl">85</span>
                                                            </div>
                                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                                Overall game-readiness based on recent match load and training output. You are primed for competition.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )}

                                        {/* VIEW: ADVANCED */}
                                        {physicalViewMode === 'advanced' && showAdvancedMetrics && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
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

                                        {/* v8.0 Dynamo Detail Vault (Moved to Left Column for Width) */}
                                        {showAdvancedMetrics && (
                                            <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                                <div className="flex items-center justify-between mb-8">
                                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                                        <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                                        Dynamo Detail
                                                    </h2>
                                                    <div className="flex bg-transparent rounded-lg p-1 border border-neutral-800 h-fit">
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

                                                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-6 animate-fade-in">
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
                                                    {clinicalTab === 'table' && (
                                                        <div className="col-span-2 md:col-span-4 overflow-x-auto">
                                                            <table className="w-full text-left border-collapse">
                                                                <thead>
                                                                    <tr className="border-b border-neutral-800 text-xs text-gray-500 uppercase tracking-widest">
                                                                        <th className="py-2">Metric</th>
                                                                        <th className="py-2">Left</th>
                                                                        <th className="py-2">Right</th>
                                                                        <th className="py-2">Asym %</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-neutral-800 text-sm text-gray-300 font-mono">
                                                                    <tr>
                                                                        <td className="py-2 font-bold text-white">Knee Extension</td>
                                                                        <td className="py-2">{athlete.kneeExtensionLeft} N</td>
                                                                        <td className="py-2">{athlete.kneeExtensionRight} N</td>
                                                                        <td className="py-2 text-yellow-500">{(Math.abs(athlete.kneeExtensionLeft - athlete.kneeExtensionRight) / Math.max(athlete.kneeExtensionLeft, athlete.kneeExtensionRight) * 100).toFixed(1)}%</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="py-2 font-bold text-white">Knee Flexion</td>
                                                                        <td className="py-2">{athlete.kneeFlexionLeft} N</td>
                                                                        <td className="py-2">{athlete.kneeFlexionRight} N</td>
                                                                        <td className="py-2 text-green-500">{(Math.abs(athlete.kneeFlexionLeft - athlete.kneeFlexionRight) / Math.max(athlete.kneeFlexionLeft, athlete.kneeFlexionRight) * 100).toFixed(1)}%</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="py-2 font-bold text-white">Hip Adduction</td>
                                                                        <td className="py-2">{athlete.adductionStrengthLeft} N</td>
                                                                        <td className="py-2">{athlete.adductionStrengthRight} N</td>
                                                                        <td className="py-2 text-green-500">{(Math.abs(athlete.adductionStrengthLeft - athlete.adductionStrengthRight) / Math.max(athlete.adductionStrengthLeft, athlete.adductionStrengthRight) * 100).toFixed(1)}%</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="py-2 font-bold text-white">Hip Abduction</td>
                                                                        <td className="py-2">{athlete.hipAbductionLeft} N</td>
                                                                        <td className="py-2">{athlete.hipAbductionRight} N</td>
                                                                        <td className="py-2 text-green-500">{(Math.abs(athlete.hipAbductionLeft - athlete.hipAbductionRight) / Math.max(athlete.hipAbductionLeft, athlete.hipAbductionRight) * 100).toFixed(1)}%</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>




                                    {/* Right Column: Recommendations & Workload (v15.1) */}
                                    {physicalViewMode === 'advanced' && (
                                        <div className="space-y-8">

                                            {/* Recommendations */}


                                            {/* v16.1 MoveHealth Live Feed */}
                                            <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-purple-500" />
                                                        Recent Training
                                                    </h3>
                                                    <span className="text-[10px] text-gray-600 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">MoveHealth</span>
                                                </div>

                                                {/* v8.0 Performance Metrics Vault (Moved to Right Col for Vertical Stack) */}
                                                <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <h2 className="text-xl font-bold flex items-center gap-3">
                                                            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                                            {showAdvancedMetrics ? 'Performance' : 'Field Tests'}
                                                        </h2>
                                                        <button onClick={() => setShowScience('physical')} className="text-gray-400 hover:text-white"><Info className="w-4 h-4" /></button>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4">
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
                                                            <YAxis yAxisId="left" hide />
                                                            <YAxis yAxisId="right" orientation="right" domain={[0, 2]} hide />
                                                            <RechartsTooltip
                                                                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                                                                itemStyle={{ color: '#fff' }}
                                                                labelStyle={{ display: 'none' }}
                                                            />
                                                            <Area yAxisId="left" type="monotone" dataKey="load" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" />
                                                            <Line yAxisId="right" type="monotone" dataKey="acwr" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
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
                                    )}
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

                        {/* VIEW: VIDEOLAB */}
                        {activeView === 'videolab' && (
                            <div className="animate-fade-in text-white">
                                <VideoLab />
                            </div>
                        )}

                        {/* VIEW: TACTICAL (PRG Only) */}
                        {activeView === 'tactical' && (
                            <div className="animate-fade-in space-y-8">
                                <div className="bg-[#1a1a2e] border border-blue-900/30 p-8 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Target className="w-32 h-32 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-3xl font-black text-white uppercase italic mb-4">Tactical Analysis</h2>
                                        <p className="text-gray-400 max-w-2xl text-lg">
                                            Review match footage, analyze opponent structures, and refine your game intelligence.
                                            Tailored for elite performance analysis.
                                        </p>
                                        <div className="w-full h-[850px] border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative z-20 mt-6 bg-[#0a0a2a]">
                                            <TacticalWhiteboard />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW: REPORTS */}
                        {activeView === 'reports' && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-3xl font-black text-white">Performance Reports</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                    {/* Quarterly Report (New) */}
                                    <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 p-8 rounded-3xl flex flex-col justify-between group hover:border-blue-600 transition-all">
                                        <div>
                                            <div className="w-12 h-12 bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <Layers className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Quarterly Executive</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                                Comprehensive review of all 5 pillars, including physical metrics, mental performance, and coach's strategic notes.
                                            </p>
                                        </div>
                                        <button
                                            disabled
                                            className="w-full py-4 bg-neutral-800/50 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-neutral-800"
                                        >
                                            <Lock className="w-4 h-4" />
                                            Report Locked
                                        </button>
                                    </div>

                                    {/* Technical Report */}
                                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl flex flex-col justify-between opacity-75">
                                        <div>
                                            <div className="w-12 h-12 bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center mb-6">
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Technical Analysis</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                                Deep dive into biomechanics, force plate data, and video lab kinematics. Recommended for S&C coaches.
                                            </p>
                                        </div>
                                        <button
                                            disabled
                                            className="w-full py-4 bg-neutral-800/50 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-neutral-800"
                                        >
                                            <Lock className="w-4 h-4" />
                                            Report Locked
                                        </button>
                                    </div>

                                    {/* Development Summary */}
                                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl flex flex-col justify-between opacity-75">
                                        <div>
                                            <div className="w-12 h-12 bg-green-900/20 text-green-500 rounded-xl flex items-center justify-center mb-6">
                                                <Target className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Development Summary</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                                Simplified progress report for parents and players. Focuses on consistency and injury prevention status.
                                            </p>
                                        </div>
                                        <button
                                            disabled
                                            className="w-full py-4 bg-neutral-800/50 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-neutral-800"
                                        >
                                            <Lock className="w-4 h-4" />
                                            Report Locked
                                        </button>
                                    </div>

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
                                    <button
                                        disabled
                                        className="bg-neutral-800 text-gray-500 font-bold py-3 px-6 rounded-xl cursor-not-allowed flex items-center gap-2 border border-neutral-700"
                                    >
                                        <Lock className="w-4 h-4" />
                                        <span>Submissions Locked</span>
                                    </button>
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
            </div>
        </SafetyGuard >
    );
};

export default AthleteDashboard;
