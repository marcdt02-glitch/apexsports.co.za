import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoachDashboard: React.FC = () => {
    // Mock Data for v11.5 Layout Preview
    // Pending Google Apps Script API update to fetch ALL athletes
    const [teamData] = useState([
        { id: '1', name: 'John Doe', readiness: 92, lastUpdated: 'Today', status: 'optimal' },
        { id: '2', name: 'Sarah Smith', readiness: 65, lastUpdated: 'Today', status: 'fatigue' },
        { id: '3', name: 'Mike Johnson', readiness: 45, lastUpdated: 'Yesterday', status: 'risk' },
        { id: '4', name: 'Emily Davis', readiness: 88, lastUpdated: 'Today', status: 'optimal' },
    ]);

    const sortedTeam = [...teamData].sort((a, b) => a.readiness - b.readiness);

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-800 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-900/30 rounded-lg">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Team Command Center</h1>
                        </div>
                        <p className="text-gray-400">Manage athlete readiness and daily load.</p>
                    </div>
                    <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Back to Home
                    </Link>
                </div>

                {/* API Limitation Notice */}
                <div className="bg-yellow-950/20 border border-yellow-900/50 p-6 rounded-2xl flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-yellow-500 font-bold mb-1">System Update Required</h3>
                        <p className="text-yellow-200/60 text-sm leading-relaxed">
                            The current Google Sheets Connector is optimized for single-athlete privacy.
                            To enable the live <strong>Team View</strong>, the backend script needs to be upgraded to support 'Coach Role' batch fetching.
                            <br /><br />
                            <span className="text-white bg-white/10 px-2 py-1 rounded text-xs font-mono">Status: Preview Mode (Mock Data)</span>
                        </p>
                    </div>
                </div>

                {/* Team Table */}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden">
                    <div className="p-8 border-b border-neutral-800 flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <Activity className="w-5 h-5 text-purple-500" />
                            Daily Readiness Roster
                        </h2>
                        <span className="text-xs font-mono text-gray-500">Sorted by: Lowest Readiness</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-900 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-8 py-4">Athlete</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-center">Neural Readiness</th>
                                    <th className="px-8 py-4 text-right">Last Check-in</th>
                                    <th className="px-8 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {sortedTeam.map((athlete) => (
                                    <tr key={athlete.id} className="hover:bg-neutral-800/30 transition-colors group">
                                        <td className="px-8 py-4 font-bold text-white">{athlete.name}</td>
                                        <td className="px-8 py-4">
                                            {athlete.status === 'risk' && <span className="text-red-500 font-bold text-xs uppercase flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> High Risk</span>}
                                            {athlete.status === 'fatigue' && <span className="text-yellow-500 font-bold text-xs uppercase">Fatigate</span>}
                                            {athlete.status === 'optimal' && <span className="text-green-500 font-bold text-xs uppercase">Prime</span>}
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black border border-neutral-800">
                                                <div className={`w-2 h-2 rounded-full ${athlete.readiness < 70 ? 'bg-red-500' : athlete.readiness < 85 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                <span className="font-mono font-bold">{athlete.readiness}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right text-sm text-gray-400">{athlete.lastUpdated}</td>
                                        <td className="px-8 py-4 text-right">
                                            <button className="text-gray-600 hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachDashboard;
