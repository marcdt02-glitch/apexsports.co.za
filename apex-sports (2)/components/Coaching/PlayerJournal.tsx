import React, { useState } from 'react';
import { Book, Plus, Calendar, Save, Trash2, Edit2, Search, Tag, Smile, Frown, Meh, AlertCircle } from 'lucide-react';

interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful';
    tags: string[];
}

const INITIAL_ENTRIES: JournalEntry[] = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        title: 'Project Restart: Day 1',
        content: "Felt good to be back on the pitch. The knee feels stable, but I need to trust it more in 50/50s. The new S&C program is definitely helping with confidence.",
        mood: 'good',
        tags: ['training', 'injury-rehab']
    }
];

export const PlayerJournal: React.FC = () => {
    // State
    const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Editor State
    const [editData, setEditData] = useState<Partial<JournalEntry>>({
        date: new Date().toISOString().split('T')[0],
        title: '',
        content: '',
        mood: 'neutral',
        tags: []
    });

    const [newTag, setNewTag] = useState('');

    // --- Helpers ---
    const getMoodIcon = (mood: string) => {
        switch (mood) {
            case 'great': return <Smile className="w-5 h-5 text-green-400" />;
            case 'good': return <Smile className="w-5 h-5 text-green-600" />;
            case 'neutral': return <Meh className="w-5 h-5 text-yellow-500" />;
            case 'bad': return <Frown className="w-5 h-5 text-orange-500" />;
            case 'awful': return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Meh className="w-5 h-5" />;
        }
    };

    // --- Handlers ---
    const handleNewEntry = () => {
        const newData = {
            date: new Date().toISOString().split('T')[0],
            title: '',
            content: '',
            mood: 'neutral' as const,
            tags: []
        };
        setEditData(newData);
        setSelectedEntry(null); // 'null' selection while editing implies NEW
        setIsEditing(true);
    };

    const handleSelectEntry = (entry: JournalEntry) => {
        setSelectedEntry(entry);
        setEditData(entry);
        setIsEditing(false); // View mode first
    };

    const handleSave = () => {
        if (!editData.title || !editData.content) return;

        if (selectedEntry && selectedEntry.id) {
            // Update Existing
            setEntries(prev => prev.map(e => e.id === selectedEntry.id ? { ...e, ...editData, id: e.id } as JournalEntry : e));
            setSelectedEntry({ ...editData, id: selectedEntry.id } as JournalEntry);
        } else {
            // Create New
            const newEntry = { ...editData, id: Date.now().toString() } as JournalEntry;
            setEntries(prev => [newEntry, ...prev]);
            setSelectedEntry(newEntry);
        }
        setIsEditing(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this journal entry?")) {
            setEntries(prev => prev.filter(e => e.id !== id));
            if (selectedEntry?.id === id) {
                setSelectedEntry(null);
                setIsEditing(false);
            }
        }
    };

    const handleAddTag = () => {
        if (newTag && !editData.tags?.includes(newTag)) {
            setEditData({ ...editData, tags: [...(editData.tags || []), newTag] });
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditData({ ...editData, tags: editData.tags?.filter(t => t !== tagToRemove) });
    };

    // Filter
    const filteredEntries = entries.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col md:flex-row h-[700px] bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden animate-fade-in">
            {/* LEFT: Sidebar List */}
            <div className="w-full md:w-80 bg-black/40 border-r border-neutral-800 flex flex-col">
                <div className="p-4 border-b border-neutral-800">
                    <button
                        onClick={handleNewEntry}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors mb-4"
                    >
                        <Plus className="w-4 h-4" /> New Entry
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search journal..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-800 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-neutral-600"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {filteredEntries.map(entry => (
                        <div
                            key={entry.id}
                            onClick={() => handleSelectEntry(entry)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedEntry?.id === entry.id ? 'bg-neutral-800 border-neutral-600' : 'bg-transparent border-transparent hover:bg-neutral-800/50'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-mono text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                                {getMoodIcon(entry.mood)}
                            </div>
                            <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">{entry.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">{entry.content}</p>
                        </div>
                    ))}
                    {filteredEntries.length === 0 && (
                        <div className="text-center py-10 text-gray-600 text-xs">
                            No entries found.
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Editor / View */}
            <div className="flex-1 flex flex-col bg-[#0a0a0a]">
                {isEditing ? (
                    // --- EDITOR MODE ---
                    <div className="flex-1 flex flex-col p-6 md:p-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                {selectedEntry ? 'Edit Entry' : 'New Entry'}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={() => { setIsEditing(false); if (!selectedEntry) setSelectedEntry(entries[0] || null); }} className="px-4 py-2 text-gray-400 hover:text-white text-xs font-bold uppercase">Cancel</button>
                                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 text-xs font-bold uppercase">
                                    <Save className="w-4 h-4" /> Save
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                                <input
                                    type="date"
                                    value={editData.date}
                                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Mood</label>
                                <select
                                    value={editData.mood}
                                    onChange={(e) => setEditData({ ...editData, mood: e.target.value as any })}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-white"
                                >
                                    <option value="great">Great</option>
                                    <option value="good">Good</option>
                                    <option value="neutral">Neutral</option>
                                    <option value="bad">Bad</option>
                                    <option value="awful">Awful</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Entry Title"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="w-full bg-transparent text-2xl font-bold text-white placeholder-neutral-700 border-none focus:ring-0 p-0 mb-2"
                            />
                        </div>

                        <div className="flex-1 mb-4">
                            <textarea
                                placeholder="Write your thoughts..."
                                value={editData.content}
                                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                                className="w-full h-full bg-neutral-900/50 p-4 rounded-xl text-gray-300 placeholder-neutral-700 resize-none focus:outline-none focus:bg-neutral-900 transition-colors leading-relaxed"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-2">
                                {editData.tags?.map(tag => (
                                    <span key={tag} className="bg-neutral-800 text-gray-300 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                        #{tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500"><Tag className="w-3 h-3" /></button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="+ Tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                className="bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none w-20"
                            />
                        </div>
                    </div>
                ) : (
                    // --- VIEW MODE ---
                    selectedEntry ? (
                        <div className="flex-1 flex flex-col p-6 md:p-10 animate-fade-in overflow-y-auto">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                            {new Date(selectedEntry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                        <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded text-xs text-gray-300">
                                            {getMoodIcon(selectedEntry.mood)} <span className="capitalize">{selectedEntry.mood}</span>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl font-black text-white">{selectedEntry.title}</h1>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(selectedEntry.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-neutral-800 rounded-lg transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {selectedEntry.content}
                            </div>

                            <div className="mt-8 pt-8 border-t border-neutral-800 flex gap-2">
                                {selectedEntry.tags.map(tag => (
                                    <span key={tag} className="text-xs font-mono text-gray-500">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-600">
                            <Book className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select an entry or create a new one.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
