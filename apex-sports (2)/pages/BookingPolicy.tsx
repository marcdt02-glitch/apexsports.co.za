import React from 'react';
import { FileText, Clock, MapPin, AlertCircle } from 'lucide-react';

const BookingPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-wide uppercase">Booking & Service Policy</h1>

                <div className="space-y-8">

                    {/* Mobile Service */}
                    <section className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
                        <div className="flex items-center gap-4 mb-4">
                            <MapPin className="w-8 h-8 text-white" />
                            <h2 className="text-2xl font-bold text-white">Mobile Service Area</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            Apex Sports operates as a mobile service primarily in <strong>Somerset West and Stellenbosch</strong> (on-site) but also provides remote services globally. We come to you—whether that's your school, club, or home gym.
                        </p>
                        <p className="text-gray-300 mt-2">
                            Our primary service areas include:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                            <li>Southern Suburbs</li>
                            <li>Atlantic Seaboard</li>
                            <li>Northern Suburbs</li>
                        </ul>
                        <p className="text-gray-500 text-sm mt-4 italic">
                            *Travel fees may apply for locations outside of our standard radius. Please confirm during booking.
                        </p>
                    </section>

                    {/* Cancellation Policy */}
                    <section className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
                        <div className="flex items-center gap-4 mb-4">
                            <Clock className="w-8 h-8 text-white" />
                            <h2 className="text-2xl font-bold text-white">Cancellation Policy</h2>
                        </div>
                        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-4">
                            <p className="text-red-200 font-semibold">
                                Strict 24-Hour Notice Required
                            </p>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            We understand that life happens. However, to respect the time of our coaches and other clients, we require at least <strong>24 hours' notice</strong> for any cancellations or rescheduling.
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                            <li><strong className="text-white">Less than 24 hours notice:</strong> 100% of the session fee will be charged.</li>
                            <li><strong className="text-white">No-shows:</strong> 100% of the session fee will be charged.</li>
                        </ul>
                    </section>

                    {/* Pricing & Payments */}
                    <section className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
                        <div className="flex items-center gap-4 mb-4">
                            <FileText className="w-8 h-8 text-white" />
                            <h2 className="text-2xl font-bold text-white">Pricing & Payments</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            All prices listed on this website are in <strong>South African Rand (ZAR)</strong>.
                        </p>
                        <p className="text-gray-300">
                            Payment is due upon booking or as per the invoice terms agreed upon for packages. We accept EFT.
                        </p>
                    </section>

                    {/* Disclaimer */}
                    <section className="flex gap-4 p-4 border border-gray-800 rounded-lg bg-black/50">
                        <AlertCircle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                        <p className="text-gray-500 text-sm">
                            Disclaimer: Apex Sports provides strength and conditioning and mentorship services. While we strive to prevent injury and improve performance, physical activity carries inherent risks. Clients participate at their own risk.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default BookingPolicy;
