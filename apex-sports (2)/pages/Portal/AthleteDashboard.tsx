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
    LayoutDashboard, Target, BookOpen, FileText, Menu, X, Save, ExternalLink
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AthleteDashboard: React.FC = () => {
    const { athleteId } = useParams<{ athleteId: string }>();
    const { getAthlete } = useData();
    const [activeView, setActiveView] = useState<'dashboard' | 'goals' | 'library' | 'reports'>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Local State for Goals (Simulating persistence)
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

    ];

// ACWR & Load Data - MOCK FALLBACK IF MISSING
const acwrValue = analysis.performance ? analysis.performance.acwr : 1.1;
const acwrColor = acwrValue > 1.5 || acwrValue < 0.8 ? '#ef4444' : '#22c55e';
const recentSessions = analysis.performance ? analysis.performance.sessions.slice(0, 7).reverse() : [];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const loadData = days.map((day, i) => ({
    name: day,
    load: Math.floor(Math.random() * 600) + 200,
    avg: 450
}));

// PDF Generation
const handleDownloadPDF = async () => {
    // Ideally capture just the dashboard view content
    // For now we'll capture the current ref container
    if (!dashboardRef.current) return;

    // Temporarily hide sidebar logic if needed, but styling handles layout
    const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        ignoreElements: (element) => element.classList.contains('no-print')
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`APEX_Report_${athlete.name}.pdf`);
};

const handleSaveToDrive = () => {
    alert("Integration Note: Reports are configured to save to the 'APEX_Athlete_Vault' folder. Automated emails will be sent from performance@apexsports.co.za.");
};

// --- Views ---

const DashboardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
        {/* Metrics Column */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
            {/* Radar */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-10 relative overflow-hidden">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                    Performance Profile <span className="ml-auto text-xs text-gray-500 font-normal border border-gray-700 px-2 py-1 rounded">Live Feed Pending</span>
                </h2>
                <div className="h-[400px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Athlete" dataKey="A" stroke="#ef4444" strokeWidth={3} fill="#ef4444" fillOpacity={0.3} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-black p-4 rounded-xl border border-neutral-800">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">IMTP Peak</p>
                        <p className="text-2xl font-mono font-bold text-white">{athlete.imtpPeakForce} N</p>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-neutral-800">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">PF Asymmetry</p>
                        <p className={`text-2xl font-mono font-bold ${flags.isHighRisk ? 'text-red-500' : 'text-green-500'}`}>{athlete.peakForceAsymmetry}%</p>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-neutral-800">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Avg Ankle ROM</p>
                        <p className="text-2xl font-mono font-bold text-white">{Math.round((athlete.ankleRomLeft + athlete.ankleRomRight) / 2)}°</p>
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-neutral-800">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">H:Q Ratio (L)</p>
                        <p className="text-2xl font-mono font-bold text-white">{athlete.hamstringQuadLeft}</p>
                    </div>
                </div>
            </div>

            {/* Load Monitoring Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ACWR Gauge */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <h2 className="text-lg font-bold mb-4 w-full flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        Readiness Dial (ACWR) <span className="ml-auto text-xs text-gray-500 font-normal border border-gray-700 px-2 py-1 rounded">Live Feed Pending</span>
                    </h2>

                    <div className="relative w-48 h-24 mt-4 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-neutral-800 rounded-t-full"></div>
                        <div
                            className="absolute top-0 left-0 w-full h-full rounded-t-full origin-bottom transition-all duration-1000"
                            style={{
                                background: `conic-gradient(from 180deg at 50% 100%, ${acwrColor} 0deg, ${acwrColor} ${Math.min(180, (acwrValue / 2.0) * 180)}deg, transparent 0deg)`,
                                opacity: 0.8
                            }}
                        ></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center">
                            <span className="text-4xl font-black text-white">{acwrValue}</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-4">
                        Target: 0.8 - 1.3 <br />
                        <span className={acwrValue > 1.5 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                            {acwrValue > 1.5 ? 'HIGH RISK' : 'OPTIMAL'}
                        </span>
                    </p>
                </div>

                {/* RPE vs HR Chart */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4 w-full flex items-center gap-2">
                        <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                        Internal vs External
                    </h2>
                    <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={recentSessions}>
                                <defs>
                                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" hide />
                                <YAxis yAxisId="left" hide domain={[0, 10]} />
                                <YAxis yAxisId="right" hide domain={[0, 220]} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} itemStyle={{ color: '#fff' }} />
                                <Area yAxisId="right" type="monotone" dataKey="maxHr" stroke="#8884d8" fillOpacity={1} fill="url(#colorHr)" />
                                <Line yAxisId="left" type="monotone" dataKey="rpe" stroke="#ff7300" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-xs mt-2">
                            <span className="text-purple-400 flex items-center gap-1"><div className="w-2 h-2 bg-purple-400 rounded-full"></div> HR</span>
                            <span className="text-orange-400 flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> RPE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Side Column */}
        <div className="space-y-8">
            {flags.isHighRisk || flags.acwrHighRisk ? (
                <div className="bg-red-900/20 border border-red-900/50 rounded-2xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                        <h3 className="text-xl font-bold text-red-500">Attention</h3>
                    </div>
                    <ul className="space-y-2 list-disc pl-5 text-gray-300">
                        {flags.notes.map((note, i) => <li key={i}>{note}</li>)}
                    </ul>
                </div>
            ) : (
                <div className="bg-green-900/20 border border-green-900/50 rounded-2xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <h3 className="text-xl font-bold text-green-500">Metrics Healthy</h3>
                    </div>
                    <p className="text-gray-300">No major injury risk factors detected.</p>
                </div>
            )}

            <div className="bg-neutral-800 rounded-2xl p-8 border-l-4 border-white">
                <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-3">Focus Area</h3>
                <h4 className="text-2xl font-bold text-white mb-2">{recommendation.focusArea}</h4>
                <p className="text-gray-300 leading-relaxed mb-6">{recommendation.description}</p>
                <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                    View Workouts
                </button>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 no-print">
                <h3 className="text-lg font-bold text-white mb-4">Log Daily Session</h3>
                <div className="space-y-4">
                    {/* Simplified Log Form for Dashboard View */}
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" className="bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white transition-colors outline-none" placeholder="Duration (m)" />
                        <input type="number" className="bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white transition-colors outline-none" placeholder="Max HR" />
                    </div>
                    <input type="range" min="1" max="10" className="w-full accent-white" />
                    <div className="flex justify-between text-xs text-gray-500"><span>RPE: Easy</span><span>Max</span></div>
                    <button className="w-full bg-neutral-800 text-white font-bold py-3 rounded-lg hover:bg-neutral-700 transition-colors border border-gray-700">Submit Log</button>
                </div>
            </div>
        </div>
    </div>
);

const GoalsView = () => (
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
                    <h3 className="text-xl font-bold text-white">The North Star (Season Goal)</h3>
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
                    <div key={key} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col justify-center">
                        <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Process Pillar {i + 1}</h4>
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

const LibraryView = () => (
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
        </div >
    );

const ReportsView = () => (
    <div className="animate-fade-in-up">
        <h2 className="text-3xl font-bold text-white mb-8">Performance Reports</h2>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">Generate New Report</h3>
                <p className="text-gray-400">Compile current data into a PDF or save to Drive.</p>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={handleSaveToDrive}
                    className="bg-neutral-800 text-gray-300 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-neutral-700 transition-colors border border-gray-700"
                >
                    <UploadCloud className="w-5 h-5" />
                    Save to Drive
                </button>
                <button
                    onClick={handleDownloadPDF}
                    className="bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Download PDF
                </button>
            </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
                <h3 className="font-bold text-white">History</h3>
            </div>
            <div className="divide-y divide-gray-800">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-neutral-800 rounded-lg">
                                <FileText className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Performance Report - Week {i}</p>
                                <p className="text-gray-500 text-sm">Generated: 2025-01-1{5 - i}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- Main Layout ---

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
        fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 no-print
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-8 border-b border-gray-800 flex flex-col items-center">
                    <div className="w-20 h-20 bg-black rounded-full border-2 border-white flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold">{athlete.name.charAt(0)}</span>
                    </div>
                    <h2 className="text-lg font-bold text-white text-center">{athlete.name}</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Athlete</p>
                </div>

                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </button>
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeView === 'goals' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Target className="w-5 h-5" />
                        My Roadmap
                    </button>
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeView === 'library' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <BookOpen className="w-5 h-5" />
                        The Library
                    </button>
                    <button
                        onClick={() => { setActiveView('reports'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeView === 'reports' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <FileText className="w-5 h-5" />
                        Reports
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
                    <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm px-4">
                        <ChevronLeft className="w-4 h-4" />
                        Return Home
                    </Link>
                </div>
            </div >

    {/* Main Content Area */ }
    < div className = "flex-1 overflow-y-auto h-screen bg-black" >
        <div className="p-6 md:p-12 pb-24 max-w-7xl mx-auto">
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'goals' && <GoalsView />}
            {activeView === 'library' && <LibraryView />}
            {activeView === 'reports' && <ReportsView />}
        </div>
            </div >

        </div >
    );
};

export default AthleteDashboard;
