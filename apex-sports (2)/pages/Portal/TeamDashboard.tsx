import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Users, Activity, AlertTriangle, Trophy, LayoutGrid,
    ChevronRight, Shield, Zap, TrendingUp, LogOut
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AthleteData } from '../../utils/dataEngine';

// --- Types ---
interface TeamMetric extends AthleteData {
    sorenessHistory: number[]; // Last 7 days
    readinessHistory: number[]; // Last 7 days
    isGoalkeeper: boolean;
    wristForce?: number;
    reactionTime?: number;
}

// --- Mock Data Generator (Temporary until backend supports bulk fetch) ---
const generateMockTeam = (count: number): TeamMetric[] => {
    const names = [
        "James M.", "Sarah C.", "Michael B.", "Emma W.", "David R.",
        "Lucas P.", "Olivia K.", "Marcus T.", "Sophie L.", "Ryan H.",
        "Nathan D.", "Chloe M.", "Ethan F.", "Zoe G.", "Kieran J.",
        "Liam N.", "Maya S.", "Ben W.", "Ava R.", "Noah C."
    ];

    return Array.from({ length: count }).map((_, i) => ({
        id: `team-${i}`,
        name: names[i % names.length] + (i > names.length ? ` ${i}` : ''),
        email: `athlete${i}@apex.com`,
        date: new Date().toISOString(),
        productTier: i % 3 === 0 ? 'Elite' : 'Basic',
        accountActive: 'YES',
        parentConsent: 'Yes',
        package: 'Elite',

        // Metrics
        readinessScore: 70 + Math.floor(Math.random() * 30), // 70-100
        soreness: Math.floor(Math.random() * 10), // 0-10
        groinSqueeze: 200 + Math.floor(Math.random() * 300),
        imtpPeakForce: 2500 + Math.floor(Math.random() * 2500),

        // History (7 days)
        sorenessHistory: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5)),
        readinessHistory: Array.from({ length: 7 }, () => 60 + Math.floor(Math.random() * 40)),

        // Asymmetry
        kneeExtensionLeft: 400 + Math.floor(Math.random() * 100),
        kneeExtensionRight: 400 + Math.floor(Math.random() * 100) - (Math.random() > 0.8 ? 100 : 0), // Occasional imbalance
        kneeFlexionLeft: 200, // Legacy

        // Goalkeeper
        isGoalkeeper: i % 4 === 0, // 25% are GKs
        wristForce: 150 + Math.floor(Math.random() * 100),
        reactionTime: 200 + Math.floor(Math.random() * 100),

        // Required Props
        hipAbductionLeft: 0, hipAbductionRight: 0,
        shoulderInternalRotationLeft: 0, shoulderInternalRotationRight: 0,
        moveHealth: { lastExercises: [] },
        valdProfileId: '',
        paymentStatus: 'Active', waiverStatus: 'Signed'
    } as TeamMetric));
};

const TeamDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { fetchAndAddAthlete } = useData(); // We might use this later for real data
    const [teamData, setTeamData] = useState<TeamMetric[]>([]);
    const [isGKMode, setIsGKMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load Mock Data on Mount
    useEffect(() => {
        // Simulate API delay
        setTimeout(() => {
            setTeamData(generateMockTeam(20));
            setIsLoading(false);
        }, 800);
    }, []);

    // --- Computed Data ---
    const filteredData = isGKMode ? teamData.filter(a => a.isGoalkeeper) : teamData;

    // Leaderboards
    const topGroin = [...filteredData].sort((a, b) => (b.groinSqueeze || 0) - (a.groinSqueeze || 0)).slice(0, 5);
    const topPeakForce = [...filteredData].sort((a, b) => (b.imtpPeakForce || 0) - (a.imtpPeakForce || 0)).slice(0, 5);

    // Flagged Athletes (Asymmetry > 15%)
    const flaggedAthletes = filteredData.filter(a => {
        if (!a.kneeExtensionLeft || !a.kneeExtensionRight) return false;
        const diff = Math.abs(a.kneeExtensionLeft - a.kneeExtensionRight);
        const max = Math.max(a.kneeExtensionLeft, a.kneeExtensionRight);
        return (diff / max) > 0.15;
    });

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {/* Sidebar - Compact for Admin */}
            <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <span className="text-black font-black text-xl">A</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">APEX</h1>
                            <span className="text-xs text-neutral-400">STAFF PORTAL</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl w-full">
                        <LayoutGrid className="w-5 h-5 text-blue-400" />
                        <span className="font-medium text-sm">Team Overview</span>
                    </button>
                    <Link to="/admin-upload" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                        <Shield className="w-5 h-5" />
                        <span className="font-medium text-sm">Data Upload</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-neutral-800">
                    <button onClick={() => navigate('/portal')} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl w-full transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="flex flex-col gap-8 max-w-7xl mx-auto">

                    {/* Header Controls */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">Team Performance</h2>
                            <p className="text-neutral-400">Live monitoring of {filteredData.length} athletes</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-1 flex items-center">
                                <button
                                    onClick={() => setIsGKMode(false)}
                                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!isGKMode ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                                >
                                    Full Squad
                                </button>
                                <button
                                    onClick={() => setIsGKMode(true)}
                                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${isGKMode ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
                                >
                                    Goalkeepers
                                </button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="h-96 flex items-center justify-center">
                            <Activity className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* Column 1: Squad Heatmap (5 Cols) */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-blue-400" />
                                            Readiness Heatmap (7 Days)
                                        </h3>
                                        <span className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-400">Last Updated: Today</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-8 gap-2 mb-2 text-xs text-neutral-500 font-mono text-center">
                                            <div className="text-left pl-2">ATHLETE</div>
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                                        </div>
                                        {filteredData.map(athlete => (
                                            <div key={athlete.id} className="grid grid-cols-8 gap-2 items-center hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer group">
                                                <div className="font-bold text-sm truncate">{athlete.name.split(' ')[0]}</div>
                                                {athlete.readinessHistory.map((score, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-8 rounded-md flex items-center justify-center text-[10px] font-bold
                                                            ${score >= 90 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                                score >= 75 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                                    score >= 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                                        'bg-red-500/20 text-red-400 border border-red-500/30'}
                                                        `}
                                                    >
                                                        {score}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Leaderboards (4 Cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Groin Force Leaderboard */}
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <Trophy className="w-5 h-5 text-yellow-500" />
                                        Groin Force Leaders
                                    </h3>
                                    <div className="space-y-3">
                                        {topGroin.map((a, i) => (
                                            <div key={a.id} className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-neutral-800 text-white'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-medium text-sm">{a.name}</span>
                                                </div>
                                                <span className="font-mono font-bold text-blue-400">{a.groinSqueeze} N</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Peak Force Leaderboard */}
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <Zap className="w-5 h-5 text-purple-500" />
                                        Peak Force Leaders
                                    </h3>
                                    <div className="space-y-3">
                                        {topPeakForce.map((a, i) => (
                                            <div key={a.id} className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-white'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-medium text-sm">{a.name}</span>
                                                </div>
                                                <span className="font-mono font-bold text-purple-400">{a.imtpPeakForce} N</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Alerts (3 Cols) */}
                            <div className="lg:col-span-3 space-y-6">
                                <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-6 h-full">
                                    <h3 className="font-bold flex items-center gap-2 mb-4 text-red-500">
                                        <AlertTriangle className="w-5 h-5" />
                                        Asymmetry Risks ({flaggedAthletes.length})
                                    </h3>
                                    <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                                        {flaggedAthletes.length === 0 && (
                                            <p className="text-neutral-500 text-sm">No significant asymmetries detected.</p>
                                        )}
                                        {flaggedAthletes.map(a => {
                                            const l = a.kneeExtensionLeft || 0;
                                            const r = a.kneeExtensionRight || 0;
                                            const diff = Math.abs(l - r);
                                            const pct = Math.round((diff / Math.max(l, r)) * 100);
                                            const side = l > r ? 'L' : 'R';

                                            return (
                                                <div key={a.id} className="bg-red-900/10 border border-red-900/50 p-4 rounded-xl">
                                                    <div className="font-bold text-red-200 mb-1">{a.name}</div>
                                                    <div className="flex items-center justify-between text-xs text-red-300">
                                                        <span>Knee Ext Imbalance</span>
                                                        <span className="font-bold bg-red-900/50 px-2 py-0.5 rounded">{pct}% {side}</span>
                                                    </div>
                                                    <div className="mt-2 w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-red-500 h-full" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeamDashboard;
