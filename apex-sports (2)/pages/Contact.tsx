import React from 'react';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Clock, Send } from 'lucide-react';
import { LINKS } from '../constants';

const Contact: React.FC = () => {
    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-wider">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Ready to elevate your game? Get in touch with us to discuss your training needs or book a session.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Contact Details Card */}
                    <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                            <Send className="w-6 h-6 text-white" />
                            Get In Touch
                        </h2>

                        <div className="space-y-8">
                            {/* WhatsApp / Phone */}
                            <a href="https://wa.me/27823788258" target="_blank" rel="noreferrer" className="flex items-start gap-4 group hover:bg-white/5 p-4 rounded-xl transition-all duration-300">
                                <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                                    <MessageCircle className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">WhatsApp & Phone</h3>
                                    <p className="text-gray-400 group-hover:text-white transition-colors">+27 82 378 8258</p>
                                    <span className="text-xs text-green-500 mt-1 inline-block">Best for quick queries</span>
                                </div>
                            </a>

                            {/* Email */}
                            <a href="mailto:marcdt02@gmail.com" className="flex items-start gap-4 group hover:bg-white/5 p-4 rounded-xl transition-all duration-300">
                                <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                    <Mail className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Email</h3>
                                    <p className="text-gray-400 group-hover:text-white transition-colors">marcdt02@gmail.com</p>
                                    <span className="text-xs text-blue-500 mt-1 inline-block">For detailed enquiries</span>
                                </div>
                            </a>

                            {/* Instagram */}
                            <a href="https://instagram.com/apex_sports_ZA" target="_blank" rel="noreferrer" className="flex items-start gap-4 group hover:bg-white/5 p-4 rounded-xl transition-all duration-300">
                                <div className="p-3 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                                    <Instagram className="w-6 h-6 text-pink-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Instagram</h3>
                                    <p className="text-gray-400 group-hover:text-white transition-colors">@apex_sports_ZA</p>
                                    <span className="text-xs text-pink-500 mt-1 inline-block">Follow our athletes</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Operational Info Card */}
                    <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-white" />
                                Service Areas
                            </h2>

                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-full shrink-0 mt-1">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Primary Hubs</h3>
                                        <p className="text-gray-400">Stellenbosch & Somerset West</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-full shrink-0 mt-1">
                                        <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Additional Areas</h3>
                                        <p className="text-gray-400">Cape Town & Paarl (by arrangement)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-full shrink-0 mt-1">
                                        <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Remote</h3>
                                        <p className="text-gray-400">Online coaching available globally</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Operating Hours
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Sessions are booked by appointment only.
                            </p>
                            <a
                                href={LINKS.CALENDAR}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                            >
                                Book a Session Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
