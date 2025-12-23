
import React from 'react';
import { ShieldAlert, FileSignature } from 'lucide-react';
import { AthleteData } from '../utils/dataEngine';

interface SafetyGuardProps {
    athlete: AthleteData;
    children: React.ReactNode;
}

const SafetyGuard: React.FC<SafetyGuardProps> = ({ athlete, children }) => {
    // v9.5 Strict Consent Block
    // Must be exactly 'yes' (case-insensitive)
    const hasConsent = String(athlete.parentConsent || '').toLowerCase() === 'yes';

    if (!hasConsent) {
        return (
            <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-red-950/20 border-2 border-red-600 rounded-3xl p-12 max-w-2xl backdrop-blur-md">
                    <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <ShieldAlert className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase mb-6 tracking-tighter">
                        Access Restricted
                    </h1>

                    <div className="space-y-6 text-gray-300 text-lg">
                        <p className="font-bold text-xl text-red-500">
                            POPIA / Minor Safety Guard Active
                        </p>
                        <p>
                            We cannot display performance data for this athlete because
                            <span className="text-white font-bold"> Parent Consent </span>
                            has not been verified in our system.
                        </p>
                        <p className="text-sm border-t border-red-900/50 pt-6 mt-6">
                            Required Action: A legal guardian must sign the APEX Consent Framework.
                        </p>
                    </div>

                    <a
                        href="mailto:admin@apexsports.co.za?subject=Consent Verification Request"
                        className="mt-10 inline-flex items-center gap-3 bg-white text-black font-bold py-4 px-8 rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest"
                    >
                        <FileSignature className="w-5 h-5" />
                        Request Verification
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default SafetyGuard;
