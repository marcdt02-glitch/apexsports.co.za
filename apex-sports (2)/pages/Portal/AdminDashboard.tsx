import {
    LayoutDashboard, Search, Lock, User, Activity as ActivityIcon, Calendar, Shield,
    Bell, ChevronRight, X, AlertCircle, RefreshCw, BarChart2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [athletes, setAthletes] = useState<AthleteData[]>([]);
    const [filteredAthletes, setFilteredAthletes] = useState<AthleteData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAthlete, setSelectedAthlete] = useState<AthleteData | null>(null);

    // Filter Logic
    useEffect(() => {
        if (!searchQuery) {
            setFilteredAthletes(athletes);
        } else {
            const lower = searchQuery.toLowerCase();
            const filtered = athletes.filter(a =>
                a.name.toLowerCase().includes(lower) ||
                a.email.toLowerCase().includes(lower)
            );
            setFilteredAthletes(filtered);
        }
    }, [searchQuery, athletes]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // "9900" is hardcoded in google_apps_script.js for now as the admin key
            const data = await fetchAllAthletes(pin);
            if (data && data.length > 0) {
                setAthletes(data);
                setIsAuthenticated(true);
            } else {
                alert('Invalid PIN or No Data Found');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAllAthletes(pin);
            setAthletes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 80) return 'text-emerald-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 90) return 'bg-green-500/20';
        if (score >= 80) return 'bg-emerald-500/20';
        if (score >= 70) return 'bg-yellow-500/20';
        return 'bg-red-500/20';
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-xl">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h2>
                    <p className="text-slate-400 text-center mb-8">Enter secure PIN to view athlete data.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter Admin PIN"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Access Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Apex Admin
                        </h1>
                        <p className="text-xs text-slate-500 font-mono">ALL ATHLETES VIEW</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search athletes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500/50 w-64"
                        />
                    </div>
                    <button onClick={refreshData} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <RefreshCw className={`w-5 h-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => navigate('/')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
                        Exit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-4">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4 md:col-span-3">Athlete</div>
                        <div className="col-span-3 md:col-span-3">Status</div>
                        <div className="col-span-0 md:col-span-2 hidden md:block">Updated</div>
                        <div className="col-span-5 md:col-span-4 text-right">Goals Status</div>
                    </div>

                    {/* Mobile Search - Visible only on small screens */}
                    <div className="md:hidden relative mb-4">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search athletes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm"
                        />
                    </div>

                    {filteredAthletes.map((athlete) => (
                        <div
                            key={athlete.id}
                            onClick={() => setSelectedAthlete(athlete)}
                            className="grid grid-cols-12 gap-4 items-center bg-slate-900/50 hover:bg-slate-800/50 border border-white/5 hover:border-blue-500/30 rounded-xl p-4 transition-all cursor-pointer group"
                        >
                            {/* Athlete Info */}
                            <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm border border-white/5">
                                    {athlete.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                        {athlete.name}
                                    </div>
                                    <div className="text-xs text-slate-500 hidden sm:block">{athlete.email}</div>
                                </div>
                            </div>

                            {/* Readiness & Status */}
                            <div className="col-span-3 md:col-span-3">
                                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg ${getScoreBg(athlete.readinessScore)} border border-white/5`}>
                                    <ActivityIcon className="w-3.5 h-3.5" />
                                    <span className={`font-bold ${getScoreColor(athlete.readinessScore)}`}>
                                        {athlete.readinessScore}%
                                    </span>
                                </div>
                            </div>

                            {/* Last Updated */}
                            <div className="col-span-0 md:col-span-2 hidden md:block text-sm text-slate-400">
                                {athlete.lastUpdated}
                            </div>

                            {/* Goals Indicator */}
                            <div className="col-span-5 md:col-span-4 flex justify-end gap-2 text-xs">
                                {athlete.goals?.year ? (
                                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">Goals Set</span>
                                ) : (
                                    <span className="px-2 py-1 bg-slate-800 text-slate-500 rounded border border-white/5">No Goals</span>
                                )}
                                {athlete.goals?.why && (
                                    <span className="hidden sm:inline-block px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Why Set</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedAthlete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
                        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-white border border-white/10">
                                    {selectedAthlete.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedAthlete.name}</h2>
                                    <p className="text-slate-400 text-sm">{selectedAthlete.email} • {selectedAthlete.productTier}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedAthlete(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Col: Goals */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> Athlete Vision
                                </h3>

                                <div className="bg-slate-950/50 rounded-xl p-5 border border-white/5">
                                    <div className="text-xs font-mono text-slate-500 uppercase mb-2">Year Goals</div>
                                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                                        {selectedAthlete.goals?.year || <span className="text-slate-600 italic">Not set yet.</span>}
                                    </p>
                                </div>

                                <div className="bg-slate-950/50 rounded-xl p-5 border border-white/5">
                                    <div className="text-xs font-mono text-slate-500 uppercase mb-2">The Process</div>
                                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                                        {selectedAthlete.goals?.process || <span className="text-slate-600 italic">Not set yet.</span>}
                                    </p>
                                </div>

                                <div className="bg-slate-950/50 rounded-xl p-5 border border-white/5">
                                    <div className="text-xs font-mono text-slate-500 uppercase mb-2">The Why</div>
                                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                                        {selectedAthlete.goals?.why || <span className="text-slate-600 italic">Not set yet.</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Right Col: Metrics Snapshot */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                                    <ActivityIcon className="w-5 h-5" /> Recent Metrics
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                                        <div className="text-slate-400 text-xs mb-1">Readiness</div>
                                        <div className="text-2xl font-bold text-white">{selectedAthlete.readinessScore}%</div>
                                    </div>
                                    <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                                        <div className="text-slate-400 text-xs mb-1">Last Sync</div>
                                        <div className="text-xl font-bold text-white">{selectedAthlete.lastUpdated}</div>
                                    </div>
                                    <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                                        <div className="text-slate-400 text-xs mb-1">Sleep Score</div>
                                        <div className="text-2xl font-bold text-white">{selectedAthlete.sleep}/5</div>
                                    </div>
                                    <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                                        <div className="text-slate-400 text-xs mb-1">Soreness</div>
                                        <div className="text-2xl font-bold text-white">{selectedAthlete.soreness}/5</div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                                    <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                                        <Calendar className="w-4 h-4" /> Activity Monitor
                                    </div>
                                    <p className="text-sm text-slate-300">
                                        Admin can monitor activity here. Currently showing latest snapshot from Google Sheet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
