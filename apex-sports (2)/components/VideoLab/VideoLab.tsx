import React, { useState } from 'react';
import { UploadCloud, Video, FolderOpen, PlayCircle, Grid, Info, X, CheckCircle, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';
import { useGoogleDrivePicker, DriveFile } from './useGoogleDrivePicker';
import { VideoAnalysisPlayer } from './VideoAnalysisPlayer';

// Mock Pro Library
const PRO_BENCHMARKS = [
    { id: 'pro-1', name: 'Elite Sprint Start (0-10m)', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }, // Placeholder
    { id: 'pro-2', name: 'CMJ Landing Mechanics', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { id: 'pro-3', name: 'Perfect Deadlift Hinge', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    { id: 'pro-4', name: 'Agility Change of Direction', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' }
];

export const VideoLab: React.FC = () => {
    // STATE
    const [currentVideo, setCurrentVideo] = useState<DriveFile | null>(null);
    const [compareVideo, setCompareVideo] = useState<DriveFile | null>(null);
    const [showBioInfo, setShowBioInfo] = useState(false);
    const [showProSidebar, setShowProSidebar] = useState(false);
    const { openPicker } = useGoogleDrivePicker();

    // Placeholder Configuration - User must enter these
    const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE';
    const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';

    // Handlers
    const handleSelectVideo = (isCompare: boolean = false) => {
        openPicker(GOOGLE_API_KEY, GOOGLE_CLIENT_ID, (file) => {
            if (isCompare) setCompareVideo(file);
            else setCurrentVideo(file);
        });
    };

    const loadProBenchmark = (item: typeof PRO_BENCHMARKS[0]) => {
        const file: DriveFile = {
            id: item.id,
            name: item.name,
            embedUrl: item.url,
            mimeType: 'video/mp4',
            url: item.url
        };
        // Always load as comparison if a primary exists, or primary if empty
        if (currentVideo) setCompareVideo(file);
        else setCurrentVideo(file);

        setShowProSidebar(false);
    };

    const handleSaveAnalysis = (data: any) => {
        console.log("Analysis Saved:", data);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `APEX_Analysis_${new Date().toISOString()}.json`;
        a.click();
        alert("Analysis JSON downloaded successfully!");
    };

    const BiomechOverlay = () => (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBioInfo(false)}></div>
            <div className="relative z-10 w-full max-w-md bg-[#111] border-l border-neutral-800 h-full p-8 overflow-y-auto animate-fade-in-right shadow-2xl">
                <button onClick={() => setShowBioInfo(false)} className="absolute top-6 right-6 p-2 bg-neutral-800 rounded-full text-gray-400 hover:text-white hover:bg-neutral-700">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                        <Video className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Technical Analysis</h2>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">The Science of Movement</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-neutral-800 pb-2">Joint Stacking</h3>
                        <p className="text-gray-400 text-sm">
                            Efficiency requires alignment. In a squat or landing, we look for the "Stack" (Hips over Knees over Ankles). Deviation creates "Energy Leaks."
                        </p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-neutral-800 pb-2">Force Vectors</h3>
                        <p className="text-gray-400 text-sm">
                            The direction you push determines where you go. Use the Line Tool.
                            <br />- <strong>Vertical Line:</strong> Height (Jump)
                            <br />- <strong>Forward Angle:</strong> Acceleration (Sprint)
                        </p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-neutral-800 pb-2">Center of Mass (CoM)</h3>
                        <p className="text-gray-400 text-sm">
                            Your balance point. If your CoM shifts outside your base of support, you are unstable. Keep it tight to preserve power.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                        <Video className="w-8 h-8 text-blue-500" />
                        Video Lab
                    </h2>
                    <p className="text-gray-400">Biomechanics Analysis & Feedback Loop</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowProSidebar(!showProSidebar)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold transition-all ${showProSidebar ? 'bg-purple-900 border-purple-500 text-white' : 'bg-neutral-900 border-neutral-800 text-gray-400 hover:text-white'}`}
                    >
                        <UserCheck className="w-4 h-4" />
                        APEX Pro Benchmarks
                    </button>
                    <button
                        onClick={() => setShowBioInfo(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:border-text-white transition-all"
                    >
                        <Info className="w-4 h-4" />
                        Biomechanics Explained
                    </button>
                </div>
            </div>

            {showBioInfo && <BiomechOverlay />}

            {/* PRO LIBRARY SIDEBAR */}
            {showProSidebar && (
                <div className="absolute top-24 right-0 z-40 w-80 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-left">
                    <div className="p-4 bg-purple-900/20 border-b border-white/5">
                        <h3 className="text-white font-bold flex items-center gap-2"><Grid className="w-4 h-4 text-purple-400" /> Pro Library</h3>
                    </div>
                    <div className="p-2 space-y-1">
                        {PRO_BENCHMARKS.map(item => (
                            <div key={item.id} className="p-3 hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group">
                                <div className="text-sm text-gray-300 font-medium">{item.name}</div>
                                <button
                                    onClick={() => loadProBenchmark(item)}
                                    className="text-xs bg-purple-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Compare
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Interface */}
            {!currentVideo ? (
                // Empty State / Welcome Screen
                <div className="space-y-12">
                    {/* Hero */}
                    <div className="bg-neutral-900/30 border border-neutral-800 p-8 rounded-3xl text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Master Your Mechanics</h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            We don't just measure <em>how high</em> you jump; we analyze <em>how</em> you move.
                            <br /><span className="text-blue-400 font-bold">Efficiency = Performance + Longevity.</span>
                        </p>
                    </div>

                    {/* Protocol Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-black border border-neutral-800 p-6 rounded-2xl flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center mb-4 text-white font-bold">1</div>
                            <h3 className="text-white font-bold mb-2">90° Perspective</h3>
                            <p className="text-xs text-gray-500">Film directly from the side or front. Diagonal angles distort measurements.</p>
                        </div>
                        <div className="bg-black border border-neutral-800 p-6 rounded-2xl flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center mb-4 text-white font-bold">2</div>
                            <h3 className="text-white font-bold mb-2">Camera Stability</h3>
                            <p className="text-xs text-gray-500">Use a tripod. Shaky footage makes identifying joint angles impossible.</p>
                        </div>
                        <div className="bg-black border border-neutral-800 p-6 rounded-2xl flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center mb-4 text-white font-bold">3</div>
                            <h3 className="text-white font-bold mb-2">3-5m Distance</h3>
                            <p className="text-xs text-gray-500">Stand back so your entire body remains in frame during the full movement.</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-64">
                        {/* Upload / My Cloud */}
                        <button
                            onClick={() => handleSelectVideo(false)}
                            className="group relative bg-blue-900/10 border-2 border-dashed border-blue-900/30 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-900/20 transition-all text-center"
                        >
                            <div className="p-4 bg-blue-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Open from Cloud</h3>
                            <p className="text-xs text-gray-400">Google Drive Video Selection</p>
                        </button>

                        {/* Pro Library */}
                        <button
                            onClick={() => setShowProSidebar(!showProSidebar)}
                            className="group relative bg-neutral-900/30 border-2 border-dashed border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-purple-500 hover:bg-neutral-900/60 transition-all text-center"
                        >
                            <div className="p-4 bg-purple-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                <Grid className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">APEX Pro Library</h3>
                            <p className="text-xs text-gray-400">Compare with Elite Models</p>
                        </button>
                    </div>
                </div>
            ) : (
                // Analysis Mode
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl">
                                <span className="text-xs font-bold text-gray-500 uppercase">Primary</span>
                                <span className="text-sm font-bold text-white truncate max-w-[150px]">{currentVideo.name}</span>
                            </div>

                            {compareVideo && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl border border-blue-900/50">
                                    <span className="text-xs font-bold text-blue-500 uppercase">Compare</span>
                                    <span className="text-sm font-bold text-white truncate max-w-[150px]">{compareVideo.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleSelectVideo(true)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${compareVideo ? 'bg-neutral-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                            >
                                {compareVideo ? 'Change Compare Video' : '+ Add Comparison'}
                            </button>
                            <button
                                onClick={() => { setCurrentVideo(null); setCompareVideo(null); }}
                                className="px-4 py-2 rounded-xl text-sm font-bold bg-neutral-800 text-white hover:bg-neutral-700"
                            >
                                Close Lab
                            </button>
                        </div>
                    </div>

                    {/* Player */}
                    <VideoAnalysisPlayer
                        videoUrl={currentVideo.url || currentVideo.embedUrl}
                        compareUrl={compareVideo?.url || compareVideo?.embedUrl}
                        onSave={handleSaveAnalysis}
                    />
                </div>
            )}
        </div>
    );
};
