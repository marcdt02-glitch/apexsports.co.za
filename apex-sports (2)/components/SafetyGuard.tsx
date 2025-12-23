
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
                    </div >

    <a
        href="mailto:admin@apexsports.co.za?subject=Consent Verification Request"
        className="mt-10 inline-flex items-center gap-3 bg-white text-black font-bold py-4 px-8 rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest"
    >
        <FileSignature className="w-5 h-5" />
        Request Verification
    </a>
                </div >
            </div >
        );
    }

return <>{children}</>;
};

export default SafetyGuard;
