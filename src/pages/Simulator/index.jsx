import React, { useState } from 'react';
import RuleManager from './components/RuleManager';
import SimulationDashboard from './components/SimulationDashboard';
import TopologyBuilder from './components/TopologyBuilder';

export default function Simulator() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="bg-slate-950 min-h-full">
            <div className="container mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">H-SAFE Simulator Engine</h1>
                    <p className="text-slate-400">
                        Manage your firewall policy, test against PCAP traffic, and design network topologies.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-800 mb-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-4 font-bold transition-all ${activeTab === 'dashboard'
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Simulation Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('rules')}
                        className={`px-6 py-4 font-bold transition-all ${activeTab === 'rules'
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Rule Management
                    </button>
                    <button
                        onClick={() => setActiveTab('topology')}
                        className={`px-6 py-4 font-bold transition-all ${activeTab === 'topology'
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Topology Builder
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                    {activeTab === 'dashboard' && <SimulationDashboard />}
                    {activeTab === 'rules' && <RuleManager />}
                    {activeTab === 'topology' && <TopologyBuilder />}
                </div>
            </div>
        </div>
    );
}
