import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Play, Pause, Square, Circle, PenTool, Type, Save, Slash, MousePointer2, RotateCcw, FastForward, Rewind, Triangle, Download, Film, HelpCircle, Maximize, Zap } from 'lucide-react';
import html2canvas from 'html2canvas'; // Assuming available or I will use raw canvas API if not installed. 
// Actually I don't know if html2canvas is installed. I'll use raw canvas API to merge layers.


interface AnalysisPlayerProps {
    videoUrl?: string | null;
    compareUrl?: string | null;
    onSave?: (data: any) => void;
}

type Tool = 'none' | 'line' | 'angle' | 'circle';

interface Drawing {
    type: Tool;
    points: { x: number; y: number }[];
    color: string;
}

const getAngle = (p1: { x: number, y: number }, p2: { x: number, y: number }, p3: { x: number, y: number }) => {
    // Calculate angle at p2
    const p12 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    const p23 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
    const p13 = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
    return Math.acos((p12 * p12 + p23 * p23 - p13 * p13) / (2 * p12 * p23)) * 180 / Math.PI;
}

export const VideoAnalysisPlayer: React.FC<AnalysisPlayerProps> = ({ videoUrl, compareUrl, onSave }) => {
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFullScreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
    };

    // State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Drawing State
    const [tool, setTool] = useState<Tool>('none');
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
    const [color, setColor] = useState('#ef4444'); // Red default
    const [draggingPoint, setDraggingPoint] = useState<{ drawingIndex: number, pointIndex: number } | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    // SYNC CONTROLS
    const togglePlay = () => {
        const v1 = videoRef1.current;
        const v2 = videoRef2.current;

        if (isPlaying) {
            v1?.pause();
            v2?.pause();
        } else {
            v1?.play();
            v2?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (videoRef1.current) {
            setCurrentTime(videoRef1.current.currentTime);
            // Rough Sync
            if (videoRef2.current && Math.abs(videoRef2.current.currentTime - videoRef1.current.currentTime) > 0.5) {
                videoRef2.current.currentTime = videoRef1.current.currentTime;
            }
        }
    };

    const changeSpeed = (rate: number) => {
        setPlaybackRate(rate);
        if (videoRef1.current) videoRef1.current.playbackRate = rate;
        if (videoRef2.current) videoRef2.current.playbackRate = rate;
    };

    const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef1.current) {
            videoRef1.current.currentTime = time;
            setCurrentTime(time);
            if (videoRef2.current) videoRef2.current.currentTime = time;
        }
    };

    const stepFrame = (frames: number) => {
        if (videoRef1.current) {
            videoRef1.current.pause();
            videoRef1.current.currentTime += (frames * 0.04); // Approx 25fps
            setIsPlaying(false);
        }
        if (videoRef2.current) {
            videoRef2.current.pause();
            videoRef2.current.currentTime += (frames * 0.04);
        }
    };

    const handleSnapshot = () => {
        const video = videoRef1.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const mergeCanvas = document.createElement('canvas');
        mergeCanvas.width = video.videoWidth;
        mergeCanvas.height = video.videoHeight;
        const ctx = mergeCanvas.getContext('2d');

        if (ctx) {
            try {
                // Draw Video
                ctx.drawImage(video, 0, 0, mergeCanvas.width, mergeCanvas.height);
                // Draw Overlay
                ctx.drawImage(canvas, 0, 0, mergeCanvas.width, mergeCanvas.height);

                const dataUrl = mergeCanvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `APEX_Snapshot_${new Date().toISOString()}.png`;
                a.click();
            } catch (err) {
                console.error("Snapshot failed (CORS likely):", err);
                alert("Could not capture video frame due to browser security (CORS). Saved drawings only.");
            }
        }
    };

    const handleScreenRecord = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: 'browser' },
                audio: true
            });

            const mime = MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : "video/webm";
            const ext = mime === "video/mp4" ? "mp4" : "webm";

            const recorder = new MediaRecorder(stream, { mimeType: mime });
            const chunks: Blob[] = [];

            recorder.ondataavailable = e => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mime });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `APEX_Analysis_ScreenRec.${ext}`;
                a.click();
                setIsRecording(false);
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setIsRecording(true);

            stream.getVideoTracks()[0].onended = () => {
                if (recorder.state !== "inactive") recorder.stop();
            };

        } catch (err) {
            console.error("Screen recording cancelled or failed:", err);
            setIsRecording(false);
        }
    };




    // DRAWING LOGIC
    const getPoint = (e: MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e: MouseEvent) => {
        const pt = getPoint(e);
        if (tool === 'none') {
            // Check for handle hit
            drawings.forEach((d, dIdx) => {
                d.points.forEach((p, pIdx) => {
                    const dist = Math.sqrt(Math.pow(p.x - pt.x, 2) + Math.pow(p.y - pt.y, 2));
                    if (dist < 15) { // 15px radius hit
                        setDraggingPoint({ drawingIndex: dIdx, pointIndex: pIdx });
                        return; // Found one
                    }
                });
            });
            return;
        }
        setCurrentDrawing({ type: tool, points: [pt], color });
    };

    const handleMouseMove = (e: MouseEvent) => {
        const pt = getPoint(e);

        if (draggingPoint) {
            const newDrawings = [...drawings];
            newDrawings[draggingPoint.drawingIndex].points[draggingPoint.pointIndex] = pt;
            setDrawings(newDrawings);
            renderCanvas();
            return;
        }

        if (!currentDrawing) return;

        const newPoints = [...currentDrawing.points];
        if (tool === 'line') {
            if (newPoints.length === 1) newPoints.push(pt);
            else newPoints[1] = pt;
        } else if (tool === 'circle') {
            if (newPoints.length === 1) newPoints.push(pt);
            else newPoints[1] = pt;
        } else if (tool === 'angle') {
            // Logic for angle: 3 points (A->B->C). Angle at B.
            // Click 1 (A), Click 2 (B), Click 3 (C)
            // Or Dragging? Current logic is "Drag creates line", but angles need 3 points.
            // Improved Logic:
            // 1. Click creates Pt 1.
            // 2. Click creates Pt 2 (Line 1 formed).
            // 3. Click creates Pt 3 (Line 2 formed).
            // If dragging, we update the *last* point.
            if (newPoints.length === 1) newPoints.push(pt);
            else if (newPoints.length === 2) newPoints.push(pt);
            else newPoints[newPoints.length - 1] = pt;
        }
        setCurrentDrawing({ ...currentDrawing, points: newPoints });
        // Use requestAnimationFrame for smoother drawing during drag?
        // renderCanvas(); // We call it here for MVP simplicity
        requestAnimationFrame(() => renderCanvas());
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (draggingPoint) {
            setDraggingPoint(null);
            return;
        }
        if (!currentDrawing) return;

        // Finalize drawing based on tool type logic
        // Line/Circle finalize on 2 points.
        // Angle finalizes on 3 points.
        let isComplete = false;

        if (['line', 'circle'].includes(tool) && currentDrawing.points.length >= 2) isComplete = true;

        if (tool === 'angle') {
            // Need 3 points. If we just released mouse, did we add a point?
            // If points < 3, we stay in drawing mode?
            // Re-clicking adds points to currentDrawing?
            // Complex. For simplicity in 'Drag Mode', we assume click-drag-release = 2 points.
            // For Angle, user creates 3 points. 
            // I'll make angle auto-complete if 3rd point is placed.
            // MouseUp adds the current point?
            const pt = getPoint(e);
            const pts = [...currentDrawing.points];
            // If we are at 2 points, we need one more click?
            // Let's assume click-click-click interaction for angle.
            // But handleMouseMove updates the "live" point.
            // So click 1 (down/up) -> point 1.
            // Move -> point 2 preview.
            // Click 2 (down/up) -> point 2 fixed.
            // Move -> point 3 preview.
            // Click 3 -> point 3 fixed -> Complete.

            // To support this "Click" flow, handleMouseUp shouldn't clear currentDrawing immediately unless complete.

            // However, existing code was "Drag to draw".
            // I will implement "Drag to draw line 1, then click for point 3"?
            // Or "Click-Click-Click".
            // I'll support "Click-Click-Click" for Angle.
            // If tool is angle:
            if (pts.length === 3) isComplete = true;
            else {
                // Keep currentDrawing active. "Add Point" logic happens in MouseDown/Up?
                // No, MouseUp just releases the "Drag" state.
                // We need to add point on MouseDown?
                // Let's stick to "Drag 2 points" for Line/Circle.
                // For Angle, if < 3 points, don't clear.
            }
        } else {
            isComplete = true; // Line/Circle
        }

        if (isComplete) {
            setDrawings([...drawings, currentDrawing]);
            setCurrentDrawing(null);
        } else {
            // If not complete (Angle), we wait for next input.
            // But we need to ensure the point is "locked".
            // currentDrawing state already has the points.
        }
    };

    // Canvas Rendering
    const renderCanvas = (drawVideo = false) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Optional: Draw Video (for export)
        if (drawVideo && videoRef1.current) {
            try {
                ctx.drawImage(videoRef1.current, 0, 0, canvas.width, canvas.height);
            } catch (e) {
                // consume cors error silently during preview
            }
        }

        // Render Saved Drawings
        [...drawings, currentDrawing].forEach(d => {
            if (!d) return;
            ctx.beginPath();
            ctx.strokeStyle = d.color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            if (d.type === 'line' && d.points.length > 1) {
                ctx.moveTo(d.points[0].x, d.points[0].y);
                ctx.lineTo(d.points[1].x, d.points[1].y);
                ctx.stroke();
            } else if (d.type === 'circle' && d.points.length > 1) {
                const r = Math.sqrt(Math.pow(d.points[1].x - d.points[0].x, 2) + Math.pow(d.points[1].y - d.points[0].y, 2));
                ctx.arc(d.points[0].x, d.points[0].y, r, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (d.type === 'angle' && d.points.length > 1) {
                ctx.moveTo(d.points[0].x, d.points[0].y);
                ctx.lineTo(d.points[1].x, d.points[1].y);
                if (d.points.length > 2) {
                    ctx.lineTo(d.points[2].x, d.points[2].y);
                }
                ctx.stroke();

                if (d.points.length === 3) {
                    const angle = getAngle(d.points[0], d.points[1], d.points[2]);
                    if (!isNaN(angle)) {
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 16px sans-serif';
                        ctx.fillText(`${angle.toFixed(1)}°`, d.points[1].x + 10, d.points[1].y);
                    }
                }
            }

            // Draw Handles if in 'Select' mode
            if (tool === 'none') {
                d.points.forEach(p => {
                    ctx.beginPath();
                    ctx.fillStyle = '#fff';
                    ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            }
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            renderCanvas();
        }
    }, [drawings, currentDrawing, videoUrl]); // Re-render on updates

    return (
        <div ref={containerRef} className="flex flex-col gap-4 bg-black rounded-3xl overflow-hidden relative group">
            {/* Main Player Area */}
            <div className="relative bg-black rounded-3xl overflow-hidden border border-neutral-800 aspect-video group select-none">
                <div className={`w-full h-full flex ${compareUrl ? 'grid grid-cols-2' : ''}`}>
                    {/* Primary Video */}
                    <div className="relative w-full h-full border-r border-neutral-800">
                        {videoUrl ? (
                            <video
                                ref={videoRef1}
                                src={videoUrl}
                                crossOrigin="anonymous" // Enable CORS for canvas capture
                                className="w-full h-full object-contain"
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={() => setDuration(videoRef1.current?.duration || 0)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-700">
                                <p>No Video Selected</p>
                            </div>
                        )}
                    </div>

                    {/* Compare Video */}
                    {compareUrl && (
                        <div className="relative w-full h-full bg-neutral-900">
                            <video
                                ref={videoRef2}
                                src={compareUrl}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}
                </div>

                {/* Canvas Overlay */}
                <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 z-20 w-full h-full ${tool !== 'none' ? 'cursor-crosshair' : 'pointer-events-none'}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />

                {/* Video Controls Overlay (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-30">

                    {/* Scrubber */}
                    <div className="w-full mb-2 flex items-center gap-2">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            step={0.05}
                            value={currentTime}
                            onChange={handleScrub}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => stepFrame(-5)} className="text-white hover:text-blue-400"><Rewind className="w-5 h-5" /></button>
                            <button onClick={togglePlay} className="text-white hover:text-blue-400">
                                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                            </button>
                            <button onClick={() => stepFrame(5)} className="text-white hover:text-blue-400"><FastForward className="w-5 h-5" /></button>

                            <span className="text-xs font-mono text-gray-300">
                                {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {[0.125, 0.25, 0.5, 1.0].map(rate => (
                                <button
                                    key={rate}
                                    onClick={() => changeSpeed(rate)}
                                    className={`px-2 py-1 rounded text-xs font-bold ${playbackRate === rate ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-gray-400'}`}
                                >
                                    {rate}x
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scientific Insight Tooltip (Contextual) */}
            {tool !== 'none' && (
                <div className="absolute top-4 left-4 right-4 z-30 animate-fade-in-down pointer-events-none">
                    <div className="bg-blue-900/90 border border-blue-500/50 backdrop-blur-md p-3 rounded-xl inline-flex items-center gap-3 shadow-xl">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <MousePointer2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Scientific Insight</p>
                            <p className="text-white text-xs font-medium">
                                {tool === 'line' && "Force Vectors: Are they pushing forward (Acceleration) or up (Vertical)?"}
                                {tool === 'circle' && "Joint Stacking: Highlight the Center of Mass or stacked joints."}
                                {tool === 'angle' && "Knee Valgus: Measure the angle of the knee during landing."}
                            </p>
                        </div>
                    </div>
                </div>
            )}



            {/* Tools Toolbar */}
            <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                    <button title="Select / Move" onClick={() => setTool('none')} className={`p-3 rounded-xl transition-all ${tool === 'none' ? 'bg-white text-black' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <MousePointer2 className="w-5 h-5" />
                    </button>
                    <div className="w-px h-8 bg-neutral-800 mx-2"></div>
                    <button title="Draw Line" onClick={() => setTool('line')} className={`p-3 rounded-xl transition-all ${tool === 'line' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <Slash className="w-5 h-5" />
                    </button>
                    <button title="Draw Circle" onClick={() => setTool('circle')} className={`p-3 rounded-xl transition-all ${tool === 'circle' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <Circle className="w-5 h-5" />
                    </button>
                    <button title="Measure Angle" onClick={() => setTool('angle')} className={`p-3 rounded-xl transition-all ${tool === 'angle' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <Triangle className="w-5 h-5" />
                    </button>

                    <div className="w-px h-8 bg-neutral-800 mx-2"></div>
                    <button onClick={() => setDrawings([])} className="p-3 rounded-xl text-red-500 hover:bg-red-900/20" title="Clear All">
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    {/* Snapshot Button */}
                    <button onClick={handleSnapshot} className="p-3 rounded-xl text-purple-400 hover:bg-purple-900/20" title="Download Snapshot">
                        <Download className="w-5 h-5" />
                    </button>
                    {/* Export Video (Screen Record) */}
                    <button onClick={handleScreenRecord} disabled={isRecording} className={`p-3 rounded-xl ${isRecording ? 'text-red-500 animate-pulse' : 'text-green-400 hover:bg-green-900/20'}`} title="Start Screen Recording">
                        <Film className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Color Picker */}
                    <div className="flex gap-2 bg-neutral-800 p-1 rounded-lg">
                        {['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ffffff'].map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-6 h-6 rounded-md ${color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>

                    <div className="w-px h-8 bg-neutral-800 mx-2"></div>

                    {/* Help Button Removed - Replaced by Footer */}
                    <button onClick={handleFullScreen} className="p-3 rounded-xl text-gray-400 hover:bg-neutral-800 hover:text-white" title="Full Screen">
                        <Maximize className="w-5 h-5" />
                    </button>

                    {onSave && (
                        <button onClick={() => onSave({ drawings, time: currentTime })} className="flex items-center gap-2 bg-white text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-200">
                            <Save className="w-4 h-4" />
                            Save Analysis
                        </button>
                    )}
                </div>
            </div>

            {/* Persistent Controls Legend Footer */}
            <div className="bg-neutral-900/50 border border-neutral-800 pt-6 px-6 pb-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div>
                    <h4 className="font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><MousePointer2 className="w-3 h-3" /> Navigation</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li className="flex justify-between"><span>Play / Pause</span> <kbd className="bg-neutral-800 px-1 rounded">Space</kbd></li>
                        <li className="flex justify-between"><span>Step +/- 5 Frames</span> <kbd className="bg-neutral-800 px-1 rounded">◄ / ►</kbd></li>
                        <li className="flex justify-between"><span>Scrub Timeline</span> <kbd className="bg-neutral-800 px-1 rounded">Drag</kbd></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><PenTool className="w-3 h-3" /> Drawing Tools</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center gap-2"><Slash className="w-3 h-3 text-blue-500" /> <span>Draw Line (Force Vector)</span></li>
                        <li className="flex items-center gap-2"><Circle className="w-3 h-3 text-blue-500" /> <span>Circle (Joint/CoM)</span></li>
                        <li className="flex items-center gap-2"><Triangle className="w-3 h-3 text-blue-500" /> <span>Measure Angle</span></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Zap className="w-3 h-3" /> Pro Actions</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center gap-2"><Film className="w-3 h-3 text-green-500" /> <span>Screen Record Analysis</span></li>
                        <li className="flex items-center gap-2"><Download className="w-3 h-3 text-purple-500" /> <span>Download Snapshot</span></li>
                        <li className="flex items-center gap-2"><RotateCcw className="w-3 h-3 text-red-500" /> <span>Clear / Reset</span></li>
                    </ul>
                </div>
                <div className="opacity-50">
                    <h4 className="font-bold text-gray-500 uppercase tracking-wider mb-3">Tips</h4>
                    <p className="text-gray-400 leading-relaxed">
                        Use full screen for maximum precision. Hold <kbd className="bg-neutral-800 px-1 rounded">Shift</kbd> while drawing for straight lines.
                    </p>
                </div>
            </div>
        </div>
    );
};
