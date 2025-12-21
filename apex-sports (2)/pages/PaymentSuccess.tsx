import React from 'react';
import { CheckCircle, Calendar, MessageCircle, Mail } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
    return (
        <div className="min-h-screen bg-black pt-24 pb-12 flex items-center justify-center px-4">
            <div className="max-w-xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
                    <p className="text-gray-300 mb-8">
                        Thank you for joining Apex Sports. Your transaction has been completed.
                        <br />
                        <strong>Please proceed to book your sessions below.</strong>
                    </p>

                    <div className="space-y-4">
                        <div className="bg-black/50 p-4 rounded-xl border border-neutral-800">
                            <h3 className="text-white font-bold mb-2">Book Your First Session</h3>
                            <p className="text-sm text-gray-400 mb-4">Select a time that works for you.</p>

                            {/* Replace these hrefs with your ACTUAL Calendly/Booking links */}
                            <a href="https://calendly.com" target="_blank" rel="noreferrer" className="block w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors mb-3">
                                <Calendar className="w-4 h-4 inline-block mr-2" />
                                Open Booking Calendar
                            </a>

                            <a href="https://wa.me/27823788258" target="_blank" rel="noreferrer" className="block w-full bg-neutral-800 text-white font-bold py-3 rounded-lg hover:bg-neutral-700 transition-colors">
                                <MessageCircle className="w-4 h-4 inline-block mr-2" />
                                Contact via WhatsApp
                            </a>
                        </div>

                        <p className="text-xs text-gray-500 mt-6">
                            A receipt has been sent to your email. If you have any issues, please contact us at <a href="mailto:admin@apexsports.co.za" className="text-white hover:underline">admin@apexsports.co.za</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
