import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { analyzeAthlete } from '../../utils/dataEngine';
import SafetyGuard from '../../components/SafetyGuard';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Line
} from 'recharts';
import {
    AlertTriangle, CheckCircle, UploadCloud,
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
    const [activeView, setActiveView] = useState<'dashboard' | 'goals' | 'library' | 'reports'>('dashboard');
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

    // Tier Checks
    const pkg = (athlete.package || '').trim().toLowerCase();
    // Dynamo Access: Elite, or explicit 'Testing' packages
    const hasDynamoAccess = pkg.includes('elite') || pkg.includes('testing');

    // Legacy support: In some contexts 'isEliteTier' was used for everything. 
    // Now we distinguish:
    // - Readiness/Neural: Only Elite? Or everyone with data? Let's use hasDynamoAccess for now as it implies higher level monitoring.
    // - Radar/Dynamo: hasDynamoAccess
    const showAdvancedMetrics = hasDynamoAccess;

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

                        {/* MENTORSHIP LINK */}
                        {(() => {
                            const isUnlocked = pkg.includes('mentorship') || pkg.includes('elite');
                            return (
                                <Link
                                    to="/mentorship"
                                    onClick={(e) => {
                                        if (!isUnlocked) {
                                            e.preventDefault();
                                            alert("Mentorship Access Required. Please upgrade your package.");
                                        } else {
                                            setSidebarOpen(false);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isUnlocked ? 'text-gray-400 hover:bg-neutral-800 hover:text-white' : 'text-gray-600 cursor-not-allowed opacity-50'}`}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    <span>Mentorship</span>
                                    {!isUnlocked && <Lock className="w-4 h-4 ml-auto" />}
                                </Link>
                            );
                        })()}

                        {/* GOALS */}
                        {(() => {
                            const isUnlocked = pkg.includes('mentorship') || pkg.includes('elite');
                            return (
                                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isUnlocked ? 'text-gray-400 hover:text-white hover:bg-neutral-800' : 'text-gray-600 cursor-not-allowed opacity-50'}`}>
                                    <Target className="w-5 h-5" />
                                    <span>Goals</span>
                                    {!isUnlocked && <Lock className="w-4 h-4 ml-auto" />}
                                </button>
                            );
                        })()}

                        {/* REPORTS */}
                        {(() => {
                            const isUnlocked = pkg.includes('mentorship') || pkg.includes('elite');
                            return (
                                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isUnlocked ? 'text-gray-400 hover:text-white hover:bg-neutral-800' : 'text-gray-600 cursor-not-allowed opacity-50'}`}>
                                    <FileText className="w-5 h-5" />
                                    <span>Reports</span>
                                    {!isUnlocked && <Lock className="w-4 h-4 ml-auto" />}
                                </button>
                            );
                        })()}
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

                    {/* VIEW: DASHBOARD */}
                    {activeView === 'dashboard' && (
                        <div className="space-y-12 animate-fade-in">
                            {/* v8.0 Neural Alerts */}
                            {(showAdvancedMetrics && (athlete.readinessScore < 65 || athlete.groinTimeToMax > 1.5)) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-down">
                                    {athlete.readinessScore < 65 && (
                                        <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl flex items-center gap-4">
                                            <div className="p-3 bg-red-900/20 rounded-full"><Battery className="w-6 h-6 text-red-500" /></div>
                                            <div>
                                                <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider">Recovery Required</h3>
                                                <p className="text-red-200 text-xs">Neural Readiness is critical ({athlete.readinessScore}%). Reduce load.</p>
                                            </div>
                                        </div>
                                    )}
                                    {athlete.groinTimeToMax > 1.5 && (
                                        <div className="bg-yellow-950/20 border border-yellow-900/50 p-4 rounded-xl flex items-center gap-4">
                                            <div className="p-3 bg-yellow-900/20 rounded-full"><Activity className="w-6 h-6 text-yellow-500" /></div>
                                            <div>
                                                <h3 className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Neural Fatigue</h3>
                                                <p className="text-yellow-200 text-xs">Slow reaction time ({athlete.groinTimeToMax}s). Explosive output limited.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* KPI Dials */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-neutral-900/40 p-8 rounded-3xl border border-neutral-800">
                                <CircleProgress percentage={analysis.scores?.performance ?? 0} color="#3b82f6" label="Performance" icon={TrendingUp} />
                                {showAdvancedMetrics ? (
                                    <>
                                        <CircleProgress percentage={analysis.scores?.screening ?? 0} color="#a855f7" label="Dynamo" icon={Shield} />
                                        <CircleProgress percentage={analysis.scores?.readiness ?? 0} color="#22c55e" label="Readiness" icon={Activity} />
                                    </>
                                ) : (
                                    <div className="col-span-2 flex items-center justify-center opacity-30 border-l border-neutral-800">
                                        <Lock className="w-5 h-5 mr-3 text-gray-500" />
                                        <p className="text-sm font-mono text-gray-500">DYNAMO DATA LOCKED (CAMP TIER)</p>
                                    </div>
                                )}
                            </div>

                            {/* Main Grid: Charts & Performance */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Left Column: Performance Profile (Radar) */}
                                <div className="lg:col-span-2 space-y-8">

                                    {/* Radar Chart (Advanced Only) */}
                                    {showAdvancedMetrics && (
                                        <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl relative">
                                            <div className="flex items-center justify-between mb-8">
                                                <h2 className="text-xl font-bold flex items-center gap-3">
                                                    <span className="w-1 h-6 bg-purple-600 rounded-full"></span>
                                                    Dynamo Screening Profile
                                                </h2>
                                                {athlete.lastUpdated && <span className="text-[10px] text-gray-500 font-mono border border-neutral-800 px-2 py-1 rounded">Updated: {athlete.lastUpdated}</span>}
                                            </div>
                                            <div className="h-[350px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                                        <PolarGrid stroke="#333" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12 }} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                        <Radar name="Athlete" dataKey="A" stroke="#a855f7" strokeWidth={3} fill="#a855f7" fillOpacity={0.3} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    {/* v8.0 Performance Vault (Camp & Elite) */}
                                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                        <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                                            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                            Performance Metrics
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <MetricCard label="IMTP Peak" value={`${athlete.imtpPeakForce} N`} />
                                            <MetricCard label="RFD 200ms" value={`${athlete.imtpRfd200} N/s`} />
                                            <MetricCard label="Asymmetry" value={`${athlete.peakForceAsymmetry}%`} />
                                            <MetricCard label="Jump Dist." value={`${athlete.broadJump || '-'} cm`} />
                                            <MetricCard label="Agility T" value={`${athlete.agilityTime || '-'} s`} />
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
                                                    {['lower', 'upper', 'symmetry'].map((tab) => (
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

                                {/* Right Column: Recommendations & Load */}
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

                                    {/* ACWR / Load */}
                                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl text-center">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Acute:Chronic Ratio</h3>
                                        <div className="text-5xl font-black text-white mb-2">{acwrValue}</div>
                                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${acwrHighRisk ? 'border-red-900 text-red-500 bg-red-900/10' : 'border-green-900 text-green-500 bg-green-900/10'}`}>
                                            {acwrHighRisk ? 'High Risk' : 'Optimal Zone'}
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
