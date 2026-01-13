import React, { useState } from 'react';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface CoachReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (score: number, notes: string) => void;
    initialScore?: number;
    initialNotes?: string;
    isSaving?: boolean;
}

export const CoachReviewModal: React.FC<CoachReviewModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialScore = 75,
    initialNotes = "",
    isSaving = false
}) => {
    const [score, setScore] = useState<number>(initialScore);
    const [notes, setNotes] = useState<string>(initialNotes);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (score < 0 || score > 100) {
            setError("Score must be between 0 and 100");
            return;
        }
        if (!notes.trim()) {
            setError("Please enter brief clinical notes.");
            return;
        }
        setError(null);
        onConfirm(score, notes);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#111] border border-neutral-800 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isSaving}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-white mb-2">Coach's Review</h2>
                    <p className="text-gray-400">Add final clinical notes and a performance score before generating the Quarterly Report.</p>
                </div>

                {/* Performance Score Input */}
                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Performance Score (0-100)
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                            className="bg-neutral-900 border border-neutral-700 text-white text-3xl font-black rounded-xl p-4 w-32 text-center focus:border-blue-500 focus:outline-none"
                            placeholder="75"
                        />
                        <div className="flex-1">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={score}
                                onChange={(e) => setScore(Number(e.target.value))}
                                className="w-full accent-blue-500 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Clinical Notes Input */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Clinical & Technical Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl p-4 h-32 text-sm focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="e.g. Athlete has improved reactive strength significantly. Focus for next block is aerobic capacity..."
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${isSaving
                            ? 'bg-neutral-800 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                        }`}
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Use Google Sheet...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save & Generate Report
                        </>
                    )}
                </button>

            </div>
        </div>
    );
};
