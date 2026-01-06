import React, { useState, useRef } from 'react';
import { Download, Save, Target, Brain, Activity, Shield, Zap } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Types ---
type Tab = 'seasonOutcome' | 'seasonProcess' | 'monthly' | 'weekly';
type Pillar = 'psychological' | 'technical' | 'tactical' | 'physical';

interface GoalsData {
    [key: string]: {
        [key in Pillar]: string;
    };
}

const GoalSetting: React.FC<{ athleteName: string }> = ({ athleteName }) => {
    const [activeTab, setActiveTab] = useState<Tab>('seasonOutcome');
    const [goals, setGoals] = useState<GoalsData>({
        seasonOutcome: { psychological: '', technical: '', tactical: '', physical: '' },
        seasonProcess: { psychological: '', technical: '', tactical: '', physical: '' },
        monthly: { psychological: '', technical: '', tactical: '', physical: '' },
        weekly: { psychological: '', technical: '', tactical: '', physical: '' },
    });
    const [isSaving, setIsSaving] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    // --- Handlers ---
    const handleInputChange = (pillar: Pillar, value: string) => {
        setGoals(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [pillar]: value
            }
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Mock API Call
        setTimeout(() => {
            setIsSaving(false);
            alert("Goals saved successfully!");
        }, 1000);
    };

    const generatePDF = async () => {
        if (!componentRef.current) return;

        // Temporary style change for PDF generation (ensure black text on white for readability or keep dark mode?)
        // User requested "Clean, branded PDF". Dark mode PDFs use a lot of ink.
        // However, the component design is "Solid matte black". 
        // Capturing high-contrast HTML usually works best if we keep it as is, or invert for print.
        // Given "High Performance Aesthetic", I will capture it exactly as Is (Dark Mode).

        const canvas = await html2canvas(componentRef.current, {
            scale: 2, // High resolution
            backgroundColor: '#000000',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${athleteName}_APEX_Goals.pdf`);
    };

    // --- Configuration ---
    const tabs: { id: Tab; label: string }[] = [
        { id: 'seasonOutcome', label: 'Season Outcome Goals' },
        { id: 'seasonProcess', label: 'Season Process Goals' },
        { id: 'monthly', label: 'Monthly Targets' },
        { id: 'weekly', label: 'Weekly Focus' },
    ];

    const pillars: { id: Pillar; label: string; icon: any }[] = [
        { id: 'psychological', label: 'Psychological', icon: Brain },
        { id: 'technical', label: 'Technical', icon: Zap },
        { id: 'tactical', label: 'Tactical', icon: Target },
        { id: 'physical', label: 'Physical', icon: Activity },
    ];

    return (
        <div className="w-full bg-black border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">

            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Target className="w-6 h-6 text-white" />
                        Athlete Goal Architecture
                    </h2>
                    <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-1">
                        "What's Next?" // APEX Sports
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Goals'}
                    </button>
                    <button
                        onClick={generatePDF}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Main Content Area (Captured for PDF) */}
            <div ref={componentRef} className="p-8 bg-black min-h-[600px] flex flex-col">

                {/* PDF Header (Only useful visual context inside the capture area) */}
                <div className="mb-8 flex justify-between items-end border-b border-white pb-4">
                    <div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">APEX SPORTS</h1>
                        <p className="text-sm text-gray-400 font-mono">HIGH PERFORMANCE ECOSYSTEM</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-white">{athleteName}</p>
                        <p className="text-xs text-gray-500 uppercase">{tabs.find(t => t.id === activeTab)?.label}</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border ${activeTab === tab.id
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black text-gray-500 border-neutral-800 hover:border-gray-600 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* The Four Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div key={pillar.id} className="bg-transparent border border-neutral-800 p-6 flex flex-col group hover:border-neutral-600 transition-colors">
                                <div className="flex items-center gap-3 mb-4 border-b border-neutral-900 pb-2">
                                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">{pillar.label}</h3>
                                </div>
                                <textarea
                                    value={goals[activeTab][pillar.id]}
                                    onChange={(e) => handleInputChange(pillar.id, e.target.value)}
                                    placeholder={`Define your ${pillar.label.toLowerCase()} goals...`}
                                    className="w-full h-full min-h-[120px] bg-transparent text-gray-300 placeholder-neutral-800 resize-none focus:outline-none focus:text-white text-sm leading-relaxed"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Footer for PDF */}
                <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center text-[10px] text-gray-600 font-mono uppercase">
                    <span>Apex Sports // Est. 2024</span>
                    <span>Performance Architecture</span>
                </div>

            </div>
        </div>
    );
};

export default GoalSetting;
