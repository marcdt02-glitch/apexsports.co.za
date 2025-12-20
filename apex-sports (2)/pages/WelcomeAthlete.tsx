import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Lock, Unlock } from 'lucide-react';

const WelcomeAthlete: React.FC = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    // Placeholder for Meta Pixel
    useEffect(() => {
        // console.log("Meta Pixel: PageView / WelcomeAthlete");
        // if (window.fbq) window.fbq('track', 'PageView');
    }, []);

    const handleUnlock = () => {
        setIsFormSubmitted(true);
        // console.log("Meta Pixel: Track Form Confirmation");
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-4">
                        Welcome to Apex
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Complete your onboarding to unlock session scheduling.
                    </p>
                </div>

                {/* STEP 1: Administrative Onboarding (Google Form) */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-8">
                    <div className="bg-neutral-800 px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
                        <h2 className="text-white font-bold flex items-center gap-2">
                            <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded">STEP 1</span>
                            Administrative Onboarding & Waiver
                        </h2>
                    </div>
                    <div className="p-4 md:p-8 flex justify-center bg-white">
                        {/* Replace this SRC with your actual Google Form Embed URL */}
                        {/* Make sure height is sufficient */}
                        <iframe
                            src="https://docs.google.com/forms/d/e/1FAIpQLSfD_example_form_id/viewform?embedded=true"
                            width="640"
                            height="800"
                            frameBorder="0"
                            marginHeight={0}
                            marginWidth={0}
                            className="w-full max-w-2xl bg-white"
                            title="Onboarding Form"
                        >
                            Loading…
                        </iframe>
                    </div>
                    <div className="bg-neutral-800 px-6 py-4 border-t border-neutral-700 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-400 text-sm">
                            I have completed and submitted the form above.
                        </p>
                        <button
                            onClick={handleUnlock}
                            disabled={isFormSubmitted}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${isFormSubmitted
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-white text-black hover:bg-gray-200'
                                }`}
                        >
                            {isFormSubmitted ? <CheckSquare className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            {isFormSubmitted ? 'Confirmed' : 'Unlock Scheduling'}
                        </button>
                    </div>
                </div>

                {/* STEP 2: The Gatekeeper (Booking Link) */}
                <div className={`transition-all duration-500 ${isFormSubmitted ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 grayscale'}`}>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden relative">

                        {!isFormSubmitted && (
                            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 border border-neutral-700">
                                    <Lock className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">Scheduling Locked</h3>
                                <p className="text-gray-400 text-sm max-w-md">
                                    Please complete Step 1 to access the booking calendar.
                                </p>
                            </div>
                        )}

                        <div className="bg-neutral-800 px-6 py-4 border-b border-neutral-700">
                            <h2 className="text-white font-bold flex items-center gap-2">
                                <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded">STEP 2</span>
                                Schedule My Session
                            </h2>
                        </div>

                        <div className="p-8 text-center">
                            <p className="text-gray-300 mb-6">
                                You are now cleared to book your sessions.
                            </p>
                            <a
                                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ..." // Replace with actual Calendar Link
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-colors ${isFormSubmitted
                                        ? 'bg-white text-black hover:bg-gray-200 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                        : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                                    }`}
                                onClick={(e) => !isFormSubmitted && e.preventDefault()}
                            >
                                <Calendar className="w-5 h-5" />
                                Book First Session
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WelcomeAthlete;
