import React, { useState, useRef, useEffect } from 'react';
import { Save, Eraser, Trash2, Undo, Redo, MousePointer, Pen, Circle, Square } from 'lucide-react';

interface Token {
    id: number;
    x: number;
    y: number;
    type: 'attacker' | 'defender' | 'ball';
    label?: string;
}

interface DrawingLine {
    points: { x: number; y: number }[];
    color: string;
    width: number;
}

interface SavedPlay {
    name: string;
    tokens: Token[];
    lines: DrawingLine[];
    type: 'full' | 'quarter';
}

export const TacticalWhiteboard: React.FC = () => {
    const [view, setView] = useState<'full' | 'quarter'>('full');
    const [mode, setMode] = useState<'drag' | 'draw'>('drag');
    const [tokens, setTokens] = useState<Token[]>([]);
    const [lines, setLines] = useState<DrawingLine[]>([]);
    const [currentLine, setCurrentLine] = useState<DrawingLine | null>(null);

    // Canvas Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);

    // Load Initial Tokens
    useEffect(() => {
        resetBoard();
    }, [view]);

    const resetBoard = () => {
        const newTokens: Token[] = [];
        // Default Setup
        if (view === 'full') {
            // 11 vs 11 Setup for fun? Or just a few
            for (let i = 0; i < 5; i++) newTokens.push({ id: Date.now() + i, x: 20 + (i * 10), y: 30, type: 'attacker', label: `${i + 1}` });
            for (let i = 0; i < 5; i++) newTokens.push({ id: Date.now() + i + 10, x: 20 + (i * 10), y: 60, type: 'defender', label: `${i + 1}` });
            newTokens.push({ id: 999, x: 50, y: 50, type: 'ball' });
        } else {
            // PC Setup
            newTokens.push({ id: 1, x: 48, y: 15, type: 'attacker', label: 'IN' }); // Injector
            newTokens.push({ id: 2, x: 45, y: 90, type: 'attacker', label: 'S' }); // Stopper
            newTokens.push({ id: 3, x: 50, y: 90, type: 'attacker', label: 'H' }); // Hitter
            newTokens.push({ id: 4, x: 48, y: 12, type: 'defender', label: 'GK' }); // GK
            newTokens.push({ id: 5, x: 40, y: 12, type: 'defender' });
            newTokens.push({ id: 6, x: 56, y: 12, type: 'defender' });
            newTokens.push({ id: 999, x: 48, y: 14, type: 'ball' });
        }
        setTokens(newTokens);
        setLines([]);
    };

    // --- DRAWING LOGIC ---
    // ... Implementation of basic canvas drawing directly in event handlers ...
    const startDrawing = (e: React.MouseEvent) => {
        if (mode !== 'draw') return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentLine({ points: [{ x, y }], color: '#ffffff', width: 3 });
    };

    const draw = (e: React.MouseEvent) => {
        if (mode !== 'draw' || !currentLine) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentLine(prev => prev ? { ...prev, points: [...prev.points, { x, y }] } : null);
    };

    const endDrawing = () => {
        if (currentLine) {
            setLines([...lines, currentLine]);
            setCurrentLine(null);
        }
    };

    // Draw Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Saved Lines
        const drawLine = (line: DrawingLine) => {
            ctx.beginPath();
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            if (line.points.length > 0) {
                ctx.moveTo(line.points[0].x, line.points[0].y);
                line.points.forEach(p => ctx.lineTo(p.x, p.y));
            }
            ctx.stroke();
        };

        lines.forEach(drawLine);
        if (currentLine) drawLine(currentLine);

    }, [lines, currentLine, view]); // Re-render when lines change

    // --- DRAG LOGIC ---
    const handleMouseDown = (e: React.MouseEvent, id: number) => {
        if (mode === 'draw') return;
        e.stopPropagation(); // Don't trigger canvas draw
        setIsDragging(id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mode === 'draw') {
            draw(e);
            return;
        }

        if (isDragging !== null && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate % positions
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            setTokens(tokens.map(t => t.id === isDragging ? { ...t, x, y } : t));
        }
    };

    const handleMouseUp = () => {
        if (mode === 'draw') {
            endDrawing();
        }
        setIsDragging(null);
    };


    // --- SAVING ---
    const savePlay = () => {
        const name = prompt("Name this play:");
        if (name) {
            const play: SavedPlay = { name, tokens, lines, type: view };
            const saved = JSON.parse(localStorage.getItem('apex_tactics') || '[]');
            localStorage.setItem('apex_tactics', JSON.stringify([...saved, play]));
            alert("Play Saved!");
        }
    };

    const loadRef = useRef<HTMLSelectElement>(null);
    const loadPlay = (e: any) => {
        const saved = JSON.parse(localStorage.getItem('apex_tactics') || '[]');
        const play = saved.find((p: any) => p.name === e.target.value);
        if (play) {
            setView(play.type);
            setTimeout(() => {
                setTokens(play.tokens);
                setLines(play.lines);
            }, 100);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a2a] rounded-3xl overflow-hidden border border-blue-900/30">
            {/* Toolbar */}
            <div className="bg-[#000020] p-4 flex flex-wrap items-center justify-between border-b border-white/10 gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setView('full')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${view === 'full' ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Full Field
                    </button>
                    <button
                        onClick={() => setView('quarter')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${view === 'quarter' ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Penalty Corner
                    </button>
                </div>

                <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                    <button onClick={() => setMode('drag')} className={`p-2 rounded ${mode === 'drag' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`} title="Move Players">
                        <MousePointer className="w-5 h-5" />
                    </button>
                    <button onClick={() => setMode('draw')} className={`p-2 rounded ${mode === 'draw' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`} title="Draw Tactics">
                        <Pen className="w-5 h-5" />
                    </button>
                    <button onClick={() => setLines([])} className="p-2 text-gray-400 hover:text-red-500" title="Clear Drawing">
                        <Eraser className="w-5 h-5" />
                    </button>
                    <button onClick={resetBoard} className="p-2 text-gray-400 hover:text-red-500" title="Reset Board">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <select onChange={loadPlay} className="bg-black text-white text-sm border border-gray-700 rounded-lg p-2 max-w-[150px]">
                        <option value="">Load Play...</option>
                        {JSON.parse(localStorage.getItem('apex_tactics') || '[]').map((p: any) => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                    <button onClick={savePlay} className="flex items-center gap-2 bg-[#ceb888] text-black font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors">
                        <Save className="w-4 h-4" />
                        Save
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden bg-[#005a9c] cursor-crosshair select-none"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseDown={startDrawing} // For line drawing
            >
                {/* Background Image */}
                <img
                    src={view === 'full' ? '/images/field-full.png' : '/images/field-quarter.png'}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80"
                    alt="Pitch"
                />

                {/* Drawing Layer */}
                <canvas
                    ref={canvasRef}
                    width={containerRef.current?.clientWidth || 800}
                    height={containerRef.current?.clientHeight || 600}
                    className="absolute inset-0 pointer-events-none z-10"
                />

                {/* Tokens Layer */}
                {tokens.map(token => (
                    <div
                        key={token.id}
                        onMouseDown={(e) => handleMouseDown(e, token.id)}
                        className="absolute w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-xl cursor-move z-20 hover:scale-110 transition-transform transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                            left: `${token.x}%`,
                            top: `${token.y}%`,
                            backgroundColor: token.type === 'attacker' ? '#3b82f6' : token.type === 'defender' ? '#ef4444' : '#f97316'
                        }}
                    >
                        {token.type === 'ball' ? '' : (token.label || '')}
                    </div>
                ))}

            </div>
        </div>
    );
};
