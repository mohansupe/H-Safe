import React from 'react';

export default function RulesAddition({ newRule, setNewRule, handleAddRule }) {
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">Create Security Rule</h2>
            <form className="space-y-6 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Rule Name</label>
                    <input
                        type="text"
                        required
                        value={newRule.name}
                        onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="e.g., Block Malicious IP"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Rule Type</label>
                        <select
                            value={newRule.type}
                            onChange={e => setNewRule({ ...newRule, type: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="IP">IP Address</option>
                            <option value="Protocol">Protocol</option>
                            <option value="Port">Port</option>
                            <option value="Signature">Signature</option>
                        </select>
                    </div>
                </div>

                {newRule.type === 'IP' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Source IP (Optional)</label>
                            <input
                                type="text"
                                value={newRule.source_ip}
                                onChange={e => setNewRule({ ...newRule, source_ip: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g., 192.168.1.1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Destination IP (Optional)</label>
                            <input
                                type="text"
                                value={newRule.destination_ip}
                                onChange={e => setNewRule({ ...newRule, destination_ip: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g., 10.0.0.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Port (Optional)</label>
                            <input
                                type="text"
                                value={newRule.port}
                                onChange={e => setNewRule({ ...newRule, port: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g., 80"
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Condition (Value)</label>
                        <input
                            type="text"
                            required
                            value={newRule.condition}
                            onChange={e => setNewRule({ ...newRule, condition: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder={
                                newRule.type === 'Port' ? '8080' :
                                    newRule.type === 'Protocol' ? 'TCP' : 'Signature pattern'
                            }
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={(e) => handleAddRule(e, 'Allow')}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-1"
                    >
                        Allow (Add)
                    </button>
                    <button
                        onClick={(e) => handleAddRule(e, 'Reject')}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-1"
                    >
                        Reject (Decline)
                    </button>
                </div>
            </form>
        </div>
    );
}
