import React from 'react';
import { Shield, Lock, FileText, Mail, MapPin } from 'lucide-react';

const ApexPrivacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-wide uppercase">Privacy Policy</h1>
                <p className="text-gray-400 mb-12">Effective Date: December 2025</p>

                <div className="space-y-8 bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">

                    <p className="text-gray-300 leading-relaxed border-b border-gray-800 pb-8">
                        At Apex Sports South Africa, we respect your privacy and are committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA).
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-white" />
                            1. Information We Collect
                        </h2>
                        <p className="text-gray-400 mb-2">We collect information that you provide directly to us when booking a mobile sports service, including:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Name and contact information (Email and Phone Number).</li>
                            <li>Physical address (for service delivery within Somerset West and Stellenbosch).</li>
                            <li>Payment information (processed securely via Paystack; we do not store your credit card details).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-white" />
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-400 mb-2">We use your information solely to:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Schedule and deliver our mobile sports services.</li>
                            <li>Communicate booking confirmations and weather-related updates.</li>
                            <li>Process payments via our secure provider.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-white" />
                            3. Information Sharing
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            We do not sell, rent, or lease your personal information to third parties. Your data is only shared with essential service providers (like Paystack for payments) to complete your transaction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            4. Data Security
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            We take reasonable technical and organizational measures to secure the integrity of your personal information and use secure connections to prevent data loss or unauthorized access.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            5. Your Rights
                        </h2>
                        <p className="text-gray-400 mb-2">Under POPIA, you have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>Request access to the personal information we hold about you.</li>
                            <li>Request the correction or deletion of your personal information.</li>
                            <li>Object to the processing of your data for marketing purposes.</li>
                        </ul>
                    </section>

                    <section className="bg-black p-6 rounded-xl border border-neutral-800 mt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            6. Contact Us
                        </h2>
                        <p className="text-gray-400 mb-4">
                            If you have any questions about this Privacy Policy or our data practices, please contact our Information Officer at:
                        </p>
                        <div className="space-y-3">
                            <a href="mailto:marcdt02@gmail.com" className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
                                <Mail className="w-5 h-5" />
                                marcdt02@gmail.com
                            </a>
                            <div className="flex items-center gap-3 text-white">
                                <MapPin className="w-5 h-5" />
                                Stellenbosch, South Africa
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default ApexPrivacy;
