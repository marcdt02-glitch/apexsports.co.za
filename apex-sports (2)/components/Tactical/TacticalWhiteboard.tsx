import React, { useState, useRef, useEffect } from 'react';
import { Save, Eraser, Trash2, MousePointer, Pen, ArrowRight, Minus, UserPlus, UserMinus, FolderOpen, Type, Mic, Square } from 'lucide-react';

interface Token {
    id: number;
    x: number;
    y: number;
    type: 'attacker' | 'defender' | 'ball';
    label?: string;
}

interface DrawingElement {
    id: string;
    type: 'freehand' | 'line' | 'arrow' | 'text';
    points?: { x: number; y: number }[];
    x?: number;
    y?: number;
    text?: string;
    color: string;
    width?: number;
    fontSize?: number;
}

interface SavedPlay {
    id: string;
    name: string;
    tokens: Token[];
    elements: DrawingElement[];
    type: 'full' | 'half' | 'pc';
    date: string;
}

export const TacticalWhiteboard: React.FC = () => {
    const [view, setView] = useState<'full' | 'half' | 'pc'>('full');
    const [mode, setMode] = useState<'drag' | 'draw' | 'line' | 'arrow' | 'text'>('drag');
    const [tokens, setTokens] = useState<Token[]>([]);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

    // Canvas Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [selectedToken, setSelectedToken] = useState<number | null>(null);

    // Saved Plays
    const [savedPlays, setSavedPlays] = useState<SavedPlay[]>([]);

    // Screen Recording
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('apex_tactics');
            if (raw) {
                const loaded = JSON.parse(raw);
                // Safe migration/check
                const safeLoaded = loaded.map((p: any) => ({
                    ...p,
                    id: p.id || String(Date.now() + Math.random()), // Fallback ID
                    type: ['full', 'half', 'pc'].includes(p.type) ? p.type : 'full', // Fallback type
                    tokens: p.tokens || [],
                    elements: p.elements || []
                }));
                setSavedPlays(safeLoaded);
            }
        } catch (e) {
            console.error("Failed to load saved plays", e);
            setSavedPlays([]);
        }
        resetBoard();
    }, []);

    const resetBoard = (targetView: 'full' | 'half' | 'pc' | undefined = undefined) => {
        const viewToUse = targetView || view;
        const newTokens: Token[] = [];
        const now = Date.now();

        if (viewToUse === 'full') {
            // 11 vs 11
            // Attackers (Maroon)
            const att = [
                { x: 50, y: 92 }, // GK
                { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
                { x: 30, y: 55 }, { x: 50, y: 55 }, { x: 70, y: 55 },
                { x: 20, y: 35 }, { x: 50, y: 30 }, { x: 80, y: 35 },
            ];
            // Defenders (Navy)
            const def = [
                { x: 50, y: 8 }, // GK
                { x: 20, y: 25 }, { x: 40, y: 25 }, { x: 60, y: 25 }, { x: 80, y: 25 },
                { x: 30, y: 45 }, { x: 50, y: 45 }, { x: 70, y: 45 },
                { x: 20, y: 65 }, { x: 50, y: 70 }, { x: 80, y: 65 },
            ];

            att.forEach((p, i) => newTokens.push({ id: now + i, x: p.x, y: p.y, type: 'attacker', label: i === 0 ? 'GK' : `${i}` }));
            def.forEach((p, i) => newTokens.push({ id: now + i + 20, x: p.x, y: p.y, type: 'defender', label: i === 0 ? 'GK' : `${i}` }));
            newTokens.push({ id: 999, x: 50, y: 50, type: 'ball' });

        } else if (viewToUse === 'half') {
            // 7 vs 7 Half Field
            // Attackers (Top Down)
            const att = [
                { x: 50, y: 30 },
                { x: 30, y: 40 }, { x: 70, y: 40 },
                { x: 20, y: 55 }, { x: 50, y: 55 }, { x: 80, y: 55 },
                { x: 50, y: 70 }
            ];
            // Defenders (GK + 6) - GK at Bottom
            const def = [
                { x: 50, y: 92 }, // GK (Bottom)
                { x: 35, y: 80 }, { x: 65, y: 80 },
                { x: 25, y: 65 }, { x: 45, y: 65 }, { x: 55, y: 65 }, { x: 75, y: 65 }
            ];
            att.forEach((p, i) => newTokens.push({ id: now + i, x: p.x, y: p.y, type: 'attacker', label: `${i + 1}` }));
            def.forEach((p, i) => newTokens.push({ id: now + i + 20, x: p.x, y: p.y, type: 'defender', label: i === 0 ? 'GK' : `${i}` }));
            newTokens.push({ id: 999, x: 50, y: 50, type: 'ball' });

        } else {
            // PC Setup (Penalty Corner)
            // 7 Attackers (Top)
            const att = [
                { x: 30, y: 15 }, { x: 36, y: 15 }, { x: 42, y: 15 }, // Castle
                { x: 48, y: 8 }, // Injector (Very Top)
                { x: 54, y: 15 }, { x: 60, y: 15 }, { x: 66, y: 15 }
            ];

            // 5 Defenders (Bottom / Goal)
            const def = [
                { x: 50, y: 94 }, // GK (Goal Line)
                { x: 45, y: 92 }, { x: 55, y: 92 }, // Post men
                { x: 40, y: 90 }, // Runner 1
                { x: 60, y: 90 }  // Runner 2
            ];

            att.forEach((p, i) => newTokens.push({ id: now + i, x: p.x, y: p.y, type: 'attacker', label: i === 3 ? 'IN' : 'A' }));
            def.forEach((p, i) => newTokens.push({ id: now + i + 20, x: p.x, y: p.y, type: 'defender', label: i === 0 ? 'GK' : 'D' }));
            newTokens.push({ id: 999, x: 48, y: 10, type: 'ball' });
        }

        setTokens(newTokens);
        setElements([]);
        if (targetView) setView(targetView);
    };

    // --- DYNAMIC PLAYERS ---
    const addPlayer = (type: 'attacker' | 'defender') => {
        const id = Date.now();
        const x = 50 + (Math.random() * 10 - 5);
        const y = 50 + (Math.random() * 10 - 5);
        const existing = tokens.filter(t => t.type === type);
        const label = `${existing.length + 1}`;
        setTokens([...tokens, { id, x, y, type, label }]);
    };

    const deleteSelectedPlayer = () => {
        if (selectedToken) {
            setTokens(tokens.filter(t => t.id !== selectedToken));
            setSelectedToken(null);
        }
    };

    // --- DRAWING ---
    const getCanvasCoords = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent) => {
        if (selectedToken) setSelectedToken(null);
        if (mode === 'drag') return;
        const { x, y } = getCanvasCoords(e);
        const id = Date.now().toString();

        if (mode === 'draw') setCurrentElement({ id, type: 'freehand', points: [{ x, y }], color: '#ffffff', width: 3 });
        else if (mode === 'line') setCurrentElement({ id, type: 'line', points: [{ x, y }, { x, y }], color: '#ceb888', width: 3 }); // Gold
        else if (mode === 'arrow') setCurrentElement({ id, type: 'arrow', points: [{ x, y }, { x, y }], color: '#ceb888', width: 3 }); // Gold
    };

    const drawMove = (e: React.MouseEvent) => {
        if (!currentElement || mode === 'drag') return;
        const { x, y } = getCanvasCoords(e);

        if (mode === 'draw') {
            setCurrentElement(prev => prev ? { ...prev, points: [...(prev.points || []), { x, y }] } : null);
        } else if (mode === 'line' || mode === 'arrow') {
            setCurrentElement(prev => {
                if (!prev || !prev.points) return null;
                return { ...prev, points: [prev.points[0], { x, y }] };
            });
        }
    };

    const endDrawing = () => {
        if (currentElement) {
            setElements([...elements, currentElement]);
            setCurrentElement(null);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (mode === 'text') {
            const { x, y } = getCanvasCoords(e);
            const text = prompt("Enter text label:");
            if (text) {
                setElements([...elements, { id: Date.now().toString(), type: 'text', x, y, text, color: '#ffffff', fontSize: 16 }]);
            }
        }
    };

    // --- RENDER CANVAS ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const drawArrowhead = (from: { x: number, y: number }, to: { x: number, y: number }, color: string) => {
            const headLength = 15;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const angle = Math.atan2(dy, dx);
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(to.x, to.y);
            ctx.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));
            ctx.fill();
        };

        const renderEl = (el: DrawingElement) => {
            ctx.strokeStyle = el.color;
            ctx.lineWidth = el.width || 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.fillStyle = el.color;

            if (el.type === 'freehand' && el.points) {
                ctx.beginPath();
                if (el.points.length > 0) {
                    ctx.moveTo(el.points[0].x, el.points[0].y);
                    el.points.forEach(p => ctx.lineTo(p.x, p.y));
                }
                ctx.stroke();
            } else if (el.type === 'line' && el.points) {
                ctx.beginPath();
                ctx.moveTo(el.points[0].x, el.points[0].y);
                ctx.lineTo(el.points[1].x, el.points[1].y);
                ctx.stroke();
            } else if (el.type === 'arrow' && el.points) {
                ctx.beginPath();
                ctx.moveTo(el.points[0].x, el.points[0].y);
                ctx.lineTo(el.points[1].x, el.points[1].y);
                ctx.stroke();
                drawArrowhead(el.points[0], el.points[1], el.color);
            } else if (el.type === 'text' && el.text) {
                ctx.font = `bold ${el.fontSize || 16}px Arial`;
                ctx.fillText(el.text, el.x || 0, el.y || 0);
            }
        };
        elements.forEach(renderEl);
        if (currentElement) renderEl(currentElement);
    }, [elements, currentElement, view, containerRef.current?.clientWidth]);

    // --- DRAG ---
    const handleTokenDown = (e: React.MouseEvent, id: number) => {
        if (mode !== 'drag') return;
        e.stopPropagation();
        setIsDragging(id);
        setSelectedToken(id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mode === 'drag') {
            if (isDragging !== null && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
                const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
                setTokens(tokens.map(t => t.id === isDragging ? { ...t, x, y } : t));
            }
        } else {
            drawMove(e);
        }
    };

    const handleMouseUp = () => {
        if (mode !== 'drag') endDrawing();
        setIsDragging(null);
    };

    // --- SAVED PLAYS ---
    const saveCurrentPlay = () => {
        const name = prompt("Name this tactic:");
        if (!name) return;

        const newPlay: SavedPlay = {
            id: Date.now().toString(),
            name,
            tokens,
            elements,
            type: view,
            date: new Date().toLocaleDateString()
        };

        const updated = [...savedPlays, newPlay];
        setSavedPlays(updated);
        localStorage.setItem('apex_tactics', JSON.stringify(updated));
    };

    const loadPlay = (play: SavedPlay) => {
        if (confirm(`Load "${play.name}"? Unsaved changes will be lost.`)) {
            setView(play.type);
            setTimeout(() => {
                setTokens(play.tokens);
                setElements(play.elements);
            }, 50);
        }
    };

    const deletePlay = (id: string | undefined) => {
        if (!id) return;
        if (confirm("Delete this play?")) {
            const updated = savedPlays.filter(p => p.id !== id);
            setSavedPlays(updated);
            localStorage.setItem('apex_tactics', JSON.stringify(updated));
        }
    };

    const handleScreenRecord = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            return;
        }

        try {
            // 1. Capture Screen/Tab (Video)
            // @ts-ignore - getDisplayMedia exists
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { displaySurface: 'browser' },
                audio: false
            });
            const videoTrack = displayStream.getVideoTracks()[0];

            // 2. Capture User Mic (Audio)
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioTrack = micStream.getAudioTracks()[0];

            // 3. Combine
            const combinedStream = new MediaStream([videoTrack, audioTrack]);

            // 4. Start Recording
            const mime = MediaRecorder.isTypeSupported("video/mp4; codecs=h264") ? "video/mp4; codecs=h264" : "video/webm";
            const recorder = new MediaRecorder(combinedStream, { mimeType: mime });
            mediaRecorderRef.current = recorder;
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mime });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Tactical_Session_${Date.now()}.mp4`;
                a.click();

                // Stop tracks
                videoTrack.stop();
                audioTrack.stop();
                setIsRecording(false);
            };

            // Handle user clicking "Stop Sharing" on browser UI
            videoTrack.onended = () => {
                if (recorder.state !== 'inactive') recorder.stop();
            };

            recorder.start();
            setIsRecording(true);

        } catch (err) {
            console.error("Recording failed", err);
            setIsRecording(false);
            alert("Could not start recording. Please ensure permissions are granted.");
        }
    };

    // Helper to get image style based on view
    const getImageStyle = () => {
        return { objectFit: 'cover' as const, objectPosition: 'center', width: '100%', height: '100%' };
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col h-full bg-[#0a0a2a] rounded-3xl overflow-hidden border border-[#ceb888]/30 flex-1 shadow-2xl relative">

                {/* TOOLBAR */}
                <div className="bg-[#000000]/80 backdrop-blur-md p-4 flex flex-wrap items-center justify-between border-b border-[#ceb888]/20 gap-4">

                    {/* View Switcher */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                        {(['full', 'half', 'pc'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => resetBoard(v)}
                                className={`px-4 py-2 rounded-md text-sm font-black uppercase tracking-wider transition-all ${view === v
                                    ? 'bg-gradient-to-r from-[#800000] to-[#600000] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {v === 'pc' ? 'Penalty Corners' : v === 'half' ? 'Half Field' : 'Full Field'}
                            </button>
                        ))}
                    </div>

                    {/* Tools */}
                    <div className="flex items-center gap-4">
                        {/* Players */}
                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                            <button onClick={() => addPlayer('attacker')} className="p-2 text-gray-400 hover:text-[#800000] transition-colors" title="Add Attacker">
                                <UserPlus className="w-5 h-5" />
                            </button>
                            <button onClick={() => addPlayer('defender')} className="p-2 text-gray-400 hover:text-[#000050] transition-colors" title="Add Defender">
                                <UserPlus className="w-5 h-5 text-blue-400" />
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1"></div>
                            <button onClick={deleteSelectedPlayer} className={`p-2 transition-colors ${selectedToken ? 'text-red-500 hover:bg-red-900/20 rounded' : 'text-gray-600 cursor-not-allowed'}`} title="Delete Selected">
                                <UserMinus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Drawing */}
                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                            <button onClick={() => setMode('drag')} className={`p-2 rounded ${mode === 'drag' ? 'bg-[#ceb888] text-black' : 'text-gray-400 hover:text-white'}`} title="Move">
                                <MousePointer className="w-5 h-5" />
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1"></div>
                            <button onClick={() => setMode('draw')} className={`p-2 rounded ${mode === 'draw' ? 'bg-[#ceb888] text-black' : 'text-gray-400 hover:text-white'}`} title="Freehand">
                                <Pen className="w-5 h-5" />
                            </button>
                            <button onClick={() => setMode('line')} className={`p-2 rounded ${mode === 'line' ? 'bg-[#ceb888] text-black' : 'text-gray-400 hover:text-white'}`} title="Line">
                                <Minus className="w-5 h-5" />
                            </button>
                            <button onClick={() => setMode('arrow')} className={`p-2 rounded ${mode === 'arrow' ? 'bg-[#ceb888] text-black' : 'text-gray-400 hover:text-white'}`} title="Arrow">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button onClick={() => setMode('text')} className={`p-2 rounded ${mode === 'text' ? 'bg-[#ceb888] text-black' : 'text-gray-400 hover:text-white'}`} title="Text">
                                <Type className="w-5 h-5" />
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1"></div>
                            <button onClick={() => setElements([])} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Clear Ink">
                                <Eraser className="w-5 h-5" />
                            </button>
                            <button onClick={() => resetBoard(view)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Reset All">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleScreenRecord}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-neutral-800 text-gray-400 hover:text-white hover:bg-neutral-700'}`}
                            title="Record Screen + Mic"
                        >
                            {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                            {isRecording ? 'STOP REC' : 'REC'}
                        </button>

                        <button onClick={saveCurrentPlay} className="flex items-center gap-2 bg-[#ceb888] text-black font-black px-6 py-2 rounded-lg hover:bg-white transition-all shadow-lg hover:shadow-[#ceb888]/20">
                            <Save className="w-4 h-4" />
                            SAVE
                        </button>
                    </div>
                </div>

                {/* CANVAS AREA - Dynamic Aspect Ratio to fit V2 images */}
                <div
                    ref={containerRef}
                    className={`relative overflow-hidden cursor-crosshair select-none w-full shadow-2xl transition-all duration-300 ${view === 'full' ? 'bg-[#0a0a2a] aspect-square w-full' : 'bg-[#2c62c6] max-w-[800px] mx-auto aspect-[3/4] h-auto'
                        }`}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseDown={startDrawing}
                    onClick={handleCanvasClick}
                >
                    {/* Dynamic Field Background logic */}
                    {/* Dynamic Field Background logic */}
                    <img
                        src={view === 'pc' ? '/images/board-pc.png' : view === 'half' ? '/images/board-half.png' : '/images/board-full.png'}
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-100 transition-all duration-500"
                        style={getImageStyle()}
                        alt="Pitch"
                    />

                    {/* Drawing Layer */}
                    <canvas
                        ref={canvasRef}
                        width={containerRef.current?.clientWidth || 1200}
                        height={containerRef.current?.clientHeight || 800}
                        className="absolute inset-0 pointer-events-none z-10"
                    />

                    {/* Tokens */}
                    {tokens.map(token => (
                        <div
                            key={token.id}
                            onMouseDown={(e) => handleTokenDown(e, token.id)}
                            className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-2 shadow-2xl cursor-move z-20 hover:scale-110 active:scale-125 transition-all
                                ${token.type === 'attacker' ? 'bg-gradient-to-br from-[#800000] to-[#500000] text-white border-white/20' :
                                    token.type === 'defender' ? 'bg-gradient-to-br from-[#000050] to-[#000020] text-white border-white/20' :
                                        'bg-white text-black border-gray-300'}
                                ${selectedToken === token.id ? 'ring-4 ring-[#ceb888] scale-110' : ''}
                            `}
                            style={{ left: `${token.x}%`, top: `${token.y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            {token.type === 'ball' ? '' : token.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* SAVED PLAYS MANAGER */}
            <div className="bg-[#0a0a0a] border-t border-[#ceb888]/30 pt-8">
                <div className="flex items-center gap-3 mb-6 px-4">
                    <FolderOpen className="w-6 h-6 text-[#ceb888]" />
                    <h3 className="text-xl font-black text-white italic">TACTICAL VAULT</h3>
                    <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded-full">{savedPlays.length} PLAYS SAVED</span>
                </div>

                {savedPlays.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5 mx-4">
                        <Save className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">No saved plays yet.</p>
                        <p className="text-gray-600 text-sm">Design a strategy above and click SAVE.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-8">
                        {savedPlays.map((play) => (
                            <div key={play.id} className="bg-[#1a1a1a] border border-white/10 p-5 rounded-2xl flex flex-col justify-between group hover:border-[#ceb888] transition-all hover:bg-[#222]">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider
                                            ${play.type === 'full' ? 'bg-blue-900/40 text-blue-400' :
                                                play.type === 'half' ? 'bg-purple-900/40 text-purple-400' : 'bg-green-900/40 text-green-400'}`}>
                                            {play.type === 'pc' ? 'Penalty Corner' : play.type}
                                        </span>
                                        <span className="text-[10px] text-gray-600 font-mono">{play.date}</span>
                                    </div>
                                    <h4 className="font-bold text-white text-lg leading-tight mb-4 group-hover:text-[#ceb888] transition-colors">{play.name}</h4>
                                </div>

                                <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                                    <button
                                        onClick={() => loadPlay(play)}
                                        className="flex-1 py-2 bg-white/5 hover:bg-white hover:text-black rounded-lg text-gray-400 font-bold text-xs uppercase tracking-wider transition-all"
                                    >
                                        Load
                                    </button>
                                    <button
                                        onClick={() => deletePlay(play.id)}
                                        className="p-2 bg-white/5 hover:bg-red-900/50 hover:text-red-500 rounded-lg text-gray-400 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
