import React, { useState } from 'react';
import { Brain, Target, Compass, BookOpen, Calendar, Activity } from 'lucide-react';
import SpatQuestionnaire from '../../Mentorship/SpatQuestionnaire';
import RoutineEditor from '../../Mentorship/RoutineEditor';
import ResourceLibrary from '../../Mentorship/ResourceLibrary';
import GoalSetting from '../../GoalSetting';

interface PortalMentorshipProps {
    athleteName: string;
    tier: string;
}

const PortalMentorship: React.FC<PortalMentorshipProps> = ({ athleteName, tier }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'assessment' | 'routines' | 'library'>('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Compass },
        { id: 'goals', label: 'Goal Setting', icon: Target },
        { id: 'assessment', label: 'SPAT', icon: Activity },
        { id: 'routines', label: 'Routines', icon: Calendar },
        { id: 'library', label: 'Resources', icon: BookOpen },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Mentorship Portal</h2>
                    <p className="text-gray-400 mt-2">What's Next</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-neutral-800">
                <div className="flex gap-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`group flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === tab.id
                                ? 'border-red-600 text-white'
                                : 'border-transparent text-gray-500 hover:text-white'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-red-500' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="font-bold uppercase tracking-widest text-sm whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl">
                                <h3 className="text-xl font-bold text-white mb-4">Welcome to Your Mental Gym</h3>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    Just as you train your body in the gym, you must train your mind for competition.
                                    This portal provides you with the tools to assess your psychological skills,
                                    build elite habits, and access our library of mental performance resources.
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="bg-neutral-800 p-3 rounded-lg">
                                        <Target className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Goal Setting</h4>
                                        <p className="text-xs text-gray-500">Locke & Latham Framework</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                                <Activity className="w-12 h-12 text-blue-500 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">SPAT Assessment</h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    Take the "Sport Psychology Assessment Tool" to identify your mental strengths and weaknesses.
                                </p>
                                <button
                                    onClick={() => setActiveTab('assessment')}
                                    className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    Start Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'goals' && (
                    <div className="animate-fade-in">
                        <GoalSetting athleteName={athleteName} tier={tier} />
                    </div>
                )}

                {/* TAB: SPAT (LOCKED) */}
                {activeTab === 'assessment' && (
                    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-neutral-900/40 border border-neutral-800 rounded-3xl relative overflow-hidden">
                        {/* Background Effect */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                        <div className="bg-neutral-800 p-8 rounded-full mb-8 relative z-10 shadow-2xl border border-neutral-700">
                            {/* Assuming lock icon available or just use Shield/Target if not */}
                            <Activity className="w-16 h-16 text-gray-600" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">System Offline</h3>
                        <p className="text-gray-400 max-w-lg text-lg leading-relaxed relative z-10 mb-8">
                            The Sport Psychology Assessment Tool (SPAT) is currently undergoing seasonal calibration.
                            <br /><br />
                            This module will be unlocked shortly to provide your updated mental performance baseline.
                        </p>
                        <div className="px-6 py-2 bg-neutral-800 rounded-full border border-neutral-700 text-xs font-mono text-blue-400 uppercase tracking-widest relative z-10 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Calibration in Progress
                        </div>
                    </div>
                )}

                {/* TAB: ROUTINES */}
                {activeTab === 'routines' && (
                    <div className="animate-fade-in">
                        <RoutineEditor athleteName={athleteName} tier={tier} />
                    </div>
                )}

                {/* TAB: LIBRARY */}
                {activeTab === 'library' && (
                    <div className="animate-fade-in">
                        <ResourceLibrary />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortalMentorship;
