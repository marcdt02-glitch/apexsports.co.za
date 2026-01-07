import React, { useState, useRef, useEffect } from 'react';
import { Download, Save, Target, Brain, Activity, Shield, Zap, Info, Check, Printer, X, Layout, Calendar, List, Award, Menu } from 'lucide-react';
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

// --- Constants & Tooltips ---
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
            <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center bg-transparent hover:bg-white hover:border-white transition-all group-hover:bg-white">
                <Info className="w-3 h-3 text-gray-500 group-hover:text-black transition-colors" />
            </div>
            {/* Tooltip Popup */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-white text-black rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 transform group-hover:-translate-y-1">
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45"></div>
                <h4 className="font-bold text-xs uppercase mb-2 border-b border-gray-200 pb-1 text-black">Guided Reflection</h4>
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
            format: 'a4'
        });

        // Load Logo
        const logoUrl = '/images/logo.png';
        const logoImg = new Image();
        logoImg.src = logoUrl;
        await new Promise((resolve) => { logoImg.onload = resolve; logoImg.onerror = resolve; });

        // Header
        const pdfWidth = pdf.internal.pageSize.getWidth();
        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, pdfWidth, 60, 'F'); // Header Bar

        // Branding
        try {
            pdf.addImage(logoImg, 'PNG', 20, 10, 40, 40);
        } catch (e) { }

        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.text("Performance Blueprint", 70, 30);

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Athlete: ${athleteName} | Tier: ${tier}`, 70, 45);

        const sections = Array.from(printRef.current.children) as HTMLElement[];
        let pageAdded = false;
        let yOffset = 70; // Start below header

        for (const section of sections) {
            const sectionId = section.getAttribute('data-tab-id') as Tab;
            if (!sectionId || !exportSelection.includes(sectionId)) continue;

            // For subsequent pages, add new page and re-draw header? 
            // Or just put header on first page? User implies branding on PDF. 
            // Usually header on every page is nice, but `pdf.addPage` makes a blank page. 
            // Let's keep a simple header on first page, or minimal header on others.
            // For simplicity, let's just make it one continuous scrolling PDF or separate pages.
            // Original code: `if (pageAdded) pdf.addPage();`

            if (pageAdded) {
                pdf.addPage();
                yOffset = 20; // Reset offset for new page
                // Optional: Draw minimal header on new pages
                pdf.setFillColor(0, 0, 0);
                pdf.rect(0, 0, pdfWidth, 20, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(10);
                pdf.text(`APEX Performance | ${athleteName}`, 10, 14);
                yOffset = 40;
            }

            const canvas = await html2canvas(section, {
                scale: 2,
                backgroundColor: '#0a0a0a',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            // Scale to fit width
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;
            const linkHeight = pdfWidth / ratio;

            if (linkHeight > (pdf.internal.pageSize.getHeight() - yOffset)) {
                // If too tall, maybe just scale it? Or let it span?
                // jsPDF simple addImage:
                pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, linkHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, linkHeight);
            }

            pageAdded = true;
        }

        pdf.save(`${athleteName}_APEX_Performance_Blueprint.pdf`);
    };

    // --- Configuration ---
    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'seasonOutcome', label: 'Outcome', icon: Award },
        { id: 'seasonProcess', label: 'Process', icon: List },
        { id: 'monthly', label: 'Monthly', icon: Calendar },
        { id: 'weekly', label: 'Weekly', icon: Target },
        { id: 'cycleReview', label: 'Review', icon: Activity },
    ];

    const pillars: { id: Pillar; label: string; icon: any }[] = [
        { id: 'psychological', label: 'Psychological', icon: Brain },
        { id: 'technical', label: 'Technical', icon: Zap },
        { id: 'tactical', label: 'Tactical', icon: Target },
        { id: 'physical', label: 'Physical', icon: Activity },
    ];

    // --- Render Helpers ---
    const renderGoalGrid = (tabId: Exclude<Tab, 'cycleReview'>, isPrint = false) => (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isPrint ? 'min-h-[600px] p-8 bg-[#0a0a0a] text-white' : ''}`}>
            {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                    <div key={pillar.id} className={`flex flex-col group transition-all duration-300 ${isPrint ? 'border border-neutral-700 p-6' : 'bg-[#0f0f0f] border border-neutral-800 p-6 hover:border-neutral-600 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}`}>
                        <div className="flex items-center gap-3 mb-4 border-b border-neutral-900 pb-2">
                            <Icon className={`w-4 h-4 transition-colors ${isPrint ? 'text-gray-400' : 'text-gray-500 group-hover:text-white'}`} />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{pillar.label}</h3>
                        </div>
                        {isPrint ? (
                            <p className="text-sm text-gray-300 whitespace-pre-wrap font-mono min-h-[100px] leading-relaxed">
                                {goals[tabId][pillar.id] || "No goals defined."}
                            </p>
                        ) : (
                            <textarea
                                value={goals[tabId][pillar.id]}
                                onChange={(e) => handleInputChange(tabId, pillar.id, e.target.value)}
                                placeholder={`Define ${pillar.label.toLowerCase()} target...`}
                                className="w-full h-full min-h-[120px] bg-transparent text-gray-300 placeholder-neutral-800 resize-none focus:outline-none focus:text-white text-sm leading-relaxed border-none focus:ring-0"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );

    const renderCycleReview = (isPrint = false) => (
        <div className={`space-y-8 ${isPrint ? 'p-12 bg-[#0a0a0a] text-white' : ''}`}>

            {/* 1. Pillar Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pillars.map((pillar) => (
                    <div key={pillar.id} className={`${isPrint ? 'border border-neutral-700 p-4' : 'bg-[#0f0f0f] p-6 border border-neutral-800 hover:border-neutral-600 transition-colors'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest">{pillar.label}</h4>
                            <span className="text-xl font-black text-white">{goals.cycleReview.ratings[pillar.id]}<span className="text-xs text-gray-600">/10</span></span>
                        </div>
                        {!isPrint ? (
                            <div className="relative h-6 w-full flex items-center">
                                {/* Custom Slider Track */}
                                <input
                                    type="range" min="1" max="10"
                                    value={goals.cycleReview.ratings[pillar.id]}
                                    onChange={(e) => handleRatingChange(pillar.id, parseInt(e.target.value))}
                                    className="w-full h-0.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer focus:outline-none
                                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rotate-45 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-[0_0_10px_white]
                                    "
                                />
                            </div>
                        ) : (
                            <div className="h-1 w-full bg-neutral-800 mt-2">
                                <div className="h-full bg-white" style={{ width: `${goals.cycleReview.ratings[pillar.id] * 10}%` }}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 2. Reflection Boxes */}
            <div className="grid grid-cols-1 gap-6">

                {/* Win */}
                <div className={`p-6 border ${isPrint ? 'border-neutral-700' : 'bg-[#0f0f0f] border-neutral-800 hover:border-neutral-600 transition-colors'}`}>
                    <div className="mb-4">
                        {!isPrint ? <CustomTooltip title="Primary Win" items={TOOLTIPS.win} /> : <h3 className="text-sm font-bold text-white uppercase tracking-widest">Primary Win</h3>}
                    </div>
                    {!isPrint ? (
                        <textarea
                            value={goals.cycleReview.win}
                            onChange={(e) => handleReviewChange('win', e.target.value)}
                            placeholder="Identify what clicked..."
                            className="w-full min-h-[100px] bg-transparent text-gray-300 placeholder-neutral-800 resize-none focus:outline-none focus:text-white text-sm leading-relaxed"
                        />
                    ) : (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{goals.cycleReview.win}</p>
                    )}
                </div>

                {/* Friction */}
                <div className={`p-6 border ${isPrint ? 'border-neutral-700' : 'bg-[#0f0f0f] border-neutral-800 hover:border-neutral-600 transition-colors'}`}>
                    <div className="mb-4">
                        {!isPrint ? <CustomTooltip title="Primary Friction" items={TOOLTIPS.friction} /> : <h3 className="text-sm font-bold text-white uppercase tracking-widest">Primary Friction</h3>}
                    </div>
                    {!isPrint ? (
                        <textarea
                            value={goals.cycleReview.friction}
                            onChange={(e) => handleReviewChange('friction', e.target.value)}
                            placeholder="Identify the breakdown..."
                            className="w-full min-h-[100px] bg-transparent text-gray-300 placeholder-neutral-800 resize-none focus:outline-none focus:text-white text-sm leading-relaxed"
                        />
                    ) : (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{goals.cycleReview.friction}</p>
                    )}
                </div>

                {/* Pivot */}
                <div className={`p-6 border ${isPrint ? 'border-neutral-700' : 'bg-[#0f0f0f] border-neutral-800 hover:border-neutral-600 transition-colors'}`}>
                    <div className="mb-4">
                        {!isPrint ? <CustomTooltip title="The Pivot" items={TOOLTIPS.pivot} /> : <h3 className="text-sm font-bold text-white uppercase tracking-widest">The Pivot</h3>}
                    </div>
                    {!isPrint ? (
                        <textarea
                            value={goals.cycleReview.pivot}
                            onChange={(e) => handleReviewChange('pivot', e.target.value)}
                            placeholder="What one change will have the biggest impact next cycle?"
                            className="w-full min-h-[100px] bg-transparent text-gray-300 placeholder-neutral-800 resize-none focus:outline-none focus:text-white text-sm leading-relaxed"
                        />
                    ) : (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{goals.cycleReview.pivot}</p>
                    )}
                </div>
            </div>

            {isPrint && (
                <div className="mt-16 text-center">
                    <h2 className="text-6xl font-black italic text-white/20 tracking-tighter">"What's next"</h2>
                </div>
            )}
        </div>
    );

    const Header = ({ title, printMode = false }: { title: string, printMode?: boolean }) => (
        <div className={`flex justify-between items-end border-b mb-8 ${printMode ? 'border-white/20 pt-8 px-8 pb-4' : 'border-neutral-800 p-6 bg-black/50 backdrop-blur-md sticky top-0 z-20'}`}>
            <div>
                {!printMode ? (
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-white" /> {/* Accent Line */}
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                Athlete Command Center
                            </h2>
                            <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">
                                Elite Player Portal // v18.7
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">APEX SPORTS</h1>
                        <p className="text-sm text-gray-400 font-mono">HIGH PERFORMANCE BLUPRINT</p>
                    </>
                )}
            </div>

            {printMode ? (
                <div className="text-right">
                    <p className="text-xl font-bold text-white">{athleteName}</p>
                    <p className="text-xs text-gray-500 uppercase">{new Date().toLocaleDateString()} // {title}</p>
                </div>
            ) : (
                <button
                    onClick={() => setShowExportModal(true)}
                    className="group flex items-center gap-2 px-5 py-2 border border-white/20 hover:border-white text-white rounded-none transition-all text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
                >
                    <span>Print Blueprint</span>
                    <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
            )}
        </div>
    );

    return (
        // MAIN CONTAINER: #0a0a0a Matte Black + Subtle texture
        <div className="w-full min-h-[700px] bg-[#0a0a0a] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in relative flex flex-col font-sans selection:bg-white selection:text-black">

            {/* Subtle "Carbon" / Tech Background Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            {/* Logo Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                <Zap className="w-[500px] h-[500px] text-white" />
            </div>

            {/* Header */}
            <Header title={tabs.find(t => t.id === activeTab)?.label || ''} />

            {/* Desktop Navigation: Segmented Control */}
            <div className="hidden md:flex px-6 mb-8 relative z-10 w-full">
                <div className="flex w-full bg-[#111] p-1 rounded-none border border-neutral-800">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden group ${activeTab === tab.id
                                ? 'bg-white text-black shadow-lg'
                                : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            <tab.icon className={`w-3 h-3 ${activeTab === tab.id ? 'text-black' : 'text-gray-600 group-hover:text-gray-400'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Content Area */}
            <div className="flex-grow p-6 md:p-8 relative z-10 pb-24 md:pb-8">
                {activeTab === 'cycleReview'
                    ? renderCycleReview(false)
                    : renderGoalGrid(activeTab, false)
                }
            </div>

            {/* Mobile Navigation: Bottom Fixed Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-neutral-800 p-2 z-50 flex justify-between safe-area-pb">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all ${activeTab === tab.id
                            ? 'text-white'
                            : 'text-gray-600'
                            }`}
                    >
                        <div className={`p-1.5 rounded-lg ${activeTab === tab.id ? 'bg-neutral-800' : 'bg-transparent'}`}>
                            <tab.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Save Button (Floating for easy access) */}
            <div className="absolute bottom-6 right-6 z-20 hidden md:block">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50"
                >
                    {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Syncing...' : 'Save Updates'}
                </button>
            </div>

            {/* --- HIDDEN PRINT AREA --- */}
            <div className="fixed top-0 left-[-10000px] w-[1100px]" ref={printRef}>
                {tabs.map(tab => (
                    <div key={tab.id} data-tab-id={tab.id} className="min-h-[800px] bg-[#0a0a0a] text-white p-8">
                        <Header title={tab.label} printMode={true} />
                        <div className="mt-8">
                            {tab.id === 'cycleReview' ? renderCycleReview(true) : renderGoalGrid(tab.id as any, true)}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- EXPORT MODAL --- */}
            {showExportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-[#0a0a0a] border border-neutral-700 w-full max-w-md shadow-2xl animate-fade-in-up relative">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-[#0f0f0f]">
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                <Printer className="w-5 h-5" />
                                Export Blueprint
                            </h3>
                            <button onClick={() => setShowExportModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">

                            {/* Option 1: Full Blueprint */}
                            <div
                                onClick={() => setExportSelection(['seasonOutcome', 'seasonProcess', 'monthly', 'weekly', 'cycleReview'])}
                                className={`group p-5 border cursor-pointer transition-all flex items-center justify-between ${JSON.stringify(exportSelection.length) === '5' ? 'bg-white/5 border-white' : 'bg-transparent border-neutral-800 hover:border-neutral-600'}`}
                            >
                                <div>
                                    <h4 className="font-bold text-white uppercase tracking-wide text-sm flex items-center gap-2">
                                        Full Season Blueprint
                                        {JSON.stringify(exportSelection.length) === '5' && <span className="bg-white text-black text-[9px] px-1.5 py-0.5 rounded font-black">RECOMMENDED</span>}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">Complete dossier: Strategy, Tactics & Review.</p>
                                </div>
                                <div className={`w-5 h-5 rounded-sm border flex items-center justify-center ${JSON.stringify(exportSelection.length) === '5' ? 'bg-white border-white' : 'border-neutral-600 bg-transparent'}`}>
                                    {JSON.stringify(exportSelection.length) === '5' && <Check className="w-3 h-3 text-black" />}
                                </div>
                            </div>

                            {/* Option 2: Custom Selection */}
                            <div>
                                <h4 className="font-bold text-gray-500 mb-4 text-[10px] uppercase tracking-widest border-b border-neutral-800 pb-2">Or Select Specific Modules</h4>
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
                                            className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer group"
                                        >
                                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${exportSelection.includes(tab.id) ? 'bg-white border-white' : 'border-neutral-700 group-hover:border-neutral-500'}`}>
                                                {exportSelection.includes(tab.id) && <Check className="w-3 h-3 text-black" />}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wide ${exportSelection.includes(tab.id) ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{tab.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="p-6 border-t border-neutral-800 bg-[#0f0f0f]">
                            <button
                                onClick={generatePDF}
                                className="w-full bg-white text-black font-black py-4 hover:bg-gray-200 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Generate HQ PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GoalSetting;
