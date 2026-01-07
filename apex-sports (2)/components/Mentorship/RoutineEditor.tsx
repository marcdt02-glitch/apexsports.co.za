
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Save, Edit2, RotateCcw, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface RoutineBlock {
    id: string;
    time: string;
    activity: string;
    notes: string;
}

const DEFAULT_GAMEDAY: RoutineBlock[] = [
    { id: '1', time: '08:00', activity: 'Wake Up & Hydrate', notes: '500ml Water + Electrolytes' },
    { id: '2', time: '09:00', activity: 'Breakfast', notes: 'High Carbs, Moderate Protein' },
    { id: '3', time: '12:00', activity: 'Visualization', notes: '10 mins - Visualise Clean Sheet' },
];

const DEFAULT_PRACTICE: RoutineBlock[] = [
    { id: '1', time: '16:00', activity: 'Pre-Training Snack', notes: 'Banana + Peanut Butter' },
    { id: '2', time: '17:00', activity: 'Warm Up', notes: 'Ramp Protocol' },
    { id: '3', time: '19:00', activity: 'Recovery', notes: 'Protein Shake + Stretch' },
];

interface RoutineEditorProps {
    athleteName: string;
    tier: string;
}

const RoutineEditor: React.FC<RoutineEditorProps> = ({ athleteName, tier }) => {
    const [activeTab, setActiveTab] = useState<'game' | 'practice'>('game');
    const [gameRoutine, setGameRoutine] = useState<RoutineBlock[]>([]);
    const [practiceRoutine, setPracticeRoutine] = useState<RoutineBlock[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('apex_routines');
        if (saved) {
            const parsed = JSON.parse(saved);
            setGameRoutine(parsed.game || DEFAULT_GAMEDAY);
            setPracticeRoutine(parsed.practice || DEFAULT_PRACTICE);
        } else {
            setGameRoutine(DEFAULT_GAMEDAY);
            setPracticeRoutine(DEFAULT_PRACTICE);
        }
    }, []);

    const handleSave = () => {
        const data = { game: gameRoutine, practice: practiceRoutine };
        localStorage.setItem('apex_routines', JSON.stringify(data));
        setHasUnsavedChanges(false);
        // Could add toast notification here
    };

    const updateRoutine = (newRoutine: RoutineBlock[]) => {
        if (activeTab === 'game') setGameRoutine(newRoutine);
        else setPracticeRoutine(newRoutine);
        setHasUnsavedChanges(true);
    };

    const addBlock = () => {
        const current = activeTab === 'game' ? gameRoutine : practiceRoutine;
        const newBlock: RoutineBlock = {
            id: Date.now().toString(),
            time: '00:00',
            activity: 'New Activity',
            notes: ''
        };
        updateRoutine([...current, newBlock]);
    };

    const updateBlock = (id: string, field: keyof RoutineBlock, value: string) => {
        const current = activeTab === 'game' ? gameRoutine : practiceRoutine;
        const updated = current.map(b => b.id === id ? { ...b, [field]: value } : b);
        updateRoutine(updated);
    };

    const deleteBlock = (id: string) => {
        const current = activeTab === 'game' ? gameRoutine : practiceRoutine;
        updateRoutine(current.filter(b => b.id !== id));
    };

    const resetDefaults = () => {
        if (confirm("Reset to default templates? This will erase your changes.")) {
            setGameRoutine(DEFAULT_GAMEDAY);
            setPracticeRoutine(DEFAULT_PRACTICE);
            setHasUnsavedChanges(true);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const routine = activeTab === 'game' ? gameRoutine : practiceRoutine;
        const title = activeTab === 'game' ? 'Game Day Routine' : 'Practice Routine';

        // Header
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text("APEX Elite Routine", 20, 25);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(title, 140, 25); // Top right

        // Content
        doc.setTextColor(0, 0, 0);
        let y = 60;

        // Sort by time
        const sorted = [...routine].sort((a, b) => a.time.localeCompare(b.time));

        sorted.forEach((block) => {
            // Time Box
            doc.setFillColor(240, 240, 240); // Light gray
            doc.rect(20, y - 6, 30, 12, 'F');
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(block.time, 25, y + 2);

            // Activity
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(block.activity, 60, y + 2);

            // Notes
            if (block.notes) {
                y += 8;
                doc.setFontSize(10);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(100, 100, 100);
                doc.text(block.notes, 60, y + 2);
                doc.setTextColor(0, 0, 0); // Reset
                y += 4;
            }

            // Line Divider
            doc.setDrawColor(220, 220, 220);
            doc.line(20, y + 6, 190, y + 6);

            y += 15; // Spacing for next item

            // Page break if needed
            if (y > 270) {
                doc.addPage();
                y = 30;
            }
        });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated by Apex Performance Portal on ${new Date().toLocaleDateString()} `, 20, 285);

        doc.save(`Apex_${title.replace(/ /g, '_')}.pdf`);
    };

    const displayedRoutine = activeTab === 'game' ? gameRoutine : practiceRoutine;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Elite Routines</h2>
                    <p className="text-gray-400 text-sm">Design your schedule. Consistency creates Champions.</p>
                </div>
                <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                    <button
                        onClick={() => setActiveTab('game')}
                        className={`px - 6 py - 2 rounded - lg text - sm font - bold transition - all ${activeTab === 'game' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'} `}
                    >
                        Game Day
                    </button>
                    <button
                        onClick={() => setActiveTab('practice')}
                        className={`px - 6 py - 2 rounded - lg text - sm font - bold transition - all ${activeTab === 'practice' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'} `}
                    >
                        Practice Day
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {displayedRoutine.sort((a, b) => a.time.localeCompare(b.time)).map((block) => (
                    <div key={block.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-neutral-700 transition-colors">
                        <div className="flex items-center gap-3 w-full md:w-32 bg-black/40 p-2 rounded-lg border border-neutral-800">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <input
                                type="time"
                                value={block.time}
                                onChange={(e) => updateBlock(block.id, 'time', e.target.value)}
                                className="bg-transparent text-white font-mono outline-none w-full"
                            />
                        </div>

                        <div className="flex-grow w-full">
                            <input
                                type="text"
                                value={block.activity}
                                onChange={(e) => updateBlock(block.id, 'activity', e.target.value)}
                                className="bg-transparent text-white font-bold text-lg outline-none w-full placeholder-gray-600"
                                placeholder="Activity Name"
                            />
                            <input
                                type="text"
                                value={block.notes}
                                onChange={(e) => updateBlock(block.id, 'notes', e.target.value)}
                                className="bg-transparent text-gray-500 text-sm outline-none w-full placeholder-gray-700"
                                placeholder="Add notes, nutrition, or cues..."
                            />
                        </div>

                        <button
                            onClick={() => deleteBlock(block.id)}
                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addBlock}
                    className="w-full py-4 border-2 border-dashed border-neutral-800 rounded-xl text-gray-500 hover:text-white hover:border-neutral-600 hover:bg-neutral-900/50 transition-all flex items-center justify-center gap-2 font-bold"
                >
                    <Plus className="w-5 h-5" />
                    Add Time Block
                </button>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-4">
                <button
                    onClick={() => handleDownloadPDF('light')}
                    className="bg-white text-black p-4 rounded-full shadow-lg hover:bg-gray-200 hover:scale-110 transition-transform"
                    title="Download PDF"
                >
                    <Download className="w-6 h-6" />
                </button>
                {hasUnsavedChanges && (
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-black p-4 rounded-full shadow-lg shadow-green-900/20 hover:scale-110 transition-transform animate-bounce"
                        title="Save Changes"
                    >
                        <Save className="w-6 h-6" />
                    </button>
                )}
                <button
                    onClick={resetDefaults}
                    className="bg-neutral-800 text-gray-400 p-4 rounded-full shadow-lg hover:text-white hover:scale-110 transition-transform"
                    title="Reset to Defaults"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default RoutineEditor;

