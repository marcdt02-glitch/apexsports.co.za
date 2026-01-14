import React from 'react';
import { Scale, FileCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-wide uppercase">Terms of Service</h1>
                <p className="text-gray-400 mb-12">Last Updated: January 2026</p>

                <div className="space-y-8 bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">

                    <p className="text-gray-300 leading-relaxed border-b border-gray-800 pb-8">
                        Welcome to Apex Sports. By accessing or using our website, services, and software (including the Video Lab), you agree to be bound by these Terms of Service.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Scale className="w-6 h-6 text-white" />
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-400">
                            By using our services, you confirm that you are at least 18 years old or have the consent of a parent/guardian. If you do not agree to these terms, you must not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <FileCheck className="w-6 h-6 text-white" />
                            2. Use of Services
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials (e.g., Portal Login).</li>
                            <li><strong>Prohibited Use:</strong> You agree not to misuse our services, including attempting to access data that does not belong to you or reverse-engineering our software.</li>
                            <li><strong>Google Drive Integration:</strong> Our Video Lab feature integrates with Google Drive. By using this feature, you authorize us to access the specific files you select for analysis. usage is subject to Google's Terms of Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-white" />
                            3. Disclaimer of Warranties
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Our services, including athletic mentorship and biomechanical analysis, are provided for educational and coaching purposes. They are not a substitute for medical advice.
                            <br /><br />
                            <strong>Limitation of Liability:</strong> Apex Sports shall not be liable for any injuries or damages arising from the use of our training programs or website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-white" />
                            4. Intellectual Property
                        </h2>
                        <p className="text-gray-400">
                            All content, design, and software on this site are the property of Apex Sports. You may not reproduce or redistribute any portion without express written permission.
                        </p>
                    </section>

                    <section className="bg-black p-6 rounded-xl border border-neutral-800 mt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            5. Contact Information
                        </h2>
                        <p className="text-gray-400">
                            For any legal inquiries or questions regarding these terms, please contact us at:
                        </p>
                        <p className="text-white font-bold mt-2">admin@apexsports.co.za</p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
