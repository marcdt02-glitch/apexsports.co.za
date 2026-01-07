import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Play, Pause, Square, Circle, PenTool, Type, Save, Slash, MousePointer2, RotateCcw, FastForward, Rewind } from 'lucide-react';

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
        if (tool === 'none') return;
        const pt = getPoint(e);
        setCurrentDrawing({ type: tool, points: [pt], color });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!currentDrawing) return;
        const pt = getPoint(e);
        // Update the last point in real-time or add logic for different shapes
        // For simple line: point 0 is start, point 1 is current
        const newPoints = [...currentDrawing.points];
        if (tool === 'line') {
            if (newPoints.length === 1) newPoints.push(pt);
            else newPoints[1] = pt;
        } else if (tool === 'circle') {
            if (newPoints.length === 1) newPoints.push(pt);
            else newPoints[1] = pt; // 0 is center, 1 is radius edge
        } else if (tool === 'angle') {
            // Logic for angle: Click 1 (Vertex), Drag to 2 (Leg 1), Click to lock?
            // Simplified: Drag creates a line, then... maybe Angle needs 3 clicks.
            // Let's stick to Line/Circle for simplified MVP
            // Angle: Click 1, 2, 3.
            if (newPoints.length < 3) newPoints.push(pt);
            else newPoints[2] = pt; // update last point
        }
        setCurrentDrawing({ ...currentDrawing, points: newPoints });
        // Request animation frame for safer render loop could be better, but direct call is okay for MVP
        renderCanvas();
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!currentDrawing) return;
        setDrawings([...drawings, currentDrawing]);
        setCurrentDrawing(null);
    };

    // Canvas Rendering
    const renderCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                    // Draw Angle Arc
                    // Simplified visualization
                }
                ctx.stroke();

                // Show Angle Text
                if (d.points.length === 3) {
                    const angle = getAngle(d.points[0], d.points[1], d.points[2]);
                    if (!isNaN(angle)) {
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 16px sans-serif';
                        ctx.fillText(`${angle.toFixed(1)}°`, d.points[1].x + 10, d.points[1].y);
                    }
                }
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
        <div className="space-y-4">
            {/* Main Player Area */}
            <div className="relative bg-black rounded-3xl overflow-hidden border border-neutral-800 aspect-video group select-none">
                <div className={`w-full h-full flex ${compareUrl ? 'grid grid-cols-2' : ''}`}>
                    {/* Primary Video */}
                    <div className="relative w-full h-full border-r border-neutral-800">
                        {videoUrl ? (
                            <video
                                ref={videoRef1}
                                src={videoUrl}
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
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-30">
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
                            {[0.25, 0.5, 1.0].map(rate => (
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
                    {/* Angle Tool suppressed for MVP, complexity high */}

                    <div className="w-px h-8 bg-neutral-800 mx-2"></div>
                    <button onClick={() => setDrawings([])} className="p-3 rounded-xl text-red-500 hover:bg-red-900/20" title="Clear All">
                        <RotateCcw className="w-5 h-5" />
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

                    {onSave && (
                        <button onClick={() => onSave({ drawings, time: currentTime })} className="flex items-center gap-2 bg-white text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-200">
                            <Save className="w-4 h-4" />
                            Save Analysis
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
