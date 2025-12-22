import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, User } from 'lucide-react';

const PortalLogin: React.FC = () => {
    const [athleteId, setAthleteId] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (athleteId.trim()) {
            navigate(`/portal/${athleteId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-black" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-wider text-white">Athlete Portal</h1>
                    <p className="text-gray-400 mt-2 text-sm">Enter your unique Athlete ID to access your performance dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Athlete ID
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={athleteId}
                                onChange={(e) => setAthleteId(e.target.value)}
                                placeholder="e.g. athlete-0"
                                className="w-full bg-black border border-neutral-700 rounded-lg py-3 pl-12 pr-4 text-white focus:border-white transition-colors outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!athleteId.trim()}
                        className="w-full bg-white text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>Access Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-neutral-800 pt-6 space-y-4">
                    <button
                        onClick={() => navigate('/welcome-athlete')}
                        className="w-full bg-neutral-800 text-white font-bold py-3 rounded-lg hover:bg-neutral-700 transition-colors border border-gray-700"
                    >
                        Create New Account
                    </button>
                    <p className="text-xs text-gray-500">
                        Trouble logging in? <a href="mailto:admin@apexsports.co.za" className="text-white underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PortalLogin;
