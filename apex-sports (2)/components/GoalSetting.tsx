import React, { useState, useEffect } from 'react';
import { Save, Plus, Clock, MessageSquare, Target } from 'lucide-react';
import { saveGoalQuery } from '../utils/googleIntegration';

interface GoalSettingProps {
    athleteName: string;
    tier: string;
    email: string;
    initialGoals?: any;
}

const GoalSetting: React.FC<GoalSettingProps> = ({ athleteName, email, initialGoals }) => {
    const [newGoal, setNewGoal] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [goalHistory, setGoalHistory] = useState<string[]>([]);

    // Load History
    useEffect(() => {
        if (initialGoals && initialGoals.history) {
            // Parse existing string which might be "[12/01] Goal... [13/01] Goal..."
            // We can split by brackets logic or just newlines if we store it that way.
            // For now, let's assume it's one big block, we can split by " [" or custom delimiter.
            // Better yet, just display it as raw text feed or line by line?
            // User said: "parsed from a single string where each entry starts with a date in brackets like [DD/MM/YYYY]"

            const raw = initialGoals.history;
            if (raw) {
                // Regex to split by date pattern [DD/MM/YYYY]
                // Keep the date with the part.
                const parts = raw.split(/(\[\d{2}\/\d{2}\/\d{4}\])/).filter(Boolean);
                // Re-assemble date + text
                const entries = [];
                for (let i = 0; i < parts.length; i += 2) {
                    if (i + 1 < parts.length) {
                        entries.push(parts[i] + parts[i + 1]);
                    } else {
                        // Dangling part? Or maybe format was different.
                        // If logic fails, just push raw line.
                        if (parts[i].startsWith('[')) entries.push(parts[i]);
                    }
                }

                // If regex split fails to find clean pairs (e.g. if text has no dates), fallback to raw lines
                if (entries.length === 0 && raw.length > 0) {
                    setGoalHistory(raw.split('\n').filter(Boolean));
                } else {
                    setGoalHistory(entries.reverse()); // Newest first usually preferred?
                }
            }
        }
    }, [initialGoals]);

    const handleSave = async () => {
        if (!newGoal.trim()) return;
        setIsSaving(true);
        const timestamp = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
        const entry = `[${timestamp}] ${newGoal}`;

        try {
            const success = await saveGoalQuery(email, entry);
            if (success) {
                setGoalHistory(prev => [entry, ...prev]);
                setNewGoal('');
            } else {
                alert("Failed to save goal. Please check connection.");
            }
        } catch (e) {
            console.error("Save Error", e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-white uppercase italic flex items-center gap-3">
                    <Target className="w-8 h-8 text-red-500" />
                    Goal Tracker
                </h2>
                <p className="text-gray-400">Set targets, track progress, crush limits.</p>
            </div>

            {/* Input Area */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">New Target</label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="What's the mission today?"
                        className="flex-1 bg-[#111] border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-all font-medium"
                        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                    />
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !newGoal.trim()}
                        className="bg-white text-black font-black px-8 rounded-xl uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        SAVE
                    </button>
                </div>
            </div>

            {/* History Feed */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">History Log</h3>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {goalHistory.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-xs font-mono">No history recorded yet.</p>
                        </div>
                    ) : (
                        goalHistory.map((entry, i) => {
                            // Extract date and text for cleaner display
                            const dateMatch = entry.match(/^\[(\d{2}\/\d{2}\/\d{4})\]/);
                            const date = dateMatch ? dateMatch[1] : '';
                            const text = date ? entry.replace(dateMatch![0], '').trim() : entry;

                            return (
                                <div key={i} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="flex-shrink-0 w-24 pt-1">
                                        <span className="text-[10px] font-mono text-gray-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                                            {date || 'Unknown'}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed font-medium">
                                        {text}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

// Simple icon import fallback if Target not imported


export default GoalSetting;
