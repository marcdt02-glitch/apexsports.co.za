import React, { useState } from 'react';
import { Calendar, Book } from 'lucide-react';
import { CoachingScheduler } from './CoachingScheduler';
import { PlayerJournal } from './PlayerJournal';

export const PortalCoaching: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'journal'>('schedule');

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Coaching Hub</h2>
                    <p className="text-gray-400 mt-2">Manage your schedule and track your journey.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-neutral-800">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`group flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === 'schedule'
                            ? 'border-blue-600 text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                            }`}
                    >
                        <Calendar className={`w-5 h-5 ${activeTab === 'schedule' ? 'text-blue-500' : 'text-gray-500 group-hover:text-white'}`} />
                        <span className="font-bold uppercase tracking-widest text-sm">Schedule</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('journal')}
                        className={`group flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === 'journal'
                            ? 'border-blue-600 text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                            }`}
                    >
                        <Book className={`w-5 h-5 ${activeTab === 'journal' ? 'text-blue-500' : 'text-gray-500 group-hover:text-white'}`} />
                        <span className="font-bold uppercase tracking-widest text-sm">Player Journal</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'schedule' ? (
                    <div className="animate-fade-in">
                        <CoachingScheduler />
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <PlayerJournal />
                    </div>
                )}
            </div>
        </div>
    );
};
