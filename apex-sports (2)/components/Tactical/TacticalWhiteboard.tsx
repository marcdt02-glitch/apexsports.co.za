import React, { useState, useRef, useEffect } from 'react';
import { Save, Eraser, Trash2, Undo, Redo, MousePointer, Pen, Circle, Square, Type, ArrowRight, Minus } from 'lucide-react';

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
    points?: { x: number; y: number }[]; // For freehand, line, arrow
    x?: number; // For text
    y?: number; // For text
    text?: string; // For text
    color: string;
    width?: number; // For lines
    fontSize?: number; // For text
}

interface SavedPlay {
    name: string;
    tokens: Token[];
    elements: DrawingElement[];
    type: 'full' | 'quarter';
}

export const TacticalWhiteboard: React.FC = () => {
    const [view, setView] = useState<'full' | 'quarter'>('full');
    const [mode, setMode] = useState<'drag' | 'draw' | 'line' | 'arrow' | 'text'>('drag');
    const [tokens, setTokens] = useState<Token[]>([]);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

    // Canvas Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);

    // Initial Setup
    useEffect(() => {
        resetBoard();
    }, [view]);

    const resetBoard = () => {
        const newTokens: Token[] = [];
        // Default Setup
        if (view === 'full') {
            // 11 vs 11 Setup
            // Attackers (Maroon) - 4-3-3(ish) setup
            const attackerPositions = [
                { x: 50, y: 90 }, // GK
                { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 }, // Backs
                { x: 30, y: 55 }, { x: 50, y: 55 }, { x: 70, y: 55 }, // Mids
                { x: 20, y: 35 }, { x: 50, y: 30 }, { x: 80, y: 35 }, // Forwards
            ];

            // Defenders (Navy) - Mirrored
            const defenderPositions = [
                { x: 50, y: 10 }, // GK
                { x: 20, y: 25 }, { x: 40, y: 25 }, { x: 60, y: 25 }, { x: 80, y: 25 },
                { x: 30, y: 45 }, { x: 50, y: 45 }, { x: 70, y: 45 },
                { x: 20, y: 65 }, { x: 50, y: 70 }, { x: 80, y: 65 },
            ];

            attackerPositions.forEach((pos, i) => {
                newTokens.push({ id: Date.now() + i, x: pos.x, y: pos.y, type: 'attacker', label: `${i === 0 ? 'GK' : i}` });
            });
            defenderPositions.forEach((pos, i) => {
                newTokens.push({ id: Date.now() + i + 20, x: pos.x, y: pos.y, type: 'defender', label: `${i === 0 ? 'GK' : i}` });
            });

            newTokens.push({ id: 999, x: 50, y: 50, type: 'ball' });

        } else {
            // PC Setup (unchanged logic for now, just example positions)
            newTokens.push({ id: 1, x: 48, y: 15, type: 'attacker', label: 'IN' });
            newTokens.push({ id: 2, x: 45, y: 90, type: 'attacker', label: 'S' });
            newTokens.push({ id: 3, x: 50, y: 90, type: 'attacker', label: 'H' });
            newTokens.push({ id: 4, x: 48, y: 12, type: 'defender', label: 'GK' });
            newTokens.push({ id: 5, x: 40, y: 12, type: 'defender' });
            newTokens.push({ id: 6, x: 56, y: 12, type: 'defender' });
            newTokens.push({ id: 999, x: 48, y: 14, type: 'ball' });
        }
        setTokens(newTokens);
        setElements([]);
    };

    // --- DRAWING HARNESS ---
    const getCanvasCoords = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent) => {
        if (mode === 'drag') return;
        const { x, y } = getCanvasCoords(e);
        const id = Date.now().toString();

        if (mode === 'draw') {
            setCurrentElement({ id, type: 'freehand', points: [{ x, y }], color: '#ffffff', width: 3 });
        } else if (mode === 'line') {
            setCurrentElement({ id, type: 'line', points: [{ x, y }, { x, y }], color: '#ffce00', width: 3 }); // Gold lines
        } else if (mode === 'arrow') {
            setCurrentElement({ id, type: 'arrow', points: [{ x, y }, { x, y }], color: '#ffce00', width: 3 });
        }
    };

    const drawMove = (e: React.MouseEvent) => {
        if (!currentElement || mode === 'drag') return;
        const { x, y } = getCanvasCoords(e);

        if (mode === 'draw') {
            setCurrentElement(prev => prev ? { ...prev, points: [...(prev.points || []), { x, y }] } : null);
        } else if (mode === 'line' || mode === 'arrow') {
            // Update end point
            setCurrentElement(prev => {
                if (!prev || !prev.points) return null;
                const newPoints = [prev.points[0], { x, y }];
                return { ...prev, points: newPoints };
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
                setElements([...elements, {
                    id: Date.now().toString(),
                    type: 'text',
                    x,
                    y,
                    text,
                    color: '#ffffff',
                    fontSize: 16
                }]);
            }
        }
    };

    // --- RENDERING ---
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

        const renderElement = (el: DrawingElement) => {
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

        elements.forEach(renderElement);
        if (currentElement) renderElement(currentElement);

    }, [elements, currentElement, view]);


    // --- DRAG LOGIC ---
    const handleTokenDown = (e: React.MouseEvent, id: number) => {
        if (mode !== 'drag') return;
        e.stopPropagation();
        setIsDragging(id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mode === 'drag') {
            if (isDragging !== null && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
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


    // --- SAVING ---
    const savePlay = () => {
        const name = prompt("Name this play:");
        if (name) {
            const play: SavedPlay = { name, tokens, elements, type: view };
            const saved = JSON.parse(localStorage.getItem('apex_tactics') || '[]');
            localStorage.setItem('apex_tactics', JSON.stringify([...saved, play]));
            alert("Play Saved!");
        }
    };

    const loadPlay = (e: any) => {
        const saved = JSON.parse(localStorage.getItem('apex_tactics') || '[]');
        const play = saved.find((p: any) => p.name === e.target.value);
        if (play) {
            setView(play.type);
            setTimeout(() => {
                setTokens(play.tokens);
                setElements(play.elements || []); // Handle legacy saves
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
                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                    <button onClick={() => setMode('draw')} className={`p-2 rounded ${mode === 'draw' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`} title="Freehand">
                        <Pen className="w-5 h-5" />
                    </button>
                    <button onClick={() => setMode('line')} className={`p-2 rounded ${mode === 'line' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`} title="Line">
                        <Minus className="w-5 h-5" />
                    </button>
                    <button onClick={() => setMode('arrow')} className={`p-2 rounded ${mode === 'arrow' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`} title="Arrow">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => setMode('text')} className={`p-2 rounded ${mode === 'text' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`} title="Text Label">
                        <Type className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                    <button onClick={() => setElements([])} className="p-2 text-gray-400 hover:text-red-500" title="Clear Drawing">
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
                onMouseDown={startDrawing}
                onClick={handleCanvasClick}
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
                        onMouseDown={(e) => handleTokenDown(e, token.id)}
                        className={`absolute w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-xl cursor-move z-20 hover:scale-110 transition-transform transform -translate-x-1/2 -translate-y-1/2
                            ${token.type === 'attacker' ? 'bg-[#800000] text-white' :
                                token.type === 'defender' ? 'bg-[#000020] text-white' : 'bg-[#ceb888] text-black'}
                        `}
                        style={{
                            left: `${token.x}%`,
                            top: `${token.y}%`
                        }}
                    >
                        {token.type === 'ball' ? '' : (token.label || '')}
                    </div>
                ))}

            </div>
        </div>
    );
};

