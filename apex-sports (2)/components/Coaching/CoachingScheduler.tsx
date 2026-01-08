import React, { useState, useRef } from 'react';
import { Calendar, Save, Download, Plus, Trash2, CheckCircle, Clock, MapPin, Brain, Zap, Target, Activity, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Types ---
type EventType = 'practice' | 'game';
type Pillar = 'psychological' | 'technical' | 'tactical' | 'physical';

interface EventGoals {
    psychological: string;
    technical: string;
    tactical: string;
    physical: string;
}

interface SportsEvent {
    id: string;
    date: string;
    time: string;
    type: EventType;
    opponent?: string; // For games
    location: string;
    goals: EventGoals;
}

const INITIAL_GOALS: EventGoals = {
    psychological: '',
    technical: '',
    tactical: '',
    physical: ''
};

const PILLARS: { id: Pillar; label: string; icon: any; color: string }[] = [
    { id: 'psychological', label: 'Psychological', icon: Brain, color: 'text-pink-500' },
    { id: 'technical', label: 'Technical', icon: Zap, color: 'text-yellow-500' },
    { id: 'tactical', label: 'Tactical', icon: Target, color: 'text-blue-500' },
    { id: 'physical', label: 'Physical', icon: Activity, color: 'text-green-500' },
];

export const CoachingScheduler: React.FC = () => {
    // State
    const [events, setEvents] = useState<SportsEvent[]>([
        {
            id: '1',
            date: new Date().toISOString().split('T')[0],
            time: '16:00',
            type: 'practice',
            location: 'Training Pitch 1',
            goals: {
                psychological: 'Maintain high energy during warm-up.',
                technical: 'Focus on first touch quality.',
                tactical: 'Scan before receiving.',
                physical: 'Work rate in transition.'
            }
        }
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<SportsEvent>>({
        date: '',
        time: '',
        type: 'practice',
        location: '',
        goals: INITIAL_GOALS
    });

    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

    const printRef = useRef<HTMLDivElement>(null);

    // --- Handlers ---

    const handleAddEvent = () => {
        if (!newEvent.date || !newEvent.type) return;

        const event: SportsEvent = {
            id: Date.now().toString(),
            date: newEvent.date || '',
            time: newEvent.time || '',
            type: newEvent.type as EventType,
            location: newEvent.location || '',
            opponent: newEvent.opponent || '',
            goals: INITIAL_GOALS
        };

        setEvents(prev => [...prev, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setIsAdding(false);
        setNewEvent({ date: '', time: '', type: 'practice', location: '', goals: INITIAL_GOALS });
    };

    const handleDeleteEvent = (id: string) => {
        if (confirm('Are you sure you want to delete this session?')) {
            setEvents(prev => prev.filter(e => e.id !== id));
        }
    };

    const handleGoalChange = (eventId: string, pillar: Pillar, value: string) => {
        setEvents(prev => prev.map(e => {
            if (e.id === eventId) {
                return { ...e, goals: { ...e.goals, [pillar]: value } };
            }
            return e;
        }));
    };

    const generatePDF = async () => {
        if (!printRef.current) return;

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4'
        });

        const canvas = await html2canvas(printRef.current, {
            scale: 2,
            backgroundColor: '#000000', // Capture dark mode
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.width / imgProps.height;
        const imgHeight = pdfWidth / ratio;

        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.setFillColor(0, 0, 0);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(`Apex_Schedule_Goals_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // --- Render Helpers ---

    const renderEventCard = (event: SportsEvent, isPrint = false) => {
        const isGame = event.type === 'game';
        const isExpanded = expandedEventId === event.id || isPrint;

        return (
            <div key={event.id} className={`bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-6 ${!isPrint ? 'hover:border-neutral-700 transition-colors' : ''}`}>

                {/* Header */}
                <div
                    className="p-6 cursor-pointer flex items-center justify-between"
                    onClick={() => !isPrint && setExpandedEventId(isExpanded ? null : event.id)}
                >
                    <div className="flex items-center gap-6">
                        {/* Date Box */}
                        <div className="flex flex-col items-center justify-center bg-neutral-800 w-16 h-16 rounded-xl border border-neutral-700">
                            <span className="text-xs text-gray-500 uppercase font-bold">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                            <span className="text-2xl font-black text-white">{new Date(event.date).getDate()}</span>
                        </div>

                        {/* Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${isGame ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                    {isGame ? 'Match Day' : 'Practice'}
                                </span>
                                <span className="text-gray-500 text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {event.time}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {isGame ? (event.opponent ? `vs ${event.opponent}` : 'Match Day') : 'Training Session'}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                <MapPin className="w-3 h-3" />
                                {event.location || 'TBA'}
                            </div>
                        </div>
                    </div>

                    {!isPrint && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                                className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </div>
                    )}
                </div>

                {/* Goals Section */}
                {isExpanded && (
                    <div className="px-6 pb-6 animate-fade-in">
                        <div className="border-t border-neutral-800 pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Target className="w-4 h-4 text-purple-500" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Session Goals</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {PILLARS.map(pillar => (
                                    <div key={pillar.id} className="bg-black/50 p-4 rounded-xl border border-neutral-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <pillar.icon className={`w-3 h-3 ${pillar.color}`} />
                                            <span className="text-xs font-bold text-gray-400 uppercase">{pillar.label}</span>
                                        </div>
                                        {isPrint ? (
                                            <p className="text-sm text-gray-200">{event.goals[pillar.id] || "No goal set."}</p>
                                        ) : (
                                            <textarea
                                                value={event.goals[pillar.id]}
                                                onChange={(e) => handleGoalChange(event.id, pillar.id, e.target.value)}
                                                placeholder={`Set ${pillar.label.toLowerCase()} goal...`}
                                                className="w-full bg-transparent text-sm text-white placeholder-neutral-700 resize-none focus:outline-none h-12"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Coaching Schedule</h2>
                    <p className="text-gray-400 text-sm">Manage practices, games, and performance goals.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors text-xs font-bold uppercase"
                    >
                        <Plus className="w-4 h-4" /> Add Event
                    </button>
                    <button
                        onClick={generatePDF}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-xs font-bold uppercase"
                    >
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Add Event Form */}
            {isAdding && (
                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl animate-fade-in">
                    <h3 className="text-sm font-bold text-white uppercase mb-4">New Session</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Date</label>
                            <input
                                type="date"
                                value={newEvent.date}
                                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                className="w-full bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-white"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Time</label>
                            <input
                                type="time"
                                value={newEvent.time}
                                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                className="w-full bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-white"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Type</label>
                            <select
                                value={newEvent.type}
                                onChange={e => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
                                className="w-full bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-white"
                            >
                                <option value="practice">Practice</option>
                                <option value="game">Game / Match</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Main Pitch"
                                value={newEvent.location}
                                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                className="w-full bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-white"
                            />
                        </div>
                    </div>
                    {newEvent.type === 'game' && (
                        <div className="mb-4 space-y-1">
                            <label className="text-xs text-gray-500">Opponent</label>
                            <input
                                type="text"
                                placeholder="e.g. Stellenbosch FC"
                                value={newEvent.opponent}
                                onChange={e => setNewEvent({ ...newEvent, opponent: e.target.value })}
                                className="w-full bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-white"
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-white text-xs font-bold uppercase">Cancel</button>
                        <button onClick={handleAddEvent} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase shadow-lg shadow-blue-900/20">Add to Schedule</button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-6 min-h-[400px]">
                {events.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
                        <Calendar className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        <p className="text-gray-500">No sessions scheduled.</p>
                    </div>
                ) : (
                    events.map(event => renderEventCard(event))
                )}
            </div>

            {/* Hidden Print Area */}
            <div className="hidden">
                <div ref={printRef} className="bg-black text-white p-8 min-h-screen w-[800px]">
                    <div className="flex justify-between items-center mb-10 border-b border-white/20 pb-6">
                        <div>
                            <h1 className="text-3xl font-black uppercase">Schedule & Goals</h1>
                            <p className="text-gray-400">APEX Performance</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        {events.map(event => renderEventCard(event, true))}
                    </div>
                </div>
            </div>

        </div>
    );
};
