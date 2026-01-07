import React, { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    tierName: string; // e.g., "Apex Membership" or "Use Testing"
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, tierName }) => {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [formData, setFormData] = useState({
        goal: '',
        hours: '',
        sport: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('success');
    };

    const handleConfirm = () => {
        // Construct Mailto
        const subject = `Application for ${tierName}`;
        const body = `Hi Marc,%0D%0A%0D%0AI would like to apply for the ${tierName}.%0D%0A%0D%0AHere are my details:%0D%0A1. Primary Goal: ${formData.goal}%0D%0A2. Commitment: ${formData.hours} hours/week%0D%0A3. Sport & Level: ${formData.sport}%0D%0A%0D%0ALooking forward to hearing from you.`;

        window.location.href = `mailto:admin@apexsports.co.za?subject=${subject}&body=${body}`;
        onClose();
        // Reset after close
        setTimeout(() => {
            setStep('form');
            setFormData({ goal: '', hours: '', sport: '' });
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative z-10 bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                {step === 'form' ? (
                    <>
                        <h2 className="text-2xl font-black text-white mb-2">Apply for Access</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            The <strong>{tierName}</strong> is a high-performance tier. We need to ensure we are the right fit for your goals.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    1. Primary Athletic Goal
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors"
                                    placeholder="e.g. Make the A-team, Recover from ACL..."
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    2. Weekly Commitment
                                </label>
                                <select
                                    required
                                    className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors appearance-none"
                                    value={formData.hours}
                                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                >
                                    <option value="" disabled>Select hours per week</option>
                                    <option value="1-3">1-3 Hours</option>
                                    <option value="4-7">4-7 Hours</option>
                                    <option value="8-12">8-12 Hours</option>
                                    <option value="12+">12+ Hours (Elite)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    3. Sport & Level
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-white focus:outline-none transition-colors"
                                    placeholder="e.g. Rugby (Craven Week), Hockey (Club)..."
                                    value={formData.sport}
                                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-2"
                            >
                                Review Application <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Send</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            We've prepared your application. Click below to open your email client and send it to our team.
                        </p>
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-colors"
                        >
                            Send Application via Email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
