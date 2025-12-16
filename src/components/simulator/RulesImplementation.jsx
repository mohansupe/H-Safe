import React from 'react';

export default function RulesImplementation({
    logs,
    rules,
    isSimulating,
    setIsSimulating,
    handleDeleteRule,
    formatRuleCondition
}) {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-blue-300">Live Traffic Monitor</h2>
                <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${isSimulating
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                        }`}
                >
                    {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden h-[500px] flex flex-col">
                        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 font-mono text-sm text-slate-400 grid grid-cols-12 gap-2">
                            <div className="col-span-2">Time</div>
                            <div className="col-span-3">Source</div>
                            <div className="col-span-3">Destination</div>
                            <div className="col-span-1">Proto</div>
                            <div className="col-span-3">Status</div>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-1 font-mono text-sm">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className={`grid grid-cols-12 gap-2 px-2 py-1 rounded ${log.alert
                                        ? 'bg-red-500/10 text-red-300 border-l-2 border-red-500'
                                        : 'text-green-500/10 text-green-300 border-l-2 border-green-500'
                                        }`}
                                >
                                    <div className="col-span-2 text-xs opacity-70">{log.timestamp}</div>
                                    <div className="col-span-3">{log.source_ip}</div>
                                    <div className="col-span-3">{log.destination_ip}</div>
                                    <div className="col-span-1">{log.protocol}</div>
                                    <div className="col-span-3 truncate" title={log.status}>{log.status}</div>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="text-center text-slate-500 mt-20">
                                    No traffic logs. Start simulation to see activity.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 h-[500px] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4 text-slate-300 sticky top-0 bg-slate-900 pb-2 border-b border-slate-700">Active Rules</h3>
                    <div className="space-y-3">
                        {rules.map((rule) => (
                            <div key={rule.id} className="bg-slate-800 p-3 rounded border border-slate-700 text-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-blue-400">{rule.name}</span>
                                    <div className="flex gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded ${rule.action === 'Reject' || rule.action === 'Block' ? 'bg-red-500/20 text-red-400' :
                                            rule.action === 'Allow' ? 'bg-green-500/20 text-green-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>{rule.action}</span>
                                        <button
                                            onClick={() => handleDeleteRule(rule.id)}
                                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                            title="Delete Rule"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                                <div className="text-slate-400 text-xs">
                                    {rule.type}: <span className="text-slate-200">{formatRuleCondition(rule)}</span>
                                </div>
                            </div>
                        ))}
                        {rules.length === 0 && (
                            <div className="text-center text-slate-500 italic">No active rules</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
