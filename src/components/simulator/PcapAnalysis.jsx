import React from 'react';

export default function PcapAnalysis({
    pcapFile,
    isAnalyzing,
    analysisResults,
    handleFileUpload,
    analyzePCAP
}) {
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">PCAP File Analysis</h2>

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 mb-8 text-center">
                <div className="mb-6">
                    <i className="fas fa-file-upload text-5xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl font-medium text-slate-300">Upload PCAP File</h3>
                    <p className="text-slate-500 mt-2 text-sm">Supported formats: .pcap, .pcapng</p>
                </div>

                <div className="flex justify-center gap-4 items-center">
                    <input
                        type="file"
                        accept=".pcap,.pcapng"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            cursor-pointer max-w-xs"
                    />
                    <button
                        onClick={analyzePCAP}
                        disabled={!pcapFile || isAnalyzing}
                        className={`px-6 py-2 rounded-lg font-bold transition-all ${!pcapFile || isAnalyzing
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            }`}
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze File'}
                    </button>
                </div>
            </div>

            {isAnalyzing && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-blue-400">Processing packets and identifying threats...</p>
                </div>
            )}

            {!isAnalyzing && analysisResults.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-300">Analysis Results</h3>
                    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-800 text-slate-400 font-mono uppercase">
                                    <tr>
                                        <th className="p-4">Timestamp</th>
                                        <th className="p-4">Source</th>
                                        <th className="p-4">Destination</th>
                                        <th className="p-4">Protocol</th>
                                        <th className="p-4">Port</th>
                                        <th className="p-4">Payload Snippet</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 font-mono">
                                    {analysisResults.map((packet) => (
                                        <tr key={packet.id} className={`hover:bg-slate-800/50 transition-colors ${packet.status === 'Malicious' ? 'bg-red-500/5' : ''
                                            }`}>
                                            <td className="p-4 text-slate-400">{packet.timestamp}</td>
                                            <td className="p-4">{packet.source}</td>
                                            <td className="p-4">{packet.destination}</td>
                                            <td className="p-4">{packet.protocol}</td>
                                            <td className="p-4">{packet.port}</td>
                                            <td className="p-4 text-slate-500 truncate max-w-xs">{packet.payload}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${packet.status === 'Malicious'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {packet.status}
                                                </span>
                                                {packet.status === 'Malicious' && (
                                                    <div className="text-xs text-red-400 mt-1">{packet.reason}</div>
                                                )}
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
