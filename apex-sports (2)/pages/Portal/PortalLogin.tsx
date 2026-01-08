import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, User } from 'lucide-react';
import { useData } from '../../context/DataContext';

const PortalLogin: React.FC = () => {
    const [athleteId, setAthleteId] = useState('');
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { fetchAndAddAthlete } = useData() as any;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const term = athleteId.trim();
        const securePin = pin.trim();

        if (!term || !securePin) return;

        setIsLoading(true);
        setError('');

        try {
            const result = await fetchAndAddAthlete(term, securePin);
            if (!result) {
                throw new Error("Invalid Email or Passcode.");
            }

            // v18.0: Routing Guard
            // Redirect Admin OR Team Tier directly to Team Dashboard
            const isTeamUser = result.productTier === 'Team' || result.package === 'Team' || result.productTier === 'team';

            if (result.email === 'admin@apexsports.co.za' || isTeamUser) {
                navigate('/portal/team');
            } else {
                navigate(`/portal/${result.id}`);
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            const errorMessage = err?.message || JSON.stringify(err);
            if (errorMessage.includes('security_error') || errorMessage.includes('Invalid Passcode')) {
                setError('Incorrect Passcode. Please try again.');
            } else if (errorMessage.includes('Athlete not found') || errorMessage.includes('not found')) {
                setError('Account Pending Verification. Please contact your coach.');
            } else {
                setError(`Access Denied: ${errorMessage}.`);
            }
            setIsLoading(false);
            return;
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-start md:justify-center items-center pt-32 md:pt-0 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div> {/* Optional generic grid if available, or just noise */}
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-20">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/5 mb-6 shadow-glow">
                        <img src="/images/logo.png" alt="Apex Logo" className="w-12 h-12 object-contain" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2 flex items-center justify-center gap-3">
                        APEX LAB
                        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold tracking-wider shadow-lg align-top uppercase">Beta</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">Secure High-Performance Gateway</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4 animate-shake">
                        <div className="p-2 bg-red-500/20 rounded-full shrink-0">
                            <Lock className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                            <p className="text-red-400 text-sm font-bold">Access Denied</p>
                            <p className="text-red-400/80 text-xs mt-1">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                            Athlete Identity
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur duration-500"></div>
                            <div className="relative bg-neutral-900/80 border border-neutral-800 rounded-xl flex items-center p-1 group-focus-within:border-transparent transition-colors">
                                <div className="p-3 text-gray-500 group-focus-within:text-white transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={athleteId}
                                    onChange={(e) => setAthleteId(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent text-white font-medium outline-none placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                            Security Pin
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur duration-500"></div>
                            <div className="relative bg-neutral-900/80 border border-neutral-800 rounded-xl flex items-center p-1 group-focus-within:border-transparent transition-colors">
                                <div className="p-3 text-gray-500 group-focus-within:text-white transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="••••"
                                    className="w-full bg-transparent text-white font-medium outline-none placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!athleteId.trim() || !pin.trim() || isLoading}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <span className="relative z-10 text-white uppercase tracking-wider text-sm flex items-center gap-2">
                            {isLoading ? 'Verifying...' : 'Initialize Session'}
                            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </span>
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-white/5 space-y-4">
                    <a
                        href="mailto:marc@apexsports.co.za?subject=New Athlete Application"
                        className="block w-full py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm text-center hover:bg-white/5 hover:text-white transition-all hover:border-white/20"
                    >
                        Request Access
                    </a>

                    <div className="flex items-center justify-between text-[10px] text-gray-600 font-mono uppercase tracking-wider">
                        <span>v16.1.4 Secure</span>
                        <a href="mailto:support@apexsports.co.za" className="hover:text-gray-400 transition-colors">Help</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalLogin;
