import React, { useState } from 'react';
import { PlayCircle, Zap, Eye, Target, Calendar, Info } from 'lucide-react';

// --- Data Structure ---
type Category = 'activation' | 'visualization' | 'goals' | 'habits';

interface Resource {
    id: number;
    title: string;
    description: string;
    url: string; // YouTube Embed URL
    duration: string;
}

const RESOURCES: Record<Category, { title: string; description: string; icon: any; color: string; items: Resource[] }> = {
    activation: {
        title: "Activation Control",
        description: "Master your arousal levels. Use breathing to calm down or 'hype up' techniques to get in the zone.",
        icon: Zap,
        color: "text-yellow-500",
        items: [
            { id: 1, title: 'Box Breathing (Calm)', description: '4-4-4-4 Technique for reducing anxiety.', url: 'https://www.youtube.com/embed/FJJazKtH_9I', duration: '4:00' },
            { id: 2, title: 'Wim Hof Method (Energy)', description: 'Hyper-oxygenation to spike alertness.', url: 'https://www.youtube.com/embed/tybOi4hjZFQ', duration: '11:00' },
            { id: 3, title: 'Mamba Mentality (Kobe)', description: 'The mindset of a champion.', url: 'https://www.youtube.com/embed/dTRBnHtHehQ', duration: '10:00' }
        ]
    },
    visualization: {
        title: "Visualization",
        description: "Mental imagery is your simulator. Rehearse success before you step on the pitch.",
        icon: Eye,
        color: "text-blue-500",
        items: [
            { id: 4, title: 'Michael Phelps Visualization', description: 'How the GOAT prepared for every scenario.', url: 'https://www.youtube.com/embed/3-mm90LFPqU', duration: '3:30' },
            { id: 5, title: 'Mental Strength (Djokovic)', description: 'Staying calm under extreme pressure.', url: 'https://www.youtube.com/embed/S-s7qF-qJ4', duration: '6:00' },
        ]
    },
    goals: {
        title: "Goal Setting",
        description: "Focus on the Process, not just the Outcome. Learn how to set goals that actually drive performance.",
        icon: Target,
        color: "text-red-500",
        items: [
            { id: 6, title: 'Process vs Outcome Goals', description: 'Understanding the control spectrum.', url: 'https://www.youtube.com/embed/VA8D1cGW5Qk', duration: '6:30' },
            { id: 7, title: 'Atomic Habits (1% Rule)', description: 'Marginal gains philosophy (James Clear).', url: 'https://www.youtube.com/embed/PZ7lDrwYdZc', duration: '8:00' },
        ]
    },
    habits: {
        title: "Habits & Routines",
        description: "Excellence is a habit. Optimize your Gameday and Daily routines.",
        icon: Calendar,
        color: "text-green-500",
        items: [
            { id: 8, title: 'CR7 Matchday Focus', description: 'Preparation secrets of Cristiano Ronaldo.', url: 'https://www.youtube.com/embed/tgq8I6-tJ4', duration: '5:00' },
            { id: 9, title: 'Win The Morning', description: 'Start the day with intent.', url: 'https://www.youtube.com/embed/sq02N0-m8bU', duration: '8:00' },
            { id: 10, title: 'LeBron James Sleep', description: 'Recovery is the #1 performance enhancer.', url: 'https://www.youtube.com/embed/aVoWkR24pj4', duration: '2:30' },
        ]
    }
};

const ResourceLibrary: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('activation');
    const categoryData = RESOURCES[activeCategory];

    return (
        <div className="max-w-6xl mx-auto min-h-[600px] flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 sticky top-4">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest px-4 mb-4">Categories</h3>
                    <div className="space-y-2">
                        {(Object.keys(RESOURCES) as Category[]).map((cat) => {
                            const data = RESOURCES[cat];
                            const Icon = data.icon;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${activeCategory === cat ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-neutral-800'}`}
                                >
                                    <Icon className={`w-4 h-4 ${activeCategory === cat ? 'text-black' : data.color}`} />
                                    {data.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-8 animate-fade-in">
                {/* Header Context */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8">
                    <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-2xl bg-black border border-neutral-800 ${categoryData.color}`}>
                            <categoryData.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">{categoryData.title}</h2>
                            <p className="text-gray-400 leading-relaxed max-w-2xl">{categoryData.description}</p>
                        </div>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {categoryData.items.map((item) => (
                        <div key={item.id} className="group bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden hover:border-neutral-600 transition-all">
                            {/* Video Embed */}
                            <div className="aspect-video bg-black relative">
                                <iframe
                                    src={item.url}
                                    title={item.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-white font-bold group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                    <span className="text-xs font-mono text-gray-500 bg-black px-2 py-1 rounded border border-neutral-800 flex items-center gap-1">
                                        <PlayCircle className="w-3 h-3" /> {item.duration}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourceLibrary;
