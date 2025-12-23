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
            navigate(`/portal/${result.id}`);
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
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-black" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-wider text-white">Athlete Portal</h1>
                    <p className="text-gray-400 mt-2 text-sm">Enter your credentials to access your performance dashboard.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-950/50 border border-red-900 rounded-lg flex items-start gap-3">
                        <div className="p-2 bg-red-900 rounded-full shrink-0">
                            <Lock className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-red-200 text-sm font-bold break-all">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={athleteId}
                                onChange={(e) => setAthleteId(e.target.value)}
                                placeholder="e.g. athlete@apexsports.co.za"
                                className="w-full bg-black border border-neutral-700 rounded-lg py-3 pl-12 pr-4 text-white focus:border-white transition-colors outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Passcode
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="Enter your 4-digit pin"
                                className="w-full bg-black border border-neutral-700 rounded-lg py-3 pl-12 pr-4 text-white focus:border-white transition-colors outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!athleteId.trim() || !pin.trim() || isLoading}
                        className="w-full bg-white text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span>Verifying Credentials...</span>
                        ) : (
                            <>
                                <span>Access Dashboard</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-neutral-800 pt-6 space-y-4">
                    <a
                        href="https://forms.google.com/your-onboarding-form" // TODO: Update with user provided link
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full bg-neutral-800 text-white font-bold py-3 rounded-lg hover:bg-neutral-700 transition-colors border border-gray-700"
                    >
                        Join APEX Sports
                    </a>
                    <p className="text-xs text-gray-500">
                        Trouble logging in? <a href="mailto:admin@apexsports.co.za" className="text-white underline">Contact Support</a>
                    </p>
                    <p className="text-[10px] text-gray-700 font-mono mt-4 pt-4 border-t border-neutral-800/50">
                        System v16.1 (Auth Patch v8.0)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PortalLogin;
