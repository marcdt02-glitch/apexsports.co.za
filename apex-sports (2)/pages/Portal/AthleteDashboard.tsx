import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { analyzeAthlete } from '../../utils/dataEngine';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { Download, AlertTriangle, CheckCircle, ChevronLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AthleteDashboard: React.FC = () => {
    const { athleteId } = useParams<{ athleteId: string }>();
    const { getAthlete } = useData();
    const dashboardRef = useRef<HTMLDivElement>(null);

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

    // Mock Load Data (Randomize for demo based on date)
    const today = new Date();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const loadData = days.map((day, i) => ({
        name: day,
        load: Math.floor(Math.random() * 600) + 200, // Random load 200-800
        avg: 450 // 28-day avg
    }));

    const handleDownloadPDF = async () => {
        if (!dashboardRef.current) return;

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

    return (
        <div className="min-h-screen bg-black text-white pb-20" ref={dashboardRef}>
            {/* Header */}
            <div className="bg-neutral-900 border-b border-gray-800 pt-8 pb-6 px-4 mb-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 no-print">
                            <Link to="/" className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm">
                                <ChevronLeft className="w-4 h-4" /> Back
                            </Link>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                            {athlete.name}
                        </h1>
                        <p className="text-gray-400 text-sm">Target: Professional Performance</p>
                    </div>

                    <div className="flex gap-3 no-print">
                        <button
                            onClick={handleDownloadPDF}
                            className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Radar & Metrics */}
                <div className="col-span-1 lg:col-span-2 space-y-8">

                    {/* Radar Chart Section */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-10 relative overflow-hidden">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                            Performance Profile
                        </h2>

                        <div className="h-[400px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Athlete"
                                        dataKey="A"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        fill="#ef4444"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-black p-4 rounded-xl border border-neutral-800">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">IMTP Peak</p>
                                <p className="text-2xl font-mono font-bold text-white">{athlete.imtpPeakForce} N</p>
                            </div>
                            <div className="bg-black p-4 rounded-xl border border-neutral-800">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">PF Asymmetry</p>
                                <p className={`text-2xl font-mono font-bold ${flags.isHighRisk ? 'text-red-500' : 'text-green-500'}`}>
                                    {athlete.peakForceAsymmetry}%
                                </p>
                            </div>
                            <div className="bg-black p-4 rounded-xl border border-neutral-800">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Avg Ankle ROM</p>
                                <p className="text-2xl font-mono font-bold text-white">
                                    {Math.round((athlete.ankleRomLeft + athlete.ankleRomRight) / 2)}°
                                </p>
                            </div>
                            <div className="bg-black p-4 rounded-xl border border-neutral-800">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">H:Q Ratio (L)</p>
                                <p className="text-2xl font-mono font-bold text-white">{athlete.hamstringQuadLeft}</p>
                            </div>
                        </div>
                    </div>

                    {/* Load Chart Section */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-green-600 rounded-full"></span>
                            Training Load (7 Days)
                        </h2>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={loadData}>
                                    <XAxis dataKey="name" stroke="#4b5563" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#4b5563" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="load" radius={[4, 4, 0, 0]}>
                                        {loadData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.load > entry.avg ? '#22c55e' : '#374151'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Col: Insights & Actions */}
                <div className="space-y-8">

                    {/* Flags Card */}
                    {flags.isHighRisk ? (
                        <div className="bg-red-900/20 border border-red-900/50 rounded-2xl p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                                <h3 className="text-xl font-bold text-red-500">Attention Required</h3>
                            </div>
                            <ul className="space-y-2 list-disc pl-5 text-gray-300">
                                {flags.notes.map((note, i) => (
                                    <li key={i}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-green-900/20 border border-green-900/50 rounded-2xl p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                                <h3 className="text-xl font-bold text-green-500">All Metrics Healthy</h3>
                            </div>
                            <p className="text-gray-300">No major asymmetry or injury risk factors detected.</p>
                        </div>
                    )}

                    {/* What's Next Card */}
                    <div className="bg-neutral-800 rounded-2xl p-8 border-l-4 border-white">
                        <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-3">What's Next?</h3>
                        <h4 className="text-2xl font-bold text-white mb-2">{recommendation.focusArea}</h4>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            {recommendation.description}
                        </p>
                        <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                            View Recommended Drills
                        </button>
                    </div>

                    {/* Log Session Card */}
                    <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 no-print">
                        <h3 className="text-lg font-bold text-white mb-4">Today's Session</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase mb-1">Duration (Mins)</label>
                                <input type="number" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-white transition-colors outline-none" placeholder="60" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase mb-1">RPE (1-10)</label>
                                <input type="range" min="1" max="10" className="w-full accent-white" />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Easy</span>
                                    <span>Max Effort</span>
                                </div>
                            </div>
                            <button className="w-full bg-neutral-800 text-white font-bold py-3 rounded-lg hover:bg-neutral-700 transition-colors border border-gray-700">
                                Log Session
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AthleteDashboard;
