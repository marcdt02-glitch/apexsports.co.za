import React, { useState, useRef, useEffect } from 'react';
import { Save, Eraser, Trash2, Undo, Redo, MousePointer, Pen, Circle, Square, Type, ArrowRight, Minus, UserPlus, UserMinus, FolderOpen, X } from 'lucide-react';

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
    id: string; // Added ID for easier management
    name: string;
    tokens: Token[];
    elements: DrawingElement[];
    type: 'full' | 'half'; // changed quarter to half
    date: string; // Added date
}

export const TacticalWhiteboard: React.FC = () => {
    const [view, setView] = useState<'full' | 'half'>('full');
    const [mode, setMode] = useState<'drag' | 'draw' | 'line' | 'arrow' | 'text'>('drag');
    const [tokens, setTokens] = useState<Token[]>([]);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

    // Canvas Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [selectedToken, setSelectedToken] = useState<number | null>(null); // For deletion

    // Saved Plays State
    const [savedPlays, setSavedPlays] = useState<SavedPlay[]>([]);

    // Initial Load
    useEffect(() => {
        const loaded = JSON.parse(localStorage.getItem('apex_tactics') || '[]');
        setSavedPlays(loaded);
        resetBoard();
    }, []);

    // Effect to reset board when view changes (unless loading a play)
    // We need to be careful not to reset if we just loaded a play.
    // For simplicity, we'll let the user manually reset or we reset on view switch if not loading.
    // Actually, simpler to just reset when view explicitly changes via button click, handled there.

    const resetBoard = (targetView: 'full' | 'half' | undefined = undefined) => {
        const viewToUse = targetView || view;
        const newTokens: Token[] = [];

        if (viewToUse === 'full') {
            // 11 vs 11 Setup
            // Attackers (Maroon) - 4-3-3
            const attackerPositions = [
                { x: 50, y: 90 }, // GK
                { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
                { x: 30, y: 55 }, { x: 50, y: 55 }, { x: 70, y: 55 },
                { x: 20, y: 35 }, { x: 50, y: 30 }, { x: 80, y: 35 },
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
            // Half Field Setup (7 vs 7 + GK) - e.g. Attacking D
            // 7 Attackers (Maroon)
            const attackerPositions = [
                { x: 50, y: 70 },
                { x: 30, y: 60 }, { x: 70, y: 60 },
                { x: 20, y: 40 }, { x: 40, y: 45 }, { x: 60, y: 45 }, { x: 80, y: 40 },
            ];

            // 7 Defenders (Navy) + GK
            const defenderPositions = [
                { x: 50, y: 10 }, // GK
                { x: 35, y: 20 }, { x: 65, y: 20 },
                { x: 25, y: 30 }, { x: 45, y: 30 }, { x: 55, y: 30 }, { x: 75, y: 30 }, { x: 50, y: 35 }
            ];

            attackerPositions.forEach((pos, i) => {
                newTokens.push({ id: Date.now() + i, x: pos.x, y: pos.y, type: 'attacker', label: `${i + 1}` });
            });
            defenderPositions.forEach((pos, i) => {
                newTokens.push({ id: Date.now() + i + 20, x: pos.x, y: pos.y, type: 'defender', label: `${i === 0 ? 'GK' : i}` });
            });

            newTokens.push({ id: 999, x: 50, y: 50, type: 'ball' });
        }

        setTokens(newTokens);
        setElements([]);
        if (targetView) setView(targetView);
    };

    // --- DYNAMIC PLAYERS ---
    const addPlayer = (type: 'attacker' | 'defender') => {
        const id = Date.now();
        // Place near center but offset
        const x = 50 + (Math.random() * 10 - 5);
        const y = 50 + (Math.random() * 10 - 5);
        // Find next label number
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
        if (selectedToken) setSelectedToken(null); // Deselect on click elsewhere
        if (mode === 'drag') return;
        const { x, y } = getCanvasCoords(e);
        const id = Date.now().toString();

        if (mode === 'draw') {
            setCurrentElement({ id, type: 'freehand', points: [{ x, y }], color: '#ffffff', width: 3 });
        } else if (mode === 'line') {
            setCurrentElement({ id, type: 'line', points: [{ x, y }, { x, y }], color: '#ffce00', width: 3 });
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

    }, [elements, currentElement, view, containerRef.current?.clientWidth]); // Re-render on resize too


    // --- DRAG LOGIC ---
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


    // --- SAVING & MANAGING PLAYS ---
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
        alert("Play Saved!");
    };

    const loadPlay = (play: SavedPlay) => {
        if (confirm(`Load "${play.name}"? Unsaved changes will be lost.`)) {
            setView(play.type);
            // Small timeout to allow View transition if background changes
            setTimeout(() => {
                setTokens(play.tokens);
                setElements(play.elements);
            }, 50);
        }
    };

    const deletePlay = (id: string) => {
        if (confirm("Are you sure you want to delete this play?")) {
            const updated = savedPlays.filter(p => p.id !== id);
            setSavedPlays(updated);
            localStorage.setItem('apex_tactics', JSON.stringify(updated));
        }
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col h-full bg-[#0a0a2a] rounded-3xl overflow-hidden border border-blue-900/30 flex-1 min-h-[600px]">
                {/* Toolbar */}
                <div className="bg-[#000020] p-4 flex flex-wrap items-center justify-between border-b border-white/10 gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => resetBoard('full')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold ${view === 'full' ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Full Field
                        </button>
                        <button
                            onClick={() => resetBoard('half')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold ${view === 'half' ? 'bg-[#800000] text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Half Field
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Player Controls */}
                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10 mr-4">
                            <button onClick={() => addPlayer('attacker')} className="p-2 text-gray-400 hover:text-red-400" title="Add Attacker">
                                <UserPlus className="w-4 h-4" />
                            </button>
                            <button onClick={() => addPlayer('defender')} className="p-2 text-gray-400 hover:text-blue-400" title="Add Defender">
                                <UserPlus className="w-4 h-4 text-blue-400" />
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1"></div>
                            <button onClick={deleteSelectedPlayer} className={`p-2 ${selectedToken ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} title="Delete Selected Player">
                                <UserMinus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Drawing Controls */}
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
                            <button onClick={() => resetBoard(view)} className="p-2 text-gray-400 hover:text-red-500" title="Reset Board">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={saveCurrentPlay} className="flex items-center gap-2 bg-[#ceb888] text-black font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors">
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                    </div>
                </div>

                {/* Canvas Container */}
                <div
                    ref={containerRef}
                    className="flex-1 relative overflow-hidden bg-[#005a9c] cursor-crosshair select-none min-h-[500px]"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseDown={startDrawing}
                    onClick={handleCanvasClick}
                >
                    {/* Background Image */}
                    <img
                        src={view === 'full' ? '/images/field-full.png' : '/images/field-quarter.png'}
                        className={`absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80 ${view === 'half' ? 'object-bottom' : ''}`}
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
                            className={`absolute w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-xl cursor-move z-20 hover:scale-110 transition-transform transform -translate-x-1/2 -translate-y-1/2
                                ${token.type === 'attacker' ? 'bg-[#800000] text-white' :
                                    token.type === 'defender' ? 'bg-[#000020] text-white' : 'bg-[#ceb888] text-black'}
                                ${selectedToken === token.id ? 'ring-2 ring-yellow-400 border-yellow-400' : 'border-white'}
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

            {/* Saved Plays Manager (Replaces Journal/Schedule) */}
            <div className="bg-[#0a0a2a] border border-neutral-800 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <FolderOpen className="w-6 h-6 text-[#ceb888]" />
                    <h3 className="text-xl font-bold text-white">Saved Plays</h3>
                </div>

                {savedPlays.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-neutral-800 rounded-xl">
                        <Save className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                        <p className="text-gray-500">No saved plays yet. Design a tactic and click "Save".</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedPlays.map((play) => (
                            <div key={play.id || play.name} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between group hover:border-[#ceb888] transition-colors">
                                <div>
                                    <h4 className="font-bold text-white">{play.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${play.type === 'full' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'}`}>
                                            {play.type === 'full' ? 'Full Field' : 'Half Field'}
                                        </span>
                                        <span className="text-[10px] text-gray-500">{play.date || 'No Date'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => loadPlay(play)}
                                        className="p-2 bg-neutral-800 hover:bg-white hover:text-black rounded-lg text-gray-400 transition-colors"
                                        title="Load Play"
                                    >
                                        <FolderOpen className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deletePlay(play.id || play.name)}
                                        className="p-2 bg-neutral-800 hover:bg-red-900 hover:text-red-500 rounded-lg text-gray-400 transition-colors"
                                        title="Delete Play"
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

