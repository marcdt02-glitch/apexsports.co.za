```
import React, { useState, useRef } from 'react';
import {
    UploadCloud, Video, FolderOpen, PlayCircle, Grid, Info, X, CheckCircle,
    AlertTriangle, ArrowRight, UserCheck, Upload, Lock, Play, Pause, Download,
    Maximize2, Minimize2, ChevronLeft, ChevronRight, RefreshCw, AlertCircle
} from 'lucide-react';
import { useGoogleDrivePicker, DriveFile } from './useGoogleDrivePicker';
import { VideoAnalysisPlayer } from './VideoAnalysisPlayer';

// Creative / Playground Videos
const PLAYGROUND_VIDEOS = [
    { id: 'playground-1', name: 'Training Footage 1 (Creative)', url: '/videos/Training%20Footage%201.mov' },
    { id: 'playground-2', name: 'Training Footage 2 (Creative)', url: '/videos/Training%20Footage%202.mov' },
    { id: 'pro-1', name: 'Usain Bolt: Max Velocity Mechanics', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 'pro-2', name: 'Field Hockey GK: Split Save', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }
];

export const VideoLab: React.FC = () => {
    // STATE
    const [currentVideo, setCurrentVideo] = useState<DriveFile | null>(null);
    const [compareVideo, setCompareVideo] = useState<DriveFile | null>(null);
    const [showBioInfo, setShowBioInfo] = useState(false);
    const [showProSidebar, setShowProSidebar] = useState(false);
    const { openPicker, signIn, signOut, isAuthorized, oauthToken } = useGoogleDrivePicker();

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Placeholder Configuration - User must enter these
    const GOOGLE_API_KEY = 'AIzaSyCXjGxlxaxQ4NygJfNaDr-IfKrJTXoI13g';
    const GOOGLE_CLIENT_ID = '1065984102170-uq002j3qda0ui2op458vvjn4jp4k9gsr.apps.googleusercontent.com';

    // Handlers
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);

    const handleSelectVideo = async (isCompare: boolean = false) => {
        if (!isAuthorized) {
            signIn(GOOGLE_CLIENT_ID);
        } else {
            openPicker(GOOGLE_API_KEY, GOOGLE_CLIENT_ID, async (file) => {
                // If it's a Drive file, we need to fetch the content as a Blob using the OAuth token
                // purely because <video> tags cannot play Drive 'embedUrl' or 'webContentLink' due to CORS/Auth redirect issues.
                if (file.id && file.id !== 'local' && oauthToken) {
                    setIsLoadingVideo(true);
                    try {
                        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
headers: {
    'Authorization': `Bearer ${oauthToken}`
}
                        });

if (!response.ok) throw new Error('Failed to fetch video content');

const blob = await response.blob();
const blobUrl = URL.createObjectURL(blob);

// Override the URL with our playable Blob URL
const playableFile = { ...file, url: blobUrl, embedUrl: blobUrl };

if (isCompare) setCompareVideo(playableFile);
else setCurrentVideo(playableFile);

                    } catch (err) {
    console.error("Video Fetch Error:", err);
    alert("Failed to load video from Drive. Please try again.");
} finally {
    setIsLoadingVideo(false);
}
                } else {
    // Fallback for non-Drive files (unlikely path here)
    if (isCompare) setCompareVideo(file);
    else setCurrentVideo(file);
}
            });
        }
    };

const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const url = URL.createObjectURL(file);
        const videoFile: DriveFile = { id: 'local', name: file.name, url, mimeType: file.type, embedUrl: url };
        setCurrentVideo(videoFile);
    }
};


const loadPlaygroundVideo = (item: typeof PLAYGROUND_VIDEOS[0]) => {
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
                    APEX Playground
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
                    <h3 className="text-white font-bold flex items-center gap-2"><Grid className="w-4 h-4 text-purple-400" /> Playground / Creative</h3>
                </div>
                <div className="p-2 space-y-1">
                    {PLAYGROUND_VIDEOS.map(item => (
                        <div key={item.id} className="p-3 hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group">
                            <div className="text-sm text-gray-300 font-medium">{item.name}</div>
                            <button
                                onClick={() => loadPlaygroundVideo(item)}
                                className="text-xs bg-purple-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Load
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
                <input type="file" ref={fileInputRef} hidden accept="video/*" onChange={handleLocalUpload} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
                    {/* Upload / My Cloud */}
                    {/* Upload / My Cloud */}
                    <button
                        onClick={() => {
                            if (!isAuthorized) signIn(GOOGLE_CLIENT_ID);
                            else handleSelectVideo(false);
                        }}
                        className="group relative bg-neutral-900/30 border-2 border-dashed border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-neutral-900/60 transition-all text-center"
                    >
                        <div className="absolute top-2 right-2">
                            {isAuthorized && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Disconnect / Sign Out from Google Drive?')) signOut();
                                    }}
                                    className="p-2 bg-neutral-800 rounded-full hover:bg-red-900 border border-neutral-700 hover:border-red-500 text-gray-400 hover:text-white transition-all z-20 cursor-pointer shadow-lg"
                                    title="Disconnect Account"
                                >
                                    <X className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-blue-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">
                            Google Drive
                        </h3>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{!isAuthorized ? 'Sign In Required' : 'Browse Files'}</p>
                    </button>

                    {/* Local Upload */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative bg-neutral-900/30 border-2 border-dashed border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-white hover:bg-neutral-800 transition-all text-center"
                    >
                        <div className="p-4 bg-neutral-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Upload File</h3>
                        <p className="text-xs text-gray-400">From Device</p>
                    </button>
                </div>

                {/* Loading Overlay */}
                {isLoadingVideo && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl">
                        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <p className="text-white font-bold">Downloading Video...</p>
                        <p className="text-xs text-gray-400">Fetching high-quality stream from Drive</p>
                    </div>
                )}
            </div>
        ) : (
            // Analysis Mode
            <div className="space-y-2 md:space-y-6">
                {/* Toolbar */}
                {/* Toolbar */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl w-full md:w-auto">
                            <span className="text-xs font-bold text-gray-500 uppercase shrink-0">Primary</span>
                            <span className="text-sm font-bold text-white truncate">{currentVideo.name}</span>
                        </div>

                        {compareVideo && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl border border-blue-900/50 w-full md:w-auto">
                                <span className="text-xs font-bold text-blue-500 uppercase shrink-0">Compare</span>
                                <span className="text-sm font-bold text-white truncate">{compareVideo.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:flex gap-3">
                        <button
                            onClick={() => handleSelectVideo(true)}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${compareVideo ? 'bg-neutral-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                        >
                            {compareVideo ? 'Change' : '+ Compare'}
                        </button>
                        <button
                            onClick={() => { setCurrentVideo(null); setCompareVideo(null); }}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-neutral-800 text-white hover:bg-neutral-700 flex items-center justify-center"
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
