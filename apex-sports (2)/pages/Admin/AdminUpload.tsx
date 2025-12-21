import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Lock } from 'lucide-react';

const AdminUpload: React.FC = () => {
    const { refreshData, data } = useData();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'apex2025') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Password');
        }
    };

    const handleFile = (file: File) => {
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                try {
                    refreshData(text);
                    setUploadStatus('success');
                } catch (err) {
                    console.error(err);
                    setUploadStatus('error');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid CSV file');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-6">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white text-center tracking-widest focus:border-white outline-none transition-colors"
                        />
                        <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                            Unlock Portal
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Data Upload</h1>
                <p className="text-gray-400 mb-12">Update the Performance Lab database.</p>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-12">

                    <div
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${dragActive ? 'border-white bg-neutral-800' : 'border-neutral-700 hover:border-neutral-500'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept=".csv"
                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                        />

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                                {uploadStatus === 'success' ? (
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                ) : (
                                    <UploadCloud className="w-8 h-8 text-gray-400" />
                                )}
                            </div>

                            <div>
                                <p className="text-xl font-bold mb-2">
                                    {fileName ? fileName : 'Drag & Drop CSV File'}
                                </p>
                                <p className="text-gray-500 text-sm mb-6">
                                    {uploadStatus === 'success' ? 'Upload Complete!' : 'or click to browse'}
                                </p>
                            </div>

                            {uploadStatus !== 'success' && (
                                <button
                                    onClick={() => inputRef.current?.click()}
                                    className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Select File
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Current Database Status */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Active Athletes ({data.length})
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="border-b border-gray-800 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="pb-3">ID</th>
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Score (H:Q L)</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {data.map((athlete) => (
                                    <tr key={athlete.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 font-mono text-xs">{athlete.id}</td>
                                        <td className="py-3 font-bold text-white">{athlete.name}</td>
                                        <td className="py-3">{athlete.date}</td>
                                        <td className="py-3">{athlete.hamstringQuadLeft}</td>
                                        <td className="py-3">
                                            <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs border border-green-900/50">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-600">
                                            No data loaded. Please upload a CSV.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminUpload;
