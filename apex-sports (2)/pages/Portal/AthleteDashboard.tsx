import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { analyzeAthlete } from '../../utils/dataEngine';
import SafetyGuard from '../../components/SafetyGuard';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Line, Legend
} from 'recharts';
import {
    AlertTriangle, CheckCircle, UploadCloud, AlertCircle, Zap,
    LayoutDashboard, Target, BookOpen, FileText, Menu, X, Save, ExternalLink,
    Activity, Shield, Battery, TrendingUp, ChevronRight, Lock, User, LogOut
} from 'lucide-react';
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

const AthleteDashboard: React.FC = () => {
    const { athleteId } = useParams<{ athleteId: string }>();
    const { getAthlete } = useData();
    const [activeView, setActiveView] = useState<'dashboard' | 'goals' | 'library' | 'reports' | 'wellness'>('dashboard');
    const [clinicalTab, setClinicalTab] = useState<'lower' | 'upper' | 'symmetry'>('lower');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const athlete = athleteId ? getAthlete(athleteId) : undefined;
    const [searchTimeout, setSearchTimeout] = useState(false);

    React.useEffect(() => {
        if (!athlete && athleteId) {
            const timer = setTimeout(() => setSearchTimeout(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [athlete, athleteId]);

    if (!athlete) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
                {!searchTimeout ? (
                    <>
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-8"></div>
                        <h2 className="text-2xl font-bold mb-4">Searching Performance Database...</h2>
                        <p className="text-gray-400 mb-6">Checking ID: {athleteId}</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-8 border border-neutral-800">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Athlete Not Found</h2>
                        <button onClick={() => window.location.href = '/#/portal'} className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">Return to Login</button>
                    </>
                )}
            </div>
        );
    }

    const analysis = analyzeAthlete(athlete);
    const { flags, recommendation } = analysis;

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

    // v17.1 Access Logic
    // Elite or Testing S&C -> Full Access
    // Camp or Basic -> Restricted
    const tier = (athlete.productTier || '').trim().toLowerCase();
    const isFullAccess = tier.includes('elite') || tier.includes('testing s&c');

    const showAdvancedMetrics = isFullAccess;

    // Hero Stat Triggers
    const isFatigued = athlete.readinessScore < 65 || athlete.groinTimeToMax > 1.5;
    const showHeroStat = showAdvancedMetrics; // Only show for Advanced tiers (Clinical)

    return (
        <SafetyGuard athlete={athlete}>
            <div className="min-h-screen bg-black text-white pb-20 font-sans">

                {/* Fixed Header (Pushed down by Global Navbar h-24) */}
                <div className="fixed top-24 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-neutral-800">
                    <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
                        <div className="flex items-center gap-4">
                            {/* NEW: Menu Trigger */}
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden">
                                <Menu className="w-6 h-6" />
                            </button>

                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="bg-white text-black font-black text-xl px-2 py-1 transform -skew-x-12 group-hover:bg-gray-200 transition-colors">
                                    APEX
                                </div>
                            </Link>
                        </div>

                        {/* Desktop: Sidebar actually renders as a sidebar, so we don't need top links here unless requested. Keeping existing stats. */}

                        <div className="flex items-center gap-8">
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
                                                <span className="text-[10px] font-bold text-green-500 uppercase">Clinical Link Active</span>
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
                </div>

                {/* SIDEBAR NAVIGATION */}
                {/* Overlay for Mobile */}
                {sidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

                <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 transform transition-transform duration-300 lg:translate-x-0 pt-48 pb-10 flex flex-col mt-24 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="px-6 space-y-2">
                        <button
                            onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>

                        {/* MENTORSHIP & GOALS (Internal View) */}
                        {(() => {
                            const isUnlocked = pkg.includes('mentorship') || pkg.includes('elite');
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
                            const isUnlocked = pkg.includes('mentorship') || pkg.includes('elite');
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
                <div ref={dashboardRef} className="pt-56 px-4 max-w-7xl mx-auto space-y-12 lg:pl-72">

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
                    {activeView === 'dashboard' && (
                        <div className="space-y-12 animate-fade-in">

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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-neutral-900/40 p-8 rounded-3xl border border-neutral-800">
                                <CircleProgress percentage={analysis.scores?.performance ?? 0} color="#3b82f6" label="Performance" icon={TrendingUp} />
                                {showAdvancedMetrics ? (
                                    <>
                                        <CircleProgress percentage={analysis.scores?.screening ?? 0} color="#a855f7" label="MQS" icon={Shield} />
                                        <CircleProgress percentage={athlete.scoreAdduction ?? 0} color="#ef4444" label="Strength" icon={Activity} />
                                        <CircleProgress percentage={analysis.scores?.powerIndex ?? 0} color="#f59e0b" label="Power Index" icon={Zap} />
                                    </>
                                ) : (
                                    <div className="col-span-3 flex items-center justify-center opacity-30 border-l border-neutral-800 bg-neutral-900/50 rounded-r-xl">
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
                                                            <Tooltip
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
                                        <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                                            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                            {showAdvancedMetrics ? 'Performance Metrics' : 'Field Test Results'}
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <MetricCard label="Agility T" value={`${athlete.agilityTime || '-'} s`} />
                                            <MetricCard label="Jump Dist." value={`${athlete.broadJump || '-'} cm`} />

                                            {showAdvancedMetrics && (
                                                <>
                                                    <MetricCard label="IMTP Peak" value={`${athlete.imtpPeakForce} N`} />
                                                    <MetricCard label="RFD 200ms" value={`${athlete.imtpRfd200} N/s`} />
                                                    <MetricCard label="Asymmetry" value={`${athlete.peakForceAsymmetry}%`} />
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
                                                <div className="flex bg-black rounded-lg p-1 border border-neutral-800">
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
                                                        <MetricCard label="Shoulder ROM (L)" value={`${athlete.shoulderRomLeft}°`} />
                                                        <MetricCard label="Shoulder ROM (R)" value={`${athlete.shoulderRomRight}°`} />
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
                                        <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-neutral-800 transition-transform hover:scale-[1.02]">
                                            View Protocol
                                        </button>
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
                                                    <Tooltip
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
                    {activeView === 'mentorship' && (
                        <div className="space-y-8 animate-fade-in">
                            <h2 className="text-3xl font-black text-white">Mentorship & Goals</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Psychological / Handbooks */}
                                <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                                        <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                                        Psychological Frameworks
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-white transition-colors cursor-pointer flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="w-5 h-5 text-yellow-500" />
                                                <span>Goal Setting Handbook.pdf</span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-white transition-colors cursor-pointer flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="w-5 h-5 text-yellow-500" />
                                                <span>Mental Toughness 101.pdf</span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-gray-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Goals */}
                                <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                    <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                        Your Goals
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-black/50 rounded-xl border dashed border-neutral-700 text-center">
                                            <p className="text-sm text-gray-400 mb-3">No active goals currently set.</p>
                                            <button className="text-xs bg-white text-black font-bold px-3 py-2 rounded uppercase tracking-wider">
                                                + Set New Goal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

                </div>
                {/* Debug Info */}
                <div className="text-center text-gray-800 text-[10px] py-4 font-mono break-words px-4">
                    Debug: {athlete.package} | H:{athlete.scoreHamstring} Q:{athlete.scoreQuad} Add:{athlete.scoreAdduction} Ank:{athlete.scoreAnkle} Sh:{athlete.scoreShoulder} Nk:{athlete.scoreNeck}
                </div>
            </div>
        </SafetyGuard>
    );
};

export default AthleteDashboard;
