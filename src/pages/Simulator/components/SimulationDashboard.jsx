import React, { useState, useEffect } from 'react';
import {
    Activity,
    AlertTriangle,
    ShieldAlert,
    AlertOctagon,
    Play,
    Pause,
    Square,
    RotateCcw,
    FileCheck,
    Trash2,
    Upload,
    AlertCircle
} from 'lucide-react';
import { savePCAP, getPCAP, deletePCAP } from '../../../utils/storage';

// Internal Component for Visualizing Packet Flow
function PacketVisualizer({ currentPacket }) {
    const [activePackets, setActivePackets] = useState([]);

    // When a new packet arrives from the playback, add it to the visualization
    useEffect(() => {
        if (!currentPacket) return;

        const id = Date.now() + Math.random();
        const packet = { ...currentPacket, id };

        setActivePackets(prev => [...prev.slice(-10), packet]); // Keep last 10 for performance

        // Clean up packet after animation
        const timer = setTimeout(() => {
            setActivePackets(prev => prev.filter(p => p.id !== id));
        }, 2000);

        return () => clearTimeout(timer);
    }, [currentPacket]);

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 mb-6 relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-6">Live Packet Flow Visualization</h3>

            <div className="flex justify-between items-center relative h-32">
                {/* Source Node */}
                <div className="z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-slate-400 text-sm mt-2 font-bold">Source / Internet</span>
                </div>

                {/* Firewall Node */}
                <div className="z-10 flex flex-col items-center">
                    <div className="w-20 h-24 bg-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-grid-slate-700 opacity-20"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span className="text-orange-400 text-sm mt-2 font-bold">H-SAFE Firewall</span>
                </div>

                {/* Destination Node */}
                <div className="z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <span className="text-slate-400 text-sm mt-2 font-bold">Internal Network</span>
                </div>

                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>

                {/* Animated Packets */}
                {activePackets.map((event) => {
                    const isDenied = event.action === 'DENY';
                    const colorClass = isDenied ? 'bg-red-500' : event.action === 'ALERT' ? 'bg-yellow-400' : 'bg-green-400';

                    return (
                        <div
                            key={event.id}
                            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${colorClass} shadow-lg z-20`}
                            style={{
                                left: '10%',
                                animation: isDenied
                                    ? `flow-deny 2s linear forwards`
                                    : `flow-pass 2s linear forwards`,
                            }}
                        >
                        </div>
                    );
                })}
            </div>

            {/* Global Styles for Animations */}
            <style jsx>{`
                @keyframes flow-pass {
                    0% { left: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    45% { left: 50%; opacity: 1; } /* At firewall */
                    100% { left: 90%; opacity: 1; } /* destination */
                }
                @keyframes flow-deny {
                    0% { left: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    45% { left: 50%; opacity: 1; transform: scale(1) translateY(-50%); }
                    50% { left: 50%; opacity: 0; transform: scale(2) translateY(-50%); } /* Explode/Disappear */
                    100% { left: 50%; opacity: 0; }
                }
            `}</style>

            <div className="flex justify-center gap-6 mt-4 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-full"></div> ALLOWED</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-full"></div> ALERTED</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> BLOCKED</div>
            </div>
        </div>
    );
}

export default function SimulationDashboard() {
    // ... (existing state and handler logic)
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Playback State
    const [playbackIndex, setPlaybackIndex] = useState(0);
    const [currentPacket, setCurrentPacket] = useState(null);
    const [playbackStatus, setPlaybackStatus] = useState('IDLE'); // IDLE, PLAYING, PAUSED, FINISHED
    const playbackTimerRef = React.useRef(null);

    const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000';

    // Load persisted PCAP on mount
    useEffect(() => {
        const loadPersistedFile = async () => {
            const storedFile = await getPCAP();
            if (storedFile) {
                setFile(storedFile);
            }
        };
        loadPersistedFile();
    }, []);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => stopPlayback();
    }, []);

    const handleFileSelect = async (selectedFile) => {
        if (selectedFile) {
            setFile(selectedFile);
            await savePCAP(selectedFile);
        }
    };

    const handleRemoveFile = async () => {
        setFile(null);
        setResult(null);
        await deletePCAP();
    };

    const handleRunSimulation = async () => {
        if (!file) {
            alert("Please upload a PCAP file first.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        stopPlayback(); // Reset any existing playback

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }

        // --- NEW: Inject Local Rules into Request ---
        const localRules = localStorage.getItem('hsafe_rules');
        const rulesPayload = localRules ? localRules : '[]'; // Send stringified JSON
        formData.append('rules_json', rulesPayload);
        // --------------------------------------------

        try {
            const res = await fetch(`${API_URL}/analyze/pcap`, {
                method: 'POST',
                body: formData
                // Content-Type header not set manually for FormData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Simulation failed');
            }

            const data = await res.json();
            setResult(data);

            // Auto-start playback
            startPlayback(data.simulation.timeline);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startPlayback = (timeline, resumeFromIndex = 0) => {
        if (!timeline) return;

        setPlaybackStatus('PLAYING');
        let idx = resumeFromIndex;
        const total = timeline.length;

        const DURATION_MS = 5000;
        const INTERVAL_MS = 30;
        const totalTicks = DURATION_MS / INTERVAL_MS;
        const step = Math.max(1, Math.ceil(total / totalTicks));

        // Clear any existing timer
        if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);

        playbackTimerRef.current = setInterval(() => {
            // Check if we reached the end
            if (idx >= total) {
                stopPlayback();
                setPlaybackStatus('FINISHED');
                setPlaybackIndex(total);
                return;
            }

            const nextIdx = Math.min(idx + step, total);
            setPlaybackIndex(nextIdx);

            // Visualization Logic (Sampling)
            let packetToShow = null;
            if (total > 1000) {
                const packetsInBatch = nextIdx - idx;
                const probability = packetsInBatch / 75;
                if (Math.random() < probability) {
                    const batch = timeline.slice(idx, nextIdx);
                    if (batch.length > 0) {
                        packetToShow = batch[Math.floor(Math.random() * batch.length)];
                    }
                }
            } else {
                packetToShow = timeline[idx];
            }

            if (packetToShow) {
                setCurrentPacket(packetToShow);
            }

            idx = nextIdx;
        }, INTERVAL_MS);
    };

    const pausePlayback = () => {
        if (playbackTimerRef.current) {
            clearInterval(playbackTimerRef.current);
            playbackTimerRef.current = null;
        }
        setPlaybackStatus('PAUSED');
        setCurrentPacket(null);
    };

    const resumePlayback = () => {
        if (result && result.simulation.timeline) {
            startPlayback(result.simulation.timeline, playbackIndex);
        }
    };

    const stopPlayback = () => {
        if (playbackTimerRef.current) {
            clearInterval(playbackTimerRef.current);
            playbackTimerRef.current = null;
        }
        setPlaybackStatus('IDLE');
        setPlaybackIndex(0);
        setCurrentPacket(null);
    };

    const handleExport = async (format) => {
        if (!result || !result.report) return;

        try {
            const res = await fetch(`${API_URL}/report/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    report: result.report,
                    format: format
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Export failed');
            }

            // Trigger download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${Date.now()}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error("Export Error:", err);
            setError(`Export failed: ${err.message}`);
        }
    };

    // Optimized Stats Calculation
    const [cumulativeStats, setCumulativeStats] = useState([]);

    // Pre-calculate stats when result changes (O(N) once, instead of O(N) every frame)
    useEffect(() => {
        if (!result?.simulation?.timeline) return;

        const timeline = result.simulation.timeline;
        const stats = [];
        let denied = 0;
        let alerted = 0;

        timeline.forEach(event => {
            if (event.action === 'DENY') denied++;
            if (event.action === 'ALERT') alerted++;
            stats.push({ denied, alerted });
        });

        setCumulativeStats(stats);
    }, [result]);

    // O(1) Lookup during playback
    const currentStats = (playbackIndex > 0 && cumulativeStats[playbackIndex - 1])
        ? cumulativeStats[playbackIndex - 1]
        : { denied: 0, alerted: 0 };

    const displayStats = result ? {
        total: playbackIndex,
        denied: currentStats.denied,
        alerted: currentStats.alerted
    } : null;

    // Optimized Table Rendering (Virtualization-ish)
    // Only show the last 100 packets relative to the playback head
    // This prevents rendering 10,000 rows which freezes the DOM
    const VISIBLE_WINDOW = 100;
    const startIndex = Math.max(0, playbackIndex - VISIBLE_WINDOW);
    const visibleEvents = result
        ? result.simulation.timeline.slice(startIndex, playbackIndex).reverse()
        : [];

    return (
        <div className="space-y-8">
            {/* Control Panel */}
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center">

                {file ? (
                    <div className="mb-6 bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h4 className="text-sm font-bold text-green-400 mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    File Selected
                                </h4>
                                <p className="font-mono text-sm text-slate-300">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                            </div>
                            <button
                                onClick={handleRemoveFile} // Allow clearing selected file
                                className="text-red-400 hover:text-red-300 text-sm font-bold border border-red-500/30 bg-red-500/10 px-4 py-2 rounded hover:bg-red-500/20 transition-colors"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                        <h4 className="text-sm font-bold text-slate-400 mb-1">No Capture Loaded</h4>
                        <p className="text-xs text-slate-500">Upload a .pcap file to begin simulation</p>
                    </div>
                )}
                <label className="block text-slate-300 font-bold mb-2">Upload Network Capture
                    <input
                        type="file"
                        accept=".pcap,.pcapng,.cap"
                        onChange={e => handleFileSelect(e.target.files[0])}
                        className="block w-full text-slate-400
                            file:mr-4 file:py-3 file:px-6
                            file:rounded-full file:border-0
                            file:text-sm file:font-bold
                            file:bg-blue-600 file:text-white
                            hover:file:bg-blue-500 cursor-pointer"
                    />
                </label>


                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleRunSimulation}
                        disabled={!file || loading}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg text-white transition-all ${!file || loading
                            ? 'bg-slate-700 cursor-not-allowed text-slate-500'
                            : 'bg-green-600 hover:bg-green-500 shadow-lg hover:shadow-green-500/20'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {result ? 'Re-Analyzing...' : 'Run Analysis'}
                            </span>
                        ) : (result ? 'Restart Analysis' : 'Run Simulation')}
                    </button>

                    {/* Playback Controls (Visible only when results exist) */}
                    {result && !loading && (
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex gap-2">
                                {playbackStatus === 'PLAYING' ? (
                                    <button onClick={pausePlayback} className="px-6 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold transition-all shadow-lg hover:shadow-yellow-500/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button onClick={resumePlayback} disabled={playbackStatus === 'FINISHED'} className="px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                )}

                                <button onClick={stopPlayback} className="px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg hover:shadow-red-500/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Export Buttons */}
                            <div className="flex gap-2">
                                <button onClick={() => handleExport('pdf')} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded border border-slate-600">Export PDF</button>
                                <button onClick={() => handleExport('csv')} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded border border-slate-600">Export CSV</button>
                                <button onClick={() => handleExport('json')} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded border border-slate-600">Export JSON</button>
                            </div>
                        </div>

                    )}
                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Results View */}
            {result && (
                <div className="space-y-6 animate-fade-in-up">
                    {/* Summary Cards (Live Updating) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <h4 className="text-slate-400 text-sm font-bold uppercase">Processed Packets</h4>
                            <p className="text-2xl text-white font-mono">{displayStats.total} <span className="text-sm text-slate-500">/ {result.report.overview.total_packets}</span></p>
                        </div>
                        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                            <h4 className="text-red-400 text-sm font-bold uppercase">Threats Blocked</h4>
                            <p className="text-2xl text-red-500 font-mono">{displayStats.denied}</p>
                        </div>
                        <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                            <h4 className="text-yellow-400 text-sm font-bold uppercase">Alerts Triggered</h4>
                            <p className="text-2xl text-yellow-500 font-mono">{displayStats.alerted}</p>
                        </div>
                        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                            <h4 className="text-blue-400 text-sm font-bold uppercase">Max Severity</h4>
                            <p className="text-2xl text-blue-500 font-bold">{result.report.overview.highest_severity}</p>
                        </div>
                    </div>

                    {/* Threat Assessment */}
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-2">Engine Assessment</h3>
                        <p className="text-slate-300 leading-relaxed font-mono text-sm">
                            {result.report.assessment}
                        </p>
                    </div>

                    {/* Packet Flow Visualization */}
                    <PacketVisualizer currentPacket={currentPacket} />

                    {/* Timeline (Live Updating) */}
                    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                        <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-white">Traffic Analysis Timeline</h3>
                            <span className="text-xs text-slate-400 font-mono uppercase bg-slate-800 px-2 py-1 rounded border border-slate-700">
                                {playbackIndex < result.simulation.timeline.length ? '● LIVE PLAYBACK' : '✓ COMPLETE'}
                                <span className="ml-2 text-slate-500">(Showing last {VISIBLE_WINDOW})</span>
                            </span>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto" ref={el => el && el.scrollTo(0, 0)}>
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-900 sticky top-0">
                                    <tr>
                                        <th className="p-3">Time</th>
                                        <th className="p-3">Source</th>
                                        <th className="p-3">Destination</th>
                                        <th className="p-3">Proto</th>
                                        <th className="p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 font-mono">
                                    {visibleEvents.map((event, idx) => (
                                        // Key needs to be unique. Using index in visible window + start index usually
                                        // But event object ideally has id. If not, fallback to something unique.
                                        // Assuming event object doesn't have unique ID, we can us start index + idx
                                        <tr key={startIndex + idx} className={`hover:bg-slate-700/50 ${event.action === 'DENY' ? 'bg-red-500/10' :
                                            event.action === 'ALERT' ? 'bg-yellow-500/10' : ''
                                            } animate-fade-in`}>
                                            <td className="p-3">{new Date(event.timestamp * 1000).toLocaleTimeString()}</td>
                                            <td className="p-3">{event.src_ip}</td>
                                            <td className="p-3">{event.dst_ip}:{event.dst_port}</td>
                                            <td className="p-3">{event.protocol}</td>
                                            <td className="p-3">
                                                <span className={`font-bold ${event.action === 'DENY' ? 'text-red-500' :
                                                    event.action === 'ALERT' ? 'text-yellow-500' : 'text-green-500'
                                                    }`}>
                                                    {event.action}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
