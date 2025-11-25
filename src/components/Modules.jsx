import React, { useState } from 'react'

const modules = [
    {
        title: "Rules Addition",
        shortDesc: "Create and add custom security rules to monitor network traffic.",
        fullDesc: "This module allows administrators to create and add custom security rules to monitor network traffic. Users can define conditions such as IP ranges, protocols, ports, signatures, or suspicious behavior patterns. The rules act as the first layer of defense by specifying what type of activity should be flagged, logged, or blocked."
    },
    {
        title: "Rules Implementation",
        shortDesc: "Apply rules to the network monitoring engine to inspect traffic in real time.",
        fullDesc: "Once rules are created, this module applies them to the network monitoring engine. The implemented rules actively inspect incoming and outgoing traffic in real time. This ensures that any event matching the defined rule triggers alerts, prevents attacks, or generates logs for further analysis."
    },
    {
        title: "PCAP File Analysis",
        shortDesc: "Analyze Packet Capture (PCAP) files to identify malicious packets and anomalies.",
        fullDesc: "This module analyzes Packet Capture (PCAP) files to identify malicious packets, anomalies, or suspicious communication. It extracts details such as source/destination IPs, ports, protocols, payload data, timestamps, and intrusion signatures. This is useful for offline investigation, training datasets, and forensic analysis."
    },
    {
        title: "Network Topology Simulation",
        shortDesc: "Visually simulate a virtual network environment with nodes and connections.",
        fullDesc: "This module visually simulates a virtual network environment. Users can create nodes (servers, routers, switches, IoT devices) and map connections between them. It helps in understanding how traffic flows, how attacks spread, and where security rules should be deployed. Great for planning, testing, and educational demonstrations."
    },
    {
        title: "Post-Attack Analysis",
        shortDesc: "Detailed insights and timeline of events after an attack is detected.",
        fullDesc: "This module provides detailed insights after an attack is detected. It shows the timeline of events, affected nodes, attack vector, exploited vulnerabilities, and impact assessment. The module helps identify root causes, improve rules, strengthen configurations, and update future defensive strategies."
    }
]

export default function Modules() {
    const [selectedModule, setSelectedModule] = useState(null);

    return (
        <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
            <style>{`
        .module-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%);
          border: 1px solid rgba(100, 116, 139, 0.2);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          cursor: pointer;
        }

        .module-card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%);
        }

        .module-title {
          color: #f1f5f9;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 1.125rem;
        }

        .module-desc {
          color: #cbd5e1;
          font-size: 0.875rem;
        }
      `}</style>
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-2">Core Modules</h2>
                    <p className="text-slate-400">Comprehensive tools for network security management and analysis.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((mod, index) => (
                        <div key={index} className="module-card group" onClick={() => setSelectedModule(mod)}>
                            <h3 className="module-title group-hover:text-blue-400 transition-colors">{mod.title}</h3>
                            <p className="module-desc">{mod.shortDesc}</p>
                            <div className="mt-4 text-blue-500 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <span>Learn more</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedModule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedModule(null)}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedModule(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-3xl font-bold text-white mb-6 border-b border-slate-800 pb-4">{selectedModule.title}</h2>
                        <div className="text-slate-300 leading-relaxed space-y-4">
                            <p>{selectedModule.fullDesc}</p>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setSelectedModule(null)}
                                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
