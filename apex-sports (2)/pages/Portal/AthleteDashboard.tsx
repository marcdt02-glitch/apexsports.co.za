import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { analyzeAthlete } from '../../utils/dataEngine';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area, Line
} from 'recharts';
import {
    Download, AlertTriangle, CheckCircle, ChevronLeft, UploadCloud,
    LayoutDashboard, Target, BookOpen, FileText, Menu, X, Save, ExternalLink,
    Activity, Shield, Battery, TrendingUp
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
                    {/* Track */}
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="transparent"
                        stroke="#262626" // neutral-800
                        strokeWidth="6"
                    />
                    {/* Progress */}
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
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

// --- Main Dashboard ---

const AthleteDashboard: React.FC = () => {
    const { athleteId } = useParams<{ athleteId: string }>();
    const { getAthlete } = useData();
    const [activeView, setActiveView] = useState<'dashboard' | 'goals' | 'library' | 'reports'>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Local State for Goals
    const [goals, setGoals] = useState({
        season: "Qualify for National Selection",
        process1: "Complete 100% of prescribed S&C sessions",
        process2: "Daily mobility work for 15 mins",
        process3: "Track sleep quality and duration",
        isEditing: false
    });

    const athlete = athleteId ? getAthlete(athleteId) : undefined;

    if (!athlete) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Athlete Not Found</h2>
                    <p className="text-gray-400 mb-6">Could not find data for ID: {athleteId}</p>
                    <Link to="/" className="text-red-500 hover:text-red-400 font-bold">Return Home</Link>
                </div>
            </div>
        );
    }

    const analysis = analyzeAthlete(athlete);
    const { flags, recommendation } = analysis;

    // Chart Data
    const radarData = [
        { subject: 'Hamstring', A: athlete.scoreHamstring, fullMark: 100 },
        { subject: 'Quad', A: athlete.scoreQuad, fullMark: 100 },
        { subject: 'Adduction', A: athlete.scoreAdduction, fullMark: 100 },
        { subject: 'Ankle', A: athlete.scoreAnkle, fullMark: 100 },
        { subject: 'Shoulder', A: athlete.scoreShoulder, fullMark: 100 },
        { subject: 'Neck', A: athlete.scoreNeck, fullMark: 100 },
    ];

    // ACWR Logic
    const acwrValue = analysis.performance ? analysis.performance.acwr : 1.1;
    const acwrHighRisk = acwrValue > 1.5 || acwrValue < 0.8;
    const acwrColor = acwrHighRisk ? '#ef4444' : '#22c55e';
    const recentSessions = analysis.performance ? analysis.performance.sessions.slice(0, 7).reverse() : [];

    // Views
    const DashboardView = () => (
        <div className="space-y-16 animate-fade-in-up">

            {/* 1. Ring/Dial Scorecards (UI Update) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center bg-neutral-900/50 p-12 rounded-3xl border border-neutral-800">
                <CircleProgress
                    percentage={analysis.scores?.performance ?? 0}
                    color="#3b82f6" // Blue
                    label="Performance"
                    icon={TrendingUp}
                />
                <CircleProgress
                    percentage={analysis.scores?.screening ?? 0}
                    color="#a855f7" // Purple
                    label="Screening"
                    icon={Shield}
                />
                <CircleProgress
                    percentage={analysis.scores?.readiness ?? 0}
                    color="#22c55e" // Green
                    label="Readiness"
                    icon={Battery}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Metrics Column */}
                <div className="col-span-1 lg:col-span-2 space-y-12">
                    {/* Radar */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-1 h-8 bg-red-600 rounded-full"></span>
                                Performance Profile
                            </h2>
                            <span className="text-xs text-gray-500 font-bold border border-gray-700 px-3 py-1 rounded-full uppercase tracking-wider">Live Feed</span>
                        </div>
                        <div className="h-[450px] w-full flex items-center justify-center -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Athlete" dataKey="A" stroke="#ef4444" strokeWidth={3} fill="#ef4444" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                            {[
                                { label: 'IMTP Peak', val: `${athlete.imtpPeakForce} N` },
                                { label: 'Asymmetry', val: `${athlete.peakForceAsymmetry}%`, color: flags.isHighRisk ? 'text-red-500' : 'text-green-500' },
                                { label: 'Ankle ROM', val: `${Math.round((athlete.ankleRomLeft + athlete.ankleRomRight) / 2)}°` },
                                { label: 'H:Q Ratio', val: athlete.hamstringQuadLeft },
                            ].map((stat, i) => (
                                <div key={i} className="bg-black p-6 rounded-2xl border border-neutral-800 flex flex-col items-center text-center">
                                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">{stat.label}</p>
                                    <p className={`text-2xl font-mono font-bold ${stat.color || 'text-white'}`}>{stat.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Load Monitoring Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* ACWR Gauge */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                            <h2 className="text-lg font-bold mb-8 text-gray-400 uppercase tracking-widest">Acute:Chronic Ratio</h2>
                            <div className="relative w-56 h-28 overflow-hidden mb-6">
                                <div className="absolute top-0 left-0 w-full h-full bg-neutral-800 rounded-t-full"></div>
                                <div
                                    className="absolute top-0 left-0 w-full h-full rounded-t-full origin-bottom transition-all duration-1000"
                                    style={{
                                        background: `conic-gradient(from 180deg at 50% 100%, ${acwrColor} 0deg, ${acwrColor} ${Math.min(180, (acwrValue / 2.0) * 180)}deg, transparent 0deg)`,
                                        opacity: 0.9
                                    }}
                                ></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center">
                                    <span className="text-5xl font-black text-white tracking-tighter">{acwrValue}</span>
                                </div>
                            </div>
                            <div className={`text-sm font-bold px-4 py-2 rounded-lg bg-black border ${acwrHighRisk ? 'border-red-900 text-red-500' : 'border-green-900 text-green-500'}`}>
                                {acwrHighRisk ? 'High Load Risk' : 'Optimal Load Zone'}
                            </div>
                        </div>

                        {/* RPE vs HR Chart */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
                            <h2 className="text-lg font-bold mb-8 text-gray-400 uppercase tracking-widest text-center">Internal Load</h2>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={recentSessions}>
                                        <defs>
                                            <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" hide />
                                        <YAxis yAxisId="left" hide domain={[0, 10]} />
                                        <YAxis yAxisId="right" hide domain={[0, 220]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                        <Area yAxisId="right" type="monotone" dataKey="maxHr" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
                                        <Line yAxisId="left" type="monotone" dataKey="rpe" stroke="#ff7300" strokeWidth={3} dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-6 text-xs mt-4 font-bold tracking-wider">
                                    <span className="text-purple-400 flex items-center gap-2"><div className="w-2 h-2 bg-purple-400 rounded-full"></div> BPM</span>
                                    <span className="text-orange-400 flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> RPE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Column */}
                <div className="space-y-12">
                    {flags.isHighRisk || acwrHighRisk ? (
                        <div className="bg-red-950/30 border border-red-900/50 rounded-3xl p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-red-900/20 rounded-xl">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-red-500">Attention Required</h3>
                            </div>
                            <ul className="space-y-3 list-disc pl-5 text-gray-300 text-sm leading-relaxed">
                                {flags.notes.map((note, i) => <li key={i}>{note}</li>)}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-green-950/30 border border-green-900/50 rounded-3xl p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-900/20 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-green-500">All Systems Go</h3>
                            </div>
                            <p className="text-gray-300 text-sm">Metrics are within optimal ranges.</p>
                        </div>
                    )}

                    <div className="bg-neutral-800 rounded-3xl p-10 border-t-8 border-white shadow-2xl">
                        <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">Primary Focus</h3>
                        <h4 className="text-3xl font-black text-white mb-4 leading-tight">{recommendation.focusArea}</h4>
                        <p className="text-gray-300 leading-relaxed mb-8">{recommendation.description}</p>
                        <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all hover:scale-[1.02]">
                            View Prescribed Protocol
                        </button>
                    </div>

                    <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 no-print">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" /> Log Session
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" className="bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-white transition-colors outline-none" placeholder="Duration (m)" />
                                <input type="number" className="bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-white transition-colors outline-none" placeholder="Max HR" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500 font-bold uppercase"><span>RPE: Easy</span><span>Max Effort</span></div>
                                <input type="range" min="1" max="10" className="w-full accent-white h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <button className="w-full bg-neutral-800 text-white font-bold py-4 rounded-xl hover:bg-neutral-700 transition-colors border border-gray-700">Submit Log</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Reuse existing Views for now (Goals, Library, Reports)
    // Minimizing prompt token usage by skipping full re-write of unchanging components
    const GoalsView = () => (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-8">My Roadmap</h2>
            <div className="p-12 border border-dashed border-neutral-800 rounded-3xl text-center text-gray-500">
                Goals Component (Unchanged)
            </div>
        </div>
    );
    const LibraryView = () => (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-8">The Library</h2>
            <div className="p-12 border border-dashed border-neutral-800 rounded-3xl text-center text-gray-500">
                Library Component (Unchanged: See previous version to restore if needed)
            </div>
        </div>
    );
    const ReportsView = () => (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-8">Reports</h2>
            <div className="p-12 border border-dashed border-neutral-800 rounded-3xl text-center text-gray-500">
                Reports Component (Unchanged)
            </div>
        </div>
    );

    // Restore Full Goals/Library/Reports for production (Saving Context Space in this turn)
    // I will actually write the FULL file to ensure nothing is lost.

    // ... (Redefining full components below to ensure valid file) ...

    const FullGoalsView = () => (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Season Goals</h2>
                <button
                    onClick={() => setGoals({ ...goals, isEditing: !goals.isEditing })}
                    className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    {goals.isEditing ? <Save className="w-4 h-4" /> : null}
                    {goals.isEditing ? "Save Changes" : "Edit Goals"}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-8 h-8 text-red-500" />
                        <h3 className="text-xl font-bold text-white">The North Star</h3>
                    </div>
                    {goals.isEditing ? (
                        <textarea
                            value={goals.season}
                            onChange={(e) => setGoals({ ...goals, season: e.target.value })}
                            className="w-full h-32 bg-black border border-neutral-700 rounded-xl p-4 text-white text-lg focus:border-white outline-none"
                        />
                    ) : (
                        <p className="text-2xl font-bold text-white leading-tight">{goals.season}</p>
                    )}
                </div>
                <div className="space-y-4">
                    {['process1', 'process2', 'process3'].map((key, i) => (
                        <div key={key} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Pillar {i + 1}</h4>
                            {goals.isEditing ? (
                                <input
                                    type="text"
                                    value={(goals as any)[key]}
                                    onChange={(e) => setGoals({ ...goals, [key]: e.target.value })}
                                    className="bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-white outline-none w-full"
                                />
                            ) : (
                                <p className="text-lg text-white font-medium">{(goals as any)[key]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const FullLibraryView = () => (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-8">The Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "The Mentorship Blueprint", type: "Mindset", desc: "Professional standards, extreme accountability, and the 'CEO of You' mindset." },
                    { title: "The Inner Edge", type: "Psych Skills", desc: "The 3-2-1 Reset, pressure management, and building a recovery mindset." },
                    { title: "The Lab Manual", type: "S&C Science", desc: "Understanding VALD testing and the Acute:Chronic Workload Ratio (ACWR)." },
                ].map((item, i) => (
                    <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-white/30 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-neutral-800 rounded-lg group-hover:bg-white/10 transition-colors">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase border border-gray-800 px-2 py-1 rounded">{item.type}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-6">{item.desc}</p>
                        <button className="text-white font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                            Read Document <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const FullReportsView = () => (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-8">Performance Reports</h2>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Export Data</h3>
                    <p className="text-gray-400">Generate a PDF report of your current dashboard metrics.</p>
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    <Download className="w-5 h-5" /> Download PDF
                </button>
            </div>
        </div>
    );

    // --- Main Layout ---
    const handleDownloadPDF = async () => {
        if (!dashboardRef.current) return;
        const canvas = await html2canvas(dashboardRef.current, { scale: 2, backgroundColor: '#000000', ignoreElements: (el) => el.classList.contains('no-print') });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`APEX_Report_${athlete.name}.pdf`);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row" ref={dashboardRef}>

            {/* Mobile Header Toggle */}
            <div className="md:hidden bg-neutral-900 p-4 border-b border-gray-800 flex justify-between items-center no-print">
                <div className="flex items-center gap-2">
                    <img src="/images/logo.png" className="w-8 h-8 object-contain" alt="Logo" />
                    <span className="font-bold uppercase tracking-wider">Apex Hub</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
                    {sidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 no-print
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-10 border-b border-gray-800 flex flex-col items-center">
                    <div className="w-24 h-24 bg-black rounded-full border-2 border-white flex items-center justify-center mb-6 shadow-2xl">
                        <span className="text-3xl font-bold">{athlete.name.charAt(0)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white text-center mb-1">{athlete.name}</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest border border-gray-800 px-3 py-1 rounded-full">Athlete</p>
                </div>

                <nav className="p-6 space-y-4">
                    <button onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold ${activeView === 'dashboard' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </button>
                    <button onClick={() => { setActiveView('goals'); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold ${activeView === 'goals' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Target className="w-5 h-5" /> My Roadmap
                    </button>
                    <button onClick={() => { setActiveView('library'); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold ${activeView === 'library' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <BookOpen className="w-5 h-5" /> The Library
                    </button>
                    <button onClick={() => { setActiveView('reports'); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold ${activeView === 'reports' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <FileText className="w-5 h-5" /> Reports
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
                    <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold">
                        <ChevronLeft className="w-4 h-4" /> Return Home
                    </Link>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto h-screen bg-black">
                <div className="p-6 md:p-16 pb-32 max-w-7xl mx-auto">
                    {activeView === 'dashboard' && <DashboardView />}
                    {activeView === 'goals' && <FullGoalsView />}
                    {activeView === 'library' && <FullLibraryView />}
                    {activeView === 'reports' && <FullReportsView />}
                </div>
            </div>

        </div>
    );
};

export default AthleteDashboard;
