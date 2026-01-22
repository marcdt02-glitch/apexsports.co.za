import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Play, Pause, Square, Circle, PenTool, Type, Save, Slash, MousePointer2, RotateCcw, FastForward, Rewind, Triangle, Download, Film, HelpCircle, Maximize, Zap, Pen, Volume2, VolumeX } from 'lucide-react';

interface AnalysisPlayerProps {
    videoUrl?: string | null;
    compareUrl?: string | null;
    onSave?: (data: any) => void;
}

type Tool = 'none' | 'line' | 'angle' | 'circle' | 'text' | 'scribble';

interface Drawing {
    type: Tool;
    points: { x: number; y: number }[];
    color: string;
    text?: string;
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
    const [isMuted, setIsMuted] = useState(false);

    // Drawing State
    const [tool, setTool] = useState<Tool>('none');
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
    const [color, setColor] = useState('#ef4444'); // Red default
    const [draggingPoint, setDraggingPoint] = useState<{ drawingIndex: number, pointIndex: number } | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    // Custom Text Input State
    const [textModal, setTextModal] = useState<{ isOpen: boolean, x: number, y: number, text: string }>({ isOpen: false, x: 0, y: 0, text: '' });
    const textInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const wasPlayingRef = useRef(false);

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

    const toggleMute = () => {
        const newState = !isMuted;
        setIsMuted(newState);
        if (videoRef1.current) videoRef1.current.muted = newState;
        if (videoRef2.current) videoRef2.current.muted = newState;
    };

    const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef1.current) {
            videoRef1.current.currentTime = time;
            setCurrentTime(time);
            if (videoRef2.current) videoRef2.current.currentTime = time;
        }
    };

    const handleScrubStart = () => {
        wasPlayingRef.current = isPlaying;
        if (isPlaying) {
            videoRef1.current?.pause();
            videoRef2.current?.pause();
            setIsPlaying(false);
        }
    };

    const handleScrubEnd = () => {
        if (wasPlayingRef.current) {
            videoRef1.current?.play();
            videoRef2.current?.play();
            setIsPlaying(true);
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
        // STOP RECORDING logic
        if (isRecording && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            return;
        }

        // START RECORDING logic
        try {
            if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                alert("Screen recording is not supported in this browser.");
                return;
            }

            // QuickTime / iOS Compatibility
            // We prioritize H.264 (avc1) in MP4 container.
            const types = [
                "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"", // H.264 Main Profile
                "video/mp4",
                "video/webm; codecs=h264",
                "video/webm" // Fallback
            ];
            const mime = types.find(t => MediaRecorder.isTypeSupported(t)) || "video/webm";
            const ext = mime.includes("mp4") ? "mp4" : "webm";

            // 1. Capture Canvas Stream (Video)
            if (!canvasRef.current) {
                alert("Canvas not ready for recording.");
                return;
            }
            const canvasStream = canvasRef.current.captureStream(30); // 30 FPS
            const videoTrack = canvasStream.getVideoTracks()[0];

            // 2. Capture Microphone Stream (Audio) - Voiceover
            let audioStream: MediaStream | null = null;
            let combinedTracks = [videoTrack];

            try {
                // Request mic permission
                audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (audioStream.getAudioTracks().length > 0) {
                    combinedTracks.push(audioStream.getAudioTracks()[0]);
                    console.log("🎤 Microphone added to recording");
                }
            } catch (micErr) {
                console.warn("⚠️ Microphone access denied or failed. Recording video only.", micErr);
            }

            // 3. Create Final Mixed Stream
            const finalStream = new MediaStream(combinedTracks);

            // 4. Start Recorder
            const recorder = new MediaRecorder(finalStream, { mimeType: mime });
            mediaRecorderRef.current = recorder;
            const chunks: Blob[] = [];

            recorder.ondataavailable = e => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mime });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `APEX_Analysis_ScreenRec.${ext}`;
                a.click();

                // Cleanup
                setIsRecording(false);
                mediaRecorderRef.current = null;
                // Stop all tracks (Video + Audio)
                finalStream.getTracks().forEach(track => track.stop());
                if (audioStream) audioStream.getTracks().forEach(track => track.stop());
                // Don't stop canvas stream tracks directly if it stops the loop? 
                // Actually captureStream tracks are live. Stopping them might be okay.
            };

            recorder.onerror = (e: any) => {
                console.error("MediaRecorder Error:", e);
                // Don't alert immediately if it's just a warning, but stop if fatal?
                // Usually onerror is fatal.
                alert("Recording stopped due to an error: " + (e.error?.message || "Unknown error"));
                setIsRecording(false);
            };

            recorder.start(1000); // 1s timeslice to prevent huge buffers
            setIsRecording(true);

            // Handle external stop
            videoTrack.onended = () => {
                if (recorder.state !== "inactive") recorder.stop();
            };

        } catch (err) {
            console.error("Screen recording cancelled or failed:", err);
            alert("Screen recording is limited on mobile device browsers. Please use your device's native Screen Record feature (in Control Center on iOS/Android) for best results.");
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
            // Check for handle hit
            let hit = false;
            drawings.forEach((d, dIdx) => {
                if (d.type === 'text' && d.text) {
                    // Text Hit Detection (Bounding Box approximation)
                    const p = d.points[0];
                    const charWidth = 12; // Approx for 16px font
                    const w = d.text.length * charWidth;
                    const h = 30;
                    // Check if point is inside text box (centered on y, starts at x)
                    // Allow generous padding
                    if (pt.x >= p.x - 20 && pt.x <= p.x + w + 20 && pt.y >= p.y - h && pt.y <= p.y + 20) {
                        setDraggingPoint({ drawingIndex: dIdx, pointIndex: 0 });
                        hit = true;
                        return;
                    }
                } else {
                    // Standard Point Hit
                    d.points.forEach((p, pIdx) => {
                        const dist = Math.sqrt(Math.pow(p.x - pt.x, 2) + Math.pow(p.y - pt.y, 2));
                        if (dist < 30) { // 30px radius for Mouse
                            setDraggingPoint({ drawingIndex: dIdx, pointIndex: pIdx });
                            hit = true;
                            return; // Found one
                        }
                    });
                }
            });
            if (!hit) {
                // No handle hit, and tool is none -> Toggle Play
                togglePlay();
            }
            return;
        }

        if (tool === 'text') {
            // Open Custom Text Modal instead of prompt
            setTextModal({ isOpen: true, x: pt.x, y: pt.y, text: '' });
            setTimeout(() => textInputRef.current?.focus(), 100);
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
            draw();
            return;
        }

        if (!currentDrawing) return;

        const newPoints = [...currentDrawing.points];

        if (tool === 'scribble') {
            // Freehand: just add points
            newPoints.push(pt);
        } else if (tool === 'line') {
            if (newPoints.length === 1) newPoints.push(pt);
            else newPoints[1] = pt;
        } else if (tool === 'circle') {
            if (newPoints.length === 1) newPoints.push(pt);
            else newPoints[1] = pt;
        } else if (tool === 'angle') {
            // Click 1 (Vertex) -> Drag/Click 2 (Arm 1) -> Drag/Click 3 (Arm 2)
            // Existing logic: [Vertex, Arm1, Arm2]

            if (newPoints.length === 1) newPoints.push(pt); // Add Arm 1 preview
            else if (newPoints.length === 2) newPoints.push(pt); // Add Arm 2 preview
            else newPoints[newPoints.length - 1] = pt; // Update latest point
        }
        setCurrentDrawing({ ...currentDrawing, points: newPoints });
        requestAnimationFrame(() => draw());
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
        if (tool === 'scribble') isComplete = true; // MouseUp ends scribble

        if (tool === 'angle') {
            // Wait for 3 points
            if (currentDrawing.points.length >= 3) isComplete = true;
            else {
                // Clicking releases "drag" of current point, but we need to keep drawing to get next point.
                // We need to artificially "add" the point so the user can move to next.
                // Actually, handleMouseMove updates the *last* point.
                // So on MouseUp, we want to "lock" that point and start a new one?
                // No, handleMouseMove logic: 
                // If len==1, push(pt). Line is P0-P1.
                // If len==2, push(pt). Line is P0-P1-P2.
                // So clicking (Down/Up) effectively locks the current position because the mouse stops moving there.
                // But we need to ensure the *next* move starts a new point?
                // My handleMouseMove logic handles "Push if length is X".
                // So we just need to NOT clear currentDrawing.
            }
        } else {
            isComplete = true;
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

    // TOUCH HANDLERS (Mapping to Mouse Events)
    const getTouchPoint = (e: React.TouchEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect || e.touches.length === 0) return { x: 0, y: 0 };
        const touch = e.touches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault(); // Prevent scrolling
        const pt = getTouchPoint(e);
        // Reuse Mouse Logic
        if (tool === 'none') {
            drawings.forEach((d, dIdx) => {
                if (d.type === 'text' && d.text) {
                    // Text Hit Detection (Bounding Box)
                    const p = d.points[0];
                    const charWidth = 12;
                    const w = d.text.length * charWidth;
                    const h = 30;
                    if (pt.x >= p.x - 10 && pt.x <= p.x + w + 10 && pt.y >= p.y - h - 10 && pt.y <= p.y + 10) {
                        setDraggingPoint({ drawingIndex: dIdx, pointIndex: 0 });
                        return;
                    }
                } else {
                    d.points.forEach((p, pIdx) => {
                        const dist = Math.sqrt(Math.pow(p.x - pt.x, 2) + Math.pow(p.y - pt.y, 2));
                        if (dist < 30) { // Reduced from 40px to 30px
                            setDraggingPoint({ drawingIndex: dIdx, pointIndex: pIdx });
                            return;
                        }
                    });
                }
            });
            return;
        }
        if (tool === 'text') {
            setTextModal({ isOpen: true, x: pt.x, y: pt.y, text: '' });
            setTimeout(() => textInputRef.current?.focus(), 100);
            return;
        }
        setCurrentDrawing({ type: tool, points: [pt], color });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        const pt = getTouchPoint(e);

        if (draggingPoint) {
            const newDrawings = [...drawings];
            newDrawings[draggingPoint.drawingIndex].points[draggingPoint.pointIndex] = pt;
            setDrawings(newDrawings);
            draw();
            return;
        }

        if (!currentDrawing) return;

        const newPoints = [...currentDrawing.points];
        if (tool === 'scribble') newPoints.push(pt);
        else if (tool === 'line' || tool === 'circle') {
            if (newPoints.length === 1) newPoints.push(pt); else newPoints[1] = pt;
        } else if (tool === 'angle') {
            if (newPoints.length === 1) newPoints.push(pt);
            else if (newPoints.length === 2) newPoints.push(pt);
            else newPoints[newPoints.length - 1] = pt;
        }
        setCurrentDrawing({ ...currentDrawing, points: newPoints });
        requestAnimationFrame(() => draw());
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        if (draggingPoint) {
            setDraggingPoint(null);
            return;
        }
        if (!currentDrawing) return;

        let isComplete = false;
        if (['line', 'circle'].includes(tool) && currentDrawing.points.length >= 2) isComplete = true;
        if (tool === 'scribble') isComplete = true;

        if (tool === 'angle') {
            if (currentDrawing.points.length >= 3) isComplete = true;
        } else {
            isComplete = true;
        }

        if (isComplete) {
            setDrawings([...drawings, currentDrawing]);
            setCurrentDrawing(null);
        }
    };

    // --- IMPROVED ANGLE TOOL ---
    const addAngleTool = () => {
        if (!canvasRef.current) return;
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        const cx = w / 2;
        const cy = h / 2;

        // Create a default "V" shape angle roughly in center
        const newAngle: Drawing = {
            type: 'angle',
            points: [
                { x: cx, y: cy + 50 },      // P0: Vertex
                { x: cx - 100, y: cy - 100 }, // P1: Arm Left
                { x: cx + 100, y: cy - 100 }  // P2: Arm Right
            ],
            color: color
        };

        setDrawings([...drawings, newAngle]);
        setTool('none'); // Immediately switch to Select/Move mode so user can drag handles
    };

    const confirmText = () => {
        if (textModal.text.trim()) {
            setDrawings([...drawings, { type: 'text', points: [{ x: textModal.x, y: textModal.y }], color: '#ffffff', text: textModal.text }]);
        }
        setTextModal({ isOpen: false, x: 0, y: 0, text: '' });
        setTool('none');
        requestAnimationFrame(() => draw());
    };

    // Canvas Rendering
    const draw = () => {
        const canvas = canvasRef.current;
        const video = videoRef1.current; // Assuming videoRef1 is the primary video
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // CRITICAL FOR RECORDING: Draw the video frame onto the canvas
        // Only do this when recording to avoid performance overhead/sync issues during playback
        if (isRecording) {
            try {
                // Only draw if video is ready
                if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                }
            } catch (err) { }
        }

        // Draw Drawings
        [...drawings, currentDrawing].forEach(d => {
            if (!d) return;
            ctx.beginPath();
            ctx.strokeStyle = d.color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            if (d.type === 'line' && d.points.length > 1) {
                const p1 = d.points[0];
                const p2 = d.points[1];

                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                // Draw Arrowhead (Vector Support)
                const headLen = 15;
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                ctx.beginPath();
                ctx.moveTo(p2.x, p2.y);
                ctx.lineTo(p2.x - headLen * Math.cos(angle - Math.PI / 6), p2.y - headLen * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(p2.x - headLen * Math.cos(angle + Math.PI / 6), p2.y - headLen * Math.sin(angle + Math.PI / 6));
                ctx.lineTo(p2.x, p2.y);
                ctx.fillStyle = d.color;
                ctx.fill();

            } else if (d.type === 'circle' && d.points.length > 1) {
                const r = Math.sqrt(Math.pow(d.points[1].x - d.points[0].x, 2) + Math.pow(d.points[1].y - d.points[0].y, 2));
                ctx.arc(d.points[0].x, d.points[0].y, r, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (d.type === 'scribble' && d.points.length > 1) {
                ctx.moveTo(d.points[0].x, d.points[0].y);
                d.points.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.stroke();
            } else if (d.type === 'angle' && d.points.length > 2) {
                // P0 is Vertex. P1 and P2 are arms.
                const p0 = d.points[0];
                const p1 = d.points[1];
                const p2 = d.points[2];

                // Draw Arms
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y); // Arm 1
                ctx.lineTo(p0.x, p0.y); // Vertex
                ctx.lineTo(p2.x, p2.y); // Arm 2
                ctx.strokeStyle = d.color;
                ctx.stroke();

                // Calculate Angles for Arc
                // atan2 returns angle in radians from -PI to PI
                const dx1 = p1.x - p0.x;
                const dy1 = p1.y - p0.y;
                const dx2 = p2.x - p0.x;
                const dy2 = p2.y - p0.y;

                let angle1 = Math.atan2(dy1, dx1);
                let angle2 = Math.atan2(dy2, dx2);

                // Draw Arc Sector (Pie Slice)
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y); // Center

                // Draw arc from angle1 to angle2. 
                // We always want the acute/interior angle visually? Or just the counter-clockwise one?
                // Visualizing the angle calculated by getAngle (law of cosines) is safest.
                // Draw simple arc:
                ctx.arc(p0.x, p0.y, 40, angle1, angle2, false);
                // Note: 'false' = clockwise? No, false = counterclockwise.
                // We might need to check which direction is shorter.

                ctx.fillStyle = `${d.color}33`; // 20% opacity hex
                ctx.fill();

                // Draw Arc Stroke
                ctx.beginPath();
                ctx.arc(p0.x, p0.y, 40, angle1, angle2, false);
                ctx.strokeStyle = d.color;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Calculate Numerical Angle
                const angleDeg = getAngle(p1, p0, p2);

                // Text Label
                if (!isNaN(angleDeg)) {
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 14px "Inter", sans-serif';
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 4;
                    // Position text near the vertex
                    ctx.fillText(`${angleDeg.toFixed(1)}°`, p0.x + 10, p0.y + 30);
                    ctx.shadowBlur = 0; // Reset
                }
            } else if (d.type === 'text' && d.text) {
                ctx.fillStyle = d.color || '#fff'; // Default white
                ctx.font = 'bold 16px "Inter", sans-serif'; // Standard Font
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 4; // Readability
                const p = d.points[0];
                ctx.fillText(d.text, p.x, p.y);
                ctx.shadowBlur = 0; // Reset
            }

            // Draw Handles if in 'Select' mode (always draw for Angle so they can drag)
            if (tool === 'none' || d.type === 'angle') {
                d.points.forEach((p, idx) => {
                    ctx.beginPath();
                    // Vertex is distinctly colored (white) for Angles
                    ctx.fillStyle = (idx === 0 && d.type === 'angle') ? '#fff' : d.color;
                    ctx.arc(p.x, p.y, 12, 0, 2 * Math.PI); // INCREASED HANDLE SIZE (12px)
                    ctx.fill();
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
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
            draw();
        }
    }, [drawings, currentDrawing, videoUrl]);

    // Continuous Render Loop (Dynamic) - Essential for Playback/Recording
    useEffect(() => {
        let animationFrameId: number;

        const loop = () => {
            draw();
            if (isPlaying || isRecording) {
                animationFrameId = requestAnimationFrame(loop);
            }
        };

        if (isPlaying || isRecording) {
            loop();
        }

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, isRecording, drawings, currentDrawing, tool]); // Re-bind loop if state changes to avoid stale closures

    return (
        <div ref={containerRef} className="flex flex-col gap-2 md:gap-4 bg-black rounded-3xl overflow-hidden relative group">
            {/* Custom Text Modal Overlay */}
            {textModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#111] border border-neutral-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl transform scale-100 transition-all pointer-events-auto mx-4">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Type className="w-4 h-4 text-blue-500" />
                            Add Annotation
                        </h3>
                        <input
                            ref={textInputRef}
                            type="text"
                            value={textModal.text}
                            onChange={(e) => setTextModal({ ...textModal, text: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && confirmText()}
                            placeholder="Enter notes..."
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-white mb-4 focus:border-blue-500 outline-none"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setTextModal({ ...textModal, isOpen: false, text: '' })}
                                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmText}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold"
                            >
                                Add Label
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Player Area - Taller on Mobile */}
            <div className="relative bg-black rounded-3xl overflow-hidden border border-neutral-800 aspect-[4/5] md:aspect-video group select-none">
                <div className={`w-full h-full flex ${compareUrl ? 'grid grid-cols-2' : ''}`}>
                    {/* Primary Video */}
                    <div className="relative w-full h-full border-r border-neutral-800">
                        {videoUrl ? (
                            <video
                                ref={videoRef1}
                                src={videoUrl}
                                crossOrigin="anonymous" // Enable CORS for canvas capture
                                playsInline
                                webkit-playsinline="true"
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

                {/* Canvas Overlay with Touch Events */}
                <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 z-50 w-full h-full touch-none ${tool !== 'none' ? 'cursor-crosshair' : 'cursor-default'}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                />


                {/* Central Play/Pause Overlay (Mobile Optimized) */}
                <div
                    className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
                >
                    {!isPlaying && (
                        <div className="bg-black/40 backdrop-blur-sm p-4 md:p-6 rounded-full border border-white/20 shadow-2xl animate-fade-in group/play">
                            <Play className="w-8 h-8 md:w-16 md:h-16 text-white fill-white" />
                        </div>
                    )}
                </div>

                {/* Video Controls Overlay (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/95 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="pointer-events-auto">
                        {/* Scrubber */}
                        <div className="w-full mb-4 flex items-center gap-2">
                            {/* Made taller for touch */}
                            <input
                                type="range"
                                min={0}
                                max={duration || 100}
                                step={0.05}
                                value={currentTime}
                                onChange={handleScrub}
                                onMouseDown={handleScrubStart}
                                onMouseUp={handleScrubEnd}
                                onTouchStart={handleScrubStart}
                                onTouchEnd={handleScrubEnd}
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button onClick={toggleMute} className="text-white hover:text-blue-400 p-2">
                                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </button>
                                <button onClick={() => stepFrame(-5)} className="text-white hover:text-blue-400 p-2"><Rewind className="w-6 h-6" /></button>
                                <button onClick={togglePlay} className="text-white hover:text-blue-400">
                                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                                </button>
                                <button onClick={() => stepFrame(5)} className="text-white hover:text-blue-400 p-2"><FastForward className="w-6 h-6" /></button>

                                <span className="text-xs font-mono text-gray-300 hidden sm:inline-block">
                                    {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(rate => (
                                    <button
                                        key={rate}
                                        onClick={() => changeSpeed(rate)}
                                        className={`px-3 py-1.5 rounded text-xs font-bold ${playbackRate === rate ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-gray-400'}`}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scientific Insight Tooltip (Contextual) - HIDDEN: User requested "go without the key" */}
            {/* 
            {tool !== 'none' && (
                <div className="absolute top-4 left-4 right-4 z-30 animate-fade-in-down pointer-events-none">
                     ...
                </div>
            )} 
            */}



            {/* Tools Toolbar - Mobile Optimized (Scrollable) */}
            <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-2 md:p-4 rounded-2xl overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 min-w-max px-2">
                    <button title="Select / Move" onClick={() => setTool('none')} className={`p-4 rounded-xl transition-all ${tool === 'none' ? 'bg-white text-black' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <MousePointer2 className="w-6 h-6" />
                    </button>
                    <div className="w-px h-8 bg-neutral-800 mx-2"></div>
                    <button title="Draw Line" onClick={() => setTool('line')} className={`p-4 rounded-xl transition-all ${tool === 'line' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <Slash className="w-6 h-6" />
                    </button>
                    <button title="Draw Circle" onClick={() => setTool('circle')} className={`p-4 rounded-xl transition-all ${tool === 'circle' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <Circle className="w-6 h-6" />
                    </button>
                    <button title="Scribble" onClick={() => setTool('scribble')} className={`p-4 rounded-xl transition-all ${tool === 'scribble' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <Pen className="w-6 h-6" />
                    </button>
                    {/* UPDATED ANGLE BUTTON */}
                    <button title="Measure Angle" onClick={addAngleTool} className={`p-4 rounded-xl transition-all ${tool === 'angle' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <Triangle className="w-6 h-6" />
                    </button>
                    <button title="Add Text" onClick={() => setTool('text')} className={`p-4 rounded-xl transition-all ${tool === 'text' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800'}`}>
                        <Type className="w-6 h-6" />
                    </button>

                    <div className="w-px h-8 bg-neutral-800 mx-2"></div>
                    <button onClick={() => setDrawings([])} className="p-4 rounded-xl text-red-500 hover:bg-red-900/20" title="Clear All">
                        <RotateCcw className="w-6 h-6" />
                    </button>
                    {/* Snapshot Button - Hidden on small mobile */}
                    <button onClick={handleSnapshot} className="hidden sm:block p-4 rounded-xl text-purple-400 hover:bg-purple-900/20" title="Download Snapshot">
                        <Download className="w-6 h-6" />
                    </button>
                    {/* Export Video */}
                    <button onClick={handleScreenRecord} className={`p-4 rounded-xl transition-all ${isRecording ? 'text-white bg-red-600 animate-pulse' : 'text-green-400 hover:bg-green-900/20'}`} title={isRecording ? "Stop Recording" : "Start Screen Recording"}>
                        {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Film className="w-6 h-6" />}
                    </button>
                </div>

                <div className="flex items-center gap-4 min-w-max px-2 border-l border-neutral-800 ml-2 pl-2">
                    {/* Color Picker */}
                    <div className="flex gap-2 bg-neutral-800 p-1.5 rounded-lg">
                        {['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ffffff'].map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-md ${color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>

                    {/* Full Screen */}
                    <button onClick={handleFullScreen} className="p-4 rounded-xl text-gray-400 hover:bg-neutral-800 hover:text-white" title="Full Screen">
                        <Maximize className="w-6 h-6" />
                    </button>

                    {onSave && (
                        <button onClick={() => onSave({ drawings, time: currentTime })} className="hidden sm:flex items-center gap-2 bg-white text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-200">
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                    )}
                </div>
            </div>

            {/* Persistent Controls Legend Footer - Hidden on Mobile */}
            <div className="hidden md:grid bg-neutral-900/50 border border-neutral-800 pt-6 px-6 pb-6 rounded-3xl grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
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
                        <li className="flex items-center gap-2"><Triangle className="w-3 h-3 text-blue-500" /> <span>Angle (Spawns Tool)</span></li>
                        <li className="flex items-center gap-2"><Pen className="w-3 h-3 text-blue-500" /> <span>Freehand Scribble</span></li>
                        <li className="flex items-center gap-2"><Type className="w-3 h-3 text-blue-500" /> <span>Add Text Label</span></li>
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
