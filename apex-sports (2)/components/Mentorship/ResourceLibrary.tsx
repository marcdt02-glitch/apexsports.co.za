import React from 'react';
import { PlayCircle, FileText, Download, ExternalLink } from 'lucide-react';

const RESOURCES = {
    videos: [
        { id: 1, title: 'Wim Hof Breathing Method', category: 'Recovery', url: 'https://www.youtube.com/embed/tybOi4hjZFQ', duration: '11:00', attribution: 'Source: Wim Hof Method (YouTube)' },
        { id: 2, title: 'Pre-Game Visualization', category: 'Focus', url: 'https://www.youtube.com/embed/0U--Z1B9z8A', duration: '5:00', attribution: 'Source: YouTube' },
        { id: 3, title: 'Box Breathing for Anxiety', category: 'Composure', url: 'https://www.youtube.com/embed/FJJazKtH_9I', duration: '4:00', attribution: 'Source: YouTube' },
        { id: 4, title: 'Positive Self-Talk Guide', category: 'Confidence', url: 'https://www.youtube.com/embed/P_6vDLq64gE', duration: '8:00', attribution: 'Source: YouTube' },
    ],
    handbooks: [
        { id: 1, title: 'The Champion\'s Mindset', type: 'PDF', size: '2.4 MB' },
        { id: 2, title: 'Goal Setting Workbook 2026', type: 'PDF', size: '1.1 MB' },
        { id: 3, title: 'Performance Nutrition Guide', type: 'PDF', size: '4.5 MB' },
    ]
};

const ResourceLibrary: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-2">Psychology Resource Library</h2>
                <p className="text-gray-400 text-sm">Tools to sharpen your mental edge.</p>
            </div>

            {/* Video Gallery */}
            <div className="mb-16">
                <div className="flex items-center gap-2 mb-6 text-red-500 font-bold uppercase tracking-widest text-xs">
                    <PlayCircle className="w-4 h-4" />
                    Video Sessions
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {RESOURCES.videos.map((video) => (
                        <div key={video.id} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 group hover:border-white/20 transition-all">
                            <div className="aspect-video bg-black relative">
                                <iframe
                                    src={video.url}
                                    title={video.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-gray-500 bg-neutral-800 px-2 py-1 rounded">{video.category}</span>
                                    <span className="text-xs font-mono text-gray-600">{video.duration}</span>
                                </div>
                                <h3 className="text-white font-bold leading-tight group-hover:text-red-500 transition-colors mb-2">{video.title}</h3>
                                {video.attribution && (
                                    <p className="text-[10px] text-gray-500 italic border-t border-neutral-800 pt-2 mt-2">
                                        {video.attribution}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Handbooks */}
            <div>
                <div className="flex items-center gap-2 mb-6 text-blue-500 font-bold uppercase tracking-widest text-xs">
                    <FileText className="w-4 h-4" />
                    Digital Handbooks
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {RESOURCES.handbooks.map((book) => (
                        <div key={book.id} className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 flex items-center justify-between group hover:bg-neutral-800 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-neutral-800 p-3 rounded-lg group-hover:bg-black transition-colors">
                                    <FileText className="w-6 h-6 text-gray-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm mb-1">{book.title}</h3>
                                    <p className="text-xs text-gray-500">{book.type} • {book.size}</p>
                                </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourceLibrary;
