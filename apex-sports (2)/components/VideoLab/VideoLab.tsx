import React, { useState } from 'react';
import { UploadCloud, Video, FolderOpen, PlayCircle, Grid, Info, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useGoogleDrivePicker, DriveFile } from './useGoogleDrivePicker';
import { VideoAnalysisPlayer } from './VideoAnalysisPlayer';

export const VideoLab: React.FC = () => {
    // STATE
    const [currentVideo, setCurrentVideo] = useState<DriveFile | null>(null);
    const [compareVideo, setCompareVideo] = useState<DriveFile | null>(null);
    const [showBioInfo, setShowBioInfo] = useState(false);
    const { openPicker } = useGoogleDrivePicker();

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

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                        <Video className="w-8 h-8 text-blue-500" />
                        Video Lab
                    </h2>
                    <p className="text-gray-400">Biomechanics Analysis & Feedback Loop</p>
                </div>
            </div>

            {/* Main Interface */}
            {!currentVideo ? (
                // Empty State / Selection Screen
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[60vh]">
                    {/* Upload / My Cloud */}
                    <button
                        onClick={() => handleSelectVideo(false)}
                        className="group relative bg-neutral-900/50 border-2 border-dashed border-neutral-800 rounded-3xl p-12 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-neutral-900/80 transition-all text-center"
                    >
                        <div className="p-6 bg-blue-900/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Open from Cloud</h3>
                        <p className="text-gray-400">Select video from Google Drive</p>
                    </button>

                    {/* Pro Library */}
                    <button
                        // Feature Logic: Would load from fixed 'Pro Library' folder ID if implemented
                        onClick={() => alert('APEX Pro Library access requires configured Folder ID.')}
                        className="group relative bg-neutral-900/50 border-2 border-dashed border-neutral-800 rounded-3xl p-12 flex flex-col items-center justify-center hover:border-purple-500 hover:bg-neutral-900/80 transition-all text-center"
                    >
                        <div className="p-6 bg-purple-900/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                            <Grid className="w-12 h-12 text-purple-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">APEX Pro Library</h3>
                        <p className="text-gray-400">Browse "Perfect Form" examples</p>
                    </button>
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
