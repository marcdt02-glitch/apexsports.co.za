import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, AlertTriangle, User, Zap, Activity } from 'lucide-react';

interface ApexAgentProps {
    athlete: any; // Using any for flexibility with the AthleteData type
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    type?: 'text' | 'alert' | 'insight';
}

const SYSTEM_INSTRUCTION = `
Role: You are the "APEX Performance AI," a specialized Junior Sports Scientist assistant for APEX Sports.
Core Philosophy: Raise the "Floor" (consistency) and "Ceiling" (potential).
Data-Driven: Use data from Physical and Wellness dashboards.
Translatable Skills: Discipline in training translates to life.
Safety First: NOT a doctor. Redirect clinical/pain issues to Coach/Medical.
Refers to Coach: Use "Coach's philosophy..."
No New Programs: Explain existing science only.
`;

// Simple knowledge base for the "Stub" AI
const KNOWLEDGE_BASE = [
    { keywords: ['ratio', '3:1', 'strength to weight'], response: "According to APEX philosophy, the 3:1 Strength-to-Weight ratio is the 'Gold Standard' for power production. It ensures you have the raw force capacity to accelerate your body mass efficiently." },
    { keywords: ['rpe', 'exertion'], response: "RPE (Rate of Perceived Exertion) is how we measure internal load. A 10/10 is max effort. Coach uses this to autoregulate your training—pushing when you're fresh, backing off when you're cooked." },
    { keywords: ['cns', 'central nervous system', 'fatigue'], response: "CNS Fatigue isn't sore muscles; it's a fried hard drive. If your localized grip strength or jump height drops, your nervous system is overloaded. Recovery strategy: Sleep > Social Media." },
    { keywords: ['floor', 'ceiling'], response: "Coach's 'Floor vs. Ceiling' theory: Talent sets your Ceiling (best day), but Habits set your Floor (worst day). We build the Floor so your 'bad' days are still better than your opponent's 'good' days." },
    { keywords: ['pain', 'hurt', 'injury', 'sharp'], response: "⚠️ SAFETY ALERT: I am not a doctor. If you are feeling sharp pain, stop training immediately and message Coach directly. Do not push through 'bad' pain." },
    { keywords: ['video', 'lab'], response: "The Video Lab is for Technical Mastery. Use it to check your 'Force Vectors' (lines) and 'Joint Stacking'. Remember the recording protocol: 90-degree angle, stable camera, 3-5m distance." },
];

export const ApexAgent: React.FC<ApexAgentProps> = ({ athlete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Trigger (Red Wellness)
    useEffect(() => {
        const wellness = athlete.readinessScore || 75; // specific prop check
        if (wellness < 50 && messages.length === 0) {
            addMessage({
                id: 'init-alert',
                text: `Hey ${athlete.name.split(' ')[0]}! 🚨 I noticed your Readiness Score is low (${wellness}%). Check your 'Recovery' pillar today and prioritize sleep tonight.`,
                sender: 'agent',
                timestamp: new Date(),
                type: 'alert'
            });
            setHasUnread(true);
        } else if (messages.length === 0) {
            // Default greeting
            addMessage({
                id: 'init-greet',
                text: `Hi ${athlete.name.split(' ')[0]}. I'm the APEX AI. I can explain your Ratios, Science concepts, or feedback. What's on your mind?`,
                sender: 'agent',
                timestamp: new Date()
            });
        }
    }, [athlete]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages, isOpen]);

    const addMessage = (msg: Message) => {
        setMessages(prev => [...prev, msg]);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // User Message
        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
        addMessage(userMsg);
        setInput("");

        // Artificial Delay for "Typing"
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let response = "I'm not sure about that specific detail yet. I'm still learning Coach's full philosophy. Try asking about 'Ratios', 'CNS', or 'The Floor'.";

            // Simple Keyword Matching
            const match = KNOWLEDGE_BASE.find(kb => kb.keywords.some(k => lowerInput.includes(k)));
            if (match) {
                response = match.response;
            } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                response = "Hey! Ready to dig into the data?";
            } else if (lowerInput.includes('tired') || lowerInput.includes('exhausted')) {
                const wScore = athlete.readinessScore || 0;
                response = `I see your Wellness is ${wScore}%. It's okay to be tired. Coach recommends focusing on mobility rather than max power when you're feeling this way.`;
            }

            addMessage({
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'agent',
                timestamp: new Date()
            });
        }, 1000);
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center ${isOpen ? 'bg-neutral-800 rotate-90' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`}
            >
                {isOpen ? <X className="w-6 h-6 text-white" /> : (
                    <div className="relative">
                        <Bot className="w-8 h-8 text-white" />
                        {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-blue-500"></span>}
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-[500px] bg-[#111] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col z-[60] animate-fade-in-up">
                    {/* Header */}
                    <div className="p-4 bg-neutral-900 rounded-t-2xl border-b border-neutral-800 flex items-center gap-3">
                        <div className="p-2 bg-blue-900/30 rounded-lg">
                            <Bot className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">APEX Agent</h3>
                            <p className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">Jr. Sports Scientist</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-neutral-800 text-white rounded-br-none' : 'bg-blue-900/20 border border-blue-900/50 text-gray-200 rounded-bl-none'
                                    }`}>
                                    {msg.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-500 mb-1 inline mr-2" />}
                                    {msg.text}
                                    <div className="text-[10px] opacity-30 mt-1 text-right">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions (if emptyish) */}
                    {messages.length < 3 && (
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                            <button onClick={() => setInput("Explain 3:1 Ratio")} className="whitespace-nowrap px-3 py-1 bg-neutral-800 rounded-full text-xs text-gray-400 hover:text-white border border-neutral-700 hover:border-blue-500 transition-all">Explain 3:1 Ratio</button>
                            <button onClick={() => setInput("What is CNS Fatigue?")} className="whitespace-nowrap px-3 py-1 bg-neutral-800 rounded-full text-xs text-gray-400 hover:text-white border border-neutral-700 hover:border-blue-500 transition-all">What is CNS Fatigue?</button>
                            <button onClick={() => setInput("My floor vs ceiling?")} className="whitespace-nowrap px-3 py-1 bg-neutral-800 rounded-full text-xs text-gray-400 hover:text-white border border-neutral-700 hover:border-blue-500 transition-all">My Floor vs Ceiling?</button>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 bg-neutral-900 rounded-b-2xl border-t border-neutral-800 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask the science..."
                            className="flex-1 bg-black text-white text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-neutral-600"
                        />
                        <button onClick={handleSend} className="p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors text-white">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
