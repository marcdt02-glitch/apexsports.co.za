import React, { useState, useRef } from 'react';
import { Download, Save, Target, Brain, Activity, Shield, Zap, Info, Check, Printer, X, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Types ---
type Tab = 'seasonOutcome' | 'seasonProcess' | 'monthly' | 'weekly' | 'cycleReview';
type Pillar = 'psychological' | 'technical' | 'tactical' | 'physical';

interface GoalsData {
    seasonOutcome: Record<Pillar, string>;
    seasonProcess: Record<Pillar, string>;
    monthly: Record<Pillar, string>;
    weekly: Record<Pillar, string>;
    cycleReview: {
        ratings: Record<Pillar, number>;
        win: string;
        friction: string;
        pivot: string;
    };
}

// --- Tooltip Content ---
const TOOLTIPS = {
    win: [
        "🧠 Psych: When were you 'in the zone'?",
        "⚡ Tech: Which skill felt automatic?",
        "♟️ Tac: Best decision under pressure?",
        "💪 Phys: Where did you feel explosive?"
    ],
    friction: [
        "🧠 Psych: When did focus break?",
        "⚡ Tech: What broke down under fatigue?",
        "♟️ Tac: Where were you disconnected?",
        "💪 Phys: Did you feel heavy/limited?"
    ],
    pivot: [
        "☝️ The One Thing: What habit moves the needle 1%?",
        "🆘 Resource Check: What do you need from staff?",
        "🔥 Non-Negotiable: Your main commitment next cycle."
    ]
};

const CustomTooltip = ({ title, items }: { title: string, items: string[] }) => (
    <div className="group relative flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
        <div className="cursor-help">
            <Info className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />

            {/* Tooltip Popup */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-white text-black rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 transform group-hover:-translate-y-1">
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45"></div>
                <h4 className="font-bold text-xs uppercase mb-2 border-b border-gray-200 pb-1 text-gray-900">Guided Reflection</h4>
                <ul className="space-y-1.5">
                    {items.map((item, i) => (
                        <li key={i} className="text-[10px] leading-tight font-medium text-gray-600">{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const GoalSetting: React.FC<{ athleteName: string }> = ({ athleteName }) => {
    const [activeTab, setActiveTab] = useState<Tab>('seasonOutcome');
    const [goals, setGoals] = useState<GoalsData>({
        seasonOutcome: { psychological: '', technical: '', tactical: '', physical: '' },
        seasonProcess: { psychological: '', technical: '', tactical: '', physical: '' },
        monthly: { psychological: '', technical: '', tactical: '', physical: '' },
        weekly: { psychological: '', technical: '', tactical: '', physical: '' },
        cycleReview: {
            ratings: { psychological: 5, technical: 5, tactical: 5, physical: 5 },
            win: '',
            friction: '',
            pivot: ''
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportSelection, setExportSelection] = useState<Tab[]>(['seasonOutcome', 'seasonProcess', 'monthly', 'weekly', 'cycleReview']);

    // Refs
    // we use a specific ref for the "Print Staging Area"
    const printRef = useRef<HTMLDivElement>(null);

    // --- Handlers ---
    const handleInputChange = (tab: Exclude<Tab, 'cycleReview'>, pillar: Pillar, value: string) => {
        setGoals(prev => ({ ...prev, [tab]: { ...prev[tab], [pillar]: value } }));
    };

    const handleReviewChange = (field: 'win' | 'friction' | 'pivot', value: string) => {
        setGoals(prev => ({ ...prev, cycleReview: { ...prev.cycleReview, [field]: value } }));
    };

    const handleRatingChange = (pillar: Pillar, value: number) => {
        setGoals(prev => ({
            ...prev,
            cycleReview: {
                ...prev.cycleReview,
                ratings: { ...prev.cycleReview.ratings, [pillar]: value }
            }
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => { setIsSaving(false); alert("Goals saved successfully!"); }, 1000);
    };

    const generatePDF = async () => {
        if (!printRef.current) return;
        setShowExportModal(false);

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'a4' // We will scale canvas to fit
        });

        const sections = Array.from(printRef.current.children) as HTMLElement[];
        // Filter sections based on exportSelection
        // We assigned IDs to sections in the render method below

        let pageAdded = false;

        for (const section of sections) {
            const sectionId = section.getAttribute('data-tab-id') as Tab;
            if (!sectionId || !exportSelection.includes(sectionId)) continue;

            if (pageAdded) pdf.addPage();

            // Render section to canvas
            const canvas = await html2canvas(section, {
                scale: 2,
                backgroundColor: '#000000',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Maintain Aspect Ratio or Fit Page? 
            // Landscape A4 is approx 632px height at 72dpi, but we are using px unit.
            // Let's just scale to fit width.
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;
            const linkHeight = pdfWidth / ratio;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, linkHeight);
            pageAdded = true;
        }

        pdf.save(`${athleteName}_APEX_Performance_Blueprint.pdf`);
    };

    // --- Configuration ---
    const tabs: { id: Tab; label: string }[] = [
        { id: 'seasonOutcome', label: 'Season Outcome' },
        { id: 'seasonProcess', label: 'Season Process' },
        { id: 'monthly', label: 'Monthly Targets' },
        { id: 'weekly', label: 'Weekly Focus' },
        { id: 'cycleReview', label: 'Cycle Review' },
    ];

    const pillars: { id: Pillar; label: string; icon: any }[] = [
        { id: 'psychological', label: 'Psychological', icon: Brain },
        { id: 'technical', label: 'Technical', icon: Zap },
        { id: 'tactical', label: 'Tactical', icon: Target },
        { id: 'physical', label: 'Physical', icon: Activity },
    ];

    // --- Render Helpers ---
    const renderGoalGrid = (tabId: Exclude<Tab, 'cycleReview'>, isPrint = false) => (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isPrint ? 'min-h-[600px] p-8 bg-black text-white' : ''}`}>
            {!isPrint && pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                    <div key={pillar.id} className="bg-transparent border border-neutral-800 p-6 flex flex-col group hover:border-neutral-600 transition-colors">
                        <div className="flex items-center gap-3 mb-4 border-b border-neutral-900 pb-2">
                            <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            <h3 className="text-lg font-bold text-white uppercase tracking-wide">{pillar.label}</h3>
                        </div>
                        <textarea
                            value={goals[tabId][pillar.id]}
                            onChange={(e) => handleInputChange(tabId, pillar.id, e.target.value)}
                            placeholder={`Define your ${pillar.label} goals...`}
                            className="w-full h-full min-h-[120px] bg-transparent text-gray-300 placeholder-neutral-800 resize-none focus:outline-none focus:text-white text-sm leading-relaxed"
                        />
                    </div>
                );
            })}
            {/* Print Version: Simpler text rendering without inputs if needed, but textarea values render fine in html2canvas */}
            {isPrint && pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                    <div key={pillar.id} className="border border-neutral-700 p-6">
                        <div className="flex items-center gap-3 mb-4 border-b border-neutral-800 pb-2">
                            <Icon className="w-5 h-5 text-gray-400" />
                            <h3 className="text-xl font-bold text-white uppercase">{pillar.label}</h3>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap font-mono min-h-[100px]">
                            {goals[tabId][pillar.id] || "No goals defined."}
                        </p>
                    </div>
                );
            })}
        </div>
    );

    const renderCycleReview = (isPrint = false) => (
        <div className={`space-y-8 ${isPrint ? 'p-12 bg-black text-white' : ''}`}>

            {/* 1. Pillar Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pillars.map((pillar) => (
                    <div key={pillar.id} className={`${isPrint ? 'border border-neutral-700 p-4' : 'bg-neutral-900/40 p-4 border border-neutral-800 rounded-xl'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold uppercase text-gray-400">{pillar.label}</h4>
                            <span className="text-lg font-black text-white">{goals.cycleReview.ratings[pillar.id]}/10</span>
                        </div>
                        {!isPrint ? (
                            <input
                                type="range" min="1" max="10"
                                value={goals.cycleReview.ratings[pillar.id]}
                                onChange={(e) => handleRatingChange(pillar.id, parseInt(e.target.value))}
                                className="w-full accent-white h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        ) : (
                            // Print: Bar Chart Representation
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-white" style={{ width: `${goals.cycleReview.ratings[pillar.id] * 10}%` }}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 2. Reflection Boxes */}
            <div className="grid grid-cols-1 gap-6">

                {/* Win */}
                <div className={`p-6 border ${isPrint ? 'border-neutral-700' : 'bg-neutral-900/40 border-neutral-800 rounded-xl'}`}>
                    <div className="mb-4">
                        {!isPrint ? <CustomTooltip title="Primary Win" items={TOOLTIPS.win} /> : <h3 className="text-lg font-bold text-white uppercase">Primary Win</h3>}
                    </div>
                    {!isPrint ? (
                        <textarea
                            value={goals.cycleReview.win}
                            onChange={(e) => handleReviewChange('win', e.target.value)}
                            placeholder="What worked? (Psychological, Technical, Tactical, Physical)"
                            className="w-full min-h-[100px] bg-transparent text-gray-300 placeholder-neutral-700 resize-none focus:outline-none focus:text-white text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{goals.cycleReview.win}</p>
                    )}
                </div>

                {/* Friction */}
                <div className={`p-6 border ${isPrint ? 'border-neutral-700' : 'bg-neutral-900/40 border-neutral-800 rounded-xl'}`}>
                    <div className="mb-4">
                        {!isPrint ? <CustomTooltip title="Primary Friction" items={TOOLTIPS.friction} /> : <h3 className="text-lg font-bold text-white uppercase">Primary Friction</h3>}
                    </div>
                    {!isPrint ? (
                        <textarea
                            value={goals.cycleReview.friction}
                            onChange={(e) => handleReviewChange('friction', e.target.value)}
                            placeholder="What got in the way? where did you feel limited?"
                            className="w-full min-h-[100px] bg-transparent text-gray-300 placeholder-neutral-700 resize-none focus:outline-none focus:text-white text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{goals.cycleReview.friction}</p>
                    )}
                </div>

                {/* Pivot */}
                <div className={`p-6 border ${isPrint ? 'border-neutral-700' : 'bg-neutral-900/40 border-neutral-800 rounded-xl'}`}>
                    <div className="mb-4">
                        {!isPrint ? <CustomTooltip title="The Pivot" items={TOOLTIPS.pivot} /> : <h3 className="text-lg font-bold text-white uppercase">The Pivot</h3>}
                    </div>
                    {!isPrint ? (
                        <textarea
                            value={goals.cycleReview.pivot}
                            onChange={(e) => handleReviewChange('pivot', e.target.value)}
                            placeholder="What one change will have the biggest impact next cycle?"
                            className="w-full min-h-[100px] bg-transparent text-gray-300 placeholder-neutral-700 resize-none focus:outline-none focus:text-white text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{goals.cycleReview.pivot}</p>
                    )}
                </div>
            </div>

            {/* Print Slogan */}
            {isPrint && (
                <div className="mt-12 text-center">
                    <h2 className="text-4xl font-black italic text-white tracking-tighter">"What's next"</h2>
                </div>
            )}
        </div>
    );

    const Header = ({ title, printMode = false }: { title: string, printMode?: boolean }) => (
        <div className={`flex justify-between items-end border-b pb-4 mb-8 ${printMode ? 'border-white pt-8 px-8' : 'border-neutral-800 p-6 bg-neutral-900/50 backdrop-blur-md'}`}>
            <div>
                {!printMode ? (
                    <>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <Target className="w-6 h-6 text-white" />
                            Athlete Goal Architecture
                        </h2>
                        <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-1">
                            "What's Next?" // APEX Sports
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">APEX SPORTS</h1>
                        <p className="text-sm text-gray-400 font-mono">HIGH PERFORMANCE ECOSYSTEM</p>
                    </>
                )}
            </div>

            {printMode ? (
                <div className="text-right">
                    <p className="text-xl font-bold text-white">{athleteName}</p>
                    <p className="text-xs text-gray-500 uppercase">{new Date().toLocaleDateString()} // {title}</p>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50">
                        <Save className="w-4 h-4" /> {isSaving ? '...' : 'Save'}
                    </button>
                    <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-lg transition-all text-xs font-bold uppercase tracking-wider">
                        <Download className="w-4 h-4" /> PDF
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full bg-black border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in relative">

            {/* Header */}
            <Header title={tabs.find(t => t.id === activeTab)?.label || ''} />

            {/* Tabs */}
            <div className="px-6 mb-8 flex flex-wrap gap-2">
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

            {/* Active Content */}
            <div className="p-6 min-h-[500px]">
                {activeTab === 'cycleReview'
                    ? renderCycleReview(false)
                    : renderGoalGrid(activeTab, false)
                }
            </div>

            {/* --- HIDDEN PRINT AREA --- */}
            {/* We render ALL tabs here in a visually hidden container for PDF generation */}
            <div className="fixed top-0 left-[-10000px] w-[1100px]" ref={printRef}>
                {tabs.map(tab => (
                    <div key={tab.id} data-tab-id={tab.id} className="min-h-[800px] bg-black text-white p-8">
                        <Header title={tab.label} printMode={true} />
                        <div className="mt-8">
                            {tab.id === 'cycleReview' ? renderCycleReview(true) : renderGoalGrid(tab.id as any, true)}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- EXPORT MODAL --- */}
            {showExportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Printer className="w-5 h-5" />
                                Export Blueprint
                            </h3>
                            <button onClick={() => setShowExportModal(false)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* Option 1: Full Blueprint */}
                            <div
                                onClick={() => setExportSelection(['seasonOutcome', 'seasonProcess', 'monthly', 'weekly', 'cycleReview'])}
                                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${JSON.stringify(exportSelection.length) === '5' ? 'bg-white/10 border-white' : 'bg-transparent border-neutral-800 hover:border-neutral-600'}`}
                            >
                                <div>
                                    <h4 className="font-bold text-white">Full Season Blueprint</h4>
                                    <p className="text-xs text-gray-400">All goal tiers + Cycle Review</p>
                                </div>
                                {exportSelection.length === 5 && <Check className="w-5 h-5 text-green-500" />}
                            </div>

                            {/* Option 2: Custom Selection */}
                            <div>
                                <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-widest">Custom Selection</h4>
                                <div className="space-y-2">
                                    {tabs.map(tab => (
                                        <div key={tab.id}
                                            onClick={() => {
                                                setExportSelection(prev =>
                                                    prev.includes(tab.id)
                                                        ? prev.filter(t => t !== tab.id)
                                                        : [...prev, tab.id]
                                                );
                                            }}
                                            className="flex items-center gap-3 p-3 bg-neutral-950 rounded-lg cursor-pointer hover:bg-neutral-800"
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${exportSelection.includes(tab.id) ? 'bg-blue-600 border-blue-600' : 'border-neutral-700'}`}>
                                                {exportSelection.includes(tab.id) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm text-gray-300">{tab.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="p-6 border-t border-neutral-800 bg-neutral-900/50">
                            <button
                                onClick={generatePDF}
                                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Generate PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GoalSetting;
