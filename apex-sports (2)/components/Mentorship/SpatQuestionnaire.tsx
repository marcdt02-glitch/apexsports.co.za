import React, { useState, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Download, ChevronRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- DATA & CONFIG ---

type Category = 'FCW' | 'GS' | 'V' | 'CCF' | 'CCN';

const CATEGORIES: Record<Category, string> = {
    FCW: 'Freedom From Worry',
    GS: 'Goal Setting',
    V: 'Visualization',
    CCF: 'Confidence',
    CCN: 'Concentration'
};

// Questions Mapped to Categories
// FCW: 1, 6, 11, 16, 21, 26, 31, 36
// GS: 2, 7, 12, 17, 22, 27, 32, 37
// V: 3, 8, 13, 18, 23, 28, 33, 38
// CCF: 4, 9, 14, 19, 24, 29, 34, 39
// CCN: 5, 10, 15, 20, 25, 30, 35, 40

interface Question {
    id: number;
    textEn: string;
    textAf: string;
    category: Category;
    isReverse: boolean; // True if "Agree" = Bad (Worry, Distraction, etc.)
}

const QUESTIONS: Question[] = [
    { id: 1, textEn: "I worry about making mistakes", textAf: "Ek bekommer my dat ek foute sal maak", category: 'FCW', isReverse: true },
    { id: 2, textEn: "I, myself, set my goals", textAf: "Ek stel self my doelwitte", category: 'GS', isReverse: false },
    { id: 3, textEn: "I visualise my sport just before going into competitions", textAf: "Ek visualiseer my sport net voordat ŉ kompetisie begin", category: 'V', isReverse: false },
    { id: 4, textEn: "I look forward to important competitions", textAf: "Ek sien uit na belangrike kompetisies", category: 'CCF', isReverse: false },
    { id: 5, textEn: "When a competition is not going well, my concentration is easily distracted", textAf: "Wanneer ‘n kompetisie nie so goed gaan nie word my konsentrasie maklik ontwrig", category: 'CCN', isReverse: true },

    { id: 6, textEn: "Before a competition I am concerned that I may not do as well as I could", textAf: "Ek is bekommerd dat ek nie so goed sal doen as wat ek kan nie", category: 'FCW', isReverse: true },
    { id: 7, textEn: "I set realistic, but challenging goals", textAf: "Ek stel realistiese maar uitdagende doewitte", category: 'GS', isReverse: false },
    { id: 8, textEn: "I find it easy to visualise clear mental pictures", textAf: "Ek vind dit maklik om ŉ duidelike prentjie te visualiseer", category: 'V', isReverse: false },
    { id: 9, textEn: "I enjoy the challenges of important competitions", textAf: "Ek geniet die uitdagings", category: 'CCF', isReverse: false },
    { id: 10, textEn: "I can effectively block out negative thoughts", textAf: "Ek kan negatiewe gedagtes effektief blokkeer", category: 'CCN', isReverse: false },

    { id: 11, textEn: "Before I compete, I worry about not performing well", textAf: "Voor ek deelneem, is ek bekommerd dat ek nie goed sal vaar nie", category: 'FCW', isReverse: true },
    { id: 12, textEn: "I set very specific goals for myself daily or weekly", textAf: "Op ‘n daaglikse of weeklikse basis stel ek spesifieke doelwitte", category: 'GS', isReverse: false },
    { id: 13, textEn: "I visualise my sport in my imagination during practice", textAf: "Ek visualiseer my sport tydens oefensessies", category: 'V', isReverse: false },
    { id: 14, textEn: "Before competitions I am confident I can meet challenges", textAf: "Voor kompetisies is ek vol vertroue dat ek die uitdagings kan hanteer", category: 'CCF', isReverse: false },
    { id: 15, textEn: "I have trouble concentrating during important competitions", textAf: "Ek het probleme om te konsentreer", category: 'CCN', isReverse: true },

    { id: 16, textEn: "I have doubts about my ability in sport", textAf: "Ek twyfel oor my sportvermoë", category: 'FCW', isReverse: true },
    { id: 17, textEn: "I set specific goals for each practice session", textAf: "Ek stel spesifieke doelwitte vir elke oefensessie", category: 'GS', isReverse: false },
    { id: 18, textEn: "I use visualisation just before a competition", textAf: "Ek maak gebruik van visualisering net voor die begin", category: 'V', isReverse: false },
    { id: 19, textEn: "I can control my nervousness", textAf: "Ek kan my senuagtigheid beheer", category: 'CCF', isReverse: false },
    { id: 20, textEn: "My thoughts interfere with my performance", textAf: "My gedagtes meng in met my prestasie", category: 'CCN', isReverse: true },

    { id: 21, textEn: "I am concerned that others will be disappointed", textAf: "Ek is bekommerd dat ander mense teleurgesteld sal wees", category: 'FCW', isReverse: true },
    { id: 22, textEn: "I monitor the progress towards my goals", textAf: "Ek monitor my vordering oppad na my doelwitte", category: 'GS', isReverse: false },
    { id: 23, textEn: "I visualise my sport during competitions", textAf: "Ek visualiseer my sport tydens kompetisies", category: 'V', isReverse: false },
    { id: 24, textEn: "Before competitions I am confident I will perform well", textAf: "Voor kompetisies is ek vol vetroue dat ek goed sal presteer", category: 'CCF', isReverse: false },
    { id: 25, textEn: "My concentration lets me down", textAf: "My konsentrasie laat my in die steek", category: 'CCN', isReverse: true },

    { id: 26, textEn: "I feel threatened by important competitions", textAf: "Ek ervaar belangrike kompetisies as bedreigend", category: 'FCW', isReverse: true },
    { id: 27, textEn: "My goals all have deadlines", textAf: "Al my doelwitte het teikendatums", category: 'GS', isReverse: false },
    { id: 28, textEn: "I can clearly visualise my future performances", textAf: "Ek kan duidelik my toekomstige sportvertoning visualiseer", category: 'V', isReverse: false },
    { id: 29, textEn: "The more important the competition, the more enjoyable it is", textAf: "Hoe belangriker die kompetisie, hoe meer geniet ek dit", category: 'CCF', isReverse: false },
    { id: 30, textEn: "I continue to concentrate well even after making a mistake", textAf: "Ek hou aan om goed te konsentreer selfs as ek ‘n fout maak", category: 'CCN', isReverse: false },

    { id: 31, textEn: "I experience thoughts of failure", textAf: "Ek ervaar gedagtes van mislukking", category: 'FCW', isReverse: true },
    { id: 32, textEn: "My specific goals lead me to my long-term goal", textAf: "My spesifieke doelwitte lei my na my langtermyndoel", category: 'GS', isReverse: false },
    { id: 33, textEn: "I set aside specific times to practise visualisation", textAf: "Ek reserveer spesifieke tye om my sport in my verbeelding te beoefen", category: 'V', isReverse: false },
    { id: 34, textEn: "I can handle unexpected stress", textAf: "Ek kan onverwagte stres hanteer", category: 'CCF', isReverse: false },
    { id: 35, textEn: "Unexpected things disrupt my concentration", textAf: "Onverwagte gebeure ontwrig my konsentrasie", category: 'CCN', isReverse: true },

    { id: 36, textEn: "I worry about failing", textAf: "Ek is bekommerd dat ek sal misluk", category: 'FCW', isReverse: true },
    { id: 37, textEn: "I set specific goals for every competition", textAf: "Ek stel spesifieke doelwitte vir elke kompetisie", category: 'GS', isReverse: false },
    { id: 38, textEn: "I can clearly visualise my previous performances", textAf: "Ek kan my vorige sportvertonings duidelik visualiseer", category: 'V', isReverse: false },
    { id: 39, textEn: "I am confident I can handle the pressure", textAf: "Ek het die vertroue dat ek die druk kan hanteer", category: 'CCF', isReverse: false },
    { id: 40, textEn: "I can quickly refocus my concentration after distraction", textAf: "Ek kan vinnig my konsentrasie herfokus", category: 'CCN', isReverse: false }
];

interface SpatProps {
    athleteName: string;
    tier: string;
}

const SpatQuestionnaire: React.FC<SpatProps> = ({ athleteName, tier }) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const chartRef = useRef<HTMLDivElement>(null);

    const completedCount = Object.keys(answers).length;
    const progress = (completedCount / 40) * 100;

    const handleAnswer = (qId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const calculateScore = (cat: Category) => {
        return QUESTIONS.filter(q => q.category === cat).reduce((sum, q) => {
            const val = answers[q.id] || 0;
            // REVERSE SCORING for Negative Items
            // 0 => 6, 1 => 5, 2 => 4, 3 => 3, 4 => 2, 5 => 1, 6 => 0
            const score = q.isReverse ? (6 - val) : val;
            return sum + score;
        }, 0);
    };

    const scores = {
        FCW: calculateScore('FCW'),
        GS: calculateScore('GS'),
        V: calculateScore('V'),
        CCF: calculateScore('CCF'),
        CCN: calculateScore('CCN')
    };

    const radarData = [
        { subject: 'Worry Free', A: scores.FCW, fullMark: 48 },
        { subject: 'Goal Setting', A: scores.GS, fullMark: 48 },
        { subject: 'Visualization', A: scores.V, fullMark: 48 },
        { subject: 'Confidence', A: scores.CCF, fullMark: 48 },
        { subject: 'Concentration', A: scores.CCN, fullMark: 48 }
    ];

    const handleDownloadPDF = async (mode: 'dark' | 'light') => {
        if (!chartRef.current) return;

        const logoUrl = '/images/logo.png';
        const logoImg = new Image();
        logoImg.src = logoUrl;
        await new Promise((resolve) => { logoImg.onload = resolve; logoImg.onerror = resolve; setTimeout(resolve, 1000); });

        const canvas = await html2canvas(chartRef.current, {
            scale: 2,
            backgroundColor: mode === 'light' ? '#ffffff' : '#0a0a0a',
            onclone: (clonedDoc) => {
                if (mode === 'light') {
                    const el = clonedDoc.querySelector('.max-w-4xl'); // Root container or specific Ref
                    // If using chartRef, html2canvas starts from that element.
                    // IMPORTANT: html2canvas(element) only clones THAT element. 
                    // The `clonedDoc` is the document containing the clone? Or `clonedDoc` IS the document.
                    // Documentation says `onclone: (clonedDocument) => void`.
                    // The element is inside `clonedDocument`.
                    // We need to find the specific element we captured. 
                    // But usually it's just simpler to query based on classes we know exist.

                    // Text Force Black
                    const all = clonedDoc.querySelectorAll('*');
                    all.forEach((e: any) => {
                        const s = window.getComputedStyle(e);
                        if (s.color === 'rgb(255, 255, 255)' || e.classList.contains('text-white')) {
                            e.style.color = '#000000';
                            if (e.tagName === 'h3' || e.tagName === 'h2') e.style.fontWeight = 'bold';
                        }
                        if (s.backgroundColor.includes('rgba(0, 0, 0') || s.backgroundColor === 'rgb(0, 0, 0)' || s.backgroundColor === 'rgb(23, 23, 23)') {
                            e.style.backgroundColor = '#ffffff';
                            e.style.border = '1px solid #ddd';
                        }
                    });
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();

        // Header
        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, width, 50, 'F');
        try { if (logoImg.complete) pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30); } catch (e) { }

        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(22);
        pdf.text("APEX SPAT Report", 50, 25);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Athlete: ${athleteName}`, 50, 35);
        pdf.text(`Tier: ${tier || 'N/A'}`, 50, 40);

        // Content
        const imgHeight = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 55, width, imgHeight);

        pdf.save(`${athleteName}_SPAT_${mode}.pdf`);
    };

    if (showResults) {
        return (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div ref={chartRef} className="bg-black p-8 rounded-3xl border border-neutral-800 text-center">
                    <h2 className="text-3xl font-black text-white mb-2">Mental Performance Profile</h2>
                    <p className="text-gray-400 mb-8">Based on the BIG-5 Sport Psych Assessment Tool</p>

                    <div className="h-[400px] w-full max-w-2xl mx-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 48]} tick={false} axisLine={false} />
                                <Radar
                                    name="Athlete"
                                    dataKey="A"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    fill="#ef4444"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                        {Object.entries(scores).map(([key, score]) => (
                            <div key={key} className={`p-4 rounded-xl border ${score > 36 ? 'bg-green-900/20 border-green-800' : score < 20 ? 'bg-red-900/20 border-red-800' : 'bg-neutral-900 border-neutral-800'}`}>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{CATEGORIES[key as Category]}</div>
                                <div className={`text-2xl font-black ${score > 36 ? 'text-green-500' : score < 20 ? 'text-red-500' : 'text-white'}`}>
                                    {score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button onClick={() => { setAnswers({}); setShowResults(false); }} className="flex items-center gap-2 bg-neutral-800 text-white px-6 py-3 rounded-full font-bold hover:bg-neutral-700 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Retake Assessment
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => handleDownloadPDF('dark')} className="flex items-center gap-2 bg-neutral-800 text-white px-4 py-3 rounded-full font-bold hover:bg-neutral-700 transition-colors text-xs">
                            <Download className="w-4 h-4" /> Dark
                        </button>
                        <button onClick={() => handleDownloadPDF('light')} className="flex items-center gap-2 bg-white text-black px-4 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors text-xs border border-gray-300">
                            <Download className="w-4 h-4" /> Print
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">SPAT Assessment</h2>
                <p className="text-gray-400 text-sm">Read each statement and indicate how it applies to you in important competitions.</p>

                {/* Progress Bar */}
                <div className="mt-6 h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                    <span>{completedCount} / 40 Completed</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>

            <div className="space-y-6">
                {QUESTIONS.map((q) => (
                    <div key={q.id} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl group hover:border-neutral-700 transition-colors">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                            <div>
                                <span className="text-xs text-gray-500 font-bold mb-1 block">Q{q.id}</span>
                                <p className="text-white font-medium text-lg">{q.textEn}</p>
                                <p className="text-gray-500 text-sm italic mt-1">{q.textAf}</p>
                            </div>
                            {answers[q.id] !== undefined && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />}
                        </div>

                        {/* Likert Scale */}
                        <div className="flex flex-wrap gap-2 justify-between">
                            {[0, 1, 2, 3, 4, 5, 6].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleAnswer(q.id, val)}
                                    className={`flex-1 min-w-[40px] h-10 rounded-lg font-bold text-sm transition-all ${answers[q.id] === val
                                        ? 'bg-white text-black scale-105 shadow-lg'
                                        : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700 hover:text-white'
                                        }`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-gray-600 uppercase tracking-wider font-bold">
                            <span>Strongly Disagree</span>
                            <span>Strongly Agree</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-end">
                <button
                    onClick={() => setShowResults(true)}
                    disabled={completedCount < 40}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all ${completedCount === 40
                        ? 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-xl shadow-red-900/20'
                        : 'bg-neutral-800 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {completedCount < 40 ? `Answer All Questions (${40 - completedCount} left)` : 'View Analysis'}
                    {completedCount === 40 && <ChevronRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default SpatQuestionnaire;
